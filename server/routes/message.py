import os
import tempfile
from fastapi import APIRouter, HTTPException, Request, UploadFile, File, Form, Response
from fastapi.responses import JSONResponse
from config.settings import Settings
from models.models import Conversation, Message, MessageContent
from datetime import datetime
from openai import AzureOpenAI
from bson.objectid import ObjectId
from database.db import fs

router = APIRouter()
settings = Settings()

# Initialize Azure OpenAI clients
s_client = AzureOpenAI(
    azure_endpoint=settings.AZURE_OPENAI_SPEECH_ENDPOINT,
    api_key=settings.AZURE_OPENAI_KEY,
    api_version="2024-06-01",
)

v_client = AzureOpenAI(
    azure_endpoint=settings.AZURE_OPENAI_VOICE_ENDPOINT,
    api_key=settings.AZURE_OPENAI_KEY,
    api_version="2024-05-01-preview",
)

t_client = AzureOpenAI(
    azure_endpoint=settings.AZURE_OPENAI_TEXT_ENDPOINT,
    api_key=settings.AZURE_OPENAI_KEY,
    api_version="2024-08-01-preview",
)

openai_stt_client = s_client
openai_ttt_client = t_client
openai_tts_client = v_client


async def upload_to_gridfs(file_content: bytes, filename: str):
    file_id = await fs.upload_from_stream(filename, file_content)
    return str(file_id)


def get_file_url(request: Request, file_id: str):
    return str(request.url_for("get_audio", file_id=file_id))


@router.post("/messages")
async def create_message(
    request: Request,
    conversation_id: str = Form(...),
    from_user: str = Form(...),
    to: str = Form(...),
    audio: UploadFile = File(...),
    
):
    try:
        # Check if conversation exists
        conversation = await Conversation.get(conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        # Validate participants
        participants = [p.user_id for p in conversation.participants]
        if from_user not in participants or to not in participants:
            raise HTTPException(
                status_code=400,
                detail="Sender or recipient is not a participant in this conversation",
            )

        # Step 1: Upload audio to GridFS
        audio_content = await audio.read()
        audio_filename = f"{datetime.utcnow().timestamp()}_{audio.filename}"
        file_id = await upload_to_gridfs(audio_content, audio_filename)
        audio_url = get_file_url(request, file_id)

        print(f"Audio uploaded. Access URL: {audio_url}")

        # Step 2: Transcribe using Whisper (from a temp file)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
            temp_audio.write(audio_content)
            temp_audio_path = temp_audio.name

        print(f"Transcription process started...")

        # Open the temporary file for Whisper transcription
        with open(temp_audio_path, "rb") as audio_file:
            transcript = openai_stt_client.audio.transcriptions.create(
                model="whisper", file=audio_file, response_format="text"
            )

        print(f"Transcription successful! Transcript: {transcript}")
        transcribed_text = transcript

        # Clean up: delete the temporary file
        os.remove(temp_audio_path)

        # Step 3: Create the message in the database
        new_message = Message(
            conversation_id=conversation_id,
            sender_id=from_user,
            is_ai_message=False,
            content=MessageContent(
                transcription=transcribed_text,
                audio_url=audio_url,
                duration=0.0,  # Placeholder for audio duration
            ),
        )
        await new_message.insert()

        # Update conversation's last_message_at
        conversation.last_message_at = datetime.utcnow()
        await conversation.save()

        response_data = {
            "message_id": str(new_message.id),
            "transcribed_text": transcribed_text,
            "audio_url": audio_url,
        }

        return JSONResponse(response_data)

    except Exception as e:
        print(f"Error in create_message: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.post("/messages-ai")
async def create_ai_message(
    request: Request,
    conversation_id: str = Form(...),
    from_user: str = Form(...),
    audio: UploadFile = File(...),
):
    try:
        # Check if conversation exists
        conversation = await Conversation.get(conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        # Validate participant
        participants = [p.user_id for p in conversation.participants]
        if from_user not in participants:
            raise HTTPException(
                status_code=400,
                detail="Sender is not a participant in this conversation",
            )

        # Step 1: Upload audio to GridFS
        audio_content = await audio.read()
        audio_filename = f"{datetime.utcnow().timestamp()}_{audio.filename}"
        file_id = await upload_to_gridfs(audio_content, audio_filename)
        audio_url = get_file_url(request, file_id)

        print(f"Audio uploaded. Access URL: {audio_url}")

        # Step 2: Transcribe using Whisper
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
            temp_audio.write(audio_content)
            temp_audio_path = temp_audio.name

        print("Transcription process started...")

        try:
            with open(temp_audio_path, "rb") as audio_file:
                transcript = openai_stt_client.audio.transcriptions.create(
                    model="whisper", file=audio_file, response_format="text"
                )
            print(f"Transcription successful! Transcript: {transcript}")
            transcribed_text = transcript
        except Exception as e:
            print(f"Transcription failed: {str(e)}")
            raise HTTPException(status_code=500, detail="Transcription failed")

        # Clean up: delete the temporary file
        os.remove(temp_audio_path)

        # Step 3: Send transcribed text to AI model for response
        nlu_prompt = f"""Analyze the following text and provide a brief, natural-sounding response:
        User said: "{transcribed_text}"
        Consider the context, sentiment, and any implicit questions or requests.
        Provide a response that addresses the user's input in a conversational manner.
        Keep the response concise and suitable for text-to-speech conversion.
        """

        try:
            nlu_response = openai_ttt_client.chat.completions.create(
                model="gpt-35-turbo-16k",  # Ensure this matches your deployment name
                messages=[
                    {
                        "role": "system",
                        "content": "You are an AI assistant engaged in a conversation. Provide helpful and concise responses.",
                    },
                    {"role": "user", "content": nlu_prompt},
                ],
                temperature=0.3,
            )
            ai_text_response = nlu_response.choices[0].message.content.strip()
            print(f"AI response generated: {ai_text_response}")
        except Exception as e:
            print(f"AI response generation failed: {str(e)}")
            raise HTTPException(status_code=500, detail="AI response generation failed")

        # Step 4: Convert AI text response to speech
        try:
            audio_response = openai_tts_client.audio.speech.create(
                model="tts", voice="alloy", input=ai_text_response
            )
            print("Text-to-speech conversion successful")
        except Exception as e:
            print(f"Text-to-speech conversion failed: {str(e)}")
            raise HTTPException(
                status_code=500, detail="Text-to-speech conversion failed"
            )

        # Step 5: Save AI audio response to GridFS
        ai_audio_filename = f"ai_response_{datetime.utcnow().timestamp()}.mp3"
        ai_file_id = await upload_to_gridfs(audio_response.content, ai_audio_filename)
        ai_audio_url = get_file_url(request, ai_file_id)

        # Calculate audio duration (this is a placeholder - replace with actual duration calculation)
        human_audio_duration = 0.0  # Replace with actual duration calculation
        ai_audio_duration = 0.0  # Replace with actual duration calculation

        # Step 6: Create the human message in the database
        human_message = Message(
            conversation_id=conversation_id,
            sender_id=from_user,
            is_ai_message=False,
            content=MessageContent(
                transcription=transcribed_text,
                audio_url=audio_url,
                duration=human_audio_duration,
            ),
        )
        await human_message.insert()
        print(f"Human message created. Message ID: {human_message.id}")

        # Step 7: Create the AI message in the database
        ai_message = Message(
            conversation_id=conversation_id,
            sender_id="AI",
            is_ai_message=True,
            content=MessageContent(
                transcription=ai_text_response,
                audio_url=ai_audio_url,
                duration=ai_audio_duration,
            ),
        )
        await ai_message.insert()
        print(f"AI message created. Message ID: {ai_message.id}")

        # Update conversation's last_message_at
        conversation.last_message_at = datetime.utcnow()
        await conversation.save()

        response_data = {
            "human_message_id": str(human_message.id),
            "ai_message_id": str(ai_message.id),
            "human_transcribed_text": transcribed_text,
            "human_audio_url": audio_url,
            "ai_text_response": ai_text_response,
            "ai_audio_url": ai_audio_url,
        }

        return JSONResponse(response_data)

    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        print(f"Unexpected error in create_ai_message: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")


@router.get("/audio/{file_id}")
async def get_audio(file_id: str):
    try:
        print(f"Fetching file with ID: {file_id}")
        file_id = ObjectId(file_id)  
        grid_out = await fs.open_download_stream(file_id)
        contents = await grid_out.read()
        print(f"File found and read: {file_id}")
        return Response(content=contents, media_type="audio/mpeg")
    except Exception as e:
        print(f"Error fetching file: {str(e)}")
        raise HTTPException(status_code=404, detail="File not found")

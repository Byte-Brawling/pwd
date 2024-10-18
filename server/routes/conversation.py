# === File: server/routes/conversation.py ===
import base64
import tempfile
from fastapi import APIRouter, HTTPException, Request, UploadFile, File
from fastapi.responses import JSONResponse


router = APIRouter()


@router.post("/conversation")
async def process_conversation(
    request: Request,
    audio: UploadFile = File(...),
):
    openai_tts_client = request.app.state.v_openai_client
    openai_stt_client = request.app.state.s_openai_client
    openai_ttt_client = request.app.state.t_openai_client

    try:
        # Print information about the uploaded file
        print(f"Uploaded file: {audio.filename}")
        print(f"Content type: {audio.content_type}")

        # Step 1: Speech-to-Text
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
            content = await audio.read()
            temp_audio.write(content)
            temp_audio_path = temp_audio.name

        # Open the temporary file and send it to the Whisper model
        with open(temp_audio_path, "rb") as audio_file:
            transcript = openai_stt_client.audio.transcriptions.create(
                model="whisper",
                file=audio_file,
                response_format="text",
            )

        transcribed_text = transcript

        # Print transcribed text for debugging
        print(f"Transcribed text: {transcribed_text}")

        # Step 2: Natural Language Understanding
        nlu_prompt = f"""Analyze the following text and provide a brief, natural-sounding response:
        User said: "{transcribed_text}"
        Consider the context, sentiment, and any implicit questions or requests.
        Provide a response that addresses the user's input in a conversational manner.
        Keep the response concise and suitable for text-to-speech conversion.
        """

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
        response_text = nlu_response.choices[0].message.content.strip()

        # Print response text for debugging
        print(f"Response text: {response_text}")

        # Step 3: Text-to-Speech
        tts_response = openai_tts_client.audio.speech.create(
            model="tts-1",
            voice="alloy",
            input=response_text,
        )
        audio_data = tts_response.read()
        encoded_audio = base64.b64encode(audio_data).decode("utf-8")

        # Return the audio response
        # return Response(content=audio_data, media_type="audio/mpeg")
        return JSONResponse(
            {
                "transcribed_text": transcribed_text,
                "response_text": response_text,
                "encoded_audio": encoded_audio,
            }
        )

    except Exception as e:
        # Log the full error for debugging
        print(f"Error in process_conversation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

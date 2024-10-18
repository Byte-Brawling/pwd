from fastapi import APIRouter, HTTPException, UploadFile, File, Request
from pydantic import BaseModel
import tempfile
import os

router = APIRouter()


class TranscriptionResult(BaseModel):
    text: str



@router.post("/stt", response_model=TranscriptionResult)
async def speech_to_text(request: Request, audio: UploadFile = File(...)):
    client = request.app.state.s_openai_client

    try:
        # Create a temporary file to store the uploaded audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
            content = await audio.read()
            temp_audio.write(content)
            temp_audio_path = temp_audio.name

        # Open the temporary file and send it to the Whisper model
        with open(temp_audio_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper",  
                file=audio_file,
                response_format="text",
            )

        return {"text": transcript}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # Clean up the temporary file
        if "temp_audio_path" in locals():
            os.unlink(temp_audio_path)




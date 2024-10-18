from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import Response
from pydantic import BaseModel, Field
from enum import Enum

router = APIRouter()


class Voice(str, Enum):
    NOVA = "nova"
    SHIMMER = "shimmer"
    ECHO = "echo"
    ONYX = "onyx"
    FABLE = "fable"
    ALLOY = "alloy"


class TTSRequest(BaseModel):
    input: str = Field(None, alias="text")
    voice: Voice = Voice.ALLOY

    class Config:
        allow_population_by_field_name = True
        use_enum_values = True


@router.post("/tts")
def text_to_speech(request: Request, tts_request: TTSRequest):
    openai_client = request.app.state.v_openai_client

    try:
        # Use 'input' if it's provided, otherwise use 'text'
        text_input = tts_request.input or tts_request.dict().get("text")

        if not text_input:
            raise HTTPException(
                status_code=400, detail="No text provided for speech synthesis"
            )

        response =  openai_client.audio.speech.create(
            model="tts-1",  # Make sure this matches your Azure OpenAI deployment name for TTS
            voice=tts_request.voice,
            input=text_input,
        )

        # The response should be the audio data
        audio_data =  response.read()

        # Return the binary audio data
        return Response(content=audio_data, media_type="audio/webm")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

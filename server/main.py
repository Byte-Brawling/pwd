import os
from fastapi import FastAPI
from openai import AzureOpenAI
from dotenv import load_dotenv

from routes import conversation

load_dotenv()

app = FastAPI()

# Initialize Azure OpenAI client
s_client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_SPEECH_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2024-06-01",
)

v_client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_VOICE_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2024-05-01-preview",
)
t_client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_TEXT_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2024-08-01-preview",
)

# Add client to app state
app.state.s_openai_client = s_client
app.state.v_openai_client = v_client
app.state.t_openai_client = t_client

app.include_router(conversation.router)

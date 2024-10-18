# === File: server/main.py ===
from contextlib import asynccontextmanager
import os
from fastapi import FastAPI
from openai import AzureOpenAI
from dotenv import load_dotenv
from routes import conversation, conversations, message, user_route
from starlette.middleware.cors import CORSMiddleware
from database.db import database

load_dotenv()  # Load environment variables


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing database...")
    await database.init_db()
    print("Database initialized")
    yield


app = FastAPI(lifespan=lifespan)

# Initialize Azure OpenAI clients
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

# Add clients to app state
app.state.s_openai_client = s_client
app.state.v_openai_client = v_client
app.state.t_openai_client = t_client

# Include conversation router
app.include_router(conversation.router)
app.include_router(user_route.router)
app.include_router(message.router)
app.include_router(conversations.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

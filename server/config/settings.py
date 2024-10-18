import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    db_uri: str = os.getenv("DB_URI")
    db_name: str = "voicey"
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    AZURE_OPENAI_SPEECH_ENDPOINT: str = os.getenv("AZURE_OPENAI_SPEECH_ENDPOINT")
    AZURE_OPENAI_KEY: str = os.getenv("AZURE_OPENAI_KEY")
    AZURE_OPENAI_TEXT_ENDPOINT: str = os.getenv("AZURE_OPENAI_TEXT_ENDPOINT")
    AZURE_OPENAI_VOICE_ENDPOINT: str = os.getenv("AZURE_OPENAI_VOICE_ENDPOINT")


print(f"Type of db_uri: {type(Settings().db_uri)}")

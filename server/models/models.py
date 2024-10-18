from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from beanie import Document, Indexed


class User(Document):
    email: EmailStr = Field(index=True, unique=True)
    full_name: str
    avatar: Optional[str] = None
    preferred_voice: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    conversations: List[str] = Field(default_factory=list)  # List of conversation IDs

    class Settings:
        name = "users"


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    avatar: Optional[str] = None
    preferred_voice: Optional[str] = None
    last_login: datetime = Field(default_factory=datetime.utcnow)


class Participant(BaseModel):
    user_id: str
    is_ai: bool = False


class Conversation(Document):
    title: Optional[str] = None
    type: str  # "human-to-human" or "human-to-ai"
    participants: List[Participant]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_message_at: Optional[datetime] = None
    messages: List[str] = Field(default_factory=list)  # List of message IDs

    class Settings:
        name = "conversations"


class MessageContent(BaseModel):
    transcription: str
    audio_url: str
    duration: float


class Message(Document):
    conversation_id: str = Field(index=True)
    sender_id: str = Field(index=True)
    is_ai_message: bool = False
    content: MessageContent
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "messages"


class AudioFile(Document):
    message_id: str = Field(index=True)
    user_id: str = Field(index=True)
    url: str
    duration: float
    mime_type: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    transcription: str

    class Settings:
        name = "audiofiles"


class ConversationCreate(BaseModel):
    title: Optional[str] = None
    type: str  # "human-to-human" or "human-to-ai"
    participants: List[
        str
    ]  # List of user IDs, including AI user ID for human-to-ai conversations


class MessageCreate(BaseModel):
    conversation_id: str
    sender_id: str
    is_ai_message: bool = False
    transcription: str
    audio_url: str
    duration: float


class AudioFileCreate(BaseModel):
    message_id: str
    user_id: str
    url: str
    duration: float
    mime_type: str
    transcription: str

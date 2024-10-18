from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from models.models import Conversation, ConversationCreate, Participant
from datetime import datetime

router = APIRouter()



@router.post(
    "/conversations", status_code=status.HTTP_201_CREATED, response_model=Conversation
)
async def create_conversation(conversation_data: ConversationCreate):
    try:
        # Validate conversation type
        if conversation_data.type not in ["human-to-human", "human-to-ai"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid conversation type. Must be 'human-to-human' or 'human-to-ai'.",
            )

        # Validate participants
        if (
            conversation_data.type == "human-to-human"
            and len(conversation_data.participants) != 2
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Human-to-human conversations must have exactly two participants.",
            )
        elif (
            conversation_data.type == "human-to-ai"
            and len(conversation_data.participants) != 2
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Human-to-AI conversations must have exactly two participants (one human, one AI).",
            )

        # Validate title for human-to-ai conversations
        if conversation_data.type == "human-to-ai" and not conversation_data.title:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title is required for human-to-AI conversations.",
            )

        # Create participants list
        participants = []
        for user_id in conversation_data.participants:
            # Assume the last participant in a human-to-ai conversation is the AI
            is_ai = (
                conversation_data.type == "human-to-ai"
                and user_id == conversation_data.participants[-1]
            )
            participants.append(Participant(user_id=user_id, is_ai=is_ai))

        # Create new conversation
        new_conversation = Conversation(
            title=conversation_data.title,
            type=conversation_data.type,
            participants=participants,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            last_message_at=None,  # Will be updated when the first message is sent
        )

        # Save the conversation to the database
        await new_conversation.insert()

        return new_conversation

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the conversation: {str(e)}",
        )


# Additional route to get a conversation by ID
@router.get("/conversations/{conversation_id}", response_model=Conversation)
async def get_conversation(conversation_id: str):
    conversation = await Conversation.get(conversation_id)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found"
        )
    return conversation

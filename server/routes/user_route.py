from typing import List
from fastapi import APIRouter, HTTPException, status
from models.models import Conversation, User, UserCreate
from datetime import datetime

router = APIRouter()


@router.post("/register", status_code=status.HTTP_200_OK, response_model=User)
async def register_or_update_user(user_data: UserCreate):
    # Check if user already exists
    existing_user = await User.find_one({"email": user_data.email})

    if existing_user:
        # Update last_login for existing user
        update_data = {"last_login": datetime.utcnow()}

        # Update other fields if they are provided and different
        if user_data.full_name and user_data.full_name != existing_user.full_name:
            update_data["full_name"] = user_data.full_name
        if user_data.avatar and user_data.avatar != existing_user.avatar:
            update_data["avatar"] = user_data.avatar
        if (
            user_data.preferred_voice
            and user_data.preferred_voice != existing_user.preferred_voice
        ):
            update_data["preferred_voice"] = user_data.preferred_voice

        await existing_user.update({"$set": update_data})

        # Refresh the user object to get the updated data
        updated_user = await User.find_one({"email": user_data.email})
        return updated_user
    else:
        # Create new user
        new_user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            avatar=user_data.avatar,
            preferred_voice=user_data.preferred_voice,
            last_login=datetime.utcnow(),
        )
        # Save user to database
        await new_user.insert()
        return new_user


@router.get("/users", response_model=List[User])
async def get_all_users():
    users = await User.find_all().to_list()
    return users


@router.get("/friends/{user_id}", response_model=List[User])
async def get_user_friends(user_id: str):
    # First, get all conversations involving the user
    user_conversations = await Conversation.find({"participants": user_id}).to_list()

    # Extract all unique user IDs from these conversations
    friend_ids = set()
    for conversation in user_conversations:
        friend_ids.update(
            participant
            for participant in conversation.participants
            if participant != user_id
        )

    # Fetch and return the user objects for these friends
    friends = await User.find({"_id": {"$in": list(friend_ids)}}).to_list()
    return friends


@router.get("/users/{user_id}/conversations", response_model=List[Conversation])
async def get_user_conversations(user_id: str):
    # Verify that the user exists
    user = await User.find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Fetch all conversations where the user is a participant
    conversations = await Conversation.find({"participants": user_id}).to_list()
    return conversations

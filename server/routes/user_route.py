from fastapi import APIRouter, HTTPException, status
from models.models import User, UserCreate

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=User)
async def register_user(user_data: UserCreate):
    # Check if username or email already exists
    existing_user = await User.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Username or email already registered"
        )

    # Create user instance
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        avatar=user_data.avatar,
        preferred_voice=user_data.preferred_voice,
        last_login=user_data.last_login
        
    )

    # Save user to database
    await new_user.insert()

    # Remove password_hash from the returned user object
    new_user_dict = new_user.model_dump()

    return new_user_dict

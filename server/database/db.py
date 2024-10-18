from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from beanie import init_beanie
from models.models import User, AudioFile, Conversation, Message
from config.settings import Settings


class Database:
    def __init__(self, uri: str, database_name: str):
        self.client = AsyncIOMotorClient(uri)
        self.database = self.client[database_name]

    async def init_db(self):
        try:
            await init_beanie(
                database=self.database,
                document_models=[User, AudioFile, Conversation, Message],
            )
            print("Beanie initialized with MongoDB successfully")
        except Exception as e:
            print(f"Error initializing Beanie with MongoDB: {e}")
            raise

    async def close_connection(self):
        self.client.close()


# Initialize database
settings = Settings()
database = Database(uri=settings.db_uri, database_name=settings.db_name)
fs = AsyncIOMotorGridFSBucket(database.database)

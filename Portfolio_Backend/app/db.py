from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings
import logging

logger = logging.getLogger("db")

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db = MongoDB()

async def connect_to_mongo():
    url = settings.get_atlas_url
    try:
        db.client = AsyncIOMotorClient(
            url,
            serverSelectionTimeoutMS=4000,
            connectTimeoutMS=4000
        )
        db.db = db.client[settings.get_db_name]
    except Exception as e:
        logger.error(f"Failed to connect to Mongo: {e}")

async def close_mongo_connection():
    if db.client is not None:
        db.client.close()

def get_database():
    """Returns the MongoDB database instance with safe lazy initialization for serverless."""
    if db.client is None or db.db is None:
        url = settings.get_atlas_url
        try:
            db.client = AsyncIOMotorClient(
                url,
                serverSelectionTimeoutMS=4000,
                connectTimeoutMS=4000
            )
            db.db = db.client[settings.get_db_name]
        except Exception as e:
            logger.error(f"Lazy Mongo connection error: {e}")
            return None
    return db.db

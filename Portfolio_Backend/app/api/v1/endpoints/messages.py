from fastapi import APIRouter, Depends, HTTPException, Body, BackgroundTasks
from app.db import get_database

from app.api.v1.endpoints.portfolio import get_admin_user
from app.services.email_service import send_auto_reply
from datetime import datetime
import asyncio
import logging

router = APIRouter()
logger = logging.getLogger("portfolio-messages")

# Handle local message expiration (matches Node's 30s test logic)
# This mimics the mockMessages list from Node.
class MockMemory:
    temp_messages = {}

mock_memory_store = MockMemory()

async def expire_message(message_id: str):
    """Automatically removes message from memory after 30 seconds for specific tests."""
    await asyncio.sleep(30)
    if message_id in mock_memory_store.temp_messages:
        del mock_memory_store.temp_messages[message_id]
        logger.info(f"🔥 [TRIGGER] Message {message_id} expired & deleted after 30 seconds.")

@router.post("")
async def create_message(
    background_tasks: BackgroundTasks,
    msg: dict = Body(...), 
    db=Depends(get_database),
):
    """
    Submits a message and triggers background auto-replies.
    Replicates Node's messageController.js logic.
    """
    try:
        msg["created_at"] = datetime.utcnow().isoformat()
        msg_id = None
        
        # Save to real MongoDB
        if db is not None:
            mongo_msg = msg.copy()
            result = await db["messages"].insert_one(mongo_msg)
            msg_id = str(result.inserted_id)
            msg["_id"] = msg_id
            


        # Fallback if both DBs are missing/failed to generate id
        if not msg_id:
            # Generate a temporary mock ID if no database is connected
            import uuid
            msg_id = str(uuid.uuid4())
            msg["_id"] = msg_id
        
        # Simulating Node's 30-second local mock memory
        mock_memory_store.temp_messages[msg_id] = msg
        background_tasks.add_task(expire_message, msg_id)
        
        # Trigger EmailJS auto-reply in background (Fast API standard)
        background_tasks.add_task(
            send_auto_reply, 
            msg.get("email"), 
            msg.get("name"), 
            msg.get("phone", ""), 
            msg.get("query", "")
        )
        
        return {"success": True, "data": msg}
        
    except Exception as e:
        logger.error(f"Error in creating message: {e}")
        return {"error": "Failed to process message"}

@router.get("")
async def get_messages(
    auth=Depends(get_admin_user), 
    db=Depends(get_database),
):
    """Retrieve all messages (Protected)."""
    messages = []
    


    # Fallback to MongoDB
    if not messages and db is not None:
        cursor = db["messages"].find({}).sort("created_at", -1)
        async for m in cursor:
            m["_id"] = str(m["_id"])
            messages.append(m)
            
    return messages

@router.delete("/{message_id}")
async def delete_message(
    message_id: str, 
    auth=Depends(get_admin_user), 
    db=Depends(get_database),
):
    """Deletes a message from MongoDB and mock memory."""
    deleted_any = False
    
    # Delete from MongoDB
    if db is not None:
        from bson import ObjectId
        try:
            res = await db["messages"].delete_one({"_id": ObjectId(message_id)})
            if res.deleted_count > 0:
                deleted_any = True
        except Exception as e:
            logger.error(f"MongoDB delete message error: {e}")



    if message_id in mock_memory_store.temp_messages:
        del mock_memory_store.temp_messages[message_id]
        deleted_any = True

    return {"success": True, "message": "Message deletion process completed."}

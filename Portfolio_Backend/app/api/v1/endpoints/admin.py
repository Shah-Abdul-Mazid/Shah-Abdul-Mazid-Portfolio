import re
import asyncio
from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException
from jose import jwt
from datetime import datetime, timedelta
from app.db import get_database
from app.config import settings
from .portfolio import get_admin_user
import logging
import bcrypt

logger = logging.getLogger("admin-auth")
router = APIRouter()

# --- SCHEMAS FOR SWAGGER UI INPUT FIELDS ---
class AdminLoginRequest(BaseModel):
    email: str = Field(..., description="Administrator email address or username", example="admin@portfolio.com")
    password: str = Field(..., description="Administrator password", example="yourpassword")

class AdminRegisterRequest(BaseModel):
    email: str = Field(..., description="Administrator email address", example="admin@portfolio.com")
    password: str = Field(..., description="Administrator password (min 8 characters)", example="yourpassword")

# --- ROUTES: ADMIN AUTH ---
@router.post("/login")
async def login(
    credentials: AdminLoginRequest, 
    db=Depends(get_database),
):
    identifier = credentials.email.strip().lower()
    password = credentials.password
    
    if not identifier or not password:
        raise HTTPException(status_code=400, detail="Email/Username and password are required")
        
    if len(identifier) > 120 or len(password) > 128:
        raise HTTPException(status_code=401, detail="Invalid credential length")
        
    if db is None:
        raise HTTPException(
            status_code=503, 
            detail="Database connection is unavailable. Ensure ATLAS_URL is set in Vercel environment variables."
        )
        
    try:
        regex_prefix = f"^{re.escape(identifier)}@"
        admin = await asyncio.wait_for(
            db["admin_db"].find_one({
                "$or": [
                    {"email": {"$eq": identifier}},
                    {"username": {"$eq": identifier}},
                    {"email": {"$regex": regex_prefix, "$options": "i"}}
                ]
            }),
            timeout=4.0
        )
    except Exception as e:
        logger.error(f"Error querying admin_db: {e}")
        raise HTTPException(
            status_code=503, 
            detail="Database timeout. Please verify MongoDB Atlas connection."
        )
        
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid email/username or password")
        
    # Verify password using bcrypt directly
    password_bytes = password.encode('utf-8')
    stored_hash = admin.get("password", "")
    if not stored_hash or not isinstance(stored_hash, str):
        raise HTTPException(status_code=401, detail="Invalid password hash in database")
        
    hashed_bytes = stored_hash.encode('utf-8')
    
    try:
        valid_password = bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception as e:
        logger.error(f"bcrypt check error: {e}")
        valid_password = False
        
    if not valid_password:
        raise HTTPException(status_code=401, detail="Invalid email/username or password")
    
    expire_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    expire_time = datetime.utcnow() + expire_delta
    
    token = jwt.encode(
        {
            "id": str(admin["_id"]),
            "email": admin.get("email", identifier),
            "role": admin.get("role", "admin"),
            "exp": expire_time
        },
        settings.JWT_SECRET,
        algorithm="HS256"
    )
    
    return {
        "success": True, 
        "token": token, 
        "expires_in": int(expire_delta.total_seconds()),
        "admin": {"email": admin.get("email", identifier), "role": admin.get("role", "admin")}
    }

@router.post("/register")
async def register(
    data: AdminRegisterRequest, 
    db=Depends(get_database),
):
    email = data.email.strip().lower()
    password = data.password
    
    if not email or "@" not in email or len(email) > 120:
        raise HTTPException(status_code=400, detail="A valid email address is required")
        
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
        
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection is unavailable")
        
    try:
        existing_admin_count = await db["admin_db"].count_documents({})
        if existing_admin_count > 0:
            raise HTTPException(
                status_code=403, 
                detail="Public admin registration is disabled. An administrator account already exists."
            )
            
        if await db["admin_db"].find_one({"email": {"$eq": email}}):
            raise HTTPException(status_code=400, detail="Admin with this email already exists")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"DB error checking admins: {e}")
        raise HTTPException(status_code=503, detail="Database connection error")
        
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    doc_data = {
        "email": email,
        "password": hashed,
        "role": "admin",
        "created_at": datetime.utcnow()
    }
    
    try:
        await db["admin_db"].insert_one(doc_data)
    except Exception as e:
        logger.error(f"DB insert error: {e}")
        raise HTTPException(status_code=503, detail="Failed to save admin to database")
        
    return {"success": True, "message": "Initial administrator account initialized successfully"}

@router.get("/list")
async def list_admins(
    admin=Depends(get_admin_user), 
    db=Depends(get_database),
):
    admins = []
    if db is not None:
        try:
            cursor = db["admin_db"].find({}, {"password": 0}).sort("created_at", -1)
            async for a in cursor:
                a["_id"] = str(a["_id"])
                admins.append(a)
        except Exception as e:
            logger.error(f"Error listing admins: {e}")
            
    return {"success": True, "data": admins}

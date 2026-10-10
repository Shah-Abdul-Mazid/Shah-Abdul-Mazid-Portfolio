from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Body

from jose import jwt
from datetime import datetime, timedelta
from app.db import get_database

from app.config import settings
from .portfolio import get_admin_user
import logging

router = APIRouter()
import bcrypt

logger = logging.getLogger("admin-auth")

# --- 9. ROUTES: ADMIN AUTH ---
@router.post("/login")
async def login(
    credentials: dict = Body(...), 
    db=Depends(get_database),
):
    email = credentials.get("email")
    password = credentials.get("password")
    
    # 1. Input Sanitization & Type Validation (Defense against NoSQL/Type Injection)
    if not isinstance(email, str) or not isinstance(password, str):
        raise HTTPException(status_code=400, detail="Invalid credential format")
    
    email = email.strip().lower()
    if not email or not password or len(email) > 120 or len(password) > 128:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    admin = None
    if db is not None:
        # Strict string match prevents Mongo operator injection
        admin = await db["admin_db"].find_one({"email": {"$eq": email}})
        
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    # Verify password using bcrypt directly
    password_bytes = password.encode('utf-8')
    stored_hash = admin.get("password", "")
    if not stored_hash or not isinstance(stored_hash, str):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    hashed_bytes = stored_hash.encode('utf-8')
    
    if not bcrypt.checkpw(password_bytes, hashed_bytes):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Enforce standard token expiration (Defense against indefinite token reuse)
    expire_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    expire_time = datetime.utcnow() + expire_delta
    
    token = jwt.encode(
        {
            "id": str(admin["_id"]),
            "email": admin["email"],
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
        "admin": {"email": admin["email"], "role": admin.get("role", "admin")}
    }

@router.post("/register")
async def register(
    data: dict = Body(...), 
    db=Depends(get_database),
):
    """
    Admin registration endpoint.
    Defended against unauthorized account creation:
    If an admin already exists, public registration is strictly blocked.
    """
    email = data.get("email")
    password = data.get("password")
    
    if not isinstance(email, str) or not isinstance(password, str):
        raise HTTPException(status_code=400, detail="Invalid credential format")
        
    email = email.strip().lower()
    if not email or "@" not in email or len(email) > 120:
        raise HTTPException(status_code=400, detail="A valid email address is required")
        
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
        
    if db is not None:
        # Check if ANY admin already exists in the system
        existing_admin_count = await db["admin_db"].count_documents({})
        if existing_admin_count > 0:
            raise HTTPException(
                status_code=403, 
                detail="Public admin registration is disabled. An administrator account already exists."
            )
            
        # Check duplicate
        if await db["admin_db"].find_one({"email": {"$eq": email}}):
            raise HTTPException(status_code=400, detail="Admin with this email already exists")
        
    # Generate hash using bcrypt with high work factor
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    doc_data = {
        "email": email,
        "password": hashed,
        "role": "admin",
        "created_at": datetime.utcnow()
    }
    
    # Save to MongoDB
    if db is not None:
        await db["admin_db"].insert_one(doc_data)
        
    return {"success": True, "message": "Initial administrator account initialized successfully"}

@router.get("/list")
async def list_admins(
    admin=Depends(get_admin_user), 
    db=Depends(get_database),
):
    admins = []
    

            
    # Fallback/Merge with MongoDB
    if not admins and db is not None:
        cursor = db["admins"].find({}, {"password": 0}).sort("created_at", -1)
        async for a in cursor:
            a["_id"] = str(a["_id"])
            admins.append(a)
            
    return {"success": True, "data": admins}

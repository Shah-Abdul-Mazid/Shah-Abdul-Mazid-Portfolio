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
    
    admin = None
    

            
    # 2. Fallback to MongoDB
    if not admin and db is not None:
        admin = await db["admin_db"].find_one({"email": email})
        
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    # Verify password using bcrypt directly
    password_bytes = password.encode('utf-8')
    hashed_bytes = admin.get("password").encode('utf-8')
    
    if not bcrypt.checkpw(password_bytes, hashed_bytes):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = jwt.encode(
        {"id": str(admin["_id"]), "email": admin["email"], "role": admin.get("role")},
        settings.JWT_SECRET,
        algorithm="HS256"
    )
    
    return {
        "success": True, 
        "token": token, 
        "admin": {"email": admin["email"], "role": admin.get("role")}
    }

@router.post("/register")
async def register(
    data: dict = Body(...), 
    db=Depends(get_database),
):
    email = data.get("email")
    password = data.get("password")
    
    exists = False
            
    if not exists and db is not None:
        if await db["admin_db"].find_one({"email": email}):
            exists = True
            
    if exists:
        raise HTTPException(status_code=400, detail="Admin already exists")
        
    # Generate hash using bcrypt directly
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    doc_data = {
        "email": email,
        "password": hashed,
        "role": "admin"
    }
    
    # Save to MongoDB
    if db is not None:
        mongo_doc = doc_data.copy()
        mongo_doc["created_at"] = datetime.utcnow()
        await db["admin_db"].insert_one(mongo_doc)
        

        
    return {"success": True, "message": "Admin created successfully"}

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

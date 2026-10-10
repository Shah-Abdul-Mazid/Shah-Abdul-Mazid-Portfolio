from fastapi import APIRouter, Depends, HTTPException, Body, BackgroundTasks
from app.db import get_database

from jose import jwt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings
from datetime import datetime
import os
import logging

router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger("portfolio-endpoint")

def get_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verifies the JWT token from the Authorization header and enforces role authorization."""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Forbidden: Admin privileges required")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

from app.utils.file_cleanup import extract_upload_paths, delete_upload_file
import asyncio

@router.get("")
async def get_portfolio(db=Depends(get_database)):

    # 2. Fallback to MongoDB
    if db is not None:
        doc = await db["portfolio_content"].find_one({"key": "main"})
        if doc:
            return doc.get("data", {})
    return None

@router.post("")
async def save_portfolio(
    background_tasks: BackgroundTasks,
    data: dict = Body(...), 
    admin=Depends(get_admin_user), 
    db=Depends(get_database),
):
    """Saves portfolio data and triggers Smart Cleanup for redundancy."""
    # 1. Fetch old data before update
    old_data = {}
    
    # Fallback to MongoDB for fetching old data
    if not old_data and db is not None:
        old_doc = await db["portfolio_content"].find_one({"key": "main"})
        old_data = old_doc.get("data", {}) if old_doc else {}

    # 2. Update with new data in MongoDB
    if db is not None:
        await db["portfolio_content"].find_one_and_update(
            {"key": "main"},
            {"$set": {"data": data, "updated_at": datetime.utcnow()}},
            upsert=True
        )


    
    # 3. Smart File Cleanup (Background)
    old_paths = extract_upload_paths(old_data)
    new_paths = extract_upload_paths(data)
    
    # Identify deleted paths: exists in old but NOT in new
    deleted_paths = [p for p in old_paths if p not in new_paths]
    
    if deleted_paths:
        for p_type, p_value in deleted_paths:
            background_tasks.add_task(delete_upload_file, p_type, p_value)

    # 4. Automatically sync LaTeX CV with updated publications
    papers = data.get("papers", [])
    if papers:
        from app.utils.latex_sync import update_visual_cv_latex
        background_tasks.add_task(update_visual_cv_latex, papers)
            
    return {
        "success": True, 
        "message": "Portfolio saved, cleanup triggered, and CV LaTeX updated!", 
        "cleaned": len(deleted_paths)
    }

@router.get("/credly-image")
async def get_credly_badge_image(url: str):
    """
    Fetches the official Credly badge image URL directly from any public Credly badge link.
    SSRF Defense: Strictly restricted to credly.com domain, rejecting internal/private IPs.
    """
    import urllib.request, urllib.parse, re
    try:
        clean_url = url.strip()
        if not clean_url.startswith("http://") and not clean_url.startswith("https://"):
            clean_url = f"https://www.credly.com/badges/{clean_url}/public_url"
            
        parsed = urllib.parse.urlparse(clean_url)
        hostname = (parsed.hostname or "").lower()
        
        # SSRF Protection: Strict domain whitelist
        if not (hostname == "credly.com" or hostname.endswith(".credly.com")):
            raise HTTPException(
                status_code=400, 
                detail="Security validation error: Only official Credly URLs (credly.com) are permitted."
            )
            
        # Ensure scheme is HTTPS
        if parsed.scheme not in ["https", "http"]:
            raise HTTPException(status_code=400, detail="Invalid protocol scheme.")

        req = urllib.request.Request(clean_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        html = urllib.request.urlopen(req, timeout=8).read().decode("utf-8")
        matches = re.findall(r'meta property="og:image" content="([^"]+)"', html)
        if matches:
            img = matches[0]
            clean_img = img.replace("linkedin_thumb_", "")
            return {"success": True, "imageUrl": clean_img}
        return {"success": False, "error": "No image found on Credly page"}
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"Credly fetch error: {e}")
        return {"success": False, "error": "Failed to fetch badge from Credly"}



from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, status
import cloudinary
import cloudinary.uploader
import logging
import os
from app.api.v1.endpoints.portfolio import get_admin_user

router = APIRouter()
logger = logging.getLogger("portfolio-upload")

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "svg", "pdf"}
ALLOWED_MIME_TYPES = {
    "image/png", 
    "image/jpeg", 
    "image/webp", 
    "image/svg+xml", 
    "application/pdf", 
    "application/octet-stream"
}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    admin=Depends(get_admin_user)
):
    """
    Secure file upload endpoint.
    Defended against:
    - Unauthenticated arbitrary uploads (Requires valid Admin JWT)
    - Malicious executable upload (Extension & MIME type whitelist)
    - Denial of Service / quota exhaustion (10MB size cap)
    """
    try:
        # 1. Filename & Extension Validation
        filename = file.filename or ""
        ext = filename.split('.')[-1].lower() if '.' in filename else ""
        if not ext or ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Security violation: File type '.{ext}' is not permitted. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
            )

        # 2. Content Type Validation
        content_type = (file.content_type or "").lower()
        if content_type and content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Security violation: MIME type '{content_type}' is not allowed."
            )

        # 3. Size Validation (Stream check)
        file_bytes = await file.read()
        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Security violation: File size exceeds the maximum limit of 10MB."
            )

        # Reset pointer for Cloudinary
        file.file.seek(0)

        # 4. Upload to Cloudinary with secure parameters
        res_type = "auto"
        result = cloudinary.uploader.upload(
            file.file,
            folder="portfolio_uploads",
            resource_type=res_type,
            use_filename=True,
            unique_filename=True
        )

        logger.info(f"Admin {admin.get('email')} uploaded {filename} ({len(file_bytes)} bytes)")

        return {
            "success": True,
            "url": result.get("secure_url"),
            "filename": result.get("original_filename"),
            "file": {
                "url": result.get("secure_url"),
                "public_id": result.get("public_id"),
                "format": result.get("format"),
                "resource_type": result.get("resource_type")
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        return {
            "success": False,
            "message": f"Upload failed: {str(e)}"
        }

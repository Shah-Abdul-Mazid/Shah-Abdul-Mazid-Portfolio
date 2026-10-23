from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html, get_swagger_ui_oauth2_redirect_html, get_redoc_html
from fastapi.responses import JSONResponse, HTMLResponse
from app.db import connect_to_mongo, close_mongo_connection

from app.api.v1.endpoints import portfolio, admin, analytics, messages, upload, agent
from app.config import settings
import cloudinary
import asyncio

import os
from app.middleware.security import SecurityMiddleware

app = FastAPI(title=settings.PROJECT_NAME)

# --- 1. DEFENSIVE SECURITY & RATE LIMITING MIDDLEWARE ---
app.add_middleware(SecurityMiddleware)

# --- 2. HARDENED CORS CONFIGURATION ---
env_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://shahabdulmazid.com",
    "https://www.shahabdulmazid.com",
    "https://shah-abdul-mazid.vercel.app",
    "https://shahabdulmazidezan.me",
    "https://www.shahabdulmazidezan.me",
    "https://shah-abdul-mazid-portfolio.onrender.com",
]
for origin in env_origins:
    if origin not in allowed_origins:
        allowed_origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*-shah-abdul-mazid.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["Retry-After"],
)

# --- 2. DB EVENTS ---
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()


# --- 3. CLOUDINARY CONFIG ---
if settings.CLOUDINARY_URL:
    # Use the combined URL automatically
    cloudinary.config(cloudinary_url=settings.CLOUDINARY_URL, secure=True)
    print("[FastAPI] Cloudinary Configured via CLOUDINARY_URL!")
elif settings.is_cloudinary_configured:
    # Use individual keys
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True
    )
    print("[FastAPI] Cloudinary Configured via Individual Keys!")
else:
    print("[WARNING] [FastAPI] Cloudinary is NOT configured. Uploads will fail!")

# --- 4. API ROUTING (Professional Modular Structure) ---
# Each piece of your portfolio is now in its own dedicated file
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin Auth"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(messages.router, prefix="/api/messages", tags=["Messages"])
app.include_router(upload.router, prefix="/api/upload", tags=["Uploads"])
app.include_router(agent.router, prefix="/api/agent", tags=["AI Agent"])

# --- 5. CORE ENDPOINTS ---
@app.get("/health")
@app.get("/api/v1/health")
@app.get("/api/health")
async def health():
    # Attempt a simple ping to verify MongoDB
    try:
        from app.db import get_database
        db_inst = get_database()
        if db_inst is not None:
             # Basic command with timeout to verify connection
             await asyncio.wait_for(db_inst.command("ping"), timeout=2.0)
             db_status = "Connected"
        else:
             db_status = "Disconnected"
    except Exception:
        db_status = "Error"

    # Cloudinary check (simple validation of config)
    try:
        if settings.is_cloudinary_configured:
            cloudinary_status = "Configured"
        else:
            cloudinary_status = "Missing Config"
    except Exception:
        cloudinary_status = "Error"



    return {
        "status": "online",
        "database": db_status,
        "cloudinary": cloudinary_status,
        "engine": "FastAPI Professional Migration Complete"
    }

@app.get("/version")
async def get_version():
    return {
        "version": "1.1.0-MODULAR",
        "engine": "FastAPI Professional Migration",
        "status": "Production-Hardened"
    }

@app.get("/")
async def root():
    return {"message": "Welcome to the Portfolio & AI Agent Backend API"}

# --- 6. ROCK-SOLID API DOCUMENTATION ENDPOINTS ---
def _generate_swagger_ui(openapi_path: str = "/openapi.json"):
    return HTMLResponse(f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{settings.PROJECT_NAME} - Swagger UI</title>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui.min.css" />
    <link rel="icon" type="image/png" href="https://fastapi.tiangolo.com/img/favicon.png" />
    <style>
        html {{ box-sizing: border-box; overflow-y: scroll; }}
        *, *:before, *:after {{ box-sizing: inherit; }}
        body {{ margin: 0; background: #0b1120; }}
        .swagger-ui {{ color: #e2e8f0; }}
        .swagger-ui .topbar {{ display: none; }}
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-standalone-preset.min.js"></script>
    <script>
    window.onload = function() {{
        window.ui = SwaggerUIBundle({{
            url: '{openapi_path}',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
            ],
            layout: "BaseLayout"
        }});
    }};
    </script>
</body>
</html>""")

@app.get("/docs", include_in_schema=False)
async def swagger_docs():
    return _generate_swagger_ui("/openapi.json")

@app.get("/api/docs", include_in_schema=False)
async def api_swagger_docs():
    return _generate_swagger_ui("/api/openapi.json")

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url="/openapi.json",
        title=f"{settings.PROJECT_NAME} - ReDoc",
        redoc_js_url="https://cdnjs.cloudflare.com/ajax/libs/redoc/2.1.5/redoc.standalone.js"
    )

@app.get("/api/redoc", include_in_schema=False)
async def api_redoc_html():
    return get_redoc_html(
        openapi_url="/api/openapi.json",
        title=f"{settings.PROJECT_NAME} - ReDoc",
        redoc_js_url="https://cdnjs.cloudflare.com/ajax/libs/redoc/2.1.5/redoc.standalone.js"
    )

@app.get("/openapi.json", include_in_schema=False)
@app.get("/api/openapi.json", include_in_schema=False)
async def openapi_schema():
    return JSONResponse(app.openapi())

if __name__ == "__main__":
    import uvicorn
    # Same port as Node for zero-change frontend compatibility
    uvicorn.run("app.main:app", host="0.0.0.0", port=3001, reload=True)

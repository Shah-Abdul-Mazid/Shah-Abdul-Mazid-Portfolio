import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # App General info
    PROJECT_NAME: str = "Portfolio & AI Agent Backend"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "local"  # "local" = Ollama, "production" = Groq
    
    # Auth
    JWT_SECRET: str = "secret"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Databases — accept any common env-var name for the MongoDB URI
    ATLAS_URL: Optional[str] = None
    atlas_URL: Optional[str] = None
    MONGODB_URI: Optional[str] = None
    MONGO_URI: Optional[str] = None
    MONGODB_URL: Optional[str] = None
    DATABASE_URL: Optional[str] = None
    DB_NAME: str = "portfolio_data"
    atlas_DB_NAME: Optional[str] = None

    # Cloudinary (Optional)
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None
    CLOUDINARY_URL: Optional[str] = None

    # Ollama (Local LLM - Free, zero cost)
    OLLAMA_URL: Optional[str] = "https://keith-unstarting-microtonally.ngrok-free.dev"
    OLLAMA_LOCAL_URL: Optional[str] = "http://127.0.0.1:11434"
    OLLAMA_MODEL: Optional[str] = "llama3.1:latest"
    USE_OLLAMA: bool = True
    OLLAMA_API_SECRET: Optional[str] = None
    NGROK_AUTH: Optional[str] = None

    # Groq (Free Cloud LLM - fastest option)
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: Optional[str] = "qwen/qwen3.8-27b"  # or mixtral-8x7b-32768, gemma2-9b-it

    # Load from .env in project root or subfolder
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env", "Portfolio_Backend/.env"),
        extra="ignore",
        env_ignore_case=True  # CRITICAL for Render/Vercel environment variable case matching
    )

    @property
    def get_atlas_url(self) -> str:
        for key in ('ATLAS_URL', 'atlas_URL', 'MONGODB_URI', 'MONGO_URI', 'MONGODB_URL', 'DATABASE_URL'):
            val = getattr(self, key, None) or os.getenv(key)
            if val and str(val).strip():
                # Strip leading/trailing whitespaces and optional quotes
                return str(val).strip().strip('\'"')
        return 'mongodb://localhost:27017'

    @property
    def get_db_name(self) -> str:
        raw = self.atlas_DB_NAME or self.DB_NAME or os.getenv("atlas_DB_NAME") or "portfolio_data"
        return str(raw).strip().strip('\'"')

    @property
    def is_cloudinary_configured(self) -> bool:
        # We are good if we have individual keys OR the combined URL
        return (self.CLOUDINARY_CLOUD_NAME and self.CLOUDINARY_API_KEY) or bool(self.CLOUDINARY_URL)


settings = Settings()

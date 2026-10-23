# Vercel Serverless Entry Point for FastAPI
# Vercel's Python runtime uses the Mangum ASGI adapter to call FastAPI.
# This file lives at Portfolio_Backend/api/index.py and is what vercel.json points to.

import sys
import os

# Add the Portfolio_Backend directory to sys.path so `from app.xxx import ...` works
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app          # FastAPI app instance
from mangum import Mangum         # AWS Lambda / Vercel ASGI adapter

# Vercel calls this handler for every request
handler = Mangum(app, lifespan="off")

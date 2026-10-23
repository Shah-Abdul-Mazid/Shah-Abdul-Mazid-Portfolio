# Root-level Vercel ASGI entry point
# Vercel requires the api/ folder at the PROJECT ROOT.
# This file adds Portfolio_Backend to sys.path so the full app package is importable.

import sys
import os

# Walk up from api/ → project root → Portfolio_Backend
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir  = os.path.join(project_root, "Portfolio_Backend")

for path in (backend_dir, project_root):
    if path not in sys.path:
        sys.path.insert(0, path)

# Import the production FastAPI app
from app.main import app       # noqa: E402
from mangum import Mangum      # noqa: E402

# Vercel invokes this handler for every matched request
handler = Mangum(app, lifespan="off")

from dotenv import load_dotenv
from fastapi import FastAPI

from app.api.health import router as health_router
from app.api.routes.chat import router as chat_router
from app.api.routes.incidents import router as incidents_router
from app.api.routes.ingestion import router as ingestion_router
from app.api.routes.search import router as search_router
from app.config.settings import settings

load_dotenv()  # Load environment variables from .env file at startup
# Create the FastAPI application instance.
# This object is what Uvicorn imports and runs.
# App metadata comes from environment-backed settings, so it can change
# between environments without editing application code.
app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)


# Register route modules here so main.py stays focused on application setup.
app.include_router(health_router)
app.include_router(incidents_router)
app.include_router(ingestion_router)
app.include_router(search_router)
app.include_router(chat_router)


# Run the development server with:
# uvicorn app.main:app --reload

from dotenv import load_dotenv
from pydantic import BaseModel

import os


# Load values from the project's .env file into environment variables.
# Environment variables keep deployment-specific values outside the code,
# so the same codebase can run in development, testing, and production.
load_dotenv()


class Settings(BaseModel):
    """Application settings loaded from environment variables."""

    # Centralized settings management is important in enterprise apps because
    # configuration becomes easier to audit, validate, reuse, and change safely.
    APP_NAME: str = os.getenv("APP_NAME", "POC2")
    APP_VERSION: str = os.getenv("APP_VERSION", "0.1.0")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    QDRANT_URL: str = os.getenv("QDRANT_URL", "")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")
    QDRANT_COLLECTION_NAME: str = os.getenv(
        "QDRANT_COLLECTION_NAME",
        "servicenow_incidents",
    )


# A single shared settings object can be imported anywhere configuration is needed.
settings = Settings()

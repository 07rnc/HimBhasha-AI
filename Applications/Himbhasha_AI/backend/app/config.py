import os

class Settings:
    PROJECT_NAME: str = "HimBhasha AI API"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # CORS Origins (Allow all for local development & hackathon/MVP deployment)
    ALLOWED_ORIGINS: list = ["*"]

settings = Settings()

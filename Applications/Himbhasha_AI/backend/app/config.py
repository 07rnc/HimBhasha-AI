import os

# Manually load environment variables from .env file if it exists
try:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    for _ in range(3):
        env_path = os.path.join(base_dir, ".env")
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    k, v = line.split("=", 1)
                    k = k.strip()
                    v = v.strip().strip('"').strip("'")
                    if k and k not in os.environ:
                        os.environ[k] = v
            break
        base_dir = os.path.dirname(base_dir)
except Exception:
    pass

class Settings:
    PROJECT_NAME: str = "HimBhasha AI API"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # CORS Origins (Allow all for local development & hackathon/MVP deployment)
    ALLOWED_ORIGINS: list = ["*"]

settings = Settings()

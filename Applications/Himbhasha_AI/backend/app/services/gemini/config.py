import os

# Manually load environment variables from .env file if it exists
try:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    for _ in range(4):
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

class GeminiConfig:
    def __init__(self):
        self.api_key: str = os.getenv("GEMINI_API_KEY", "mock_gemini_key")
        self.model_name: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        self.temperature: float = 0.2
        self.max_tokens: int = 1000

gemini_config = GeminiConfig()
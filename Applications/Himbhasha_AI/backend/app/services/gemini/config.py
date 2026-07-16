import os

class GeminiConfig:
    def __init__(self):
        self.api_key: str = os.getenv("GEMINI_API_KEY", "mock_gemini_key")
        self.model_name: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        self.temperature: float = 0.2
        self.max_tokens: int = 1000

gemini_config = GeminiConfig()
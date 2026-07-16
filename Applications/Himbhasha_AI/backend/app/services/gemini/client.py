import logging
from .config import gemini_config

logger = logging.getLogger("gemini_client")

class GeminiClient:
    def __init__(self):
        self.api_key = gemini_config.api_key
        self.model_name = gemini_config.model_name
        self._is_initialized = False

    def initialize(self) -> bool:
        if not self.api_key or self.api_key == "your_gemini_api_key_here":
            logger.warning("Gemini API key is not configured. Running in mock fallback mode.")
            self._is_initialized = False
        else:
            logger.info(f"Gemini client initialized with model: {self.model_name}")
            self._is_initialized = True
        return self._is_initialized

    def is_healthy(self) -> bool:
        return True
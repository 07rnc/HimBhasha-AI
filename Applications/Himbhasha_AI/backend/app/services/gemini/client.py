import logging
from .config import gemini_config

logger = logging.getLogger("gemini_client")

class GeminiClient:
    def __init__(self):
        self.api_key = gemini_config.api_key
        self.model_name = gemini_config.model_name
        self._is_initialized = False

    def initialize(self) -> bool:
        if not self.api_key or self.api_key in ["your_gemini_api_key_here", "mock_gemini_key", ""]:
            raise ValueError(
                "GEMINI_API_KEY is unconfigured or empty in your environment configuration. "
                "Please configure a valid Google Gemini API key to proceed."
            )
        logger.info(f"Gemini client initialized with model: {self.model_name}")
        self._is_initialized = True
        return self._is_initialized

    def is_healthy(self) -> bool:
        return True
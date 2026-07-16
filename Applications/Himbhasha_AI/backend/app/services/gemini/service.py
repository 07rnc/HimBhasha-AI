from .client import GeminiClient
from .types import GeminiChatPayload, GeminiChatResult, GeminiMessage
from app.services.mock_data import get_chat_response, get_translation
import logging

logger = logging.getLogger("gemini_service")

class GeminiService:
    def __init__(self, client: GeminiClient):
        self.client = client
        self.client.initialize()

    async def generate_content(self, prompt: str) -> GeminiChatResult:
        logger.info(f"Generating content for prompt length: {len(prompt)}")
        try:
            # Query the mock data services for highly realistic Kangdi-aligned results
            response_text = get_chat_response(prompt)
            return GeminiChatResult(
                text=response_text,
                model_version=self.client.model_name
            )
        except Exception as e:
            logger.error(f"Gemini generation error: {e}")
            raise RuntimeError(f"Gemini content generation failed: {e}")

    async def translate_text(self, text: str, src: str, target: str) -> tuple:
        logger.info(f"Translating: '{text}' from {src} to {target}")
        try:
            translated, pron = get_translation(text, src, target)
            return translated, pron
        except Exception as e:
            logger.error(f"Gemini translation error: {e}")
            raise RuntimeError(f"Gemini translation failed: {e}")
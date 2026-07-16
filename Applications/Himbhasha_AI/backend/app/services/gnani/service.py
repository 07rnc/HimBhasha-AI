from .client import GnaniClient
from .types import GnaniSTTPayload, GnaniTTSPayload, GnaniSpeechResult
from app.services.mock_data import MOCK_AUDIO_BASE64, get_voice_response
import logging

logger = logging.getLogger("gnani_service")

class GnaniService:
    def __init__(self, client: GnaniClient):
        self.client = client
        self.client.check_connection()

    async def speech_to_text(self, payload: GnaniSTTPayload) -> GnaniSpeechResult:
        logger.info("Transcribing incoming audio payload via Gnani STT...")
        try:
            transcription, _, _ = get_voice_response(payload.audio_base64)
            return GnaniSpeechResult(transcription=transcription)
        except Exception as e:
            logger.error(f"Gnani STT error: {e}")
            raise RuntimeError(f"Speech transcription failed: {e}")

    async def text_to_speech(self, payload: GnaniTTSPayload) -> GnaniSpeechResult:
        logger.info(f"Synthesizing speech via Gnani TTS for: '{payload.text}'")
        try:
            return GnaniSpeechResult(audio_base64=MOCK_AUDIO_BASE64)
        except Exception as e:
            logger.error(f"Gnani TTS error: {e}")
            raise RuntimeError(f"Speech synthesis failed: {e}")
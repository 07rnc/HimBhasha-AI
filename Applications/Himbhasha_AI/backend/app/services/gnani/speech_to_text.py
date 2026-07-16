from .client import GnaniClient
from .models import GnaniSttRequest, GnaniSttResponse
from .exceptions import GnaniAPIException
from app.services.mock_data import get_voice_response
import logging

logger = logging.getLogger("gnani_stt")

class GnaniSTTService:
    def __init__(self, client: GnaniClient):
        self.client = client
        self.client.authenticate()

    async def transcribe(self, payload: GnaniSttRequest) -> GnaniSttResponse:
        logger.info("GnaniSTTService: Transcribing audio stream...")
        try:
            # Consult the mock voice dictionary layer
            transcription, _, _ = get_voice_response(payload.audio_base64)
            # Simulated transcription confidence score
            confidence = 0.978
            
            return GnaniSttResponse(
                transcription=transcription,
                confidence=confidence
            )
        except Exception as e:
            logger.error(f"Gnani STT transcription process failed: {e}")
            raise GnaniAPIException(f"Transcription failed: {e}")
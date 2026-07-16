from .client import GnaniClient
from .models import GnaniTtsRequest, GnaniTtsResponse
from .exceptions import GnaniAPIException
from app.services.mock_data import MOCK_AUDIO_BASE64
import logging

logger = logging.getLogger("gnani_tts")

class GnaniTTSService:
    def __init__(self, client: GnaniClient):
        self.client = client
        self.client.authenticate()

    async def synthesize(self, payload: GnaniTtsRequest) -> GnaniTtsResponse:
        logger.info(f"GnaniTTSService: Synthesizing regional speech response for: '{payload.text}'")
        try:
            # Return our realistic base64 mock WAV audio buffer
            return GnaniTtsResponse(
                audio_base64=MOCK_AUDIO_BASE64
            )
        except Exception as e:
            logger.error(f"Gnani TTS synthesis failed: {e}")
            raise GnaniAPIException(f"Synthesis failed: {e}")
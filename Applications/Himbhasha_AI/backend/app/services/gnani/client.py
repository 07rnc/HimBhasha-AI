import logging
from .config import gnani_config

logger = logging.getLogger("gnani_client")

class GnaniClient:
    def __init__(self):
        self.api_key = gnani_config.api_key
        self.voice_gender = gnani_config.voice_gender

    def check_connection(self) -> bool:
        if not self.api_key or self.api_key == "your_gnani_api_key_here":
            logger.warning("Gnani Speech API key is missing. Using mock engine.")
            return False
        return True
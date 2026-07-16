import logging
from .config import mem0_config

logger = logging.getLogger("mem0_client")

class Mem0Client:
    def __init__(self):
        self.api_key = mem0_config.api_key

    def verify_credentials(self) -> bool:
        if not self.api_key or self.api_key == "your_mem0_api_key_here":
            logger.warning("Mem0 API Key missing. Memory persistence defaults to local mock layer.")
            return False
        return True
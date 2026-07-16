import logging
from .config import keploy_config

logger = logging.getLogger("keploy_client")

class KeployClient:
    def __init__(self):
        self.api_key = keploy_config.api_key
        self.mode = keploy_config.mode

    def initialize_keploy_agent(self) -> bool:
        logger.info(f"Keploy testing agent registered in mode: {self.mode}")
        return True
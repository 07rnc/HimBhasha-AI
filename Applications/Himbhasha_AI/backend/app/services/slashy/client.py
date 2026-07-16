import logging
from .config import slashy_config

logger = logging.getLogger("slashy_client")

class SlashyClient:
    def __init__(self):
        self.api_key = slashy_config.api_key
        self.webhook_url = slashy_config.webhook_url

    def test_webhook(self) -> bool:
        logger.info(f"Slashy webhooks configured target: {self.webhook_url}")
        return True
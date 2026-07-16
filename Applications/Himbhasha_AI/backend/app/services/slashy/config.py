import os

class SlashyConfig:
    def __init__(self):
        self.api_key: str = os.getenv("SLASHY_API_KEY", "mock_slashy_key")
        self.webhook_url: str = "https://api.slashy.io/webhooks/himbhasha"

slashy_config = SlashyConfig()
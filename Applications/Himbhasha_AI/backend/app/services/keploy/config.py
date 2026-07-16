import os

class KeployConfig:
    def __init__(self):
        self.api_key: str = os.getenv("KEPLOY_API_KEY", "mock_keploy_key")
        self.mode: str = os.getenv("KEPLOY_MODE", "record")  # "record" or "test"

keploy_config = KeployConfig()
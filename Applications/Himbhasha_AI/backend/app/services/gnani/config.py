import os

class GnaniConfig:
    def __init__(self):
        self.api_key: str = os.getenv("GNANI_API_KEY", "mock_gnani_key")
        self.base_url: str = os.getenv("GNANI_BASE_URL", "https://api.gnani.ai/v1")
        self.client_id: str = os.getenv("GNANI_CLIENT_ID", "mock_client_id")
        self.client_secret: str = os.getenv("GNANI_CLIENT_SECRET", "mock_client_secret")
        self.voice_gender: str = "female"
        self.stt_language: str = "hi-IN"
        self.tts_language: str = "hi-IN"

gnani_config = GnaniConfig()
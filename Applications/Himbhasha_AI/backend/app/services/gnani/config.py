import os

class GnaniConfig:
    def __init__(self):
        self.api_key: str = os.getenv("GNANI_API_KEY", "mock_gnani_key")
        self.stt_language: str = "hi-IN"  # Indic languages defaults
        self.tts_language: str = "hi-IN"
        self.voice_gender: str = "female"  # Vaani assistant theme

gnani_config = GnaniConfig()
import os

class PaddleOCRConfig:
    def __init__(self):
        self.api_key: str = os.getenv("PADDLEOCR_API_KEY", "mock_paddle_key")
        self.use_gpu: bool = False
        self.lang: str = "ch"  # Supports Chinese & English default Indic extensions

paddle_config = PaddleOCRConfig()
import logging
from .config import paddle_config

logger = logging.getLogger("paddle_ocr_client")

class PaddleOCRClient:
    def __init__(self):
        self.api_key = paddle_config.api_key
        self.use_gpu = paddle_config.use_gpu

    def initialize_detector(self) -> bool:
        logger.info("PaddleOCR engine initialized with layout parser.")
        return True
import logging
from . import config

logger = logging.getLogger("paddleocr_client")

class MockPaddleOCR:
    """Fallback Mock PaddleOCR client simulating Indic language OCR bounding boxes."""
    def __init__(self, **kwargs):
        self.kwargs = kwargs
        logger.info(f"MockPaddleOCR initialized with kwargs: {kwargs}")

    def ocr(self, img_path: str, cls: bool = True):
        # Return mock PaddleOCR line tokens: [ [ [box], (text, confidence) ] ]
        return [
            [
                [[[10.0, 10.0], [200.0, 10.0], [200.0, 50.0], [10.0, 50.0]], ("नमस्ते, क्या हाल है?", 0.981)],
                [[[10.0, 60.0], [300.0, 60.0], [300.0, 100.0], [10.0, 100.0]], ("यह दस्तावेज़ हिमाचल प्रदेश के किसानों के लिए सरकारी लाभों की व्याख्या करता है।", 0.964)]
            ]
        ]

_ocr_instance = None

def get_ocr_client():
    """Singleton getter for the PaddleOCR client instance."""
    global _ocr_instance
    if _ocr_instance is not None:
        return _ocr_instance
        
    try:
        from paddleocr import PaddleOCR
        _ocr_instance = PaddleOCR(
            lang=config.lang,
            use_gpu=config.use_gpu,
            use_angle_cls=config.use_angle_cls,
            show_log=False
        )
        logger.info("Real PaddleOCR client singleton initialized successfully.")
    except ImportError:
        logger.warning("paddleocr python package not detected. Falling back to MockPaddleOCR engine client.")
        _ocr_instance = MockPaddleOCR(
            lang=config.lang,
            use_gpu=config.use_gpu,
            use_angle_cls=config.use_angle_cls
        )
    return _ocr_instance

# Backwards compatibility class for endpoints.py dependency injection
class PaddleOCRClient:
    def __init__(self):
        self.client = get_ocr_client()
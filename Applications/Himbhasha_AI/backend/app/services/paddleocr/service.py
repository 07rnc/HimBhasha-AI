from .client import PaddleOCRClient
from .types import OcrPayload, OcrResult, OcrBoundingBox
import logging

logger = logging.getLogger("paddle_ocr_service")

class PaddleOCRService:
    def __init__(self, client: PaddleOCRClient):
        self.client = client
        self.client.initialize_detector()

    async def extract_text(self, payload: OcrPayload) -> OcrResult:
        logger.info(f"Extracting text from file: {payload.file_name}")
        try:
            # Simulated OCR reading
            mock_text = (
                "हिमाचल प्रदेश सरकार - कृषि योजना विभाग।\n"
                "दस्तावेज़ संख्या: HP-AGRI-2026-908\n"
                "योजना: किसानों को सोलर पंप सिंचाई सब्सिडी योजना।\n"
                "विवरण: सीमांत किसानों को 80% सब्सिडी। आवेदन पंचायत कार्यालय में जमा करें।"
            )
            mock_boxes = [
                OcrBoundingBox(points=[[0, 0], [10, 0], [10, 10], [0, 10]], text="कृषि योजना", confidence=0.98),
                OcrBoundingBox(points=[[20, 20], [30, 20], [30, 30], [20, 30]], text="सब्सिडी योजना", confidence=0.95)
            ]
            return OcrResult(extracted_text=mock_text, boxes=mock_boxes)
        except Exception as e:
            logger.error(f"OCR extraction failed: {e}")
            raise RuntimeError(f"OCR processing failed: {e}")
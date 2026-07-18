import time
import logging
from .client import get_ocr_client
from .types import OCRResult
from .utils import validate_image
from . import config

logger = logging.getLogger("paddleocr_image")

def extract_text_from_image(image_path: str) -> OCRResult:
    """Processes image and returns extracted text using PaddleOCR client."""
    start_time = time.time()
    
    if not validate_image(image_path):
        return OCRResult(
            extracted_text="",
            confidence=0.0,
            processing_time=time.time() - start_time,
            language=config.lang,
            success=False,
            error_message=f"Invalid or unreadable image file: {image_path}"
        )
        
    try:
        client = get_ocr_client()
        logger.info(f"Running OCR extraction on: {image_path}")
        
        # client.ocr returns: [ [ [ [box], (text, confidence) ] ] ]
        ocr_results = client.ocr(image_path, cls=config.use_angle_cls)
        
        extracted_lines = []
        confidences = []
        
        if ocr_results:
            for page in ocr_results:
                if not page:
                    continue
                for line in page:
                    box_info, (text, conf) = line
                    if conf >= config.confidence_threshold:
                        extracted_lines.append(text)
                        confidences.append(conf)
                        
        extracted_text = " ".join(extracted_lines)
        avg_confidence = sum(confidences) / len(confidences) if confidences else 1.0
        
        return OCRResult(
            extracted_text=extracted_text,
            confidence=avg_confidence,
            processing_time=time.time() - start_time,
            language=config.lang,
            success=True
        )
    except Exception as e:
        logger.error(f"Image OCR processing failed: {e}")
        return OCRResult(
            extracted_text="",
            confidence=0.0,
            processing_time=time.time() - start_time,
            language=config.lang,
            success=False,
            error_message=str(e)
        )
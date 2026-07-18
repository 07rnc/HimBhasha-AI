import logging
from .types import OCRResult, OcrPayload
from .utils import save_upload, delete_temporary_files
from .image_ocr import extract_text_from_image
from .pdf_ocr import extract_text_from_pdf

logger = logging.getLogger("paddleocr_service")

class PaddleOCRService:
    """Business layer wrapping OCR requests on images and PDF files."""
    
    def __init__(self, client=None):
        # Support dependency injection initialization
        self.client = client

    @staticmethod
    def extract_from_image(content_base64: str, file_name: str) -> OCRResult:
        logger.info(f"PaddleOCRService: Starting image extraction for: {file_name}")
        temp_file = None
        try:
            temp_file = save_upload(content_base64, file_name)
            result = extract_text_from_image(temp_file)
            return result
        except Exception as e:
            logger.error(f"Service extract_from_image exception: {e}")
            return OCRResult(
                extracted_text="",
                confidence=0.0,
                processing_time=0.0,
                language="hi",
                success=False,
                error_message=str(e)
            )
        finally:
            if temp_file:
                delete_temporary_files(temp_file)

    @staticmethod
    def extract_from_pdf(content_base64: str, file_name: str) -> OCRResult:
        logger.info(f"PaddleOCRService: Starting PDF extraction for: {file_name}")
        temp_file = None
        try:
            temp_file = save_upload(content_base64, file_name)
            result = extract_text_from_pdf(temp_file)
            return result
        except Exception as e:
            logger.error(f"Service extract_from_pdf exception: {e}")
            return OCRResult(
                extracted_text="",
                confidence=0.0,
                processing_time=0.0,
                language="hi",
                success=False,
                error_message=str(e)
            )
        finally:
            if temp_file:
                delete_temporary_files(temp_file)

    # Backwards compatibility method matching endpoints.py routing
    async def extract_text(self, payload: OcrPayload) -> OCRResult:
        logger.info(f"PaddleOCRService compatibility wrapper query for file: {payload.file_name}")
        fn = payload.file_name.lower()
        if fn.endswith(".pdf"):
            return self.extract_from_pdf(payload.content_base64, payload.file_name)
        else:
            return self.extract_from_image(payload.content_base64, payload.file_name)
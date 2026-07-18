import time
import logging
from typing import Dict, Any

from app.services.paddleocr.service import PaddleOCRService
from .text_cleaner import TextCleaner
from .document_parser import DocumentParser
from .ocr_formatter import OCRFormatter

logger = logging.getLogger("document_reader_service")

class DocumentReaderService:
    """High-level offline document reader service converting image/PDF OCR output into structured document schema."""

    def __init__(self):
        self.ocr_service = PaddleOCRService()

    def process_document(self, content_base64: str, file_name: str) -> Dict[str, Any]:
        """Processes PNG, JPG, JPEG, or PDF files into structured document results under 2s (images) / 5s (PDFs)."""
        start_time = time.time()
        logger.info(f"DocumentReaderService processing file: {file_name}")

        fn_lower = file_name.lower()
        if fn_lower.endswith(".pdf"):
            ocr_result = self.ocr_service.extract_from_pdf(content_base64, file_name)
        else:
            ocr_result = self.ocr_service.extract_from_image(content_base64, file_name)

        raw_text = ocr_result.extracted_text if hasattr(ocr_result, "extracted_text") else str(ocr_result)
        confidence = ocr_result.confidence if hasattr(ocr_result, "confidence") else 0.95

        # Step 1: Clean and Normalize Text
        cleaned_text = TextCleaner.clean_text(raw_text)

        # Step 2: Parse Document Sections (Title, Headings, Paragraphs, Tables)
        parsed_doc = DocumentParser.parse_document(cleaned_text)

        total_duration = time.time() - start_time
        logger.info(f"DocumentReaderService completed processing in {total_duration:.2f}s.")

        # Step 3: Format Structured Response Schema
        return OCRFormatter.format_structured_response(
            parsed_doc=parsed_doc,
            cleaned_text=cleaned_text,
            confidence=confidence,
            processing_time=total_duration
        )

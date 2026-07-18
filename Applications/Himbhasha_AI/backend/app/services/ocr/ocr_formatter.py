import re
import logging
from typing import Dict, Any, List
from .ocr_models import StructuredDocumentResponse

logger = logging.getLogger("ocr_formatter")

class OCRFormatter:
    """Formats parsed document sections into standardized JSON response schema."""

    @staticmethod
    def detect_document_language(text: str) -> str:
        if not text:
            return "Unknown"
        has_devanagari = bool(re.search(r"[\u0900-\u097F]", text))
        has_english = bool(re.search(r"[a-zA-Z]", text))

        if has_devanagari and has_english:
            return "Devanagari / English (Bilingual)"
        elif has_devanagari:
            return "Hindi / Pahari (Devanagari)"
        elif has_english:
            return "English"
        return "Unknown"

    @staticmethod
    def format_structured_response(
        parsed_doc: Dict[str, Any],
        cleaned_text: str,
        confidence: float = 0.95,
        processing_time: float = 0.0
    ) -> Dict[str, Any]:

        detected_lang = OCRFormatter.detect_document_language(cleaned_text)

        response_obj = StructuredDocumentResponse(
            title=parsed_doc.get("title", "Document Notice"),
            headings=parsed_doc.get("headings", []),
            paragraphs=parsed_doc.get("paragraphs", []),
            tables=parsed_doc.get("tables", []),
            raw_text=cleaned_text,
            language=detected_lang,
            confidence=round(confidence, 2),
            processing_time=round(processing_time, 2)
        )

        return response_obj.model_dump()

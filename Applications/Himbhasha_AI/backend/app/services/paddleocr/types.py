from pydantic import BaseModel
from typing import Optional

class OCRResult(BaseModel):
    extracted_text: str
    confidence: float
    processing_time: float
    language: str
    success: bool
    error_message: Optional[str] = None

# Backwards compatibility model for endpoints.py routing
class OcrPayload(BaseModel):
    file_name: str
    content_base64: str
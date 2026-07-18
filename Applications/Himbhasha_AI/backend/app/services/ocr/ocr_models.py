from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class StructuredDocumentResponse(BaseModel):
    title: str = ""
    headings: List[str] = Field(default_factory=list)
    paragraphs: List[str] = Field(default_factory=list)
    tables: List[List[List[str]]] = Field(default_factory=list)
    raw_text: str = ""
    language: str = "Devanagari / English"
    confidence: float = 0.95
    processing_time: float = 0.0

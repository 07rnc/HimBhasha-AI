from typing import List, Optional
from pydantic import BaseModel, Field

class TranslationRequest(BaseModel):
    text: str = Field(..., description="Text to be translated")
    target_language: Optional[str] = Field(None, description="Optional target language (Hindi, English, Kangri)")
    source_language: Optional[str] = Field(None, description="Optional source language (Hindi, English, Kangri)")

class TranslationResponse(BaseModel):
    success: bool
    source_language: Optional[str] = None
    target_language: Optional[str] = None
    original_text: str
    translated_text: Optional[str] = None
    confidence: int = 0
    match_type: Optional[str] = None
    processing_time_ms: float = 0.0
    pronunciation: Optional[str] = ""
    related_words: List[str] = []
    source_dataset: Optional[str] = "dictionary"
    matched_entry: Optional[str] = ""
    message: Optional[str] = None
    suggestions: List[str] = []

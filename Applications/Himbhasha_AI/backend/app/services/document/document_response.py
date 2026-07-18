from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class DocumentAnalysisResponse(BaseModel):
    document_type: str = "General Document"
    title: str = ""
    summary: str = ""
    language: str = "Devanagari / English"
    confidence: int = 95
    keywords: List[str] = Field(default_factory=list)
    matched_dataset: str = "general"
    important_entities: List[str] = Field(default_factory=list)
    related_topics: List[str] = Field(default_factory=list)
    sections: List[Dict[str, Any]] = Field(default_factory=list)
    processing_time_ms: float = 0.0

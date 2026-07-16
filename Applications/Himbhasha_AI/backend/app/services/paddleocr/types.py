from pydantic import BaseModel
from typing import List

class OcrBoundingBox(BaseModel):
    points: List[List[float]]
    text: str
    confidence: float

class OcrPayload(BaseModel):
    file_name: str
    content_base64: str

class OcrResult(BaseModel):
    extracted_text: str
    boxes: List[OcrBoundingBox]
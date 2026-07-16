from pydantic import BaseModel
from typing import Optional

class GnaniSttRequest(BaseModel):
    audio_base64: str
    sampling_rate: int = 16000

class GnaniSttResponse(BaseModel):
    transcription: str
    confidence: float

class GnaniTtsRequest(BaseModel):
    text: str
    language: str = "hi-IN"

class GnaniTtsResponse(BaseModel):
    audio_base64: str
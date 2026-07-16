from pydantic import BaseModel
from typing import Optional

class GnaniSTTPayload(BaseModel):
    audio_base64: str
    sampling_rate: int = 16000

class GnaniTTSPayload(BaseModel):
    text: str
    language: str = "hi-IN"

class GnaniSpeechResult(BaseModel):
    transcription: Optional[str] = None
    audio_base64: Optional[str] = None
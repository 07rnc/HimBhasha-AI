from pydantic import BaseModel
from typing import Optional, List

class GeminiMessage(BaseModel):
    role: str  # "user" or "model"
    content: str

class GeminiChatPayload(BaseModel):
    contents: List[GeminiMessage]
    temperature: Optional[float] = 0.2

class GeminiChatResult(BaseModel):
    text: str
    candidates_count: int = 1
    model_version: str
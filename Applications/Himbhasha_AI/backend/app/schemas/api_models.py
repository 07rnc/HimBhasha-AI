from pydantic import BaseModel
from typing import Optional, List

# Chat models
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

# Translate models
class TranslateRequest(BaseModel):
    text: str
    source_lang: str  # "english", "hindi", "kangdi"
    target_lang: str  # "english", "hindi", "kangdi"

class TranslateResponse(BaseModel):
    translated_text: str
    pronunciation: Optional[str] = None
    source_lang: str
    target_lang: str

# Voice models
class VoiceRequest(BaseModel):
    audio_base64: str  # base64 encoded audio string

class VoiceResponse(BaseModel):
    transcription: str
    response: str
    audio_response_base64: str  # Mocked base64 response

# Document models
class DocumentRequest(BaseModel):
    file_name: str
    file_type: str  # "pdf", "image"
    content_base64: str
    action: str  # "summarize", "translate", "ask"
    question: Optional[str] = None

class DocumentResponse(BaseModel):
    result: str
    pages_processed: int

# Slashy Feedback models
class SlashyFeedbackRequest(BaseModel):
    type: str  # "feedback", "complaint", "moderation"
    title: str
    description: str

class SlashyFeedbackResponse(BaseModel):
    ticket_id: str
    status: str

# Preservation Contribution models
class ContributeRequest(BaseModel):
    type: str  # "vocabulary", "proverb", "story", "conversation", "song"
    title: str
    content: str
    age: Optional[int] = None
    gender: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    consent: bool
    audio_attached: bool

class ContributeResponse(BaseModel):
    status: str
    contribution_id: str

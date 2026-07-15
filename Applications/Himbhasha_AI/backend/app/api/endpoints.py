from fastapi import APIRouter, HTTPException
import uuid
from app.schemas.api_models import (
    ChatRequest, ChatResponse,
    TranslateRequest, TranslateResponse,
    VoiceRequest, VoiceResponse,
    DocumentRequest, DocumentResponse
)
from app.services.mock_data import (
    get_chat_response,
    get_translation,
    get_voice_response,
    process_document_action
)

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "HimBhasha AI Server"}

@router.post("/chat", response_model=ChatResponse)
def api_chat(payload: ChatRequest):
    try:
        response_text = get_chat_response(payload.message)
        session_id = payload.session_id or str(uuid.uuid4())
        return ChatResponse(response=response_text, session_id=session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/translate", response_model=TranslateResponse)
def api_translate(payload: TranslateRequest):
    try:
        translated, pronunciation = get_translation(
            payload.text, payload.source_lang, payload.target_lang
        )
        return TranslateResponse(
            translated_text=translated,
            pronunciation=pronunciation,
            source_lang=payload.source_lang,
            target_lang=payload.target_lang
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/voice", response_model=VoiceResponse)
def api_voice(payload: VoiceRequest):
    try:
        transcription, response, audio_out = get_voice_response(payload.audio_base64)
        return VoiceResponse(
            transcription=transcription,
            response=response,
            audio_response_base64=audio_out
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/document", response_model=DocumentResponse)
def api_document(payload: DocumentRequest):
    try:
        result = process_document_action(
            payload.file_name, payload.action, payload.question
        )
        return DocumentResponse(result=result, pages_processed=1)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

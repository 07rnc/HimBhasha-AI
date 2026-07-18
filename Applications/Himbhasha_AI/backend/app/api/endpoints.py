from fastapi import APIRouter, HTTPException, Depends
import uuid
import logging
from typing import Dict, Any
from app.services.gnani.client import GnaniClient

# Temporary dependency provider
def get_gnani_client():
    return GnaniClient()
from app.schemas.api_models import (
    ChatRequest, ChatResponse,
    TranslateRequest, TranslateResponse,
    VoiceRequest, VoiceResponse,
    DocumentRequest, DocumentResponse,
    SlashyFeedbackRequest, SlashyFeedbackResponse,
    ContributeRequest, ContributeResponse,
    VoiceRecordRequest, VoiceRecordResponse,
    VoiceTranscribeRequest, VoiceTranscribeResponse,
    VoiceSpeakRequest, VoiceSpeakResponse,
    VoiceStatusResponse
)

# Services Imports
from app.services.gemini.client import GeminiClient
from app.services.gemini.service import GeminiService
from app.services.gemini.types import GeminiChatPayload, GeminiMessage

from app.services.gnani.client import GnaniClient
from app.services.gnani.speech_to_text import GnaniSTTService
from app.services.gnani.text_to_speech import GnaniTTSService
from app.services.gnani.models import GnaniSttRequest, GnaniTtsRequest

from app.services.paddleocr.client import PaddleOCRClient
from app.services.paddleocr.service import PaddleOCRService
from app.services.paddleocr.types import OcrPayload

from app.services.mem0.client import Mem0Client
from app.services.mem0.service import Mem0Service
from app.services.mem0.types import MemorySearchPayload, MemoryUpdatePayload

from app.services.slashy.client import SlashyClient
from app.services.slashy.service import SlashyService
from app.services.slashy.types import SlashyTicketPayload

from app.services.keploy.client import KeployClient
from app.services.keploy.service import KeployService
from app.services.keploy.types import KeployTracePayload

logger = logging.getLogger("api_router")
router = APIRouter()

# Clients initialization
gemini_client = GeminiClient()
gnani_client = GnaniClient()
ocr_client = PaddleOCRClient()
mem0_client = Mem0Client()
slashy_client = SlashyClient()
keploy_client = KeployClient()

# Dependency Providers
def get_gemini_service() -> GeminiService:
    return GeminiService(gemini_client)

def get_gnani_stt_service() -> GnaniSTTService:
    return GnaniSTTService(gnani_client)

def get_gnani_tts_service() -> GnaniTTSService:
    return GnaniTTSService(gnani_client)

def get_ocr_service() -> PaddleOCRService:
    return PaddleOCRService(ocr_client)

def get_memory_service() -> Mem0Service:
    return Mem0Service(mem0_client)

def get_slashy_service() -> SlashyService:
    return SlashyService(slashy_client)

def get_keploy_service() -> KeployService:
    return KeployService(keploy_client)


from app.services.knowledge.knowledge_service import KnowledgeService

# Global Singleton Instances
knowledge_service_instance = KnowledgeService()

def get_knowledge_service() -> KnowledgeService:
    return knowledge_service_instance

@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "HimBhasha AI Server"}


@router.post("/chat", response_model=ChatResponse)
async def api_chat(
    payload: ChatRequest,
    knowledge_svc: KnowledgeService = Depends(get_knowledge_service),
    keploy_svc: KeployService = Depends(get_keploy_service)
):
    try:
        session_id = payload.session_id or str(uuid.uuid4())
        
        # 1. Query KnowledgeService
        knowledge_res = knowledge_svc.query(payload.message)
        
        if knowledge_res.get("success") is False:
            response_text = knowledge_res.get("message", "I couldn't find this information in the offline knowledge base.")
        else:
            response_text = knowledge_res.get("answer", "")

        response_body = {"response": response_text, "session_id": session_id}

        # 2. Keploy test recording hooks
        await keploy_svc.capture_test_case(
            KeployTracePayload(
                method="POST",
                endpoint="/chat",
                request_headers={},
                request_body=payload.dict(),
                response_body=response_body,
                status_code=200
            )
        )

        return ChatResponse(**response_body)
    except Exception as e:
        logger.error(f"Chat API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/translate", response_model=TranslateResponse)
async def api_translate(
    payload: TranslateRequest,
    gemini_svc: GeminiService = Depends(get_gemini_service),
    keploy_svc: KeployService = Depends(get_keploy_service)
):
    try:
        # Translate via Gemini service stub
        translated, pronunciation = await gemini_svc.translate_text(
            payload.text, payload.source_lang, payload.target_lang
        )

        response_body = {
            "translated_text": translated,
            "pronunciation": pronunciation,
            "source_lang": payload.source_lang,
            "target_lang": payload.target_lang
        }

        # Keploy recording
        await keploy_svc.capture_test_case(
            KeployTracePayload(
                method="POST",
                endpoint="/translate",
                request_headers={},
                request_body=payload.dict(),
                response_body=response_body,
                status_code=200
            )
        )

        return TranslateResponse(**response_body)
    except Exception as e:
        logger.error(f"Translate API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/voice", response_model=VoiceResponse)
async def api_voice(
    payload: VoiceRequest,
    gemini_svc: GeminiService = Depends(get_gemini_service),
    gnani_stt: GnaniSTTService = Depends(get_gnani_stt_service),
    gnani_tts: GnaniTTSService = Depends(get_gnani_tts_service),
    keploy_svc: KeployService = Depends(get_keploy_service)
):
    try:
        # 1. Gnani STT Transcription
        stt_res = await gnani_stt.transcribe(
            GnaniSttRequest(audio_base64=payload.audio_base64)
        )
        transcription = stt_res.transcription or "तुहाड़ा क्या हाल है?"

        # 2. Gemini Response generation
        # TODO: Replace mocked response with Gemini-generated content after Sprint 7.
        gemini_res = await gemini_svc.generate_content(transcription)
        response_text = gemini_res.text

        # 3. Gnani TTS speech synthesis
        tts_res = await gnani_tts.synthesize(
            GnaniTtsRequest(text=response_text)
        )
        audio_out = tts_res.audio_base64 or ""

        response_body = {
            "transcription": transcription,
            "response": response_text,
            "audio_response_base64": audio_out
        }

        # Keploy recording
        await keploy_svc.capture_test_case(
            KeployTracePayload(
                method="POST",
                endpoint="/voice",
                request_headers={},
                request_body=payload.dict(),
                response_body=response_body,
                status_code=200
            )
        )

        return VoiceResponse(**response_body)
    except Exception as e:
        logger.error(f"Voice API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/document", response_model=DocumentResponse)
async def api_document(
    payload: DocumentRequest,
    ocr_svc: PaddleOCRService = Depends(get_ocr_service),
    gemini_svc: GeminiService = Depends(get_gemini_service),
    keploy_svc: KeployService = Depends(get_keploy_service)
):
    try:
        # 1. OCR text extraction from document
        ocr_res = await ocr_svc.extract_text(
            OcrPayload(file_name=payload.file_name, content_base64=payload.content_base64)
        )
        
        # 2. Process query context via Gemini model reasoning
        prompt = f"Action: {payload.action}. Text extracted: {ocr_res.extracted_text}."
        if payload.question:
            prompt += f" Question: {payload.question}"
            
        gemini_res = await gemini_svc.generate_content(prompt)

        response_body = {
            "result": gemini_res.text,
            "pages_processed": 1
        }

        # Keploy recording
        await keploy_svc.capture_test_case(
            KeployTracePayload(
                method="POST",
                endpoint="/document",
                request_headers={},
                request_body=payload.dict(),
                response_body=response_body,
                status_code=200
            )
        )

        return DocumentResponse(**response_body)
    except Exception as e:
        logger.error(f"Document API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/feedback", response_model=SlashyFeedbackResponse)
async def api_feedback(
    payload: SlashyFeedbackRequest,
    slashy_svc: SlashyService = Depends(get_slashy_service),
    keploy_svc: KeployService = Depends(get_keploy_service)
):
    try:
        # Create ticket in Slashy workflow stub
        ticket_res = await slashy_svc.create_workflow_ticket(
            SlashyTicketPayload(
                type=payload.type,
                title=payload.title,
                description=payload.description
            )
        )

        response_body = {
            "ticket_id": ticket_res.ticket_id,
            "status": ticket_res.status
        }

        # Keploy recording
        await keploy_svc.capture_test_case(
            KeployTracePayload(
                method="POST",
                endpoint="/feedback",
                request_headers={},
                request_body=payload.dict(),
                response_body=response_body,
                status_code=200
            )
        )

        return SlashyFeedbackResponse(**response_body)
    except Exception as e:
        logger.error(f"Feedback API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/contribute", response_model=ContributeResponse)
async def api_contribute(
    payload: ContributeRequest,
    slashy_svc: SlashyService = Depends(get_slashy_service),
    keploy_svc: KeployService = Depends(get_keploy_service)
):
    try:
        # Register a moderation review workflow ticket with Slashy Service
        title = f"Preserve: {payload.title}"
        description = (
            f"Type: {payload.type}\n"
            f"Content: {payload.content}\n"
            f"Speaker Demographics - District: {payload.district or 'N/A'}, "
            f"Village: {payload.village or 'N/A'}, Age: {payload.age or 'N/A'}, "
            f"Gender: {payload.gender or 'N/A'}\n"
            f"Consent given: {payload.consent}, Audio attached: {payload.audio_attached}"
        )
        
        ticket_res = await slashy_svc.create_workflow_ticket(
            SlashyTicketPayload(
                type="moderation",
                title=title,
                description=description
            )
        )
        logger.info(f"Registered contribution verification ticket ID: {ticket_res.ticket_id}")

        contribution_id = f"contrib_{str(uuid.uuid4())[:8]}"
        response_body = {
            "status": "success",
            "contribution_id": contribution_id
        }

        # Keploy test capturing
        await keploy_svc.capture_test_case(
            KeployTracePayload(
                method="POST",
                endpoint="/contribute",
                request_headers={},
                request_body=payload.dict(),
                response_body=response_body,
                status_code=200
            )
        )

        return ContributeResponse(**response_body)
    except Exception as e:
        logger.error(f"Contribute API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/v1/voice/record", response_model=VoiceRecordResponse)
async def api_voice_record(
    payload: VoiceRecordRequest,
    keploy_svc: KeployService = Depends(get_keploy_service)
):
    try:
        session_id = payload.session_id or str(uuid.uuid4())
        response_body = {
            "status": "success",
            "session_id": session_id
        }

        # Log trace to Keploy
        await keploy_svc.capture_test_case(
            KeployTracePayload(
                method="POST",
                endpoint="/v1/voice/record",
                request_headers={},
                request_body=payload.dict(),
                response_body=response_body,
                status_code=200
            )
        )
        return VoiceRecordResponse(**response_body)
    except Exception as e:
        logger.error(f"Voice Record API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/v1/voice/transcribe", response_model=VoiceTranscribeResponse)
async def api_voice_transcribe(
    payload: VoiceTranscribeRequest,
    gnani_stt: GnaniSTTService = Depends(get_gnani_stt_service),
    keploy_svc: KeployService = Depends(get_keploy_service)
):
    try:
        # Pass payload to restructured Gnani STT service class
        stt_payload = GnaniSttRequest(
            audio_base64=payload.audio_base64,
            sampling_rate=payload.sampling_rate or 16000
        )
        stt_res = await gnani_stt.transcribe(stt_payload)

        response_body = {
            "transcription": stt_res.transcription,
            "confidence": stt_res.confidence
        }

        # Log trace to Keploy
        await keploy_svc.capture_test_case(
            KeployTracePayload(
                method="POST",
                endpoint="/v1/voice/transcribe",
                request_headers={},
                request_body=payload.dict(),
                response_body=response_body,
                status_code=200
            )
        )
        return VoiceTranscribeResponse(**response_body)
    except Exception as e:
        logger.error(f"Voice Transcribe API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/v1/voice/speak", response_model=VoiceSpeakResponse)
async def api_voice_speak(
    payload: VoiceSpeakRequest,
    gnani_tts: GnaniTTSService = Depends(get_gnani_tts_service),
    keploy_svc: KeployService = Depends(get_keploy_service)
):
    try:
        # Pass payload to restructured Gnani TTS service class
        tts_payload = GnaniTtsRequest(
            text=payload.text,
            language=payload.language or "hi-IN"
        )
        tts_res = await gnani_tts.synthesize(tts_payload)

        response_body = {
            "audio_base64": tts_res.audio_base64
        }

        # Log trace to Keploy
        await keploy_svc.capture_test_case(
            KeployTracePayload(
                method="POST",
                endpoint="/v1/voice/speak",
                request_headers={},
                request_body=payload.dict(),
                response_body=response_body,
                status_code=200
            )
        )
        return VoiceSpeakResponse(**response_body)
    except Exception as e:
        logger.error(f"Voice Speak API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/v1/voice/status", response_model=VoiceStatusResponse)
async def api_voice_status(
    gnani_client: GnaniClient = Depends(get_gnani_client)
):
    try:
        healthy = gnani_client.is_healthy()
        return VoiceStatusResponse(
            status="healthy" if healthy else "error",
            service="Gnani Speech Engine",
            health=healthy
        )
    except Exception as e:
        logger.error(f"Voice Status API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, HTTPException, Depends
import uuid
import logging
from typing import Dict, Any, Optional, List
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


from app.services.translation.translation_service import TranslationService
from app.services.ocr.service import DocumentReaderService

translation_service_instance = TranslationService()
document_reader_service_instance = DocumentReaderService()

@router.post("/translate")
async def api_translate(
    payload: TranslateRequest,
    keploy_svc: KeployService = Depends(get_keploy_service)
):
    try:
        res = translation_service_instance.translate(
            text=payload.text,
            target_language=payload.target_lang,
            source_language=payload.source_lang
        )

        response_body = {
            "translated_text": res.get("translated_text", ""),
            "pronunciation": res.get("pronunciation", ""),
            "source_lang": res.get("source_language", payload.source_lang),
            "target_lang": res.get("target_language", payload.target_lang),
            "confidence": res.get("confidence", 95),
            "category": res.get("category", "General"),
            "source": res.get("source", "Offline Dictionary"),
            "related_words": res.get("related_words", [])
        }

        return response_body
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

        return VoiceResponse(**response_body)
    except Exception as e:
        logger.error(f"Voice API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


from app.services.document.document_analyzer import DocumentAnalyzer
from app.services.document.document_qa import DocumentQAEngine

document_analyzer_instance = DocumentAnalyzer(knowledge_service_instance)

@router.post("/document")
async def api_document(
    payload: DocumentRequest,
    keploy_svc: KeployService = Depends(get_keploy_service)
):
    try:
        # 1. Structured Document OCR Reader Processing
        doc_result = document_reader_service_instance.process_document(
            content_base64=payload.content_base64,
            file_name=payload.file_name
        )

        # 2. Intelligent Offline Document Understanding & Knowledge Search
        analysis = document_analyzer_instance.analyze_document(doc_result)

        qa_answer = None
        if payload.question and payload.question.strip():
            qa_answer = DocumentQAEngine.answer_question(payload.question, {**doc_result, **analysis})

        return {
            "result": doc_result.get("raw_text", ""),
            "document_type": analysis.get("document_type", "General Document"),
            "title": analysis.get("title", doc_result.get("title", "Document Notice")),
            "summary": analysis.get("summary", ""),
            "language": doc_result.get("language", "Devanagari / English"),
            "confidence": analysis.get("confidence", 95),
            "keywords": analysis.get("keywords", []),
            "matched_dataset": analysis.get("matched_dataset", "general"),
            "important_entities": analysis.get("important_entities", []),
            "related_topics": analysis.get("related_topics", []),
            "sections": analysis.get("sections", []),
            "headings": doc_result.get("headings", []),
            "paragraphs": doc_result.get("paragraphs", []),
            "tables": doc_result.get("tables", []),
            "qa_answer": qa_answer,
            "processing_time": doc_result.get("processing_time", 0.45),
            "pages_processed": 1
        }
    except Exception as e:
        logger.error(f"Document API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/document/qa")
async def api_document_qa(payload: Dict[str, Any]):
    try:
        question = payload.get("question", "")
        doc_data = payload.get("doc_data", {})
        qa_res = DocumentQAEngine.answer_question(question, doc_data)
        return qa_res
    except Exception as e:
        logger.error(f"Document QA API error: {e}")
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


from app.services.contributions.contribution_service import ContributionService
from app.services.contributions.schemas import ContributionCreateRequest, ContributionRejectRequest

contribution_service_instance = ContributionService()

@router.post("/contributions")
async def create_contribution(payload: ContributionCreateRequest):
    try:
        success, msg, model = contribution_service_instance.submit_contribution(payload)
        if not success:
            raise HTTPException(status_code=400, detail=msg)
        return {"success": True, "message": msg, "data": model.model_dump() if model else None}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating contribution: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/contributions")
async def get_contributions(
    status: Optional[str] = None,
    type_filter: Optional[str] = None,
    district_filter: Optional[str] = None,
    search_query: Optional[str] = None
):
    try:
        items = contribution_service_instance.get_contributions(
            status=status,
            type_filter=type_filter,
            district_filter=district_filter,
            search_query=search_query
        )
        return {"success": True, "count": len(items), "data": [item.model_dump() for item in items]}
    except Exception as e:
        logger.error(f"Error fetching contributions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/contributions/pending")
async def get_pending_contributions():
    try:
        items = contribution_service_instance.get_contributions(status="pending")
        return {"success": True, "count": len(items), "data": [item.model_dump() for item in items]}
    except Exception as e:
        logger.error(f"Error fetching pending contributions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/contributions/approved")
async def get_approved_contributions():
    try:
        items = contribution_service_instance.get_contributions(status="approved")
        return {"success": True, "count": len(items), "data": [item.model_dump() for item in items]}
    except Exception as e:
        logger.error(f"Error fetching approved contributions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/contributions/{item_id}/approve")
async def approve_contribution(item_id: str):
    try:
        approved = contribution_service_instance.approve_contribution(item_id)
        if not approved:
            raise HTTPException(status_code=404, detail="Contribution ID not found.")
        return {"success": True, "message": "Contribution approved successfully.", "data": approved.model_dump()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error approving contribution {item_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/contributions/{item_id}/reject")
async def reject_contribution(item_id: str, payload: Optional[ContributionRejectRequest] = None):
    try:
        reason = payload.reason if payload else "Does not meet guidelines"
        rejected = contribution_service_instance.reject_contribution(item_id, reason)
        if not rejected:
            raise HTTPException(status_code=404, detail="Contribution ID not found.")
        return {"success": True, "message": "Contribution rejected.", "data": rejected.model_dump()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error rejecting contribution {item_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/contributions/{item_id}")
async def delete_contribution(item_id: str):
    try:
        deleted = contribution_service_instance.delete_contribution(item_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Contribution ID not found.")
        return {"success": True, "message": "Contribution deleted successfully."}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting contribution {item_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/contributions/export")
async def export_contributions(format: str = "json", status: Optional[str] = None):
    try:
        content, filename = contribution_service_instance.export_contributions(format_type=format, status=status)
        media_type = "text/csv" if format.lower() == "csv" else "application/json"
        return {"success": True, "filename": filename, "content": content, "format": format}
    except Exception as e:
        logger.error(f"Error exporting contributions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/statistics")
async def get_statistics():
    try:
        stats = contribution_service_instance.get_statistics()
        return {"success": True, "data": stats}
    except Exception as e:
        logger.error(f"Error fetching statistics: {e}")
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

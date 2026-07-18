import time
import logging
from typing import Dict, Any, List, Optional

from .question_matcher import QuestionMatcher
from .context_builder import ContextBuilder

logger = logging.getLogger("document_qa")

class DocumentQAEngine:
    """Offline Document Question Answering engine with section matching and 3 related question suggestions."""

    RELATED_SUGGESTIONS = {
        "summary": ["Who is eligible?", "What are the benefits?", "What documents are required?"],
        "eligibility": ["What documents are required?", "What is the application process?", "What are the benefits?"],
        "documents": ["Who is eligible?", "What is the application process?", "When was this issued?"],
        "benefits": ["Who is eligible?", "What documents are required?", "Summarize this document."],
        "issuer": ["When was this issued?", "What is this document about?", "Who is eligible?"],
        "diseases": ["What crops are mentioned?", "What treatment is recommended?", "Summarize this document."],
        "crops": ["What diseases are mentioned?", "Who is eligible?", "What are the benefits?"],
        "general": ["Summarize this document.", "Who is eligible?", "What are the benefits?"]
    }

    @staticmethod
    def answer_question(question: str, doc_data: Dict[str, Any]) -> Dict[str, Any]:
        """Answers document question offline using keyword matching and context extraction in <100ms."""
        start_time = time.time()
        q_text = question.strip()

        title = doc_data.get("title", "Document")
        paragraphs = doc_data.get("paragraphs", [])
        headings = doc_data.get("headings", [])
        raw_text = doc_data.get("raw_text", "")
        summary = doc_data.get("summary", "")

        # Step 1: Intent Matching (<10ms)
        intent, intent_score = QuestionMatcher.match_question_intent(q_text)

        # Step 2: Context Extraction (<20ms)
        best_para, matched_heading, conf_score = ContextBuilder.build_relevant_context(
            question=q_text,
            intent=intent,
            paragraphs=paragraphs,
            headings=headings,
            raw_text=raw_text
        )

        # Step 3: Synthesize Answer Response
        if intent == "summary":
            answer = summary if summary else f"**{title}**: {best_para}"
        elif intent == "eligibility":
            answer = f"**Eligibility Criteria**: {best_para}"
        elif intent == "benefits":
            answer = f"**Document Benefits**: {best_para}"
        elif intent == "documents":
            answer = f"**Required Documents**: {best_para}"
        elif intent == "issuer":
            answer = f"**Issuing Authority**: {best_para}"
        else:
            answer = f"**Section ({matched_heading})**: {best_para}"

        related_qs = DocumentQAEngine.RELATED_SUGGESTIONS.get(intent, DocumentQAEngine.RELATED_SUGGESTIONS["general"])
        proc_time_ms = round((time.time() - start_time) * 1000, 2)

        logger.info(f"DocumentQA completed in {proc_time_ms}ms (Intent: {intent}, Conf: {int(conf_score * 100)}%)")

        return {
            "success": True,
            "question": q_text,
            "answer": answer,
            "matched_section": matched_heading,
            "confidence": int(conf_score * 100),
            "source": "Offline Document Engine",
            "related_topics": doc_data.get("related_topics", []),
            "related_questions": related_qs,
            "processing_time_ms": proc_time_ms
        }

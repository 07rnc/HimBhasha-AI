import re
import logging
from typing import Dict, Any, List, Tuple

try:
    from rapidfuzz import fuzz
    HAS_RAPIDFUZZ = True
except ImportError:
    HAS_RAPIDFUZZ = False

logger = logging.getLogger("question_matcher")

class QuestionMatcher:
    """Classifies user document questions into offline document intent categories."""

    QA_PATTERNS = {
        "summary": ["summarize", "summary", "what is this document about", "overview", "सारांश"],
        "eligibility": ["eligible", "eligibility", "who can apply", "पात्रता", "कौन पात्र है"],
        "documents": ["documents required", "required documents", "dastavej", "दस्तावेज़", "क्या दस्तावेज़ चाहिए"],
        "benefits": ["benefits", "advantage", "subsidy amount", "लाभ", "फायदे", "कितना अनुदान"],
        "issuer": ["who issued", "issuing authority", "department", "विभाग", "किसने जारी किया"],
        "date": ["issued date", "when was this issued", "date of notice", "दिनांक", "तारीख"],
        "application": ["application process", "how to apply", "procedure", "आवेदन प्रक्रिया", "कैसे आवेदन करें"],
        "diseases": ["disease", "pest", "symptoms", "treatment", "रोग", "बीमारी", "इलाज"],
        "crops": ["crop", "harvest", "seed", "wheat", "rice", "apple", "फसल", "खेती"],
        "translate": ["translate", "translation", "hindi translation", "अनुवाद", "भाषा"]
    }

    @staticmethod
    def match_question_intent(question: str) -> Tuple[str, float]:
        """Matches user query to document intent with similarity score in <10ms."""
        q_clean = question.lower().strip()
        if not q_clean:
            return "general", 0.0

        best_intent = "general"
        best_score = 0.40

        for intent, patterns in QuestionMatcher.QA_PATTERNS.items():
            for pat in patterns:
                if pat in q_clean:
                    return intent, 0.95

                if HAS_RAPIDFUZZ:
                    sim = fuzz.partial_ratio(pat, q_clean) / 100.0
                    if sim > best_score:
                        best_score = sim
                        best_intent = intent

        logger.info(f"QuestionMatched: '{question}' -> Intent: '{best_intent}' (Score: {best_score:.2f})")
        return best_intent, round(best_score, 2)

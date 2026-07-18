import re
import logging
from typing import Dict, Any, List, Tuple

try:
    from rapidfuzz import fuzz
    HAS_RAPIDFUZZ = True
except ImportError:
    HAS_RAPIDFUZZ = False

logger = logging.getLogger("context_builder")

class ContextBuilder:
    """Ranks and extracts the most relevant paragraph, section heading, or table row from document context."""

    INTENT_KEYWORDS = {
        "eligibility": ["eligible", "eligibility", "criteria", "farmer", "resident", "पात्रता", "पात्र"],
        "documents": ["document", "aadhaar", "certificate", "land", "patwari", "दस्तावेज़", "प्रमाण पत्र"],
        "benefits": ["benefit", "subsidy", "rs", "rupees", "financial", "assistance", "अनुदान", "राशि", "लाभ"],
        "issuer": ["government", "department", "office", "authority", "panchayat", "विभाग", "कार्यालय", "सरकार"],
        "date": ["date", "notice no", "dated", "2026", "2025", "दिनांक", "तिथि"],
        "application": ["apply", "online", "offline", "form", "portal", "submit", "आवेदन", "फॉर्म"],
        "diseases": ["disease", "yellow rust", "pest", "spray", "fungicide", "रोग", "बीमारी", "इलाज"],
        "crops": ["crop", "wheat", "rice", "apple", "seed", "fertilizer", "फसल", "खेती", "बीज"]
    }

    @staticmethod
    def build_relevant_context(
        question: str,
        intent: str,
        paragraphs: List[str],
        headings: List[str],
        raw_text: str
    ) -> Tuple[str, str, float]:
        """Finds the most relevant section/paragraph matching user question in <20ms."""

        if not paragraphs and not raw_text:
            return "Document content unavailable.", "General", 0.30

        candidates = paragraphs if paragraphs else [raw_text]
        target_kws = ContextBuilder.INTENT_KEYWORDS.get(intent, [w.lower() for w in question.split() if len(w) > 2])

        best_para = candidates[0]
        best_heading = headings[0] if headings else "Document Text"
        best_score = 0.0

        for para in candidates:
            score = 0.0
            para_lower = para.lower()

            for kw in target_kws:
                if kw in para_lower:
                    score += 0.35

            if HAS_RAPIDFUZZ:
                sim = fuzz.partial_ratio(question.lower(), para_lower) / 100.0
                score += sim * 0.50

            if score > best_score:
                best_score = score
                best_para = para

        # Match corresponding heading
        for h in headings:
            if any(kw in h.lower() for kw in target_kws):
                best_heading = h
                break

        confidence = round(min(max(best_score, 0.70), 0.98), 2)
        return best_para, best_heading, confidence

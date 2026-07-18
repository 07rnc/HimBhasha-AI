import re
import logging
from typing import Tuple, List, Dict

try:
    from rapidfuzz import fuzz
    HAS_RAPIDFUZZ = True
except ImportError:
    HAS_RAPIDFUZZ = False

logger = logging.getLogger("document_classifier")

class DocumentClassifier:
    """Offline rule-based classifier determining document type from title, headings, and keywords."""

    CLASSIFIER_RULES = {
        "Government Scheme": {
            "keywords": ["yojana", "scheme", "subsidy", "pm kisan", "polyhouse", "pradhan mantri", "योजना", "सरकारी", "अनुदान"],
            "regex": [r"\b(yojana|scheme|subsidy|pm kisan|polyhouse)\b", r"योजना|सरकारी"]
        },
        "Government Notice": {
            "keywords": ["government", "notice", "department", "order", "circular", "panchayat", "sarkar", "सूचना", "विभाग", "कार्यालय"],
            "regex": [r"\b(notice|circular|department|order|panchayat)\b", r"सूचना|अधिसूचना|विभाग"]
        },
        "Agriculture Advisory": {
            "keywords": ["crop", "farm", "farming", "wheat", "rice", "apple", "seb", "soil", "fertilizer", "pest", "yellow rust", "harvest", "kheti", "खेती", "फसल", "बीज", "खाद"],
            "regex": [r"\b(crop|farm|farming|wheat|rice|apple|pest|yellow rust|soil)\b", r"खेती|फसल|बीज|खाद"]
        },
        "Healthcare Notice": {
            "keywords": ["hospital", "doctor", "health", "disease", "vaccination", "medicine", "clinic", "patient", "अस्पताल", "स्वास्थ्य", "बीमारी", "दवाई", "टीकाकरण"],
            "regex": [r"\b(hospital|doctor|health|disease|vaccine|medicine|clinic)\b", r"अस्पताल|स्वास्थ्य|बीमारी|दवाई"]
        },
        "Educational Circular": {
            "keywords": ["school", "university", "college", "examination", "syllabus", "student", "teacher", "course", "पढ़ाई", "शिक्षा", "परीक्षा", "विश्वविद्यालय"],
            "regex": [r"\b(school|university|college|exam|examination|student|course)\b", r"शिक्षा|परीक्षा|विद्यार्थी"]
        },
        "Tourism Information": {
            "keywords": ["tourist", "tourism", "visiting hours", "temple", "fort", "valley", "destination", "hotel", "पर्यटन", "मंदिर", "किल्ला", "घाट"],
            "regex": [r"\b(tourist|tourism|visit|temple|fort|valley|destination)\b", r"पर्यटन|मंदिर|किला"]
        },
        "Dictionary Page": {
            "keywords": ["dictionary", "pronunciation", "meaning", "noun", "verb", "adjective", "synonym", "अर्थ", "शब्दкоश"],
            "regex": [r"\b(dictionary|meaning|pronunciation|noun|verb|adjective)\b", r"अर्थ|शब्दकोश"]
        }
    }

    @staticmethod
    def classify_document(title: str, text: str) -> Tuple[str, float, List[str]]:
        """Classifies document content into a supported document type with confidence score."""
        combined_text = f"{title} {text}".lower().strip()
        if not combined_text:
            return "Unknown", 0.0, []

        best_doc_type = "General Document"
        best_score = 0.40
        matched_keywords: List[str] = []

        for doc_type, rules in DocumentClassifier.CLASSIFIER_RULES.items():
            score = 0.0
            type_kws: List[str] = []

            for regex in rules["regex"]:
                if re.search(regex, combined_text, re.IGNORECASE):
                    score = max(score, 0.85)

            for kw in rules["keywords"]:
                if kw in combined_text:
                    score = max(score, 0.90 if len(kw) > 3 else 0.80)
                    type_kws.append(kw)

            if score > best_score:
                best_score = score
                best_doc_type = doc_type
                matched_keywords = type_kws

        logger.info(f"DocumentClassified: '{best_doc_type}' | Confidence: {best_score:.2f}")
        return best_doc_type, round(best_score, 2), list(dict.fromkeys(matched_keywords))

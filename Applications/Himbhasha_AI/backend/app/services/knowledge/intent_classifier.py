import re
import logging
from typing import Tuple, List, Dict

try:
    from rapidfuzz import fuzz
    HAS_RAPIDFUZZ = True
except ImportError:
    HAS_RAPIDFUZZ = False

logger = logging.getLogger("intent_classifier")

class IntentClassifier:
    """Lightweight rule-based offline intent classifier using regex, keyword rules, and rapidfuzz."""

    INTENT_PATTERNS = {
        "Greeting": {
            "keywords": ["बंदगी", "राम राम", "नमस्ते", "नमस्कार", "hello", "hi", "hey", "greetings", "good morning", "good evening", "खुश रहो", "आओ जी", "हाल"],
            "regex": [r"\b(hello|hi|hey|greetings|namaste|ram ram)\b", r"बंदगी|नमस्ते|नमस्कार"]
        },
        "Translation": {
            "keywords": ["translate", "translation", "अनुवाद", "कांगड़ी में", "हिंदी में", "अंग्रेजी में", "meaning of", "in hindi", "in english", "in kangri"],
            "regex": [r"\b(translate|translation|in hindi|in english|in kangri)\b", r"अनुवाद|कांगड़ी"]
        },
        "Dictionary": {
            "keywords": ["dictionary", "meaning", "definition", "अर्थ", "मतलब", "शब्द", "word", "pronunciation"],
            "regex": [r"\b(meaning|definition|dict|dictionary)\b", r"अर्थ|मतलब|शब्द"]
        },
        "Government": {
            "keywords": ["pm kisan", "yojana", "scheme", "subsidy", "government", "sarkar", "panchayat", "pradhan", "patwari", "kuchhari", "babu", "law", "certificate", "पेंशन", "योजना", "सरकारी"],
            "regex": [r"\b(yojana|scheme|subsidy|pm kisan|government|panchayat|sarpanch)\b", r"योजना|सरकारी|पेंशन"]
        },
        "Agriculture": {
            "keywords": ["crop", "farm", "farming", "wheat", "rice", "apple", "seb", "soil", "fertilizer", "pest", "yellow rust", "rust", "harvest", "plow", "kheti", "खेती", "फसल", "बीज", "खाद", "मक्की", "कनक"],
            "regex": [r"\b(crop|farm|farming|wheat|rice|apple|seb|soil|fertilizer|rust|harvest)\b", r"खेती|फसल|बीज|खाद|मक्की|कनक"]
        },
        "Healthcare": {
            "keywords": ["hospital", "doctor", "fever", "medicine", "health", "disease", "symptom", "pain", "headache", "stomachache", "clinic", "वैद्य", "अस्पताल", "बीमारी", "दवाई", "बुखार", "दर्द"],
            "regex": [r"\b(hospital|doctor|fever|medicine|health|disease|symptom|pain|clinic)\b", r"अस्पताल|बीमारी|दवाई|बुखार|दर्द"]
        },
        "Education": {
            "keywords": ["school", "university", "college", "course", "study", "education", "teacher", "student", "book", "hpu", "iit mandi", "स्कूल", "पढ़ाई", "शिक्षा", "किताब", "गुरु"],
            "regex": [r"\b(school|university|college|course|study|education|teacher|student)\b", r"स्कूल|पढ़ाई|शिक्षा|किताब"]
        },
        "Culture": {
            "keywords": ["dham", "mela", "nati", "dance", "festival", "culture", "tradition", "song", "attire", "pattu", "minjar", "sair", "lohri", "dussehra", "शिवरात्रि", "धाम", "मेला", "नाटी", "लोकगीत", "संस्कृति"],
            "regex": [r"\b(dham|mela|nati|dance|festival|culture|tradition|song)\b", r"धाम|मेला|नाटी|लोकगीत|संस्कृति|शिवरात्रि"]
        },
        "Tourism": {
            "keywords": ["fort", "visit", "tourist", "tourism", "place", "temple", "valley", "kangra fort", "mcleodganj", "dharamshala", "kullu", "manali", "किला", "पर्यटन", "मंदिर", "घाटी"],
            "regex": [r"\b(fort|visit|tourist|tourism|place|temple|valley|dharamshala|manali)\b", r"किला|पर्यटन|मंदिर|घाटी"]
        },
        "FAQ": {
            "keywords": ["what is himbhasha", "who created", "about", "help", "faq", "faq_001", "assistance"],
            "regex": [r"\b(what is himbhasha|about himbhasha|help|faq)\b"]
        },
        "OCR": {
            "keywords": ["ocr", "scan", "document", "pdf", "read image", "extract text"],
            "regex": [r"\b(ocr|scan|document|extract text)\b"]
        }
    }

    INTENT_TO_DATASETS: Dict[str, List[str]] = {
        "Greeting": ["dictionary", "phrases"],
        "Translation": ["dictionary", "phrases"],
        "Dictionary": ["dictionary"],
        "Government": ["government"],
        "Agriculture": ["agriculture"],
        "Healthcare": ["healthcare"],
        "Education": ["education"],
        "Culture": ["culture"],
        "Tourism": ["tourism"],
        "FAQ": ["faq"],
        "OCR": ["dictionary"],
        "General Search": ["dictionary", "phrases", "faq", "government", "agriculture", "healthcare", "culture", "education", "tourism"],
        "Unknown": ["dictionary", "phrases", "faq", "government", "agriculture", "healthcare", "culture", "education", "tourism"]
    }

    def classify(self, text: str) -> Tuple[str, float, List[str]]:
        """Classifies input query into an intent, confidence score, and target dataset list."""
        if not text or not text.strip():
            return "Unknown", 0.0, self.INTENT_TO_DATASETS["Unknown"]

        text_clean = text.strip().lower()
        best_intent = "Unknown"
        best_score = 0.0

        for intent, patterns in self.INTENT_PATTERNS.items():
            score = 0.0

            # 1. Regex Match Rule
            for regex in patterns["regex"]:
                if re.search(regex, text_clean, re.IGNORECASE):
                    score = max(score, 0.85)

            # 2. Keyword Match Rule
            for kw in patterns["keywords"]:
                if kw in text_clean:
                    score = max(score, 0.90 if len(kw) > 3 else 0.80)

            # 3. Fuzzy Ratio Match Rule
            if score < 0.70 and HAS_RAPIDFUZZ:
                for kw in patterns["keywords"]:
                    sim = fuzz.partial_ratio(text_clean, kw) / 100.0
                    if sim >= 0.75:
                        score = max(score, float(sim) * 0.80)

            if score > best_score:
                best_score = score
                best_intent = intent

        if best_score < 0.50:
            best_intent = "General Search"
            best_score = 0.40

        target_datasets = self.INTENT_TO_DATASETS.get(best_intent, self.INTENT_TO_DATASETS["Unknown"])
        logger.info(f"Intent Classified: '{best_intent}' | Confidence: {best_score:.2f} | Datasets: {target_datasets}")

        return best_intent, round(best_score, 2), target_datasets

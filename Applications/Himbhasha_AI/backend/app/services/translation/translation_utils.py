import re
from typing import Tuple, List, Set

def normalize_text(text: str) -> str:
    """Normalizes input text by trimming whitespace, stripping punctuation, and lowercasing non-Devanagari text."""
    if not text:
        return ""
    text_clean = text.strip()
    # Strip common leading/trailing punctuation marks
    text_clean = re.sub(r"^[^\w\s\u0900-\u097F]+|[^\w\s\u0900-\u097F]+$", "", text_clean)
    return text_clean

def is_devanagari(text: str) -> bool:
    """Returns True if text contains Devanagari script characters."""
    return bool(re.search(r"[\u0900-\u097F]", text))

def is_ascii_english(text: str) -> bool:
    """Returns True if text contains Latin / English alphabet characters."""
    return bool(re.search(r"[a-zA-Z]", text))

def detect_language(text: str, kangri_words: Set[str], hindi_words: Set[str]) -> str:
    """Detects source language (Kangri, Hindi, or English) automatically."""
    clean = normalize_text(text)
    if not clean:
        return "Unknown"

    if is_ascii_english(clean):
        return "English"

    if is_devanagari(clean):
        clean_lower = clean.lower()
        # Check against Kangri dictionary set
        if clean_lower in kangri_words:
            return "Kangri"
        # Check against Hindi dictionary set
        if clean_lower in hindi_words:
            return "Hindi"
        # Default Devanagari to Kangri if unknown
        return "Kangri"

    return "English"

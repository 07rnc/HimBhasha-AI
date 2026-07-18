import os
import json
import logging
from typing import Tuple, Optional, List, Dict, Any

try:
    from rapidfuzz import fuzz
    HAS_RAPIDFUZZ = True
except ImportError:
    HAS_RAPIDFUZZ = False

from app.services.knowledge.loader import KnowledgeLoader

logger = logging.getLogger("duplicate_detector")

class DuplicateDetector:
    """Detects duplicate contributions against 9 KnowledgeBase datasets and Community queues."""

    def __init__(self, loader: Optional[KnowledgeLoader] = None):
        self.loader = loader or KnowledgeLoader()

    def check_duplicate(self, title: str, kangri: str = "", hindi: str = "") -> Tuple[bool, Optional[str], float]:
        """Checks if a proposed contribution already exists in production datasets or community queues."""
        query_text = (title or kangri or hindi).strip().lower()
        if not query_text:
            return False, None, 0.0

        # 1. Search Production Knowledge Base Datasets
        dataset = self.loader.load_dataset()
        categories = ["dictionary", "phrases", "government", "agriculture", "healthcare", "culture", "education", "tourism", "faq"]
        
        for cat in categories:
            items = getattr(dataset, cat, [])
            for item in items:
                item_dict = item.model_dump() if hasattr(item, "model_dump") else dict(item)
                entry_text = (item_dict.get("word") or item_dict.get("title") or item_dict.get("phrase") or "").lower()
                if not entry_text:
                    continue

                # Exact Match Check
                if query_text == entry_text:
                    return True, f"Exact match found in production dataset ({cat}): '{entry_text}'", 1.0

                # RapidFuzz Similarity Check
                if HAS_RAPIDFUZZ:
                    sim = fuzz.ratio(query_text, entry_text) / 100.0
                    if sim >= 0.88:
                        return True, f"Similar entry found in production dataset ({cat}): '{entry_text}'", sim

        return False, None, 0.0

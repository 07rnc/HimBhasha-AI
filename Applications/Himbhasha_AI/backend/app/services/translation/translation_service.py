import logging
import time
from typing import Dict, Any, Optional, Set

from app.services.knowledge.loader import KnowledgeLoader
from .translation_engine import TranslationEngine
from .translation_utils import detect_language
from .translation_models import TranslationResponse, TranslationRequest

logger = logging.getLogger("translation_service")

class TranslationService:
    """High-level offline translation intelligence service with sub-50ms execution speed."""

    def __init__(self, loader: Optional[KnowledgeLoader] = None):
        self.loader = loader or KnowledgeLoader()
        
        start_time = time.time()
        self.dataset = self.loader.load_dataset()
        load_duration = (time.time() - start_time) * 1000
        logger.info(f"TranslationService initialized in-memory datasets in {load_duration:.2f}ms.")

        self.engine = TranslationEngine(self.dataset.dictionary, self.dataset.phrases)
        
        # Fast lookup sets for language detection
        self.kangri_words: Set[str] = {
            entry.kangri.lower() for entry in self.dataset.dictionary if hasattr(entry, "kangri") and entry.kangri
        }
        self.hindi_words: Set[str] = {
            entry.hindi.lower() for entry in self.dataset.dictionary if hasattr(entry, "hindi") and entry.hindi
        }

    def translate(
        self,
        text: str,
        target_language: Optional[str] = None,
        source_language: Optional[str] = None
    ) -> Dict[str, Any]:
        """Performs intelligent 100% offline translation with sub-50ms query duration."""
        if not text or not text.strip():
            return {
                "success": False,
                "message": "Empty text provided for translation.",
                "suggestions": ["Enter a valid word or phrase."]
            }

        start_time = time.time()
        query_clean = text.strip()

        # Step 1: Detect Source Language if not specified
        detected_source = source_language or detect_language(query_clean, self.kangri_words, self.hindi_words)
        
        # Step 2: Execute Intelligent Translation Engine Pipeline
        result = self.engine.translate_query(query_clean, detected_source, target_language)

        total_duration = round((time.time() - start_time) * 1000, 2)
        logger.info(f"Translation Query: '{query_clean}' | Match: {result.get('match_type') if result else 'none'} | Time: {total_duration}ms")

        # Step 3: Format Response Schema
        if result and result.get("translated_text"):
            return {
                "success": True,
                "source_language": result["source_language"],
                "target_language": result["target_language"],
                "original_text": result["original_text"],
                "translated_text": result["translated_text"],
                "confidence": result["confidence"],
                "match_type": result["match_type"],
                "processing_time_ms": total_duration,
                "pronunciation": result["pronunciation"],
                "related_words": result["related_words"],
                "source_dataset": result["source_dataset"],
                "matched_entry": result["matched_entry"]
            }

        # Unavailable Fallback
        return {
            "success": False,
            "message": "Translation not available in the offline knowledge base.",
            "suggestions": [
                "Try another spelling.",
                "Search using a single word.",
                "Browse the dictionary."
            ]
        }

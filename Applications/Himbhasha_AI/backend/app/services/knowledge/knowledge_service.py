import logging
from typing import Dict, Any, Optional, Tuple

from .loader import KnowledgeLoader
from .search_engine import SearchEngine
from .response_formatter import ResponseFormatter
from .models import KnowledgeDataset

logger = logging.getLogger("knowledge_service")

class KnowledgeService:
    """Orchestrates loading offline datasets, executing hybrid search queries, and formatting responses."""

    def __init__(self, loader: Optional[KnowledgeLoader] = None):
        self.loader = loader or KnowledgeLoader()
        self.dataset: KnowledgeDataset = self.loader.load_dataset()
        self.search_engine = SearchEngine()
        logger.info("KnowledgeService initialized with offline dataset.")

    def reload_dataset(self):
        """Reloads datasets from disk."""
        self.dataset = self.loader.load_dataset()
        logger.info("KnowledgeService dataset reloaded.")

    def query(self, message: str) -> Dict[str, Any]:
        """Queries all dataset categories, ranks top candidate matches, and formats output."""
        if not message or not message.strip():
            return ResponseFormatter.format_no_match()

        query_text = message.strip()
        logger.info(f"KnowledgeService processing query: '{query_text}'")

        categories_to_search = [
            ("dictionary", self.dataset.dictionary),
            ("phrases", self.dataset.phrases),
            ("faq", self.dataset.faq),
            ("government", self.dataset.government),
            ("agriculture", self.dataset.agriculture),
            ("healthcare", self.dataset.healthcare),
            ("culture", self.dataset.culture),
            ("education", self.dataset.education),
            ("tourism", self.dataset.tourism),
        ]

        best_match: Optional[Tuple[Any, str, float]] = None

        for cat_name, entries in categories_to_search:
            results = self.search_engine.search(query_text, entries, cat_name)
            if results:
                top_entry, top_score = results[0]
                if best_match is None or top_score > best_match[2]:
                    best_match = (top_entry, cat_name, top_score)

        if best_match and best_match[2] >= 0.45:
            entry, category, score = best_match
            logger.info(f"KnowledgeService found best match in '{category}' with confidence {score}")
            formatted = ResponseFormatter.format_match(entry, category, score)
            formatted["success"] = True
            return formatted

        logger.info(f"KnowledgeService: No suitable offline match found for '{query_text}'")
        return ResponseFormatter.format_no_match()

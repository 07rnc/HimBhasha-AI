import logging
import time
from typing import Dict, Any, Optional, List, Tuple

from .loader import KnowledgeLoader
from .search_engine import SearchEngine
from .response_formatter import ResponseFormatter
from .models import KnowledgeDataset

logger = logging.getLogger("knowledge_service")

class KnowledgeService:
    """Orchestrates in-memory offline datasets across all 9 categories with strict search ordering and performance logging."""

    def __init__(self, loader: Optional[KnowledgeLoader] = None):
        self.loader = loader or KnowledgeLoader()
        # Load datasets ONCE into memory cache
        start_time = time.time()
        self.dataset: KnowledgeDataset = self.loader.load_dataset()
        load_duration = (time.time() - start_time) * 1000
        logger.info(f"KnowledgeService cached datasets in memory in {load_duration:.2f}ms.")
        self.search_engine = SearchEngine()

    def reload_dataset(self):
        """Reloads datasets into memory cache."""
        start_time = time.time()
        self.dataset = self.loader.load_dataset()
        load_duration = (time.time() - start_time) * 1000
        logger.info(f"KnowledgeService dataset reloaded in {load_duration:.2f}ms.")

    def query(self, message: str) -> Dict[str, Any]:
        """Searches all 9 datasets in strict priority order and returns the single BEST answer."""
        if not message or not message.strip():
            return ResponseFormatter.format_no_match()

        query_text = message.strip()
        start_query_time = time.time()
        logger.info(f"KnowledgeService querying across all 9 datasets for: '{query_text}'")

        # 9-tier priority ordering
        ordered_categories: List[Tuple[str, List[Any]]] = [
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

        all_candidates: List[Dict[str, Any]] = []

        for cat_name, entries in ordered_categories:
            cat_start = time.time()
            cat_results = self.search_engine.search_category(query_text, entries, cat_name)
            cat_duration = (time.time() - cat_start) * 1000
            
            logger.info(f"Dataset searched: '{cat_name}' | Matches found: {len(cat_results)} | Search time: {cat_duration:.2f}ms")
            
            if cat_results:
                all_candidates.extend(cat_results)

        total_query_duration = (time.time() - start_query_time) * 1000
        logger.info(f"Total query execution completed in {total_query_duration:.2f}ms. Total candidate matches: {len(all_candidates)}")

        if not all_candidates:
            return ResponseFormatter.format_no_match()

        # Sort all candidates by score descending
        all_candidates.sort(key=lambda x: x["score"], reverse=True)
        top_match = all_candidates[0]

        if top_match["score"] < 0.45:
            logger.info(f"Top match score {top_match['score']} is below confidence cutoff threshold (0.45). Returning no-match.")
            return ResponseFormatter.format_no_match()

        # Gather secondary candidates with close scores for related topics
        secondary = [c for c in all_candidates[1:] if c["score"] >= (top_match["score"] - 0.20)]
        
        logger.info(f"Best Match Selected: '{top_match['dataset']}' | Score: {top_match['score']} | Confidence: {top_match['confidence']}%")
        return ResponseFormatter.format_result(top_match, secondary)

import logging
import time
from typing import Dict, Any, Optional, List, Tuple

from .loader import KnowledgeLoader
from .search_engine import SearchEngine
from .intent_classifier import IntentClassifier
from .response_formatter import ResponseFormatter
from .models import KnowledgeDataset

logger = logging.getLogger("knowledge_service")

class KnowledgeService:
    """Orchestrates intent classification, dataset selection, hybrid search, and formatted responses."""

    def __init__(self, loader: Optional[KnowledgeLoader] = None):
        self.loader = loader or KnowledgeLoader()
        start_time = time.time()
        self.dataset: KnowledgeDataset = self.loader.load_dataset()
        load_duration = (time.time() - start_time) * 1000
        logger.info(f"KnowledgeService loaded datasets into memory cache in {load_duration:.2f}ms.")
        
        self.search_engine = SearchEngine()
        self.intent_classifier = IntentClassifier()

    def reload_dataset(self):
        """Reloads datasets into memory cache."""
        self.dataset = self.loader.load_dataset()
        logger.info("KnowledgeService dataset reloaded.")

    def _get_category_entries(self, cat_name: str) -> List[Any]:
        return getattr(self.dataset, cat_name.lower(), [])

    def query(self, message: str) -> Dict[str, Any]:
        """Classifies intent first, routes to selected dataset(s), and falls back to all datasets if confidence is low."""
        if not message or not message.strip():
            return ResponseFormatter.format_no_match()

        query_text = message.strip()
        query_start = time.time()

        # Step 1: Normalize & Classify Intent (< 10ms execution)
        intent_start = time.time()
        intent, intent_conf, target_datasets = self.intent_classifier.classify(query_text)
        intent_duration = (time.time() - intent_start) * 1000

        logger.info(f"Intent Detection: '{intent}' (Confidence: {intent_conf}, Time: {intent_duration:.2f}ms) -> Target Datasets: {target_datasets}")

        all_candidates: List[Dict[str, Any]] = []
        fallback_used = False

        # Step 2: Target Dataset Search
        for cat_name in target_datasets:
            entries = self._get_category_entries(cat_name)
            if entries:
                cat_results = self.search_engine.search_category(query_text, entries, cat_name)
                logger.info(f"Dataset Searched: '{cat_name}' | Matches: {len(cat_results)}")
                if cat_results:
                    all_candidates.extend(cat_results)

        # Step 3: Fallback Search if no confident candidates found in targeted datasets
        if not all_candidates or (all_candidates and all_candidates[0]["score"] < 0.50):
            fallback_used = True
            logger.info("Target dataset search returned low confidence. Triggering ALL datasets fallback search...")
            
            all_categories = ["dictionary", "phrases", "faq", "government", "agriculture", "healthcare", "culture", "education", "tourism"]
            for cat_name in all_categories:
                if cat_name not in target_datasets:
                    entries = self._get_category_entries(cat_name)
                    if entries:
                        cat_results = self.search_engine.search_category(query_text, entries, cat_name)
                        if cat_results:
                            all_candidates.extend(cat_results)

        total_duration = (time.time() - query_start) * 1000
        logger.info(f"Query Processed in {total_duration:.2f}ms | Fallback Used: {fallback_used} | Total Candidates: {len(all_candidates)}")

        if not all_candidates:
            return ResponseFormatter.format_no_match(intent=intent)

        # Sort candidates by score descending
        all_candidates.sort(key=lambda x: x["score"], reverse=True)
        top_match = all_candidates[0]

        if top_match["score"] < 0.45:
            logger.info(f"Top candidate score {top_match['score']} below threshold 0.45. Returning no-match.")
            return ResponseFormatter.format_no_match(intent=intent)

        secondary = [c for c in all_candidates[1:] if c["score"] >= (top_match["score"] - 0.20)]
        
        resp_start = time.time()
        formatted = ResponseFormatter.format_result(top_match, intent=intent, secondary_candidates=secondary)
        formatted["fallback_used"] = fallback_used
        resp_duration = (time.time() - resp_start) * 1000

        logger.info(f"ResponseEngine Result | Intent: '{intent}' | Dataset: '{top_match['dataset']}' | Time: {resp_duration:.2f}ms | Confidence: {top_match['confidence']}%")
        return formatted

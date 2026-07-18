import logging
from typing import List, Tuple, Any, Dict
import difflib

try:
    from rapidfuzz import fuzz
    HAS_RAPIDFUZZ = True
except ImportError:
    HAS_RAPIDFUZZ = False

logger = logging.getLogger("knowledge_search_engine")

class SearchEngine:
    """Hybrid search engine combining Exact Match, Keyword Token Search, and RapidFuzz Similarity."""

    def __init__(self):
        pass

    def _extract_searchable_text(self, item: Any) -> Tuple[str, str, List[str], List[str]]:
        """Extracts primary text, secondary text, keywords, and synonyms from a Pydantic model entry."""
        item_dict = item.model_dump() if hasattr(item, "model_dump") else item.__dict__
        
        # Determine primary and secondary field names based on entry type
        primary = (
            item_dict.get("kangri")
            or item_dict.get("question")
            or item_dict.get("scheme_name")
            or item_dict.get("crop_name")
            or item_dict.get("facility_name")
            or item_dict.get("festival_name")
            or item_dict.get("institution_name")
            or item_dict.get("place_name")
            or ""
        )
        
        secondary = (
            item_dict.get("english")
            or item_dict.get("hindi")
            or item_dict.get("answer")
            or item_dict.get("description")
            or ""
        )

        keywords = [str(k).lower() for k in item_dict.get("keywords", [])]
        synonyms = [str(s).lower() for s in item_dict.get("synonyms", [])]

        return str(primary).strip(), str(secondary).strip(), keywords, synonyms

    def search(self, query: str, entries: List[Any], category_name: str) -> List[Tuple[Any, float]]:
        """Searches a list of category entries and returns candidates scored from 0.0 to 1.0."""
        if not query or not entries:
            return []

        query_clean = query.strip().lower()
        scored_results: List[Tuple[Any, float]] = []

        for entry in entries:
            primary, secondary, keywords, synonyms = self._extract_searchable_text(entry)
            primary_lower = primary.lower()
            secondary_lower = secondary.lower()

            score = 0.0

            # 1. Exact Match Strategy
            if query_clean == primary_lower or query_clean == secondary_lower:
                score = 1.0
            # 2. Keyword & Synonym Search Strategy
            elif query_clean in keywords or query_clean in synonyms:
                score = 0.90
            else:
                # Token overlap scoring
                q_tokens = [tok for tok in query_clean.split() if len(tok) > 2]
                if q_tokens:
                    matched_toks = sum(1 for tok in q_tokens if tok in primary_lower or tok in secondary_lower)
                    token_ratio = matched_toks / len(q_tokens)
                    if token_ratio >= 0.60:
                        score = round(0.70 + (token_ratio * 0.20), 2)
                    elif token_ratio >= 0.40:
                        score = 0.50
            # 3. RapidFuzz / Difflib Similarity Strategy
            if score == 0.0:
                if HAS_RAPIDFUZZ:
                    sim_primary = fuzz.token_set_ratio(query_clean, primary_lower) / 100.0
                    sim_secondary = fuzz.token_set_ratio(query_clean, secondary_lower) / 100.0
                else:
                    sim_primary = difflib.SequenceMatcher(None, query_clean, primary_lower).ratio()
                    sim_secondary = difflib.SequenceMatcher(None, query_clean, secondary_lower).ratio()
                    
                best_sim = max(sim_primary, sim_secondary)
                
                if best_sim >= 0.50:
                    score = float(best_sim)

            # 4. Ranking cutoff check
            if score >= 0.40:
                scored_results.append((entry, round(score, 2)))

        # Sort by highest score descending
        scored_results.sort(key=lambda x: x[1], reverse=True)
        return scored_results

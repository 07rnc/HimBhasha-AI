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
    """Advanced Hybrid Search Engine matching Exact, Keyword, RapidFuzz Ratio, Partial Ratio, and Token Sort Ratio."""

    def __init__(self):
        pass

    def _extract_searchable_text(self, item: Any) -> Tuple[str, str, List[str], List[str]]:
        """Extracts primary text, secondary text, keywords, and synonyms from entry model."""
        item_dict = item.model_dump() if hasattr(item, "model_dump") else item.__dict__
        
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

    def search_category(self, query: str, entries: List[Any], category_name: str) -> List[Dict[str, Any]]:
        """Searches a category dataset applying 6-tier matching algorithm."""
        if not query or not entries:
            return []

        query_clean = query.strip().lower()
        query_words = set(query_clean.split())
        scored_results: List[Dict[str, Any]] = []

        for entry in entries:
            primary, secondary, keywords, synonyms = self._extract_searchable_text(entry)
            primary_lower = primary.lower()
            secondary_lower = secondary.lower()

            score = 0.0
            matched_kw: List[str] = []

            # 1. Exact Match
            if query_clean == primary_lower:
                score = 1.0
                matched_kw.append(primary)
            elif query_clean == secondary_lower:
                score = 0.98
                matched_kw.append(secondary)
            # 2. Keyword & Synonym Match
            elif query_clean in keywords or query_clean in synonyms:
                score = 0.92
                matched_kw.append(query_clean)
            else:
                # Token overlap check
                overlapping = [kw for kw in keywords + synonyms + [primary_lower, secondary_lower] if any(w in kw for w in query_words if len(w) > 2)]
                if overlapping:
                    matched_kw.extend(overlapping[:3])

                # 3. RapidFuzz Ratio / 4. Partial Ratio / 5. Token Sort Ratio
                if HAS_RAPIDFUZZ:
                    r_ratio = max(fuzz.ratio(query_clean, primary_lower), fuzz.ratio(query_clean, secondary_lower)) / 100.0
                    r_partial = max(fuzz.partial_ratio(query_clean, primary_lower), fuzz.partial_ratio(query_clean, secondary_lower)) / 100.0
                    r_token_sort = max(fuzz.token_sort_ratio(query_clean, primary_lower), fuzz.token_sort_ratio(query_clean, secondary_lower)) / 100.0
                    
                    fuzzy_score = (r_ratio * 0.3) + (r_partial * 0.3) + (r_token_sort * 0.4)
                else:
                    sim_primary = difflib.SequenceMatcher(None, query_clean, primary_lower).ratio()
                    sim_secondary = difflib.SequenceMatcher(None, query_clean, secondary_lower).ratio()
                    fuzzy_score = max(sim_primary, sim_secondary)

                if fuzzy_score >= 0.45:
                    score = float(fuzzy_score)

            # 6. Ranking Cutoff
            if score >= 0.45:
                confidence_pct = int(min(score * 100, 100))
                scored_results.append({
                    "entry": entry,
                    "score": round(score, 2),
                    "confidence": confidence_pct,
                    "matched_keywords": list(dict.fromkeys(matched_kw)),
                    "dataset": category_name
                })

        # Sort by score descending
        scored_results.sort(key=lambda x: x["score"], reverse=True)
        return scored_results

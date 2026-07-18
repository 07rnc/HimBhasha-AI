import logging
import re
from typing import List, Dict, Any, Optional, Tuple
import difflib

try:
    from rapidfuzz import fuzz
    HAS_RAPIDFUZZ = True
except ImportError:
    HAS_RAPIDFUZZ = False

from .translation_utils import normalize_text

logger = logging.getLogger("translation_engine")

class TranslationEngine:
    """Intelligent offline translation matcher supporting phrase-first matching, word-by-word sentence reconstruction, synonym search, and RapidFuzz multi-ratio similarity."""

    def __init__(self, dictionary_entries: List[Any], phrase_entries: List[Any]):
        self.dictionary_entries = dictionary_entries
        self.phrase_entries = phrase_entries

    def _get_field(self, item: Any, field_name: str) -> str:
        if hasattr(item, field_name):
            val = getattr(item, field_name, "")
            return str(val) if val is not None else ""
        elif isinstance(item, dict):
            val = item.get(field_name, "")
            return str(val) if val is not None else ""
        return ""

    def _get_list_field(self, item: Any, field_name: str) -> List[str]:
        if hasattr(item, field_name):
            val = getattr(item, field_name, [])
            return [str(x) for x in val] if isinstance(val, list) else []
        elif isinstance(item, dict):
            val = item.get(field_name, [])
            return [str(x) for x in val] if isinstance(val, list) else []
        return []

    def _match_single_word(
        self,
        word: str,
        source_lang: str,
        target_lang: str
    ) -> Tuple[Optional[str], float, str, Optional[Any]]:
        """Matches a single word against the dictionary dataset using Exact, Synonym/Keyword, and RapidFuzz."""
        word_clean = normalize_text(word).lower()
        if not word_clean:
            return None, 0.0, "none", None

        best_trans: Optional[str] = None
        best_score = 0.0
        best_match_type = "none"
        matched_obj: Optional[Any] = None

        for entry in self.dictionary_entries:
            kangri = self._get_field(entry, "kangri")
            hindi = self._get_field(entry, "hindi")
            english = self._get_field(entry, "english")
            keywords = [k.lower() for k in self._get_list_field(entry, "keywords")]
            synonyms = [s.lower() for s in self._get_list_field(entry, "synonyms")]

            source_val = kangri if source_lang == "Kangri" else (hindi if source_lang == "Hindi" else english)
            source_lower = source_val.lower()

            target_val = kangri if target_lang == "Kangri" else (hindi if target_lang == "Hindi" else english)

            score = 0.0
            match_type = "none"

            # 1. Exact Match
            if word_clean == source_lower:
                score = 1.0
                match_type = "exact"
            # 2. Synonym / Keyword Match
            elif word_clean in synonyms or word_clean in keywords:
                score = 0.92
                match_type = "synonym_keyword"
            else:
                # 3. RapidFuzz Multi-Ratio Match (Ratio, Partial Ratio, Token Sort)
                if HAS_RAPIDFUZZ:
                    r_ratio = fuzz.ratio(word_clean, source_lower) / 100.0
                    r_partial = fuzz.partial_ratio(word_clean, source_lower) / 100.0
                    r_token = fuzz.token_sort_ratio(word_clean, source_lower) / 100.0
                    sim = max(r_ratio, r_partial * 0.9, r_token)
                else:
                    sim = difflib.SequenceMatcher(None, word_clean, source_lower).ratio()

                if sim >= 0.55:
                    score = float(sim)
                    match_type = "rapidfuzz"

            if score > best_score and target_val:
                best_score = score
                best_trans = target_val
                best_match_type = match_type
                matched_obj = entry

        return best_trans, best_score, best_match_type, matched_obj

    def translate_query(
        self,
        query: str,
        source_lang: str,
        target_lang: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """Intelligent 4-tier translation pipeline: Phrase-First -> Dictionary -> Word-by-Word Reconstruction."""
        query_clean = normalize_text(query).lower()
        if not query_clean:
            return None

        if not target_lang:
            if source_lang == "Kangri":
                target_lang = "Hindi"
            elif source_lang == "Hindi":
                target_lang = "Kangri"
            else:
                target_lang = "Kangri"

        # Tier 1: Phrase-First Search
        best_phrase_match: Optional[Dict[str, Any]] = None
        best_phrase_score = 0.0

        for phrase in self.phrase_entries:
            kangri = self._get_field(phrase, "kangri")
            hindi = self._get_field(phrase, "hindi")
            english = self._get_field(phrase, "english")
            phrase_id = self._get_field(phrase, "id") or "ph_entry"

            source_val = kangri if source_lang == "Kangri" else (hindi if source_lang == "Hindi" else english)
            target_val = kangri if target_lang == "Kangri" else (hindi if target_lang == "Hindi" else english)
            source_lower = source_val.lower()

            score = 0.0
            if query_clean == source_lower:
                score = 1.0
            else:
                if HAS_RAPIDFUZZ:
                    score = fuzz.token_sort_ratio(query_clean, source_lower) / 100.0
                else:
                    score = difflib.SequenceMatcher(None, query_clean, source_lower).ratio()

            if score > best_phrase_score and score >= 0.70:
                best_phrase_score = score
                related = [r for r in [hindi, english, kangri] if r and r.lower() != target_val.lower()][:5]
                best_phrase_match = {
                    "source_language": source_lang,
                    "target_language": target_lang,
                    "original_text": query,
                    "translated_text": target_val,
                    "confidence": int(min(score * 100, 100)),
                    "match_type": "phrase" if score > 0.90 else "phrase_fuzzy",
                    "pronunciation": "",
                    "related_words": list(dict.fromkeys(related)),
                    "source_dataset": "phrases",
                    "matched_entry": phrase_id
                }

        # If high-confidence phrase match found, return directly!
        if best_phrase_match and best_phrase_score >= 0.85:
            return best_phrase_match

        # Tier 2: Single-Word / Full Query Dictionary Search
        word_trans, word_score, match_type, matched_obj = self._match_single_word(query, source_lang, target_lang)

        if word_trans and word_score >= 0.75:
            entry_id = self._get_field(matched_obj, "id") if matched_obj else "dict_entry"
            pron = self._get_field(matched_obj, "pronunciation") if matched_obj else ""
            pos = self._get_field(matched_obj, "part_of_speech") if matched_obj else ""
            hindi_val = self._get_field(matched_obj, "hindi") if matched_obj else ""
            eng_val = self._get_field(matched_obj, "english") if matched_obj else ""
            syns = self._get_list_field(matched_obj, "synonyms") if matched_obj else []

            related = [r for r in [hindi_val, eng_val, pos] + syns if r and r.lower() != word_trans.lower()][:5]

            return {
                "source_language": source_lang,
                "target_language": target_lang,
                "original_text": query,
                "translated_text": word_trans,
                "confidence": int(min(word_score * 100, 100)),
                "match_type": match_type,
                "pronunciation": pron,
                "related_words": list(dict.fromkeys(related)),
                "source_dataset": "dictionary",
                "matched_entry": entry_id
            }

        # Tier 3: Word-by-Word Sentence Reconstruction (If query has multiple words)
        tokens = [tok for tok in re.split(r"(\s+|[^\w\s\u0900-\u097F])", query) if tok]
        if len([t for t in tokens if t.strip()]) > 1:
            reconstructed_tokens: List[str] = []
            token_scores: List[float] = []
            collected_related: List[str] = []

            for token in tokens:
                if not token.strip() or not re.search(r"[\w\u0900-\u097F]", token):
                    reconstructed_tokens.append(token)
                    continue

                t_trans, t_score, t_match, t_obj = self._match_single_word(token, source_lang, target_lang)
                if t_trans and t_score >= 0.55:
                    reconstructed_tokens.append(t_trans)
                    token_scores.append(t_score)
                    if t_obj:
                        rel = self._get_field(t_obj, "english") or self._get_field(t_obj, "hindi")
                        if rel: collected_related.append(rel)
                else:
                    reconstructed_tokens.append(token)
                    token_scores.append(0.40)

            avg_confidence = int(min((sum(token_scores) / max(len(token_scores), 1)) * 100, 100))
            reconstructed_sentence = "".join(reconstructed_tokens)

            return {
                "source_language": source_lang,
                "target_language": target_lang,
                "original_text": query,
                "translated_text": reconstructed_sentence,
                "confidence": avg_confidence,
                "match_type": "word_by_word",
                "pronunciation": "",
                "related_words": list(dict.fromkeys(collected_related))[:5],
                "source_dataset": "dictionary",
                "matched_entry": "multi_token"
            }

        # Fallback to phrase match if score was moderate (>= 0.50)
        if best_phrase_match:
            return best_phrase_match

        return None

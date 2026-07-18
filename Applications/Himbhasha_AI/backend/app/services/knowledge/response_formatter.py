from typing import Dict, Any, List
from .response_engine import ResponseEngine

class ResponseFormatter:
    """Delegates response formatting to ResponseEngine for intent-aware conversational outputs."""

    @staticmethod
    def format_result(match_data: Dict[str, Any], intent: str = "General Search", secondary_candidates: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        entry = match_data["entry"]
        category = match_data["dataset"]
        confidence = match_data["confidence"]
        
        entry_dict = entry.model_dump() if hasattr(entry, "model_dump") else entry.__dict__

        if intent == "Greeting" or (category == "dictionary" and entry_dict.get("category") == "Greetings"):
            res = ResponseEngine.render_greeting(entry_dict, confidence)
        elif category == "dictionary":
            res = ResponseEngine.render_dictionary(entry_dict, confidence, secondary_candidates)
        elif category == "phrases":
            res = ResponseEngine.render_phrases(entry_dict, confidence)
        elif category == "government":
            res = ResponseEngine.render_government(entry_dict, confidence)
        elif category == "agriculture":
            res = ResponseEngine.render_agriculture(entry_dict, confidence)
        elif category == "healthcare":
            res = ResponseEngine.render_healthcare(entry_dict, confidence)
        elif category == "culture":
            res = ResponseEngine.render_culture(entry_dict, confidence)
        elif category == "education":
            res = ResponseEngine.render_education(entry_dict, confidence)
        elif category == "tourism":
            res = ResponseEngine.render_tourism(entry_dict, confidence)
        elif category == "faq":
            res = ResponseEngine.render_faq(entry_dict, confidence)
        else:
            res = ResponseEngine.render_dictionary(entry_dict, confidence, secondary_candidates)

        res["intent"] = intent
        return res

    @staticmethod
    def format_no_match(intent: str = "Unknown") -> Dict[str, Any]:
        res = ResponseEngine.render_no_match()
        res["intent"] = intent
        return res

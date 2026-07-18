import logging
import time
from typing import Dict, Any, List

logger = logging.getLogger("response_engine")

class ResponseEngine:
    """Converts raw search matches into rich, intent-aware conversational markdown answers and structured JSON."""

    @staticmethod
    def render_greeting(entry_dict: Dict[str, Any], confidence: int) -> Dict[str, Any]:
        kangri = entry_dict.get("kangri", "बंदगी")
        hindi = entry_dict.get("hindi", "नमस्ते")
        english = entry_dict.get("english", "Greetings / Hello")
        desc = entry_dict.get("description", "A traditional greeting used in Kangri.")

        answer = f"🙏 **{kangri}!**\n\n**Hindi**: {hindi}\n**English**: {english}\n\n*{desc}*"
        summary = f"{kangri} is a traditional Pahari greeting meaning '{hindi}' ({english})."

        return {
            "success": True,
            "title": f"🙏 {kangri}",
            "category": "Greeting",
            "dataset": "dictionary",
            "answer": answer,
            "summary": summary,
            "confidence": confidence,
            "related_topics": [hindi, english, "Greetings"],
            "suggestions": ["Ask for more greetings", "Search dictionary words", "Learn common phrases"],
            "source": "Offline Knowledge Base"
        }

    @staticmethod
    def render_dictionary(entry_dict: Dict[str, Any], confidence: int, secondary: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        kangri = entry_dict.get("kangri", "")
        hindi = entry_dict.get("hindi", "")
        english = entry_dict.get("english", "")
        pron = entry_dict.get("pronunciation", "")
        pos = entry_dict.get("part_of_speech", "")
        desc = entry_dict.get("description", "")
        syns = ", ".join(entry_dict.get("synonyms", []))

        parts = [f"📖 **Word**: {kangri}"]
        parts.append(f"**Hindi**: {hindi}")
        parts.append(f"**English**: {english}")
        if pron:
            parts.append(f"**Pronunciation**: *{pron}*")
        if pos:
            parts.append(f"**Part of Speech**: {pos}")
        if desc:
            parts.append(f"\n*{desc}*")
        if syns:
            parts.append(f"\n**Synonyms**: {syns}")

        answer = "\n".join(parts)
        summary = f"{kangri} ({pron}) - {hindi} / {english}."
        
        related = [hindi, english, pos] if pos else [hindi, english]
        if secondary:
            for s in secondary[:2]:
                s_dict = s["entry"].model_dump() if hasattr(s["entry"], "model_dump") else s["entry"].__dict__
                r_word = s_dict.get("kangri") or s_dict.get("english")
                if r_word and r_word not in related:
                    related.append(r_word)

        return {
            "success": True,
            "title": f"Word: {kangri}",
            "category": "Dictionary",
            "dataset": "dictionary",
            "answer": answer,
            "summary": summary,
            "confidence": confidence,
            "related_topics": [r for r in related if r],
            "suggestions": ["Search another word", "Explore related phrases", "Ask for usage examples"],
            "source": "Offline Knowledge Base"
        }

    @staticmethod
    def render_phrases(entry_dict: Dict[str, Any], confidence: int) -> Dict[str, Any]:
        kangri = entry_dict.get("kangri", "")
        hindi = entry_dict.get("hindi", "")
        english = entry_dict.get("english", "")
        context = entry_dict.get("context", "")

        parts = [f"💬 **Kangri**: {kangri}"]
        parts.append(f"**Hindi**: {hindi}")
        parts.append(f"**English**: {english}")
        if context:
            parts.append(f"\n*Context*: {context}")

        return {
            "success": True,
            "title": f"Phrase: {kangri}",
            "category": "Phrases",
            "dataset": "phrases",
            "answer": "\n".join(parts),
            "summary": f"Kangri phrase '{kangri}' translates to '{hindi}' / '{english}'.",
            "confidence": confidence,
            "related_topics": ["Translation", "Conversations", hindi],
            "suggestions": ["Search more phrases", "Learn greetings"],
            "source": "Offline Knowledge Base"
        }

    @staticmethod
    def render_government(entry_dict: Dict[str, Any], confidence: int) -> Dict[str, Any]:
        scheme = entry_dict.get("scheme_name", "")
        desc = entry_dict.get("description", "")
        elig = entry_dict.get("eligibility", "Resident farmers/citizens of Himachal Pradesh")
        ben = entry_dict.get("benefits", "Financial subsidy and equipment support")
        dept = entry_dict.get("department", "Government of Himachal Pradesh")

        answer = (
            f"🏛️ **Government Scheme**: {scheme}\n\n"
            f"{desc}\n\n"
            f"• **Eligibility**: {elig}\n"
            f"• **Benefits**: {ben}\n"
            f"• **Department**: {dept}"
        )

        return {
            "success": True,
            "title": f"Government Scheme: {scheme}",
            "category": "Government",
            "dataset": "government",
            "answer": answer,
            "summary": f"{scheme} provides benefits to eligible residents in Himachal Pradesh.",
            "confidence": confidence,
            "related_topics": ["Farmer", "Subsidy", "Agriculture", "Panchayat"],
            "suggestions": ["Check eligibility criteria", "View agriculture schemes"],
            "source": "Offline Knowledge Base"
        }

    @staticmethod
    def render_agriculture(entry_dict: Dict[str, Any], confidence: int) -> Dict[str, Any]:
        crop = entry_dict.get("crop_name", "")
        season = entry_dict.get("ideal_season", "Spring / Autumn")
        soil = entry_dict.get("soil_type", "Well-drained soil")
        diseases = ", ".join(entry_dict.get("common_diseases", []))
        recs = entry_dict.get("recommendations", "")

        answer = (
            f"🌾 **Agriculture**: {crop}\n\n"
            f"• **Ideal Season**: {season}\n"
            f"• **Soil Type**: {soil}\n"
        )
        if diseases:
            answer += f"• **Common Diseases**: {diseases}\n"
        if recs:
            answer += f"• **Recommendations**: {recs}"

        return {
            "success": True,
            "title": f"Crop / Farming: {crop}",
            "category": "Agriculture",
            "dataset": "agriculture",
            "answer": answer,
            "summary": f"{crop} cultivation details, soil requirements, and farming advice.",
            "confidence": confidence,
            "related_topics": ["Crops", "Farming", "Soil Care"],
            "suggestions": ["Ask about crop diseases", "View government farming schemes"],
            "source": "Offline Knowledge Base"
        }

    @staticmethod
    def render_healthcare(entry_dict: Dict[str, Any], confidence: int) -> Dict[str, Any]:
        facility = entry_dict.get("facility_name", "")
        services = ", ".join(entry_dict.get("services_offered", []))
        dist = entry_dict.get("district", "Himachal Pradesh")
        contact = entry_dict.get("contact", "")

        answer = f"🏥 **Healthcare Facility**: {facility} ({dist})\n\n• **Services Offered**: {services}"
        if contact:
            answer += f"\n• **Contact**: {contact}"

        return {
            "success": True,
            "title": f"Healthcare: {facility}",
            "category": "Healthcare",
            "dataset": "healthcare",
            "answer": answer,
            "summary": f"Healthcare center {facility} in {dist}.",
            "confidence": confidence,
            "related_topics": ["Hospitals", "Medical Services", dist],
            "suggestions": ["Search hospital locations", "Emergency contacts"],
            "source": "Offline Knowledge Base"
        }

    @staticmethod
    def render_culture(entry_dict: Dict[str, Any], confidence: int) -> Dict[str, Any]:
        fest = entry_dict.get("festival_name", "")
        sig = entry_dict.get("significance", "")
        region = entry_dict.get("region", "Himachal Pradesh")
        traditions = ", ".join(entry_dict.get("traditions", []))

        answer = f"🏔️ **Culture & Heritage**: {fest} ({region})\n\n{sig}"
        if traditions:
            answer += f"\n\n**Traditions**: {traditions}"

        return {
            "success": True,
            "title": f"Culture: {fest}",
            "category": "Culture",
            "dataset": "culture",
            "answer": answer,
            "summary": f"{fest} is a celebrated festival in {region}.",
            "confidence": confidence,
            "related_topics": ["Festivals", "Himachali Traditions", region],
            "suggestions": ["Explore regional fairs", "Learn local folk songs"],
            "source": "Offline Knowledge Base"
        }

    @staticmethod
    def render_education(entry_dict: Dict[str, Any], confidence: int) -> Dict[str, Any]:
        inst = entry_dict.get("institution_name", "")
        loc = entry_dict.get("location", "")
        courses = ", ".join(entry_dict.get("courses", []))

        answer = f"🎓 **Education**: {inst}, {loc}\n\n**Courses**: {courses}"

        return {
            "success": True,
            "title": f"Education: {inst}",
            "category": "Education",
            "dataset": "education",
            "answer": answer,
            "summary": f"Educational institution {inst} located in {loc}.",
            "confidence": confidence,
            "related_topics": ["Universities", "Courses", loc],
            "suggestions": ["View available courses"],
            "source": "Offline Knowledge Base"
        }

    @staticmethod
    def render_tourism(entry_dict: Dict[str, Any], confidence: int) -> Dict[str, Any]:
        place = entry_dict.get("place_name", "")
        dist = entry_dict.get("district", "")
        hist = entry_dict.get("historical_significance", "")
        best_time = entry_dict.get("best_time_to_visit", "")

        answer = f"🏞️ **Tourism Spot**: {place} ({dist})\n\n{hist}\n\n**Best Time to Visit**: {best_time}"

        return {
            "success": True,
            "title": f"Destination: {place}",
            "category": "Tourism",
            "dataset": "tourism",
            "answer": answer,
            "summary": f"{place} is a key tourist destination in {dist}.",
            "confidence": confidence,
            "related_topics": ["Tourism", "Destinations", dist],
            "suggestions": ["Check best time to visit", "Find near places"],
            "source": "Offline Knowledge Base"
        }

    @staticmethod
    def render_faq(entry_dict: Dict[str, Any], confidence: int) -> Dict[str, Any]:
        question = entry_dict.get("question", "")
        ans = entry_dict.get("answer", "")

        return {
            "success": True,
            "title": question,
            "category": "FAQ",
            "dataset": "faq",
            "answer": f"💡 **{question}**\n\n{ans}",
            "summary": ans,
            "confidence": confidence,
            "related_topics": ["FAQ", "General Help"],
            "suggestions": ["Ask another question"],
            "source": "Offline Knowledge Base"
        }

    @staticmethod
    def render_no_match() -> Dict[str, Any]:
        answer = (
            "❌ **Sorry.**\n"
            "I couldn't find this information in the offline knowledge base.\n\n"
            "**Suggestions**:\n"
            "• Try another spelling.\n"
            "• Search using Hindi.\n"
            "• Search using English."
        )

        return {
            "success": False,
            "title": "No Information Found",
            "category": "Unknown",
            "dataset": "none",
            "answer": answer,
            "summary": "No matching knowledge entries found.",
            "confidence": 0,
            "related_topics": [],
            "suggestions": [
                "Try another spelling.",
                "Search using Hindi.",
                "Search using English."
            ],
            "source": "Offline Knowledge Base"
        }

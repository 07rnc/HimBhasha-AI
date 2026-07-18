from typing import Dict, Any, List

class ResponseFormatter:
    """Formats raw entry models and search metrics into the standardized JSON response schema."""

    @staticmethod
    def format_match(entry: Any, category: str, score: float) -> Dict[str, Any]:
        entry_dict = entry.model_dump() if hasattr(entry, "model_dump") else entry.__dict__
        
        # Build title and answer text based on entry schema type
        if category == "dictionary":
            kangri = entry_dict.get("kangri", "")
            hindi = entry_dict.get("hindi", "")
            english = entry_dict.get("english", "")
            pron = entry_dict.get("pronunciation", "")
            pos = entry_dict.get("part_of_speech", "")
            
            title = f"{kangri} ({english})"
            answer_parts = [f"**{kangri}** in Kangri means **{hindi}** in Hindi and **{english}** in English."]
            if pron:
                answer_parts.append(f"Pronunciation: *{pron}*")
            if pos:
                answer_parts.append(f"Part of speech: {pos}")
            answer = "\n".join(answer_parts)
            related = [hindi, english, pos] if pos else [hindi, english]

        elif category == "phrases":
            kangri = entry_dict.get("kangri", "")
            hindi = entry_dict.get("hindi", "")
            english = entry_dict.get("english", "")
            
            title = f"Phrase: {kangri}"
            answer = f"**Kangri**: {kangri}\n**Hindi**: {hindi}\n**English**: {english}"
            related = ["Translation", "Phrases", hindi]

        elif category == "faq":
            question = entry_dict.get("question", "")
            ans = entry_dict.get("answer", "")
            
            title = question
            answer = ans
            related = ["FAQ", "General Help"]

        elif category == "government":
            scheme = entry_dict.get("scheme_name", "")
            desc = entry_dict.get("description", "")
            elig = entry_dict.get("eligibility", "")
            ben = entry_dict.get("benefits", "")
            
            title = f"Government Scheme: {scheme}"
            answer = f"**{scheme}**\n\n{desc}\n\n**Eligibility**: {elig}\n**Benefits**: {ben}"
            related = ["Government Schemes", "Himachal Pradesh", "Welfare"]

        elif category == "agriculture":
            crop = entry_dict.get("crop_name", "")
            season = entry_dict.get("ideal_season", "")
            soil = entry_dict.get("soil_type", "")
            recs = entry_dict.get("recommendations", "")
            
            title = f"Agriculture: {crop}"
            answer = f"**{crop}**\n\n**Ideal Season**: {season}\n**Soil Type**: {soil}\n**Recommendations**: {recs}"
            related = ["Agriculture", "Crops", "Farming"]

        elif category == "healthcare":
            facility = entry_dict.get("facility_name", "")
            services = ", ".join(entry_dict.get("services_offered", []))
            dist = entry_dict.get("district", "")
            
            title = f"Healthcare Facility: {facility}"
            answer = f"**{facility}** ({dist})\n\n**Services Offered**: {services}"
            related = ["Healthcare", "Hospitals", dist]

        elif category == "culture":
            fest = entry_dict.get("festival_name", "")
            sig = entry_dict.get("significance", "")
            region = entry_dict.get("region", "")
            
            title = f"Culture & Heritage: {fest}"
            answer = f"**{fest}** ({region})\n\n{sig}"
            related = ["Culture", "Festivals", region]

        elif category == "education":
            inst = entry_dict.get("institution_name", "")
            loc = entry_dict.get("location", "")
            courses = ", ".join(entry_dict.get("courses", []))
            
            title = f"Education: {inst}"
            answer = f"**{inst}**, {loc}\n\n**Courses**: {courses}"
            related = ["Education", "Universities", loc]

        elif category == "tourism":
            place = entry_dict.get("place_name", "")
            dist = entry_dict.get("district", "")
            hist = entry_dict.get("historical_significance", "")
            best_time = entry_dict.get("best_time_to_visit", "")
            
            title = f"Tourism Spot: {place}"
            answer = f"**{place}** ({dist})\n\n{hist}\n\n**Best Time to Visit**: {best_time}"
            related = ["Tourism", "Himachal Destinations", dist]

        else:
            title = "Information Result"
            answer = str(entry_dict)
            related = [category]

        return {
            "title": title,
            "category": category.capitalize(),
            "answer": answer,
            "confidence": f"{score * 100:.0f}%",
            "related_topics": [r for r in related if r]
        }

    @staticmethod
    def format_no_match() -> Dict[str, Any]:
        return {
            "success": False,
            "message": "I couldn't find this information in the offline knowledge base."
        }

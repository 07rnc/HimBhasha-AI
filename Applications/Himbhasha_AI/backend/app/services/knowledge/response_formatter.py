from typing import Dict, Any, List

class ResponseFormatter:
    """Formats search results into standardized response schemas."""

    @staticmethod
    def format_result(match_data: Dict[str, Any], secondary_candidates: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        entry = match_data["entry"]
        category = match_data["dataset"]
        confidence = match_data["confidence"]
        
        entry_dict = entry.model_dump() if hasattr(entry, "model_dump") else entry.__dict__

        # Format title and answer according to entry type
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
            primary_related = [hindi, english, pos]

        elif category == "phrases":
            kangri = entry_dict.get("kangri", "")
            hindi = entry_dict.get("hindi", "")
            english = entry_dict.get("english", "")
            
            title = f"Phrase: {kangri}"
            answer = f"**Kangri**: {kangri}\n**Hindi**: {hindi}\n**English**: {english}"
            primary_related = ["Translation", "Phrases", hindi]

        elif category == "faq":
            question = entry_dict.get("question", "")
            ans = entry_dict.get("answer", "")
            
            title = question
            answer = ans
            primary_related = ["FAQ", "General Help"]

        elif category == "government":
            scheme = entry_dict.get("scheme_name", "")
            desc = entry_dict.get("description", "")
            elig = entry_dict.get("eligibility", "")
            ben = entry_dict.get("benefits", "")
            
            title = f"Government Scheme: {scheme}"
            answer = f"**{scheme}**\n\n{desc}\n\n**Eligibility**: {elig}\n**Benefits**: {ben}"
            primary_related = ["Government Schemes", "Farmer", "Subsidy", "Agriculture"]

        elif category == "agriculture":
            crop = entry_dict.get("crop_name", "")
            season = entry_dict.get("ideal_season", "")
            soil = entry_dict.get("soil_type", "")
            recs = entry_dict.get("recommendations", "")
            
            title = f"Agriculture: {crop}"
            answer = f"**{crop}**\n\n**Ideal Season**: {season}\n**Soil Type**: {soil}\n**Recommendations**: {recs}"
            primary_related = ["Agriculture", "Crops", "Farming"]

        elif category == "healthcare":
            facility = entry_dict.get("facility_name", "")
            services = ", ".join(entry_dict.get("services_offered", []))
            dist = entry_dict.get("district", "")
            
            title = f"Healthcare Facility: {facility}"
            answer = f"**{facility}** ({dist})\n\n**Services Offered**: {services}"
            primary_related = ["Healthcare", "Hospitals", dist]

        elif category == "culture":
            fest = entry_dict.get("festival_name", "")
            sig = entry_dict.get("significance", "")
            region = entry_dict.get("region", "")
            
            title = f"Culture & Heritage: {fest}"
            answer = f"**{fest}** ({region})\n\n{sig}"
            primary_related = ["Culture", "Festivals", region]

        elif category == "education":
            inst = entry_dict.get("institution_name", "")
            loc = entry_dict.get("location", "")
            courses = ", ".join(entry_dict.get("courses", []))
            
            title = f"Education: {inst}"
            answer = f"**{inst}**, {loc}\n\n**Courses**: {courses}"
            primary_related = ["Education", "Universities", loc]

        elif category == "tourism":
            place = entry_dict.get("place_name", "")
            dist = entry_dict.get("district", "")
            hist = entry_dict.get("historical_significance", "")
            best_time = entry_dict.get("best_time_to_visit", "")
            
            title = f"Tourism Spot: {place}"
            answer = f"**{place}** ({dist})\n\n{hist}\n\n**Best Time to Visit**: {best_time}"
            primary_related = ["Tourism", "Himachal Destinations", dist]

        else:
            title = "Information Result"
            answer = str(entry_dict)
            primary_related = [category]

        # Gather related topics from secondary candidates if available
        related_topics = [r for r in primary_related if r]
        if secondary_candidates:
            for sec in secondary_candidates[:2]:
                sec_entry = sec["entry"]
                sec_dict = sec_entry.model_dump() if hasattr(sec_entry, "model_dump") else sec_entry.__dict__
                sec_title = (
                    sec_dict.get("kangri")
                    or sec_dict.get("question")
                    or sec_dict.get("scheme_name")
                    or sec_dict.get("crop_name")
                    or sec_dict.get("english")
                )
                if sec_title and sec_title not in related_topics:
                    related_topics.append(str(sec_title))

        return {
            "success": True,
            "title": title,
            "category": category.capitalize(),
            "dataset": category,
            "confidence": int(confidence),
            "answer": answer,
            "related_topics": list(dict.fromkeys(related_topics))
        }

    @staticmethod
    def format_no_match() -> Dict[str, Any]:
        return {
            "success": False,
            "message": "I couldn't find this information in the offline knowledge base."
        }

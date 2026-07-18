import time
import logging
from typing import Dict, Any, List, Optional, Set

from app.services.knowledge.knowledge_service import KnowledgeService
from .document_classifier import DocumentClassifier
from .document_response import DocumentAnalysisResponse

logger = logging.getLogger("document_analyzer")

class DocumentAnalyzer:
    """Intelligent offline document analyzer extracting structured insights, knowledge base matches, and summaries."""

    def __init__(self, knowledge_service: Optional[KnowledgeService] = None):
        self.knowledge_service = knowledge_service or KnowledgeService()

    def analyze_document(self, doc_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyzes parsed document OCR text against KnowledgeBase datasets in <100ms."""
        start_time = time.time()
        
        raw_text = doc_data.get("raw_text", "")
        title = doc_data.get("title", "Document Notice")
        paragraphs = doc_data.get("paragraphs", [])
        headings = doc_data.get("headings", [])
        raw_lang = doc_data.get("language", "Devanagari / English")

        # Step 1: Classify Document Type (<100ms)
        class_start = time.time()
        doc_type, class_score, keywords = DocumentClassifier.classify_document(title, raw_text)
        class_duration = (time.time() - class_start) * 1000

        # Step 2: Knowledge Base Alignment Search (<100ms)
        ks_start = time.time()
        matched_datasets: Set[str] = set()
        matched_topics: List[str] = []
        entities: List[str] = []
        sections: List[Dict[str, Any]] = []

        # Query top paragraphs or keywords against Knowledge Base
        query_candidates = [title] + keywords + paragraphs[:3]
        best_knowledge_match: Optional[Dict[str, Any]] = None

        for query_str in query_candidates:
            if not query_str or len(query_str.strip()) < 3:
                continue
            k_res = self.knowledge_service.query(query_str)
            if k_res and k_res.get("success"):
                dataset_name = k_res.get("dataset", "general")
                matched_datasets.add(dataset_name)
                matched_topics.extend(k_res.get("related_topics", []))
                if not best_knowledge_match:
                    best_knowledge_match = k_res

        ks_duration = (time.time() - ks_start) * 1000
        total_duration = (time.time() - start_time) * 1000

        # Step 3: Synthesize Document Summary and Entities
        if best_knowledge_match and best_knowledge_match.get("answer"):
            summary = f"**{doc_type}**: {title}\n\n{best_knowledge_match.get('summary', '')}"
            primary_dataset = best_knowledge_match.get("dataset", "general")
        else:
            first_para = paragraphs[0] if paragraphs else raw_text[:200]
            summary = f"**{doc_type}**: {title}\n\n{first_para}"
            primary_dataset = "ocr_general"

        if headings:
            sections.append({"title": "Document Headings", "content": "\n".join(headings)})
        if paragraphs:
            sections.append({"title": "Extracted Text Sections", "content": "\n\n".join(paragraphs[:5])})

        # Add default entities based on document type
        if "Government" in doc_type:
            entities.extend(["Government of Himachal Pradesh", "Department Authorities"])
        elif "Agriculture" in doc_type:
            entities.extend(["Agriculture Department", "Farmers / Orchardists"])
        elif "Healthcare" in doc_type:
            entities.extend(["Health Department", "Medical Services"])

        logger.info(f"DocumentAnalyzer completed in {total_duration:.2f}ms (Classify: {class_duration:.2f}ms, KS: {ks_duration:.2f}ms)")

        response_obj = DocumentAnalysisResponse(
            document_type=doc_type,
            title=title,
            summary=summary,
            language=raw_lang,
            confidence=int(min(class_score * 100, 100)),
            keywords=keywords,
            matched_dataset=primary_dataset,
            important_entities=list(dict.fromkeys(entities)),
            related_topics=list(dict.fromkeys(matched_topics))[:6],
            sections=sections,
            processing_time_ms=round(total_duration, 2)
        )

        return response_obj.model_dump()

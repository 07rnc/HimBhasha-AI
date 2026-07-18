import re
import logging
from typing import Dict, Any, List

logger = logging.getLogger("document_parser")

class DocumentParser:
    """Parses clean OCR text into structured document components (title, headings, paragraphs, tables)."""

    @staticmethod
    def parse_document(cleaned_text: str) -> Dict[str, Any]:
        if not cleaned_text or not cleaned_text.strip():
            return {
                "title": "Untitled Document",
                "headings": [],
                "paragraphs": [],
                "tables": []
            }

        lines = [line.strip() for line in cleaned_text.split("\n") if line.strip()]

        # 1. Identify Document Title (First non-empty line)
        title = lines[0] if lines else "Untitled Document"
        # Trim leading decorative symbols from title
        title = re.sub(r"^[^\w\u0900-\u097F]+", "", title).strip() or "Document Notice"

        headings: List[str] = []
        paragraphs: List[str] = []
        tables: List[List[List[str]]] = []

        # Split text into paragraph blocks by blank lines
        raw_blocks = [b.strip() for b in cleaned_text.split("\n\n") if b.strip()]

        for block in raw_blocks:
            lines_in_block = [l.strip() for l in block.split("\n") if l.strip()]
            
            # Check if block looks like a table (contains '|' or multiple tab columns)
            if any("|" in line or "\t" in line for line in lines_in_block):
                table_rows = []
                for line in lines_in_block:
                    cells = [c.strip() for c in re.split(r"[|\t]", line) if c.strip()]
                    if cells:
                        table_rows.append(cells)
                if table_rows:
                    tables.append(table_rows)
                continue

            # Check if first line in block looks like a Heading
            first_line = lines_in_block[0]
            if (
                len(first_line) < 80
                and (
                    first_line.isupper()
                    or first_line.endswith(":")
                    or re.match(r"^(Section|Chapter|Notice|Subject|योजना|सूचना|विषय)\b", first_line, re.I)
                    or re.match(r"^\d+[\.\)]\s+", first_line)
                )
            ):
                headings.append(first_line)

            # Paragraph block content
            paragraph_content = " ".join(lines_in_block)
            paragraphs.append(paragraph_content)

        logger.info(f"DocumentParsed: Title='{title}' | Headings={len(headings)} | Paragraphs={len(paragraphs)} | Tables={len(tables)}")

        return {
            "title": title,
            "headings": list(dict.fromkeys(headings)),
            "paragraphs": paragraphs,
            "tables": tables
        }

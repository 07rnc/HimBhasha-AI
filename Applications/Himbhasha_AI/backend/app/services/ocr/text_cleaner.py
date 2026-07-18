import re
import unicodedata
import logging

logger = logging.getLogger("ocr_text_cleaner")

class TextCleaner:
    """Normalizes raw OCR text, removes noise artifacts, fixes broken lines, and merges paragraphs."""

    @staticmethod
    def clean_text(raw_text: str) -> str:
        if not raw_text:
            return ""

        # 1. Unicode Normalization (NFC)
        normalized = unicodedata.normalize("NFC", raw_text)

        # 2. Fix broken hyphenated line breaks (e.g. "gov-\nernment" -> "government")
        text = re.sub(r"(\w+)-\n(\w+)", r"\1\2", normalized)

        # 3. Remove OCR noise symbols/artifacts (random stray non-printable ASCII or control characters)
        text = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]", "", text)

        # 4. Remove excessive duplicate blank lines (3 or more newlines -> 2 newlines)
        text = re.sub(r"\n{3,}", "\n\n", text)

        # 5. Collapse duplicate inline spaces
        text = re.sub(r"[ \t]+", " ", text)

        # 6. Merge broken paragraph lines while preserving double newlines
        lines = [line.strip() for line in text.split("\n")]
        cleaned_lines = []
        for line in lines:
            if not line:
                cleaned_lines.append("")
            else:
                cleaned_lines.append(line)

        final_text = "\n".join(cleaned_lines).strip()
        logger.info(f"Cleaned OCR text ({len(raw_text)} chars -> {len(final_text)} chars).")
        return final_text

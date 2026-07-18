import csv
import json
import io
from typing import List
from .models import ContributionModel

class ContributionExportService:
    """Exports contribution lists to JSON and CSV formats."""

    @staticmethod
    def export_as_json(contributions: List[ContributionModel]) -> str:
        """Exports contributions list to formatted JSON string."""
        raw_data = [item.model_dump() for item in contributions]
        return json.dumps(raw_data, ensure_ascii=False, indent=2)

    @staticmethod
    def export_as_csv(contributions: List[ContributionModel]) -> str:
        """Exports contributions list to CSV format string."""
        output = io.StringIO()
        writer = csv.writer(output)

        # Header
        writer.writerow([
            "ID", "Type", "Title", "Kangri", "Hindi", "English",
            "Description", "Pronunciation", "Category", "District",
            "Submitted By", "Submitted At", "Status"
        ])

        for item in contributions:
            writer.writerow([
                item.id,
                item.type.value if hasattr(item.type, "value") else str(item.type),
                item.title,
                item.kangri or "",
                item.hindi or "",
                item.english or "",
                item.description or "",
                item.pronunciation or "",
                item.category or "",
                item.district or "",
                item.submitted_by or "",
                item.submitted_at,
                item.status.value if hasattr(item.status, "value") else str(item.status)
            ])

        return output.getvalue()

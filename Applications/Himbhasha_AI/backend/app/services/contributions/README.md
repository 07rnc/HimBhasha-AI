# Community Language Preservation Service

This module powers HimBhasha AI's community-driven language preservation platform.

## Key Principles
1. **Read-Only Production Datasets**: Community submissions NEVER directly modify production knowledge base datasets (`KnowledgeBase/*.json`).
2. **Moderation Pipeline**: All submissions enter `KnowledgeBase/community/pending/`. Admin review moves entries to `approved/` or `rejected/`.
3. **Duplicate Detection**: RapidFuzz fuzzy ratio matching checks incoming submissions against 9 production datasets and community queues to prevent duplicates.
4. **Data Integrity & Validation**: Strict UTF-8 verification, XSS sanitization, and required field enforcement.

## Supported Contribution Types
- Dictionary Word
- Phrase
- Proverb
- Story
- Recipe
- Festival
- Place
- Folk Song
- Healthcare Tip
- Agriculture Knowledge
- Tourism Information

## Directory Architecture
- `models.py`: Pydantic models & status enums.
- `schemas.py`: Request & response schemas.
- `validation.py`: Input sanitization and UTF-8 verification.
- `duplicate_detector.py`: RapidFuzz & exact match duplicate detector.
- `moderation.py`: Disk persistence for queue directories.
- `export_service.py`: CSV and JSON dataset generator.
- `contribution_service.py`: Main orchestration service.

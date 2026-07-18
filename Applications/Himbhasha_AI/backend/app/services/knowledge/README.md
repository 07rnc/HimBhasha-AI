# Offline KnowledgeBase Module

The `knowledge` service module provides an offline dataset management layer for HimBhasha AI. It recursively scans the local `KnowledgeBase/` directory for categorized JSON files and validates them against Pydantic schema models.

---

## 1. Directory Structure

The folder structure is organized under `Applications/Himbhasha_AI/backend/KnowledgeBase/`:

```text
KnowledgeBase/
├── dictionary/
│   └── data.json
├── phrases/
│   └── data.json
├── government/
│   └── data.json
├── agriculture/
│   └── data.json
├── healthcare/
│   └── data.json
├── culture/
│   └── data.json
├── education/
│   └── data.json
├── tourism/
│   └── data.json
├── faq/
│   └── data.json
└── metadata/
    └── data.json
```

---

## 2. JSON Entry Formats

### Dictionary Entry
```json
{
  "id": "dict_001",
  "kangri": "बंदगी",
  "hindi": "नमस्ते",
  "english": "Greetings / Hello",
  "pronunciation": "ban-da-gee",
  "part_of_speech": "noun",
  "example_sentence": "सबना जो मेरी बंदगी।"
}
```

### Phrase Entry
```json
{
  "id": "phr_001",
  "kangri": "तुहाड़ा क्या हाल है?",
  "hindi": "आपका क्या हाल है?",
  "english": "How are you?",
  "category": "greeting",
  "context": "Casual or formal greeting"
}
```

---

## 3. How Datasets Are Loaded

1. **Loader Initialization**: `KnowledgeLoader(base_path)` locates `KnowledgeBase/`.
2. **Directory Scanning**: Iterates over subfolders (`dictionary`, `phrases`, `government`, etc.).
3. **Pydantic Validation**: Converts JSON objects to category-specific Pydantic models (`DictionaryEntry`, `PhraseEntry`, etc.).
4. **Error Resiliency**: Logs invalid JSON syntax or missing schema fields and continues parsing remaining entries without interrupting the application startup.

---

## 4. How to Add New Datasets

To expand the offline knowledge base:
1. Place a new `.json` file inside the appropriate category folder under `KnowledgeBase/<category_name>/`.
2. Ensure each entry has a unique `id` and follows the fields outlined in `models.py`.
3. Restart or trigger the loader service to auto-detect and validate the new data.

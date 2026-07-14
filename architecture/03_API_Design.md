# API Design – HimBhasha AI

## Overview

HimBhasha AI follows an API-first architecture.

The frontend communicates only with the FastAPI backend.

The backend is responsible for:

* Input validation
* AI Orchestrator invocation
* Prompt construction
* Response formatting
* Error handling

The frontend never directly calls AI services.

---

# Base URL

```
/api/v1
```

---

# MVP Endpoints

The MVP exposes five endpoints. Similar functionality is merged to avoid duplication.

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| GET | `/health` | Backend health check |
| POST | `/chat` | Text-based conversation |
| POST | `/voice` | Voice input and audio response |
| POST | `/translate` | Language translation |
| POST | `/document` | Document upload, OCR, summary, and Q&A |

---

## 1. Health Check

### GET `/health`

Purpose:

Check whether the backend is running.

Response:

```json
{
  "status": "healthy"
}
```

---

## 2. Chat

### POST `/chat`

Purpose:

Send a text message and receive an AI response.

The AI Orchestrator routes this request through Mem0 (context retrieval) → HIMCorpus Knowledge Layer → Gemini.

Request:

```json
{
  "message": "How are you?",
  "language": "kangdi"
}
```

Response:

```json
{
  "reply": "...",
  "language": "kangdi"
}
```

---

## 3. Voice

### POST `/voice`

Purpose:

Upload voice audio and receive a text and audio response.

Workflow:

```text
Audio
  ↓
Gnani Speech-to-Text
  ↓
Language Detection
  ↓
Mem0
  ↓
Gemini
  ↓
Gnani Text-to-Speech
  ↓
Audio + Text Response
```

Request:

Multipart form with audio file and optional `language` field.

Response:

```json
{
  "text": "...",
  "audio_url": "...",
  "language": "kangdi"
}
```

---

## 4. Translate

### POST `/translate`

Purpose:

Translate text between supported languages.

The AI Orchestrator routes this request through HIMCorpus Knowledge Layer (translation resources) → Gemini.

Request:

```json
{
  "source_language": "kangdi",
  "target_language": "hindi",
  "text": "..."
}
```

Response:

```json
{
  "translated_text": "..."
}
```

---

## 5. Document

### POST `/document`

Purpose:

Upload and process documents. This single endpoint handles OCR extraction, summarization, and question answering — replacing separate `/ocr`, `/document/explain`, and `/document/ask` endpoints.

Supports:

* PDF
* Images

Request:

Multipart form with file upload and optional fields:

```json
{
  "action": "summarize",
  "question": "...",
  "language": "kangdi"
}
```

`action` values: `extract`, `summarize`, `ask`

Response (summarize):

```json
{
  "summary": "...",
  "language": "kangdi"
}
```

Response (ask):

```json
{
  "answer": "...",
  "language": "kangdi"
}
```

Response (extract):

```json
{
  "extracted_text": "...",
  "language": "kangdi"
}
```

---

# Error Responses

## 400

Invalid request.

## 404

Endpoint not found.

## 429

Too many requests.

## 500

Internal server error.

---

# API Principles

The APIs follow these principles:

* Stateless
* RESTful
* JSON-based
* Modular
* Easy to extend
* Independent of frontend implementation

---

# Future APIs

The architecture allows additional APIs in future, including:

* User authentication
* User profiles
* Persistent chat history
* Feedback collection
* Community dataset contributions
* Saved translations
* Analytics
* Admin panel
* Developer API
* Offline synchronization

These are intentionally excluded from the MVP to keep the implementation focused and achievable within the hackathon timeframe.

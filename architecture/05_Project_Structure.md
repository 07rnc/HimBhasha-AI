# Project Structure – HimBhasha AI

## Overview

HimBhasha AI follows a modular architecture that separates the frontend, backend, AI services, and shared resources. This keeps the codebase organized, maintainable, and easy to extend beyond the hackathon.

---

# Root Directory

```text
HimBhasha-AI/
│
├── frontend/
├── backend/
├── shared/
├── docs/
├── .env.example
├── .gitignore
├── docker-compose.yml          (Future)
├── README.md
├── LICENSE
└── requirements.txt
```

---

# Frontend Structure

```text
frontend/
│
├── app/
│   ├── page.tsx
│   ├── chat/
│   ├── voice/
│   ├── translate/
│   └── document/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── chat/
│   ├── voice/
│   ├── translation/
│   └── document/
│
├── hooks/
│
├── lib/
│
├── services/
│
├── types/
│
├── public/
│
├── styles/
│
├── package.json
│
└── next.config.ts
```

---

# Backend Structure

```text
backend/
│
├── app/
│   ├── main.py
│   ├── config.py
│   │
│   ├── api/
│   │   ├── chat.py
│   │   ├── voice.py
│   │   ├── translate.py
│   │   ├── document.py
│   │   └── health.py
│   │
│   ├── orchestrator/
│   │   └── ai_orchestrator.py
│   │
│   ├── services/
│   │   ├── gemini_service.py
│   │   ├── gnani_service.py
│   │   ├── ocr_service.py
│   │   └── mem0_service.py
│   │
│   ├── knowledge/
│   │   └── himcorpus.py
│   │
│   ├── integrations/
│   │   ├── keploy/
│   │   └── slashy/
│   │
│   ├── prompts/
│   │   ├── chat_prompt.py
│   │   ├── translation_prompt.py
│   │   ├── document_prompt.py
│   │   └── system_prompt.py
│   │
│   ├── models/
│   │
│   ├── utils/
│   │
│   └── schemas/
│
├── requirements.txt
│
└── .env
```

---

# Shared Folder

```text
shared/
│
├── constants/
│
├── languages/
│
└── interfaces/
```

The shared folder contains reusable configuration, language definitions, and shared interfaces.

---

# API Endpoints

```text
/api/v1/

GET    /health
POST   /chat
POST   /voice
POST   /translate
POST   /document
```

These five endpoints cover the complete MVP.

---

# Environment Variables

```text
GEMINI_API_KEY=
GNANI_API_KEY=
MEM0_API_KEY=
APP_ENV=development
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
```

---

# Assets

The frontend stores static assets in:

```text
public/

logo/

icons/

illustrations/

audio/

images/
```

---

# Prompt Management

Prompt templates remain separate from business logic.

```text
prompts/

system_prompt.py

chat_prompt.py

translation_prompt.py

document_prompt.py
```

This makes prompts easier to update without changing the API code.

---

# AI Service Layer

Each AI capability is isolated into its own service. The AI Orchestrator coordinates them.

```text
AI Orchestrator
        │
        ├── gemini_service.py    → Gemini API
        ├── gnani_service.py     → Gnani AI (STT + TTS)
        ├── ocr_service.py       → PaddleOCR
        ├── mem0_service.py      → Mem0
        └── himcorpus.py         → HIMCorpus Knowledge Layer
```

`gnani_service.py` handles both Speech-to-Text and Text-to-Speech, replacing the former `whisper_service.py` and `tts_service.py`.

This modular approach allows future replacement of any individual service.

---

# Integrations

```text
integrations/

keploy/     → API and backend testing (development)
slashy/     → Optional workflow automation (development)
```

Keploy and Slashy are development-time integrations and do not appear in the runtime service layer.

---

# Error Handling

A dedicated utility layer manages:

* Input validation
* File validation
* Exception handling
* Response formatting

---

# Future Expansion

The structure is intentionally modular to support future additions such as:

* User authentication
* Persistent chat history
* User profiles
* Admin panel
* Analytics
* Feedback collection
* Additional regional languages
* Retrieval-Augmented Generation (RAG)
* Vector databases
* Mobile applications

These features are outside the MVP but can be integrated without major restructuring.

---

# Project Philosophy

The project structure emphasizes clarity over complexity.

Every major capability — chat, voice, translation, and document understanding — is isolated into dedicated modules. The AI Orchestrator coordinates these modules without coupling them to each other, allowing the development team to work independently on different features while keeping the overall codebase maintainable and scalable.

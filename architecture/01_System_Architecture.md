# System Architecture – HimBhasha AI

## Overview

HimBhasha AI is an AI-powered language platform designed for the regional languages of Himachal Pradesh. It is **not a chatbot** — it is a modular platform that helps users translate, talk using Voice AI, understand documents, learn Himachali languages, and preserve endangered regional languages.

The system is built using a modular architecture so that each component can evolve independently while remaining easy to extend to additional languages in the future.

The MVP focuses on **Kangdi**, while the architecture is designed to support **Mandeali, Kulluvi, Chambeali, Sirmauri, Kinnauri, and Bhoti** with minimal structural changes.

---

# Architecture Goals

The system is designed with the following objectives:

* Modular and maintainable.
* Easy to extend with new languages.
* Support multiple input formats.
* Minimize response latency.
* Reuse proven AI services instead of training everything from scratch.
* Keep the MVP achievable within a 24-hour hackathon.

---

# High-Level Architecture

```text
Client
   │
   ▼
Frontend (Next.js)
   │
   ▼
FastAPI Backend
   │
   ▼
AI Orchestrator
   │
   ├── Gemini API
   ├── Gnani AI
   ├── PaddleOCR
   ├── Mem0
   └── HIMCorpus Knowledge Layer
   │
   ▼
Response
```

The **AI Orchestrator** is the central intelligence of the backend. It receives each request, determines the task type, and routes it to the appropriate AI service — without the frontend needing to know which service handles what.

---

# High-Level Components

The platform consists of five primary layers:

### 1. Client Layer

Responsible for user interaction.

Supports:

* Text Input
* Voice Input
* Document Upload
* Image Upload
* Translation Interface
* Language Learning Interface

---

### 2. Frontend Layer

**Next.js** application that captures user input and displays responses.

Responsibilities:

* Render the user interface
* Handle routing across feature modules (chat, voice, translate, document)
* Upload documents and record voice
* Display AI responses (text and audio)

The frontend communicates only with the FastAPI backend — never directly with AI services.

---

### 3. Backend Layer

**FastAPI** acts as the central controller.

Responsibilities:

* API Management
* Input Validation
* AI Orchestrator invocation
* Prompt Construction
* Response Processing
* Error Handling

Authentication, user profiles, and persistent storage are intentionally excluded from the MVP and listed under Future Expansion.

---

### 4. AI Orchestrator

The routing and coordination layer of the platform.

Responsibilities:

* Task classification (chat, voice, translate, document)
* Service selection (Gemini, Gnani AI, PaddleOCR, Mem0)
* Context retrieval from HIMCorpus Knowledge Layer
* Memory read/write via Mem0
* Response assembly and formatting

The orchestrator ensures each request follows the correct workflow without coupling the API layer to individual AI services.

---

### 5. HIMCorpus Knowledge Layer

Provides curated context and structured information to improve AI responses.

Contains:

* Kangdi Dataset
* Future Himachali Language Datasets
* Translation Resources
* Cultural Knowledge
* Government Terminology
* Educational Resources
* Prompt Templates

This layer is consulted by the AI Orchestrator before every Gemini request to ground responses in regional language data.

---

# AI Services

The AI Orchestrator delegates to the following services:

| Service | Provider | Purpose |
| ------- | -------- | ------- |
| Large Language Model | Gemini API | Conversation, translation, document understanding |
| Speech-to-Text | Gnani AI | Voice input processing |
| Text-to-Speech | Gnani AI | Voice output generation |
| OCR | PaddleOCR | Image and scanned document text extraction |
| Memory | Mem0 | Conversation, preference, and learning progress memory |

---

# Sponsor Integrations

| Partner | Role | Scope |
| ------- | ---- | ----- |
| Gnani AI | Speech-to-Text and Text-to-Speech | Runtime |
| Mem0 | Conversation, preference, and learning memory | Runtime |
| Keploy | API and backend testing | Development |
| Slashy | Optional workflow automation | Development (optional) |

Keploy and Slashy are development-time integrations and do not appear in the runtime architecture.

---

# Supported Input Types

The MVP supports:

* Typed text
* Voice recordings
* Images
* PDF documents

Future versions may support live conversations and video input.

---

# Supported Output Types

The system generates:

* Text Responses
* Voice Responses
* Document Summaries
* Document Question Answering
* Multilingual Translation

---

# Design Principles

The architecture follows these principles:

* Separation of concerns
* Orchestrator-driven service routing
* API-first communication
* Scalable language support
* Reusable processing pipeline
* Minimal coupling between components

---

# Scalability

Although the MVP focuses on Kangdi, the architecture allows additional languages to be introduced by expanding the HIMCorpus Knowledge Layer, prompts, and language configurations without redesigning the overall system.

---

# Security Considerations

For the hackathon MVP:

* Validate uploaded files.
* Limit accepted file types.
* Avoid storing unnecessary personal data.
* Secure API keys using environment variables.

Future versions may introduce authentication, encryption, and role-based access control.

---

# Future Expansion

The architecture is designed to support:

* Additional Himachali languages.
* User authentication and profiles.
* Persistent database and chat history.
* Admin panel and analytics.
* Offline language packs.
* Community-contributed datasets.
* AI-powered educational modules.
* Government service integrations.
* Public APIs for developers.

---

# Architecture Philosophy

HimBhasha AI does not attempt to replace existing AI models.

Instead, it acts as an intelligent orchestration layer that combines speech recognition, OCR, multilingual reasoning, translation, memory, and curated regional language resources to deliver a localized AI experience for Himachal Pradesh.

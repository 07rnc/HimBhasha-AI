# Technology Stack – HimBhasha AI

## Philosophy

The technology stack for HimBhasha AI is designed around three principles:

* **Build fast** within a 24-hour hackathon.
* **Use reliable AI services** instead of training models from scratch.
* **Keep the architecture modular** so individual components can be replaced or upgraded in the future.

---

# Frontend

## Framework

**Next.js 15**

Reason:

* Fast development
* App Router
* Excellent deployment support
* Modern React ecosystem

---

## UI Library

**React 19**

Reason:

* Component-based architecture
* Easy state management
* Large ecosystem

---

## Styling

**Tailwind CSS**

Reason:

* Rapid UI development
* Responsive design
* Minimal custom CSS

---

## UI Components

**shadcn/ui**

Reason:

* Accessible components
* Clean modern interface
* Easy customization

---

# Backend

## Framework

**FastAPI**

Reason:

* Python-native
* Excellent for AI applications
* Automatic API documentation
* High performance

---

## Server

**Uvicorn**

Reason:

* Lightweight
* ASGI compatible
* Production ready

---

# Artificial Intelligence

## AI Orchestrator

**Custom FastAPI module**

Responsibilities:

* Task classification and service routing
* Context assembly from Mem0 and HIMCorpus
* Response formatting

The orchestrator is the central coordination layer — it does not replace individual AI services but selects and sequences them per request.

---

## Large Language Model

**Gemini 2.5 Flash**

Responsibilities:

* Conversation
* Translation
* Document explanation
* Question answering
* Reasoning

Why selected:

* Fast inference
* Strong multimodal capabilities
* Suitable for hackathon development

---

## Speech Recognition & Text-to-Speech

**Gnani AI**

Responsibilities:

* Speech-to-Text (voice input processing)
* Text-to-Speech (voice output generation)

Gnani AI replaces both Whisper and the Browser Speech API, providing a unified voice pipeline for the MVP.

---

## OCR

**PaddleOCR**

Responsibilities:

* Image text extraction
* Scanned document processing
* Government document reading

---

## Memory

**Mem0**

Responsibilities:

* Conversation Memory
* User Preference Memory
* Learning Progress Memory

Mem0 is consulted before every conversational Gemini request and updated after each response.

---

# Knowledge Layer

## HIMCorpus Knowledge Layer

A curated collection of regional language resources consulted by the AI Orchestrator:

* Kangdi Dataset
* Future Himachali Language Datasets
* Translation Resources
* Cultural Knowledge
* Government Terminology
* Educational Resources
* Prompt Templates

---

# Language Processing

The MVP supports:

* Kangdi
* Hindi
* English

Future versions will add:

* Mandeali
* Kulluvi
* Chambeali
* Sirmauri
* Kinnauri
* Bhoti

---

# Sponsor Integrations

| Partner | Technology | Scope |
| ------- | ---------- | ----- |
| Gnani AI | Speech-to-Text, Text-to-Speech | Runtime |
| Mem0 | Conversation and learning memory | Runtime |
| Keploy | API and backend testing | Development |
| Slashy | Optional workflow automation | Development (optional) |

---

# Development Tools

## Version Control

Git

GitHub

---

## Code Editor

Visual Studio Code

---

## API Testing

**Keploy** (sponsor integration)

Purpose:

* Automated API testing
* Backend regression testing
* Record-and-replay test generation

**FastAPI Swagger UI** and **Postman** remain available as supplementary tools.

---

## Workflow Automation

**Slashy** (optional sponsor integration)

May be used for development workflow automation such as CI triggers or deployment notifications. Not part of the runtime architecture.

---

# Deployment

## Frontend

Vercel

---

## Backend

Render

---

# Database

No persistent database is included in the MVP.

The application operates without user accounts, stored chat history, or user sessions. Mem0 provides in-session memory without requiring a persistent database.

Future versions may integrate PostgreSQL or Supabase if persistent storage becomes necessary.

---

# Project Dependencies

## Frontend

* Next.js
* React
* Tailwind CSS
* shadcn/ui
* Axios

---

## Backend

* FastAPI
* Uvicorn
* Pydantic
* python-multipart
* Pillow

---

## AI Libraries

* google-genai (Gemini SDK)
* mem0ai (Mem0 SDK)
* PaddleOCR
* Gnani AI SDK

---

# Technology Selection Criteria

Each technology was chosen based on:

* Ease of integration
* Community support
* Documentation quality
* Performance
* Suitability for rapid MVP development

---

# Future Enhancements

The architecture is designed so that individual technologies can be replaced without redesigning the entire system.

Examples include:

* Switching to a different LLM
* Adding vector search (RAG) over HIMCorpus
* Introducing a persistent database
* User authentication and profiles
* Supporting offline inference
* Fine-tuning models for Himachali languages

---

# Summary

| Layer | Technology |
| ----- | ---------- |
| Frontend | Next.js + React |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | FastAPI |
| AI Orchestrator | Custom FastAPI module |
| LLM | Gemini 2.5 Flash |
| Speech-to-Text | Gnani AI |
| Text-to-Speech | Gnani AI Voice API |
| OCR | PaddleOCR |
| Memory | Mem0 |
| Knowledge Layer | HIMCorpus |
| API Testing | Keploy |
| Version Control | Git + GitHub |
| Deployment | Vercel + Render |
| Database | None (MVP) |

# Deployment Architecture – HimBhasha AI

## Overview

The deployment architecture for HimBhasha AI is designed to be lightweight, scalable, and easy to deploy during a 24-hour hackathon.

The application is divided into two independent services:

* Frontend (Next.js)
* Backend (FastAPI)

Both communicate over secure REST APIs.

---

# Deployment Architecture

```text
                    User
                      │
                      ▼
                Web Browser
                      │
                      ▼
          Frontend (Next.js)
               Vercel Hosting
                      │
          HTTPS REST API Calls
                      │
                      ▼
          Backend (FastAPI)
             Render Hosting
                      │
                      ▼
              AI Orchestrator
                      │
      ┌───────────────┼───────────────┬──────────────┐
      │               │               │              │
      ▼               ▼               ▼              ▼
  Gemini API      Gnani AI          Mem0        PaddleOCR
                      │
                      ▼
          HIMCorpus Knowledge Layer
```

The backend does not call AI services directly from API routes. Every request passes through the **AI Orchestrator**, which intelligently routes to the correct service based on task type.

---

# Intelligent Request Routing

The AI Orchestrator classifies each incoming request and selects the appropriate service pipeline:

| Request | Route |
| ------- | ----- |
| POST `/chat` | Mem0 → HIMCorpus → Gemini |
| POST `/voice` | Gnani STT → Mem0 → HIMCorpus → Gemini → Gnani TTS |
| POST `/translate` | HIMCorpus → Gemini |
| POST `/document` | PaddleOCR → HIMCorpus → Gemini |
| GET `/health` | Direct response (no AI services) |

This routing is transparent to the frontend — it sends a request to one endpoint and receives a formatted response.

---

# Frontend Deployment

Platform:

* Vercel

Responsibilities:

* Render the user interface
* Handle routing
* Capture user input
* Upload documents
* Record voice
* Display AI responses (text and audio)

---

# Backend Deployment

Platform:

* Render

Responsibilities:

* Receive API requests
* Validate input
* Invoke the AI Orchestrator
* Return formatted responses

---

# External AI Services

## Gemini API

Used for:

* AI conversation
* Translation
* Document explanation
* Question answering

---

## Gnani AI

Used for:

* Speech-to-Text (voice input)
* Text-to-Speech (voice output)

---

## Mem0

Used for:

* Conversation memory
* User preference memory
* Learning progress memory

---

## PaddleOCR

Used for:

* Text extraction from images
* Reading scanned PDF documents

---

## HIMCorpus Knowledge Layer

Used for:

* Regional language context
* Translation resources
* Cultural and government terminology
* Prompt templates

---

# Sponsor Integrations (Development)

## Keploy

Used during development for:

* Automated API testing
* Backend regression testing

Keploy is not part of the runtime deployment architecture.

---

## Slashy

Optional development-time workflow automation partner. Not part of the runtime deployment architecture.

---

# API Communication

All communication follows HTTPS.

Example flow:

```text
Frontend
   ↓
POST /chat
   ↓
Backend
   ↓
AI Orchestrator
   ↓
Mem0 → HIMCorpus → Gemini
   ↓
Backend
   ↓
Frontend
```

---

# File Upload Flow

```text
User Uploads PDF
   ↓
Frontend
   ↓
POST /document
   ↓
Backend
   ↓
AI Orchestrator
   ↓
PaddleOCR → HIMCorpus → Gemini
   ↓
Summary / Answer
   ↓
Frontend
```

---

# Voice Flow

```text
User Speaks
   ↓
Frontend
   ↓
POST /voice
   ↓
Backend
   ↓
AI Orchestrator
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
User Hears Response
```

---

# Environment Variables

## Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Backend

```env
GEMINI_API_KEY=your_api_key
GNANI_API_KEY=your_api_key
MEM0_API_KEY=your_api_key
APP_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

# Local Development

## Frontend

```bash
npm install
npm run dev
```

Runs on:

```
http://localhost:3000
```

---

## Backend

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Runs on:

```
http://localhost:8000
```

---

# Production Deployment

## Frontend

Push to GitHub.

Deploy using Vercel.

---

## Backend

Push to GitHub.

Deploy using Render.

Add environment variables before deployment.

---

# Security

The MVP follows these security principles:

* API keys stored in environment variables
* No hardcoded secrets
* File type validation
* Request validation
* HTTPS communication
* Input sanitization

---

# Performance Goals

Target response times:

| Feature | Target Time |
| ------- | ----------- |
| Chat | < 5 seconds |
| Translation | < 4 seconds |
| Voice | < 8 seconds |
| OCR | < 10 seconds |
| Document Summary | < 15 seconds |

---

# Failure Handling

If Gemini is unavailable:

* Return a friendly error message.

If Gnani AI is unavailable:

* Fall back to text-only response for voice requests.

If OCR fails:

* Ask the user to upload a clearer document.

If speech recognition fails:

* Ask the user to speak again.

If the backend is unavailable:

* Notify the user and suggest retrying.

---

# Future Deployment

Future versions may include:

* Docker containers
* Kubernetes
* CDN for static assets
* Monitoring dashboards
* Analytics
* Auto-scaling
* Offline AI models
* Persistent database
* User authentication

These enhancements are outside the MVP and are intentionally excluded from the hackathon implementation.

---

# Conclusion

The deployment architecture prioritizes simplicity, reliability, and rapid delivery. By separating the frontend and backend while routing all AI requests through a central orchestrator, the system remains easy to develop, deploy, and demonstrate within the constraints of a 24-hour hackathon.

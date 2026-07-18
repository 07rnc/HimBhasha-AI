# HimBhasha AI — Engineering Roadmap

## Completed Sprints
- [x] **Sprint 1: Project Foundation** (Next.js 15 App Router, FastAPI backend, Apple UI theme system)
- [x] **Sprint 2: Gemini Integration & Meet Vaani** (REST Gemini service, chat routes, Meet Vaani UI)
- [x] **Sprint 3: Gnani Voice Module** (Speech-to-Text, Text-to-Speech handlers, Web Speech browser integration)
- [x] **Sprint 4: PaddleOCR Integration (Backend)** (PaddleOCR service layer, image/PDF processing, singleton fallback client)

---

## Active Sprint: Sprint 5 — Document OCR UI & Frontend Integration

### Engineering Tickets
- [x] **Ticket 5.1: Document OCR Upload Component**
  - **Objective**: Build `DocumentOCR.tsx` component with drag-and-drop file support (PNG, JPG, PDF), base64 encoding, and `/api/document` endpoint integration.
- [ ] **Ticket 5.2: OCR Extraction Results Viewer**
  - **Objective**: Implement text preview modal, copy-to-clipboard, confidence score indicator, and translation triggers.
- [x] **Ticket 5.3: Offline Knowledge Base Chat Engine Integration**
  - **Objective**: Replaced Gemini chat engine in `POST /chat` route with `KnowledgeService` hybrid search engine over `KnowledgeBase/` categories.
- [x] **Ticket 5.4: 9-Dataset Search Engine & In-Memory Performance Upgrade**
  - **Objective**: Upgraded `SearchEngine` and `KnowledgeService` to search across all 9 dataset categories (Dictionary, Phrases, FAQ, Government, Agriculture, Healthcare, Culture, Education, Tourism) using 6-tier matching algorithms and in-memory dataset caching.

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
- [ ] **Ticket 5.3: Preserve Page Document Upload Workflow**
  - **Objective**: Integrate `DocumentOCR` component into `/preserve` page.

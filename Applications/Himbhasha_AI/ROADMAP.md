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
- [x] **Ticket 5.5: Offline Intent Detection Engine & Dataset Routing**
  - **Objective**: Created rule-based `IntentClassifier` for fast (<10ms) query classification across 12 supported intents with target dataset routing and low-confidence fallback.
- [x] **Ticket 5.6: Response Engine & Intent-Aware Conversational Output**
  - **Objective**: Created `ResponseEngine` to format raw search results into rich, intent-aware markdown responses with suggestions, summaries, and zero hallucinations.
- [x] **Ticket 5.7: Ask Vaani Offline Assistant UI & Micro-Animations**
  - **Objective**: Enhanced Meet Vaani UI with always-visible `🟢 Offline Knowledge Engine Active` status badge, quick action category chips, animated loading messages, empty state cards, local search history in localStorage, and Framer Motion micro-animations.

---

## Sprint 6 — Offline Translation Engine & API Layer

### Engineering Tickets
- [x] **Ticket 6.1: Offline Translation Engine & Language Classifier**
  - **Objective**: Created `TranslationService`, `TranslationEngine`, `TranslationUtils`, and `TranslationModels` inside `app/services/translation/` supporting 6 bidirectional language pairs (Kangri, Hindi, English) with sub-15ms in-memory query execution.
- [x] **Ticket 6.2: Offline Translator UI & Bookmarks System**
  - **Objective**: Upgraded `app/translate/page.tsx` with Auto-Detect language dropdowns, bidirectional language swap, quick example chips, confidence & category badges, local search history (max 20), and local favorites bookmarking in localStorage.
- [x] **Ticket 6.3: Translation Intelligence & Sentence Reconstruction**
  - **Objective**: Upgraded `TranslationEngine` with Phrase-First matching, tokenized Word-by-Word sentence reconstruction, Synonym/Keyword fallback search, RapidFuzz multi-ratio matching, and processing time metadata (<50ms execution).
- [x] **Ticket 6.4: Offline Translation Module Polish & Advanced Features**
  - **Objective**: Enhanced `app/translate/page.tsx` with Pronunciation Cards, Word Info, Clickable Related Words Chips, Low Confidence Suggestions, Keyboard Shortcuts (`Enter`, `Ctrl+L`, `Ctrl+Shift+S`), and Exporting (TXT / JSON).

---

## Sprint 7 — Offline Document Reader & OCR Engine

### Engineering Tickets
- [x] **Ticket 7.1: Offline Document Reader & Structured OCR Parser**
  - **Objective**: Created `DocumentReaderService`, `TextCleaner`, `DocumentParser`, `OCRFormatter`, and `StructuredDocumentResponse` in `app/services/ocr/` to convert image and PDF OCR output into structured document titles, headings, paragraph blocks, and tables under 2s (image) / 5s (PDF).
- [x] **Ticket 7.2: Offline Document Analyzer & Knowledge Alignment**
  - **Objective**: Created `DocumentClassifier`, `DocumentAnalyzer`, and `DocumentAnalysisResponse` in `app/services/document/` to perform intelligent offline classification (<100ms) and KnowledgeBase alignment (<100ms) across 9 supported document types.
- [x] **Ticket 7.3: Offline Document Q&A Engine & Document Chat UI**
  - **Objective**: Created `QuestionMatcher`, `ContextBuilder`, and `DocumentQAEngine` in `app/services/document/` and updated `DocumentOCR.tsx` to support offline document question answering (<100ms) with preset chips, question history (max 10), and 3 suggested related questions.

---

## Sprint 8 — Community Language Preservation Platform

### Engineering Tickets
- [x] **Sprint 8: Community Preservation Platform & Moderation Engine**
  - **Objective**: Built `ContributionService`, `ContributionValidator`, `DuplicateDetector`, `ModerationManager`, and `ContributionExportService` in `app/services/contributions/` with persistent queue storage (`pending/`, `approved/`, `rejected/`), REST API routes (`POST /contributions`, `GET /contributions`, `GET /statistics`, `PUT approve/reject`), User Contribution Form (`app/contribute/page.tsx`), and Admin Moderation Dashboard (`app/admin/contributions/page.tsx`).

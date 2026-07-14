# User Flow – HimBhasha AI

## Overview

This document defines the complete navigation flow for HimBhasha AI. The platform is designed for users who may have limited digital literacy, so every path is short, predictable, and reversible.

There is no login, no onboarding wizard, and no account creation in the MVP. Users arrive, select a language, and begin using the platform immediately.

---

# Primary User Journey

```text
Landing Page
      │
      ▼
Language Selection (Kangdi / Hindi / English UI)
      │
      ▼
Home Dashboard
      │
      ├──► Chat Module
      ├──► Voice Module
      ├──► Translate Module
      ├──► Document Module
      ├──► Learn Module
      └──► Preserve Language Module
      │
      ▼
Result / Interaction Screen
      │
      ▼
Back to Home
```

---

# Entry Flow

## Step 1 — Landing Page

**Purpose:** Introduce HimBhasha AI and communicate its mission.

**User sees:**
- Project name and tagline
- Brief description of capabilities
- "Get Started" call-to-action button
- Language preservation message

**User action:** Tap or click "Get Started"

**Next screen:** Language Selection

---

## Step 2 — Language Selection

**Purpose:** Set the interface language and default AI response language.

**User sees:**
- Three language options: Kangdi, Hindi, English
- Brief description of each
- Selected state indicator

**User action:** Select preferred language → Continue

**System behavior:**
- Interface text switches to selected language
- Default AI response language is set
- Selection stored in browser session (no account required)

**Next screen:** Home Dashboard

---

# Home Dashboard Flow

## Step 3 — Home

**Purpose:** Central hub for all platform features.

**User sees:**
- Welcome message in selected language
- Six feature cards arranged in a grid:
  1. **Chat** — Text conversation with AI
  2. **Voice** — Speak and hear responses
  3. **Translate** — Convert between languages
  4. **Document** — Upload and understand documents
  5. **Learn** — Practice Kangdi phrases
  6. **Preserve** — Contribute language data
- Bottom navigation bar (Home, Help)
- Language selector in header

**User action:** Tap any feature card

**Next screen:** Selected module

---

# Module Flows

## Flow A — Chat

```text
Home
  │
  ▼
Chat Screen
  │
  ├── Type message → Send
  │       │
  │       ▼
  │   Loading indicator
  │       │
  │       ▼
  │   AI response appears in chat bubble
  │       │
  │       └── Continue conversation (loop)
  │
  └── Tap Back → Home
```

**Key interactions:**
- Text input field at bottom
- Send button (enabled when text is present)
- Chat bubbles: user (right), AI (left)
- Loading spinner while waiting for response
- Error toast if request fails

---

## Flow B — Voice

```text
Home
  │
  ▼
Voice Screen
  │
  ├── Tap microphone button
  │       │
  │       ▼
  │   Recording state (pulsing mic icon)
  │       │
  │       ▼
  │   Tap again to stop
  │       │
  │       ▼
  │   Processing indicator
  │       │
  │       ▼
  │   Transcribed text displayed
  │   AI text response displayed
  │   Audio response plays automatically
  │       │
  │       └── Tap mic again for next turn (loop)
  │
  └── Tap Back → Home
```

**Key interactions:**
- Large central microphone button
- Visual recording feedback (pulse animation)
- Transcription shown above response
- Play/pause button for audio replay
- Error state if microphone permission denied

---

## Flow C — Translate

```text
Home
  │
  ▼
Translate Screen
  │
  ├── Select source language (Kangdi / Hindi / English)
  ├── Select target language
  ├── Type or paste text
  │       │
  │       ▼
  │   Tap Translate
  │       │
  │       ▼
  │   Loading indicator
  │       │
  │       ▼
  │   Translated text displayed
  │   Copy button available
  │       │
  │       └── Swap languages / new translation (loop)
  │
  └── Tap Back → Home
```

**Key interactions:**
- Language swap button between source and target
- Text area for input
- Translated output in a distinct card
- Copy-to-clipboard action
- Character count indicator

---

## Flow D — Document

```text
Home
  │
  ▼
Document Screen
  │
  ├── Choose action: Summarize / Ask Question / Extract Text
  ├── Upload file (PDF or image)
  │       │
  │       ▼
  │   File preview shown
  │       │
  │       ▼
  │   Tap Process
  │       │
  │       ▼
  │   Processing indicator (OCR + AI)
  │       │
  │       ▼
  │   Result displayed (summary / answer / extracted text)
  │       │
  │       └── Upload new document (loop)
  │
  └── Tap Back → Home
```

**Key interactions:**
- Drag-and-drop or tap-to-upload zone
- File type validation (PDF, JPG, PNG)
- Action selector tabs
- Question input field (visible only for "Ask Question" action)
- Result card with copy option

---

## Flow E — Learn

```text
Home
  │
  ▼
Learn Screen
  │
  ├── Browse categories (Greetings, Family, Food, etc.)
  │       │
  │       ▼
  │   Phrase list for selected category
  │       │
  │       ▼
  │   Tap phrase → See Kangdi text, Hindi, English, pronunciation
  │       │
  │       ▼
  │   Tap play icon → Hear pronunciation (if audio available)
  │       │
  │       └── Browse more phrases (loop)
  │
  └── Tap Back → Home
```

**Key interactions:**
- Category grid on Learn home
- Phrase cards with Kangdi text prominent
- Pronunciation guide below each phrase
- Audio play button per phrase
- Progress indicator (phrases viewed in session)

---

## Flow F — Preserve Language

```text
Home
  │
  ▼
Preserve Language Screen
  │
  ├── Read contribution guidelines
  ├── Choose contribution type:
  │     • Record a phrase
  │     • Submit a translation
  │     • Add cultural context
  │       │
  │       ▼
  │   Fill form (phrase, translation, domain, notes)
  │       │
  │       ▼
  │   Optional: Record audio
  │       │
  │       ▼
  │   Tap Submit
  │       │
  │       ▼
  │   Success confirmation
  │       │
  │       └── Contribute another (loop)
  │
  └── Tap Back → Home
```

**Key interactions:**
- Clear guidelines before form
- Simple form fields (no account required)
- Optional audio recording
- Success toast with thank-you message
- Link to HIMCorpus dataset information

---

# Result Screen Pattern

All modules share a common result pattern:

```text
User Action
      │
      ▼
Loading State
  • Spinner or skeleton
  • "Processing..." message in user's language
      │
      ├── Success → Result displayed in card/bubble
      │
      └── Error → Error card with retry option
              │
              ▼
        User taps Retry or Back
```

---

# Navigation Rules

| Rule | Description |
| ---- | ----------- |
| Maximum depth | 2 levels from Home (Home → Module → Result) |
| Back button | Always visible in module headers |
| Home access | Bottom nav or header logo always returns to Home |
| No dead ends | Every screen has a clear exit path |
| Session persistence | Language selection persists in browser session |
| No login gates | All features accessible immediately |

---

# Error Recovery Flows

## Network Error

```text
Action fails
  │
  ▼
Error toast: "Connection problem. Please try again."
  │
  ▼
Retry button on the same screen
  │
  ▼
User retries or goes Back to Home
```

## Microphone Permission Denied

```text
User taps mic
  │
  ▼
Browser denies permission
  │
  ▼
Dialog: "Microphone access is needed for voice features."
  │
  ▼
Instructions to enable in browser settings
  │
  ▼
User returns and retries
```

## File Upload Error

```text
User uploads invalid file
  │
  ▼
Inline error: "Please upload a PDF or image file."
  │
  ▼
Upload zone remains active for retry
```

---

# User Personas and Flow Priorities

| Persona | Primary Flow | Design Priority |
| ------- | ------------ | --------------- |
| Elderly resident | Voice → Home | Large buttons, voice-first |
| Student | Learn → Chat | Educational content, clear text |
| Farmer | Translate → Document | Simple language, practical domains |
| Tourist | Translate → Voice | Quick access, multilingual |
| Researcher | Preserve → Document | Data contribution, OCR |
| Government user | Document → Translate | Official terminology support |

---

# Flow Consistency with Architecture

| UI Module | API Endpoint | AI Services |
| --------- | ------------ | ----------- |
| Chat | POST `/chat` | Mem0 → HIMCorpus → Gemini |
| Voice | POST `/voice` | Gnani STT → Mem0 → Gemini → Gnani TTS |
| Translate | POST `/translate` | HIMCorpus → Gemini |
| Document | POST `/document` | PaddleOCR → HIMCorpus → Gemini |
| Learn | HIMCorpus (read-only) | Local dataset display |
| Preserve | Future API | Form submission (MVP: local storage) |

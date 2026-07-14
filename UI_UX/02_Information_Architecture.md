# Information Architecture – HimBhasha AI

## Overview

This document defines every page, screen, and content area in HimBhasha AI. The information architecture follows a flat hierarchy optimized for quick access — users should reach any feature within two taps from Home.

---

# Site Map

```text
HimBhasha AI
│
├── Landing
│
├── Language Selection
│
├── Home
│   ├── Chat
│   ├── Voice
│   ├── Translate
│   ├── Document
│   ├── Learn
│   │   └── Category Detail (per domain)
│   └── Preserve Language
│
├── Help
│
├── Error Pages
│   ├── 404 Not Found
│   ├── Network Error
│   └── Service Unavailable
│
└── Settings (Future)
    ├── Language Preferences
    ├── Audio Preferences
    └── About
```

---

# Page Definitions

## Landing

| Attribute | Value |
| --------- | ----- |
| URL | `/` |
| Purpose | Introduce the platform and drive users to begin |
| Access | Public, no authentication |
| Key content | Hero section, mission statement, feature highlights, CTA |
| Primary action | "Get Started" → Language Selection |
| Navigation | None (full-screen entry point) |

---

## Language Selection

| Attribute | Value |
| --------- | ----- |
| URL | `/select-language` |
| Purpose | Set interface and default AI language |
| Access | Public |
| Key content | Language cards (Kangdi, Hindi, English) |
| Primary action | Select language → Home |
| Navigation | Back to Landing |

---

## Home

| Attribute | Value |
| --------- | ----- |
| URL | `/home` |
| Purpose | Central dashboard for all features |
| Access | Public |
| Key content | Welcome message, six feature cards, quick tips |
| Primary action | Tap any feature card |
| Navigation | Header (logo, language selector), bottom nav (Home, Help) |

**Feature cards on Home:**

| Card | Label (EN) | Label (Kangdi) | Route |
| ---- | ---------- | -------------- | ----- |
| Chat | AI Chat | AI गल्ल | `/chat` |
| Voice | Voice Talk | आवाज़ गल्ल | `/voice` |
| Translate | Translate | अनुवाद | `/translate` |
| Document | Documents | दस्तावेज़ | `/document` |
| Learn | Learn Kangdi | कांगड़ी सिखो | `/learn` |
| Preserve | Preserve Language | भाषा बचाओ | `/preserve` |

---

## Chat

| Attribute | Value |
| --------- | ----- |
| URL | `/chat` |
| Purpose | Text-based AI conversation |
| Access | Public |
| Key content | Message history, input field, send button |
| Primary action | Type message and send |
| Navigation | Back to Home, header language selector |
| API | POST `/chat` |

**Content areas:**
- Chat message list (scrollable)
- User input bar (fixed at bottom)
- Empty state: "Ask me anything in Kangdi, Hindi, or English"

---

## Voice

| Attribute | Value |
| --------- | ----- |
| URL | `/voice` |
| Purpose | Voice-based AI conversation |
| Access | Public |
| Key content | Microphone button, transcription display, audio player |
| Primary action | Tap mic to record, tap again to stop |
| Navigation | Back to Home |
| API | POST `/voice` |

**Content areas:**
- Large microphone button (center)
- Recording status indicator
- Transcription text area
- AI response text
- Audio playback controls

---

## Translate

| Attribute | Value |
| --------- | ----- |
| URL | `/translate` |
| Purpose | Translate text between Kangdi, Hindi, and English |
| Access | Public |
| Key content | Source/target selectors, input area, output card |
| Primary action | Enter text and tap Translate |
| Navigation | Back to Home |
| API | POST `/translate` |

**Content areas:**
- Source language dropdown
- Target language dropdown
- Language swap button
- Input text area
- Output translation card
- Copy button

---

## Document

| Attribute | Value |
| --------- | ----- |
| URL | `/document` |
| Purpose | Upload and understand documents via OCR and AI |
| Access | Public |
| Key content | Upload zone, action tabs, result display |
| Primary action | Upload file and process |
| Navigation | Back to Home |
| API | POST `/document` |

**Content areas:**
- Action tabs: Summarize | Ask Question | Extract Text
- File upload zone (drag-and-drop + tap)
- File preview thumbnail
- Question input (visible for "Ask Question" tab)
- Result card (summary, answer, or extracted text)

---

## Learn

| Attribute | Value |
| --------- | ----- |
| URL | `/learn` |
| Purpose | Browse and practice Kangdi phrases by category |
| Access | Public |
| Key content | Category grid, phrase lists |
| Primary action | Browse categories and tap phrases |
| Navigation | Back to Home, back from category detail |

**Sub-pages:**

| Category | Route | Content |
| -------- | ----- | ------- |
| Greetings | `/learn/greetings` | Common greetings |
| Daily Conversation | `/learn/daily-conversation` | Everyday phrases |
| Family | `/learn/family` | Family terms |
| Food | `/learn/food` | Food vocabulary |
| Numbers | `/learn/numbers` | Counting |
| Weather | `/learn/weather` | Weather expressions |
| Education | `/learn/education` | School-related terms |
| Healthcare | `/learn/healthcare` | Health vocabulary |
| Agriculture | `/learn/agriculture` | Farming terms |
| Government | `/learn/government` | Official terms |
| Tourism | `/learn/tourism` | Travel phrases |
| Culture | `/learn/culture` | Cultural expressions |
| Emergency | `/learn/emergency` | Emergency phrases |
| Questions | `/learn/questions` | Question forms |
| Verbs | `/learn/verbs` | Common verbs |

**Category detail page content:**
- Phrase list (Kangdi text, Hindi, English, pronunciation)
- Audio play button per phrase
- Progress indicator

---

## Preserve Language

| Attribute | Value |
| --------- | ----- |
| URL | `/preserve` |
| Purpose | Allow users to contribute language data to HIMCorpus |
| Access | Public |
| Key content | Guidelines, contribution form |
| Primary action | Submit phrase, translation, or audio |
| Navigation | Back to Home |

**Content areas:**
- Contribution guidelines
- Form fields: phrase (Kangdi), Hindi translation, English translation, domain, notes
- Optional audio recorder
- Submit button
- Success confirmation

---

## Help

| Attribute | Value |
| --------- | ----- |
| URL | `/help` |
| Purpose | Provide usage instructions and FAQs |
| Access | Public |
| Key content | How-to guides, FAQ, contact information |
| Primary action | Read guides |
| Navigation | Back to Home |

**Content sections:**
- How to use each feature
- Supported languages
- File upload requirements
- Voice recording tips
- About HIMCorpus
- Contact / feedback link

---

## Settings (Future)

| Attribute | Value |
| --------- | ----- |
| URL | `/settings` |
| Purpose | User preferences (post-MVP) |
| Access | Future — requires authentication |
| Status | Not included in MVP |

**Planned sections:**
- Language preferences
- Audio playback speed
- Text size adjustment
- About HimBhasha AI
- Account management (future)

---

## Error Pages

### 404 Not Found

| Attribute | Value |
| --------- | ----- |
| URL | Any invalid route |
| Content | Friendly message, link to Home |
| Action | "Go to Home" button |

### Network Error

| Attribute | Value |
| --------- | ----- |
| Trigger | API request failure |
| Content | "Connection problem" message with retry |
| Action | Retry button, link to Home |

### Service Unavailable

| Attribute | Value |
| --------- | ----- |
| Trigger | Backend health check fails |
| Content | "Service temporarily unavailable" |
| Action | Retry after delay, link to Help |

---

# Content Hierarchy

```text
Level 0: Landing (entry)
Level 1: Language Selection, Home, Help
Level 2: Feature modules (Chat, Voice, Translate, Document, Learn, Preserve)
Level 3: Learn category detail only
```

Maximum navigation depth: **3 levels** (Home → Learn → Category)

---

# Navigation Components

| Component | Location | Behavior |
| --------- | -------- | -------- |
| Header | All pages except Landing | Logo (→ Home), language selector |
| Bottom nav | Home, Help | Home icon, Help icon |
| Back button | All module pages | Returns to Home |
| Breadcrumb | Learn category detail | Home → Learn → Category name |

---

# Content Relationships

```text
HIMCorpus Dataset
      │
      ├──► Learn Module (read phrases by category)
      ├──► Translate Module (translation resources)
      ├──► Chat Module (context via AI Orchestrator)
      ├──► Document Module (terminology context)
      └──► Preserve Module (user contributions)
```

---

# URL Structure

| Page | Route | Dynamic |
| ---- | ----- | ------- |
| Landing | `/` | No |
| Language Selection | `/select-language` | No |
| Home | `/home` | No |
| Chat | `/chat` | No |
| Voice | `/voice` | No |
| Translate | `/translate` | No |
| Document | `/document` | No |
| Learn | `/learn` | No |
| Learn Category | `/learn/[category]` | Yes |
| Preserve | `/preserve` | No |
| Help | `/help` | No |
| 404 | `/*` (fallback) | Yes |

---

# Metadata per Page

| Page | Title | Description |
| ---- | ----- | ----------- |
| Landing | HimBhasha AI – Regional Language Platform | AI platform for Himachal Pradesh languages |
| Home | Home – HimBhasha AI | Access all features |
| Chat | Chat – HimBhasha AI | Text conversation with AI |
| Voice | Voice – HimBhasha AI | Speak and hear AI responses |
| Translate | Translate – HimBhasha AI | Translate between Kangdi, Hindi, English |
| Document | Documents – HimBhasha AI | Upload and understand documents |
| Learn | Learn Kangdi – HimBhasha AI | Practice Kangdi phrases |
| Preserve | Preserve Language – HimBhasha AI | Contribute to HIMCorpus |
| Help | Help – HimBhasha AI | Usage guides and FAQs |

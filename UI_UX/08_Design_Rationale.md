# Design Rationale – HimBhasha AI

## Overview

This document explains the reasoning behind every major design decision in HimBhasha AI. Each decision is tied to a user need, a technical constraint, or a project principle.

---

# Why Cards?

## Decision

The Home dashboard uses a **card-based grid** to present the six platform features.

## Rationale

| Reason | Detail |
| ------ | ------ |
| Scannability | Users can see all options at once without scrolling or reading menus |
| Touch-friendly | Cards provide large tap targets (minimum 120×120px) suitable for elderly users |
| Visual hierarchy | Icon + title + subtitle communicates purpose without reading paragraphs |
| Extensibility | New features can be added as additional cards without redesigning navigation |
| Familiarity | Card grids are widely understood across mobile apps in India |
| Language-agnostic | Icons communicate function even when the user cannot read the label |

## Alternatives Considered

| Alternative | Why Rejected |
| ----------- | ------------ |
| Sidebar navigation | Too complex for mobile, unfamiliar to low-literacy users |
| Tab bar with 6 tabs | Too crowded, small touch targets |
| List menu | Less visual, requires more reading |
| Single search bar | Requires typing — excludes voice-first and low-literacy users |

---

# Why Voice First?

## Decision

Voice is positioned as the **second feature card** (prominent placement) and designed with the largest interaction element (80px microphone button).

## Rationale

| Reason | Detail |
| ------ | ------ |
| Target audience | Elderly residents and low-literacy users may not be comfortable typing |
| Language nature | Kangdi is primarily a spoken language — voice is the natural input mode |
| Regional context | Rural Himachal has lower smartphone typing fluency than urban areas |
| Gnani AI integration | Sponsor provides STT and TTS for Kangdi — voice is a core capability, not an add-on |
| Preservation mission | Recording spoken language contributes to HIMCorpus dataset |
| Accessibility | Voice input removes the literacy barrier entirely |

## Design Implications

- Microphone button is the largest interactive element in the app
- Voice module does not require any text input
- Audio responses play automatically (users should not need to read)
- Transcription is shown as supplementary, not primary

---

# Why No Login?

## Decision

The MVP has **no authentication, no user accounts, and no login screen**.

## Rationale

| Reason | Detail |
| ------ | ------ |
| Hackathon constraint | 24-hour build time — auth adds significant complexity |
| User friction | Login screens exclude elderly and low-literacy users immediately |
| Mission alignment | Language tools should be freely accessible to all speakers |
| Privacy | No account means no personal data collection in the MVP |
| Mem0 handles context | In-session memory via Mem0 replaces the need for user accounts |
| Architecture decision | Explicitly excluded from MVP in architecture documentation |

## Trade-offs Accepted

| Trade-off | Mitigation |
| --------- | ---------- |
| No cross-session history | Mem0 provides in-session context; future auth adds persistence |
| No saved preferences | Language selection stored in browser session |
| No contribution tracking | Preserve module records locally in MVP |
| No personalization | HIMCorpus provides language context instead of user profiles |

## Future Path

Authentication, user profiles, and persistent storage are documented as post-MVP enhancements in the architecture.

---

# Why Six Primary Modules?

## Decision

The Home dashboard presents **six feature cards**: Chat, Voice, Translate, Document, Learn, and Preserve.

## Rationale

Each module maps directly to a core platform capability and a user need:

| Module | User Need | Platform Capability |
| ------ | --------- | ------------------- |
| Chat | Ask questions in native language | AI conversation (Gemini + Mem0) |
| Voice | Speak instead of type | Voice AI (Gnani STT + TTS) |
| Translate | Convert between languages | Translation (Gemini + HIMCorpus) |
| Document | Understand official papers | OCR + AI (PaddleOCR + Gemini) |
| Learn | Practice Kangdi phrases | Language learning (HIMCorpus) |
| Preserve | Contribute language data | Dataset building (HIMCorpus) |

## Why Not Fewer?

Combining modules (e.g., Chat + Voice) would reduce clarity. Elderly users benefit from explicit, single-purpose screens.

## Why Not More?

Additional modules (Settings, Profile, History, Analytics) are excluded from MVP per architecture constraints. Six modules fit a 2×3 mobile grid without scrolling.

---

# Why Simple Navigation?

## Decision

Navigation is limited to: **Back button**, **Home logo**, **bottom nav (Home + Help)**, and **language selector**.

## Rationale

| Reason | Detail |
| ------ | ------ |
| Flat hierarchy | Maximum 2 taps from Home to any feature |
| No learning curve | Users understand "tap a card, do a thing, go back" immediately |
| Elderly-friendly | No hamburger menus, no nested dropdowns, no breadcrumbs (except Learn) |
| Mobile-optimized | Bottom nav is thumb-reachable on all phone sizes |
| Consistent | Same navigation pattern on every module page |
| Reversible | Back button always visible — users never feel trapped |

## Navigation Depth

```text
Level 0: Landing
Level 1: Home, Help
Level 2: Feature modules
Level 3: Learn category detail (only exception)
```

---

# Why Language Selection on Entry?

## Decision

Users select their interface language (Kangdi, Hindi, or English) immediately after the landing page.

## Rationale

| Reason | Detail |
| ------ | ------ |
| First impression | Users see the platform respects their language from the start |
| UI localization | All labels, buttons, and messages appear in the chosen language |
| AI default | Sets the default language for AI responses |
| Inclusivity | Hindi and English options ensure non-Kangdi speakers can use the platform |
| No assumption | The platform does not assume English as default |

---

# Why Mobile First?

## Decision

All layouts are designed for **375px mobile screens** first, then adapted for tablet and desktop.

## Rationale

| Reason | Detail |
| ------ | ------ |
| Target users | Rural Himachal users primarily access technology via smartphones |
| Hackathon demo | Judges will likely view on phones or project from a laptop |
| Progressive enhancement | Desktop adds horizontal space, not new features |
| Touch-first | All interactions designed for fingers, not mouse cursors |
| Data context | Mobile internet is the primary connectivity in target regions |

---

# Why HIMCorpus Integration in UI?

## Decision

The Learn and Preserve modules directly surface HIMCorpus dataset content and contribution.

## Rationale

| Reason | Detail |
| ------ | ------ |
| Mission | Language preservation is a core mission, not a backend detail |
| Learn module | Users can browse real curated phrases, not AI-generated examples |
| Preserve module | Users contribute to the dataset, building community ownership |
| Transparency | Users see that the platform is built on real linguistic data |
| Sustainability | Community contributions ensure the dataset grows beyond the hackathon |

---

# Why No Dark Mode Toggle?

## Decision

Dark mode follows system preference only — no manual toggle in the MVP.

## Rationale

| Reason | Detail |
| ------ | ------ |
| Scope | Manual toggle adds a settings screen — excluded from MVP |
| System preference | `prefers-color-scheme` covers most users automatically |
| Simplicity | One less UI element to explain and maintain |
| Future | Settings page (post-MVP) will include manual theme toggle |

---

# Why shadcn/ui?

## Decision

UI components are built on **shadcn/ui** with Tailwind CSS.

## Rationale

| Reason | Detail |
| ------ | ------ |
| Speed | Pre-built accessible components accelerate hackathon development |
| Customization | Components are copied into the project, not locked to a library version |
| Accessibility | shadcn/ui components follow WAI-ARIA patterns |
| Consistency | Matches the architecture tech stack (Next.js + Tailwind) |
| Community | Large ecosystem, well-documented, active maintenance |

---

# Design Decision Summary

| Decision | Primary Reason |
| -------- | -------------- |
| Card-based home | Scannable, touch-friendly, extensible |
| Voice-first | Spoken language, elderly users, Gnani AI |
| No login | Hackathon scope, accessibility, privacy |
| Six modules | Maps to platform capabilities and user needs |
| Simple navigation | Flat hierarchy, elderly-friendly, reversible |
| Language selection on entry | Respect user's language from the start |
| Mobile first | Target users on smartphones in rural areas |
| HIMCorpus in UI | Preservation mission, real data, community |
| No dark mode toggle | MVP scope reduction |
| shadcn/ui | Speed, accessibility, architecture alignment |

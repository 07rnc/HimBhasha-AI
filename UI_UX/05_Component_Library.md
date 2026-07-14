# Component Library – HimBhasha AI

## Overview

This document defines every reusable UI component in HimBhasha AI. All components are built on **shadcn/ui** primitives with Tailwind CSS styling, following the tokens defined in `04_Design_System.md`.

---

# Component Index

| Component | Category | Used In |
| --------- | -------- | ------- |
| Button | Action | All pages |
| Card | Layout | Home, Learn, results |
| Header | Navigation | All pages except Landing |
| Footer | Navigation | Landing, desktop |
| BottomNav | Navigation | Mobile Home, Help |
| LanguageSelector | Input | Header |
| MicrophoneButton | Input | Voice |
| UploadButton | Input | Document, Preserve |
| ChatBubble | Display | Chat |
| VoiceCard | Display | Voice |
| TranslationCard | Display | Translate |
| OCRCard | Display | Document |
| PhraseCard | Display | Learn |
| LoadingSpinner | Feedback | All modules |
| Toast | Feedback | All modules |
| Dialog | Feedback | Errors, confirmations |
| Badge | Display | Learn, status |
| Icon | Display | All pages |

---

# Buttons

## Primary Button

**Purpose:** Main call-to-action on every page.

| Property | Value |
| -------- | ----- |
| Variant | Primary |
| Min height | 44px |
| Padding | 12px 24px |
| Border radius | 8px |
| Font | 16px, weight 600 |

**States:**

| State | Appearance |
| ----- | ---------- |
| Default | Green background, white text |
| Hover | Darker green, shadow-md |
| Active | scale-tap (98%) |
| Disabled | 50% opacity, no pointer |
| Loading | Spinner replaces label text |

**Usage:** "Get Started", "Translate", "Process", "Submit", "Send"

---

## Secondary Button

**Purpose:** Alternative actions, less emphasis.

| Property | Value |
| -------- | ----- |
| Variant | Secondary |
| Background | `--secondary` |
| Border | 1px `--border` |

**Usage:** "Go to Home", "Copy", "Contribute Another"

---

## Ghost Button

**Purpose:** Tertiary actions, icon-only buttons.

| Property | Value |
| -------- | ----- |
| Background | transparent |
| Hover | `--muted` background |

**Usage:** Back button, close button, icon actions

---

## Icon Button

**Purpose:** Single-icon actions with no text label.

| Property | Value |
| -------- | ----- |
| Size | 44×44px minimum |
| Shape | Square with rounded-md |

**Usage:** Send message, copy text, play audio, close file

---

# Cards

## Feature Card

**Purpose:** Home dashboard module entry points.

```text
┌──────────────────┐
│                  │
│      [Icon]      │  32px icon, primary color
│                  │
│    Card Title    │  text-lg, weight 600
│    Subtitle      │  text-sm, muted-foreground
│                  │
└──────────────────┘
```

| Property | Value |
| -------- | ----- |
| Size | Equal width/height in grid |
| Padding | 24px |
| Border radius | 16px |
| Hover | shadow-md, border-primary/20 |
| Tap | scale-tap, navigate to module |

---

## Result Card

**Purpose:** Display AI output (translation, summary, answer).

| Property | Value |
| -------- | ----- |
| Background | `--card` |
| Border | 1px `--border` |
| Padding | 24px |
| Header | Label (e.g., "Translation:") in text-sm muted |
| Body | Output text in text-base |
| Footer | Action buttons (Copy, Play) |

---

## Phrase Card

**Purpose:** Display a Kangdi phrase in the Learn module.

```text
┌──────────────────────────────┐
│  कांगड़ी: नमस्ते              │  text-lg, Devanagari
│  Hindi:  नमस्ते               │  text-sm
│  English: Hello              │  text-sm, muted
│  Say: "nuh-muh-steh"         │  text-xs, italic
│                      [▶]    │  play button, right
└──────────────────────────────┘
```

---

# Navigation

## Header

```text
┌─────────────────────────────────┐
│  [←]  🏔️ HimBhasha    [Lang ▾] │
└─────────────────────────────────┘
```

| Property | Value |
| -------- | ----- |
| Height | 56px |
| Position | Sticky top |
| Background | `--background` with border-bottom |
| Left | Back button (module pages) or logo (Home) |
| Right | Language selector dropdown |

---

## Footer

```text
┌─────────────────────────────────┐
│  HimBhasha AI · HIMCorpus       │
│  Preserve Himachal's Languages  │
└─────────────────────────────────┘
```

| Property | Value |
| -------- | ----- |
| Visibility | Landing page, desktop only |
| Content | Project name, parent project, tagline |

---

## BottomNav

```text
┌─────────────────────────────────┐
│     🏠 Home        ❓ Help      │
└─────────────────────────────────┘
```

| Property | Value |
| -------- | ----- |
| Height | 64px |
| Position | Fixed bottom (mobile) |
| Items | Home, Help |
| Active state | Primary color icon + label |

---

# Language Selector

**Purpose:** Switch interface and AI response language.

| Property | Value |
| -------- | ----- |
| Type | Dropdown select |
| Options | Kangdi, Hindi, English |
| Display | Current language name + chevron |
| Behavior | Changes UI text immediately |
| Location | Header (all pages) |

```text
┌──────────────┐
│  कांगड़ी  ▾  │
├──────────────┤
│  ● कांगड़ी   │
│  ○ हिंदी     │
│  ○ English   │
└──────────────┘
```

---

# Microphone Button

**Purpose:** Primary interaction for Voice module.

| Property | Value |
| -------- | ----- |
| Size | 80px diameter (mobile), 96px (desktop) |
| Shape | Circle (rounded-full) |
| Default | Primary green background, white mic icon |
| Recording | Accent color, pulsing ring animation |
| Processing | Muted background, spinner |
| Disabled | 50% opacity |

**States:**

| State | Visual |
| ----- | ------ |
| Idle | Green circle, mic icon, "Tap to Speak" label |
| Recording | Orange circle, pulsing ring, timer display |
| Processing | Gray circle, spinner, "Processing..." label |
| Error | Red border, retry prompt |

---

# Upload Button / Zone

**Purpose:** File upload for Document and Preserve modules.

```text
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                             │
│    📄  Drop file here       │
│    or tap to upload         │
│    PDF, JPG, PNG            │
│                             │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

| Property | Value |
| -------- | ----- |
| Style | Dashed border, rounded-xl |
| Hover | Border changes to primary color |
| Active (drag) | Background shifts to secondary |
| Error | Red border, error message below |
| Max file size | 10 MB |
| Accepted types | `.pdf`, `.jpg`, `.jpeg`, `.png` |

---

# Chat Bubble

**Purpose:** Display messages in the Chat module.

## User Bubble

| Property | Value |
| -------- | ----- |
| Alignment | Right |
| Background | `--primary` |
| Text color | `--primary-foreground` |
| Border radius | 16px 16px 4px 16px |
| Max width | 80% |

## AI Bubble

| Property | Value |
| -------- | ----- |
| Alignment | Left |
| Background | `--secondary` |
| Text color | `--foreground` |
| Border radius | 16px 16px 16px 4px |
| Max width | 80% |

## Loading Bubble

| Property | Value |
| -------- | ----- |
| Content | Three animated dots |
| Label | "Thinking..." in muted text |

---

# Voice Card

**Purpose:** Display transcription and AI voice response.

```text
┌──────────────────────────────┐
│  You said:                   │
│  "आज मौसम कैसा है?"          │
├──────────────────────────────┤
│  AI Response:                │
│  "आज मौसम बड़ा सोहना है।"    │
│                              │
│  [▶ Play]  [↻ Replay]       │
└──────────────────────────────┘
```

---

# Translation Card

**Purpose:** Display translated output.

```text
┌──────────────────────────────┐
│  Kangdi → Hindi              │  badge showing direction
│                              │
│  "आज मौसम बहुत अच्छा है"     │  translated text
│                              │
│                  [📋 Copy]  │
└──────────────────────────────┘
```

---

# OCR Card

**Purpose:** Display document processing results.

Supports three result types:

| Action | Card Header | Card Body |
| ------ | ----------- | --------- |
| Summarize | "Summary:" | AI-generated summary |
| Ask | "Answer:" | AI answer to question |
| Extract | "Extracted Text:" | Raw OCR output |

---

# Loading Spinner

| Property | Value |
| -------- | ----- |
| Size | 24px (inline), 40px (centered) |
| Color | `--primary` |
| Animation | spin, 1s linear infinite |
| Label | Optional text below ("Processing...", "Thinking...") |

**Variants:**

| Variant | Usage |
| ------- | ----- |
| Inline | Inside chat bubble, button |
| Centered | Full-module loading state |
| Overlay | Semi-transparent backdrop over content |

---

# Toast

**Purpose:** Temporary feedback messages.

| Property | Value |
| -------- | ----- |
| Position | Top-center (mobile), bottom-right (desktop) |
| Duration | 4 seconds (auto-dismiss) |
| Border radius | 8px |

| Variant | Background | Icon | Usage |
| ------- | ---------- | ---- | ----- |
| Success | `--success` | Checkmark | Contribution submitted, copied |
| Error | `--destructive` | Alert | Network error, upload failed |
| Info | `--primary` | Info | Language changed, processing |
| Warning | `--accent` | Warning | Low OCR confidence |

---

# Dialogs

**Purpose:** Modal confirmations and error recovery.

| Property | Value |
| -------- | ----- |
| Overlay | Semi-transparent black (50%) |
| Border radius | 16px |
| Max width | 400px |
| Padding | 24px |

**Dialog types:**

| Type | Title | Actions |
| ---- | ----- | ------- |
| Microphone permission | "Microphone Access Needed" | Instructions + OK |
| File error | "Upload Failed" | Retry + Cancel |
| Network error | "Connection Problem" | Retry + Go Home |
| Confirm submit | "Submit Contribution?" | Submit + Cancel |

---

# Badges

| Property | Value |
| -------- | ----- |
| Size | text-xs, padding 4px 8px |
| Border radius | rounded-sm (4px) |

| Badge | Color | Usage |
| ----- | ----- | ----- |
| Language | Primary | "Kangdi", "Hindi", "English" |
| Domain | Secondary | "Greetings", "Healthcare" |
| Status | Accent | "Processing", "Verified" |
| Audio | Muted | "Audio available" |

---

# Icons

All icons from **Lucide React**. Standard size 20px, feature card size 32px.

| Icon Name | Usage |
| --------- | ----- |
| `MessageCircle` | Chat module |
| `Mic` | Voice module, recording |
| `Languages` | Translate module |
| `FileText` | Document module |
| `BookOpen` | Learn module |
| `Sprout` | Preserve module |
| `Home` | Home navigation |
| `HelpCircle` | Help navigation |
| `ArrowLeft` | Back button |
| `Send` | Send message |
| `Copy` | Copy to clipboard |
| `Play` | Audio playback |
| `Upload` | File upload |
| `Check` | Success state |
| `AlertTriangle` | Error/warning |
| `Loader2` | Loading spinner |
| `X` | Close, remove file |
| `ChevronDown` | Dropdown indicator |
| `Volume2` | Audio output indicator |

---

# Component Composition Examples

## Home Page

```text
Header
  └── LanguageSelector
FeatureCard × 6 (grid)
BottomNav
```

## Chat Page

```text
Header
ChatBubble (AI) × n
ChatBubble (User) × n
ChatBubble (Loading)
InputBar
  └── Input + IconButton (Send)
```

## Voice Page

```text
Header
MicrophoneButton
VoiceCard
  └── Transcription + Response + Play
```

## Document Page

```text
Header
TabBar (Summarize / Ask / Extract)
UploadZone
FilePreview
Button (Process)
OCRCard (result)
```

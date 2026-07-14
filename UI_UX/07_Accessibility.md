# Accessibility – HimBhasha AI

## Overview

HimBhasha AI is designed for users across all age groups and literacy levels in Himachal Pradesh. Accessibility is not an afterthought — it is a core design requirement, especially given the target audience of elderly residents, low-literacy users, and rural communities.

This document defines accessibility standards for the MVP and future enhancements.

---

# Accessibility Goals

| Goal | Target |
| ---- | ------ |
| WCAG compliance | WCAG 2.1 Level AA |
| Touch target size | Minimum 44×44px |
| Color contrast | 4.5:1 for text, 3:1 for large text |
| Keyboard navigation | All features accessible without mouse |
| Screen reader support | All content and actions announced |
| Voice accessibility | Voice module as primary input method |
| Literacy support | Icons paired with text on all actions |

---

# Color Contrast

## Light Mode Contrast Ratios

| Combination | Ratio | Pass (AA) |
| ----------- | ----- | --------- |
| Foreground on background | 12.5:1 | Yes |
| Primary on white | 4.8:1 | Yes |
| Muted foreground on background | 4.6:1 | Yes |
| Accent on background | 3.2:1 (large text) | Yes |
| White on primary | 4.8:1 | Yes |

## Dark Mode Contrast Ratios

| Combination | Ratio | Pass (AA) |
| ----------- | ----- | --------- |
| Foreground on background | 11.2:1 | Yes |
| Primary on dark background | 5.1:1 | Yes |
| Muted foreground on background | 4.5:1 | Yes |

## Rules

- Never use color alone to convey meaning (always pair with icon or text)
- Error states use red text + alert icon + descriptive message
- Success states use green text + checkmark icon + descriptive message
- Focus indicators use a 2px primary-colored ring (not color change alone)

---

# Large Touch Targets

Designed for users who may have reduced motor precision.

| Element | Minimum Size | Actual Size |
| ------- | ------------ | ----------- |
| Buttons | 44×44px | 44px height, full width or min 44px |
| Feature cards | 44×44px tap area | Full card (120×120px minimum) |
| Microphone button | 44×44px | 80px diameter |
| Icon buttons | 44×44px | 44×44px |
| Bottom nav items | 44×44px | 64px height, equal width |
| Language selector | 44×44px | 44px height |
| Upload zone | 44×44px | Full zone (min 120px height) |
| Phrase card play button | 44×44px | 44×44px |
| Chat send button | 44×44px | 44×44px |

## Spacing Between Targets

Minimum **8px** gap between adjacent touch targets to prevent mis-taps.

---

# Keyboard Navigation

All features must be operable via keyboard alone.

## Tab Order

```text
Landing:     [Get Started]
Language:    [Kangdi] → [Hindi] → [English] → [Continue]
Home:        [Chat] → [Voice] → [Translate] → [Document] → [Learn] → [Preserve] → [Help]
Chat:        [Back] → [Language ▾] → [Message input] → [Send]
Voice:       [Back] → [Microphone] → [Play audio]
Translate:   [Back] → [Source lang] → [Target lang] → [Input] → [Translate] → [Copy]
Document:    [Back] → [Tab: Summarize] → [Tab: Ask] → [Tab: Extract] → [Upload] → [Process]
Learn:       [Back] → [Category cards...] → [Phrase play buttons]
Preserve:    [Back] → [Form fields...] → [Record] → [Submit]
```

## Keyboard Shortcuts

| Key | Action | Context |
| --- | ------ | ------- |
| `Tab` | Move to next focusable element | All pages |
| `Shift+Tab` | Move to previous focusable element | All pages |
| `Enter` | Activate button / send message | Buttons, chat input |
| `Space` | Activate button / toggle recording | Buttons, microphone |
| `Escape` | Close dialog / go back | Dialogs, modules |

## Focus Indicators

- All focusable elements display a **2px solid ring** in `--primary` color
- Focus ring offset: 2px from element border
- Focus is never hidden or removed via CSS
- Skip-to-content link provided at top of every page (visually hidden until focused)

---

# Voice Accessibility

Voice is the primary accessibility feature for users who cannot type comfortably.

## Voice as Input

| Feature | Accessibility Benefit |
| ------- | --------------------- |
| Voice module | Users speak instead of typing |
| Gnani STT | Supports Kangdi, Hindi, English speech |
| Large microphone button | Easy to find and tap |
| Audio responses | Users hear answers without reading |
| Gnani TTS | Natural-sounding speech output |

## Voice as Output

| Feature | Accessibility Benefit |
| ------- | --------------------- |
| Auto-play audio response | Users hear AI reply immediately |
| Replay button | Users can listen again |
| Transcription displayed | Users who can read see the text too |
| Learn module audio | Hear correct pronunciation |

## Voice Accessibility Rules

- Microphone permission request includes clear explanation of why access is needed
- Recording state is announced to screen readers
- Audio player has keyboard-accessible play/pause controls
- Voice module works without requiring text input at any step

---

# Screen Readers

## Semantic HTML Requirements

| Element | HTML Element | ARIA |
| ------- | ------------ | ---- |
| Page title | `<h1>` | — |
| Section headings | `<h2>`, `<h3>` | — |
| Navigation | `<nav>` | `aria-label="Main navigation"` |
| Chat messages | `<div role="log">` | `aria-live="polite"` |
| Loading state | `<div>` | `aria-live="assertive"`, `aria-busy="true"` |
| Error messages | `<div role="alert">` | `aria-live="assertive"` |
| Buttons | `<button>` | Descriptive `aria-label` where icon-only |
| Upload zone | `<div>` | `role="button"`, `aria-label="Upload file"` |
| Microphone | `<button>` | `aria-label="Start recording"`, state changes |
| Language selector | `<select>` or custom | `aria-label="Select language"` |
| Toast | `<div role="status">` | `aria-live="polite"` |
| Dialog | `<dialog>` | `aria-modal="true"`, focus trap |

## Content Announcements

| Event | Screen Reader Behavior |
| ----- | ---------------------- |
| Page navigation | Page title announced |
| New chat message | Message content read via `aria-live` |
| AI response arrives | Response text announced |
| Loading begins | "Processing your request" |
| Error occurs | Error message announced immediately |
| Recording starts | "Recording started" |
| Audio plays | "Playing audio response" |
| Copy action | "Text copied to clipboard" |
| Language changed | "Language changed to [name]" |

---

# Responsive Design for Accessibility

## Text Scaling

- All text uses relative units (rem) — scales with browser font size settings
- Layout does not break at 200% text zoom
- No horizontal scrolling at 320px viewport width
- Minimum font size: 16px (prevents iOS auto-zoom on input focus)

## Orientation

- Works in both portrait and landscape on mobile
- No content locked to a single orientation

## Viewport

- `<meta name="viewport" content="width=device-width, initial-scale=1">` set on all pages
- No user-scaling disabled (`user-scalable=yes`)

---

# Elderly Users

Specific design decisions for older users:

| Challenge | Design Solution |
| --------- | --------------- |
| Small text difficult to read | Minimum 16px body text, high contrast |
| Small buttons hard to tap | 44px minimum touch targets, generous spacing |
| Complex navigation confusing | Flat hierarchy, max 2 taps to any feature |
| Unfamiliar with typing | Voice module as primary input method |
| Fear of making mistakes | Clear back buttons, forgiving error recovery |
| Need for audio feedback | TTS responses, pronunciation audio in Learn |
| Slow reading speed | Simple language in UI text, no jargon |
| Memory difficulties | Consistent layout across all pages |

## Elderly-Friendly Patterns

- Large, clearly labeled buttons with icons AND text
- No time-limited interactions (no session timeouts)
- No hidden gestures or multi-step interactions
- Confirmation dialogs for destructive actions only
- Help page with step-by-step visual guides

---

# Low Literacy Users

Specific design decisions for users with limited reading ability:

| Challenge | Design Solution |
| --------- | --------------- |
| Cannot read English UI | Language selection includes Kangdi and Hindi |
| Cannot read instructions | Icons paired with every action label |
| Cannot type messages | Voice module for all interactions |
| Unfamiliar with technology | Minimal UI, no settings complexity |
| Need visual cues | Feature cards use large icons with short labels |
| Need audio guidance | Voice responses, Learn module pronunciation |

## Low-Literacy Patterns

- Every action button has an icon + short label (max 2 words)
- Feature cards use pictorial icons (microphone, book, globe)
- Error messages use simple words, not technical terms
- No paragraphs of instructional text on module pages
- Help page uses numbered steps with screenshots (future)

---

# Accessibility Testing Checklist

| Test | Method | Pass Criteria |
| ---- | ------ | ------------- |
| Keyboard-only navigation | Tab through all pages | All features reachable and operable |
| Screen reader | NVDA / VoiceOver | All content announced correctly |
| Color contrast | axe DevTools / Lighthouse | All ratios meet AA |
| Touch target size | Manual measurement | All targets ≥ 44px |
| Text zoom | Browser zoom to 200% | No layout breakage |
| Reduced motion | `prefers-reduced-motion` | Animations disabled |
| Voice-only usage | Complete all modules via voice | No typing required |
| Mobile screen reader | TalkBack / VoiceOver on mobile | Full functionality |

---

# Future Accessibility Enhancements

| Enhancement | Priority |
| ----------- | -------- |
| Manual dark mode toggle | Medium |
| Font size adjustment in settings | High |
| High contrast mode | Medium |
| Sign language video support | Low |
| Offline mode for rural connectivity | High |
| Regional dialect selection | Medium |
| Simplified UI mode (fewer options) | High |

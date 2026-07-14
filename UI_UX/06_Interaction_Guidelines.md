# Interaction Guidelines – HimBhasha AI

## Overview

This document defines how users interact with every element in HimBhasha AI. Interactions are designed to be predictable, forgiving, and accessible — especially for elderly users and those with limited digital experience.

---

# General Interaction Principles

| Principle | Implementation |
| --------- | -------------- |
| Immediate feedback | Every tap produces a visual response within 100ms |
| Forgiving | Errors offer clear recovery paths, never dead ends |
| Consistent | Same gesture produces same result across all modules |
| Visible | Active states, loading, and errors are always shown |
| Reversible | Back button available on every module screen |

---

# Hover Interactions

Hover effects apply on desktop and tablet (pointer devices). Touch devices use active/pressed states instead.

| Element | Hover Effect |
| ------- | ------------ |
| Feature card | Shadow elevates (sm → md), border tint appears |
| Primary button | Background darkens 10%, shadow appears |
| Secondary button | Background shifts to muted |
| Ghost button | Muted background appears |
| Chat bubble | No hover (static content) |
| Icon button | Muted circular background |
| Upload zone | Border color changes to primary, background to secondary |
| Phrase card | Shadow elevates, play button becomes visible |
| Navigation link | Text color shifts to primary |
| Language selector | Border highlight |

**Transition:** All hover effects use `150ms ease-out`.

---

# Click / Tap Interactions

## Single Tap

| Element | Action |
| ------- | ------ |
| Feature card | Navigate to module |
| Primary button | Execute primary action |
| Send button | Submit chat message |
| Microphone button | Start recording (tap again to stop) |
| Play button | Play audio pronunciation |
| Copy button | Copy text to clipboard + success toast |
| Back button | Return to Home |
| Bottom nav item | Navigate to Home or Help |
| Language option | Switch interface language |
| Category card (Learn) | Navigate to category detail |
| Tab (Document) | Switch action mode |
| Upload zone | Open file picker |

## Long Press

Not used in the MVP. No hidden actions behind long press.

## Double Tap

Not used in the MVP.

---

# Loading States

Every action that triggers an API call shows a loading state.

## Loading Patterns

| Module | Loading Indicator | Message |
| ------ | ----------------- | ------- |
| Chat | Animated dots in AI bubble | "Thinking..." |
| Voice | Spinner below microphone | "Processing your voice..." |
| Translate | Spinner on button, input disabled | "Translating..." |
| Document | Centered spinner with progress | "Reading document..." |
| Preserve | Spinner on submit button | "Submitting..." |

## Loading Rules

| Rule | Detail |
| ---- | ------ |
| Disable inputs | Input fields and buttons disabled during loading |
| Show within 200ms | Loading indicator appears quickly to confirm action |
| Timeout at 30s | If no response after 30 seconds, show error |
| Cancel option | No cancel in MVP (requests are short) |
| Skeleton screens | Not used — spinner preferred for simplicity |

---

# Error States

## Error Display Methods

| Severity | Display | Duration |
| -------- | ------- | -------- |
| Inline | Red text below input field | Until corrected |
| Toast | Top notification bar | 4 seconds, auto-dismiss |
| Dialog | Modal overlay | Until dismissed |
| Full-page | Centered error card | Until action taken |

## Error Messages

All error messages are written in plain language in the user's selected interface language.

| Error | Message (English) | Recovery |
| ----- | ----------------- | -------- |
| Network failure | "Connection problem. Please check your internet and try again." | Retry button |
| Empty input | "Please enter a message before sending." | Focus input field |
| Invalid file type | "Please upload a PDF or image file (JPG, PNG)." | Re-open upload |
| File too large | "File is too large. Maximum size is 10 MB." | Re-open upload |
| Mic permission denied | "Microphone access is needed for voice features. Please allow access in your browser settings." | Dialog with instructions |
| Speech not recognized | "Could not understand. Please speak clearly and try again." | Tap mic to retry |
| AI service down | "AI service is temporarily unavailable. Please try again in a moment." | Retry button |
| OCR low confidence | "Could not read this document clearly. Try uploading a clearer image." | Re-upload |

---

# Voice Recording Interaction

## Recording Flow

```text
1. User taps microphone button
   → Button changes to recording state (orange, pulsing)
   → Timer starts (0:00)
   → Browser requests microphone permission (first time only)

2. User speaks
   → Timer counts up
   → Pulsing animation continues

3. User taps microphone again (or auto-stop at 30s)
   → Recording stops
   → Button changes to processing state (spinner)
   → Audio sent to backend

4. Response received
   → Transcription displayed
   → AI text response displayed
   → Audio plays automatically
   → Button returns to idle state
```

## Recording Rules

| Rule | Value |
| ---- | ----- |
| Max recording duration | 30 seconds |
| Min recording duration | 1 second (shorter triggers "too short" message) |
| Auto-stop | Recording stops automatically at 30 seconds |
| Permission | Requested on first tap, remembered by browser |
| Feedback | Visual pulse during recording, no audio feedback |
| Replay | Play button available after response |

---

# File Upload Interaction

## Upload Flow

```text
1. User taps upload zone or drags file
   → File picker opens (tap) or drop zone highlights (drag)

2. File selected
   → File name and size displayed
   → Remove button (✕) appears
   → Process button becomes enabled

3. User taps Process
   → Loading state begins
   → Upload zone and button disabled

4. Result received
   → Result card displayed below
   → Upload zone available for new file
```

## Upload Rules

| Rule | Value |
| ---- | ----- |
| Accepted types | PDF, JPG, JPEG, PNG |
| Max file size | 10 MB |
| Multiple files | One at a time in MVP |
| Preview | File name and size only (no thumbnail in MVP) |
| Drag-and-drop | Supported on desktop and tablet |
| Progress | Spinner only (no progress bar in MVP) |

---

# Animations

## Page Transitions

| Transition | Animation | Duration |
| ---------- | --------- | -------- |
| Landing → Language Selection | fade-in | 200ms |
| Language Selection → Home | fade-in + slide-up | 250ms |
| Home → Module | fade-in | 200ms |
| Module → Home (back) | fade-in | 200ms |

## Content Animations

| Element | Animation | Trigger |
| ------- | --------- | ------- |
| Chat bubble | slide-up + fade-in | New message received |
| Toast | slide-down + fade-in | Action feedback |
| Result card | slide-up + fade-in | API response received |
| Feature card | scale-tap (98%) | Tap/click |
| Microphone | pulse ring | Recording active |
| Loading dots | bounce (sequential) | AI processing |

## Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- All animations disabled
- Loading states show static text instead of spinners
- Transitions become instant (0ms)
- Pulse animation replaced with color change only

---

# Accessibility Feedback

Every interaction provides feedback through multiple channels:

| Channel | Example |
| ------- | ------- |
| Visual | Button color change, spinner, toast |
| Text | Loading messages, error descriptions |
| Audio | Voice module plays audio responses |
| Haptic | Not used in MVP (web-only) |

## Focus Management

| Action | Focus Behavior |
| ------ | -------------- |
| Navigate to module | Focus moves to main content area |
| Send chat message | Focus returns to input field |
| Error dialog appears | Focus trapped in dialog |
| Dialog dismissed | Focus returns to trigger element |
| Toast appears | Focus not moved (non-blocking) |

## Screen Reader Announcements

| Event | Announcement |
| ----- | ------------ |
| Page load | Page title announced |
| Message sent | "Message sent" |
| AI response | Response text read aloud |
| Loading | "Processing your request" |
| Error | Error message text |
| Success | "Action completed successfully" |
| Recording started | "Recording started. Tap again to stop." |
| Recording stopped | "Recording stopped. Processing." |

---

# Gesture Summary

| Gesture | Context | Action |
| ------- | ------- | ------ |
| Tap | Feature card | Open module |
| Tap | Button | Execute action |
| Tap | Microphone | Start/stop recording |
| Tap | Play icon | Play audio |
| Tap | Back arrow | Return to Home |
| Tap | Upload zone | Open file picker |
| Drag | Upload zone (desktop) | Drop file to upload |
| Scroll | Chat, Learn lists | Browse content |
| Swipe | Not used | — |

---

# Interaction Timing

| Interaction | Target Response Time |
| ----------- | ------------------- |
| Button press feedback | < 100ms |
| Page transition | < 300ms |
| Loading indicator appears | < 200ms |
| Toast auto-dismiss | 4 seconds |
| Error dialog auto-dismiss | Never (requires user action) |
| Chat AI response | < 5 seconds |
| Voice processing | < 8 seconds |
| Translation | < 4 seconds |
| Document processing | < 15 seconds |

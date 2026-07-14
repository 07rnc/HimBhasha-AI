# Design Assets – HimBhasha AI

## Overview

This folder contains visual design assets for HimBhasha AI. Assets referenced in the UI/UX documentation are organized here for use during prototype development.

---

# Asset Inventory

| Asset | File | Status | Usage |
| ----- | ---- | ------ | ----- |
| Logo (primary) | `logo-primary.svg` | Planned | Header, landing page, favicon |
| Logo (icon only) | `logo-icon.svg` | Planned | Favicon, app icon |
| Hero illustration | `hero-illustration.svg` | Planned | Landing page hero section |
| Feature icon — Chat | `icon-chat.svg` | Use Lucide `MessageCircle` | Chat feature card |
| Feature icon — Voice | `icon-voice.svg` | Use Lucide `Mic` | Voice feature card |
| Feature icon — Translate | `icon-translate.svg` | Use Lucide `Languages` | Translate feature card |
| Feature icon — Document | `icon-document.svg` | Use Lucide `FileText` | Document feature card |
| Feature icon — Learn | `icon-learn.svg` | Use Lucide `BookOpen` | Learn feature card |
| Feature icon — Preserve | `icon-preserve.svg` | Use Lucide `Sprout` | Preserve feature card |
| Empty state — Chat | `empty-chat.svg` | Planned | Chat module empty state |
| Empty state — Voice | `empty-voice.svg` | Planned | Voice module idle state |
| Empty state — Document | `empty-document.svg` | Planned | Document upload zone |
| Error illustration | `error-illustration.svg` | Planned | Error pages |
| Success illustration | `success-illustration.svg` | Planned | Preserve success state |
| Mountain pattern | `mountain-pattern.svg` | Planned | Background decoration |

---

# Asset Guidelines

## Logo

- Primary colors: `#1B6B4A` (green) + `#E8A838` (gold accent)
- Must include mountain motif referencing Himachal Pradesh
- Minimum display size: 24px height
- Clear space: equal to the height of the "H" in HimBhasha

## Icons

- MVP uses **Lucide Icons** (included with shadcn/ui) — no custom icon SVGs required for hackathon
- Custom SVGs listed above are optional enhancements
- All icons: 2px stroke, rounded caps, currentColor fill

## Illustrations

- Style: Flat vector, warm palette matching design system
- Cultural sensitivity: Avoid stereotypical depictions; represent diversity of Himachal
- Format: SVG preferred, PNG fallback at 2x resolution

## Favicon

- Size: 32×32px (SVG) + 180×180px (Apple touch icon)
- Content: Mountain icon from logo mark

---

# File Naming Convention

```text
{type}-{name}-{variant}.{format}

Examples:
logo-primary.svg
icon-chat.svg
illustration-hero.svg
empty-state-voice.svg
```

---

# Color Reference for Assets

| Color | Hex | Usage in Assets |
| ----- | --- | --------------- |
| Primary Green | `#1B6B4A` | Logo, icons, accents |
| Accent Gold | `#E8A838` | Highlights, badges |
| Background | `#FAFBF9` | Illustration backgrounds |
| Text | `#1A1A1A` | Labels in assets |
| Muted | `#6B7280` | Secondary elements |

---

# Notes for Developers

- Use Lucide React icons for all MVP icon needs — no custom SVG imports required
- Hero illustration and empty states can use placeholder divs with background color during hackathon
- Logo can be text-based ("🏔️ HimBhasha AI") for MVP if SVG assets are not ready
- All custom assets should be optimized SVGs (< 10KB each)

# Design System – HimBhasha AI

## Overview

This document defines the visual design system for HimBhasha AI. The system follows modern SaaS design principles — clean, accessible, and optimized for users with varying levels of digital literacy.

Design stack: **Tailwind CSS** + **shadcn/ui** components.

---

# Brand Identity

| Element | Value |
| ------- | ----- |
| Product name | HimBhasha AI |
| Parent project | HIMCorpus |
| Tagline | AI for Himachal's Languages |
| Mission tone | Warm, trustworthy, community-oriented |
| Visual metaphor | Mountains (Himachal) + technology (AI) |

---

# Color Palette

## Light Mode (Default)

| Token | Hex | Usage |
| ----- | --- | ----- |
| `--primary` | `#1B6B4A` | Primary buttons, active states, links |
| `--primary-foreground` | `#FFFFFF` | Text on primary backgrounds |
| `--secondary` | `#F0F7F4` | Secondary backgrounds, cards |
| `--secondary-foreground` | `#1A3A2A` | Text on secondary backgrounds |
| `--accent` | `#E8A838` | Highlights, badges, warnings |
| `--accent-foreground` | `#1A1A1A` | Text on accent backgrounds |
| `--background` | `#FAFBF9` | Page background |
| `--foreground` | `#1A1A1A` | Primary text |
| `--muted` | `#F4F5F3` | Muted backgrounds |
| `--muted-foreground` | `#6B7280` | Secondary text, placeholders |
| `--border` | `#E2E8E4` | Borders, dividers |
| `--destructive` | `#DC2626` | Error states, destructive actions |
| `--success` | `#16A34A` | Success states, confirmations |
| `--card` | `#FFFFFF` | Card backgrounds |
| `--card-foreground` | `#1A1A1A` | Card text |

## Dark Mode

| Token | Hex | Usage |
| ----- | --- | ----- |
| `--primary` | `#34D399` | Primary buttons, active states |
| `--primary-foreground` | `#0A1F15` | Text on primary backgrounds |
| `--secondary` | `#1A2E23` | Secondary backgrounds |
| `--secondary-foreground` | `#E2F0EA` | Text on secondary backgrounds |
| `--accent` | `#FBBF24` | Highlights, badges |
| `--background` | `#0F1A14` | Page background |
| `--foreground` | `#F0F4F2` | Primary text |
| `--muted` | `#1A2A20` | Muted backgrounds |
| `--muted-foreground` | `#9CA3AF` | Secondary text |
| `--border` | `#2A3F32` | Borders |
| `--card` | `#152019` | Card backgrounds |

Dark mode is toggled via system preference (`prefers-color-scheme`) with no manual toggle in the MVP.

---

# Typography

## Font Stack

| Role | Font | Fallback |
| ---- | ---- | -------- |
| Headings | Inter | system-ui, sans-serif |
| Body | Inter | system-ui, sans-serif |
| Kangdi/Hindi | Noto Sans Devanagari | sans-serif |
| Monospace | JetBrains Mono | monospace |

## Type Scale

| Token | Size | Weight | Line Height | Usage |
| ----- | ---- | ------ | ----------- | ----- |
| `text-xs` | 12px | 400 | 16px | Badges, captions |
| `text-sm` | 14px | 400 | 20px | Secondary text, labels |
| `text-base` | 16px | 400 | 24px | Body text, inputs |
| `text-lg` | 18px | 500 | 28px | Card titles |
| `text-xl` | 20px | 600 | 28px | Section headings |
| `text-2xl` | 24px | 700 | 32px | Page titles |
| `text-3xl` | 30px | 700 | 36px | Hero headings |
| `text-4xl` | 36px | 800 | 40px | Landing hero |

## Typography Rules

- Minimum body text size: **16px** (accessibility for elderly users)
- Kangdi and Hindi text always rendered in **Noto Sans Devanagari**
- Line length: max **65 characters** for readability
- Paragraph spacing: **16px** between blocks

---

# Spacing

Based on a **4px grid system** (Tailwind default).

| Token | Value | Usage |
| ----- | ----- | ----- |
| `space-1` | 4px | Tight internal padding |
| `space-2` | 8px | Icon gaps, inline spacing |
| `space-3` | 12px | Small component padding |
| `space-4` | 16px | Standard padding, gaps |
| `space-6` | 24px | Card padding, section gaps |
| `space-8` | 32px | Large section spacing |
| `space-12` | 48px | Page section margins |
| `space-16` | 64px | Hero section padding |

## Layout Spacing

| Context | Padding |
| ------- | ------- |
| Page horizontal | 16px (mobile), 24px (tablet), 32px (desktop) |
| Card internal | 16px (mobile), 24px (desktop) |
| Between cards | 12px (mobile), 16px (desktop) |
| Header height | 56px |
| Bottom nav height | 64px |
| Input bar height | 56px |

---

# Grid System

## Mobile (Default — 375px+)

| Property | Value |
| -------- | ----- |
| Columns | 2 (feature cards) |
| Gutter | 12px |
| Margin | 16px |
| Max content width | 100% |

## Tablet (768px+)

| Property | Value |
| -------- | ----- |
| Columns | 3 (feature cards) |
| Gutter | 16px |
| Margin | 24px |
| Max content width | 640px (centered) |

## Desktop (1024px+)

| Property | Value |
| -------- | ----- |
| Columns | 4 (feature cards) |
| Gutter | 20px |
| Margin | 32px |
| Max content width | 960px (centered) |

---

# Border Radius

| Token | Value | Usage |
| ----- | ----- | ----- |
| `rounded-sm` | 4px | Badges, small tags |
| `rounded-md` | 8px | Buttons, inputs |
| `rounded-lg` | 12px | Cards, modals |
| `rounded-xl` | 16px | Feature cards, upload zones |
| `rounded-full` | 9999px | Avatars, microphone button, pills |

---

# Elevation (Shadows)

| Level | Shadow | Usage |
| ----- | ------ | ----- |
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards at rest |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | Cards on hover, dropdowns |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.10)` | Modals, floating elements |
| `shadow-none` | none | Flat elements, inputs |

Elevation is subtle — the design favors borders and background contrast over heavy shadows.

---

# Animation

## Principles

- Animations should feel **responsive**, not decorative
- Maximum duration: **300ms** for UI transitions
- Respect `prefers-reduced-motion` — disable animations when set

## Defined Animations

| Name | Duration | Easing | Usage |
| ---- | -------- | ------ | ----- |
| `fade-in` | 200ms | ease-out | Page transitions, toast appearance |
| `slide-up` | 250ms | ease-out | Chat bubbles, result cards |
| `pulse` | 1500ms | ease-in-out (infinite) | Microphone recording state |
| `spin` | 1000ms | linear (infinite) | Loading spinner |
| `scale-tap` | 100ms | ease-in-out | Button press feedback |

## Microphone Recording Animation

```text
Idle:     ●  (static circle, primary color)
Recording: ● → ◉ → ●  (pulsing ring, accent color)
Processing: ◌ ◌ ◌  (three-dot bounce)
```

---

# Iconography

| Style | Detail |
| ----- | ------ |
| Library | Lucide Icons (shadcn/ui default) |
| Size (standard) | 20px |
| Size (feature cards) | 32px |
| Size (microphone) | 48px |
| Stroke width | 2px |
| Color | Inherits from parent text color |

Feature card icons:

| Module | Icon |
| ------ | ---- |
| Chat | `MessageCircle` |
| Voice | `Mic` |
| Translate | `Languages` |
| Document | `FileText` |
| Learn | `BookOpen` |
| Preserve | `Sprout` |

---

# Responsive Design Strategy

## Mobile First

All layouts are designed for mobile (375px) first, then enhanced for larger screens.

| Breakpoint | Prefix | Min Width |
| ---------- | ------ | --------- |
| Default | — | 0px |
| `sm` | `sm:` | 640px |
| `md` | `md:` | 768px |
| `lg` | `lg:` | 1024px |
| `xl` | `xl:` | 1280px |

## Responsive Behavior

| Component | Mobile | Tablet | Desktop |
| --------- | ------ | ------ | ------- |
| Feature cards | 2-column grid | 3-column grid | 4-column grid |
| Chat layout | Full-width bubbles | Max 80% width bubbles | Centered, max 640px |
| Navigation | Bottom nav bar | Bottom nav bar | Header nav links |
| Microphone button | 80px diameter | 96px diameter | 96px diameter |
| Upload zone | Full width | 80% width centered | 60% width centered |
| Typography | Base 16px | Base 16px | Base 16px |

---

# Dark Mode

- Activated via `prefers-color-scheme: dark` media query
- No manual toggle in MVP
- All color tokens have dark mode equivalents (see Color Palette)
- Cards use slightly elevated backgrounds in dark mode for depth
- Primary green shifts to a lighter mint (`#34D399`) for contrast on dark backgrounds

---

# Component Styling Patterns

## Cards

```text
Background: var(--card)
Border: 1px solid var(--border)
Border radius: rounded-xl (16px)
Padding: space-6 (24px)
Shadow: shadow-sm
Hover: shadow-md + border-primary/20
```

## Buttons

| Variant | Background | Text | Border |
| ------- | ---------- | ---- | ------ |
| Primary | `--primary` | `--primary-foreground` | none |
| Secondary | `--secondary` | `--secondary-foreground` | 1px `--border` |
| Ghost | transparent | `--foreground` | none |
| Destructive | `--destructive` | white | none |

All buttons: `rounded-md`, min-height 44px, padding `12px 24px`.

## Inputs

```text
Background: var(--background)
Border: 1px solid var(--border)
Border radius: rounded-md
Padding: 12px 16px
Focus: border-primary, ring-2 ring-primary/20
Font size: 16px (prevents iOS zoom)
```

---

# Design Tokens Summary

| Category | System |
| -------- | ------ |
| Colors | CSS custom properties (HSL) |
| Typography | Tailwind type scale |
| Spacing | 4px grid (Tailwind) |
| Radius | Tailwind rounded utilities |
| Shadows | Tailwind shadow utilities |
| Animation | Tailwind animate + custom keyframes |
| Icons | Lucide React |
| Components | shadcn/ui |

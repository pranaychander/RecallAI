---
name: RecallAI
colors:
  surface: '#13131b'
  surface-dim: '#13131b'
  surface-bright: '#393841'
  surface-container-lowest: '#0d0d15'
  surface-container-low: '#1b1b23'
  surface-container: '#1f1f27'
  surface-container-high: '#292932'
  surface-container-highest: '#34343d'
  on-surface: '#e4e1ed'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e4e1ed'
  inverse-on-surface: '#303038'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#13131b'
  on-background: '#e4e1ed'
  surface-variant: '#34343d'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
---

## Brand & Style
The design system for this product centers on an **Intelligent, Professional, and Effortless** personality. It targets high-performance teams and individual power users who value clarity and speed. 

The aesthetic is a hybrid of **Minimalism** and **Glassmorphism**, drawing inspiration from the precision of developer tools (Linear), the spatial clarity of documentation engines (Notion), and the motivating accessibility of modern consumer apps (Duolingo). 

**Key Principles:**
- **Clarity over Decoration:** Every element serves a functional purpose.
- **Dimensionality:** Depth is used to guide attention, using subtle glass layers and tiered surfaces rather than flat blocks.
- **Momentum:** High-contrast typography and elegant progress indicators create a sense of forward motion and achievement.

## Colors
The system utilizes a **Dark Mode First** approach to minimize eye strain and maximize the "premium" feel. 

- **Primary (Indigo/Violet):** Used for primary actions, focus states, and progress. It represents intelligence and the core AI engine.
- **Success (Emerald):** Denotes completion, health, and positive reinforcement.
- **Warning/Error:** Used sparingly to maintain a calm environment, only drawing attention when necessary.
- **Neutrals:** A range of deep charcoals and blacks (`#0a0a0a` to `#1f1f1f`) form the foundation. Borders use a low-opacity white (e.g., `rgba(255, 255, 255, 0.08)`) to create definition without visual noise.

In **Light Mode**, the palette flips to a clean white and light gray (`#f9fafb`) foundation with soft silver borders.

## Typography
The system relies on **Inter** for its neutral, highly readable characteristics. For technical elements and labels, **Geist** is introduced to provide a subtle "developer-tool" precision.

**Hierarchy Strategy:**
- **High Contrast:** Significant weight differences between headlines and body text to ensure a clear information scan path.
- **Tight Leading:** Headlines use slightly tighter line heights for a compact, professional look.
- **Micro-copy:** Use the `label-caps` style for section headers and metadata to provide an editorial structure.

## Layout & Spacing
This design system utilizes a **12-column Fluid Grid** with a strict **8px base rhythm**.

- **Desktop:** 32px margins with 24px gutters. Content should be centered with a max-width of 1440px for dashboard views.
- **Tablet:** 24px margins with 16px gutters.
- **Mobile:** 16px margins with 16px gutters. Stacked layouts are preferred over horizontal scrolling.

Spacing is used generously (spaciousness) to evoke the Notion-like feeling of "room to think." Containers should use `md` (24px) or `lg` (48px) padding to maintain an airy, premium feel.

## Elevation & Depth
Depth is conveyed through **Glassmorphism** and **Tonal Layering** rather than traditional heavy shadows.

- **Level 0 (Background):** Solid deep charcoal/black.
- **Level 1 (Cards/Sidebar):** Semi-transparent surfaces with a `backdrop-filter: blur(12px)`. Borders are 1px solid with low opacity.
- **Level 2 (Popovers/Modals):** Increased blur (20px) and a multi-layered "Ambient Shadow."
- **Ambient Shadow Recipe:** 
  1. A sharp 1px stroke (inner glow).
  2. A soft, large-radius shadow (e.g., `0 20px 40px rgba(0,0,0,0.4)`).
  3. A very subtle tint of the Primary color in the shadow to add warmth.

## Shapes
The shape language is modern and "friendly-tech." 
- **Standard Radius:** 16px for primary containers, cards, and large input fields.
- **Button Radius:** 12px or fully rounded (pill) depending on the context (Pills for CTAs, 12px for utility buttons).
- **Nested Radius:** Ensure nested elements have a smaller radius than their parents to maintain visual harmony (Parent Radius - Padding = Child Radius).

## Components

### Buttons
Primary buttons use a vibrant Indigo-to-Violet gradient with a subtle inner glow on the top edge. Hover states should increase the brightness of the gradient. Secondary buttons are "Ghost" style: transparent background with a subtle border and blur.

### Cards
Cards are the hallmark of the system. They must feature a 1px border (`rgba(255,255,255,0.1)`) and a background blur. Avoid solid backgrounds for cards unless they are nested inside an already blurred container.

### Inputs
Large (height: 48px), 16px rounded corners. Focused states use a 2px Primary Indigo border with a soft outer glow. Use `Geist` for placeholder text to imply technical precision.

### Progress Indicators
Inspired by Duolingo but made professional. Use rounded tracks with a subtle inner shadow. The progress bar itself should have a slight glow effect in the Primary or Success color.

### Chips & Tags
Small, 8px rounded corners or full pill. Use "Soft" coloring (e.g., Emerald text on a 10% opacity Emerald background) to keep the UI clean and legible.

### Lists
Minimalist with 1px separators. Hover states should trigger a subtle background tint (5% white) and a 4px vertical "accent bar" on the left edge in the Primary color to denote selection.
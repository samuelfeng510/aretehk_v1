---
name: Restorative Precision
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#48473f'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#79776f'
  outline-variant: '#c9c6bd'
  surface-tint: '#605f54'
  primary: '#605f54'
  on-primary: '#ffffff'
  primary-container: '#f3f0e2'
  on-primary-container: '#6e6d62'
  inverse-primary: '#c9c7ba'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#5e5e5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#f0efef'
  on-tertiary-container: '#6c6c6c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e3d5'
  primary-fixed-dim: '#c9c7ba'
  on-primary-fixed: '#1c1c14'
  on-primary-fixed-variant: '#48473d'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '300'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 80px
  section-gap: 120px
---

## Brand & Style

The design system embodies a "Clinical Editorial" aesthetic, merging the sterile precision of modern medicine with the warm, high-touch experience of a luxury spa. It is defined by an atmosphere of calm authority and quiet confidence. 

The visual style is rooted in **Minimalism**, utilizing expansive whitespace to reduce cognitive load and evoke a sense of mental clarity. The focus is placed heavily on refined typography and a curated neutral palette. There are no unnecessary decorative elements; every line and margin serves to frame information with professional grace, ensuring the user feels cared for in a premium, expert environment.

## Colors

The color strategy relies on a sophisticated hierarchy of neutrals. The primary color, a warm parchment beige, is used to soften the interface, preventing the clinical white from feeling cold or intimidating. 

- **Primary (#F3F0E2):** Used for large structural blocks, section backgrounds, and subtle call-to-action surfaces to provide warmth.
- **Secondary (#141414):** The core color for typography and high-contrast UI elements. It provides the "anchor" of authority against the lighter backgrounds.
- **Tertiary (#8D8D8D):** Reserved for de-emphasized metadata, borders, and auxiliary information.
- **Neutral (#FFFFFF):** The base canvas, used to maximize the sense of space and light within the layout.

## Typography

This design system employs a classic serif-on-sans pairing to balance heritage with modernity. 

Headlines utilize a sophisticated serif to convey clinical expertise and a high-end, editorial feel. These should be set with generous leading and occasional negative letter-spacing for larger display sizes to maintain a tight, professional look. 

Body copy uses a neutral sans-serif for maximum legibility in a medical context. A larger-than-standard line height (1.6) is essential to maintain the "spacious" feel of the brand. Small labels should be set in uppercase with increased tracking to serve as clear, modern signposts throughout the experience.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy to ensure a curated, balanced composition on all screens. To achieve the "medical spa" atmosphere, the design system mandates aggressive use of vertical margins (section gaps) to separate distinct content areas.

Elements are aligned to a 12-column grid with wide gutters. Content should rarely feel "packed"; if in doubt, increase the padding. The use of asymmetric layouts—where text blocks are offset against large images—is encouraged to mimic high-end lifestyle magazines.

## Elevation & Depth

Depth in this design system is achieved through **Tonal Layers** rather than traditional shadows. By stacking the primary beige surfaces against white backgrounds, a subtle sense of hierarchy is created without breaking the minimalist aesthetic.

When interaction feedback is required, use **low-contrast outlines** (1px strokes in the tertiary or primary-darker shade). Shadows are almost entirely avoided; if a shadow must be used for a floating element like a modal, it should be an "Ambient Shadow"—extremely diffused, low-opacity, and tinted with the secondary charcoal color to prevent a "muddy" appearance.

## Shapes

The design system utilizes **Sharp** geometry. Right angles (0px radius) reinforce the clinical precision, architectural stability, and premium nature of the brand. 

Square corners should be applied to buttons, input fields, and image containers. This lack of rounding creates a bespoke, high-fashion feel that differentiates the product from more consumer-grade, "bubbly" medical apps. Small accents, such as icons or decorative lines, should maintain this linear, crisp integrity.

## Components

### Buttons
Primary buttons are solid charcoal with white text, featuring sharp corners and significant horizontal padding. Secondary buttons are outlined in charcoal or set as text-links with a 1px underline. Hover states should involve a subtle shift in background color (e.g., charcoal to a very deep grey) rather than a transformation in shape.

### Input Fields
Inputs should be minimalist, often appearing as a single bottom border or a light beige box with no side borders. Focus states are indicated by a weight increase in the bottom border or a subtle shift in the background tone. Labels are always positioned above the field in the "label-caps" style.

### Cards
Cards are flat containers. Separation is achieved through a change in background color (e.g., a beige card on a white background). Avoid borders on cards unless they are used to separate adjacent items of the same color.

### Chips & Tags
Used for medical categories or treatment types. These should be styled as small, pill-shaped outlines (the only exception to the sharp-corner rule, if used sparingly) or small sharp rectangles with light-grey backgrounds.

### Additional Components
- **Editorial Grids:** Curated layouts for treatment galleries, emphasizing high-quality photography with thin dividers.
- **Progressive Disclosure:** Use simple plus/minus icons for accordions to keep the interface clean while hiding dense medical information.
# Midnight Glass Design System
 
### 1. Overview & Creative North Star
**Creative North Star: The Digital Curator**
Midnight Glass is a high-end editorial design system built for discovery and precision. It moves away from the rigid, generic "app" feel toward a layout inspired by modern architecture and premium print magazines. By utilizing intentional asymmetry, deep tonal layering, and high-contrast typography, the system creates a sense of "quiet luxury" in a digital space.
 
The system is designed to feel curated rather than generated. It prioritizes the "human" touch through oversized headlines and spacious white space, allowing high-quality imagery to breathe within a sophisticated technical framework.
 
### 2. Colors
The palette is rooted in deep structural blues (`#004ac6`) and crisp, cool neutrals.
 
- **The "No-Line" Rule:** Visual separation must be achieved through background shifts (e.g., transitioning from `surface` to `surface-container-low`) rather than 1px solid borders. This ensures a fluid, modern interface where content blocks are felt rather than enclosed.
- **Surface Hierarchy & Nesting:** Depth is constructed by nesting. Main content sits on `surface` or `surface-container-low`. Floating cards or interactive elements use `surface-container-lowest` (#ffffff) to appear elevated.
- **The "Glass & Gradient" Rule:** Navigation and persistent overlays utilize a 70% opacity background with a 20px-40px backdrop blur to maintain context while creating a sophisticated "glass" effect.
- **Signature Textures:** Primary CTAs should utilize a subtle linear gradient (from `primary` to `primary-container`) to provide tactile depth without resorting to heavy skeuomorphism.
 
### 3. Typography
Midnight Glass uses **Manrope** across all roles to maintain a cohesive, geometric, yet friendly personality. 
 
**Typography Scale (Ground Truth):**
- **Display/Hero:** 3.75rem (60px) – Extrabold. Used for primary page headers with tight tracking.
- **Headline:** 2.25rem (36px) – Extrabold. For secondary section headers.
- **Sub-headline:** 1.5rem (24px) – Bold. Used for card titles and group headers.
- **Body Large:** 1.25rem (20px) – Regular/Medium. Used for introductory paragraphs.
- **Body Standard:** 1.125rem (18px) – Regular.
- **Label / Small Cap:** 0.6875rem (11px) to 0.75rem (12px) – Bold with 0.1em tracking. Used for metadata and category tags.
 
The typographic rhythm relies on extreme contrast between the 60px headers and 12px labels to create a clear editorial hierarchy.
 
### 4. Elevation & Depth
Elevation is expressed through ambient light and tonal "stacking" rather than harsh shadows.
 
- **Ambient Shadows:** The signature `editorial-shadow` is `0 20px 40px rgba(27, 27, 32, 0.04)`. This creates a soft, wide-area diffusion that feels like natural light rather than a digital drop shadow.
- **The Layering Principle:** Higher-priority information should be placed on a lighter surface (`surface-container-lowest`) with an `editorial-shadow`.
- **Glassmorphism:** Use `backdrop-blur-xl` on top-level elements like navbars to allow the background colors to "bleed" through, grounding the UI in the user's current scroll position.
- **Interactive State:** Hovering on a card should result in a `-4px` vertical translation and a slight increase in shadow depth.
 
### 5. Components
- **Buttons:** Primary buttons use a gradient background with no border and rounded-md (4px) corners. Secondary buttons use `surface-container-highest` with semi-bold text.
- **Inputs:** Use `surface-container-lowest` backgrounds with a subtle `shadow-sm`. Interaction is signaled by a ring focus rather than a border change.
- **Cards:** Defined by `editorial-shadow` and `surface-container-low`. Card headers for imagery should maintain a strict aspect ratio (e.g., 4:3) with a subtle zoom effect on hover.
- **Chips/Badges:** Use a subtle primary-container/10% fill with high-contrast text for status or filters.
- **Navigation:** Fixed, glass-morphic bar with minimal icons and high-weight branding.
 
### 6. Do's and Don'ts
**Do:**
- Use wide margins (8-12 units) to create an editorial feel.
- Utilize high-weight (black/extrabold) for short headlines.
- Use iconography as decorative background elements at low opacity.
- Mix serif-like weights (extrabold) with geometric precision.
 
**Don't:**
- Do not use 1px solid borders for layout containers.
- Do not use fully opaque navigation bars.
- Avoid cluttered layouts; if in doubt, increase the spacing between sections to `spacing: 3` (32px-48px).
- Do not use vibrant colors for body text; stick to `on-surface-variant` for readability and sophistication.
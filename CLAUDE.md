# Settle — Design System & Claude Guide

> **For all Claude instances / AI coding assistants:** Read this entire file before touching any code. It is the authoritative reference for how this project is structured and styled. Deviating from these rules will make your pages look inconsistent with the rest of the app.

This file is the single source of truth for styling in the Settle app. Every Claude instance working on this project must read this before writing any UI code. Following these rules ensures all pages look like they belong to the same product.

---

## Project Status (as of April 2026)

### Already Built — Do NOT Rebuild These
These pages are complete. Do not create new versions of them.

| File | Route | Status |
|------|--------|--------|
| `src/pages/Login.jsx` | `/login` | ✅ Complete |
| `src/pages/Dashboard.jsx` | `/dashboard` | ✅ Complete |
| `src/pages/Preferences.jsx` | `/preferences` | ✅ Complete |
| `src/pages/Results.jsx` | `/results` | ✅ Complete |
| `src/pages/Search.jsx` | `/search` | ✅ Complete |
| `src/pages/ListingDetail.jsx` | `/listing/:id` | ✅ Complete |
| `src/pages/Favorites.jsx` | `/favorites` | ✅ Complete |
| `src/pages/Settings.jsx` | `/settings` | ✅ Complete |
| `src/pages/Notifications.jsx` | `/notifications` | ✅ Complete |
| `src/pages/Booking.jsx` | `/booking/:id` | ✅ Complete |
| `src/pages/Maintenance.jsx` | `/maintenance` | ✅ Complete |
| `src/pages/Compare.jsx` | `/compare` | ✅ Complete |
| `src/pages/Admin.jsx` | `/admin` | ✅ Complete |
| `src/pages/About.jsx` | `/about` | ✅ Complete |
| `src/pages/Contact.jsx` | `/contact` | ✅ Complete |
| `src/pages/FAQ.jsx` | `/faq` | ✅ Complete |
| `src/pages/Privacy.jsx` | `/privacy` | ✅ Complete |
| `src/pages/Terms.jsx` | `/terms` | ✅ Complete |

### Shared Mock Data
All apartment listing data lives in `src/data/listings.js`. It exports:
- `LISTINGS` — array of 8 apartment objects
- `getListing(id)` — find by id, falls back to first listing

Import and reuse this data instead of defining your own.

### The Router
The client-side router lives in `src/App.jsx`. To add a new page:
1. Create the component in `src/pages/`
2. Import it in `src/App.jsx`
3. Add a `case '/your-route':` to the switch statement
4. If the route should be public (no auth required), add it to `PUBLIC_ROUTES`

Dynamic routes (`/listing/:id`, `/booking/:id`) are handled by regex matching at the top of `renderPage()`.

---

## How This Project Was Built (Context for AI Assistants)

### Vibe Coding Approach
This project is being built by a team where each member (and their Claude instance) owns specific pages or features. The lead engineer (Jose) set up the design system, routing, and all 18 pages. Teammates are contributing additional features and refinements.

**The golden rule: when in doubt, look at an existing page and match it exactly.** If you're writing a new component, open `src/pages/Dashboard.jsx` or `src/pages/Results.jsx` and follow the same patterns.

### What Jose Cares About Most
1. **Visual consistency** — every page must look like it belongs to the same app. No freelancing on colors, fonts, or component shapes.
2. **The navbar is sacrosanct** — `src/components/layout/Navbar.jsx` is fixed. Do not modify it without Jose's approval. Do not replace it with a sidebar or different nav.
3. **No borders** — the no-border rule is non-negotiable. Use surface color shifts and `editorial-shadow` instead.
4. **Material Symbols only** — never import lucide-react, heroicons, or any other icon library.
5. **Tailwind tokens only** — never use raw hex colors in className strings. Use `text-primary`, `bg-surface-container-low`, etc.

### What Teammates Should NOT Do
- Do not change `tailwind.config.js` — the color palette is final
- Do not change `src/index.css` — the base styles are final
- Do not change `src/components/layout/Navbar.jsx` or `Footer.jsx` without explicit approval
- Do not add new npm packages without checking first (especially UI component libraries)
- Do not use `react-router-dom` — the router is custom and lives in App.jsx
- Do not use `next/*` anything — this is Vite + React, not Next.js
- Do not invent new color names — only use the tokens in tailwind.config.js
- Do not copy the design/layout from the wireframes in `/docs/wireframes/` for the navbar — those wireframes show Zillow admin navbars that are NOT used in this app

### Wireframe Priority Rules
The `/docs/wireframes/` folder has 12 diagrams. Follow this hierarchy:
1. **Highest authority (layout + style):** `ApartmentListingDetailWireframe`, `ApartmentSearchResultsWMapWireframe`, `ApartmentSearchResultDiagramNoMap`, `ReccomendationOverviewWireframe`
2. **Medium authority (layout only, ignore colors/nav):** All other diagrams — take the content and structure, apply the Settle design system
3. **Always override:** Replace any navbar shown in wireframes with the existing Settle glassmorphic navbar

---

---

## Tech Stack

- **Vite + React** (no Next.js)
- **Tailwind CSS v3** with a custom theme in `tailwind.config.js`
- **Manrope** font — Google Fonts, weights 200–800 (already loaded in `index.html`)
- **Material Symbols Outlined** icons — Google Fonts CDN (already loaded in `index.html`)
- **Client-side router** — custom, no react-router. Uses `window.history.pushState` + `popstate`. See `src/App.jsx`.
- **Mock auth** — `src/context/AuthContext.jsx` + `src/data/users.json`. No real backend yet.

---

## Adding a New Page

1. Create `src/pages/MyPage.jsx`
2. Open `src/App.jsx` and import it
3. Add a case to the route switch:
   ```jsx
   case '/my-page': return <MyPage onNavigate={navigate} />;
   ```
4. If the page should show **without** Navbar/Footer (e.g., auth pages), add the path to `PUBLIC_ROUTES`.
5. Every page component receives `onNavigate` as a prop — use it instead of `window.location.href`:
   ```jsx
   export default function MyPage({ onNavigate }) {
     return <button onClick={() => onNavigate('/dashboard')}>Go</button>;
   }
   ```

---

## Color Tokens

All colors are defined in `tailwind.config.js`. Use the token names, not raw hex values.

### Primary (Blue)
| Token | Hex | Use |
|-------|-----|-----|
| `primary` | `#004AC6` | Buttons, links, active states, brand text |
| `primary-container` | `#2563EB` | Gradient end, icon backgrounds |
| `primary-fixed` | `#DBEAFE` | Light tint backgrounds |
| `on-primary` | `#FFFFFF` | Text on primary buttons |
| `on-primary-container` | `#EFF6FF` | Text on primary-container |

### Secondary (Blue-Gray)
| Token | Hex | Use |
|-------|-----|-----|
| `secondary` | `#6675A7` | Secondary actions |
| `secondary-container` | `#A8B4D8` | Soft accents |
| `on-surface-variant` | `#6675A7` | Body text, labels, icons on light bg |

### Tertiary (Rust)
| Token | Hex | Use |
|-------|-----|-----|
| `tertiary` | `#9C2E02` | Star ratings, warm accents |
| `tertiary-container` | `#C44A10` | Warm icon fills |

### Surfaces (Cool Neutral Gray — light mode)
| Token | Hex | Visual Level |
|-------|-----|-------------|
| `surface` | `#F5F6FA` | Page background |
| `surface-bright` | `#FFFFFF` | Brightest surface (hover state) |
| `surface-container-lowest` | `#FFFFFF` | Highest elevation card (pops the most) |
| `surface-container-low` | `#EEEEF4` | Section panels, secondary cards |
| `surface-container` | `#E7E8EF` | Hover row bg, dividers |
| `surface-container-high` | `#E0E1EA` | Tab bar bg, grouped controls |
| `surface-container-highest` | `#D9DAE4` | Strongest tonal container |
| `surface-dim` | `#C5C7D4` | Disabled states |

### Text
| Token | Use |
|-------|-----|
| `on-surface` | Primary text, headings |
| `on-surface-variant` | Body text, labels, secondary info |
| `outline` | Placeholder text, subtle labels, divider lines |
| `outline-variant` | Lightest visible dividers |

### Error
| Token | Hex |
|-------|-----|
| `error` | `#BA1A1A` |
| `error-container` | `#FFDAD6` |

---

## The No-Border Rule

**Never use Tailwind border classes (`border`, `border-gray-200`, etc.) for structural separation.**

Instead, use **tonal surface shifts** — adjacent elements at different surface levels look separated without lines. Example:
- Page bg: `surface` (`#F5F6FA`)
- Card bg: `surface-container-lowest` (`#FFFFFF`) → pops naturally

Use `editorial-shadow` (defined in `index.css`) on cards to create depth without borders:
```
box-shadow: 0 20px 40px rgba(27, 27, 32, 0.04);
```

The only exceptions: focus rings on inputs (`focus:ring-2 focus:ring-primary/20`) and the nav shadow (`shadow-nav`).

---

## Typography Scale

Font family: **Manrope** for everything. Never use any other font.

| Role | Class | Weight | Use |
|------|-------|--------|-----|
| Display / Hero | `text-6xl font-extrabold tracking-tight` | 800 | Page titles (H1) |
| Headline | `text-4xl font-extrabold tracking-tight` | 800 | Section headers (H2) |
| Sub-headline | `text-2xl font-bold` | 700 | Card titles (H3) |
| Body Large | `text-xl font-medium leading-relaxed` | 500 | Intro paragraphs |
| Body Standard | `text-lg text-on-surface-variant` | 400 | List items, descriptions |
| Label | `text-[0.75rem] font-bold uppercase tracking-[0.1em]` | 700 | Form labels, badge text, overlines |
| Micro / Footer | `text-[0.6875rem] font-medium tracking-wide` | 500 | Footer links, timestamps |

---

## Component Patterns

### Buttons

**Primary CTA** — gradient, rounded-lg:
```jsx
<button className="bg-gradient-to-br from-primary to-primary-container text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all active:scale-95">
  Action
</button>
```

**Secondary** — surface tonal, rounded-lg:
```jsx
<button className="bg-surface-container-highest text-on-surface px-6 py-3 rounded-lg font-semibold text-sm hover:bg-surface-dim transition active:scale-95">
  Secondary
</button>
```

**Pill / Tertiary** — used inside colored panels:
```jsx
<button className="bg-white text-primary py-3 px-6 rounded-full font-bold text-[0.75rem] uppercase tracking-[0.1em] hover:bg-surface-bright transition active:scale-95">
  Label
</button>
```

**Text-only** (nav links, "View All"):
```jsx
<button className="text-primary font-bold hover:underline flex items-center gap-2 text-sm">
  View All
  <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
```

### Inputs

Every text input uses this style — no visible border, shadow for depth, focus ring:
```jsx
const inputCls = 'w-full bg-surface-container-lowest shadow-sm rounded-lg px-4 py-3 text-on-surface placeholder:text-outline font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow';
```

With a leading icon:
```jsx
<div className="relative">
  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
  <input className={`${inputCls} pl-10`} type="email" placeholder="you@example.com" />
</div>
```

Form labels always use label typography:
```jsx
<label className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">Email</label>
```

### Cards

**Default card** (panels, sidebars) — sits on `surface`, uses `surface-container-low`:
```jsx
<div className="bg-surface-container-low p-6 rounded-xl editorial-shadow">
  {/* content */}
</div>
```

**Elevated listing card** — pops above page bg, used for property cards:
```jsx
<div className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow hover:-translate-y-1 hover:shadow-[0_28px_56px_rgba(27,27,32,0.10)] transition-all duration-300 cursor-pointer">
  {/* 4:3 image then content */}
</div>
```

**Tinted section** — for "insight" or "improving" blocks:
```jsx
<section className="bg-primary/5 rounded-xl p-10 relative overflow-hidden editorial-shadow">
  {/* decorative icon at low opacity, then content */}
</section>
```

**CTA panel** — primary background, white text:
```jsx
<div className="bg-primary rounded-xl p-8 text-white overflow-hidden relative editorial-shadow">
  {/* decorative icon absolute at 20% opacity */}
</div>
```

### Badges / Chips

```jsx
<span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[0.75rem] font-bold uppercase tracking-[0.1em]">
  Label
</span>
```

### Glassmorphic Navbar

Already built in `src/components/layout/Navbar.jsx`. It is fixed at the top with:
```
bg-surface-container-lowest/80 backdrop-blur-xl shadow-nav
```
All pages that use the navbar should have `pt-32` on their top-level container to avoid content hiding under it.

### Tab Switcher

```jsx
<div className="flex bg-surface-container-high rounded-xl p-1">
  <button className="flex-1 py-2 text-sm font-bold rounded-lg bg-surface-container-lowest text-on-surface editorial-shadow">
    Active Tab
  </button>
  <button className="flex-1 py-2 text-sm font-bold rounded-lg text-on-surface-variant hover:text-on-surface">
    Inactive Tab
  </button>
</div>
```

---

## Icons — Material Symbols

**Always use Material Symbols Outlined, never lucide-react.**

```jsx
<span className="material-symbols-outlined">icon_name</span>
```

To fill an icon:
```jsx
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
```

Common icons used in this project:
- `home_work` — neighborhood/housing
- `verified_user` — safety
- `auto_awesome` — AI features
- `trending_up` — improvements
- `account_circle` — user avatar
- `search` — search
- `favorite` — save/heart
- `star` — ratings (use `text-tertiary` color)
- `location_on` — city/location
- `payments` — budget
- `directions_car` — commute
- `mail` — email input
- `lock` — password input
- `person` — name input
- `arrow_forward` — "view all" links
- `check` — list checkmarks
- `info` — info callouts
- `notifications` — alerts
- `tune` — filter/settings

Decorative background icons (low opacity, large):
```jsx
<div className="absolute top-0 right-0 opacity-5 pointer-events-none">
  <span className="material-symbols-outlined text-[400px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
    home_work
  </span>
</div>
```

---

## Layout Conventions

- Max content width: `max-w-screen-2xl mx-auto`
- Page horizontal padding: `px-8`
- Page top padding (to clear fixed navbar): `pt-32`
- Page bottom padding: `pb-24`
- Section spacing between major blocks: `mt-24` or `mb-16`
- Card gap in grids: `gap-8` (listings), `gap-4` (compact)
- Inner card padding: `p-8` (large), `p-6` (default), `p-5` (compact)

---

## Zillow Branding

This product is "Built for Zillow." The logo must appear in two places:

**Footer** (`src/components/layout/Footer.jsx`):
```jsx
<img src="/ZillowLogo.png" alt="Zillow" className="h-4 w-4 rounded-full opacity-60" />
<span className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">Settle</span>
// then separately:
<span className="text-[0.6875rem] font-medium tracking-wide text-outline">© 2026 Settle Digital Curator. Powered by Zillow.</span>
```

**Login page right panel** (`src/pages/Login.jsx`), at the bottom of the editorial panel:
```jsx
<div className="mt-16 pt-8 flex items-center gap-3">
  <span className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-outline">Built for</span>
  <img src="/ZillowLogo.png" alt="Zillow" className="h-7 w-7 rounded-full editorial-shadow" />
  <span className="text-sm font-bold text-on-surface-variant">Zillow</span>
</div>
```

The logo file lives at `/public/ZillowLogo.png`.

---

## Page Structure Template

Use this as a starting point for every new authenticated page:

```jsx
export default function MyPage({ onNavigate }) {
  return (
    <div className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto w-full">

      {/* Header */}
      <header className="mb-12">
        <h1 className="text-6xl font-extrabold tracking-tight text-on-surface mb-4">
          Page Title
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed font-medium">
          Supporting description text.
        </p>
      </header>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-10">
          {/* Left/main content */}
        </div>
        <aside className="lg:col-span-4 space-y-8">
          {/* Right sidebar */}
        </aside>
      </div>

    </div>
  );
}
```

For full-width pages (no sidebar), just skip the grid and use `space-y-10` or `space-y-16` for sections.

---

## What NOT to Do

- No `border`, `border-gray-*`, `divide-*` classes for layout separation
- No lucide-react or heroicons — only Material Symbols Outlined
- No `font-family` overrides — Manrope everywhere
- No raw hex colors in className — use the token names from tailwind.config.js
- No `react-router-dom` — use the `onNavigate` prop pattern
- No `<a href>` for internal navigation — use `onNavigate('/path')`
- No `next/link`, `next/image`, or any Next.js imports
- Do not add shadows by hand — use `editorial-shadow` (CSS class) or `shadow-nav`, `shadow-sm` (Tailwind tokens)

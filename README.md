# Settle

AI-powered apartment recommendation platform built for Zillow. Helps renters find their perfect neighborhood using safety data, lifestyle preferences, and real-time listings.

> **SE Class PA4 MVP** · Vite + React + Tailwind CSS · Mock data (no backend yet)

---

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173` (or next available port).

**Demo login:** `demo@settle.com` / `password`

---

## Project Structure

```
src/
├── App.jsx                    # Client-side router (custom, no react-router)
├── index.css                  # Tailwind base + body styles + .editorial-shadow
├── context/
│   └── AuthContext.jsx        # Mock auth (localStorage)
├── data/
│   ├── listings.js            # 8 mock apartment objects — shared across all pages
│   └── users.json             # 2 demo users
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx         # Fixed glassmorphic navbar (DO NOT MODIFY)
│   │   └── Footer.jsx         # Footer with Zillow branding
│   └── ui/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Input.jsx
│       └── Badge.jsx
└── pages/
    ├── Login.jsx              # / and /login
    ├── Dashboard.jsx          # /dashboard
    ├── Preferences.jsx        # /preferences
    ├── Results.jsx            # /results
    ├── Search.jsx             # /search (map + listings)
    ├── ListingDetail.jsx      # /listing/:id
    ├── Favorites.jsx          # /favorites
    ├── Settings.jsx           # /settings
    ├── Notifications.jsx      # /notifications
    ├── Booking.jsx            # /booking/:id
    ├── Maintenance.jsx        # /maintenance
    ├── Compare.jsx            # /compare
    ├── Admin.jsx              # /admin
    ├── About.jsx              # /about
    ├── Contact.jsx            # /contact
    ├── FAQ.jsx                # /faq
    ├── Privacy.jsx            # /privacy
    └── Terms.jsx              # /terms
```

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Vite + React (no Next.js) |
| Styling | Tailwind CSS v3 with custom design tokens |
| Icons | Material Symbols Outlined (Google Fonts CDN) |
| Font | Manrope (Google Fonts, weights 200–800) |
| Routing | Custom (`window.history.pushState` + `popstate`) |
| Auth | Mock (localStorage) |
| Data | Static mock (`src/data/listings.js`) |

---

## Design System

**Read `CLAUDE.md` before writing any UI code.** It covers color tokens, typography, component patterns, the no-border rule, icon usage, and what NOT to do.

Quick reference:
- Primary: `#004AC6` → use `text-primary`, `bg-primary`
- Cards: `bg-surface-container-low rounded-xl editorial-shadow`
- CTAs: `bg-gradient-to-br from-primary to-primary-container text-white rounded-lg`
- Icons: `<span className="material-symbols-outlined">icon_name</span>`

---

## Contributing (Teammates)

1. **Read `CLAUDE.md` first**
2. Branch off main: `git checkout -b feature/your-feature`
3. Pages go in `src/pages/` — add your route to `src/App.jsx`
4. Reuse data from `src/data/listings.js`
5. Never modify `tailwind.config.js`, `Navbar.jsx`, or `index.css` without approval
6. Open a PR against `main`

---

## Backend (Future Sprint)

FastAPI backend (Gemini + Qdrant + Crimeometer + Yelp) to be connected later. Frontend uses mock data until then.

---

Built for Zillow · Spring 2026

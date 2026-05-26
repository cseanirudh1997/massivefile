# Massive — Enterprise AI Infrastructure Platform

A production-ready, CMS-driven enterprise AI platform built with **React 18 + Vite + Tailwind CSS v3 + Framer Motion**, backed by a **Google Apps Script** spreadsheet backend.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend Architecture](#backend-architecture)
  - [Google Apps Script Endpoint](#google-apps-script-endpoint)
  - [Supported Actions](#supported-actions)
  - [Sheet Schemas](#sheet-schemas)
- [Frontend Architecture](#frontend-architecture)
  - [Routing](#routing)
  - [Auth & Session](#auth--session)
  - [API Layer](#api-layer)
  - [Design System](#design-system)
- [Pages & Components](#pages--components)
- [CMS-Driven Content](#cms-driven-content)
- [Payments Integration](#payments-integration)
- [Environment & Configuration](#environment--configuration)
- [Deployment](#deployment)

---

## Overview

**Massive** is a full-stack enterprise SaaS marketing and operations platform for an AI infrastructure company. It showcases AI products across six categories (Voice AI, Copilots, RAG Systems, Call Center AI, Agent Orchestration, Workflow Automation), captures enterprise leads, accepts Razorpay payment bookings, and provides an authenticated analytics dashboard.

All content — products, media assets, payment links, platform config, and chatbot rules — is driven entirely from a Google Sheets backend via a Google Apps Script Web App, making it zero-infrastructure CMS.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + Vite 5 |
| Styling | Tailwind CSS v3 + custom design tokens |
| Animation | Framer Motion 11 |
| Routing | React Router v6 (HashRouter) |
| Charts | Recharts 2 |
| Icons | Lucide React |
| Toasts | React Hot Toast |
| Fonts | Space Grotesk (display) · Inter (sans) · JetBrains Mono (mono) |
| Backend | Google Apps Script Web App (POST-only, no CORS preflight) |
| Payments | Razorpay Payment Links (`window.open`) |
| Hosting | Any static host (Vercel, Netlify, GitHub Pages, Firebase Hosting) |

---

## Project Structure

```
massivefile/
├── index.html                  # Entry HTML — Google Fonts, scroll progress bar
├── vite.config.js              # Vite + React plugin
├── tailwind.config.js          # Design tokens — brand cyan + accent violet
├── postcss.config.js           # Tailwind + Autoprefixer
├── package.json
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # HashRouter, route layout, Toaster config
    ├── index.css               # Global styles, component classes, animations
    │
    ├── config.js               # API URL, company constants, NAV_LINKS, STORAGE_KEYS
    ├── utils.js                # Session helpers, validation, formatting, scroll
    ├── api.js                  # All 9 backend actions + in-memory cache + fallbacks
    │
    ├── Navbar.jsx              # Scroll-aware glass navbar + mobile drawer
    ├── Footer.jsx              # Site footer with social links
    ├── ProtectedRoute.jsx      # Auth guard — redirects to /login if unauthenticated
    │
    ├── Hero.jsx                # CMS-driven hero — typewriter, floating badges, stats
    ├── Capabilities.jsx        # 6-card static capability grid
    ├── Products.jsx            # Dynamic product cards from backend + category filter
    ├── UseCases.jsx            # 6 static industry use-case cards
    ├── Workflow.jsx            # 5-step deployment pipeline (static)
    ├── ProductShowcase.jsx     # Media asset carousel from backend
    ├── Payments.jsx            # Razorpay-style payment cards from backend
    ├── Contact.jsx             # Lead capture + general enquiry tab switcher
    │
    ├── Login.jsx               # username + password → /dashboard
    ├── Signup.jsx              # username + email + password → /dashboard
    ├── Dashboard.jsx           # Protected 4-tab command center with Recharts
    └── Chatbot.jsx             # Floating AI chat assistant (FAB)
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# Clone or unzip the project
cd massivefile

# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

### Verify Backend Connectivity

Open your browser DevTools console on the running app and run:

```js
fetch('https://script.google.com/macros/s/<YOUR_SCRIPT_ID>/exec', {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify({ action: 'getProducts' })
}).then(r => r.json()).then(console.log)
```

A successful response returns `{ success: true, products: [...] }`.

---

## Backend Architecture

### Google Apps Script Endpoint

The backend is a single Google Apps Script Web App deployed as:

```
POST https://script.google.com/macros/s/<SCRIPT_ID>/exec
Content-Type: text/plain;charset=utf-8   ← bypasses CORS preflight
Body: JSON string of { action, ...payload }
```

All requests use `text/plain;charset=utf-8` as the Content-Type. This is intentional — it avoids triggering a CORS preflight OPTIONS request, which Google Apps Script does not support.

### Supported Actions

| Action | Description | Required Fields |
|---|---|---|
| `signup` | Register a new user | `username`, `email`, `password` |
| `login` | Authenticate a user | `username`, `password` |
| `getProducts` | Fetch all products | — |
| `createLead` | Submit enterprise lead form | `name`, `company`, `email`, `phone`, `interest`, `message` |
| `submitContact` | Submit general enquiry | `name`, `email`, `subject`, `message` |
| `getMediaAssets` | Fetch all media/image assets | — |
| `getPaymentLinks` | Fetch Razorpay payment link cards | — |
| `getPlatformConfig` | Fetch global platform config key-values | — |
| `chat` | Send message to AI chatbot | `message` |

### Sheet Schemas

All data lives in Google Sheets. The Apps Script reads/writes rows by exact column header name.

#### Users
```
username | password | email | role | tier
```
- `role`: `user` or `admin`
- `tier`: `customer` or `enterprise`

#### Products
```
productId | title | category | description | pricing | featured
```
- `category`: one of `Voice AI`, `Enterprise Copilot`, `RAG Systems`, `Call Center AI`, `Agent Orchestration`, `Workflow Automation`
- `featured`: `yes` or `no`

#### Leads
```
timestamp | name | company | email | phone | interest | message | status
```
- `status`: auto-set to `new` on creation

#### Contacts
```
timestamp | name | email | subject | message
```

#### MediaAssets
```
assetId | entityType | entityId | assetUrl | assetType | featured
```
- `entityType`: `hero`, `product`, `showcase`, `dashboard`, `background`
- `entityId`: links asset to a specific entity (e.g., `P001` for a product, `homepage` for hero)
- `assetType`: `image` or `video`
- `featured`: `yes` or `no`

#### PaymentLinks
```
paymentId | title | amount | paymentUrl | active
```
- `amount`: integer (INR paise or USD cents depending on your Razorpay config). Set to `0` for enterprise/custom pricing.
- `paymentUrl`: full Razorpay Payment Page URL (e.g., `https://rzp.io/l/your-link`)
- `active`: `yes` or `no`

#### PlatformConfig
```
key | value
```
Important keys:

| Key | Description | Example |
|---|---|---|
| `paymentsEnabled` | Show/hide Payments section | `true` |
| `chatbotEnabled` | Show/hide chatbot FAB | `true` |
| `demoBookingEnabled` | Enable demo booking CTA | `true` |
| `maintenanceMode` | Put site in maintenance | `false` |
| `heroHeadline` | Override hero headline text | `Enterprise AI Infrastructure...` |
| `heroSubheadline` | Override hero subheadline | `Deploy AI at scale...` |
| `featuredProduct` | Product ID to feature | `P001` |
| `supportEmail` | Support contact email | `hello@massivefile.com` |

#### ChatbotRules
```
keyword | response
```
Simple keyword-matching rules for the chatbot fallback.

---

## Frontend Architecture

### Routing

Uses `HashRouter` for maximum static hosting compatibility (no server-side routing needed).

```
/#/           → HomePage (Hero + all sections + Chatbot)
/#/login      → Login page (full screen, no navbar)
/#/signup     → Signup page (full screen, no navbar)
/#/dashboard  → Dashboard (protected — requires login)
```

### Auth & Session

Session is stored in `localStorage` with `mf_` prefixed keys to avoid collisions:

```
mf_isLoggedIn  → "true"
mf_username    → e.g. "janesmith"
mf_email       → e.g. "jane@company.com"
mf_role        → "user" | "admin"
mf_tier        → "customer" | "enterprise"
```

Key utilities in `utils.js`:

```js
saveSession({ username, email, role, tier })  // login/signup
getSession()                                  // returns session object
clearSession()                                // logout
```

`ProtectedRoute` wraps the dashboard route and redirects unauthenticated users to `/login`.

### API Layer

`api.js` exports one function per backend action. All read-only calls are memoized with an in-memory promise cache (`withCache`) so repeated component mounts don't trigger duplicate requests within the same session.

Every function has an offline-safe fallback — if the backend is unreachable, realistic demo data is returned instead of an error. This keeps the UI functional during development without a live backend.

```js
import { getProducts, createLead, signup, login, chat } from './api'
```

Helper exports for media assets:

```js
findAsset(assets, entityType, entityId)        // exact match
findFeaturedAsset(assets, entityType)          // first featured asset of type
```

### Design System

**Color Tokens** (defined in `tailwind.config.js`):

| Token | Color | Hex |
|---|---|---|
| `brand-400` | Electric Cyan | `#22d3ee` |
| `brand-500` | Cyan | `#06b6d4` |
| `brand-600` | Dark Cyan | `#0891b2` |
| `accent-400` | Soft Violet | `#a78bfa` |
| `accent-500` | Violet | `#8b5cf6` |
| `accent-600` | Dark Violet | `#7c3aed` |

**Utility Classes** (defined in `index.css`):

| Class | Purpose |
|---|---|
| `.glass` | `bg-white/[0.04] backdrop-blur-sm` — glassmorphism card base |
| `.btn-primary` | Cyan→Violet gradient button with glow-pulse animation |
| `.btn-secondary` | Ghost border button |
| `.btn-ghost` | Text-only hover button |
| `.input-field` | Dark glass form input |
| `.section-badge` | Cyan pill badge for section labels |
| `.section-badge-violet` | Violet pill badge variant |
| `.gradient-text` | Cyan→Violet text gradient |
| `.gradient-text-violet` | Violet→Cyan text gradient |
| `.animated-bg` | Animated 400% gradient background cycling deep darks |
| `.circuit-grid` | Cyan circuit-board grid overlay |
| `.dot-grid` | Radial dot pattern overlay |
| `.shimmer` | Loading skeleton shimmer animation |
| `.typing-cursor` | Blinking `|` cursor for typewriter effect |

**Shadows** (via `boxShadow` config):

```
shadow-glow-sm   → 0 0 15px rgba(34,211,238,0.2)
shadow-glow      → 0 0 30px rgba(34,211,238,0.35)
shadow-glow-lg   → 0 0 60px rgba(34,211,238,0.45)
shadow-glow-violet
shadow-glow-violet-lg
shadow-glass     → 0 8px 32px rgba(0,0,0,0.5)
```

> **Note:** Only standard Tailwind v3 opacity fractions are used in utility classes (`/5`, `/10`, `/20`, `/25`, `/30`, `/40`, `/50`, `/60`, `/70`, `/75`, `/80`, `/90`, `/95`, `/100`). Arbitrary values use bracket syntax: `bg-white/[0.04]`.

---

## Pages & Components

### `Hero.jsx`
- CMS-driven: headline and subheadline pulled from `getPlatformConfig`
- Hero image pulled from `getMediaAssets` (entityType: `hero`, entityId: `homepage`)
- Typewriter effect cycling 6 AI capability phrases
- 20 floating animated particle dots
- Stats bar: 500+ clients · 99.99% uptime · 40+ countries · <80ms latency
- Two ambient orbs + circuit grid background
- Live status badge on hero image

### `Capabilities.jsx`
- 6 static cards: Voice AI, Enterprise Copilots, RAG Systems, Agent Orchestration, Workflow Automation, Call Center AI
- Tag chips per capability
- Staggered Framer Motion entrance

### `Products.jsx`
- Dynamic: pulls from `getProducts()` backend action
- Category filter pills (auto-generated from backend data)
- Media asset per product card via `findAsset(assets, 'product', productId)`
- Featured products get `border-brand-600/40 shadow-glow` and `Featured` badge
- Skeleton loading state (6 shimmer cards)

### `UseCases.jsx`
- 6 static industry cards: Retail, FinTech, Healthcare, Telecom, Logistics, Enterprise SaaS
- Each card has: icon, industry label, title, 3 bullet points, metric badge

### `Workflow.jsx`
- 5-step deployment pipeline: Discovery → Integration → Deployment → Monitoring → Optimization
- Desktop: horizontal pipeline with arrow connectors
- Mobile: vertical stacked cards

### `ProductShowcase.jsx`
- Dynamic image carousel from `getMediaAssets` (entityType: `showcase` or `hero`)
- Prev/Next navigation buttons
- Dot indicator pills
- Label overlay using `ENTITY_LABELS` map
- Returns `null` if no showcase assets exist (component self-hides)

### `Payments.jsx`
- Dynamic payment cards from `getPaymentLinks()` (only where `active: 'yes'`)
- Card index 1 gets "Most Popular" badge and `shadow-glow` treatment
- Paid plans: `window.open(paymentUrl, '_blank', 'noopener,noreferrer')` → Razorpay
- Enterprise plans (amount=0): `scrollToSection('contact')`
- Razorpay shield trust badge on non-enterprise cards
- Controlled by `paymentsEnabled` platform config — returns `null` if disabled
- Enterprise CTA strip at bottom

### `Contact.jsx`
- Tab switcher: **Book Enterprise Demo** (creates a Lead) vs **General Enquiry** (submits Contact)
- Lead form: `name`, `company`, `email`, `phone`, `interest` (dropdown from `INTEREST_OPTIONS`), `message`
- Contact form: `name`, `email`, `subject`, `message`
- Both forms have loading state and toast feedback

### `Login.jsx`
- Fields: `username` + `password` (matches Users sheet schema exactly)
- On success: `saveSession()` then navigate to `/dashboard`

### `Signup.jsx`
- Fields: `username` + `email` + `password` (matches Users sheet schema exactly)
- Password minimum 8 characters
- On success: `saveSession()` then navigate to `/dashboard`

### `Dashboard.jsx`
- Protected — requires authentication via `ProtectedRoute`
- 4 tabs: **Overview**, **Products**, **Payments**, **Config**
- Overview: Area chart (API calls 30d), Bar chart (response latency), Pie chart (product usage breakdown)
- Products tab: live table of all products with title, category, pricing, featured status
- Payments tab: table of payment links with direct open-link button
- Config tab: key/value config table with color-coded `true`/`false` values
- Displays `username` and `tier` from session

### `Chatbot.jsx`
- Floating action button (bottom-right)
- Controlled by `chatbotEnabled` platform config
- Suggested prompt chips on open
- Sends `{ action: 'chat', message }` to backend
- Reset button clears conversation history

### `Navbar.jsx`
- Scroll-aware: adds glass + border after 20px scroll
- Mobile: slide-in drawer from right with backdrop overlay
- Shows username in top-right when logged in
- Logout clears session and redirects to home

---

## CMS-Driven Content

The following content is loaded dynamically from the backend (no code changes needed to update):

| Content | Backend Action | Sheet |
|---|---|---|
| Hero headline & subheadline | `getPlatformConfig` | PlatformConfig |
| Hero image | `getMediaAssets` | MediaAssets |
| All product cards | `getProducts` | Products |
| Product images | `getMediaAssets` | MediaAssets |
| Showcase carousel | `getMediaAssets` | MediaAssets |
| Payment cards & pricing | `getPaymentLinks` | PaymentLinks |
| Chatbot responses | `chat` | ChatbotRules |
| Feature flags (payments, chatbot, etc.) | `getPlatformConfig` | PlatformConfig |

---

## Payments Integration

Payments use **Razorpay Payment Links** — no SDK integration required.

1. Create payment links at [razorpay.com/payment-links](https://razorpay.com/payment-links)
2. Copy the link URL (e.g., `https://rzp.io/l/your-link-name`)
3. Add a row to the `PaymentLinks` sheet: `paymentId | title | amount | paymentUrl | active`
4. Set `active` to `yes`

When a user clicks **Book Now**, the app calls `window.open(paymentUrl, '_blank', 'noopener,noreferrer')`, opening the Razorpay-hosted payment page in a new tab. No payment processing happens on the Massive frontend.

For enterprise/custom plans, set `amount` to `0` — the button will scroll to the Contact section instead.

---

## Environment & Configuration

All configuration lives in `src/config.js`. No `.env` file is required — the backend URL is a public Google Apps Script endpoint.

```js
// src/config.js
export const API_URL = 'https://script.google.com/macros/s/<SCRIPT_ID>/exec'
export const COMPANY_NAME = 'Massive'
export const COMPANY_EMAIL = 'hello@massivefile.com'
```

To update the backend URL (e.g., after redeploying your Apps Script), edit `API_URL` in `config.js`.

---

## Deployment

### Vercel / Netlify (recommended)

```bash
npm run build
# Upload the dist/ folder or connect your repo
```

Both Vercel and Netlify handle SPA routing automatically. Since the app uses `HashRouter`, no special redirect rules are needed.

### GitHub Pages

```bash
# In vite.config.js, set base to your repo name if needed:
# base: '/massivefile/'

npm run build
# Deploy dist/ to the gh-pages branch
```

### Firebase Hosting

```bash
firebase init hosting   # set public dir to dist, configure as SPA
npm run build
firebase deploy
```

---

## License

Private — all rights reserved. © Massive AI Infrastructure.

# Next Pizza — Multilingual Pizza Shop (Portfolio)

> 🇷🇴 [Citește versiunea în română → README.ro.md](./README.ro.md)

A full-stack pizza catalog built with **Next.js App Router**, **TypeScript**, **Prisma**, and **PostgreSQL**. The project focuses on a realistic e-commerce flow: multilingual UI, URL-driven filters, server-side data fetching, and a **Feature-Sliced Design (FSD)** codebase suitable for team-scale frontends.

> **Status:** Work in progress (MVP catalog). Suitable as a portfolio piece demonstrating architecture, not a production storefront yet.

| | |
|---|---|
| **Live demo** | [pizza-gamma-eight.vercel.app](https://pizza-gamma-eight.vercel.app/en) — also [RO](https://pizza-gamma-eight.vercel.app/ro) · [RU](https://pizza-gamma-eight.vercel.app/ru) |
| **Repository** | [github.com/dorincreciun/pizza](https://github.com/dorincreciun/pizza) |

The live app shows the full catalog flow: localized category bar, sidebar filters (crust / size / ingredients), product grid with MDL prices, and pagination — e.g. [Russian catalog](https://pizza-gamma-eight.vercel.app/ru) with filters and 12 pages of products.

---

## Table of contents

- [Overview](#overview)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [What's implemented](#whats-implemented)
- [What I built myself](#what-i-built-myself)
- [Where AI helped and why](#where-ai-helped-and-why)
- [Roadmap](#roadmap)
- [Design & product decisions](#design--product-decisions)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)

---

## Overview

**Next Pizza** is a learning/portfolio project: a pizza delivery storefront where users browse categories, filter products, paginate results, switch language (EN / RO / RU), and open product detail pages with size, crust, and optional add-ons.

The app separates **Next.js routing** (`app/`) from **business UI** (`src/` layers), uses **server components** for catalog data, and keeps interactive state (filters, categories, pagination) in the **URL** so views are shareable and bookmarkable.

---

## Tech stack

| Area | Technology |
|------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript (strict) |
| UI | React 19, [Tailwind CSS 4](https://tailwindcss.com) |
| Components | Custom design system (`shared/ui`) — CVA, compound components |
| i18n | [next-intl](https://next-intl-docs.vercel.app) — localized routes + messages |
| Database | PostgreSQL + [Prisma 7](https://www.prisma.io) (`@prisma/adapter-pg`) |
| Forms (planned) | react-hook-form |
| Carousel (detail) | Swiper |
| Icons | Lucide React |
| Tooling | ESLint, tsx (seed), dotenv |

---

## Architecture

The `src/` folder follows **[Feature-Sliced Design](https://feature-sliced.design/)**:

```
src/
├── app/          # Global styles (Next entry styles live here)
├── pages/        # Page compositions (catalog, product detail, orders)
├── widgets/      # Large UI blocks (header, categories, product list, pagination)
├── features/     # User actions (filters, category toggle, language, sign-in)
├── entities/     # Domain: product, category, ingredient, user
└── shared/       # UI kit, config, i18n, Prisma client, hooks, utils
```

**Principles applied:**

- **Import rule:** upper layers import only from layers below (`pages` → `widgets` → `features` → `entities` → `shared`).
- **Public API:** each slice exposes a narrow `index.ts` (named exports, no wildcards in slice roots).
- **Cross-entity imports:** `@x/product` notation (e.g. `ingredient` types for `product` mappers).
- **App layer (`app/`):** Next.js routes, layouts, parallel routes for modals — standard for Next + FSD hybrids.

**Routing:**

- Locale prefix: `/[locale]/…`
- Localized pathnames (e.g. `/products/[id]` → `/produse/[id]` → `/produkty/[id]`)
- Intercepting routes for auth modals (`@modals`)

---

## What's implemented

### Catalog (home)

- [x] Product grid with cards (image, name, short description, price)
- [x] **Categories** with priority navigation (overflow → “More” dropdown)
- [x] Category filter in URL (`categoryId`, virtual “All”)
- [x] **Sidebar filters:** sizes, crusts, ingredients — toggle updates URL immediately
- [x] **Pagination** (`page` query param, prev/next, page window)
- [x] Server-side filtering & pagination via Prisma

### Product detail

- [x] Dynamic route with localized URLs
- [x] Size & crust selectors (`SegmentedControl`)
- [x] Optional add-ons carousel (`IngredientSelect` + Swiper)
- [x] Data loaded on server (`getProduct`) with locale-aware translations

### Global UX

- [x] **i18n:** English, Romanian, Russian (`messages/{locale}/*.json`)
- [x] Language switcher preserves query params (filters, page)
- [x] Sticky header with scroll shrink
- [x] Sign-in / sign-up (password, JWT session cookie; demo user in seed)
- [x] **Cart** (Zustand, persisted) + **checkout** creates `Order` in Prisma
- [x] **My orders** (`/orders` / `/comenzi` / `/zakazy`) — auth-gated list
- [x] **Builder** intercepting modal + hard route `/builder/[id]`

### Data layer

- [x] Prisma schema: categories, products, variants (size/crust), ingredients, translations, users, orders (schema ready)
- [x] Seed script (~120 products, categories, ingredients, images from `public/imgs`)
- [x] Mappers: DB rows → domain models → UI

### UI kit (`shared/ui`)

- [x] Button, Checkbox, Input, Modal, Dropdown, Title, Container
- [x] `PriorityNavigation` (measurement-based overflow)
- [x] `SegmentedControl`, `ProductCard` (compound)

---

## Roadmap

Planned next steps (not implemented yet):

- [ ] **Payments** — no Stripe/card flow; checkout stores the order as `PENDING`
- [ ] **Auth OTP email** — current flow is email + password
- [ ] **Tests** — unit tests for mappers/filters, e2e for catalog flow
- [x] **Deploy** — [Vercel](https://pizza-gamma-eight.vercel.app/en) + managed PostgreSQL
- [x] **CI** — lint + typecheck on push (GitHub Actions)
- [ ] **`useUpdateSearchParams`** — respect current pathname (not only home) when updating query

---

## Design & product decisions

| Decision | Why |
|----------|-----|
| **URL as source of truth** for filters, category, page | Shareable links, back/forward works, aligns with server components |
| **FSD folder structure** | Clear boundaries for portfolio and future team work |
| **Server Components for lists/detail** | Less client JS, SEO-friendly catalog, data colocated with routes |
| **Separate variant matrix per product (seed)** | Size/crust filters actually narrow results (not all 6 combos on every SKU) |
| **Compound `ProductCard`** | Flexible layout without prop explosion |
| **next-intl pathnames** | SEO-friendly localized URLs, not only translated strings |
| **Custom UI kit** | Portfolio signal: CVA, accessibility patterns, no blind UI library copy-paste |

**Brand:** “Next Pizza” — demo storefront, not affiliated with any real business.

---

## What I built myself

These are the parts I designed and implemented end-to-end — I can walk through every file in an interview.

### Product & data model

- **Idea and scope:** pizza storefront MVP (catalog → detail → cart later), not a generic tutorial clone.
- **Prisma schema:** categories, products, `ProductVariant` (size + crust + price), ingredients M:N, translations per locale (`UserLanguage`), users with OTP field, orders — modeled for a real shop, not a single `products` table.
- **Seed (`prisma/seed.ts`):** ~120 products, 8 categories, 20+ ingredients, image pools from `public/imgs/`, variant price formula (size multiplier + thin crust adjustment), sauces/toppings linked per product.
- **Domain mappers:** `mapProductListItem`, `mapProductDetail`, `mapCategory`, `buildSizeOptions` / `buildCrustOptions` — DB shape separated from UI models.

### Architecture (FSD)

- Chose **Feature-Sliced Design** on purpose: `entities` / `features` / `widgets` / `pages` / `shared`.
- Defined slices: `product`, `category`, `ingredient`, `toggle-category`, `products-filter`, `categories`, `products`, `pagination`, etc.
- **Path aliases** in `tsconfig` (`@entities/*`, `@features/*`, …) and Next.js `app/` only for routing.

### UI & UX (my implementation)

- **Design system (`shared/ui`):** `Button`, `Checkbox`, `Input`, `Modal`, `Dropdown` with **CVA** variants; compound patterns (`Modal.Header`, `Checkbox.Field`).
- **`PriorityNavigation`:** custom overflow — measure visible category chips, render “More” dropdown for the rest (non-trivial layout logic).
- **`ProductCard`:** compound card (Media, MediaLink, Content, Title, Footer) integrated with **next-intl** typed routes.
- **`SegmentedControl`:** controlled options for pizza size/crust on detail page.
- **Category bar:** server fetch + client display, active state, integration with priority nav.
- **Product detail layout:** sticky image, description, size/crust/add-ons sections.
- **`IngredientSelect`:** Swiper carousel for add-ons.
- **Header:** sticky shrink on scroll (`useScrollThreshold`), logo, language + sign-in actions.
- **Intercepting modals** (`@modals`) for sign-in route structure.

### i18n & routing (my setup)

- **next-intl** with 3 locales (EN, RO, RU).
- **Localized pathnames** in `shared/config/i18n.ts` (e.g. `/products/[id]` → `/produse/[id]` → `/produkty/[id]`).
- Message files structure: `messages/{locale}/features.json`, `widgets.json`, `pages.json`, `shared.json`.
- **URL-driven state:** decided that `categoryId`, `sizes`, `crusts`, `ingredients`, `page` live in query string — shareable catalog views.

### Hooks & features (started by me)

- `useUpdateSearchParams` — central hook to mutate catalog query without losing other params.
- `useCategory` / `toggle-category` feature — category switch clears `page`, virtual “All” category.
- `use-language-selector` — locale switch (I hit edge cases here; see AI section below).

### Deploy

- Deployed to **Vercel** with production PostgreSQL; public demo: [pizza-gamma-eight.vercel.app](https://pizza-gamma-eight.vercel.app/en).

---

## Where AI helped and why

I use **Cursor / LLM** as a **pair-programmer**, not as a substitute for understanding. Below is an honest split: what I asked AI to do, and why.

### 1. FSD audit & refactor (architecture)

**What I did:** layered structure and slices.  
**What AI did:** compared the repo to [Feature-Sliced Design docs](https://feature-sliced.design/), flagged violations, applied fixes.

| Issue found | Fix (with AI) | Why AI here |
|-------------|---------------|-------------|
| `entities/category` mixed `category.model.ts` / mapper in `model/` | Consolidated to `model/types.ts` + `api/mapper.ts` | Repetitive move across slices — faster with AI |
| `ALL_CATEGORY_ID` in `entities/category` | Moved to `features/toggle-category` (UI sentinel, not DB) | Cross-layer import rule — needed a second opinion |
| `widgets/categories` re-exported `useCategory` | Removed leak; import feature from widget only | Easy to miss in public API review |
| Wrong `@x` folder (`ingredient/@x/index.ts`) | Renamed to `@x/product.ts` per FSD cross-import spec | Spec detail I wanted correct for portfolio |
| `export *` in slice `index.ts` files | Named exports only | Documented FSD best practice |

**Why:** I wanted the portfolio repo to pass a senior “folder hygiene” check, not only “it runs.”

### 2. Catalog filters & pagination (feature completion)

**What I did:** filter UI, checkbox groups, idea of URL params `sizes` / `crusts` / `ingredients`.  
**What AI did:** finished `useFilter` (toggle → immediate URL update), `filter-params.ts`, wired `getProducts` Prisma `where` for variants + ingredients, ported pagination widget from an older project and adapted it to `useUpdateSearchParams`.

**Also with AI:** seed fix — each product gets a **random subset of variants** (2–6), so size/crust filters actually narrow the list (before, every product had all 6 combos → filter looked “broken”).

**Why:** Prisma `variants: { some: { AND: [...] } }` and CSV query encoding are easy to get wrong; AI sped up the last 20% after I had the UX working.

### 3. next-intl & navigation bugs

**What I did:** full i18n setup, language selector UI, parallel `@modals` routes.  
**What AI did:**

- Fixed `next.config.ts` path → `./src/shared/lib/i18n/request.ts` (was pointing to a non-existent folder).
- Fixed **language switch dropping filters** — `router.replace` now passes current `query` so `categoryId` / `sizes` / `page` survive locale change.
- Debugged **`Insufficient params`** when `catchAll` modal route shadowed `[id]` on product pages — `resolveParamsForTemplate` helper.

**Why:** These are framework-specific edge cases; I understood the bug, AI helped find the minimal fix faster.

### 4. i18n copy & README

**What I did:** Russian/RO/EN product copy in DB seed; UI still had hardcoded strings in places.  
**What AI did:** added `messages/*` keys for catalog title, filter labels, detail section titles, header tagline, sign-in modal; connected components to `getTranslations` / `useTranslations`.

**What AI did for this README:** structure, bilingual drafts, deployment link — **I review and own the final text** (including this “who did what” section).

**Why:** Repetitive JSON + wiring is low learning value; I focused time on schema and components instead.

### 5. What I did **not** outsource to AI

- Choosing **Next 16 + Prisma + FSD** stack.
- **Schema design** and business meaning of variants, translations, orders.
- **PriorityNavigation** and **ProductCard** architecture.
- **Deploy** and env configuration on Vercel.
- Deciding what stays **out of scope** for MVP (cart, auth, checkout).

### How to read this in an interview

> “I built the domain model, UI kit, and catalog UX myself. I used AI like a senior reviewer for FSD compliance, for finishing filter/query plumbing, and for next-intl gotchas — but I can explain and change any of that code without AI.”

That matches how I actually work: **AI for speed and review; I keep ownership of architecture and product decisions.**

---

## Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or cloud)

### Setup

```bash
# Clone and install
git clone https://github.com/dorincreciun/pizza.git
cd pizza
npm install

# Environment
cp .env.example .env
# Edit DATABASE_URL in .env

# Database
npm run db:migrate
npm run db:seed

# Dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — default locale is `en` (e.g. `/en`).

### Seed assets

Place pizza and sauce images in `public/imgs/`:

- `pizza-*.webp` (or similar) — product photos  
- `sos-*.webp` — ingredient/sauce images  

The seed script expects these prefixes (see `prisma/seed.ts`).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Prisma migrate dev |
| `npm run db:seed` | Seed database |
| `npm run db:dev` | Prisma local dev (if configured) |

---

## Project structure

```
pizza/
├── app/(routing)/[locale]/     # Next.js pages & parallel modals
├── messages/                   # en, ro, ru — features, pages, widgets, shared
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/imgs/                # Product & ingredient images
├── src/
│   ├── entities/               # product, category, ingredient, user
│   ├── features/               # products-filter, toggle-category, select-language, …
│   ├── pages/                  # product-listing, product-detail, my-orders
│   ├── widgets/                # header, categories, products, pagination, …
│   └── shared/                 # ui, lib, config, utils, layouts
├── next.config.ts
└── package.json
```

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |

See `.env.example`.

---

## License

Private portfolio project — all rights reserved unless stated otherwise.

---

**Author:** _Your name_  
**Contact:** _LinkedIn / email_

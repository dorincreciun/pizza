# Next Pizza — Magazin de pizza multilingv (portofoliu)

> 🇬🇧 [Read the English version → README.md](./README.md)

Aplicație full-stack de tip catalog pizza, construită cu **Next.js App Router**, **TypeScript**, **Prisma** și **PostgreSQL**. Proiectul pune accent pe flux real de e-commerce: UI multilingv, filtre în URL, încărcare date pe server și arhitectură **Feature-Sliced Design (FSD)** potrivită pentru echipe frontend.

> **Status:** În dezvoltare (MVP catalog). Potrivit ca proiect de portofoliu pentru arhitectură, nu încă magazin de producție.

| | |
|---|---|
| **Demo live** | [pizza-gamma-eight.vercel.app](https://pizza-gamma-eight.vercel.app/ro) — și [EN](https://pizza-gamma-eight.vercel.app/en) · [RU](https://pizza-gamma-eight.vercel.app/ru) |
| **Repository** | [github.com/dorincreciun/pizza](https://github.com/dorincreciun/pizza) |

În demo vezi fluxul complet: bară de categorii localizată, filtre laterale (aluat / mărime / ingrediente), grid de produse cu preț în MDL și paginare — ex. [catalog în rusă](https://pizza-gamma-eight.vercel.app/ru) cu 12 pagini de produse.

---

## Cuprins

- [Prezentare](#prezentare)
- [Tehnologii](#tehnologii)
- [Arhitectură](#arhitectură)
- [Ce este implementat](#ce-este-implementat)
- [Ce am construit eu](#ce-am-construit-eu)
- [Unde am folosit AI și de ce](#unde-am-folosit-ai-și-de-ce)
- [Ce urmează](#ce-urmează)
- [Decizii de design](#decizii-de-design)
- [Pornire locală](#pornire-locală)
- [Scripturi](#scripturi)
- [Structura proiectului](#structura-proiectului)
- [Variabile de mediu](#variabile-de-mediu)

---

## Prezentare

**Next Pizza** este un proiect de învățare/portofoliu: vitrină pentru livrare pizza unde utilizatorul navighează categorii, filtrează produse, folosește paginare, schimbă limba (EN / RO / RU) și deschide pagini de detaliu cu mărime, aluat și extra-opționale.

Aplicația separă **rutele Next.js** (`app/`) de **UI-ul de business** (straturile din `src/`), folosește **Server Components** pentru datele din catalog și păstrează starea interactivă (filtre, categorii, paginare) în **URL**, astfel încât linkurile sunt partajabile.

---

## Tehnologii

| Zonă | Tehnologie |
|------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Limbaj | TypeScript (strict) |
| UI | React 19, [Tailwind CSS 4](https://tailwindcss.com) |
| Componente | Design system propriu (`shared/ui`) — CVA, componente compuse |
| i18n | [next-intl](https://next-intl-docs.vercel.app) — rute + mesaje localizate |
| Bază de date | PostgreSQL + [Prisma 7](https://www.prisma.io) (`@prisma/adapter-pg`) |
| Formulare (planificat) | react-hook-form |
| Carousel (detaliu) | Swiper |
| Iconițe | Lucide React |
| Tooling | ESLint, tsx (seed), dotenv |

---

## Arhitectură

Folderul `src/` urmează **[Feature-Sliced Design](https://feature-sliced.design/)**:

```
src/
├── app/          # Stiluri globale
├── pages/        # Compunere pagini (catalog, detaliu, comenzi)
├── widgets/      # Blocuri UI mari (header, categorii, listă, paginare)
├── features/     # Acțiuni utilizator (filtre, categorie, limbă, autentificare)
├── entities/     # Domeniu: product, category, ingredient, user
└── shared/       # UI kit, config, i18n, Prisma, hooks, utils
```

**Principii aplicate:**

- **Regula importurilor:** un strat importă doar din straturile de dedesubt.
- **API public:** fiecare slice expune `index.ts` cu exporturi explicite.
- **Cross-import între entități:** notația `@x/product` (ex. tipuri `ingredient` pentru `product`).
- **Strat `app/`:** rute Next.js, layout-uri, rute paralele pentru modale.

**Rute:**

- Prefix locale: `/[locale]/…`
- Pathnames localizate (ex. `/produse/[id]` pentru RO)
- Intercepting routes pentru modale auth (`@modals`)

---

## Ce este implementat

### Catalog (pagina principală)

- [x] Grid de produse (imagine, nume, descriere scurtă, preț)
- [x] **Categorii** cu priority navigation (overflow → dropdown „Mai mult”)
- [x] Filtru categorie în URL (`categoryId`, opțiune virtuală „Toate”)
- [x] **Filtre laterale:** mărimi, aluat, ingrediente — actualizare URL la click
- [x] **Paginare** (parametru `page`, prev/next, fereastră de pagini)
- [x] Filtrare și paginare pe server (Prisma)

### Detaliu produs

- [x] Rută dinamică cu URL-uri localizate
- [x] Selectoare mărime și aluat (`SegmentedControl`)
- [x] Carousel extra-opționale (`IngredientSelect` + Swiper)
- [x] Date pe server (`getProduct`) cu traduceri pe locale

### UX global

- [x] **i18n:** engleză, română, rusă (`messages/{locale}/*.json`)
- [x] Schimbarea limbii păstrează query params (filtre, pagină)
- [x] Header sticky cu efect la scroll
- [x] Shell modal autentificare (doar UI)

### Strat de date

- [x] Schema Prisma: categorii, produse, variante, ingrediente, traduceri, utilizatori, comenzi (schema pregătită)
- [x] Seed (~120 produse, categorii, ingrediente, imagini din `public/imgs`)
- [x] Mappers: DB → modele de domeniu → UI

### UI kit (`shared/ui`)

- [x] Button, Checkbox, Input, Modal, Dropdown, Title, Container
- [x] `PriorityNavigation` (overflow pe baza de măsurare)
- [x] `SegmentedControl`, `ProductCard` (compus)

---

## Ce urmează

Pași planificați (încă neimplementați):

- [ ] **Coș și checkout** — stare coș, creare comandă (modelul `Order` există în schema)
- [ ] **Autentificare** — OTP pe email (`User.otpCode`), modal verify
- [ ] **Detaliu produs** — preț dinamic la schimbarea mărimii/aluatului
- [ ] **Adaugă în coș** pe listă și detaliu
- [ ] Stări de încărcare / listă goală pentru filtre
- [ ] Pagina **Comenzile mele**
- [ ] Modal **builder** pizza (stub de rută existent)
- [ ] **Teste** — unitare (mappers/filtre), e2e (flux catalog)
- [ ] **Deploy** — Vercel + Postgres gestionat, CI
- [ ] **`useUpdateSearchParams`** — păstrare pathname curent (nu doar home)

---

## Decizii de design

| Decizie | Motiv |
|---------|--------|
| **URL ca sursă de adevăr** pentru filtre, categorie, pagină | Linkuri partajabile, back/forward, potrivit pentru Server Components |
| **Structură FSD** | Limite clare pentru portofoliu și lucru în echipă |
| **Server Components pentru listă/detaliu** | Mai puțin JS pe client, catalog prietenos SEO |
| **Variante parțiale per produs (seed)** | Filtrele size/crust reduc efectiv lista |
| **`ProductCard` compus** | Layout flexibil fără zeci de props |
| **Pathnames next-intl** | URL-uri localizate, nu doar texte traduse |
| **UI kit propriu** | Demonstrează CVA, accesibilitate, nu doar copy din biblioteci |

**Brand:** „Next Pizza” — demo, fără legătură cu un business real.

---

## Cum am folosit AI

Proiectul este construit **în principal de mine**, cu **asistenți AI (Cursor / LLM)** ca instrument de **pair-programming** — similar cu documentația, Stack Overflow sau review de la un coleg.

| Zonă | Eu | Asistență AI |
|------|-----|----------------|
| Ideea și scope-ul MVP | ✓ | Sugestii de prioritizare |
| Schema Prisma și seed | ✓ | Structură seed, prețuri variante |
| Structură FSD și refactor | ✓ | Audit FSD, încălcări layer, `@x` |
| Setup next-intl | ✓ | Debug rute dinamice, query la schimbare limbă |
| Filtre și paginare | ✓ | Pattern-uri hook, `where` Prisma |
| Componente UI | ✓ | CVA, componente compuse |
| Traduceri | ✓ | Draft i18n, revizuit de mine |
| README | ✓ | Structură bilingvă, text final al meu |

**De ce AI?**

- Iterație mai rapidă pe cod repetitiv (mappers, tipuri, UI)
- A doua opinie pe arhitectură (reguli FSD, API public)
- Debug la capcane framework (next-intl + parallel routes)

**Ce rămâne la mine:** structura finală, ce intră în repo, compromisurile și capacitatea de a explica totul la interviu.

---

## Pornire locală

### Cerințe

- Node.js 20+
- PostgreSQL (local sau cloud)

### Instalare

```bash
git clone https://github.com/dorincreciun/pizza.git
cd pizza
npm install

cp .env.example .env
# Completează DATABASE_URL în .env

npm run db:migrate
npm run db:seed

npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000) — locale implicit `en` (ex. `/en`).

### Imagini pentru seed

Pune în `public/imgs/`:

- `pizza-*` — poze produse  
- `sos-*` — poze sosuri/ingrediente  

Vezi `prisma/seed.ts` pentru detalii.

---

## Scripturi

| Comandă | Descriere |
|---------|-----------|
| `npm run dev` | Server de dezvoltare |
| `npm run build` | Build producție |
| `npm run start` | Server producție |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Migrări Prisma |
| `npm run db:seed` | Populare bază de date |
| `npm run db:dev` | Prisma dev local (dacă e configurat) |

---

## Structura proiectului

```
pizza/
├── app/(routing)/[locale]/     # Pagini Next.js și modale paralele
├── messages/                   # en, ro, ru
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/imgs/
├── src/
│   ├── entities/
│   ├── features/
│   ├── pages/
│   ├── widgets/
│   └── shared/
├── next.config.ts
└── package.json
```

---

## Variabile de mediu

| Variabilă | Descriere |
|-----------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL |

Vezi `.env.example`.

---

## Licență

Proiect privat de portofoliu — drepturile rezervate, dacă nu se specifică altfel.

---

**Autor:** _Numele tău_  
**Contact:** _LinkedIn / email_

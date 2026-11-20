# 🚀 Cloud & DevOps Club Website

A production-ready, high-performance website engineered for university technical clubs focused on **Cloud Computing, Computer Networking, Systems Engineering, and modern DevOps practices**.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and containerized with **Docker** & **GitHub Actions CI**.

---

## 🌟 Key Features

### 🖥️ Core Pages
- **Home (`/`)**: High-impact developer hero with an interactive terminal simulator (`curl -sSL ...`), live stats bar, core pillars, upcoming event highlights, and recruitment callouts.
- **About (`/about`)**: Club mission, vision, origin story, milestone timeline, college & department affiliations, and core values.
- **Team (`/team`)**: Faculty coordinators, student president, and track leads with photos, roles, bios, badges, and social links (GitHub & LinkedIn).
- **Events (`/events`)**:
  - Filter by status (**All**, **Upcoming**, **Past**) and category (**Workshops**, **Bootcamps**, **CTFs**, **Talks**).
  - Search by topic or keyword.
  - **1-Click "Add to Google Calendar"** integration.
  - **Instant RSVP Registration Modal** with email confirmation feedback.
- **Join / Recruitment (`/join`)**:
  - Detailed 4-stage recruitment pipeline explained.
  - Eligibility & expectations breakdown.
  - Full-featured recruitment form with track preferences, skill levels, and automated submission to `/api/join`.
- **Contact (`/contact`)**:
  - Direct community cards for Discord, WhatsApp community, and email.
  - Interactive inquiry message form connected to `/api/contact`.
  - Expandable FAQ accordion addressing common questions.

### ⚡ Pages That Make It Stand Out
- **Projects Showcase (`/projects`)**: Member-built open-source tools, campus sandbox platforms, and telemetry clusters with category filters, GitHub repo links, and live demos.
- **Learning Roadmaps (`/resources`)**: Curated paths covering:
  - 🐧 *Linux & Systems Engineering*
  - 🌐 *Computer Networking for SREs*
  - 🐳 *Containers & Docker*
  - ☸️ *Kubernetes & Cloud Orchestration*
  - 🔄 *CI/CD & GitOps Automation*

---

## 🛠️ Tech Stack & DevOps Architecture

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React + Custom SVG Brand Badges |
| **Containerization** | Multi-Stage `Dockerfile` (Alpine base, standalone output, non-root user) |
| **Local Orchestration** | `docker-compose.yml` |
| **Automation** | GitHub Actions CI (`.github/workflows/ci.yml`) |

---

## ⚙️ How to Customize in 60 Seconds

All club branding, college details, social links, and navigation items are centralized in a single configuration file:

👉 **[`src/config/site.ts`](src/config/site.ts)**

```typescript
export const siteConfig = {
  name: "Cloud & DevOps Club",
  shortName: "CDC",
  tagline: "Bridging the gap between code and infrastructure.",
  college: {
    name: "Your College / University Name",
    department: "Department of Computer Science & Engineering",
    campus: "Main Campus",
  },
  contact: {
    email: "club@yourcollege.edu",
    discord: "https://discord.gg/your-invite",
    whatsapp: "https://chat.whatsapp.com/your-group",
    linkedin: "https://linkedin.com/company/your-club",
    github: "https://github.com/your-club-org",
  },
  // ...
};
```

---

## 🚀 Getting Started

### 1. Run Locally with Node.js

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site.

### 2. Build for Production

```bash
# Generate optimized standalone bundle
npm run build

# Start production server
npm run start
```

---

## 🐳 Docker & Container Deployment

### Run with Docker Compose
```bash
docker compose up --build -d
```
The application will be accessible at [http://localhost:3000](http://localhost:3000).

### Build & Run Docker Image Standalone
```bash
docker build -t devops-club-portal:latest .
docker run -p 3000:3000 devops-club-portal:latest
```

---

## ✅ Before Deploying: Required Configuration

| Variable | When | Required | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **build time** | Yes, for SEO | Public origin, e.g. `https://your-domain.example`. No default on purpose. |
| `ADMIN_SECRET_KEY` | runtime | **Yes, security** | Admin password and cookie-signing key. If unset the code falls back to hardcoded development values that are public in this repository, so the admin area is NOT secure without it. Use a long random value. |
| `DATABASE_URL` | build and runtime | Yes | Prisma connection string (SQLite file or PostgreSQL). Back it with a persistent volume or managed database. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | build time | Optional | Enables the Cloudflare Turnstile widget on forms. |

Notes:

- `NEXT_PUBLIC_*` values are compiled into the bundle, so pass them to the Docker build (for example as build args),
  not only to the running container.
- Without `NEXT_PUBLIC_SITE_URL` the build still succeeds, but the sitemap is empty, canonical links and the
  `sitemap:` line in `robots.txt` are omitted, and the social image URL falls back to localhost.
- Turnstile tokens are collected by the forms but are not currently verified on the server.

## 🔎 SEO & Social Sharing

- Per-page metadata lives in each route's `page.tsx` (`pageMetadata()` in `src/lib/seo.ts`).
- `robots.txt` only blocks `/api/`. `/admin` is deliberately **not** disallowed: crawlers must be able to fetch it to
  see its `noindex` (page metadata and `X-Robots-Tag` header), otherwise the bare URL could still be indexed.
  `/admin` is also excluded from the sitemap. None of this is access control; the admin login protects it.
- Structured data (Organization, WebSite, Event) is built in `src/lib/structured-data.ts`. Event data is **off**
  (`seo.publishEventStructuredData: false` in `src/config/site.ts`) until the listed events are verified real. The
  builder is kept for future events.
- The social card is generated by `src/app/opengraph-image.tsx` (fonts in `src/app/_og/`).

## 📁 Project Structure

```text
├── .github/workflows/
│   └── ci.yml               # Automated CI test & Docker build check
├── public/                  # Static assets & favicon
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── about/page.tsx   # About & Mission
│   │   ├── api/             # API routes (/api/join, /api/contact)
│   │   ├── contact/page.tsx # Contact & FAQs
│   │   ├── events/page.tsx  # Events & Workshops
│   │   ├── join/page.tsx    # Recruitment Application
│   │   ├── projects/page.tsx# Projects Showcase
│   │   ├── resources/page.tsx# Curated Learning Roadmaps
│   │   ├── team/page.tsx    # Faculty & Core Team
│   │   ├── layout.tsx       # Root Layout (Nav, Footer, Theme)
│   │   ├── page.tsx         # Home Landing Page
│   │   └── globals.css      # Tailwind v4 theme & global styles
│   ├── components/          # Reusable UI components
│   │   ├── EventCard.tsx
│   │   ├── EventRegisterModal.tsx
│   │   ├── Footer.tsx
│   │   ├── Icons.tsx
│   │   ├── Navbar.tsx
│   │   └── TerminalHero.tsx
│   ├── config/
│   │   └── site.ts          # Central site configuration
│   ├── data/                # Typed mock datasets (events, team, projects, roadmaps, faqs)
│   └── types/               # TypeScript interfaces
├── Dockerfile               # Multi-stage production container
├── docker-compose.yml       # Local container runner
└── next.config.ts           # Standalone Next.js configuration
```

---

## 🗺️ Next Phases Roadmap

1. **Phase 2 (Database & Auth)**:
   - Connect PostgreSQL or Supabase to persist recruitment submissions and attendee registrations.
   - Add admin authentication with role-based access for core leads.
2. **Phase 3 (Admin Panel & CMS)**:
   - Lightweight dashboard to publish events and update announcements without touching code.
3. **Phase 4 (Automated Certificate Generation)**:
   - Generate dynamic SVG/PDF participation certificates for event attendees.

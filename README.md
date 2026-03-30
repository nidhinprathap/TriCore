# TriCore Events

A CMS-driven event management platform with a public website, participant registration with payments, and a role-based admin portal.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT + bcrypt, Google OAuth |
| Payments | Razorpay |
| Validation | Zod |
| Image Processing | Sharp, Multer |
| Email | Nodemailer (SMTP / Brevo / SendGrid) |
| Icons | Lucide React |

---

## Prerequisites

### macOS

| Tool | Install |
|------|---------|
| Node.js 18+ | `brew install node` or [nodejs.org](https://nodejs.org) |
| Docker Desktop | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/) |
| Git | `brew install git` |

### Windows

| Tool | Install |
|------|---------|
| Node.js 18+ | Download LTS from [nodejs.org](https://nodejs.org) (includes npm) |
| Docker Desktop | Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/) — enable WSL 2 backend during install |
| Git | Download from [git-scm.com](https://git-scm.com/download/win) |
| Windows Terminal | Recommended — install from Microsoft Store |

**Windows-specific notes:**
- During Node.js install, check "Automatically install necessary tools" (installs build tools for native modules like `bcrypt` and `sharp`)
- Docker Desktop requires WSL 2 — Windows will prompt to enable it. Restart after enabling.
- If `bcrypt` or `sharp` fails to install, run `npm install --build-from-source` or install Visual Studio Build Tools: `npm install -g windows-build-tools`
- Use PowerShell or Git Bash (not CMD) for all terminal commands

### Linux (Ubuntu/Debian)

```bash
# Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Docker
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER  # then log out & back in

# Git
sudo apt install -y git
```

---

## Quick Start

### macOS / Linux

```bash
# 1. Clone & install
git clone https://github.com/nidhinprathap/TriCore.git
cd tricore
npm install

# 2. Create .env
cp .env.example .env

# 3. Start MongoDB
docker compose up -d

# 4. Seed database
cd server && npm run seed && cd ..

# 5. Start dev servers
npm run dev
```

### Windows (PowerShell)

```powershell
# 1. Clone & install
git clone https://github.com/nidhinprathap/TriCore.git
cd tricore
npm install

# 2. Create .env
copy .env.example .env

# 3. Start MongoDB (Docker Desktop must be running)
docker compose up -d

# 4. Seed database
cd server
npm run seed
cd ..

# 5. Start dev servers
npm run dev
```

### VS Code (any OS)

1. Open the project folder in VS Code
2. `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) → "Run Task" → **"First Time Setup"**
3. After setup completes: `Ctrl+Shift+B` (or `Cmd+Shift+B`) to start everything

---

## Running the App

**VS Code:** `Ctrl+Shift+B` / `Cmd+Shift+B` (starts MongoDB + Express + Vite)

**Terminal:**
```bash
docker compose up -d    # Start MongoDB
npm run dev             # Start Express + Vite
```

### URLs

| | URL |
|---|---|
| **Public Site** | http://localhost:8074 |
| **Admin Portal** | http://localhost:8074/admin/login |
| **API Health** | http://localhost:8073/api/health |

### Default Admin Credentials

```
Email:    admin@tricore.in
Password: Admin@123
```

---

## Project Structure

```
tricore/
├── client/                       # React frontend (Vite)
│   └── src/
│       ├── api/                  # Axios API wrappers (8 files)
│       ├── components/
│       │   ├── ui/               # Design system (Button, Card, Badge, Modal, etc.)
│       │   ├── layout/           # Navbar, Footer, AdminLayout, ProtectedRoute
│       │   ├── sections/         # Public page section renderers (12)
│       │   └── admin/editors/    # CMS section editors (11)
│       ├── context/              # Auth, SiteSettings, Theme providers
│       ├── hooks/                # usePageContent, useEvents
│       ├── utils/                # Fallback content
│       └── pages/
│           ├── public/           # 10 public pages
│           └── admin/            # 16 admin pages
│
├── server/                       # Express backend
│   └── src/
│       ├── config/               # DB, env, CORS
│       ├── models/               # 9 Mongoose models
│       ├── controllers/          # 11 route handlers
│       ├── routes/               # 7 route files
│       ├── middleware/            # Auth, roleGuard, validate, errorHandler
│       ├── validators/           # 6 Zod schema files
│       ├── services/             # Payment, upload, email
│       └── utils/                # Seed, pagination, holidays
│
├── docker-compose.yml            # MongoDB container
├── .vscode/                      # Launch & task configs
├── design-preview/               # Pencil designs + HTML previews + PDFs
└── docs/                         # Architecture, schema, design system, API reference
```

---

## Features

### Public Website
- CMS-driven pages (Hero, Services, Events, Testimonials, FAQ, Contact)
- Event listing with category filters and pagination
- Event detail with tabs (Overview, Schedule, Rules, Prizes, Sponsors)
- User registration (email/password + Google OAuth)
- Event registration with Razorpay payment checkout
- User dashboard with registration tracking and "Pay Now" for pending payments
- Responsive design with Space Grotesk font and gold accent theme

### Admin Portal
- **Dashboard** — Stats cards (events, registrations, revenue), recent activity
- **Pages** — Visual CMS editor with 11 section-specific editors (not raw JSON)
- **Events** — Create, edit, publish events with cover image upload
- **Sport Items** — Manage activities within events (individual/team/group types)
- **Registrations** — View, approve/reject, detail drill-down, CSV export
- **Payments** — Revenue stats, payment status filters, paginated list
- **Calendar** — Smart calendar with IPL, ISL, PKL schedules + Indian holidays
- **Testimonials** — CRUD with approval workflow
- **Media Library** — Image upload with Sharp processing, copy URL, delete
- **Users & Roles** — 6 admin roles with create/edit/disable
- **Integrations** — Configure Razorpay, Google OAuth, Email (SMTP/Brevo/SendGrid), SMS (Twilio/MSG91), WhatsApp (Meta/Twilio/Gupshup)
- **Site Settings** — Branding, theme colors with preview picker, contact info

### Design System
- Centralized theme in `client/src/index.css` — single file for all design tokens
- Colors, typography (13 sizes), spacing (15 tokens), shadows, z-index, transitions
- Admin can override theme colors from Settings panel (stored in DB, applied at runtime)
- CSS animations: fade-in-up, scale-up, gold glow hover, backdrop blur on scroll
- Code-split with React.lazy (54+ chunks, ~240KB main bundle)
- `prefers-reduced-motion` respected

### Security
- JWT authentication with role-based access control (6 roles)
- Zod validation on ALL write endpoints (no raw `req.body` anywhere)
- Rate limiting on auth endpoints (10 req / 15 min)
- Atomic registration capacity checks (no race conditions)
- Payment + registration ownership verification
- Filename sanitization on uploads (path traversal prevention)
- Error boundary for React crash recovery
- Production env var validation at startup

### Smart Calendar
- TriCore events (gold) — clickable, opens event editor
- Indian public holidays (red) — 19 gazetted holidays
- IPL 2026 schedule (purple) — 24 matches with venues
- ISL 2025-26 (blue) — 7 matches
- PKL 2026 (green) — 7 matches
- Registration deadlines (orange)
- Toggle each feed on/off, sync button with timestamp

### Email
- Registration confirmation emails (auto-sent on signup)
- Status update emails (approved/rejected/waitlisted)
- Supports SMTP, Brevo, and SendGrid (configured from admin panel)
- Graceful fallback — if email not configured, logs to console instead of crashing

---

## Admin Roles

| Role | Access |
|------|--------|
| `admin` | Full access to everything |
| `event_manager` | Events, sport items, registrations |
| `sports_coordinator` | Sport items within events |
| `registration_manager` | Registrations, payments |
| `finance` | Payments, revenue reports |
| `content_editor` | Pages, testimonials, media |

---

## API Endpoints

### Public
- `GET /api/content/settings` — Site settings (theme, nav, footer)
- `GET /api/content/pages/:slug` — Page content with sections
- `GET /api/content/events` — Event listing (filterable, paginated)
- `GET /api/content/events/:slug` — Event detail
- `GET /api/content/events/:slug/items` — Sport items for an event
- `GET /api/content/testimonials` — Approved testimonials
- `POST /api/contact` — Contact form submission

### Auth
- `POST /api/auth/login` — Admin login
- `GET /api/auth/me` — Admin profile
- `POST /api/public/auth/register` — User registration
- `POST /api/public/auth/login` — User login
- `POST /api/public/auth/google` — Google OAuth
- `GET /api/public/auth/me` — User profile

### Registrations & Payments
- `POST /api/registrations` — Create registration
- `GET /api/registrations/my` — User's registrations
- `GET /api/registrations/:id` — Registration detail
- `POST /api/registrations/:id/pay` — Initiate Razorpay payment
- `POST /api/registrations/payment/confirm` — Confirm payment

### Admin (requires auth + role)
- `GET/POST/PUT/DELETE /api/admin/pages` — CMS pages & sections
- `GET/POST/PUT/DELETE /api/admin/events` — Events CRUD
- `GET/POST/PUT/DELETE /api/admin/events/:id/items` — Sport items CRUD
- `GET/PATCH /api/admin/registrations` — Registration management
- `GET /api/admin/registrations/export` — CSV export
- `GET/POST/PUT/DELETE /api/admin/testimonials` — Testimonials CRUD
- `GET/PUT /api/admin/settings` — Site settings
- `GET/POST/PUT/PATCH /api/admin/users` — User management
- `POST/GET/DELETE /api/uploads` — Media library
- `GET /api/admin/calendar/feeds` — Calendar feeds (holidays + sports)

---

## Environment Variables

Copy `.env.example` to `.env`. Only 3 required for development:

```
PORT=8073
MONGODB_URI=mongodb://localhost:27017/tricore
JWT_SECRET=any-secret-string
```

Everything else is optional — configure via Admin → Integrations instead of `.env`:

| Variable | Purpose | Alternative |
|----------|---------|-------------|
| `RAZORPAY_KEY_ID` | Payment gateway | Admin → Integrations → Razorpay |
| `RAZORPAY_KEY_SECRET` | Payment gateway | Admin → Integrations → Razorpay |
| `GOOGLE_CLIENT_ID` | Google Sign-In | Admin → Integrations → Google |
| `SMTP_HOST` | Email sending | Admin → Integrations → Email |
| `SMTP_USER` | Email sender | Admin → Integrations → Email |
| `SMTP_PASS` | Email password | Admin → Integrations → Email |

---

## Scripts

```bash
npm run dev          # Start server + client (both)
npm run dev:server   # Server only (port 8073)
npm run dev:client   # Client only (port 8074)
npm run build        # Production client build
npm run start        # Production server (serves client build)

# Server
cd server
npm run seed         # Seed database with defaults
```

## Docker

```bash
docker compose up -d       # Start MongoDB
docker compose down        # Stop MongoDB
docker compose down -v     # Stop + delete all data
docker logs tricore-mongo  # View MongoDB logs
```

---

## Troubleshooting

### Windows: `bcrypt` or `sharp` install fails
```powershell
npm install -g windows-build-tools
npm install
```

### Windows: Docker "WSL 2 not enabled"
1. Open PowerShell as Administrator
2. Run: `wsl --install`
3. Restart your computer
4. Open Docker Desktop

### Port already in use
```bash
# Find and kill the process
lsof -i :8073  # macOS/Linux
netstat -ano | findstr :8073  # Windows
```

### MongoDB connection refused
Make sure Docker is running:
```bash
docker ps  # Should show tricore-mongo container
docker compose up -d  # Start it if not running
```

### Seed script fails
Make sure MongoDB is running first, then:
```bash
cd server && npm run seed
```

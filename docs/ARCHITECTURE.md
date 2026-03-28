# TriCore Events — Architecture Document

Last updated: 28 March 2026

---

## 1. Overview

TriCore Events is a CMS-driven event management platform with two faces:

1. **Public website** — Marketing, event discovery, registration. All content managed by admins.
2. **Admin portal** — Section-based CMS for editing pages, managing events, testimonials, and site-wide settings.

Every piece of public-facing content — headlines, images, sections, navigation, footer, colors, fonts — is controlled from the admin portal. No code changes needed to update content.

---

## 2. Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT (bcrypt for passwords) |
| Validation | Zod |
| Image Processing | Sharp, Multer |
| Icons | Lucide React |

---

## 3. CMS Model

**Section-based CMS** — not a page builder.

Each page has an ordered array of sections. Each section has:
- A **type** (hero, service-pillars, testimonials, etc.)
- A **data** object (shape depends on type)
- An **enabled** toggle
- An **order** number

Admins can:
- Edit section content through type-specific forms
- Reorder sections via drag-and-drop
- Toggle sections on/off
- Add new sections from available types

The public site renders sections dynamically using a `SectionRenderer` that maps `section.type` to the correct React component.

---

## 4. Project Structure

```
tricore/
├── client/                        # React frontend (Vite)
│   └── src/
│       ├── api/                   # Axios wrappers
│       │   ├── axiosClient.js     # Base instance with interceptors
│       │   ├── contentApi.js      # Public content endpoints
│       │   ├── eventsApi.js       # Public events endpoints
│       │   ├── authApi.js         # Auth endpoints
│       │   ├── adminContentApi.js # Admin CMS CRUD
│       │   └── uploadApi.js       # Image upload
│       │
│       ├── hooks/
│       │   ├── usePageContent.js  # Fetch + cache page sections
│       │   ├── useSiteSettings.js # Fetch site settings (nav, footer, theme)
│       │   ├── useEvents.js       # Events with filters
│       │   └── useAuth.js         # Auth state + token
│       │
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── SiteSettingsContext.jsx
│       │   └── ThemeProvider.jsx   # DB theme → CSS custom properties
│       │
│       ├── components/
│       │   ├── ui/                # Design system primitives
│       │   │   ├── Button.jsx
│       │   │   ├── Badge.jsx
│       │   │   ├── Card.jsx
│       │   │   ├── Input.jsx
│       │   │   ├── Textarea.jsx
│       │   │   ├── Modal.jsx
│       │   │   ├── Skeleton.jsx
│       │   │   ├── ImageUpload.jsx
│       │   │   └── SectionWrapper.jsx
│       │   │
│       │   ├── layout/
│       │   │   ├── PublicLayout.jsx  # Nav + footer wrapper
│       │   │   ├── AdminLayout.jsx  # Sidebar + header
│       │   │   ├── Navbar.jsx       # CMS-driven
│       │   │   ├── Footer.jsx       # CMS-driven
│       │   │   └── MobileMenu.jsx
│       │   │
│       │   ├── sections/            # Public page section renderers
│       │   │   ├── SectionRenderer.jsx
│       │   │   ├── HeroSection.jsx
│       │   │   ├── ServicePillarsSection.jsx
│       │   │   ├── TrustPartnersSection.jsx
│       │   │   ├── FeaturedEventsSection.jsx
│       │   │   ├── TestimonialsSection.jsx
│       │   │   ├── FinalCtaSection.jsx
│       │   │   ├── ContentBlockSection.jsx
│       │   │   ├── TeamSection.jsx
│       │   │   ├── ContactFormSection.jsx
│       │   │   ├── FaqSection.jsx
│       │   │   └── StatsGridSection.jsx
│       │   │
│       │   └── admin/
│       │       ├── PageSectionManager.jsx
│       │       ├── SectionEditor.jsx
│       │       ├── editors/
│       │       │   ├── HeroEditor.jsx
│       │       │   ├── ServicePillarsEditor.jsx
│       │       │   ├── TrustPartnersEditor.jsx
│       │       │   ├── FeaturedEventsEditor.jsx
│       │       │   ├── TestimonialsEditor.jsx
│       │       │   ├── FinalCtaEditor.jsx
│       │       │   ├── ContentBlockEditor.jsx
│       │       │   ├── TeamEditor.jsx
│       │       │   ├── ContactFormEditor.jsx
│       │       │   ├── FaqEditor.jsx
│       │       │   └── StatsGridEditor.jsx
│       │       ├── SiteSettingsForm.jsx
│       │       ├── NavEditor.jsx
│       │       ├── FooterEditor.jsx
│       │       └── ThemeEditor.jsx
│       │
│       ├── pages/
│       │   ├── public/
│       │   │   ├── HomePage.jsx
│       │   │   ├── AboutPage.jsx
│       │   │   ├── CorporateEventsPage.jsx
│       │   │   ├── EventsPage.jsx
│       │   │   ├── EventDetailPage.jsx
│       │   │   ├── ContactPage.jsx
│       │   │   └── NotFoundPage.jsx
│       │   └── admin/
│       │       ├── AdminLoginPage.jsx
│       │       ├── AdminDashboard.jsx
│       │       ├── PageEditorPage.jsx
│       │       ├── EventsManagerPage.jsx
│       │       ├── TestimonialsManagerPage.jsx
│       │       ├── SiteSettingsPage.jsx
│       │       └── MediaLibraryPage.jsx
│       │
│       ├── utils/
│       │   ├── fallbackContent.js
│       │   ├── sectionTypes.js
│       │   └── formatters.js
│       │
│       └── constants/
│           └── sectionDefaults.js
│
├── server/
│   └── src/
│       ├── server.js
│       ├── config/
│       │   ├── db.js
│       │   ├── env.js
│       │   └── cors.js
│       ├── models/
│       │   ├── SiteSettings.js
│       │   ├── PageContent.js
│       │   ├── Event.js
│       │   ├── Testimonial.js
│       │   ├── User.js
│       │   └── MediaAsset.js
│       ├── routes/
│       │   ├── index.js
│       │   ├── publicRoutes.js
│       │   ├── adminRoutes.js
│       │   ├── authRoutes.js
│       │   └── uploadRoutes.js
│       ├── controllers/
│       │   ├── publicController.js
│       │   ├── adminContentController.js
│       │   ├── eventsController.js
│       │   ├── testimonialsController.js
│       │   ├── siteSettingsController.js
│       │   ├── authController.js
│       │   └── uploadController.js
│       ├── middleware/
│       │   ├── auth.js
│       │   ├── roleGuard.js
│       │   ├── validate.js
│       │   └── errorHandler.js
│       ├── validators/
│       │   ├── contentSchemas.js
│       │   ├── eventSchemas.js
│       │   ├── settingsSchemas.js
│       │   └── authSchemas.js
│       ├── services/
│       │   ├── contentService.js
│       │   ├── settingsService.js
│       │   ├── eventsService.js
│       │   └── uploadService.js
│       └── utils/
│           └── seedDefaults.js
│
├── docs/
│   ├── ARCHITECTURE.md            # This file
│   ├── DATABASE_SCHEMA.md
│   └── API_REFERENCE.md
│
├── package.json
├── .gitignore
└── CLAUDE.md
```

---

## 5. Data Flow

### Public Site Load

```
Browser → GET /api/content/settings → SiteSettingsContext (theme, nav, footer)
                                        ↓
                                   ThemeProvider sets CSS vars on :root
                                        ↓
       → GET /api/content/pages/home → usePageContent('home')
                                        ↓
                                   SectionRenderer iterates sections
                                        ↓
                                   Each section.type → matching React component
                                        ↓
                                   Page renders with CMS content
```

### Admin Edit Flow

```
Admin → PageEditorPage → GET /api/admin/pages/home
                              ↓
                         PageSectionManager shows all sections
                              ↓
                         Admin clicks Edit on Hero section
                              ↓
                         HeroEditor opens with current data
                              ↓
                         Admin changes headline, uploads image
                              ↓
                         POST /api/upload → returns image URL
                              ↓
                         PUT /api/admin/pages/home/sections/hero-1
                              ↓
                         MongoDB updated
                              ↓
                         Public visitor loads page → sees new headline
```

### Theme Flow

```
Admin changes colors in ThemeEditor
  → PUT /api/admin/settings (theme.colors updated)
  → Public site fetches settings on load
  → ThemeProvider sets CSS custom properties on :root
  → Tailwind classes (bg-primary, text-base, etc.) resolve via var()
  → Entire site reflects new colors without code changes
```

---

## 6. Key Design Decisions

### Section-based CMS over page builder
A page builder (drag arbitrary blocks) introduces massive UI complexity and fragile rendering. Section-based means each page has a fixed set of section types available, but admins control content, order, and visibility. Simpler to build, harder to break.

### Mixed type for section data
Each section type has a different shape. Discriminated schemas (one model per type) would create unnecessary complexity. Section data shapes are validated at the API layer using Zod schemas keyed by type. Mongoose `Mixed` type stores them flexibly. Database stays simple, validation stays strict.

### Single SiteSettings document
One document fetched in one call, updated atomically. Maps cleanly to a single admin settings page with tabs. Avoids scattered key-value lookups.

### Dynamic population for events/testimonials
The `featured-events` and `testimonials` sections don't store specific IDs. The public API populates them at read time from their respective collections (filtering by `featured: true`, `status: upcoming`, etc.). Homepage always shows current data without manual re-linking.

### Fallback content
`fallbackContent.js` provides complete defaults for every page. The site is never blank — if CMS data is missing or API fails, defaults render. `seedDefaults.js` on the server seeds initial content on first run so admins can start editing immediately.

---

## 7. Section Types Registry

| Type | Used On | Description |
|------|---------|-------------|
| `hero` | Home | Full-width hero with headline, subheadline, CTAs, background image, stats |
| `service-pillars` | Home | Three service cards (Sports, Corporate, Community) with images |
| `trust-partners` | Home | Why TriCore section with partner cards |
| `featured-events` | Home | Auto-populated from Events collection |
| `testimonials` | Home, About | Auto-populated from Testimonials collection |
| `final-cta` | Home, Corporate | Full-width CTA with background image |
| `content-block` | About, Corporate | Generic heading + body + image block |
| `team` | About | Team members grid |
| `contact-form` | Contact | Configurable contact form |
| `faq` | Any | Expandable Q&A section |
| `stats-grid` | Any | Grid of stat numbers with labels |

New section types can be added by:
1. Adding the type to the enum in `PageContent` model
2. Creating a `XxxSection.jsx` renderer component
3. Creating a `XxxEditor.jsx` admin form
4. Registering in `SectionRenderer.jsx` mapping
5. Adding Zod validation in `contentSchemas.js`

---

## 8. Authentication & Authorization

- **JWT tokens** issued on login, sent via `Authorization: Bearer` header
- **Two roles**: `admin` (full access), `editor` (content editing only)
- **Middleware chain**: `auth.js` verifies JWT → `roleGuard.js` checks role
- **Public routes** have no auth middleware
- **Admin routes** require auth + admin role
- **Upload routes** require auth (any role)

---

## 9. Image Handling

- **Upload**: Multer receives file → Sharp resizes (max 1920px width) + converts to WebP → stored in `server/uploads/` (dev) or cloud storage (prod)
- **MediaAsset** model tracks all uploads (filename, URL, size, uploader)
- **Usage**: All image fields in section data store URL strings
- **Media Library**: Admin can browse, search, and delete uploaded images
- **Production**: Swap `uploadService.js` internals to S3/Cloudinary — rest of system unchanged

---

## 10. Implementation Phases

### Phase 1: Project Scaffold + DB + Basic API
Root workspace, Vite + Tailwind client, Express server, all Mongoose models, auth middleware, public routes returning seed data, `seedDefaults.js`.

### Phase 2: Public Homepage with CMS Data
SiteSettingsContext, ThemeProvider, PublicLayout (CMS-driven Navbar + Footer), all 6 homepage section components matching the design, SectionRenderer, responsive (390px / 768px / 1440px).

### Phase 3: Admin Portal + Section Editors
Admin auth, AdminLayout with sidebar, PageEditorPage + PageSectionManager, all 11 section editor forms, SiteSettingsPage, EventsManagerPage, TestimonialsManagerPage, MediaLibraryPage.

### Phase 4: Remaining Public Pages
About, Corporate Events, Events listing, Event detail, Contact pages. Additional section components. Extended seed defaults.

### Phase 5: Theme/Branding Polish
ThemeEditor with color pickers + live preview, dynamic Google Fonts loading, full mobile responsiveness audit.

### Phase 6: Optimization + Deployment
Loading skeletons, error boundaries, SEO meta from CMS, lazy-loaded sections, image optimization, API caching, production build config.

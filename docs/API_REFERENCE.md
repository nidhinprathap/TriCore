# TriCore Events — API Reference

Last updated: 28 March 2026

Base URL: `/api`

---

## Authentication

All admin endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are issued via `POST /api/auth/login` and expire after 24 hours.

---

## Auth Endpoints

### POST /api/auth/login

Login and receive a JWT token.

**Body:**
```json
{
  "email": "admin@tricore.com",
  "password": "yourpassword"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "660a...",
    "email": "admin@tricore.com",
    "name": "Admin",
    "role": "admin"
  }
}
```

**Response 401:**
```json
{ "error": "Invalid email or password" }
```

---

### GET /api/auth/me

Get the currently authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "id": "660a...",
  "email": "admin@tricore.com",
  "name": "Admin",
  "role": "admin"
}
```

---

## Public Content Endpoints

No authentication required. These power the public-facing website.

---

### GET /api/content/settings

Fetch global site settings (branding, theme, navigation, footer, contact info).

**Response 200:**
```json
{
  "branding": {
    "siteName": "TriCore Events",
    "tagline": "Where every event becomes an experience",
    "logo": { "url": "/uploads/logo.webp", "altText": "TriCore Events" },
    "favicon": "/uploads/favicon.ico"
  },
  "theme": {
    "colors": {
      "primary": "#C8A961",
      "accent": "#D4AF37",
      "background": "#0A0A0A",
      "surface": "#141414",
      "surfaceAlt": "#1A1A1A",
      "text": "#F5F5F5",
      "textMuted": "#9CA3AF",
      "border": "#262626"
    },
    "fonts": {
      "heading": "Space Grotesk",
      "body": "Space Grotesk"
    }
  },
  "navigation": {
    "links": [
      { "label": "HOME", "href": "/", "order": 0, "isExternal": false },
      { "label": "EVENTS", "href": "/events", "order": 1, "isExternal": false },
      { "label": "CORPORATE", "href": "/corporate-events", "order": 2, "isExternal": false },
      { "label": "ABOUT", "href": "/about", "order": 3, "isExternal": false },
      { "label": "CONTACT", "href": "/contact", "order": 4, "isExternal": false }
    ],
    "ctaButton": { "label": "REGISTER NOW", "href": "/events", "enabled": true }
  },
  "footer": {
    "columns": [
      {
        "title": "COMPANY",
        "links": [
          { "label": "About Us", "href": "/about" },
          { "label": "Our Partners", "href": "/about#partners" },
          { "label": "Contact", "href": "/contact" }
        ]
      }
    ],
    "socialLinks": [
      { "platform": "instagram", "url": "https://instagram.com/tricoreevents" },
      { "platform": "linkedin", "url": "https://linkedin.com/company/tricore" }
    ],
    "bottomText": "© 2026 TriCore Events. All rights reserved."
  },
  "contact": {
    "email": "hello@tricoreevents.com",
    "phone": "+91 98765 43210",
    "whatsapp": "+91 98765 43210",
    "address": "Bangalore, India"
  }
}
```

---

### GET /api/content/pages/:pageSlug

Fetch all enabled sections for a specific page, sorted by order.

**Params:** `pageSlug` — one of: `home`, `about`, `corporate-events`, `events`, `contact`

**Response 200:**
```json
{
  "pageSlug": "home",
  "title": "Homepage",
  "metaTitle": "TriCore Events — Where Every Event Becomes an Experience",
  "metaDescription": "Sports tournaments, corporate events, and community competitions.",
  "sections": [
    {
      "sectionId": "hero-1",
      "type": "hero",
      "enabled": true,
      "order": 0,
      "data": {
        "badge": "SPORTS · CORPORATE · COMMUNITY",
        "headline": "WHERE EVERY\nEVENT BECOMES\nAN EXPERIENCE",
        "subheadline": "From high-stakes sports tournaments to premium corporate experiences...",
        "backgroundImage": "/uploads/hero-bg.webp",
        "ctaButtons": [
          { "label": "EXPLORE EVENTS", "href": "/events", "variant": "primary" },
          { "label": "CORPORATE INQUIRY", "href": "/corporate-events", "variant": "outline" }
        ],
        "stats": [
          { "value": "150+", "label": "EVENTS DELIVERED" },
          { "value": "50K+", "label": "PARTICIPANTS ENGAGED" }
        ]
      }
    },
    {
      "sectionId": "events-1",
      "type": "featured-events",
      "enabled": true,
      "order": 3,
      "data": {
        "heading": "FEATURED EVENTS",
        "subheading": "UPCOMING",
        "displayCount": 3,
        "showViewAll": true
      },
      "events": [
        {
          "title": "Premier Cricket League Season 4",
          "slug": "premier-cricket-league-s4",
          "category": "sports",
          "date": "2026-04-15",
          "location": "SPARK 7 ARENA",
          "image": "/uploads/pcl-cover.webp"
        }
      ]
    }
  ]
}
```

Note: `featured-events` and `testimonials` sections include populated data from their respective collections.

---

### GET /api/content/events

List public events.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by: `sports`, `corporate`, `community` |
| `status` | string | Filter by: `upcoming`, `active`, `completed`. Default: `upcoming` |
| `featured` | boolean | Filter featured events only |
| `limit` | number | Max results. Default: 12 |
| `page` | number | Pagination. Default: 1 |

**Response 200:**
```json
{
  "events": [
    {
      "id": "660a...",
      "title": "Premier Cricket League Season 4",
      "slug": "premier-cricket-league-s4",
      "shortDescription": "The biggest cricket tournament of the year...",
      "category": "sports",
      "date": "2026-04-15T00:00:00Z",
      "endDate": "2026-04-20T00:00:00Z",
      "location": "Bangalore",
      "venue": "Spark 7 Sports Arena",
      "image": "/uploads/pcl-cover.webp",
      "status": "upcoming",
      "featured": true,
      "registrationEnabled": true,
      "price": 500
    }
  ],
  "total": 15,
  "page": 1,
  "totalPages": 2
}
```

---

### GET /api/content/events/:slug

Get a single event by slug.

**Response 200:**
```json
{
  "id": "660a...",
  "title": "Premier Cricket League Season 4",
  "slug": "premier-cricket-league-s4",
  "description": "Full description with details...",
  "shortDescription": "The biggest cricket tournament...",
  "category": "sports",
  "date": "2026-04-15T00:00:00Z",
  "endDate": "2026-04-20T00:00:00Z",
  "location": "Bangalore",
  "venue": "Spark 7 Sports Arena",
  "image": "/uploads/pcl-cover.webp",
  "gallery": ["/uploads/pcl-1.webp", "/uploads/pcl-2.webp"],
  "status": "upcoming",
  "featured": true,
  "registrationEnabled": true,
  "maxParticipants": 200,
  "price": 500,
  "tags": ["cricket", "tournament", "season-4"]
}
```

**Response 404:**
```json
{ "error": "Event not found" }
```

---

### GET /api/content/testimonials

List public testimonials.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `featured` | boolean | Filter featured only |
| `limit` | number | Max results. Default: 6 |

**Response 200:**
```json
{
  "testimonials": [
    {
      "id": "660b...",
      "name": "Rajesh Kumar",
      "role": "Team Captain",
      "company": "PCL Season 3",
      "content": "The tournament was flawlessly organized...",
      "avatar": "/uploads/rajesh.webp",
      "rating": 5
    }
  ]
}
```

---

## Admin Content Endpoints

All require `Authorization: Bearer <token>` with admin role.

---

### PUT /api/admin/settings

Update site settings (branding, theme, nav, footer, contact). Partial updates supported — only send the fields you want to change.

**Body:** (partial example — updating theme colors)
```json
{
  "theme": {
    "colors": {
      "primary": "#E8C547",
      "accent": "#F0D060"
    }
  }
}
```

**Response 200:** Updated full settings object.

---

### GET /api/admin/pages

List all managed pages.

**Response 200:**
```json
{
  "pages": [
    { "pageSlug": "home", "title": "Homepage", "sectionCount": 6 },
    { "pageSlug": "about", "title": "About Us", "sectionCount": 4 },
    { "pageSlug": "corporate-events", "title": "Corporate Events", "sectionCount": 4 },
    { "pageSlug": "events", "title": "Events", "sectionCount": 1 },
    { "pageSlug": "contact", "title": "Contact", "sectionCount": 3 }
  ]
}
```

---

### GET /api/admin/pages/:pageSlug

Get a page with ALL sections (including disabled ones).

**Response 200:** Same shape as public endpoint but includes `enabled: false` sections.

---

### PUT /api/admin/pages/:pageSlug

Update entire page (all sections at once). Used when saving major changes.

**Body:**
```json
{
  "title": "Homepage",
  "metaTitle": "TriCore Events — Home",
  "metaDescription": "...",
  "sections": [ ... ]
}
```

**Response 200:** Updated page object.

---

### PUT /api/admin/pages/:pageSlug/sections/:sectionId

Update a single section's data. Most common admin operation.

**Body:**
```json
{
  "enabled": true,
  "data": {
    "headline": "NEW HEADLINE HERE",
    "subheadline": "Updated subheadline..."
  }
}
```

**Response 200:** Updated section object.

---

### PATCH /api/admin/pages/:pageSlug/reorder

Reorder sections on a page.

**Body:**
```json
{
  "sections": [
    { "sectionId": "hero-1", "order": 0 },
    { "sectionId": "pillars-1", "order": 1 },
    { "sectionId": "trust-1", "order": 2 },
    { "sectionId": "events-1", "order": 3 },
    { "sectionId": "testimonials-1", "order": 4 },
    { "sectionId": "cta-1", "order": 5 }
  ]
}
```

**Response 200:**
```json
{ "message": "Sections reordered successfully" }
```

---

### Admin Events CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/events` | List all events (including drafts) |
| POST | `/api/admin/events` | Create event |
| PUT | `/api/admin/events/:id` | Update event |
| DELETE | `/api/admin/events/:id` | Delete event |

**POST/PUT Body:**
```json
{
  "title": "Premier Cricket League Season 4",
  "slug": "premier-cricket-league-s4",
  "description": "Full description...",
  "shortDescription": "Short card description",
  "category": "sports",
  "date": "2026-04-15",
  "endDate": "2026-04-20",
  "location": "Bangalore",
  "venue": "Spark 7 Sports Arena",
  "image": "/uploads/pcl-cover.webp",
  "status": "upcoming",
  "featured": true,
  "registrationEnabled": true,
  "maxParticipants": 200,
  "price": 500,
  "tags": ["cricket", "tournament"]
}
```

---

### Admin Testimonials CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/testimonials` | List all testimonials |
| POST | `/api/admin/testimonials` | Create testimonial |
| PUT | `/api/admin/testimonials/:id` | Update testimonial |
| DELETE | `/api/admin/testimonials/:id` | Delete testimonial |

**POST/PUT Body:**
```json
{
  "name": "Rajesh Kumar",
  "role": "Team Captain",
  "company": "PCL Season 3",
  "content": "The tournament was flawlessly organized...",
  "avatar": "/uploads/rajesh.webp",
  "rating": 5,
  "featured": true,
  "enabled": true
}
```

---

## Upload Endpoints

Require `Authorization: Bearer <token>` (any role).

---

### POST /api/upload

Upload an image. Accepts `multipart/form-data`.

**Body:** Form data with field `image` (file).

Processing: Sharp resizes to max 1920px width, converts to WebP.

**Response 200:**
```json
{
  "id": "660c...",
  "url": "/uploads/1711612345-hero.webp",
  "filename": "1711612345-hero.webp",
  "originalName": "hero-background.jpg",
  "mimeType": "image/webp",
  "size": 245760
}
```

---

### GET /api/upload/media

List all uploaded media assets.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `limit` | number | Default: 50 |
| `page` | number | Default: 1 |

**Response 200:**
```json
{
  "assets": [
    {
      "id": "660c...",
      "url": "/uploads/1711612345-hero.webp",
      "filename": "1711612345-hero.webp",
      "originalName": "hero-background.jpg",
      "mimeType": "image/webp",
      "size": 245760,
      "alt": "Stadium aerial view",
      "createdAt": "2026-03-28T10:00:00Z"
    }
  ],
  "total": 24,
  "page": 1,
  "totalPages": 1
}
```

---

### DELETE /api/upload/media/:id

Delete a media asset (removes file and database record).

**Response 200:**
```json
{ "message": "Asset deleted successfully" }
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "error": "Human-readable error message"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request / validation error |
| 401 | Not authenticated |
| 403 | Not authorized (wrong role) |
| 404 | Resource not found |
| 500 | Server error |

Validation errors include field-level details:

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "title", "message": "Title is required" },
    { "field": "category", "message": "Must be one of: sports, corporate, community" }
  ]
}
```

# TriCore Project Context

Last updated: 28 March 2026

## 1. What This Project Is

TriCore Events is a full-stack event management platform with two major faces:

1. A public-facing marketing and event-discovery website
2. A role-based internal admin portal for operations, registrations, matches, accounting, reports, users, and settings

This is not just a brochure website. It is already a working event platform with public pages, registration/payment flows, admin tools, and content/settings management.

## 2. Core Business Purpose

TriCore is positioned around three service buckets:

1. Sports tournaments
2. Corporate events and experiences
3. Community / residential competitions

The public site needs to do three things well:

1. Build trust for a relatively new brand
2. Convert visitors into inquiries or registrations
3. Present TriCore as professionally managed and partner-backed

The admin portal needs to do the heavy operational work behind those promises.

## 3. Main User Types

### Public users / participants

- Browse the site
- Discover events
- Register for events
- Make payments
- Track their participation through the dashboard after sign-in

### Admin users

- Full access to manage the system
- Events, registrations, matches, settings, reports, users, and financial controls

### Operations users

- Focus on event operations
- Overview, events, registrations, matches, reports

### Accounting users

- Focus on financial records and reporting
- Ledger, transactions, categories, payment-related workflows

## 4. Public Website Scope

Current public routes are defined in [App.jsx](/c:/Works/Tricore/client/src/App.jsx#L41).

Main public pages:

- `/` Home
- `/about`
- `/corporate-events`
- `/events`
- `/events/:eventId`
- `/partner-access`
- `/contact`
- `/dashboard` for signed-in users
- `/events/:eventId/payment` for signed-in users

Shared public layout is handled by [MainLayout.jsx](/c:/Works/Tricore/client/src/components/layout/MainLayout.jsx#L16).

## 5. Admin Portal Scope

Admin routes are also mapped in [App.jsx](/c:/Works/Tricore/client/src/App.jsx#L41).

Main admin areas:

- Overview
- Events
- Registrations
- Matches
- Accounting
- Reports
- Users
- Settings
- User Manual

The user manual already explains the operational workflows in detail:
[TRICORE_USER_MANUAL.md](/c:/Works/Tricore/docs/TRICORE_USER_MANUAL.md)

## 6. Frontend Stack

Client stack from [client/package.json](/c:/Works/Tricore/client/package.json):

- React 18
- React Router
- Vite
- Tailwind CSS
- Flowbite
- Axios
- Google OAuth
- Unovis charts
- react-d3-tree

Frontend structure:

- `client/src/pages/public` for public pages
- `client/src/pages/admin` for admin pages
- `client/src/pages/user` for user dashboard pages
- `client/src/components` for shared UI and page-specific sections
- `client/src/data` for content constants, access rules, and static copy
- `client/src/api` for API wrappers
- `client/src/utils` for formatting, event logic, helpers

## 7. Backend Stack

Server stack from [package.json](/c:/Works/Tricore/package.json):

- Node.js
- Express
- MongoDB with Mongoose
- JWT auth
- Google auth integration
- Nodemailer
- Razorpay dependency present
- Zod validation
- Sharp for image processing

Entry point:

- [server/src/server.js](/c:/Works/Tricore/server/src/server.js#L1)

Main server folders:

- `config`
- `controllers`
- `middleware`
- `models`
- `routes`
- `services`
- `validators`
- `utils`

API route composition is in [server/src/routes/index.js](/c:/Works/Tricore/server/src/routes/index.js#L1).

## 8. Important Architectural Pattern

One of the strongest patterns in this repo is the use of `AppSetting` documents for configurable system content and settings.

Examples:

- homepage banners
- homepage content
- public site settings
- contact forwarding settings
- email settings
- invoice settings
- backup settings
- payment settings
- OTP settings

Key model:

- [AppSetting.js](/c:/Works/Tricore/server/src/models/AppSetting.js)

This matters because the public site is partly CMS-like already. A redesign should reuse and simplify this model rather than hardcoding everything.

## 9. Public Website Content System

Homepage data is split across:

- banner configuration
- homepage theme/content configuration
- gallery configuration
- testimonial configuration
- static fallback content in `siteContent.js`

Important files:

- [HomePage.jsx](/c:/Works/Tricore/client/src/pages/public/HomePage.jsx#L1)
- [HomeBannerCarousel.jsx](/c:/Works/Tricore/client/src/components/home/HomeBannerCarousel.jsx#L101)
- [HomePageContentSections.jsx](/c:/Works/Tricore/client/src/components/home/HomePageContentSections.jsx#L50)
- [siteContent.js](/c:/Works/Tricore/client/src/data/siteContent.js)
- [homeBannerService.js](/c:/Works/Tricore/server/src/services/homeBannerService.js)
- [homePageContentService.js](/c:/Works/Tricore/server/src/services/homePageContentService.js)

Admin settings panels for this:

- [HomeBannerSettingsPanel.jsx](/c:/Works/Tricore/client/src/components/settings/HomeBannerSettingsPanel.jsx)
- [HomePageContentSettingsPanel.jsx](/c:/Works/Tricore/client/src/components/settings/HomePageContentSettingsPanel.jsx)
- [GallerySettingsPanel.jsx](/c:/Works/Tricore/client/src/components/settings/GallerySettingsPanel.jsx)
- [TestimonialsSettingsPanel.jsx](/c:/Works/Tricore/client/src/components/settings/TestimonialsSettingsPanel.jsx)

## 10. Current Public Design Situation

The current public site is functional, but the UI feels weaker than the platform underneath it.

Main issues observed:

1. The homepage is too section-heavy and repetitive.
2. Too many similar white cards reduce contrast and premium feel.
3. The public pages share one repetitive visual rhythm and do not differentiate enough.
4. The hero currently carries too much responsibility at once.
5. Some of the strongest trust and conversion messages are buried lower on the page.

This is why the redesign should focus on:

1. Stronger visual hierarchy
2. Fewer but more intentional sections
3. Better use of imagery
4. Clearer business vs event discovery pathways
5. Cleaner design tokens and section pacing

## 11. Current Design Preview Work

A standalone non-integrated homepage concept now exists here:

- [tricore-homepage-concept.html](/c:/Works/Tricore/design-preview/tricore-homepage-concept.html)

Purpose of that file:

- preview a redesign direction without changing the live app
- validate layout, tone, and section hierarchy first
- use it as a visual reference before rebuilding the actual React pages

## 12. Current Public Trust / Brand Direction

Recent work already pushed the site toward partner-led credibility instead of falsely aging the company.

Important positioning direction:

- TriCore is a growing brand
- experience comes from the partners, organizers, and delivery network behind it
- Spark 7 Sports Arena and Sarva Horizon are key public trust signals

## 13. Technical Notes That Matter for Redesign

### Good things already in place

- public SEO metadata and structured data
- public settings API
- configurable homepage sections
- gallery and testimonial toggles
- WhatsApp contact path
- partner highlight component

### Constraints to respect

- do not break admin-managed content
- keep mobile experience strong
- preserve routing and event flows
- avoid fake trust claims
- keep public pages easy to maintain by non-technical admins

## 14. Suggested Implementation Order

Recommended phase order:

1. Finalize public-site visual direction and wireframes
2. Rebuild shared public design system
3. Rebuild homepage in React using the existing settings/content model where possible
4. Restyle Events, Corporate, About, and Contact pages
5. Review and simplify homepage/admin content editing experience
6. Start admin portal UX redesign as phase 2

## 15. High-Value Files for New Contributors

If someone wants to quickly understand the project, start here:

- [docs/TRICORE_USER_MANUAL.md](/c:/Works/Tricore/docs/TRICORE_USER_MANUAL.md)
- [client/src/App.jsx](/c:/Works/Tricore/client/src/App.jsx#L1)
- [client/src/components/layout/MainLayout.jsx](/c:/Works/Tricore/client/src/components/layout/MainLayout.jsx#L1)
- [client/src/pages/public/HomePage.jsx](/c:/Works/Tricore/client/src/pages/public/HomePage.jsx#L1)
- [client/src/components/home/HomePageContentSections.jsx](/c:/Works/Tricore/client/src/components/home/HomePageContentSections.jsx#L1)
- [client/src/pages/admin/AdminSettingsPage.jsx](/c:/Works/Tricore/client/src/pages/admin/AdminSettingsPage.jsx#L1)
- [server/src/server.js](/c:/Works/Tricore/server/src/server.js#L1)
- [server/src/routes/index.js](/c:/Works/Tricore/server/src/routes/index.js#L1)
- [server/src/services/homePageContentService.js](/c:/Works/Tricore/server/src/services/homePageContentService.js#L1)
- [server/src/services/homeBannerService.js](/c:/Works/Tricore/server/src/services/homeBannerService.js#L1)

## 16. Summary

TriCore is already a serious operational platform hiding behind a public UI that does not yet fully communicate that maturity.

The next best move is not to rebuild blindly. It is to:

1. lock the new public design direction
2. rebuild the public-facing experience on top of the existing content/settings architecture
3. then improve the admin portal with the same level of clarity and design discipline

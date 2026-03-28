# TriCore Events — Admin Portal Expansion Plan

Last updated: 28 March 2026

A comprehensive analysis from three perspectives: Event Organizer, UI/UX Designer, and Business Owner.

---

## Executive Summary

The current admin portal handles event creation, CMS content, and basic registration management. Three critical gaps were identified:

1. **No business intelligence** — zero revenue visibility, no analytics, no financial reports
2. **No role-based access** — only admin/editor, cannot safely delegate to a 15-person team
3. **No operational tools** — no check-in system, no match management, no live event dashboard

This document covers 10 priority tiers of features, 7 new data models, 8 new admin pages, and the UI/UX design for each.

---

## 1. Role-Based Access Control

### Current: 2 roles (admin, editor)
### Needed: 7 roles

| Role | Sees | Can Do | Cannot Access |
|------|------|--------|---------------|
| **Super Admin / CEO** | Everything | Full system control, assign events to managers, manage users | Nothing restricted |
| **Event Manager** | Only their assigned events, registrations, sport items, revenue summary | Edit event details, manage sport items, approve registrations, send communications | Other managers' events, CMS, site settings, user management |
| **Sports Coordinator** | Assigned sport items within events | Update match results, manage fixtures/brackets, venue allocation | Event-level config, pricing, financial data, CMS |
| **Registration Manager** | Registrations for assigned events | Approve/reject, process refunds (initiate), manage waitlist, bulk import, check-in | Event config, sport item setup, CMS, financial authorization |
| **Finance / Accounting** | Payment reports, invoices, expenses, tax summaries | Generate reports, authorize refunds, create invoices, reconcile payments | CMS, event operations, participant personal data, match results |
| **Operations** | Check-in dashboard, venue allocation, live status | Mark check-ins, post live updates, manage venue changes, log incidents | Financial data, CMS, registration approvals, site settings |
| **Content Editor** | CMS pages, media library, testimonials, event marketing copy | Edit page sections, upload images, manage testimonials | Registration data, financial data, sport item capacity/pricing, user management |

### Implementation
- Extend `User.role` enum to 7 values
- Add `User.assignedEvents: [ObjectId]` for scoped access
- Replace `roleGuard.js` with permission-based middleware: `requirePermission('registrations.approve')`
- Admin sidebar dynamically shows/hides items per role
- New `AuditLog` collection: `{ userId, action, resource, resourceId, timestamp }`

---

## 2. CEO Executive Dashboard

### What the business owner sees when logging in:

```
┌──────────────────────────────────────────────────────────────┐
│ SIDEBAR │ TOP: Dashboard          [Cmd+K Search] [🔔 3] [👤] │
│         ├────────────────────────────────────────────────────┤
│ OVERVIEW│                                                    │
│ ●Dashboard│ ALERT BANNER (conditional)                       │
│         │ "3 registrations pending approval"        [Review] │
│ CONTENT │                                                    │
│ ●Pages  │ ROW 1: STAT CARDS (5 cards)                        │
│ ●Testi  │ ┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐│
│ ●Media  │ │REG     ││REVENUE ││ACTIVE  ││PENDING ││CAPACITY││
│         │ │TODAY   ││THIS MO ││EVENTS  ││APPROV  ││UTIL    ││
│ EVENTS  │ │  12    ││₹45.2K  ││  6     ││  3     ││ 72%    ││
│ ●Events │ │+4 ↑   ││+18% ↑  ││2 live  ││        ││avg     ││
│ ●Regs   │ └────────┘└────────┘└────────┘└────────┘└────────┘│
│ ●SportI │                                                    │
│         │ ROW 2: CHARTS (2-column)                           │
│ FINANCE │ ┌──────────────────┐┌──────────────────┐          │
│ ●Payments│ │REGISTRATION TREND││REVENUE BY MONTH  │          │
│ ●Invoices│ │(7-day sparkline) ││(bar chart, 6 mo) │          │
│ ●Expenses│ │                  ││                   │          │
│         │ │[Week] [Month]    ││Total: ₹2.4L       │          │
│ REPORTS │ └──────────────────┘└──────────────────┘          │
│ ●Analytics│                                                   │
│ ●Reports │ ROW 3: THREE-COLUMN                               │
│         │ ┌─────────┐┌──────────┐┌─────────────┐           │
│ SETTINGS│ │UPCOMING ││PENDING   ││ACTIVITY     │           │
│ ●Site   │ │EVENTS   ││ACTIONS   ││FEED         │           │
│ ●Users  │ │Timeline ││          ││             │           │
│         │ │(30 days)││3 regs    ││Admin User   │           │
│─────────│ │         ││awaiting  ││approved     │           │
│👤Admin  │ │Apr 15   ││approval  ││#TRI-0849    │           │
│Admin    │ │● PCL S4 ││          ││2 min ago    │           │
│[Logout] │ │May 8    ││1 event   ││             │           │
│         │ │● Corp   ││at 90%    ││Rajesh Kumar │           │
│         │ │  Cup    ││capacity  ││registered   │           │
│         │ │Jun 1    ││          ││for PCL S4   │           │
│         │ │● Badmtn ││2 events  ││15 min ago   │           │
│         │ │  Open   ││closing   ││             │           │
│         │ │         ││in 7 days ││[View All]   │           │
│         │ └─────────┘└──────────┘└─────────────┘           │
└─────────┴────────────────────────────────────────────────────┘
```

### Key Metrics
- **Revenue snapshot**: Today / This Week / This Month / This Quarter / YoY
- **Live events ticker**: Events happening now with participant count
- **Upcoming pipeline**: Next 30 days with expected revenue
- **Registration velocity**: Daily trend (up or down)
- **Pending actions**: Registrations awaiting approval, events at capacity, closing soon
- **Activity feed**: Real-time log of system actions

---

## 3. Financial Management

### New Collections Required

**Expense**
```js
{
  eventId: ObjectId,
  description: String,      // "Venue rental", "Trophies", "Catering"
  amount: Number,
  category: String,         // "venue" | "equipment" | "catering" | "marketing" | "staff" | "other"
  date: Date,
  receiptUrl: String,       // Uploaded receipt image
  createdBy: ObjectId,
  timestamps: true
}
```

**Invoice**
```js
{
  invoiceNumber: String,    // "TC-2026-0001" (auto-generated)
  eventId: ObjectId,
  clientCompanyName: String,
  contactEmail: String,
  items: [{ description: String, quantity: Number, unitPrice: Number, total: Number }],
  subtotal: Number,
  gstRate: Number,          // e.g., 18
  gstAmount: Number,
  total: Number,
  status: String,           // "draft" | "sent" | "paid" | "overdue" | "cancelled"
  dueDate: Date,
  paidAt: Date,
  timestamps: true
}
```

### Financial Screens
1. **Payments Dashboard** — Cash flow: received vs pending vs refunded
2. **Outstanding Payments** — Who hasn't paid, grouped by event, with reminder buttons
3. **Per-Event P/L Report** — Revenue - Expenses = Profit
4. **Invoice Manager** — Create, send, track invoices with GST
5. **GST Report** — Monthly taxable amount + GST collected

---

## 4. Event Operations — Missing Systems

### 4.1 Check-In System
- Add `checkedIn: Boolean`, `checkedInAt: Date` to Registration
- QR code generated per registration, sent via email/SMS
- **Mobile check-in page**: search by name or scan QR, tap to check in
- Offline support (service worker syncs when back online)

### 4.2 Match/Fixture Management
New **Match** collection:
```js
{
  eventId: ObjectId,
  sportItemId: ObjectId,
  round: String,            // "Quarter Final", "Pool A Match 3"
  matchNumber: Number,
  participants: [{ registrationId: ObjectId, teamName: String, score: Number }],
  status: String,           // "scheduled" | "in_progress" | "completed"
  scheduledTime: Date,
  venue: String,            // Court/field name
  result: { winnerId: ObjectId, summary: String },
  timestamps: true
}
```
- Bracket generator (single elimination, round robin, pool+knockout)
- Score entry interface (mobile-friendly)
- Public live scoreboard

### 4.3 Venue/Court Allocation
```js
// Embedded on Event
venues: [{
  name: String,             // "Court A", "Field 1"
  type: String,             // "indoor" | "outdoor"
  capacity: Number,
  status: String            // "available" | "in_use" | "maintenance"
}]
```
- Gantt-chart style venue allocation board

### 4.4 Live Event Updates
New **EventUpdate** collection:
```js
{ eventId, message, type: "info"|"warning"|"urgent", postedBy, postedAt }
```
- WebSocket push to public event detail page
- Admin interface for posting updates

---

## 5. Registration Enhancements

### 5.1 Waitlist Auto-Promotion
- `waitlistPosition: Number` on Registration
- Server hook: on cancellation, auto-promote next waitlisted person + notify

### 5.2 Transfer/Substitution
- `PUT /api/registrations/:id/transfer` — swap a player on a team
- Transfer policy per event: `transferAllowed`, `transferDeadline`, `transferFee`

### 5.3 Early Bird Pricing
Replace single `price` on SportItem with:
```js
pricing: [{
  label: "Early Bird",
  amount: 400,
  validFrom: Date,
  validUntil: Date
}, {
  label: "Regular",
  amount: 500,
  validFrom: Date,
  validUntil: Date
}]
```

### 5.4 Promo Codes
New **PromoCode** collection:
```js
{
  code: String,             // "EARLY20", "TECHVISTA"
  eventId: ObjectId,        // null = site-wide
  discountType: String,     // "percentage" | "flat"
  discountValue: Number,
  maxUses: Number,
  usedCount: Number,
  validFrom: Date,
  validUntil: Date,
  active: Boolean
}
```

### 5.5 Bulk Import
- CSV upload for group/corporate registrations
- Template download, validation preview, confirm import

### 5.6 Registration Amendments
- `amendments[]` array tracking field changes with audit trail
- Amendment deadline and policy per event

---

## 6. Communication System

### Current: Email only (7 triggers)
### Needed: Multi-channel

| Channel | Priority | Use Case |
|---------|----------|----------|
| **SMS** | Critical | Registration confirmation, payment receipt, day-before reminder, venue changes |
| **WhatsApp** | High | Rich message cards, two-way messaging, Google Maps links |
| **Email** | Standard | Detailed confirmations, invoices, certificates |
| **Push** | Nice-to-have | Admin alerts (big payment, capacity reached) |

### Broadcast System
- Select audience: all registrants, confirmed only, specific sport items
- Choose channel: email, SMS, WhatsApp, or all
- Schedule: send now or later
- Track delivery: sent, delivered, read, bounced

### Automated Reminder Schedule (configurable per event)
1. 1 week before: Event preview
2. 3 days before: What to bring, parking info
3. 1 day before: QR code + directions
4. 2 hours before: Gates opening reminder
5. 1 day after: Thank you + feedback link

---

## 7. Post-Event Features

### 7.1 Results & Leaderboards
- Public Results tab on Event Detail (when status = completed)
- Final standings, bracket results, winners
- Shareable result cards for social media

### 7.2 Certificate Generation
- Template system: participant name, event, sport, position, date, logo
- PDF generation (PDFKit or Puppeteer)
- Bulk generate + email delivery
- Download in participant dashboard

### 7.3 Feedback Collection
New **Feedback** collection:
```js
{
  eventId, userId, registrationId,
  overallRating: Number,        // 1-5
  organizationRating: Number,
  venueRating: Number,
  valueForMoneyRating: Number,
  comments: String,
  wouldRecommend: Boolean
}
```
- Public feedback form (unique link per registration)
- Admin dashboard with aggregated scores + charts
- Auto-convert positive feedback to Testimonials

### 7.4 Post-Event Reports (auto-generated)
- Total registrations vs capacity utilization
- Check-in rate (arrived vs registered)
- Revenue vs target
- Demographic breakdown
- Feedback score summary
- Exportable as PDF

---

## 8. Analytics & Reporting

### Dashboard Charts (for CEO)
| Chart | Type | Data Source |
|-------|------|------------|
| Registration trend | 7-day area chart | `registrations.createdAt` |
| Revenue by month | Bar chart (6 months) | `registrations.payment.paidAt` |
| Revenue by category | Donut chart | Join events.category + payments |
| Sport item popularity | Horizontal bars | `sportItems.registrationCount` |
| Capacity utilization | Heatmap | Registrations vs capacity |
| Payment status | Pie chart | `registrations.payment.status` |
| Registration funnel | Funnel viz | Page views → registrations → payments |

### Per-Event Analytics Tab (7th tab in Event Editor)
- Registration timeline (cumulative line chart)
- Sport item breakdown (horizontal bars)
- Payment status donut
- Registration conversion funnel

### Automated Reports
- **Monthly business summary**: Revenue, events, registrations, top performers (auto-emailed to CEO on 1st of month)
- **Per-event P/L**: Generated when event status → completed
- **GST report**: Monthly tax summary for accountant

---

## 9. CRM-Lite for Corporate Clients

New **CorporateClient** collection:
```js
{
  companyName: String,
  industry: String,
  contactName: String,
  contactEmail: String,
  contactPhone: String,
  address: String,
  notes: String,
  lastContactDate: Date,
  status: String,           // "lead" | "active" | "churned"
  source: String,           // "website" | "referral" | "cold-call"
  createdBy: ObjectId
}
```

### CRM Features
- Client database with search
- Activity log per client (calls, emails, meetings)
- Follow-up reminders
- Proposal tracking (Sent → Negotiating → Won → Lost)
- Client satisfaction scores (from feedback)
- Link events to corporate clients

---

## 10. UI/UX Improvements

### 10.1 Navigation Redesign
```
OVERVIEW
  ● Dashboard

CONTENT
  ● Pages        ▸
  ● Testimonials
  ● Media Library

EVENTS
  ● Events       ▸
  ● Registrations ▸
  ● Sport Items

FINANCE
  ● Payments
  ● Invoices
  ● Expenses

REPORTS
  ● Analytics
  ● Reports

SETTINGS
  ● Site Settings
  ● Users & Roles
```
- Grouped navigation (not flat list)
- Contextual sub-nav when inside an event
- Breadcrumbs on every page
- Cmd+K quick search

### 10.2 Events Manager Enhancements
- Add Registrations count + Revenue columns inline
- Capacity progress bar per event
- Calendar view toggle (month view with event bars)
- Event cloning (duplicate as template)
- Event creation wizard (3-step guided flow)

### 10.3 Bulk Operations
- Checkbox column on registrations table
- Floating action bar: "5 selected [Approve All] [Reject All] [Email] [X]"
- Batch CSV import/export

### 10.4 Responsive Admin (Mobile)
- Sidebar → hamburger menu overlay on mobile
- Tables → card-based lists
- Mobile check-in page (dedicated route)
- Bottom tab bar: Dashboard, Events, Registrations, More

### 10.5 Accessibility
- Keyboard navigation with visible focus rings
- Light mode toggle (dark ↔ light)
- Sortable table columns
- Saved filter views
- 5-second undo toast instead of confirmation modals
- Contrast fix: increase `--dim` from `#666` to `#888`

---

## 11. New Collections Summary

| Collection | Purpose | Priority |
|-----------|---------|----------|
| `Match` / `Fixture` | Tournament brackets, scores, results | P2 |
| `EventUpdate` | Live event status updates | P2 |
| `Expense` | Per-event cost tracking | P4 |
| `Invoice` | Corporate invoicing with GST | P4 |
| `PromoCode` | Discount codes | P5 |
| `Feedback` | Post-event ratings | P7 |
| `CorporateClient` | CRM client records | P7 |
| `Activity` | Interaction logging | P7 |
| `AuditLog` | Who did what, when | P5 |

Added to existing 9 = **18 total collections**.

---

## 12. Implementation Priority

| Phase | Weeks | What | Business Impact |
|-------|-------|------|----------------|
| **A** | 1-3 | CEO Dashboard (revenue, live events, pipeline, velocity) | Transforms blind → informed |
| **B** | 4-6 | Financial controls (expenses, P/L, invoices, outstanding payments) | GST compliance, prevents surprises |
| **C** | 7-8 | Role-based access (7 roles, event assignment, permission middleware) | Unblocks 15-person team |
| **D** | 9-10 | Check-in system + match management | Enables day-of operations |
| **E** | 11-12 | Analytics deep-dive + CRM-lite | Drives growth decisions |
| **F** | 13-14 | Communication system (SMS, WhatsApp, broadcasts) | Reaches 95% of Indian participants |
| **G** | 15-16 | Post-event (results, certificates, feedback) | Turns one-time → repeat customers |
| **H** | 17-18 | Reports, mobile admin, promo codes | Polish and optimization |

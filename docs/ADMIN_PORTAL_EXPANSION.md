# TriCore Events — Admin Portal Expansion Plan

Last updated: 28 March 2026

---

## Key Decisions from Stakeholder Review

1. **Admin and Business Owner are the SAME person** — no separate CEO role needed. The Admin IS the business owner.
2. **Waitlist auto-promotion + player transfers** — overkill for now, removed from scope.
3. **Check-in (QR codes)** — optional feature, configurable per event in event setup. Not mandatory.
4. **Post-event lifecycle** — good to have, only works if the organizer feeds in data. Not automated.
5. **Multi-channel comms (SMS/WhatsApp)** — must be configurable from admin Settings, not hardcoded.
6. **Calendar view** — must incorporate Indian public holidays AND major sports schedules (IPL, ISL, PKL, etc.).

---

## 1. Role-Based Access Control

### Current: 2 roles (admin, editor)
### Needed: 6 roles (Admin = Business Owner)

| Role | Sees | Can Do | Cannot Access |
|------|------|--------|---------------|
| **Admin (Business Owner)** | Everything — all events, revenue, analytics, CMS, settings, users | Full system control, assign events to managers, financial reports, analytics dashboard | Nothing restricted |
| **Event Manager** | Only their assigned events, registrations, sport items, revenue summary | Edit event details, manage sport items, approve registrations, send communications | Other managers' events, CMS, site settings, user management, global financial reports |
| **Sports Coordinator** | Assigned sport items within events | Update match results/scores, manage fixtures, venue allocation | Event-level config, pricing, financial data, CMS |
| **Registration Manager** | Registrations for assigned events, check-in tools | Approve/reject, manage waitlist, bulk import, check-in | Event config, CMS, financial authorization |
| **Finance / Accounting** | Payment reports, invoices, expenses, tax summaries | Generate reports, authorize refunds, create invoices, reconcile payments | CMS, event operations, match results |
| **Content Editor** | CMS pages, media library, testimonials, event marketing copy | Edit page sections, upload images | Registration data, financial data, pricing, user management |

### Implementation
- Extend `User.role` enum to 6 values
- Add `User.assignedEvents: [ObjectId]` for scoped access
- Replace `roleGuard.js` with permission-based middleware
- Admin sidebar dynamically shows/hides items per role
- `AuditLog` collection for tracking who did what

---

## 2. Admin Dashboard (Business Owner View)

The Admin IS the business owner. When they log in, they see everything:

```
┌──────────────────────────────────────────────────────────────┐
│ SIDEBAR (grouped)  │ TOP: Dashboard     [Cmd+K] [🔔 3] [👤] │
│                    ├────────────────────────────────────────┤
│ OVERVIEW           │                                        │
│ ● Dashboard        │ ALERT BANNER (conditional)             │
│                    │ "3 registrations pending"    [Review]   │
│ CONTENT            │                                        │
│ ● Pages       ▸   │ ROW 1: STAT CARDS (5)                  │
│ ● Testimonials     │ ┌───────┐┌───────┐┌───────┐┌───────┐┌───────┐
│ ● Media Library    │ │REG    ││REVENUE││ACTIVE ││PENDING││CAPAC- │
│                    │ │TODAY  ││THIS MO││EVENTS ││APPROV ││ITY    │
│ EVENTS             │ │ 12    ││₹45.2K ││ 6     ││ 3     ││ 72%   │
│ ● Events      ▸   │ │+4 ↑  ││+18% ↑ ││2 live ││       ││avg    │
│ ● Calendar    ★    │ └───────┘└───────┘└───────┘└───────┘└───────┘
│ ● Registrations ▸  │                                        │
│                    │ ROW 2: CHARTS (2-column)               │
│ FINANCE            │ ┌────────────────┐┌────────────────┐  │
│ ● Payments         │ │REG TREND (7d)  ││REVENUE (6 mo)  │  │
│ ● Invoices         │ │sparkline chart  ││bar chart       │  │
│ ● Expenses         │ └────────────────┘└────────────────┘  │
│                    │                                        │
│ REPORTS            │ ROW 3: THREE-COLUMN                    │
│ ● Analytics        │ ┌────────┐┌─────────┐┌────────────┐  │
│ ● Reports          │ │CALENDAR││PENDING  ││ACTIVITY    │  │
│                    │ │PREVIEW ││ACTIONS  ││FEED        │  │
│ SETTINGS           │ │(mini   ││         ││            │  │
│ ● Site Settings    │ │month   ││3 regs   ││Admin User  │  │
│ ● Users & Roles    │ │view    ││awaiting ││approved    │  │
│ ● Notifications ★  │ │with    ││         ││#TRI-0849   │  │
│                    │ │dots)   ││1 event  ││2 min ago   │  │
│                    │ │        ││at 90%   ││            │  │
└────────────────────┴────────────────────────────────────────┘
```

★ = New items

---

## 3. Calendar View — The Smart Calendar

This is a KEY feature. Not just a list of TriCore events — it's a **contextual calendar** that shows:

### What Appears on the Calendar

| Source | Color | Purpose |
|--------|-------|---------|
| **TriCore Events** | Gold (#D4AF37) | Your events — clickable, shows details |
| **Indian Public Holidays** | Red | Gazetted holidays — Diwali, Holi, Independence Day, Republic Day, etc. (API or hardcoded list) |
| **IPL Schedule** | Purple | When IPL matches happen, which city — avoid scheduling conflicts |
| **ISL / PKL / Other** | Blue | Indian Super League, Pro Kabaddi, etc. — major sports clashes |
| **Registration Deadlines** | Orange dot | When your event registrations open/close |
| **State Holidays** | Pink | State-specific holidays (configurable by selecting state: Karnataka, Maharashtra, etc.) |

### Calendar Data Sources

```js
// Admin Settings → Notifications & Calendar (new settings tab)
calendarConfig: {
  showPublicHolidays: Boolean,      // default: true
  state: String,                     // "Karnataka", "Maharashtra", etc.
  showIPL: Boolean,                  // default: true
  showISL: Boolean,                  // default: false
  showPKL: Boolean,                  // default: false
  customCalendars: [{
    name: String,                    // "Company Holidays"
    url: String,                     // iCal URL or JSON feed
    color: String
  }]
}
```

### Data Sources for Sports Schedules
- **IPL**: CricketAPI or manual JSON feed updated seasonally
- **Public Holidays**: India public holiday API (calendarific.com or hardcoded JSON per year)
- **State Holidays**: Configurable per state selection in admin settings

### Calendar UI

```
┌─────────────────────────────────────────────────────────┐
│  MARCH 2026                    [◀ Month ▶] [Week] [Day] │
├───┬───┬───┬───┬───┬───┬───────────────────────────────┤
│Mon│Tue│Wed│Thu│Fri│Sat│Sun                              │
├───┼───┼───┼───┼───┼───┼───┤
│ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │
│   │   │   │   │   │   │   │
│   │   │   │   │   │WFL│WFL│  ← Weekend Football League
│   │   │   │   │   │🟡 │🟡 │    (gold bar spanning days)
├───┼───┼───┼───┼───┼───┼───┤
│ 8 │ 9 │10 │11 │12 │13 │14 │
│   │   │   │   │   │   │🔴 │  ← Holi (red = public holiday)
│   │   │   │   │   │   │   │
│🟣 │🟣 │   │   │   │🟣 │🟣 │  ← IPL matches (purple dots)
│CSK│MI │   │   │   │RCB│KKR│    with team abbreviations
├───┼───┼───┼───┼───┼───┼───┤
│15 │16 │17 │18 │19 │20 │21 │
│🟡━━━━━━━━━━━━━━━━━━━━━🟡│  ← PCL S4 (gold bar, 6 days)
│PCL│   │   │   │   │PCL│   │
│🟠 │   │   │   │   │   │   │  ← Reg deadline (orange dot)
├───┼───┼───┼───┼───┼───┼───┤
│22 │23 │24 │25 │26 │27 │28 │
│   │   │   │   │   │   │   │
│   │🟣 │   │🟣 │   │🟣 │   │  ← IPL continues
│   │DC │   │SRH│   │GT │   │
└───┴───┴───┴───┴───┴───┴───┘

LEGEND:
🟡 TriCore Events    🔴 Public Holiday    🟣 IPL Match
🟠 Reg Deadline      🔵 ISL/PKL           🩷 State Holiday
```

### Features
- Click a TriCore event → opens event detail/editor
- Click a holiday → shows holiday name + info
- Click an IPL match → shows teams, venue, time
- Hover on a day → tooltip with all items
- Create event → opens event creation wizard with date pre-filled
- **Conflict warning**: if you try to create an event on a day with IPL/holiday, show warning "IPL match in Bangalore on this date — potential audience conflict"
- Toggle visibility of each calendar source via checkboxes in sidebar
- Month/Week/Day views

---

## 4. Notification Settings (Admin Configurable)

New Settings tab: **Notifications & Communications**

```
┌─────────────────────────────────────────────────────────┐
│  Site Settings                                          │
│  [Branding] [Theme] [Navigation] [Footer] [Contact]    │
│  [Notifications & Comms] ★                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  EMAIL CONFIGURATION                                    │
│  ┌─────────────────┬─────────────────┐                 │
│  │ SMTP Host       │ SMTP Port       │                 │
│  │ smtp.gmail.com  │ 587             │                 │
│  ├─────────────────┼─────────────────┤                 │
│  │ Email From      │ Reply-To        │                 │
│  │ noreply@tricore │ hello@tricore   │                 │
│  └─────────────────┴─────────────────┘                 │
│  ● Enable email notifications  [ON]                     │
│                                                         │
│  SMS CONFIGURATION                                      │
│  ┌─────────────────┬─────────────────┐                 │
│  │ Provider        │ API Key         │                 │
│  │ [MSG91 ▾]       │ ••••••••••      │                 │
│  ├─────────────────┼─────────────────┤                 │
│  │ Sender ID       │ Template ID     │                 │
│  │ TRICOR          │ 12345           │                 │
│  └─────────────────┴─────────────────┘                 │
│  ● Enable SMS notifications  [OFF]                      │
│                                                         │
│  WHATSAPP CONFIGURATION                                 │
│  ┌─────────────────┬─────────────────┐                 │
│  │ Provider        │ API Key         │                 │
│  │ [Gupshup ▾]     │ ••••••••••      │                 │
│  ├─────────────────┼─────────────────┤                 │
│  │ Business Number │ Template Namespace│                │
│  │ +91 98765 43210 │ tricore_events  │                 │
│  └─────────────────┴─────────────────┘                 │
│  ● Enable WhatsApp notifications  [OFF]                 │
│                                                         │
│  NOTIFICATION TRIGGERS                                  │
│  Configure which events send notifications:             │
│  ┌────────────────────────────┬───┬───┬────┐           │
│  │ Trigger                    │📧│📱│💬│           │
│  ├────────────────────────────┼───┼───┼────┤           │
│  │ Registration confirmed     │ ✓ │ ✓ │ ✓  │           │
│  │ Payment received           │ ✓ │ ✓ │ ○  │           │
│  │ Registration approved      │ ✓ │ ○ │ ○  │           │
│  │ Event reminder (1 day)     │ ✓ │ ✓ │ ✓  │           │
│  │ Event reminder (1 week)    │ ✓ │ ○ │ ○  │           │
│  │ Schedule/venue change      │ ✓ │ ✓ │ ✓  │           │
│  │ Event completed (feedback) │ ✓ │ ○ │ ○  │           │
│  │ Registration cancelled     │ ✓ │ ○ │ ○  │           │
│  └────────────────────────────┴───┴───┴────┘           │
│  ✓ = enabled  ○ = disabled                             │
│                                                         │
│  CALENDAR INTEGRATION                                   │
│  ┌─────────────────────────────────────┐               │
│  │ State (for holidays): [Karnataka ▾] │               │
│  │ ● Show public holidays     [ON]     │               │
│  │ ● Show IPL schedule        [ON]     │               │
│  │ ● Show ISL schedule        [OFF]    │               │
│  │ ● Show PKL schedule        [OFF]    │               │
│  └─────────────────────────────────────┘               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Check-In System (Optional per Event)

### Configurable in Event Setup

In the Event Editor → Basic Info tab, add:

```
OPTIONAL FEATURES
● Enable check-in system    [OFF]
  └ When enabled:
    ● Generate QR codes for registrations  [ON]
    ● Allow manual check-in               [ON]
    ● Send QR code via email              [ON]
    ● Send QR code via SMS                [OFF]
```

When enabled:
- Registration confirmation includes a QR code
- Admin gets a "Check-In" button on the event page
- Mobile check-in page at `/admin/events/:id/check-in`
- Check-in dashboard shows arrived vs expected count

When disabled:
- No QR codes generated
- No check-in dashboard
- Registration flow works exactly as before

---

## 6. Post-Event Features (Organizer-Fed Data)

These features only work when the organizer manually inputs data. No auto-generation.

### What the organizer can do (after event is marked "completed"):

1. **Upload Results** — Enter final standings, winners for each sport item. Only shows on public page if organizer fills it in.

2. **Upload Photos** — Bulk upload event gallery. Optional.

3. **Generate Certificates** — Only if organizer uploads a certificate template and clicks "Generate." Not automatic.

4. **Request Feedback** — Organizer clicks "Send Feedback Request" → emails go out with survey link. Optional action, not automatic.

5. **Write Post-Event Report** — Rich text editor for the organizer to write a summary. Published to the event detail page if they choose.

### Key Principle
Nothing is automated or mandatory. The organizer decides what to do after an event. The system just provides the tools if they want to use them.

---

## 7. Financial Management

### New Screens for Admin (Business Owner)

| Screen | What it Shows |
|--------|-------------|
| **Payments** | All payments with status (Paid/Pending/Failed/Refunded), filter by event/date/status |
| **Outstanding** | Who hasn't paid — grouped by event, with "Send Reminder" button |
| **Invoices** | Generate + track invoices for corporate clients (PDF with GST) |
| **Expenses** | Per-event expense tracking (venue, equipment, catering, etc.) |
| **P/L Report** | Per event: Revenue - Expenses = Profit |
| **GST Report** | Monthly tax summary for accountant (exportable) |

---

## 8. Registration Enhancements (Kept in Scope)

| Feature | Status | Notes |
|---------|--------|-------|
| Waitlist auto-promotion | ❌ Removed | Overkill — manual waitlist management is enough |
| Player transfers | ❌ Removed | Overkill — handled manually by admin |
| Early bird pricing | ✅ Keep | Time-based pricing tiers per sport item |
| Promo codes | ✅ Keep | Essential for marketing and sponsors |
| Bulk CSV import | ✅ Keep | Critical for corporate registrations |
| Registration amendments | ✅ Keep | Admin can edit registration details post-payment |

---

## 9. Updated Navigation (Grouped Sidebar)

```
OVERVIEW
  ● Dashboard

CONTENT
  ● Pages        ▸    (expandable: Home, About, Corporate, Events, Contact)
  ● Testimonials
  ● Media Library

EVENTS
  ● Events       ▸    (expandable: shows recent events by name)
  ● Calendar     ★    (Smart Calendar with holidays + sports)
  ● Registrations ▸   (expandable: All, Pending badge)

FINANCE
  ● Payments
  ● Invoices
  ● Expenses

REPORTS
  ● Analytics
  ● Reports

SETTINGS
  ● Site Settings      (now with Notifications tab)
  ● Users & Roles  ★
```

---

## 10. Implementation Priority (Revised)

| Phase | Weeks | What | Why |
|-------|-------|------|-----|
| **A** | 1-3 | Admin Dashboard (revenue, charts, pipeline, activity feed) | Business visibility |
| **B** | 4-5 | Calendar View (TriCore events + Indian holidays + IPL/ISL/PKL) | Scheduling intelligence |
| **C** | 6-7 | Role-based access (6 roles, event assignment, permission middleware) | Team delegation |
| **D** | 8-9 | Financial screens (payments, invoices, expenses, P/L) | Business controls |
| **E** | 10-11 | Notification settings (configurable email/SMS/WhatsApp from admin) | Communication |
| **F** | 12-13 | Optional check-in + post-event tools | Operations |
| **G** | 14-15 | Analytics + reports + promo codes | Growth |
| **H** | 16 | Mobile responsive admin | On-ground ops |

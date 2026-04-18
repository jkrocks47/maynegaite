# Maynegaite POA Community Portal

**The official web platform for the Maynegaite Property Owners Association** — a 197-lot community in Olympia Fields, Illinois. The portal brings residents, the board, committees, and community operations into a single, secure website.

This README is written for **board members and committee leadership**. Its goal is to prepare you to use every area of the site confidently — from publishing an event to reviewing an architectural request to sending a community-wide announcement.

---

## Table of Contents

1. [What the Portal Is](#1-what-the-portal-is)
2. [Roles & Permissions](#2-roles--permissions)
3. [Public Site — What Every Visitor Sees](#3-public-site--what-every-visitor-sees)
4. [Resident Member Experience](#4-resident-member-experience)
5. [Board & Admin Panel](#5-board--admin-panel)
6. [Governance Tools (Architectural + Violations)](#6-governance-tools-architectural--violations)
7. [Events, RSVPs & Check-In](#7-events-rsvps--check-in)
8. [Communications — Email, Announcements, Contact](#8-communications--email-announcements-contact)
9. [Documents, Gallery & Site Content](#9-documents-gallery--site-content)
10. [Property Database](#10-property-database)
11. [Security & Audit Trail](#11-security--audit-trail)
12. [Technology Summary](#12-technology-summary)
13. [Getting Started (Board Onboarding)](#13-getting-started-board-onboarding)
14. [Quick Reference](#14-quick-reference)

---

## 1. What the Portal Is

A full-featured community platform that handles:

- **Public outreach** — board information, community history, events, photo gallery, and contact
- **Resident engagement** — member accounts, RSVPs, event check-in, profile and directory preferences
- **Board operations** — events, announcements, documents, officer profiles, editable site content
- **Governance** — architectural review workflow, violation reporting, full audit history
- **Community data** — 197-lot property database with owner mapping

Everything runs from one application, one database, and one set of logins. Content you change on the admin panel appears on the public site immediately.

---

## 2. Roles & Permissions

Access is controlled by two things: **whether someone is logged in** and **what admin role they hold**.

### User Types

| Type | Who | What They Can Do |
|------|-----|------------------|
| **Visitor** | No account | Read-only: homepage, about, events, gallery, board, documents, contact form |
| **Member** | Registered residents | Everything above + dashboard, RSVP, event check-in, profile |
| **Board** | Member flagged as board | Same as Member; marks them as board for internal views |
| **Admin** | Member assigned an admin role | Access to admin panel at `/admin` |

### Admin Roles

When a member is promoted, they get one of seven admin roles. Each role unlocks the admin panel; practical scope of duties is listed below. (Technically, most admin areas are open to any admin — the role signals responsibility, and the audit log records which admin acted.)

| Role | Typical Responsibilities |
|------|--------------------------|
| **Tech Admin** | System-wide: can assign any role, including other Tech Admins |
| **President** | Full operational access; can assign roles (cannot remove own role) |
| **Vice President** | Executive-level operational access |
| **Treasurer** | Financial documents, dues-related content |
| **Secretary** | Minutes, announcements, document uploads |
| **Architectural Chair** | Architectural review queue |
| **Board Member** | General board admin — events, announcements, members |

> **Rule of thumb:** Only Tech Admins and the President should be granting roles. Everyone else operates within their area.

### How to Promote a Member
`/admin/members` → search the member → open their detail page → set the role dropdown → save. The change is logged in the audit trail.

---

## 3. Public Site — What Every Visitor Sees

These pages require no login.

| Page | Path | Purpose |
|------|------|---------|
| **Home** | `/` | Upcoming events, pinned announcements, community info |
| **About** | `/about` | Maynegaite history, 197 lots, mission, community at-a-glance |
| **Events** | `/events` | All published events, filter by category |
| **Event Detail** | `/event/[id]` | Full event info, RSVP, check-in QR |
| **Gallery** | `/gallery` | Community photos with captions and credits |
| **Board** | `/board` | Officer profiles — photos, titles, bios, contact |
| **Documents** | `/documents` | Bylaws, covenants, minutes, newsletters, financials |
| **Owner Resources** | `/owner-resources` | Editable resource links, education section, school listings |
| **Contact** | `/contact` | Spam-protected form that emails the board |
| **Register / Login** | `/register`, `/login` | Account flows for residents |

Everything on these pages is editable from the admin panel — no developer needed for typical content changes.

---

## 4. Resident Member Experience

After a resident registers and verifies their email, they get:

**Dashboard (`/dashboard`)**
- Events attended in the last 6 months
- Upcoming events they've RSVP'd to
- Recent check-ins
- Community info shortcuts

**Profile (`/dashboard/profile`)**
- Name, phone, address, secondary email
- Lot number and section (Maynegaite Woods)
- **Directory opt-in** — whether they appear in any shared directory
- **Email opt-out** — unsubscribe from announcements/reminders (security emails always send)
- Profile photo upload (auto-optimized to WebP)

**Event Actions**
- RSVP (Going / Maybe / Not Going)
- Self-check-in at events via QR code

**Account Security**
- Email verification (24-hour token)
- Forgot-password flow (1-hour token)
- 30-day sliding sessions

### Registration Protections
Every registration passes through: honeypot fields, rate limiting, a proof-of-work challenge, submission-timing validation, and a spam content filter. Board members will rarely see bot signups make it through.

---

## 5. Board & Admin Panel

Entry point: **`/admin`** (visible only to users with an admin role).

### Admin Dashboard
- Membership statistics (total, verified vs unverified)
- Quick access to every admin section
- Role and permissions of the current user

### Admin Panel Sections

| Section | Path | What It Does |
|---------|------|--------------|
| **Members** | `/admin/members` | Search, filter, promote/demote, view contact info |
| **Events** | `/admin/events` | Create, edit, publish events; attendance analytics |
| **Gallery** | `/admin/gallery` | Upload photos, captions, photographer credits |
| **Officers** | `/admin/officers` | Board profiles shown on public `/board` page |
| **Announcements** | `/admin/announcements` | Homepage banners with pin + expiry scheduling |
| **Content** | `/admin/content` | Edit page text (homepage, about, footer, owner resources) |
| **Documents** | `/admin/documents` | Upload bylaws, minutes, financials, covenants |
| **Properties** | `/admin/properties` | 197-lot database with owner mapping |
| **Architectural** | `/admin/architectural` | Review queue for modification requests |
| **Violations** | `/admin/violations` | Reported violations and resolution tracking |
| **Poster** | `/admin/poster/[eventId]` | Printable event poster with QR code |
| **Changelog** | `/admin/changelog` | Complete audit log of admin actions |

### Member Management (`/admin/members`)
- Search by name or email
- Filter by section or role
- See each member's event-attendance history
- Click into any member to update their admin role
- View lot number and directory preference

---

## 6. Governance Tools (Architectural + Violations)

These are the two workflows that most directly represent the board's compliance responsibilities.

### Architectural Requests (`/admin/architectural`)

Residents submit requests for things like fences, paint changes, new construction, or landscaping. Each request has a **status lifecycle**:

`Submitted → Under Review → Approved / Denied / Revision Requested`

For every request you can see:
- Requester, property/lot, request type, description, attachments
- Reviewer notes
- Every status change, who made it, and when (audit log)

**Request Types:** Modification · New Construction · Fence · Landscaping · Paint · Other

The **Architectural Chair** owns this queue in practice; any admin can act, but the chair should be the one clearing items.

### Violation Reports (`/admin/violations`)

Community-reported issues with a similar lifecycle:

`Reported → Investigating → Resolved / Dismissed`

Each record captures reporter, affected property, description, resolution notes, and full audit history. Status changes can trigger email notifications.

**Violation Types:** Signage · Architectural · Maintenance · Noise · Other

### Why the Audit Trail Matters
Both systems write to `/admin/changelog`. For any item that ends up disputed, you have an immutable record of who did what and when. Treat the audit log as your legal-safety net — do not edit the database directly to change history.

---

## 7. Events, RSVPs & Check-In

### Creating an Event
`/admin/events` → **New Event**. Fill in:
- Title, description (Markdown supported), date, time
- Location + optional map URL
- **Category:** Community · Board Meeting · Village · Social · Maintenance
- Event image (auto-optimized)
- Max attendees (optional)
- **Custom check-in questions** — multi-type (text, select, checkbox); responses are saved per check-in
- Draft vs. publish toggle

The system auto-generates a **check-in code** and a **QR code** for each event.

### RSVP + Attendance Analytics
On any event page in the admin panel you see:
- Counts of Going / Maybe / Not Going
- Actual check-ins
- **Estimated turnout** — a prediction based on historical RSVP-to-check-in rates

### Event Day: Check-In
Two ways to check a resident in:
1. **QR code** — posted/printed at the venue; members scan with their phone
2. **Manual** — the check-in code can be entered at `/checkin/[eventId]`

The system prevents double check-ins and time-stamps every entry.

### Event Poster Generator (`/admin/poster/[eventId]`)
Produces a printable poster with event details and a QR code (RSVP mode or check-in mode). Useful for community boards, mailbox kiosks, and clubhouse postings.

### Reminders
Automatic emails send at **7 days out**, **1 day out**, and **day-of** to members who RSVP'd. Sends are logged in `reminder_logs` so members never receive duplicates.

---

## 8. Communications — Email, Announcements, Contact

### Announcements (`/admin/announcements`)
- Title, body, category
- **Pin to top** for high-priority items
- **Publish date** (schedule for the future)
- **Expiration date** (auto-retire the item)

Announcements show on the homepage and on the member dashboard.

### Email System
All email is sent via **Resend**. Categories:

| Email | Trigger | Opt-out? |
|-------|---------|----------|
| Email verification | Registration | No (security) |
| Password reset | `/forgot-password` | No (security) |
| Event reminders | 7d / 1d / day-of | Yes |
| Event announcements | Manual admin send | Yes |
| Event correction | Admin edits a published event | Yes |
| Contact form reply | Resident submits `/contact` | N/A |

Every opt-out-able email includes a one-click **unsubscribe link** with a per-member token, plus `List-Unsubscribe` headers so email clients can unsubscribe natively.

### Contact Form (`/contact`)
Routes to the board email list. Protected by the same five-layer spam defense as registration.

---

## 9. Documents, Gallery & Site Content

### Documents (`/admin/documents`)
Upload records for: **Bylaws · Covenants · Minutes · Newsletter · Financial · Other**. Each document stores title, description, category, publication date, and a URL to the file (documents are linked, not stored as binaries).

### Gallery (`/admin/gallery`)
Photos with caption, photographer credit, and optional link to a specific event. Images are auto-converted to WebP with a thumbnail variant so the public gallery loads fast.

### Site Content Editor (`/admin/content`)
Edit page text without touching code. Sections are grouped by page (homepage, about, footer, owner resources, education/school listings). Changes are live immediately and recorded in the audit log.

### Officer Profiles (`/admin/officers`)
Powers the public `/board` page. Each officer has name, position, bio, email, photo, and a sort order for display.

---

## 10. Property Database

`/admin/properties` is the canonical list of all **197 Maynegaite lots**. For each lot:

- Lot number, address, section (Woods)
- Property type (single-family / townhome)
- Assigned owner (links to a member account)
- Occupancy tracking

This database feeds architectural requests and violation reports — when a resident submits either, the system ties the submission to their lot automatically.

---

## 11. Security & Audit Trail

### Multi-Layered Bot & Spam Defense
Every public form (registration, contact, password reset) passes through:
1. **Honeypot fields** — hidden, invisible to humans
2. **Rate limiting** — tiered per endpoint (auth: 5–10/hr, contact: 3/hr)
3. **Proof-of-work** — browser CPU challenge
4. **Submission timing** — rejects sub-500ms fills
5. **Spam content filter** — keyword and pattern detection

### Authentication Security
- Passwords hashed with **bcrypt** (12 salt rounds)
- Sessions: random 64-char tokens, HttpOnly + Secure + SameSite cookies
- 30-day sliding expiry
- Required email verification before sensitive actions

### Data Protection
- All user input validated with **Zod** schemas
- HTML content sanitized before display
- File uploads validated by content, not just MIME type
- Database access through an ORM — parameterized queries, no SQL injection surface

### Audit Log (`/admin/changelog`)
Every administrative action — create, update, delete, status change, review — is logged with actor, entity, timestamp, and details. The audit log is append-only; board members should rely on it for compliance and dispute resolution.

---

## 12. Technology Summary

*(Included so board members can answer basic questions and know what the project depends on. No technical action required from you.)*

| Category | Technology |
|----------|-----------|
| **Framework** | SvelteKit 2.0 + Svelte 5 |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL + Drizzle ORM |
| **Styling** | Tailwind CSS (Maynegaite palette: forest green, gold, parchment) |
| **Email** | Resend |
| **Images** | Sharp (WebP optimization) + PostgreSQL bytea storage |
| **QR Codes** | `qrcode` library |
| **Hosting** | Node.js 22 |

---

## 13. Getting Started (Board Onboarding)

### Your First Login
1. An existing admin creates your account (or you register at `/register`).
2. An existing admin promotes you to the correct role at `/admin/members`.
3. Verify your email (check your inbox).
4. Visit `/admin` — you should see the admin dashboard.

### First-Week Checklist for New Board Members

- [ ] Log in and verify `/admin` loads
- [ ] Click into every sidebar item — get familiar with the layout
- [ ] Review the current announcement list and note which are pinned
- [ ] Review the current event list and confirm drafts vs. published
- [ ] Open `/admin/architectural` and skim open requests
- [ ] Open `/admin/violations` and skim open reports
- [ ] Open `/admin/changelog` to understand the audit trail
- [ ] Update your own profile photo and bio so you appear correctly on the public `/board` page (edit via `/admin/officers` if needed)

### When in Doubt
- **Don't delete.** Archive by unpublishing, or change status. Deletes cannot be undone cleanly.
- **Check the audit log.** If something looks wrong, `/admin/changelog` tells you who changed what.
- **Ask the Tech Admin** before modifying roles or touching settings outside your area.

---

## 14. Quick Reference

### Common Board Tasks

| Task | Where |
|------|-------|
| Post an event | `/admin/events` → New Event |
| Send an announcement | `/admin/announcements` → New |
| Approve a fence request | `/admin/architectural` → open item → Approve |
| Log a violation resolution | `/admin/violations` → open item → Resolve |
| Upload meeting minutes | `/admin/documents` → New Document |
| Add a new board member photo | `/admin/officers` |
| Change homepage text | `/admin/content` |
| Promote a resident to admin | `/admin/members` → member → role dropdown |
| Generate an event poster | `/admin/poster/[eventId]` |
| See who did what, when | `/admin/changelog` |

### Key Paths for Residents

| Task | Where |
|------|-------|
| Register | `/register` |
| Log in | `/login` |
| RSVP | `/event/[id]` |
| Check in at an event | Scan QR or `/checkin/[eventId]` |
| Update profile / opt out of email | `/dashboard/profile` |
| Reset password | `/forgot-password` |

---

*Maintained by the Maynegaite Property Owners Association. For technical issues, contact the site's Tech Admin. For governance questions, contact the Board President.*

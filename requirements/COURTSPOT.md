# CourtSpot — Requirements Freeze

**Date:** 2026-08-07
**Status:** Frozen ✅
**Target Duration:** 2–3 days
**Purpose:** Portfolio project for job hunt

---

## 1. Restate the Feature

CourtSpot is an Airbnb-style sports court booking platform targeting the Philippines. Court owners list their facilities; players browse, filter, and book hourly time slots with integrated PH payment methods. The platform covers Metro Manila and supports Basketball, Badminton, Tennis, and Futsal courts. The product is a full-stack web application built as a portfolio showcase.

---

## 2. Business Goal

**Why it exists:** To demonstrate full-stack web development capability across the complete booking lifecycle — discovery, reservation, and payment — in a realistic, market-relevant product context.

**Who will use it:** Two user roles — Bookers (players looking for courts) and Court Owners (facility operators listing courts). Interviewers are the secondary audience who will interact with a live demo.

**Business problem solved:** Court booking in the Philippines is largely informal (calls, Facebook groups). CourtSpot centralizes discovery and real-time availability with local payment support.

---

## 3. Scope

### In Scope

- User registration and authentication (Booker and Court Owner roles)
- Court listing creation and management by owners
- Court discovery via search, location filter, sport filter, price filter, and availability date filter
- Hourly time slot booking flow (3 steps: slot selection → review → payment)
- PayMongo payment integration in test mode (GCash, Maya, credit/debit cards)
- Booking confirmation and booker dashboard showing booking history
- Court owner dashboard: listing CRUD, bookings table, earnings summary
- Reviews and star ratings (unlocked after completed bookings only)
- Photo uploads via Cloudinary
- Prisma seed script with 15 realistic Metro Manila courts
- Mobile-first responsive UI
- Deployment on Vercel + MongoDB Atlas
- Demo credentials in README for interviewer access

### Out of Scope

- Map-based court search (full map search with pins)
- Real-time WebSocket availability updates
- In-app messaging between owners and bookers
- Admin approval flow for court owner accounts
- Payout management for owners
- Multi-day or partial-hour bookings
- Photo uploads on reviews
- Native mobile app (iOS/Android)
- Volleyball, swimming, and other sports (marked "coming soon")
- Calendar view on owner dashboard
- Live PayMongo transactions (test mode only)

---

## 4. User Roles

### Booker
- Can register via Google OAuth or email/password
- Selects "I want to book courts" during onboarding
- Can search, filter, and view all court listings
- Can book hourly slots and pay via PayMongo
- Can leave a star rating + text review only after a completed booking
- Can view their booking history in a personal dashboard
- Cannot access court owner dashboard

### Court Owner
- Can register via Google OAuth or email/password
- Selects "I want to list my court" during onboarding
- Can create, edit, and delete their own court listings
- Can upload court photos via Cloudinary
- Can view all bookings made on their courts
- Can view earnings summary (total revenue, total bookings)
- Cannot book other courts under the same account
- No admin approval required — role is self-assigned at registration

---

## 5. Functional Requirements

### Registration & Authentication
- Users sign up with Google OAuth or email/password via NextAuth.js
- During onboarding, users choose a role: Booker or Court Owner
- Role is stored on the user record and controls route access
- Sessions are managed by NextAuth.js

### Court Discovery (Booker)
- Bookers land on a search/browse page showing court cards
- Filter options: sport type (Basketball, Badminton, Tennis, Futsal), city/area, price range (per hour), availability date
- Court cards display: court name, sport, location, price per hour, average rating, thumbnail photo
- Clicking a card navigates to the court detail page
- Court detail page shows: full photo gallery, description, sport type, full address, price per hour, operating hours, static Google Maps embed, average rating, all reviews

### Booking Flow (Booker)
**Step 1 — Slot Selection:**
- Booker selects a date using a date picker
- System fetches booked slots from the DB for that date
- Available 1-hour slots (e.g., 6AM–10PM) are shown; booked slots are disabled
- Booker selects one or more consecutive slots

**Step 2 — Review Summary:**
- Shows court name, selected date, selected time range, total price, and court owner info
- Booker confirms before proceeding to payment

**Step 3 — Payment:**
- Redirects to PayMongo checkout (test mode)
- Supports GCash, Maya, and credit/debit cards
- On payment success: booking is created in DB with status `confirmed`, booker is redirected to confirmation page
- On payment failure: booker is returned to the booking flow with an error message

### Booking Confirmation
- Confirmation page displays booking reference, court name, date, time, and total paid
- Booking is visible in the booker's dashboard

### Conflict Handling
- At payment confirmation, system checks if selected slots are still available
- If a conflict is detected (another user paid first), payment is rejected and booker sees an error prompting them to select different slots

### Booker Dashboard
- Lists all bookings: court name, date, time, status (confirmed / completed / cancelled), amount paid
- Completed bookings show a "Leave Review" button if no review has been submitted yet

### Reviews
- Booker can submit one review per completed booking
- Review consists of: star rating (1–5) and optional text
- Review is visible on the court detail page
- Court's average rating is recalculated on submission

### Court Listing Management (Owner)
- Owner can create a court listing with: name, sport type, city/area, full address, price per hour, operating hours (open/close time), description, photos (via Cloudinary)
- Owner can edit any field on their listing
- Owner can delete their listing (cascades to hide future availability; does not delete historical bookings)
- Photos are uploaded to Cloudinary; URLs are stored in MongoDB

### Owner Dashboard
- **Listings tab:** Table of owner's courts with edit/delete actions
- **Bookings tab:** Table of all bookings across owner's courts (court name, booker name, date, time, amount, status)
- **Earnings tab:** Total bookings count and total revenue (sum of confirmed + completed bookings)

### Seed Data
- Prisma seed script populates 15 courts across Metro Manila (BGC, Makati, QC, Pasig, Mandaluyong)
- Courts cover all 4 sports with realistic names, Unsplash photos, addresses, and pre-populated reviews
- Script runs via `prisma db seed`

---

## 6. Business Rules

- A booker can only leave one review per booking.
- Reviews can only be submitted after booking status is `completed`.
- A time slot cannot be booked by two users simultaneously — first-to-complete-payment wins.
- Owners can only edit or delete their own court listings.
- A court listing deletion does not remove historical booking records.
- Operating hours define the valid range for bookable slots (e.g., 6AM–10PM = 16 slots per day).
- Bookings are in 1-hour increments only.
- Multi-day bookings are not supported.
- Court owner role cannot be used to book courts.
- PayMongo is used in test mode only — no real money is charged.
- Demo seed account credentials must be documented in the README.

---

## 7. Status Flow

### Booking Status

```
pending (slot selected, awaiting payment)
     ↓
confirmed (PayMongo payment successful)
     ↓
completed (booking date/time has passed)
     ↓
cancelled (future: manual cancellation — out of scope for MVP)
```

**Transition conditions:**
- `pending → confirmed`: PayMongo webhook or redirect confirms payment success + no slot conflict
- `pending → failed`: Payment fails or slot conflict detected at payment time
- `confirmed → completed`: Booking datetime has elapsed (can be a background check or computed at query time)

---

## 8. Relationships

```
User → Bookings (one user has many bookings)
User → CourtListings (one owner has many courts)
CourtListing → Bookings (one court has many bookings)
CourtListing → Reviews (one court has many reviews)
Booking → Review (one booking has at most one review)
Booking → User (each booking belongs to one booker)
CourtListing → Photos (one court has many photo URLs)
```

---

## 9. Data Requirements

### User
- Email (required, unique)
- Name (required)
- Avatar URL (optional, from Google OAuth)
- Role: `booker` | `owner` (required)
- Provider: `google` | `credentials` (required)
- Created at (required)

### CourtListing
- Owner reference (required)
- Name (required)
- Sport: `basketball` | `badminton` | `tennis` | `futsal` (required)
- City/area (required)
- Full address (required)
- Price per hour in PHP (required, positive number)
- Operating hours: open time + close time (required)
- Description (optional)
- Photo URLs array (optional, stored as Cloudinary URLs)
- Average rating (computed from reviews)
- Review count (computed)
- Created at (required)

### Booking
- Booker reference (required)
- Court listing reference (required)
- Date (required)
- Start time (required)
- End time (required)
- Total price in PHP (required)
- Status: `pending` | `confirmed` | `completed` | `failed` (required)
- PayMongo payment reference ID (optional, set on confirmation)
- Created at (required)

### Review
- Booking reference (required, unique — one review per booking)
- Booker reference (required)
- Court listing reference (required)
- Star rating: 1–5 (required, integer)
- Text (optional)
- Created at (required)

---

## 10. API Impact

### New Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/[...nextauth]` | NextAuth handler |
| GET | `/api/courts` | List courts with filters (sport, city, price, date) |
| GET | `/api/courts/:id` | Get single court detail |
| POST | `/api/courts` | Create court listing (owner only) |
| PUT | `/api/courts/:id` | Update court listing (owner only) |
| DELETE | `/api/courts/:id` | Delete court listing (owner only) |
| GET | `/api/courts/:id/availability` | Get booked slots for a court on a given date |
| POST | `/api/bookings` | Create a pending booking |
| GET | `/api/bookings` | List booker's own bookings |
| POST | `/api/payments/checkout` | Initiate PayMongo checkout session |
| POST | `/api/payments/webhook` | PayMongo webhook to confirm payment + update booking |
| POST | `/api/reviews` | Submit a review (booker, completed booking only) |
| GET | `/api/owner/bookings` | List all bookings for owner's courts |
| GET | `/api/owner/earnings` | Earnings summary for owner |
| POST | `/api/upload` | Cloudinary photo upload handler |

---

## 11. UI Impact

### New Pages

| Page | Route | Role |
|---|---|---|
| Home / Landing | `/` | Public |
| Browse Courts | `/courts` | Public |
| Court Detail | `/courts/:id` | Public |
| Book Court | `/courts/:id/book` | Booker |
| Booking Confirmation | `/bookings/:id/confirmation` | Booker |
| Booker Dashboard | `/dashboard` | Booker |
| Owner Dashboard | `/owner/dashboard` | Owner |
| Create/Edit Listing | `/owner/listings/new`, `/owner/listings/:id/edit` | Owner |
| Sign In | `/auth/signin` | Public |
| Onboarding (role select) | `/auth/onboarding` | New users |

### Key UI Components
- Court card (search results)
- Time slot picker (date + available/unavailable slots)
- Booking summary panel
- PayMongo checkout redirect
- Star rating input (review form)
- Owner earnings summary cards
- Photo upload widget (Cloudinary)
- Sport filter chips
- Mobile-responsive navigation

---

## 12. Reporting Impact

### Owner Earnings Summary
- Total confirmed + completed bookings count
- Total revenue (PHP) across all owner courts
- Displayed on Owner Dashboard earnings tab

### Booker Booking History
- All bookings with status and amount
- Displayed on Booker Dashboard

---

## 13. Audit Impact

- Booking creation is logged with timestamp and PayMongo payment reference
- Review submission is tied to a specific booking (prevents duplicate reviews)
- Slot conflict is checked at payment time (implicit audit of concurrent access)

---

## 14. Edge Cases

- **Slot conflict:** Two bookers select the same slot simultaneously → first to complete payment wins, second receives a conflict error and is prompted to reselect
- **Payment failure:** PayMongo payment fails → booking remains `pending` and is not confirmed; booker sees error message
- **Court deleted with future bookings:** Listing deletion hides the court from search but does not delete historical booking records
- **Review on non-completed booking:** UI hides the review button; API rejects requests for non-completed bookings
- **Duplicate review attempt:** API rejects a second review for the same booking (unique constraint on booking reference)
- **Owner attempts to book:** Route guard redirects owners away from the booking flow
- **Empty search results:** Browse page shows a "No courts found" empty state with filter reset option
- **Operating hours boundary:** Slots outside open/close time range are never shown as available

---

## 15. Assumptions

- PayMongo test mode is sufficient — no real transactions are needed for the portfolio
- All prices are in Philippine Peso (PHP)
- Courts operate within a single day (no overnight bookings)
- Metro Manila is the only geographic scope for seed data
- "Completed" status is determined by whether the booking date/time has elapsed (computed, not manually set)
- One Cloudinary free account is sufficient for the portfolio volume of uploads
- Google Maps embed (static) is used on the court detail page — no Maps API key required for basic embeds

---

## 16. Risks

| Risk | Type | Mitigation |
|---|---|---|
| Prisma + MongoDB has no migration support | Compatibility | Use `prisma db push` throughout; document in README |
| PayMongo webhook requires a public URL | Integration | Use ngrok locally for testing; webhook fires automatically on Vercel deployment |
| Slot conflict under concurrent load | Performance | Acceptable for portfolio scale; conflict check at payment is sufficient |
| Cloudinary free tier limits | Performance | 25GB storage / 25GB bandwidth per month — safe for demo |
| MongoDB Atlas free tier (512MB) | Performance | Safe for 15 seeded courts + demo traffic |
| NextAuth session handling with MongoDB | Compatibility | Use `@auth/mongodb-adapter` for persistent sessions |
| 2–3 day scope creep | UX | Owner dashboard and review system are lower priority if time runs short — payment flow is the non-negotiable MVP |

---

## 17. Acceptance Criteria

- [ ] User can register as a Booker or Court Owner via Google OAuth or email/password
- [ ] User role is enforced — owners cannot access booking flow, bookers cannot access owner dashboard
- [ ] Booker can search courts filtered by sport, city, price range, and date
- [ ] Court detail page displays full information including static map and reviews
- [ ] Booker can select available hourly slots for a chosen date
- [ ] Booked slots are shown as disabled on the slot picker
- [ ] Booker completes 3-step flow: slot selection → review → PayMongo checkout
- [ ] Successful payment creates a confirmed booking visible in booker dashboard
- [ ] Slot conflict at payment time returns an error and does not create a duplicate booking
- [ ] Booker can submit one review per completed booking
- [ ] Review is visible on court detail page; average rating updates
- [ ] Owner can create, edit, and delete court listings with photo uploads
- [ ] Owner dashboard shows bookings table and earnings summary
- [ ] Seed script populates 15 courts with photos, reviews, and realistic PH data via `prisma db seed`
- [ ] All pages are mobile-first responsive
- [ ] App is deployed to Vercel with MongoDB Atlas
- [ ] README includes live URL and demo credentials

---

## 18. Open Questions

### Non-Blocking

| # | Question | Why It Matters | Suggested Default |
|---|---|---|---|
| 1 | Should a booker be able to cancel a confirmed booking? | Affects booking status flow and owner revenue | Out of scope for MVP; add "cancellation coming soon" note |
| 2 | Should owners be able to set per-slot pricing (peak/off-peak)? | Common in PH courts | Out of scope; flat hourly rate only |
| 3 | Should the site support Tagalog/Filipino localization? | Target market is PH | English only for MVP |
| 4 | Should bookings block the slot immediately on Step 1, or only on payment? | Affects UX under load | Block only on confirmed payment; handle via conflict check |

---

Requirements Frozen ✅
Ready for `/implementation-planner`

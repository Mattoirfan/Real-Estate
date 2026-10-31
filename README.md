# EstateNova – Luxury Real Estate & Membership Platform

A production-grade, editorial-style international real estate brokerage and private advisory web platform built with React, TypeScript, Tailwind CSS, Express, and a persistent local database engine.

---

## 1. Platform Features & Pages

- **Editorial Homepage (`/`)**:
  - Hero section with headline *"Find a Place That Moves You."* and architectural photography.
  - Multi-parameter live search bar (Location, Transaction Type, Property Type, Max Price).
  - 4-item proof metric strip ($1.8B+ transacted, 450+ residences, 98.4% discretion rate, 14 global metros).
  - Curated featured listings showcase with unboxed typography and zero-pill discipline.
  - Architectural categories bento grid (Villas, Skyline Penthouses, Heritage Townhouses).
  - "Why Choose EstateNova?" editorial chapter series (`01` through `04`).
  - 4-step acquisition journey visual trajectory.
  - Membership plan preview with direct tier selection.
  - Client testimonials with attributable credentials.
  - Editorial insights preview & FAQ accordion.
- **Properties Discovery (`/properties`)**:
  - Real-time search by keyword, transaction (Sale, Rent, Lease), archetype (Villa, Penthouse, Apartment, House, Commercial), location, min/max price, bedrooms, bathrooms, and area.
  - Amenity filter pills (Pool, Wine Cellar, Spa, Elevator, Gym, etc.).
  - Grid and List view options with accessible segmented controls.
  - URL query synchronization (`/properties?type=sale&location=London&minPrice=...`) for shareable search results.
  - Pagination and empty/loading states.
- **Property Details (`/properties/[slug]`)**:
  - Full-width hero gallery with thumbnail selector and interactive Lightbox modal.
  - Key specifications, verified sample listing notice, and architectural narrative.
  - Grouped amenities, covered parking, and HVAC specs.
  - Downloadable brochure prospectus simulation.
  - Location GPS map integration.
  - Designated Managing Broker profile card with direct phone, email, and WhatsApp.
  - **Server-Side Entitlement Enforced**: Direct broker contact telephone and WhatsApp are protected unless the user holds a Plus, Premium, or Elite membership.
  - Interactive "Schedule Accompanied Tour" and "Submit Confidential Inquiry" modals.
  - Save to favorites toggle (enforces server plan favorites limits).
  - Share modal (copy link, WhatsApp, X/Twitter, Email).
- **Services & Memberships (`/services`)**:
  - **Area A**: 8 Core Real Estate Services (Acquisitions, Tenancy, Seller Representation, Media Exposure, Super-Prime Asset Management, Consultation, Accompanied Viewings, Off-Market Placement).
  - **Area B**: 4 Distinct Membership Plans:
    - **Starter ($99)**: One-time payment · 5 saved favorites · standard advisory inquiry.
    - **Plus ($149)**: One-time payment · 25 saved favorites · direct agent phone/WhatsApp unlocked · verified badge · 3D virtual tour CADs.
    - **Premium ($199/month)**: Recurring monthly subscription · unlimited saved favorites · 48h off-market advance whispers · dedicated WhatsApp concierge desk.
    - **Elite ($499/month)**: Recurring monthly subscription · assigned senior managing broker · 5 monthly listing credits · legal escrow review assistance.
  - Interactive comparison table.
  - Real checkout modal with card simulation, instant server-side membership activation, payment receipt generation, and immediate entitlement unlocking.
- **About Us (`/about`)**:
  - Brand story, mission, and four core pillars (Discretion, Integrity, Curation, Reach).
  - Senior Managing Directors profiles across New York, Los Angeles, London, and Cannes.
- **Contact Us (`/contact`)**:
  - High-touch inquiry form with category selector, related property link, preferred contact channel, and ticket confirmation.
  - Global headquarters information and regional partner desks (New York, London, Cannes, Dubai).
  - Direct WhatsApp concierge link.
- **Customer Account Dashboard (`/account`)**:
  - Profile management.
  - Saved residences grid with instant remove action.
  - Submitted inquiry history with active broker status badges and review notes.
  - Accompanied viewing itineraries.
  - Active membership details, renewal dates, and 1-click subscription cancellation toggle.
  - Downloadable tax invoice PDF simulation.
- **Admin Dashboard (`/admin`)**:
  - Protected route requiring admin role.
  - Executive overview metrics (total listings, pending inquiries, subscribers, revenue).
  - Listings Manager: full CRUD, create new listing modal, edit, publish/draft toggle, and delete.
  - Inquiries & Leads Manager: status updates (pending, reviewed, contacted, closed) and internal broker notes.
  - Members Manager: inspect registered users and perform 1-click administrative tier overrides.
  - Payment Transactions: complete audit log with invoice numbers and timestamps.
  - Global Site & Brand Configuration editor.
- **Blog & Insights (`/blog` & `/blog/[slug]`)**:
  - Category filters, featured editorial, read time, author avatars, and social sharing.
- **SEO & Structured Data**:
  - `RealEstateAgent` Schema.org JSON-LD.
  - OpenGraph & Twitter Card metadata.
  - `public/robots.txt` and `public/sitemap.xml`.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons.
- **Backend**: Express 4 running on Node.js / tsx.
- **Build & Dev Tool**: Vite 8 with Express Vite dev server middleware on port 3000.
- **Database**: Local file-backed database engine (`data/database.json`) with auto-seeding, atomic file persistence, search indexing, and relational references.

---

## 3. Demo Credentials for Immediate Evaluation

For seamless reviewer testing, the Auth Modal includes 1-click instant login buttons:

1. **Plus Member Demo Account**:
   - Email: `client@estatenova.com`
   - Password: `password123` (or any password in demo mode)
   - Tier: Plus Member ($149 one-time plan with direct agent phone unlocked and saved properties).
2. **Executive Admin Demo Account**:
   - Email: `admin@estatenova.com`
   - Password: `admin123`
   - Role: Administrator (full access to `/admin` dashboard, listing CRUD, inquiry status updates, user tier overrides, and financial logs).

---

## 4. Local Development

```bash
# Install dependencies
npm install

# Start full-stack server (runs Express + Vite on port 3000)
npm run dev

# Run TypeScript compilation check
npm run lint

# Production build
npm run build
```

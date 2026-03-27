# RFP: RSVP Advertising Website Redesign & Offer Platform

## Executive Summary

RSVP Advertising is seeking proposals to redesign its website and supporting backend platform to better serve three core audiences:

1. **Consumers** searching for premium local offers ("luxury perks" vs. traditional couponing)
2. **Advertisers** who want more exposure, and desire for better attribution, and reporting on performance of RSVP Direct Mail products
3. **Franchisees** who need more qualified advertiser leads, better local SEO, and tools to manage market content and tools to report on advertiser performance

The new site must preserve current platform parity while delivering major enhancements in UX, SEO taxonomy, consumer engagement, offer discoverability, lead attribution, and franchisee enablement. The experience should be comparable to leading local offer platforms (e.g., Valpak/Money Mailer in terms of style of advertiser offer discovery including business profiles and measurable outcomes on interactions with business profile content).

---

## 1. Project Objectives

### Primary Business Objectives

- Brand re-fresh to more contemporary look and feel
- Grow consumer traffic and engagement across markets (search, offer feature, business profile, to the actions taken by consumers as a result of engagement with the profiles)
- Improve advertiser lead volume and lead quality for franchisees by focusing on better optimized local office/consultant pages
- Increase advertiser retention through measurable reporting and stronger digital presence
- Build scalable SEO architecture based on category of offers and geography taxonomy to surface advertiser offers for businesses near them
- Consolidate franchisee microsites into one unified platform with localized market pages in order to improve overall site SEO and retain more corporate control of sites and content

### User Experience Objectives

- Make it easy for consumers to find, save, redeem, and share relevant offers
- Make it easy for advertisers to understand outcomes and renew/buy
- Make it easy for franchisees to manage market presence and access tools/assets/reports

---

## 2. Background and Strategy Requirements

RSVP wants a modern, interactive platform built around a robust taxonomy and scalable content structure for "deals/offers near me" intent. Vendors must propose an SEO architecture that avoids duplication and indexing issues by creating localized category/geo pages and properly segmenting sitemaps. Similar coupon-style platforms struggle with indexing when the site becomes too large and pages lack localization. Vendors must provide detailed responses to how they would structure pages to avoid this.

Vendors must also design the platform to support a structured "database location taxonomy" (Category → State → City → ZIP) and "deal page results" templates for each category/geo combination. Vendors must also provide infrastructure for backend sales enablement, CRM, reporting and assets for franchisees as well as advertiser portal for ordering and renewals.

---

## 3. Scope Overview

This project includes:

- Discovery, UX strategy, and information architecture
- UI redesign and design system
- Platform development (consumer offers + advertiser profiles + franchisee/market pages)
- CMS implementation (corporate + franchisee editing with permissions)
- Offer ingestion and archive management (including PDF batch processing from PDFs provided by print vendor)
- Analytics/event tracking and attribution reporting
- Integrations (CRM/marketing automation, call tracking, optional Yext data integration, optional national offers feeds)
- Data migration, redirects, QA, and launch support

---

## 4. Required Feature Set

- Email + SMS opt-in for notifications of deals users are interested in, with preference segmentation
- Ability to integrate
- Incorporate business listing content via Yext to expand coverage and enrich profiles. This is a partner feed available via Yext API.
- Incorporate national deals/offers across verticals to expand inventory and engagement
- **"Request a Deal From This Business" Prospecting Signal.** Allow consumers to flag businesses that are not current advertisers but they want deals from and allow businesses to "Claim" profile and suggest edits. This should be provided to sales as a tool when discussing consumer interest in offers from them on the RSVP site as well as for businesses wanting to update information. All should be captured as an intent signal franchisees can use as a sales tool.
- City savings guides as content hubs (SEO + consumer value) with local tips and features. Community savings pages should support SEO for advertiser offers and listings.
- Contemporary look and feel that is modern, and communicates "exclusivity" of offers and "luxury perks" you can get when you RSVP.

---

## 5. Audience-Specific Requirements

### 5.1 The Consumer Experience

#### Offer Discovery

- Search offers by category + geography (city/metro and/or ZIP)
- Filter/sort (newest, distance where applicable, category tags, popularity)
- Offer browsing by market + category landing pages
- Links to offers from City and Community based content pages

#### Offer Pages

- Offer details are exposed when consumer RSVP's to get offer from business (terms, expiration, redemption instructions)
- Share with friends (track shares/forwards)
- Contact business

#### Business Profile Pages

- Core business info (address, phone, hours, services, website)
- Offer(s) associated with the business are exposed after consumer requests them from advertiser
- Image gallery
- Optional: embedded IG feed for participating businesses
- CTAs: Website click, Call, Directions, Share, Save, Contact Business

#### Consumer Opt-Ins

- Email/SMS sign-up for "new offers when luxury card packs"
- Preference center for offer categories + geography + notification frequency
- Consent logging (email + SMS compliance) need database and ability to segment for specific email and SMS campaigns based on defined preferences on types of offers they want to receive from RSVP

#### Lead Attribution

- Contact forms to message the business directly from profile/offer pages
- All events tracked for reporting (views, clicks, calls, forms, shares, saves, sweepstakes entries) to be used in Advertiser Reporting

---

### 5.2 Advertiser Experience

#### Advertiser Lead Capture

- Advertiser inquiry flows tied to products/services and market routing to the franchisees that serve the market they're interested in advertising in
- Ability to request proposal or schedule consultation (franchisee routed)
- All leads added and tracked in CRM

#### Reporting (Required)

- Either advertiser portal login OR franchisee-generated reports that can be emailed to advertisers must be provided
- Reporting must include (at minimum):
  - Business profile views
  - RSVP's for offers
  - Website clicks
  - Calls (tracked)
  - Contact form leads submitted directly from profile
  - Shares/forwards

---

### 5.3 Franchisee Experience

#### Franchisee Local Pages (SEO + Conversion) for Prospective Advertisers

- Dedicated local pages highlighting market/area served and affluent audience profile
- Must shift away from tri-county footprints to city/metro and "direct mail company" type SEO intent
- Page templates must support:
  - Local market overview
  - Featured categories
  - Local case studies/testimonials
  - Local contact CTAs and lead capture

#### Microsite Consolidation

- Existing franchisee microsites must be consolidated into the main domain with proper redirects and preserved equity.

#### Backend Portal for Franchisees to Access:

- Past offers archive (PDFs) by market/date/category/advertiser. Vendors must migrate an existing database of historical offers from the existing site.
- Place to access and store case studies, advertiser decks, creative assets and other sales enablement tools for franchisees
- Advertiser performance reports and exports
- Lead management views (and CRM sync)

#### Lead Routing

**Current limitation:** leads route based on originating page.

- Leads currently are routed based on the page the lead originated from i.e. local microsites and franchisee information pages. The new site should support true geographic/market routing rules (city/ZIP/territory logic), with overrides and auditability to ensure leads are routed to the correct franchisee.

---

## 6. Offer Archive & PDF Batch Processing

- Database of past offers provided as PDFs by printing partner
- Batch processing pipeline to ingest, categorize, and associate PDFs to:
  - Market/territory
  - Category
  - Advertiser/business profile (where possible)
  - Drop date / expiration
- Admin tools for correction, mapping, and overrides
- Permissions so franchisees can view/download offers relevant to their market(s) for sales presentations

---

## 7. CMS and Content

- CMS editing for corporate pages (products/services, about, FAQs, guides, digital offerings)
- Franchisee editing for local pages and approved modules
- Role-based permissions aligned with existing structure (Admin/Publisher/Guest) + franchisee market boundaries
- Approval workflows (corporate approval for certain updates)
- Reusable modules (FAQ blocks, testimonials, CTAs, market hero modules, etc.)

---

## 8. Analytics, Tracking, and Reporting

Vendor must provide:

- Event tracking spec and implementation for all key actions:
  - Search → filters → offer views → profile views → website clicks → calls → form submissions → shares → saves → redemptions (where applicable)
  - Need a flexible tool that captures data sitewide, tracks category and geography search volumes, and advertiser specific profile interactions
- Dashboards/exports for:
  - Corporate rollups
  - Franchisee market reporting
  - Advertiser reporting (portal or emailed PDFs from data)

### Call Tracking

- Call tracking for calls generated from offer pages and business profiles, via CallRail or Marchex APIs
- Whisper message indicating the call is from RSVP
- Reporting tie-back to advertiser for reporting as outlined above.

---

## 9. CRM and Marketing Automation

RSVP requires marketing automation infrastructure (HubSpot, Zoho, or equivalent) that supports:

- Corporate visibility across all markets + role-based franchisee access
- Lead capture, routing, and lifecycle tracking
- Automated thank-you emails
- Retention sequences, win-backs/renewals
- Ability to track and book sales in CRM for forecasting
- Integration with website forms, reporting events, and opt-in preferences

Vendor must propose recommended CRM stack, implementation scope, and data model.

---

## 10. SEO and Information Architecture Requirements

Vendor must deliver:

- Updated sitemap & navigation that preserves core pages while expanding taxonomy
- URL strategy for:
  - Categories
  - Markets (state/city/metro/ZIP)
  - Category and geo combinations
  - Offers and business profiles
  - Franchisee local pages
- Redirect mapping (301s), canonical strategy, and duplication controls
- Structured data plan (LocalBusiness, Offer, FAQ, Breadcrumb, Organization)
- Sitemap segmentation strategy to support crawl/indexation at scale
- Content plan for:
  - City savings guides
  - Advertiser educational content on direct mail and general marketing for SMBs and national customers

---

## 11. Technical Requirements and Current Platform Constraints

### Current Platform

- .NET + SQL Server
- Custom CMS and asset repository
- WordPress currently used for franchise sales site and franchise directory
- All HTML editable via CMS
- PCI compliant; ADA compliant
- Backups every other day
- Cloudflare in front of site
- Cloud-based transactional email
- Existing roles: Admin, Publisher, Guest
- Franchisees are admins limited to their site area
- No CDN today (images cached)

The new platform must preserve equivalent functionality, permissions, and data continuity. Vendors may propose re-platforming, but must include a full migration and parity plan. This is the current state, vendors are free to propose new structure, and technical requirements based on their understanding of the scope outlined.

---

## 12. Security, Privacy, and Compliance

- PCI compliance where payments exist (especially if online ordering is added)
- Secure authentication and role-based access controls
- Audit logging for admin actions and content changes
- ADA/WCAG compliance testing and documentation
- Privacy/compliance for SMS/email opt-ins, preference center, and audience creation

---

## 13. Performance

- Mobile performance targets and Core Web Vitals plan
- Caching/CDN strategy (recommended)
- Monitoring, logging, and alerting plan

---

## 14. Deliverables

Proposals must include pricing for delivery of core features outlined in scope:

1. Discovery summary + requirements confirmation
2. Sitemap/IA + URL strategy + redirect mapping approach
3. Wireframes for core journeys (consumer discovery, offer/profile, opt-in, advertiser inquiry, franchisee page)
4. UI designs + design system
5. Development of website/platform + CMS + permissions
6. Offer ingestion and archive tools (PDF pipeline + admin UI)
7. Analytics/event tracking + reporting dashboards/exports
8. CRM/marketing automation integration + workflows and costs for implementation and licenses
9. QA results (functional, accessibility, performance, security)
10. Training + documentation for corporate and franchisees
11. Launch plan + 30/60/90-day post-launch support

---

## 15. Vendor Proposal Requirements

Proposals must include:

- Relevant experience and case studies (deal platforms, directories, multi-market/franchise systems if applicable)
- Recommended architecture and CMS approach
- SEO strategy (taxonomy templates, duplication controls, schema, indexing)
- Data model overview (offers, businesses, markets, categories, users, permissions)
- Integration approach:
  - CRM/marketing automation
  - Call tracking with whisper
  - Yext or other business data provider
- Migration strategy and redirect approach
- Project timeline, resourcing plan, and responsibilities matrix
- QA approach and launch plan
- Support/maintenance options (SLA, response times, ongoing costs)

---

## 16. Evaluation Criteria

- Demonstrated platform experience in offer/search/directory ecosystems
- Strength of SEO taxonomy plan and scalability approach
- Reporting/attribution sophistication
- Ability to preserve backend parity and execute migration cleanly
- UX quality across consumers/advertisers/franchisees
- Security/compliance readiness (ADA/WCAG, PCI)
- Timeline realism and total cost of ownership

---

## 17. RFP Schedule

| Milestone | Date |
|---|---|
| RFP issued | March 2, 2026 |
| Vendor questions due | March 13, 2026 (end of day) |
| Proposals due | March 27, 2026 (end of day) |
| Shortlist presentations | March 30 – April 10, 2026 |
| Vendor selected | April 17, 2026 |
| Target kickoff | April 20, 2026 |

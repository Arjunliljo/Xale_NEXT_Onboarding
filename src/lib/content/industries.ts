export type Industry = {
  slug: string;
  name: string;
  hero: { eyebrow: string; title: string; description: string };
  gradient: string;
  pipeline: { stage: string; description: string }[];
  features: { title: string; description: string }[];
  integrations: string[];
  testimonial?: { quote: string; name: string; role: string; company: string };
  metrics?: { value: string; label: string }[];
};

export const INDUSTRIES: Record<string, Industry> = {
  "study-abroad": {
    slug: "study-abroad",
    name: "Study Abroad",
    hero: {
      eyebrow: "Built for consultancies",
      title: "From inquiry to visa to travel — one pipeline.",
      description:
        "Counsellors, applications, documents, visa appointments, intake batches — Xale tracks every stage of a student's journey, with industry-specific fields you don't have to build yourself.",
    },
    gradient: "linear-gradient(135deg, #319b72 0%, #156548 100%)",
    pipeline: [
      { stage: "Inquiry", description: "Captured from Meta, WhatsApp, or web — auto-routed to a counsellor by country interest." },
      { stage: "Counselling", description: "Session notes, document checklist, university shortlist — all on the lead record." },
      { stage: "Application", description: "Track every application across universities — status, deadlines, follow-ups." },
      { stage: "Offer & Acceptance", description: "Offer letters, conditional approvals, fee deposits, all attached." },
      { stage: "Visa", description: "Visa-stage checklist, appointment dates, document submissions, response tracking." },
      { stage: "Pre-departure", description: "Travel insurance, accommodation, fee payment, orientation — clear handoff." },
    ],
    features: [
      { title: "University & course library", description: "Pre-built database of universities, courses, intakes — assign students with one click instead of typing it 100 times." },
      { title: "Qualification scores", description: "IELTS, TOEFL, PTE, GRE, GMAT bands stored as structured fields. Filter pipelines by score range in one click." },
      { title: "Multi-counsellor handoffs", description: "Pre-sales, application, visa specialists each see only their stage. Smooth handoff, no leakage." },
      { title: "Country-specific compliance", description: "Visa-stage fields per country (UK GS, US F-1, Canada SDS, Australia GS) — Xale knows what's required." },
    ],
    integrations: ["Meta Lead Ads", "WhatsApp Business", "Gmail", "TeleCMI calls", "Razorpay"],
    testimonial: {
      quote: "We went from 9-hour response times to 22 seconds. Our counsellors stopped firefighting and started actually selling.",
      name: "Parvathy Nair",
      role: "Founder",
      company: "Nila Study Abroad",
    },
    metrics: [
      { value: "3.2×", label: "Higher lead-to-application rate" },
      { value: "22s", label: "Median lead response time" },
      { value: "60%", label: "Less time on admin work" },
    ],
  },
  "video-production": {
    slug: "video-production",
    name: "Video Production",
    hero: {
      eyebrow: "Built for studios",
      title: "Reel projects, vendors, deliverables — one timeline.",
      description:
        "Studios juggling 30 client projects, 20 freelancers, and 4 ambient setups need more than a CRM — they need a production OS. Xale models every variant, vendor, and deliverable natively.",
    },
    gradient: "linear-gradient(135deg, #156548 0%, #102f23 100%)",
    pipeline: [
      { stage: "Inquiry", description: "Brand, brief, budget, intended channel — captured into structured fields." },
      { stage: "Quote", description: "Variant pricing, model options, ambient setups, day rates — all auto-calculated." },
      { stage: "Pre-production", description: "Vendor assignments, shoot dates, locations, model bookings on the lead record." },
      { stage: "Production", description: "Day-by-day shoot tracking, on-set notes, asset capture log." },
      { stage: "Post & Delivery", description: "Editor handoff, revision rounds, final delivery, sign-off." },
      { stage: "Invoiced & Paid", description: "Razorpay invoice, GST, payment tracking — all integrated." },
    ],
    features: [
      { title: "Service variants & pricing", description: "Reel, ad film, music video, brand film — each with sub-variants and dynamic pricing. No more re-typing quotes." },
      { title: "Vendor management", description: "DOPs, editors, models, locations — each as a typed entity with rates, availability, and project history." },
      { title: "Day-rate calculator", description: "Quote any shoot in 60 seconds: pick crew, ambient, model tier — Xale computes the total." },
      { title: "Revision rounds tracked", description: "Each round of edits is a structured entity, not a Slack thread — clients see status without asking." },
    ],
    integrations: ["WhatsApp Business", "Gmail", "Razorpay", "Google Drive (deliverables)", "TeleCMI calls"],
    testimonial: {
      quote: "WhatsApp broadcasts that actually got delivered, templates approved without 3 weeks of back-and-forth. That alone paid for itself.",
      name: "Anjana S.",
      role: "Head of Marketing",
      company: "Kayal Studio",
    },
    metrics: [
      { value: "60%", label: "Less time on admin work" },
      { value: "2.4×", label: "More projects shipped per quarter" },
      { value: "100%", label: "Of revisions tracked in one place" },
    ],
  },
  academy: {
    slug: "academy",
    name: "Academy",
    hero: {
      eyebrow: "Built for educators",
      title: "Programs, cohorts, certifications — full lifecycle.",
      description:
        "Online academies, training institutes, certification programs — Xale tracks every learner from interest to enrollment to alumni, with batch logic and certification workflows built in.",
    },
    gradient: "linear-gradient(135deg, #6fb99c 0%, #319b72 100%)",
    pipeline: [
      { stage: "Interest", description: "Captured from Meta/Google Ads, webinars, referrals — segmented by program of interest." },
      { stage: "Nurture", description: "Auto-sequence of WhatsApp + Gmail touches, syllabus shares, demo invitations." },
      { stage: "Demo / Counselling", description: "Booking, attendance, conversion tracking — close the loop on every demo." },
      { stage: "Enrolled", description: "Cohort assignment, fee schedule, prep materials — all auto-fired on payment." },
      { stage: "In-program", description: "Attendance, progress, support tickets — track to certification completion." },
      { stage: "Alumni & referrals", description: "Post-completion engagement, NPS, referral campaigns — keep the loop alive." },
    ],
    features: [
      { title: "Program & variant library", description: "Manage multiple programs, batches, and pricing tiers. Each enrollment hooks into the right cohort automatically." },
      { title: "Cohort & batch logic", description: "Batches with start dates, capacity caps, waitlists, intake rules — no more spreadsheet juggling." },
      { title: "Certification workflow", description: "Track completion criteria, issue certificates, link to alumni records — all from the same lead/student record." },
      { title: "Referral attribution", description: "Track alumni referrals automatically; commission rules baked in." },
    ],
    integrations: ["Meta Lead Ads", "WhatsApp Business", "Gmail", "Razorpay", "Zoom / Google Meet"],
    metrics: [
      { value: "2.8×", label: "More enrollments per cohort" },
      { value: "40%", label: "Higher demo-to-enroll conversion" },
      { value: "95%", label: "On-time fee collection" },
    ],
  },
  travel: {
    slug: "travel",
    name: "Travel",
    hero: {
      eyebrow: "Built for travel desks",
      title: "Itineraries, vendors, multi-currency — all in sync.",
      description:
        "DMCs, tour operators, corporate travel desks — Xale handles itinerary variants, vendor coordination, and multi-currency invoicing without spreadsheets in the loop.",
    },
    gradient: "linear-gradient(135deg, #98cdb8 0%, #6fb99c 100%)",
    pipeline: [
      { stage: "Inquiry", description: "Destinations, dates, group size, budget — captured into structured fields." },
      { stage: "Quote", description: "Variant itineraries, vendor pricing, currency conversion, margin auto-calculated." },
      { stage: "Confirmed", description: "Deposit paid, vendor bookings issued, documents shared." },
      { stage: "Pre-travel", description: "Visas, insurance, vouchers — final checklist before departure." },
      { stage: "In-trip", description: "On-trip support tickets, vendor escalations, emergency tracking." },
      { stage: "Post-trip", description: "Reviews, referrals, repeat-customer nurture sequences." },
    ],
    features: [
      { title: "Itinerary variants", description: "Build A/B/C itineraries from a service library — pick city + hotel + transport — Xale assembles the quote." },
      { title: "Multi-currency invoicing", description: "Quote in USD/EUR/INR, invoice in any. Live exchange-rate handling baked in." },
      { title: "Vendor coordination", description: "Hotels, transport providers, guides — each a typed entity with rates, contracts, and booking status." },
      { title: "Travel-doc checklists", description: "Passport, visa, insurance per traveller — Xale flags missing docs before departure." },
    ],
    integrations: ["WhatsApp Business", "Gmail", "Razorpay", "Stripe (multi-currency)", "Google Maps"],
    metrics: [
      { value: "3×", label: "Faster quote generation" },
      { value: "55%", label: "Higher quote-to-booking rate" },
      { value: "0", label: "Spreadsheets remaining" },
    ],
  },
  "real-estate": {
    slug: "real-estate",
    name: "Real Estate",
    hero: {
      eyebrow: "Built for brokerages",
      title: "Properties, viewings, client nurture sequences.",
      description:
        "Manage your property inventory, broker assignments, viewing schedules, and client journeys end-to-end — built for residential, commercial, and rental teams.",
    },
    gradient: "linear-gradient(135deg, #102f23 0%, #051912 100%)",
    pipeline: [
      { stage: "Inquiry", description: "Captured from portals, Meta ads, walk-ins — auto-tagged by neighbourhood and budget." },
      { stage: "Qualified", description: "Pre-approval status, financing readiness, viewing intent — qualified leads only proceed." },
      { stage: "Viewings", description: "Schedule, attend, log feedback — multiple properties per lead, all tracked." },
      { stage: "Offer", description: "Negotiation status, counter-offers, conditional approvals — one source of truth." },
      { stage: "Agreement", description: "Document signing, deposits, finance approval — every step auditable." },
      { stage: "Closed", description: "Handover, post-sale services, referrals — the relationship doesn't end at close." },
    ],
    features: [
      { title: "Property inventory", description: "Listings as a structured entity — type, sub-type, size, price, features, photos, status. Filter and match to leads instantly." },
      { title: "Broker assignment", description: "Auto-assign leads to brokers by neighborhood expertise, language, or workload." },
      { title: "Viewing scheduler", description: "Multi-property viewing days, calendar sync, automated reminders to both client and broker." },
      { title: "Commission tracking", description: "Per-deal commission splits across brokers, sub-brokers, referrers — all auditable." },
    ],
    integrations: ["Meta Lead Ads", "WhatsApp Business", "Google Calendar", "TeleCMI calls", "Razorpay"],
    metrics: [
      { value: "4.1×", label: "More viewings per qualified lead" },
      { value: "30%", label: "Faster close cycle" },
      { value: "0%", label: "Leads lost to broker handoff" },
    ],
  },
  healthcare: {
    slug: "healthcare",
    name: "Healthcare",
    hero: {
      eyebrow: "Built for clinics & hospitals",
      title: "Patient inquiries, appointments, follow-up SLAs.",
      description:
        "Clinics, hospitals, wellness centers, specialty practices — Xale tracks every inquiry from first contact to follow-up, with patient-data handling that respects compliance.",
    },
    gradient: "linear-gradient(135deg, #319b72 0%, #6fb99c 100%)",
    pipeline: [
      { stage: "Inquiry", description: "Captured from website, Meta ads, calls — categorized by department and urgency." },
      { stage: "Triage", description: "Coordinator assigns specialty, requests reports, books consultation." },
      { stage: "Consultation", description: "Pre-consult prep, doctor notes, prescriptions, next-step plan." },
      { stage: "Treatment", description: "Procedure scheduling, payment, follow-up reminders." },
      { stage: "Follow-up", description: "Post-procedure SLA tracking, NPS, repeat-visit nudges." },
      { stage: "Long-term care", description: "Periodic check-ins, recurring screenings, family member capture." },
    ],
    features: [
      { title: "Department routing", description: "Inquiries route by department: cardiology, dermatology, fertility, etc. Each gets its own pipeline and SLA." },
      { title: "Patient-data handling", description: "Sensitive fields gated to medical roles; audit trail on every record access. Built with DPDP and HIPAA principles in mind." },
      { title: "Follow-up SLAs", description: "Auto-set follow-up dates by procedure type; overdue follow-ups escalate to coordinators." },
      { title: "Family-record linking", description: "Link records across family members; nurture campaigns can target related patients." },
    ],
    integrations: ["WhatsApp Business", "Gmail", "TeleCMI calls", "Razorpay", "Google Calendar"],
    metrics: [
      { value: "85%", label: "Follow-up compliance vs 40% baseline" },
      { value: "2.2×", label: "Repeat-visit rate" },
      { value: "<5 min", label: "Median inquiry response" },
    ],
  },
};

export function getIndustry(slug: string): Industry | null {
  return INDUSTRIES[slug] ?? null;
}

export function getAllIndustries(): Industry[] {
  return Object.values(INDUSTRIES);
}

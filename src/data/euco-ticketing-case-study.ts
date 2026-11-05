/**
 * EUCO TICKETING CASE STUDY: all the words and numbers for
 * web.paolo.org.uk/portfolio/euco-tickets live here, so editing the page is editing this
 * file. The components in src/components/case-study/ only render it.
 *
 * Conventions
 *   - Anything marked TODO(paolo) is a fact only you can supply. Fields left
 *     empty/null are simply not rendered, so the page never shows a blank
 *     or a made-up number.
 *   - Figures marked "from the repo" were counted from the EUCO codebase in
 *     Nov 2026 and will drift; update them when you next touch the project.
 */

export interface Stat {
  id: string;
  label: string;
  /** null = hide this tile. */
  value: number | null;
  suffix?: string;
  note?: string;
  /** Key of the live payload that can override `value` (see lib/case-study/live-stats.ts). */
  liveKey?: "concerts" | "orders" | "tickets_issued" | "tickets_scanned";
}

export const caseStudy = {
  slug: "euco-ticketing",
  eyebrow: "Case study · Edinburgh University Chamber Orchestra",
  title: "EUCO Tickets",
  tagline:
    "A box office for a student orchestra: online sales, signed QR tickets, and a door app that keeps working when the venue's Wi-Fi doesn't.",
  meta: [
    { label: "Role", value: "Designer, developer and the person who runs it on the night" },
    { label: "Built with", value: "FastAPI · PostgreSQL · Astro · Directus · Stripe" },
    // TODO(paolo): fill in when it first went live, e.g. "Live since Oct 2025".
    { label: "Status", value: "" },
  ],
  links: [
    { label: "Visit the ticket site", href: "https://tickets.eu-co.co.uk" },
    // TODO(paolo): add a repo link here if the code is, or becomes, public.
  ] as { label: string; href: string }[],

  /** Hero numbers. Those with a liveKey are overridden by the optional live endpoint. */
  stats: [
    { id: "concerts", label: "concerts ticketed", value: null, liveKey: "concerts" }, // TODO(paolo): or let the live endpoint fill it
    { id: "issued", label: "tickets issued", value: null, liveKey: "tickets_issued" },
    { id: "scanned", label: "tickets scanned at the door", value: null, liveKey: "tickets_scanned" },
    { id: "tests", label: "automated tests", value: 185, note: "169 backend + 16 door-app, from the repo" },
    { id: "migrations", label: "database migrations", value: 8, note: "from the repo" },
  ] as Stat[],

  problem: {
    eyebrow: "01 · The problem",
    title: "Cash, a paper list, and no way to sell ahead",
    intro:
      "EUCO sold tickets the way most student societies do: on the door, for cash, off a list on a clipboard. It worked until audiences grew.",
    before: [
      "No advance sales, so the committee couldn't know a concert's size until people turned up",
      "No live capacity, so a sell-out was discovered at the door",
      "Check-in meant a paper list, a pen and a queue",
      "Every figure afterwards was reconciled by hand",
    ],
    after: [
      "Tickets on sale online the moment a concert is published in the CMS",
      "Capacity enforced by the server, with a short hold while someone pays",
      "A phone scans each QR code and checks it against the live list",
      "Every sale and every entry is a row in one database",
    ],
    // TODO(paolo): one sentence of personal context: why you took it on, what the committee asked for.
    personal: "",
  },

  system: {
    eyebrow: "02 · The system",
    title: "Six moving parts, one source of truth",
    intro:
      "Select a part to see what it owns. The rule that shaped everything: committee members edit content in Directus, but money and attendance live in Postgres and nowhere else.",
  },

  lifecycle: {
    eyebrow: "03 · Life of a ticket",
    title: "From basket to the door, in five steps",
    intro:
      "Step through one order and watch the rows change. The design goal was that every step can fail, retry or arrive twice without issuing a ticket nobody paid for.",
  },

  qrLab: {
    eyebrow: "04 · Try to forge a ticket",
    title: "Why a screenshot of someone else's QR code isn't enough",
    intro:
      "This runs the same signing scheme as the real system, with a demo secret, entirely in your browser. Break the signature and watch the check fail.",
  },

  door: {
    eyebrow: "05 · The door",
    title: "Scanning when the venue Wi-Fi is not your friend",
    intro:
      "Concert halls are stone buildings full of people on one cellular mast. The door app asks the server first and falls back to a downloaded list. Two doors, two Wi-Fi switches, six tickets: try to get someone in twice.",
  },

  pricing: {
    eyebrow: "06 · Pricing rules",
    title: "Money in whole pennies, decided on the server",
    intro:
      "The browser only displays a price; the server recomputes it from the CMS every time. These are the real rules, with example ticket prices.",
    // Example prices only. Replace with a real concert's if you prefer.
    tickets: [
      { id: "adult", name: "Adult", pence: 1000 },
      { id: "student", name: "Student", pence: 600 },
      { id: "child", name: "Under 16", pence: 0 },
    ],
    codes: [
      { code: "none", label: "No code", kind: "none" as const },
      { code: "SPRING20", label: "SPRING20: 20% off", kind: "percent" as const, percent: 20 },
      { code: "TWOOFF", label: "TWOOFF: £2 off each ticket", kind: "amount" as const, amountPence: 200 },
      { code: "COMP", label: "COMP: complimentary", kind: "free" as const },
    ],
    bookingFeePence: 100,
  },

  decisions: {
    eyebrow: "07 · Decisions and trade-offs",
    title: "Choices I'd defend, and what they cost",
    items: [
      {
        title: "Hosted Stripe Checkout, not a custom card form",
        why: "Card details never touch our servers, which removes most of the security and compliance surface for a volunteer-run system.",
        cost: "Less control over the payment page; we customise around it instead (branding, fee line, expiry).",
      },
      {
        title: "A ticket row exists only after payment",
        why: "The webhook is the only thing that creates tickets, so a ticket existing is itself proof of payment. Stripe event ids are stored, so a replayed webhook does nothing.",
        cost: "There is a gap between paying and the ticket arriving, so the order page polls and the email follows.",
      },
      {
        title: "Signed QR codes, checked on every scan",
        why: "The QR carries the ticket id plus an HMAC only the server can produce, so codes can't be guessed or invented. The server re-verifies and takes a row lock on every scan, so two phones can't both admit the same ticket.",
        cost: "A valid signature only proves the ticket was issued; status (used, refunded) still needs the database.",
      },
      {
        title: "Server first at the door, with an offline fallback",
        why: "Online scans are authoritative. If the server doesn't answer within a few seconds, the app checks a downloaded list and queues the entry to sync, so a dead signal slows nobody down.",
        cost: "Offline, two doors can't see each other. Sync settles it afterwards, and the app flags the clash instead of hiding it.",
      },
      {
        title: "Static main site, server-rendered ticket site",
        why: "The public site is fast, cacheable and cheap to host. Checkout, ticket pages and the door app need live data, so they sit on a separate server-rendered site.",
        cost: "Two front-ends to deploy, and committee content on the static site goes live on a rebuild rather than instantly.",
      },
      {
        title: "Directus for content, Postgres for facts",
        why: "Committee members already needed a friendly place to edit concerts, ticket types and discount codes. The backend reads from Directus but never writes to it, so a CMS mistake can't corrupt an order.",
        cost: "Prices are read from the CMS at purchase time, so the order stores what was actually charged, not a reference.",
      },
    ],
  },

  lessons: {
    eyebrow: "08 · What I learned",
    title: "Things I'd do again, and things I'd change",
    // TODO(paolo): rewrite these two lists in your own words after your first full season of data.
    again: [
      "Put the awkward rules (holds, refunds, free-ticket limits, the fee) in tested code on day one, not in a spreadsheet",
      "Make the door tool boring: big result, one colour per outcome, a guest list for when a camera won't focus",
      "Write the operating guide alongside the software, because the people using it are volunteers who change every year",
    ],
    change: [
      "Wallet passes: the data model has a field for them, but they were never built",
      "Tap-to-pay on the door: it can't run from a web page, so it would need a card reader or a QR-pay link",
      "Decide up front who owns the system after I leave: a case study is not a handover document",
    ],
  },

  stack: [
    "FastAPI", "PostgreSQL", "SQLModel", "Alembic", "Stripe Checkout", "Resend",
    "Astro (static + SSR)", "Directus", "TypeScript", "PWA / IndexedDB", "GitHub Actions", "PostHog",
  ],
};

export type CaseStudy = typeof caseStudy;

/* ------------------------------------------------------------------ */
/* Architecture diagram                                                */
/* ------------------------------------------------------------------ */

export interface ArchNode {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  kind: "people" | "front" | "core" | "store" | "external";
  owns: string;
  detail: string;
}

export const archNodes: ArchNode[] = [
  { id: "committee", label: "Committee", sub: "edits in Directus", x: 40, y: 30, kind: "people",
    owns: "Concerts, ticket types, prices, discount codes, announcements",
    detail: "Non-technical committee members change what's on sale in a CMS they can use. Roles decide who can see orders and exports (the Box Office policy)." },
  { id: "directus", label: "Directus CMS", sub: "content", x: 40, y: 180, kind: "store",
    owns: "Everything a committee member can edit",
    detail: "The backend reads concerts and ticket types from here at purchase time and never writes back. Publishing a story or concert triggers a rebuild of the static site." },
  { id: "main", label: "Main site", sub: "Astro, static", x: 300, y: 30, kind: "front",
    owns: "eu-co.co.uk: concerts, news, About",
    detail: "Pre-built pages, rebuilt on publish and every three hours as a safety net. A live settings call handles anything that can't wait for a rebuild, like a sales-paused notice." },
  { id: "tickets", label: "Ticket site", sub: "Astro, server-rendered", x: 300, y: 330, kind: "front",
    owns: "Checkout, order pages, ticket pages, the door app",
    detail: "Server-rendered because every page depends on live state: seats left, whether an order is paid, whether a ticket is used." },
  { id: "api", label: "Backend API", sub: "FastAPI", x: 560, y: 180, kind: "core",
    owns: "Pricing, capacity holds, orders, tickets, scans, exports",
    detail: "The only code that decides what something costs, whether seats remain, and whether a ticket is valid. 8 migrations, a test suite around the money rules." },
  { id: "db", label: "PostgreSQL", sub: "orders · tickets · scans", x: 560, y: 330, kind: "store",
    owns: "Money and attendance: the single source of truth",
    detail: "Orders, order items, tickets, scan events and processed Stripe event ids. Scans take a row lock so a ticket can only be admitted once." },
  { id: "stripe", label: "Stripe", sub: "Checkout + webhooks", x: 820, y: 30, kind: "external",
    owns: "Taking the payment; telling us it happened",
    detail: "Hosted Checkout takes the card. A signed webhook tells the backend the order is paid, and event ids are remembered so replays are harmless." },
  { id: "door", label: "Door app", sub: "phone, offline-capable", x: 820, y: 180, kind: "front",
    owns: "Scanning, guest list, print list",
    detail: "Signs in with the same login as the CMS. Downloads a concert's ticket list, asks the server first, and queues scans when it can't reach it." },
  { id: "resend", label: "Resend", sub: "email + PDF", x: 820, y: 330, kind: "external",
    owns: "Delivering tickets and receipts",
    detail: "Confirmation emails carry the PDF ticket. Bounce and complaint events come back through a webhook so the inbox stays clean." },
];

export const archEdges: { from: string; to: string; label: string; t?: number }[] = [
  { from: "committee", to: "directus", label: "edit" },
  { from: "directus", to: "main", label: "rebuild on publish" },
  { from: "directus", to: "api", label: "read concerts & prices", t: 0.2 },
  { from: "main", to: "tickets", label: "Buy tickets" },
  { from: "tickets", to: "api", label: "create order" },
  { from: "api", to: "db", label: "read / write" },
  { from: "api", to: "stripe", label: "start Checkout", t: 0.3 },
  { from: "stripe", to: "api", label: "paid webhook", t: 0.7 },
  { from: "api", to: "resend", label: "send ticket" },
  { from: "door", to: "api", label: "manifest & scan" },
];

/* ------------------------------------------------------------------ */
/* Ticket lifecycle                                                    */
/* ------------------------------------------------------------------ */

export interface LifeStep {
  id: string;
  title: string;
  who: string;
  body: string;
  /** Rows shown in the state panel after this step. */
  order: Record<string, string | number | null>;
  ticket: Record<string, string | number | null> | null;
  guard: string;
}

export const lifeSteps: LifeStep[] = [
  {
    id: "basket",
    title: "Choose tickets",
    who: "Ticket site → Backend",
    body: "The browser sends ticket types and quantities, not prices. The backend reads the concert from the CMS, checks seats left, prices every line in pence, adds the booking fee and creates a pending order with a short hold on those seats.",
    order: { status: "pending", total_amount_pence: 2100, booking_fee_pence: 100, hold_expires_at: "+31 min" },
    ticket: null,
    guard: "Asking for more seats than remain is a 409, and the rate limiter caps order attempts per minute.",
  },
  {
    id: "pay",
    title: "Pay on Stripe",
    who: "Buyer ↔ Stripe",
    body: "The buyer is redirected to Stripe's hosted Checkout. The card number goes to Stripe and never to us. The Checkout session expires with the hold, so a held seat can't outlive its payment window.",
    order: { status: "pending", total_amount_pence: 2100, stripe_checkout_session_id: "cs_live_…" },
    ticket: null,
    guard: "No ticket exists yet. Abandoning the page just lets the hold expire.",
  },
  {
    id: "webhook",
    title: "Webhook confirms",
    who: "Stripe → Backend",
    body: "Stripe calls the backend with a signed checkout.session.completed event. The backend verifies the signature, checks it hasn't seen this event id before, marks the order paid and creates one ticket row per seat, each with its signed QR value.",
    order: { status: "paid", total_amount_pence: 2100, hold_expires_at: null },
    ticket: { status: "valid", qr_signature: "AbC…(64 chars)", issued_at: "now", redeemed_at: null },
    guard: "Event ids are stored: a webhook that Stripe retries or delivers twice still issues the tickets once.",
  },
  {
    id: "deliver",
    title: "Ticket delivered",
    who: "Backend → Resend → Buyer",
    body: "In the background the backend renders a PDF ticket and emails it, while the order page (which has been polling) flips to show the QR codes on a live ticket page.",
    order: { status: "paid", email: "sent" },
    ticket: { status: "valid", page: "/t/{ticket_id}?s={signature}", pdf: "attached" },
    guard: "Email is a convenience, not the source of truth: the ticket page works even if the email never lands.",
  },
  {
    id: "scan",
    title: "Scanned at the door",
    who: "Door app → Backend",
    body: "The door app sends the ticket id, signature and concert. The backend verifies the HMAC, locks the ticket row, checks the concert and status, flips the ticket to used and records a scan event with who and when.",
    order: { status: "paid" },
    ticket: { status: "used", redeemed_at: "19:02", redeemed_by: "Door 1" },
    guard: "A second scan of the same code returns “already used at 19:02 by Door 1”, never a second welcome.",
  },
];

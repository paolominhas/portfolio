/**
 * TUTOR SUBDOMAIN DATA
 *
 * Single source of truth for tutor.paolo.org.uk, following the same
 * pattern as web-data.ts. One page, one file to edit.
 */

export interface Level {
  key: string;
  name: string;
  region: string;
  blurb: string;
  details: string[];
}

export const levels: Level[] = [
  {
    key: "gcse",
    name: "GCSE",
    region: "England, Wales & Northern Ireland",
    blurb:
      "Maths and Physics (including Combined Science) — building the fundamentals the exam actually tests, not just covering the syllabus in order.",
    details: ["AQA, Edexcel & OCR", "Foundation & Higher tier", "Past-paper technique"],
  },
  {
    key: "a-level",
    name: "A Level",
    region: "England, Wales & Northern Ireland",
    blurb:
      "Maths, Further Maths and Physics — the step up from GCSE, with the problem-solving habits that actually carry marks.",
    details: ["AQA, Edexcel & OCR", "Exam technique & problem-solving", "University-entrance-ready"],
  },
  {
    key: "advanced-higher",
    name: "Advanced Higher",
    region: "Scotland",
    blurb:
      "Maths and Physics at SQA's most advanced school level — including the project/investigation work that trips a lot of students up.",
    details: ["SQA specification", "Investigation & project support", "Bridges into first-year university content"],
  },
  {
    key: "11-plus",
    name: "11+",
    region: "England",
    blurb:
      "Core maths and reasoning for grammar and independent school entrance — calm, steady preparation rather than last-minute cramming.",
    details: ["Maths & non-verbal/verbal reasoning", "Timed past-paper practice", "Confidence, not just content"],
  },
];

export interface ProcessStep {
  title: string;
  description: string;
}

export const howItWorks: ProcessStep[] = [
  {
    title: "Free intro call",
    description:
      "A relaxed 20-minute call — no obligation — to hear where things stand right now and what you're aiming for.",
  },
  {
    title: "A plan built on the syllabus",
    description:
      "Mapped to the actual exam board and specification in play, not a generic scheme reused for everyone.",
  },
  {
    title: "Regular sessions",
    description:
      "Online anywhere in the UK, or in person in Edinburgh — with real past papers worked in from early on.",
  },
  {
    title: "Check-ins with parents",
    description:
      "A short update after each block of sessions, so progress is visible and the plan can adjust if it needs to.",
  },
];

export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: "Who am I?",
    answer:
      "I'm a Master's physics student at the University of Edinburgh, currently researching on the HIBEAM experiment at the European Spallation Source. I tutor the way I wish I'd been tutored — starting from whatever's actually confusing, not working through a textbook in strict order.",
  },
  {
    question: "Online or in person?",
    answer:
      "Both. Sessions run online over video call from anywhere in the UK, or in person in Edinburgh if that's easier.",
  },
  {
    question: "What exam boards do you cover?",
    answer:
      "AQA, Edexcel and OCR for GCSE and A Level, and the SQA specification for Advanced Higher. Sessions use that board's actual past papers, not generic worksheets.",
  },
  {
    question: "What does it cost?",
    answer:
      "Get in touch with the year group and subject and I'll reply with current rates — they depend on level and how often you'd like to meet.",
  },
  {
    question: "What age group is the 11+ tutoring for?",
    answer:
      "Typically Year 4 to 6, focused on the maths and reasoning papers used for grammar and independent school entrance.",
  },
  {
    question: "How do I book the free intro call?",
    answer:
      "Use the form below, or email directly — I'll reply within a couple of days to find a time that works.",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  context: string;
}

/**
 * Intentionally empty. Fake or placeholder testimonials aren't going
 * here — the <Testimonials /> section on the page renders a genuine
 * "just getting started" state when this is empty, rather than
 * inventing quotes attributed to made-up parents. Add real ones
 * (with permission) as they come in, e.g.:
 *   { quote: "...", name: "Parent of a Year 11 student", context: "GCSE Maths" }
 */
export const testimonials: Testimonial[] = [];

"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { levels } from "@/data/tutor-data";

/**
 * TUTOR INQUIRY FORM
 * ─────────────────────────────────────────────────────────────────
 * Deliberately inline on the page rather than behind a "book now"
 * button/modal (see WebsiteRequestForm.tsx for that pattern) — this
 * *is* the page's whole conversion goal, so hiding it behind an
 * extra click would only lose enquiries.
 *
 * Posts to the SAME Formspree endpoint the rest of paolo.org.uk
 * already uses, with a distinguishing `_subject`/`form_type` so it
 * arrives clearly labelled — this works immediately, with zero setup.
 *
 * Worth doing before this goes live, though: create a second, free
 * Formspree form (formspree.io) dedicated to tutoring enquiries, and
 * swap FORMSPREE_ENDPOINT below for its ID. Parent enquiries and web-
 * dev leads are different businesses with different urgency — keeping
 * them in one inbox thread makes both harder to triage, and a
 * separate form also gives its own spam filtering and submission
 * count on Formspree's free tier.
 */

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjgeoogv";

type Status = "idle" | "submitting" | "success" | "error";

export default function TutorInquiryForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border-2 border-[var(--tutor-ink)]/10 bg-white px-8 py-14 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tutor-amber)]/20 text-[var(--tutor-ink)]">
          <Check size={22} />
        </div>
        <h3 className="mb-2 text-xl font-black text-[var(--tutor-ink)]">
          Thanks — got it.
        </h3>
        <p className="text-sm text-[var(--tutor-ink)]/60">
          I&apos;ll reply within a couple of days to find a time for the free
          intro call.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border-2 border-[var(--tutor-ink)]/10 bg-white p-6 md:p-8"
    >
      {/* Notification email subject + a type tag so this is clearly
          distinguishable from any other form sharing the endpoint. */}
      <input
        type="hidden"
        name="_subject"
        value="New tutoring enquiry — via tutor.paolo.org.uk"
      />
      <input type="hidden" name="form_type" value="Tutoring enquiry" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="ti-name"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--tutor-ink)]/50"
          >
            Your name
          </label>
          <input
            id="ti-name"
            name="name"
            type="text"
            required
            placeholder="Parent or student"
            className="w-full rounded-lg border border-[var(--tutor-ink)]/15 bg-[var(--tutor-paper)] px-4 py-2.5 text-sm text-[var(--tutor-ink)] placeholder:text-[var(--tutor-ink)]/30 transition-colors focus:border-[var(--tutor-amber)] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="ti-email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--tutor-ink)]/50"
          >
            Email
          </label>
          <input
            id="ti-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-[var(--tutor-ink)]/15 bg-[var(--tutor-paper)] px-4 py-2.5 text-sm text-[var(--tutor-ink)] placeholder:text-[var(--tutor-ink)]/30 transition-colors focus:border-[var(--tutor-amber)] focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="ti-level"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--tutor-ink)]/50"
          >
            Level
          </label>
          <select
            id="ti-level"
            name="level"
            required
            defaultValue=""
            className="w-full rounded-lg border border-[var(--tutor-ink)]/15 bg-[var(--tutor-paper)] px-4 py-2.5 text-sm text-[var(--tutor-ink)] transition-colors focus:border-[var(--tutor-amber)] focus:outline-none"
          >
            <option value="" disabled>
              Choose one
            </option>
            {levels.map((level) => (
              <option key={level.key} value={level.name}>
                {level.name} ({level.region})
              </option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="ti-message"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--tutor-ink)]/50"
          >
            A little context
          </label>
          <textarea
            id="ti-message"
            name="message"
            rows={4}
            placeholder="e.g. Year 11, AQA GCSE Maths, aiming to move up from a grade 5…"
            className="w-full resize-none rounded-lg border border-[var(--tutor-ink)]/15 bg-[var(--tutor-paper)] px-4 py-2.5 text-sm text-[var(--tutor-ink)] placeholder:text-[var(--tutor-ink)]/30 transition-colors focus:border-[var(--tutor-amber)] focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tutor-ink)] py-3.5 text-sm font-semibold text-[var(--tutor-paper)] transition-colors hover:bg-[var(--tutor-ink-deep)] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:px-8"
      >
        {status === "submitting" ? "Sending…" : "Book the free intro call"}
        {status !== "submitting" && <ArrowRight size={15} />}
      </button>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 text-xs text-[var(--tutor-coral)]"
          >
            Something went wrong — please try again, or email
            hello@paolo.org.uk directly.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

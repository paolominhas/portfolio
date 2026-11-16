"use client";

import { useState } from "react";
import Specimen from "@/components/instrument/Specimen";

/**
 * CONTACT (paolo.org.uk/contact)
 *
 * Same Formspree endpoint and fields as before. The form is ruled lines rather
 * than boxes, labels sit above their fields, and the result of sending replaces
 * the form in place.
 */

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjgeoogv";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (response.ok) {
        setStatus("success");
        form.reset();
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const label = "in-label mb-1 block";

  return (
    <div className="mx-auto grid min-h-[80vh] max-w-[90rem] gap-x-12 gap-y-12 px-5 pb-28 pt-28 md:px-8 md:pt-36 lg:grid-cols-12">
      <div className="in-enter lg:col-span-5">
        <h1 className="in-display text-[length:var(--step-5)]">Get in touch</h1>
        <p className="in-prose mt-6" style={{ fontSize: "var(--step-1)", lineHeight: 1.45 }}>
          If for some reason you would like to contact me go ahead here!
        </p>
        <p className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          <a href="mailto:info@paolo.org.uk" className="in-link">
            info@paolo.org.uk
          </a>
          <a href="https://github.com/paolominhas" className="in-link">
            GitHub
          </a>
        </p>
        <Specimen slot="main-contact" className="mt-14 hidden w-60 lg:block" depth={0.7} />
      </div>

      <div className="lg:col-span-6 lg:col-start-7">
        {status === "success" ? (
          <div role="status" className="border-t-2 border-[var(--signal)] pt-8">
            <h2 className="in-display text-[length:var(--step-3)]">Message sent</h2>
            <p className="in-prose mt-4">Promise I&apos;ll get back to you as soon as possible.</p>
            <button type="button" onClick={() => setStatus("idle")} className="in-link mt-8">
              Send another if you dare
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-9">
            <div>
              <label htmlFor="name" className={label}>
                Name
              </label>
              <input type="text" name="name" id="name" required autoComplete="name" className="in-field" placeholder="Bob Boson" />
            </div>
            <div>
              <label htmlFor="email" className={label}>
                Email
              </label>
              <input type="email" name="email" id="email" required autoComplete="email" className="in-field" placeholder="bob@your-uncle.is" />
            </div>
            <div>
              <label htmlFor="message" className={label}>
                Message
              </label>
              <textarea name="message" id="message" rows={5} required className="in-field resize-y" placeholder="Tell me about your thing..." />
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="flex h-12 items-center rounded-[3px] bg-[var(--signal)] px-7 text-[1.02rem] font-semibold text-[var(--signal-ink)] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Sending..." : "Send message"}
              </button>
              {status === "error" && (
                <p role="alert" className="text-[#ff9b8a]">
                  The message did not send. Try again, or email info@paolo.org.uk.
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

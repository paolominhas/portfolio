"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import MagneticButton from "./MagneticButton";

/**
 * WEBSITE REQUEST FORM
 * ─────────────────────────────────────────────────────────────────
 * The closing CTA for /web: a button that opens a small modal asking
 * for name, company (optional), email, and the type of site / a
 * short spec, then submits it through the *same* mechanism the main
 * portfolio's /contact page already uses — the Formspree endpoint at
 * https://formspree.io/f/xjgeoogv, posted as plain FormData.
 *
 * The only addition is a hidden `_subject` field. Formspree uses that
 * field verbatim as the notification email's subject line, so every
 * submission from here arrives clearly labelled as a website request
 * in the header of the email — distinguishing it from a generic
 * message sent through /contact — without needing a second endpoint,
 * a database, or any change to how the contact page itself works.
 */

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjgeoogv";

type Status = "idle" | "submitting" | "success" | "error";

export default function WebsiteRequestForm() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  function openModal() {
    setStatus("idle");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

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

  return (
    <>
      <MagneticButton onClick={openModal} variant="primary">
        Request a website
      </MagneticButton>

      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/70 px-4 py-10 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-lilac/20 bg-navy shadow-[0_40px_100px_rgba(10,11,94,0.6)]"
            >
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>

              {status === "success" ? (
                <div className="px-8 py-14 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow/15 text-yellow">
                    <Check size={22} />
                  </div>
                  <h3 className="mb-2 text-xl font-black text-white">Request sent</h3>
                  <p className="text-sm text-white/50">
                    Thanks — I&apos;ll reply within a couple of days with next steps.
                  </p>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-6 rounded-full border-2 border-white/20 px-5 py-2 text-sm text-white/70 transition-colors hover:border-yellow hover:text-yellow"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-8">
                  {/* Sets the notification email's subject line, so this
                      is immediately identifiable as a website request. */}
                  <input
                    type="hidden"
                    name="_subject"
                    value="New website request — via web.paolo.org.uk"
                  />
                  <input type="hidden" name="form_type" value="Website request" />

                  <p className="mb-1 font-mono text-xs uppercase tracking-widest text-yellow/70">
                    New project
                  </p>
                  <h3 className="mb-6 text-2xl font-black tracking-tight text-white">
                    Tell me about the site.
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="wr-name"
                        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50"
                      >
                        Name
                      </label>
                      <input
                        id="wr-name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                        className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/25 transition-colors focus:border-yellow focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="wr-company"
                        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50"
                      >
                        Company <span className="normal-case text-white/30">(if applicable)</span>
                      </label>
                      <input
                        id="wr-company"
                        name="company"
                        type="text"
                        placeholder="Optional"
                        className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/25 transition-colors focus:border-yellow focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="wr-email"
                        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50"
                      >
                        Email
                      </label>
                      <input
                        id="wr-email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/25 transition-colors focus:border-yellow focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="wr-spec"
                        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50"
                      >
                        Type of website / spec
                      </label>
                      <textarea
                        id="wr-spec"
                        name="project_type"
                        rows={4}
                        required
                        placeholder="e.g. a marketing site with a booking form, or a redesign of an existing WordPress site…"
                        className="w-full resize-none rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/25 transition-colors focus:border-yellow focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-yellow py-3 text-sm font-semibold text-navy transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "submitting" ? "Sending…" : "Send request"}
                    {status !== "submitting" && <ArrowRight size={15} />}
                  </button>

                  {status === "error" && (
                    <p className="mt-3 text-center text-xs text-red-300">
                      Something went wrong — please try again, or email directly.
                    </p>
                  )}
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

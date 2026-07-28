"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { services, process, techStack, webProjects } from "@/data/web-data";

/**
 * WEB HOME
 *
 * Structured like the freelance-developer portfolios this is
 * actually competing with: a clear positioning statement, services,
 * a couple of selected case studies (full list lives at /portfolio),
 * a process section, and a tech-stack strip. No fake testimonials —
 * better to have none than invented quotes.
 */

const featuredProjects = webProjects.filter((p) => !p.placeholder).slice(0, 2);

export default function WebHomePage() {
  return (
    <div className="selection:bg-[var(--accent-soft)]">
      {/* Hero */}
      <section className="pt-40 pb-24 px-6 md:px-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-soft)] border border-[var(--accent-border)] px-3 py-1 rounded-full mb-6"
          >
            Available for new projects
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05] mb-6"
          >
            Websites built like software,
            <br />
            not like templates.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-500 max-w-xl leading-relaxed mb-10"
          >
            I design and build full-stack web projects — from marketing
            sites to content-managed platforms — with the same rigour
            I'd bring to a research codebase: typed, version-controlled,
            and built to be maintained.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              View selected work <ArrowRight size={16} />
            </Link>
            <a
              href="https://paolo.org.uk/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:border-slate-400 hover:bg-white transition-colors"
            >
              Get in touch
            </a>
          </motion.div>
        </div>

        {/* Signature element: a small "editor window" summarising who this is */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="rounded-xl bg-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.25)] overflow-hidden"
        >
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
            <span className="ml-3 font-mono text-xs text-slate-400">
              paolo.ts
            </span>
          </div>
          <pre className="p-6 font-mono text-[13px] leading-relaxed text-slate-300 overflow-x-auto">
            <code>
              <span className="text-purple-400">const</span>{" "}
              <span className="text-sky-300">developer</span> = {"{"}
              {"\n"}  name:{" "}
              <span className="text-emerald-300">"Paolo Minhas"</span>,{"\n"}{" "}
              stack: [
              <span className="text-emerald-300">"Next.js"</span>,{" "}
              <span className="text-emerald-300">"TypeScript"</span>,{"\n"}
              {"          "}
              <span className="text-emerald-300">"Docker"</span>],{"\n"}{" "}
              basedIn:{" "}
              <span className="text-emerald-300">"Edinburgh, UK"</span>,{"\n"}{" "}
              also: [
              <span className="text-emerald-300">"physicist"</span>,{" "}
              <span className="text-emerald-300">"musician"</span>],{"\n"}
              {"}"};
            </code>
          </pre>
        </motion.div>
      </section>

      {/* Services */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto py-16 border-t border-slate-200">
        <h2 className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-8">
          What I do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6 rounded-xl bg-white border border-slate-200 hover:border-[var(--accent-border)] transition-colors"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Selected work preview */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto py-16 border-t border-slate-200">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-slate-400">
            Selected work
          </h2>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((project, i) => (
            <motion.a
              key={project.slug}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group block rounded-xl bg-white border border-slate-200 hover:border-[var(--accent-border)] p-6 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-slate-900 group-hover:text-[var(--accent)] transition-colors">
                  {project.title}
                </h3>
                <ArrowUpRight
                  size={16}
                  className="text-slate-300 group-hover:text-[var(--accent)] transition-colors shrink-0 mt-1"
                />
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-3">
                {project.description}
              </p>
              <p className="text-xs text-slate-400 mb-4">{project.outcome}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto py-16 border-t border-slate-200">
        <h2 className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-8">
          How a project runs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {process.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <span className="font-mono text-sm text-[var(--accent)]">
                0{i + 1}
              </span>
              <h3 className="text-base font-semibold text-slate-900 mt-2 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech stack strip */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto py-16 border-t border-slate-200">
        <h2 className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-6">
          Tools I reach for
        </h2>
        <div className="flex flex-wrap gap-3">
          {techStack.map((tool) => (
            <span
              key={tool}
              className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-sm text-slate-600 font-mono"
            >
              {tool}
            </span>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto pt-8 pb-24">
        <div className="rounded-2xl bg-slate-900 text-white px-8 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Have a project in mind?
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            I take on a small number of projects at a time — get in touch and
            I'll reply within a couple of days.
          </p>
          <a
            href="https://paolo.org.uk/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-slate-900 text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            Start a conversation <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}

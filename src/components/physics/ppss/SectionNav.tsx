"use client";

import { useEffect, useState } from "react";

export interface NavItem {
  id: string;
  label: string;
}

/** Sticky chapter list: a left rail on wide screens, a scrolling chip row on phones. */
export default function SectionNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  return (
    <>
      <nav aria-label="Report sections" className="hidden xl:block fixed left-6 top-40 w-48 z-30">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/35 mb-3">Contents</p>
        <ol className="space-y-2 text-sm">
          {items.map((i, k) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                className={`block border-l-2 pl-3 py-0.5 transition-colors ${
                  active === i.id ? "border-[var(--accent)] text-white" : "border-white/10 text-white/40 hover:text-white/70"
                }`}
              >
                <span className="font-mono text-[10px] mr-2 opacity-60">{k + 1}</span>
                {i.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <nav aria-label="Report sections" className="xl:hidden sticky top-16 z-30 -mx-6 px-6 py-2 bg-abyss/90 backdrop-blur border-b border-white/5 overflow-x-auto whitespace-nowrap">
        {items.map((i) => (
          <a
            key={i.id}
            href={`#${i.id}`}
            className={`inline-block mr-2 px-3 py-1 rounded-full text-xs border ${
              active === i.id ? "border-[var(--accent)] text-white" : "border-white/10 text-white/50"
            }`}
          >
            {i.label}
          </a>
        ))}
      </nav>
    </>
  );
}

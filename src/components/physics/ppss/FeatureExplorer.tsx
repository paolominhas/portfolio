"use client";

import { useState } from "react";
import { Widget } from "./ui";
import { FEATURES, FEATURE_GROUPS } from "@/data/ppss";

export default function FeatureExplorer() {
  const [g, setG] = useState<string>("Where it came from");
  const [sel, setSel] = useState<string | null>(null);
  const list = FEATURES.filter((f) => f.group === g);
  const f = FEATURES.find((x) => x.name === sel) ?? list[0];
  return (
    <Widget title="The 18 variables the model kept">
      <p className="text-sm text-white/55 mb-4">
        Out of 36 candidate variables, a preliminary model kept the 18 whose importance was above the median. They fall into six families. The one-line meanings are my plain-English reading of the variable names, not definitions from the LHCb software.
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {FEATURE_GROUPS.map((x) => (
          <button
            key={x}
            onClick={() => {
              setG(x);
              setSel(null);
            }}
            aria-pressed={x === g}
            className={`px-3 py-2 rounded-lg text-sm border ${
              x === g ? "bg-ember text-abyss border-ember font-bold" : "border-white/20 text-white/70 hover:bg-white/10"
            }`}
          >
            {x} <span className="opacity-60">({FEATURES.filter((y) => y.group === x).length})</span>
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <ul className="space-y-2">
          {list.map((x) => (
            <li key={x.name}>
              <button
                onClick={() => setSel(x.name)}
                aria-pressed={x.name === f.name}
                className={`w-full text-left px-3 py-2 rounded-lg font-mono text-xs break-all border ${
                  x.name === f.name ? "border-[var(--accent)] text-white bg-white/5" : "border-white/10 text-white/60 hover:bg-white/5"
                }`}
              >
                {x.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-white/10 p-4" aria-live="polite">
          <div className="font-mono text-xs text-[var(--accent)] break-all mb-2">{f.name}</div>
          <p className="text-white/75">{f.plain}</p>
        </div>
      </div>
    </Widget>
  );
}

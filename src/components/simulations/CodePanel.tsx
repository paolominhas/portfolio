"use client";

import { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";

/**
 * CODE PANEL
 *
 * Shows the Python source behind a simulation, collapsed by default
 * so it doesn't compete with the article's prose. This is what lets
 * an article say "here's the model" (SimulationPlayer) and "here's
 * how it was computed" (this) side by side.
 */

interface CodePanelProps {
  code: string;
  language?: string;
  caption?: string;
  defaultOpen?: boolean;
}

export default function CodePanel({
  code,
  language = "python",
  caption,
  defaultOpen = false,
}: CodePanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail (permissions, non-HTTPS) — fail quietly.
    }
  };

  return (
    <div className="not-prose my-8 rounded-xl border border-white/10 bg-zinc-900/50 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm text-zinc-300 font-mono">
          <Code2 size={14} className="text-zinc-500" />
          {caption || `${language} source`}
        </span>
        <span className="text-xs text-zinc-500 font-mono">
          {open ? "hide" : "show"}
        </span>
      </button>

      {open && (
        <div className="relative border-t border-white/10">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-400 transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
          <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed">
            <code className="font-mono text-zinc-300">{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

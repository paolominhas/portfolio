"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, ShieldAlert, RefreshCw } from "lucide-react";
import {
  DEMO_SECRET,
  OTHER_SECRET,
  b64urlDecode,
  bytesToHex,
  cryptoAvailable,
  flipOneCharacter,
  randomUuid,
  signTicket,
  swapTicketId,
  verifySignature,
  type Verdict,
} from "@/lib/case-study/ticket-crypto";

export default function QrSignatureLab() {
  const [supported, setSupported] = useState(true);
  const [ticketId, setTicketId] = useState("");
  const [genuine, setGenuine] = useState("");
  const [presented, setPresented] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [note, setNote] = useState("This is the genuine signature the server issued.");

  const issue = useCallback(async () => {
    const id = randomUuid();
    const sig = await signTicket(id, DEMO_SECRET);
    setTicketId(id);
    setGenuine(sig);
    setPresented(sig);
    setNote("This is the genuine signature the server issued.");
  }, []);

  useEffect(() => {
    if (!cryptoAvailable()) {
      setSupported(false);
      return;
    }
    void issue();
  }, [issue]);

  useEffect(() => {
    if (!presented || !supported) return;
    let live = true;
    verifySignature(presented, DEMO_SECRET).then((v) => live && setVerdict(v));
    return () => {
      live = false;
    };
  }, [presented, supported]);

  if (!supported) {
    return <p className="text-white/70 text-sm border border-white/10 rounded-xl p-4">This demo needs the browser&apos;s Web Crypto API, which is only available on secure (https) pages.</p>;
  }

  const raw = presented ? b64urlDecode(presented) : null;
  const idHex = raw && raw.length === 48 ? bytesToHex(raw.slice(0, 16)) : null;
  const macHex = raw && raw.length === 48 ? bytesToHex(raw.slice(16)) : null;

  const attacks: { label: string; run: () => Promise<void> | void }[] = [
    { label: "Flip one character", run: () => { setPresented(flipOneCharacter(genuine)); setNote("One character of the signature changed."); } },
    { label: "Put this signature on another ticket", run: () => { setPresented(swapTicketId(genuine, randomUuid())); setNote("The genuine MAC, glued onto a different ticket id."); } },
    { label: "Sign it with a guessed secret", run: async () => { setPresented(await signTicket(ticketId, OTHER_SECRET)); setNote("A perfectly well-formed signature, made without the real secret."); } },
    { label: "Make one up", run: () => { setPresented("TICKET-1234-FREE-ENTRY"); setNote("Something typed by hand."); } },
    { label: "Restore the genuine one", run: () => { setPresented(genuine); setNote("This is the genuine signature the server issued."); } },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-white/10 bg-navy-deep/60 p-6 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs uppercase tracking-widest text-white/55">Ticket id (random UUID)</label>
            <button type="button" onClick={() => void issue()} className="inline-flex items-center gap-1 text-xs text-lilac hover:text-white">
              <RefreshCw size={12} /> New ticket
            </button>
          </div>
          <code className="block text-sm text-white/90 break-all">{ticketId || "…"}</code>
        </div>

        <div>
          <label htmlFor="sig" className="text-xs uppercase tracking-widest text-white/55 block mb-1">What the QR code carries (editable)</label>
          <textarea
            id="sig"
            value={presented}
            onChange={(e) => { setPresented(e.target.value); setNote("You edited it."); }}
            rows={3}
            spellCheck={false}
            className="w-full rounded-lg bg-black/30 border border-white/10 p-3 font-mono text-xs text-white/90 focus:outline-none focus:border-yellow/70"
          />
          <p className="text-xs text-white/55 mt-1">{note}</p>
        </div>

        <div className="font-mono text-[11px] leading-relaxed space-y-1">
          <div><span className="text-lilac">ticket id · 16 bytes </span><span className="text-white/70 break-all">{idHex ?? "—"}</span></div>
          <div><span className="text-emerald-300">HMAC-SHA256 · 32 bytes </span><span className="text-white/70 break-all">{macHex ?? "—"}</span></div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-white/55 mb-2">Attack it</p>
          <div className="flex flex-wrap gap-2">
            {attacks.map((a) => (
              <button key={a.label} type="button" onClick={() => void a.run()} className="text-xs px-3 py-1.5 rounded-lg border border-white/15 bg-navy-deep/60 text-white/80 hover:border-yellow/60 hover:text-white transition-colors">
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-deep/60 p-6 flex flex-col" aria-live="polite">
        <p className="text-xs uppercase tracking-widest text-white/55 mb-3">Scanner verdict</p>
        {verdict?.ok ? (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-5 mb-4">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold text-lg"><CheckCircle2 /> Signature valid</div>
            <p className="text-sm text-white/80 mt-2">The MAC matches the ticket id it was issued for.{verdict.ticketId === ticketId ? "" : " (But this id is a different ticket from the one above.)"}</p>
          </div>
        ) : (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-5 mb-4">
            <div className="flex items-center gap-2 text-rose-300 font-semibold text-lg"><ShieldAlert /> {verdict ? (verdict.reason === "malformed" ? "Not a ticket" : "Signature rejected") : "Checking…"}</div>
            <p className="text-sm text-white/80 mt-2">{verdict && !verdict.ok ? verdict.detail : ""}</p>
          </div>
        )}
        <div className="text-sm text-white/70 space-y-3 leading-relaxed">
          <p>
            <strong className="text-white/90">How it works.</strong> The QR value is the ticket id followed by an HMAC-SHA256 of it. Without the secret, which lives only on the server, nobody can produce a matching pair, and changing even one bit of either half breaks the check.
          </p>
          <p>
            <strong className="text-white/90">What it doesn&apos;t do.</strong> A valid signature only proves a ticket was issued. Whether it has already been used or refunded is state, so the server still looks at the ticket row (under a lock) on every scan.
          </p>
          <p className="text-xs text-white/55">The secret in this demo is public and fake. It runs the same maths as backend/app/qr.py via the browser&apos;s Web Crypto.</p>
        </div>
      </div>
    </div>
  );
}

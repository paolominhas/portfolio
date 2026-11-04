"use client";

import { useMemo, useState } from "react";
import { caseStudy } from "@/data/euco-ticketing-case-study";

const { tickets, codes, bookingFeePence } = caseStudy.pricing;

const gbp = (p: number) => `£${(p / 100).toFixed(2)}`;

type Code = (typeof codes)[number];

/** Mirrors Discount.apply() in backend/app/pricing.py. */
function applyCode(unit: number, code: Code): number {
  if (unit <= 0) return 0;
  switch (code.kind) {
    case "free":
      return 0;
    case "percent":
      return Math.floor((unit * (100 - code.percent) + 50) / 100); // round half up
    case "amount":
      return Math.max(0, unit - code.amountPence);
    default:
      return unit;
  }
}

export default function FeeCalculator() {
  const [qty, setQty] = useState<Record<string, number>>({ adult: 2, student: 1, child: 0 });
  const [codeId, setCodeId] = useState("none");
  const [feeOn, setFeeOn] = useState(true);

  const code = codes.find((c) => c.code === codeId) ?? codes[0];

  const calc = useMemo(() => {
    const lines = tickets
      .map((t) => {
        const unit = applyCode(t.pence, code);
        return { ...t, q: qty[t.id] ?? 0, unit };
      })
      .filter((l) => l.q > 0);
    const ticketPence = lines.reduce((s, l) => s + l.unit * l.q, 0);
    const fullPence = lines.reduce((s, l) => s + l.pence * l.q, 0);
    const fee = ticketPence > 0 && code.kind === "none" && feeOn ? bookingFeePence : 0;
    const seats = lines.reduce((s, l) => s + l.q, 0);
    return { lines, ticketPence, fullPence, fee, total: ticketPence + fee, seats };
  }, [qty, code, feeOn]);

  const free = calc.seats > 0 && calc.ticketPence === 0;

  let route = "Add some tickets to see what happens.";
  if (calc.seats > 0) {
    route = free
      ? "Every ticket is £0, so Stripe is never involved: the order is completed immediately and tickets are issued, subject to the free-ticket limits."
      : "Sent to Stripe Checkout as one line per ticket type, plus a separate booking-fee line when it applies.";
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 space-y-5">
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white">{t.name}</div>
                <div className="text-xs text-zinc-500">{t.pence ? gbp(t.pence) : "Free"} (example price)</div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" aria-label={`Fewer ${t.name} tickets`} onClick={() => setQty({ ...qty, [t.id]: Math.max(0, (qty[t.id] ?? 0) - 1) })} className="h-8 w-8 rounded-lg border border-white/15 text-zinc-300 hover:border-indigo-400/60">−</button>
                <span className="w-6 text-center tabular-nums text-white">{qty[t.id] ?? 0}</span>
                <button type="button" aria-label={`More ${t.name} tickets`} onClick={() => setQty({ ...qty, [t.id]: Math.min(10, (qty[t.id] ?? 0) + 1) })} className="h-8 w-8 rounded-lg border border-white/15 text-zinc-300 hover:border-indigo-400/60">+</button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <label htmlFor="code" className="text-xs uppercase tracking-widest text-zinc-500 block mb-1">Discount code</label>
          <select id="code" value={codeId} onChange={(e) => setCodeId(e.target.value)} className="w-full rounded-lg bg-zinc-950 border border-white/10 p-2 text-sm text-zinc-200">
            {codes.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-400">
          <input type="checkbox" checked={feeOn} onChange={(e) => setFeeOn(e.target.checked)} className="accent-indigo-500" />
          Booking fee switched on in the CMS
        </label>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6" aria-live="polite">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">What the server charges</p>
        <table className="w-full text-sm mb-4">
          <tbody>
            {calc.lines.map((l) => (
              <tr key={l.id} className="border-b border-white/5">
                <td className="py-2 text-zinc-300">{l.q} × {l.name}</td>
                <td className="py-2 text-right tabular-nums text-zinc-400">
                  {l.unit !== l.pence && <span className="line-through text-zinc-600 mr-2">{gbp(l.pence)}</span>}
                  {gbp(l.unit)} each
                </td>
              </tr>
            ))}
            {calc.fee > 0 && (
              <tr className="border-b border-white/5">
                <td className="py-2 text-zinc-300">Booking fee (one per paid order)</td>
                <td className="py-2 text-right tabular-nums text-zinc-400">{gbp(calc.fee)}</td>
              </tr>
            )}
            <tr>
              <td className="pt-3 font-semibold text-white">Total</td>
              <td className="pt-3 text-right text-xl font-bold tabular-nums text-white">{gbp(calc.total)}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">{route}</p>
        {calc.seats > 0 && code.kind !== "none" && calc.ticketPence > 0 && <p className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mb-3">A discount code waives the booking fee: the fee exists to cover Stripe&apos;s charges on full-price orders.</p>}
        <details className="text-xs text-zinc-500">
          <summary className="cursor-pointer text-zinc-400">Why whole pennies?</summary>
          <p className="mt-2 leading-relaxed">Amounts are integers of pence everywhere (database, Stripe, maths). 20% off £6.00 is 480p exactly; a percentage that lands between pennies rounds half up, in one place, on the server. Floating-point pounds would drift and the totals would stop matching Stripe&apos;s.</p>
        </details>
      </div>
    </div>
  );
}

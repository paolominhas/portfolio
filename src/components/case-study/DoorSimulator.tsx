"use client";

import { useState } from "react";
import { Wifi, WifiOff, RotateCcw, QrCode } from "lucide-react";

/**
 * A model of the door app's decision logic (see ticketing/src/door/scanflow.ts
 * in the EUCO repo): server first, downloaded list as the fallback, queued
 * scans synced later. Nothing here talks to a network; the "server" is a
 * plain object, which is what makes the two-doors-offline clash easy to show.
 */

type Kind = "valid" | "used" | "forged" | "wrong" | "late";
type Outcome = "accepted" | "duplicate" | "invalid" | "wrong_concert" | "not_listed";

interface Card { id: string; name: string; type: string; kind: Kind; blurb: string }

const CARDS: Card[] = [
  { id: "a", name: "Alex M.", type: "Adult", kind: "valid", blurb: "A normal ticket" },
  { id: "b", name: "Sam P.", type: "Student", kind: "valid", blurb: "Another normal ticket" },
  { id: "c", name: "Jo B.", type: "Adult", kind: "used", blurb: "Came in at 18:52" },
  { id: "d", name: "Unknown", type: "?", kind: "forged", blurb: "Edited QR code" },
  { id: "e", name: "R. Khan", type: "Adult", kind: "wrong", blurb: "Real ticket, other concert" },
  { id: "f", name: "T. Lee", type: "Student", kind: "late", blurb: "Bought after the list downloaded" },
];

interface Ledger { [id: string]: { status: "valid" | "used"; by?: string; at?: string } }
interface Device {
  name: string;
  online: boolean;
  manifest: Ledger;
  queue: { id: string; at: string }[];
  last: { outcome: Outcome; who: string; text: string; via: "server" | "device" } | null;
}
interface LogLine { text: string; tone: "ok" | "warn" | "bad" | "info" }

const initialLedger = (): Ledger => ({
  a: { status: "valid" },
  b: { status: "valid" },
  c: { status: "used", by: "Door 1", at: "18:52" },
  f: { status: "valid" },
});
const initialManifest = (): Ledger => ({ a: { status: "valid" }, b: { status: "valid" }, c: { status: "used", by: "Door 1", at: "18:52" } });
const initialDevices = (): Device[] => [
  { name: "Door 1", online: true, manifest: initialManifest(), queue: [], last: null },
  { name: "Door 2", online: true, manifest: initialManifest(), queue: [], last: null },
];

const fmt = (m: number) => `19:${String(m).padStart(2, "0")}`;
const cardOf = (id: string) => CARDS.find((c) => c.id === id)!;

const LABEL: Record<Outcome, string> = {
  accepted: "Welcome",
  duplicate: "Already used",
  invalid: "Invalid ticket",
  wrong_concert: "Wrong concert",
  not_listed: "Not on this list",
};
const TONE: Record<Outcome, string> = {
  accepted: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
  duplicate: "bg-amber-500/15 border-amber-500/40 text-amber-300",
  invalid: "bg-rose-500/15 border-rose-500/40 text-rose-300",
  wrong_concert: "bg-rose-500/15 border-rose-500/40 text-rose-300",
  not_listed: "bg-rose-500/15 border-rose-500/40 text-rose-300",
};

/** The authoritative check, as backend scan_ticket() does it. Mutates `ledger`. */
function serverScan(ledger: Ledger, card: Card, by: string, at: string): { outcome: Outcome; text: string } {
  if (card.kind === "forged") return { outcome: "invalid", text: "Signature does not match ticket" };
  if (card.kind === "wrong") return { outcome: "wrong_concert", text: "This ticket is for a different concert" };
  const row = ledger[card.id];
  if (row.status === "used") return { outcome: "duplicate", text: `Already used at ${row.at} by ${row.by}` };
  ledger[card.id] = { status: "used", by, at };
  return { outcome: "accepted", text: "Welcome!" };
}

export default function DoorSimulator() {
  const [ledger, setLedger] = useState<Ledger>(initialLedger);
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [active, setActive] = useState(0);
  const [clock, setClock] = useState(0);
  const [log, setLog] = useState<LogLine[]>([]);

  const dev = devices[active];
  // Newest event first; the lines within one event read top to bottom.
  const push = (lines: LogLine[], base: LogLine[]) => [...lines, ...base].slice(0, 14);

  function scan(card: Card) {
    const at = fmt(clock + 3);
    const nextClock = clock + 1;
    const nd = devices.map((d) => ({ ...d, manifest: { ...d.manifest }, queue: [...d.queue] }));
    const d = nd[active];
    const lines: LogLine[] = [];

    if (d.online) {
      const L = { ...ledger };
      const res = serverScan(L, card, d.name, at);
      d.last = { outcome: res.outcome, who: card.name, text: res.text, via: "server" };
      if (L[card.id]) d.manifest[card.id] = { ...L[card.id] };
      setLedger(L);
      lines.push({ text: `${at} ${d.name} (online) · ${card.name} → ${LABEL[res.outcome]} · ${res.text}`, tone: res.outcome === "accepted" ? "ok" : "warn" });
    } else {
      let outcome: Outcome;
      let text: string;
      const row = d.manifest[card.id];
      if (card.kind === "forged") { outcome = "invalid"; text = "QR code doesn't match any ticket on the list"; }
      else if (!row) { outcome = "not_listed"; text = card.kind === "wrong" ? "Not on the list for this concert" : "Not on the offline list. Bought after this device last had signal: check their name and code."; }
      else if (row.status === "used") { outcome = "duplicate"; text = `Already used (recorded on this device${row.at ? ` at ${row.at}` : ""})`; }
      else { outcome = "accepted"; text = "Welcome! (offline: will sync)"; d.manifest[card.id] = { status: "used", by: d.name, at }; d.queue.push({ id: card.id, at }); }
      d.last = { outcome, who: card.name, text, via: "device" };
      lines.push({ text: `${at} ${d.name} (offline) · ${card.name} → ${LABEL[outcome]} · ${text}`, tone: outcome === "accepted" ? "ok" : "warn" });
    }
    setDevices(nd);
    setClock(nextClock);
    setLog((l) => push(lines, l));
  }

  function toggleWifi(i: number) {
    const nd = devices.map((d) => ({ ...d, manifest: { ...d.manifest }, queue: [...d.queue] }));
    const d = nd[i];
    if (d.online) {
      d.online = false;
      setDevices(nd);
      setLog((l) => push([{ text: `${d.name} lost signal.`, tone: "info" }], l));
      return;
    }
    // Reconnecting: replay the queue against the server, then refresh the list.
    d.online = true;
    const L = { ...ledger };
    const lines: LogLine[] = [{ text: `${d.name} is back online${d.queue.length ? `: syncing ${d.queue.length} queued scan${d.queue.length > 1 ? "s" : ""}…` : "."}`, tone: "info" }];
    for (const q of d.queue) {
      const card = cardOf(q.id);
      const res = serverScan(L, card, d.name, q.at);
      if (res.outcome === "accepted") lines.push({ text: `  sync · ${card.name} (scanned ${q.at}) → recorded`, tone: "ok" });
      else lines.push({ text: `  sync · ${card.name} (scanned ${q.at}) → CLASH: ${res.text.toLowerCase()}. Flagged for the committee, not hidden.`, tone: "bad" });
    }
    d.queue = [];
    // Fresh list: everything the server now knows about.
    d.manifest = Object.fromEntries(Object.entries(L).map(([k, v]) => [k, { ...v }]));
    setLedger(L);
    setDevices(nd);
    setLog((l) => push(lines, l));
  }

  function reset() {
    setLedger(initialLedger());
    setDevices(initialDevices());
    setClock(0);
    setLog([]);
    setActive(0);
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Tickets to present */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">1 · Hold a ticket up to the camera</p>
          <div className="grid grid-cols-2 gap-2">
            {CARDS.map((c) => (
              <button key={c.id} type="button" onClick={() => scan(c)} className="group text-left rounded-xl border border-white/10 bg-zinc-950/60 p-3 hover:border-indigo-400/60 transition-colors">
                <QrCode size={28} className="text-zinc-500 group-hover:text-indigo-300 mb-2" />
                <div className="text-sm font-semibold text-white">{c.name}</div>
                <div className="text-xs text-zinc-500">{c.type}</div>
                <div className="text-xs text-zinc-400 mt-1">{c.blurb}</div>
              </button>
            ))}
          </div>
        </div>

        {/* The phone */}
        <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-zinc-900/50 p-5" aria-live="polite">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">2 · The door phone</p>
          <div className="flex gap-2 mb-3">
            {devices.map((d, i) => (
              <button key={d.name} type="button" onClick={() => setActive(i)} className={`flex-1 text-sm rounded-lg border px-3 py-2 ${i === active ? "border-indigo-400/70 bg-indigo-500/10 text-white" : "border-white/10 text-zinc-400"}`}>
                {d.name}
                <span className={`ml-2 inline-block h-2 w-2 rounded-full ${d.online ? "bg-emerald-400" : "bg-rose-400"}`} />
                {d.queue.length > 0 && <span className="ml-2 text-[10px] text-amber-300">{d.queue.length} queued</span>}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => toggleWifi(active)} className="w-full flex items-center justify-center gap-2 text-sm rounded-lg border border-white/15 px-3 py-2 text-zinc-200 hover:border-indigo-400/60 mb-4">
            {dev.online ? <><Wifi size={16} /> Signal on. Tap to lose it</> : <><WifiOff size={16} /> No signal. Tap to reconnect</>}
          </button>
          <div className={`rounded-xl border p-5 min-h-[130px] ${dev.last ? TONE[dev.last.outcome] : "border-white/10 text-zinc-500"}`}>
            {dev.last ? (
              <>
                <div className="text-2xl font-bold">{LABEL[dev.last.outcome]}</div>
                <div className="text-sm text-zinc-200 mt-1">{dev.last.who}</div>
                <div className="text-xs text-zinc-300/80 mt-2">{dev.last.text}</div>
                <div className="text-[10px] uppercase tracking-widest mt-3 opacity-70">decided by {dev.last.via === "server" ? "the server" : "this phone's downloaded list"}</div>
              </>
            ) : (
              <div className="text-sm">Waiting for a scan on {dev.name}…</div>
            )}
          </div>
        </div>

        {/* Server */}
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">3 · The server&apos;s record</p>
          <ul className="space-y-2 text-sm">
            {CARDS.filter((c) => ledger[c.id]).map((c) => {
              const r = ledger[c.id];
              return (
                <li key={c.id} className="flex justify-between gap-2">
                  <span className="text-zinc-300">{c.name}</span>
                  <span className={r.status === "used" ? "text-emerald-300" : "text-zinc-500"}>{r.status === "used" ? `in ${r.at} · ${r.by}` : "not arrived"}</span>
                </li>
              );
            })}
          </ul>
          <button type="button" onClick={reset} className="mt-5 inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white">
            <RotateCcw size={12} /> Reset the evening
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 font-mono text-xs" aria-live="polite">
        <p className="text-zinc-500 uppercase tracking-widest mb-2">Event log</p>
        {log.length === 0 ? (
          <p className="text-zinc-600">Nothing yet. Try this: switch both doors offline, scan Alex M. on Door 1 and again on Door 2, then reconnect them one after the other.</p>
        ) : (
          <ul className="space-y-1">
            {log.map((l, i) => (
              <li key={i} className={l.tone === "ok" ? "text-emerald-300" : l.tone === "bad" ? "text-rose-300" : l.tone === "warn" ? "text-amber-300" : "text-zinc-400"}>{l.text}</li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-sm text-zinc-500 max-w-3xl leading-relaxed">
        Two phones that are both offline can&apos;t know about each other, so both admit the same ticket. When they reconnect the server settles it: the first scan to arrive is recorded and the other is flagged for a human, not silently dropped. That is the honest trade for never turning a queue away at the door.
      </p>
    </div>
  );
}

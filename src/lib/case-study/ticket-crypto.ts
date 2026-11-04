/**
 * Browser-side re-implementation of EUCO's ticket QR signing, used by the
 * "Try to forge a ticket" demo on /projects/euco-ticketing.
 *
 * It mirrors backend/app/qr.py exactly:
 *
 *     payload   = ticket UUID as 16 raw bytes
 *     signature = base64url( payload || HMAC-SHA256(payload, secret) )   // 48 bytes -> 64 chars
 *
 * The secret below is a DEMO secret that exists only on this page. The real
 * one lives in the backend environment and never leaves the server.
 */

export const DEMO_SECRET = "euco-demo-secret-this-is-not-the-real-one";
export const OTHER_SECRET = "a-different-secret-an-attacker-might-guess";

const enc = new TextEncoder();

export function cryptoAvailable(): boolean {
  return typeof crypto !== "undefined" && !!crypto.subtle;
}

export function randomUuid(): string {
  const c: Crypto = crypto;
  if (typeof c.randomUUID === "function") return c.randomUUID();
  const b = c.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  return bytesToUuid(b);
}

export function uuidToBytes(uuid: string): Uint8Array | null {
  const hex = uuid.replace(/-/g, "").toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(hex)) return null;
  const out = new Uint8Array(16);
  for (let i = 0; i < 16; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

export function bytesToUuid(b: Uint8Array): string {
  const h = bytesToHex(b);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export function bytesToHex(b: Uint8Array): string {
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}

export function b64urlEncode(bytes: Uint8Array): string {
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_");
}

export function b64urlDecode(text: string): Uint8Array | null {
  try {
    const s = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
    return Uint8Array.from(s, (c) => c.charCodeAt(0));
  } catch {
    return null;
  }
}

async function hmacKey(secret: string, usage: "sign" | "verify"): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", enc.encode(secret) as BufferSource, { name: "HMAC", hash: "SHA-256" }, false, [usage]);
}

export async function signTicket(uuid: string, secret: string): Promise<string> {
  const payload = uuidToBytes(uuid);
  if (!payload) throw new Error("Not a valid ticket id");
  const key = await hmacKey(secret, "sign");
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, payload as BufferSource));
  const out = new Uint8Array(48);
  out.set(payload, 0);
  out.set(mac, 16);
  return b64urlEncode(out);
}

export type Verdict =
  | { ok: true; ticketId: string }
  | { ok: false; reason: "malformed" | "mismatch"; detail: string };

export async function verifySignature(signature: string, secret: string): Promise<Verdict> {
  const raw = b64urlDecode(signature.trim());
  if (!raw || raw.length !== 48) {
    return { ok: false, reason: "malformed", detail: "Not 48 bytes of base64url: the scanner rejects it before doing any maths." };
  }
  const payload = raw.slice(0, 16);
  const mac = raw.slice(16);
  const key = await hmacKey(secret, "verify");
  // crypto.subtle.verify compares in constant time, like hmac.compare_digest on the server.
  const ok = await crypto.subtle.verify("HMAC", key, mac as BufferSource, payload as BufferSource);
  return ok
    ? { ok: true, ticketId: bytesToUuid(payload) }
    : { ok: false, reason: "mismatch", detail: "The MAC does not match this ticket id. Only someone holding the secret could have produced it." };
}

/** Change one character in the middle of the signature, keeping it valid base64url. */
export function flipOneCharacter(signature: string): string {
  const i = 30;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  const current = signature[i] ?? "A";
  const next = alphabet[(alphabet.indexOf(current) + 1) % alphabet.length];
  return signature.slice(0, i) + next + signature.slice(i + 1);
}

/** Keep the MAC, swap in a different ticket's id: "re-use a real signature on another ticket". */
export function swapTicketId(signature: string, newUuid: string): string {
  const raw = b64urlDecode(signature);
  const id = uuidToBytes(newUuid);
  if (!raw || raw.length !== 48 || !id) return signature;
  const out = new Uint8Array(raw);
  out.set(id, 0);
  return b64urlEncode(out);
}

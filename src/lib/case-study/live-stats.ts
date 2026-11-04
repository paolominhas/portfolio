/**
 * Optional live numbers for the EUCO case study.
 *
 * Set EUCO_API_URL (e.g. https://api.eu-co.co.uk) in the paolo.org.uk
 * environment and the page will read GET {EUCO_API_URL}/api/site/public-stats on
 * the server, cached for an hour (Next ISR). That endpoint returns totals only:
 * no names, emails, order ids or prices.
 *
 * With no env var, or if EUCO is unreachable, this returns null and the page
 * quietly falls back to the static figures in data/euco-ticketing-case-study.ts.
 * It can never break the build or the page.
 */

export interface LiveStats {
  concerts: number;
  orders: number;
  tickets_issued: number;
  tickets_scanned: number;
  updated_at: string;
}

const isCount = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0;

export async function getLiveStats(): Promise<LiveStats | null> {
  const base = process.env.EUCO_API_URL;
  if (!base) return null;
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/site/public-stats`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const j = (await res.json()) as Record<string, unknown>;
    if (!isCount(j.concerts) || !isCount(j.orders) || !isCount(j.tickets_issued) || !isCount(j.tickets_scanned)) return null;
    return {
      concerts: j.concerts,
      orders: j.orders,
      tickets_issued: j.tickets_issued,
      tickets_scanned: j.tickets_scanned,
      updated_at: typeof j.updated_at === "string" ? j.updated_at : "",
    };
  } catch {
    return null;
  }
}

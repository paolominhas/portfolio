export type Skin = "main" | "physics" | "web";

export interface RailItem {
  name: string;
  /** Site-relative path ("/research") or a full URL. */
  path: string;
}

/** The three sites that share the rail. `color` is the channel colour used to mark each one. */
export const SITES: { key: Skin; name: string; href: string; color: string; blurb: string }[] = [
  { key: "main", name: "Main", href: "https://paolo.org.uk", color: "var(--ch-main)", blurb: "Who I am and what I have built" },
  { key: "physics", name: "Physics", href: "https://physics.paolo.org.uk", color: "var(--ch-physics)", blurb: "Research and simulations" },
  { key: "web", name: "Web", href: "https://web.paolo.org.uk", color: "var(--ch-web)", blurb: "Development and design" },
];

/** Smaller sites, listed in the footer only. */
export const SIDE_SITES = [
  { name: "Music", href: "https://music.paolo.org.uk", color: "var(--ch-music)", blurb: "Arrangements" },
  { name: "Tutor", href: "https://tutor.paolo.org.uk", color: "#f2a93b", blurb: "Maths and physics tuition" },
];

export const MAIN_PAGES = [
  { name: "Home", href: "https://paolo.org.uk" },
  { name: "About", href: "https://paolo.org.uk/about" },
  { name: "Projects", href: "https://paolo.org.uk/projects" },
  { name: "Contact", href: "https://paolo.org.uk/contact" },
];

/** usePathname() gives the rewritten internal path on a subdomain (/physics/research); make it site-relative. */
export function sitePath(pathname: string, skin: Skin) {
  if (skin === "main") return pathname || "/";
  const pre = `/${skin}`;
  return pathname.startsWith(pre) ? pathname.slice(pre.length) || "/" : pathname;
}

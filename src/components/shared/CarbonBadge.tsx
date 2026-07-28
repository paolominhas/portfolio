"use client";

import Script from "next/script";

/**
 * WEBSITE CARBON BADGE
 *
 * Wraps the official websitecarbon.com badge embed
 * (https://www.websitecarbon.com/badge/) as a proper Next.js component.
 *
 * The badge itself is a small third-party script (`b.min.js`) that finds
 * the `#wcb` div and fills it in client-side, calling the Website Carbon
 * API at most once per page per day (result is cached in localStorage).
 * There's nothing to self-host: the div + script tag *is* the whole
 * integration surface.
 *
 * USAGE:
 *   <CarbonBadge theme="dark" />   // white text/icons, for dark footers
 *   <CarbonBadge theme="light" />  // dark text/icons, for light footers
 *
 * If this ever needs to move off unpkg (e.g. for stricter CSP), the
 * package is also on npm as `website-carbon-badges` and can be
 * self-hosted from /public instead — swap the `src` below.
 */

interface CarbonBadgeProps {
  theme?: "dark" | "light";
  className?: string;
}

export default function CarbonBadge({
  theme = "dark",
  className = "",
}: CarbonBadgeProps) {
  return (
    <>
      <div
        id="wcb"
        className={`carbonbadge ${theme === "dark" ? "wcb-d" : ""} ${className}`}
      />
      <Script
        src="https://unpkg.com/website-carbon-badges@1.1.2/b.min.js"
        strategy="lazyOnload"
      />
    </>
  );
}

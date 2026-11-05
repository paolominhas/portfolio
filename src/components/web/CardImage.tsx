"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Card thumbnail that quietly disappears if the file isn't in /public yet
 * (the navy panel behind it remains). The effect also catches images that
 * failed before React hydrated, when onError would never have fired.
 */
export default function CardImage({ src, className }: { src: string; className?: string }) {
  const [ok, setOk] = useState(true);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setOk(false);
  }, [src]);
  if (!ok) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt="" className={className} onError={() => setOk(false)} />;
}

"use client";

import { useState } from "react";

/** Card thumbnail that quietly disappears if the file isn't in /public yet (the navy panel behind it remains). */
export default function CardImage({ src, className }: { src: string; className?: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className={className} onError={() => setOk(false)} />;
}

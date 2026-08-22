import type { Metadata } from "next";
import IsingSandboxPage from "@/components/physics/IsingSandboxPage";

/**
 * This file stays a Server Component (so it can export `metadata`)
 * and does nothing but render the actual interactive page, which
 * needs "use client" for its state — see IsingSandboxPage.tsx.
 */

export const metadata: Metadata = {
  title: "Ising Model",
  description:
    "Interactive 2D Ising model — Glauber and Kawasaki dynamics, ported from Python/Numba to a live TypeScript canvas.",
};

export default function IsingPage() {
  return <IsingSandboxPage />;
}

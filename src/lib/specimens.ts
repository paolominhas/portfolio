import fs from "node:fs";
import path from "node:path";
import { SPECIMEN_SLOTS } from "@/data/specimens";

/**
 * Which specimen slots have a file. Runs on the server (layouts call it), reads
 * public/images/specimens once per build/render and returns { slotId: url }.
 * Import this only from server components.
 */
const EXT = [".webp", ".avif", ".png"];

export function availableSpecimens(): Record<string, string> {
  const dir = path.join(process.cwd(), "public", "images", "specimens");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return {};
  }
  const out: Record<string, string> = {};
  for (const slot of SPECIMEN_SLOTS) {
    for (const ext of EXT) {
      if (files.includes(slot.id + ext)) {
        out[slot.id] = `/images/specimens/${slot.id}${ext}`;
        break;
      }
    }
  }
  return out;
}

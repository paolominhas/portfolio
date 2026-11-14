import localFont from "next/font/local";

/**
 * SITE TYPEFACES (self-hosted variable fonts, SIL Open Font License 1.1).
 *
 *   Instrument Sans      reading text and interface, all sites (weight 400-700, width 75-100)
 *   Martian Mono         readouts, measurements, code labels (weight 100-800)
 *   Bricolage Grotesque  the web site's heavy display face (weight 200-800)
 *
 * Physics keeps Bodoni Moda as its display face (loaded in physics/layout.tsx).
 * The files live next to this module so the build never has to fetch from Google.
 * Latin subset only; Greek and maths glyphs fall back to the system font.
 */
export const instrumentSans = localFont({ src: "./InstrumentSans-var.woff2", variable: "--font-instrument", weight: "400 700", display: "swap" });
export const martianMono = localFont({ src: "./MartianMono-var.woff2", variable: "--font-martian", weight: "100 800", display: "swap" });
export const bricolage = localFont({ src: "./BricolageGrotesque-var.woff2", variable: "--font-bricolage", weight: "200 800", display: "swap" });

/** Class string that defines the shared font variables; put it on a skin wrapper. */
export const fontVars = `${instrumentSans.variable} ${martianMono.variable}`;

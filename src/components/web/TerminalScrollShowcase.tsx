"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
  useInView,
  type MotionValue,
} from "framer-motion";
import {
  Terminal as TerminalIcon,
  Palette,
  Languages,
  Box,
  Package,
  CreditCard,
  Lock,
} from "lucide-react";

/**
 * TERMINAL SCROLL SHOWCASE
 * ─────────────────────────────────────────────────────────────────
 * A single continuous 400vh scroll track containing four full-face
 * "the editor drives the visual" sequences: an autonomous theme
 * loop, a scroll-linked live translation, a scroll-linked 3D CSS
 * tilt, and a scroll-linked payment-gateway swap.
 *
 * ── Architecture ─────────────────────────────────────────────────
 * `trackRef` is a 400vh block. Its only child is `h-screen sticky
 * top-0`, so the moment the track's top edge reaches the viewport's
 * top edge, the sticky child is already viewport-sized and pinned.
 * `useScroll({ target: trackRef, offset: ["start start", "end end"] })`
 * then produces a clean, continuous 0→1 value across exactly the
 * pinned scroll distance (300vh) — no scroll-snap, no discrete steps.
 * That value is smoothed through a spring (skipped under
 * prefers-reduced-motion) and handed to every sequence below as
 * `progress`.
 *
 * ── The "editor" metaphor ────────────────────────────────────────
 * Rather than a shell echoing single commands, the left panel now
 * reads as a real code editor: each sequence opens a plausible file
 * (`theme.config.ts`, `i18n/localize.ts`, `Mockup.tsx`,
 * `package.json`) with several lines of static, dimmed context above
 * and below the one line actually being changed. That line carries a
 * continuously pulsing glow (`CodeLine glow`) so it reads as "this is
 * what's live right now" — the pulse itself is the animation change
 * from the previous build, which used a static, non-animated glow.
 * The literal `paolominhas@portfolio ~/web $` prompt is kept as the
 * line that "opens" each file, so the terminal identity survives the
 * redesign.
 *
 * ── Per-sequence pattern ─────────────────────────────────────────
 * Each sequence is a custom hook that takes the shared `progress`
 * plus a pre-computed crossfade `opacity` for its 0.25-wide window,
 * and returns `{ terminal, visual }` — two JSX fragments rendered
 * into the left and right panels respectively, so the editor line and
 * the visual it drives stay colocated in one hook even though their
 * output lands in two different panels.
 *
 * Sequence 2 (translation) now drives a *whole mocked-up recipe site*
 * — browser chrome, nav, illustrated hero, copy, CTA — all keyed off
 * one `locale` state, so every visible string swaps language in the
 * same instant rather than just a single card's text.
 */

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** The literal prompt string, reused whenever a sequence "opens" a file. */
function PromptPrefix() {
  return (
    <span className="whitespace-pre">
      <span className="text-lilac">paolominhas@portfolio</span>
      <span className="text-white/40"> ~/web </span>
      <span className="text-yellow">$</span>{" "}
    </span>
  );
}

function BlinkingCursor({ className = "" }: { className?: string }) {
  return (
    <motion.span
      aria-hidden
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
      className={`inline-block w-[7px] h-[1em] translate-y-[2px] bg-yellow ${className}`}
    />
  );
}

/** Wraps a stage's terminal/visual output, crossfading via a shared MotionValue<number>. */
function StageLayer({
  opacity,
  className = "",
  children,
}: {
  opacity: MotionValue<number>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div style={{ opacity }} className={`absolute inset-0 ${className}`}>
      {children}
    </motion.div>
  );
}

/** The little file tab + line-numbered body every sequence opens. */
function EditorPane({ filename, children }: { filename: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-yellow/60" />
        <span className="font-mono text-[11px] text-white/40">{filename}</span>
      </div>
      <div className="py-2">{children}</div>
    </div>
  );
}

/**
 * One line inside an EditorPane. `dim` renders it as inert surrounding
 * context; `glow` marks it as the line currently being edited and wraps
 * it in a continuously pulsing box-shadow — an actual animation (not a
 * static highlight), which is the "changes to the animations" part of
 * this redesign.
 */
function CodeLine({
  n,
  dim = false,
  glow = false,
  children,
}: {
  n: number;
  dim?: boolean;
  glow?: boolean;
  children?: ReactNode;
}) {
  const row = (
    <div className="flex gap-3 px-4 py-[3px]">
      <span className="w-5 shrink-0 select-none text-right font-mono text-[11px] text-white/20">
        {n}
      </span>
      <span
        className={`whitespace-pre-wrap break-all font-mono text-[12px] leading-[1.6] md:text-[13px] ${
          dim ? "text-white/35" : "text-white/90"
        }`}
      >
        {children}
      </span>
    </div>
  );

  if (!glow) return row;

  return (
    <motion.div
      animate={{
        boxShadow: [
          "inset 3px 0 0 0 rgba(167,139,250,0.85), 0 0 0px rgba(167,139,250,0)",
          "inset 3px 0 0 0 rgba(167,139,250,0.85), 0 0 14px rgba(167,139,250,0.42)",
          "inset 3px 0 0 0 rgba(167,139,250,0.85), 0 0 0px rgba(167,139,250,0)",
        ],
      }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      className="rounded-[2px] bg-white/[0.05]"
    >
      {row}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Sequence 1 — The Infinite Color Loop (0.0 – 0.25)
// ---------------------------------------------------------------------------

interface ThemeDef {
  bg: string;
  accent: string;
}

// Navy/yellow first — a small wink at the site's own palette — then a
// nod to /music (magenta/lime), then a cool slate/sky pair.
const THEMES: ThemeDef[] = [
  { bg: "#101585", accent: "#FFDD44" },
  { bg: "#FF007F", accent: "#D6FF00" },
  { bg: "#334155", accent: "#38BDF8" },
];

type ColorPhase =
  | "typing-bg"
  | "typing-accent"
  | "holding"
  | "deleting-accent"
  | "deleting-bg";

function useColorLoopStage({
  opacity,
  isPlaying,
  reduceMotion,
}: {
  opacity: MotionValue<number>;
  isPlaying: boolean;
  reduceMotion: boolean;
}) {
  const [themeIndex, setThemeIndex] = useState(0);
  const [bgChars, setBgChars] = useState(reduceMotion ? THEMES[0].bg.length : 0);
  const [accentChars, setAccentChars] = useState(
    reduceMotion ? THEMES[0].accent.length : 0,
  );
  const [phase, setPhase] = useState<ColorPhase>(
    reduceMotion ? "holding" : "typing-bg",
  );

  useEffect(() => {
    if (reduceMotion || !isPlaying) return;

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timeouts.push(setTimeout(resolve, ms));
      });

    async function loop(startIndex: number) {
      let idx = startIndex;
      while (!cancelled) {
        const theme = THEMES[idx];

        setPhase("typing-bg");
        setAccentChars(0);
        for (let i = 1; i <= theme.bg.length; i++) {
          if (cancelled) return;
          setBgChars(i);
          await wait(16 + Math.random() * 22);
        }
        if (cancelled) return;
        await wait(150);

        setPhase("typing-accent");
        for (let i = 1; i <= theme.accent.length; i++) {
          if (cancelled) return;
          setAccentChars(i);
          await wait(16 + Math.random() * 22);
        }
        if (cancelled) return;

        setThemeIndex(idx);
        setPhase("holding");
        await wait(1500);
        if (cancelled) return;

        setPhase("deleting-accent");
        for (let i = theme.accent.length; i >= 0; i--) {
          if (cancelled) return;
          setAccentChars(i);
          await wait(8 + Math.random() * 12);
        }
        if (cancelled) return;

        setPhase("deleting-bg");
        for (let i = theme.bg.length; i >= 0; i--) {
          if (cancelled) return;
          setBgChars(i);
          await wait(8 + Math.random() * 12);
        }
        if (cancelled) return;

        await wait(300);
        idx = (idx + 1) % THEMES.length;
      }
    }

    loop(0);
    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [isPlaying, reduceMotion]);

  const theme = THEMES[themeIndex];
  const bgText = reduceMotion ? THEMES[0].bg : theme.bg.slice(0, bgChars);
  const accentText = reduceMotion ? THEMES[0].accent : theme.accent.slice(0, accentChars);

  const terminal = (
    <StageLayer opacity={opacity} className="flex flex-col justify-center gap-3">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/30">
        <Palette size={12} /> autonomous theme loop
      </p>
      <p className="text-xs text-white/50">
        <PromptPrefix /> code theme.config.ts
      </p>
      <EditorPane filename="theme.config.ts">
        <CodeLine n={1} dim>{`export const theme = {`}</CodeLine>
        <CodeLine n={2} dim>{`  typography: { family: "Inter", weight: 700 },`}</CodeLine>
        <CodeLine n={3} dim>{`  radius: "12px",`}</CodeLine>
        <CodeLine n={4} dim>{`  palette: {`}</CodeLine>
        <CodeLine n={5} glow>
          {'    background: "'}
          <span className="text-yellow">{bgText}</span>
          {'",'}
          {!reduceMotion && phase === "typing-bg" && <BlinkingCursor />}
        </CodeLine>
        <CodeLine n={6} glow>
          {'    accent: "'}
          <span className="text-yellow">{accentText}</span>
          {'",'}
          {!reduceMotion && phase === "typing-accent" && <BlinkingCursor />}
        </CodeLine>
        <CodeLine n={7} dim>{`  },`}</CodeLine>
        <CodeLine n={8} dim>{`};`}</CodeLine>
      </EditorPane>
      <AnimatePresence>
        {phase === "holding" && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pl-1 text-xs text-yellow/70"
          >
            ✓ theme applied → bg {theme.bg} · accent {theme.accent}
          </motion.p>
        )}
      </AnimatePresence>
    </StageLayer>
  );

  const visual = (
    <StageLayer opacity={opacity}>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ backgroundColor: theme.bg }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      >
        <motion.div
          key={themeIndex}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-8 text-center"
        >
          <motion.p
            animate={{ color: theme.accent }}
            transition={{ duration: 0.9 }}
            className="mb-4 font-mono text-xs uppercase tracking-[0.3em]"
          >
            Live theme engine
          </motion.p>
          <h3 className="mb-6 text-4xl font-black tracking-tight text-white md:text-5xl">
            Design tokens,
            <br />
            applied in real time.
          </h3>
          <div className="flex items-center justify-center gap-3 font-mono text-xs">
            <motion.span
              animate={{ borderColor: theme.accent, color: theme.accent }}
              transition={{ duration: 0.9 }}
              className="rounded-full border px-3 py-1.5"
            >
              {theme.bg}
            </motion.span>
            <motion.span
              animate={{ backgroundColor: theme.accent, color: theme.bg }}
              transition={{ duration: 0.9 }}
              className="rounded-full px-3 py-1.5"
            >
              {theme.accent}
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </StageLayer>
  );

  return { terminal, visual };
}

// ---------------------------------------------------------------------------
// Sequence 2 — Real-Time Translation (0.25 – 0.50)
// ---------------------------------------------------------------------------

const RECIPE_COPY = {
  en: {
    siteName: "The Bake Book",
    nav: ["Recipes", "About", "Contact"],
    eyebrow: "Recipe · Baking · 45 min",
    title: "Classic Buttery Shortbread",
    subtitle: "Three ingredients, one perfect crumb.",
    ingredientsHeading: "Ingredients",
    ingredients: [
      "250g unsalted butter, softened",
      "125g caster sugar",
      "375g plain flour",
      "A pinch of salt",
    ],
    methodHeading: "Method",
    method:
      "Cream the butter and sugar until pale, work in the flour and salt, press into a tin, prick all over, and bake low and slow until barely golden.",
    cta: "Save recipe",
  },
  it: {
    siteName: "Il Ricettario",
    nav: ["Ricette", "Chi siamo", "Contatti"],
    eyebrow: "Ricetta · Dolci · 45 min",
    title: "Frollini Classici al Burro",
    subtitle: "Tre ingredienti, una consistenza perfetta.",
    ingredientsHeading: "Ingredienti",
    ingredients: [
      "250g di burro non salato, ammorbidito",
      "125g di zucchero semolato",
      "375g di farina 00",
      "Un pizzico di sale",
    ],
    methodHeading: "Procedimento",
    method:
      "Amalgama burro e zucchero fino a renderli chiari, incorpora farina e sale, stendi in una teglia, punzecchia la superficie e cuoci a bassa temperatura finché dorato.",
    cta: "Salva ricetta",
  },
} as const;

type Locale = keyof typeof RECIPE_COPY;

// Deterministic (no Math.random at render time, so SSR/CSR markup can
// never mismatch) fork-prick dots for the shortbread illustration.
function prickDots(
  startX: number,
  startY: number,
  cols: number,
  rows: number,
  stepX: number,
  stepY: number,
  keyPrefix: string,
) {
  const dots: ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <circle
          key={`${keyPrefix}-${r}-${c}`}
          cx={startX + c * stepX}
          cy={startY + r * stepY}
          r={1.5}
          fill="#9C6B2E"
          opacity={0.5}
        />,
      );
    }
  }
  return dots;
}

const SUGAR_DUST: Array<[number, number, number]> = [
  [128, 138, 0.9],
  [146, 128, 0.6],
  [162, 145, 1.1],
  [180, 125, 0.7],
  [198, 140, 0.9],
  [214, 122, 0.6],
  [230, 136, 1.0],
  [246, 128, 0.7],
  [140, 158, 0.6],
  [172, 152, 0.8],
  [206, 156, 0.6],
  [238, 150, 0.9],
  [155, 118, 0.5],
  [220, 116, 0.6],
];

/**
 * A small illustrated plate of shortbread — built from gradients, SVG
 * shapes and fixed-position "sugar dust" rather than a licensed stock
 * photo, so there's no image-rights dependency and nothing that can
 * 404 later.
 */
function ShortbreadIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <radialGradient id="sbPlate" cx="50%" cy="38%" r="72%">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="100%" stopColor="#EFE8D6" />
        </radialGradient>
        <linearGradient id="sbFinger" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0CE8C" />
          <stop offset="100%" stopColor="#D9A85C" />
        </linearGradient>
      </defs>

      <ellipse cx="200" cy="180" rx="172" ry="66" fill="url(#sbPlate)" stroke="#E2D9BE" strokeWidth="2" />
      <ellipse
        cx="200"
        cy="176"
        rx="150"
        ry="54"
        fill="none"
        stroke="#E2D9BE"
        strokeWidth="1.5"
        opacity="0.55"
      />

      <g transform="rotate(-13 200 150)">
        <rect x="118" y="120" width="150" height="38" rx="8" fill="url(#sbFinger)" stroke="#B8823E" strokeWidth="1.5" />
        {prickDots(138, 130, 4, 3, 28, 9, "p1")}
      </g>
      <g transform="rotate(-1 200 152)">
        <rect x="112" y="132" width="162" height="40" rx="8" fill="url(#sbFinger)" stroke="#B8823E" strokeWidth="1.5" />
        {prickDots(132, 142, 5, 3, 28, 9, "p2")}
      </g>
      <g transform="rotate(12 200 154)">
        <rect x="118" y="144" width="150" height="38" rx="8" fill="url(#sbFinger)" stroke="#B8823E" strokeWidth="1.5" />
        {prickDots(138, 154, 4, 3, 28, 9, "p3")}
      </g>

      {SUGAR_DUST.map(([x, y, r], i) => (
        <circle key={`dust-${i}`} cx={x} cy={y} r={r} fill="#FFFFFF" opacity={0.85} />
      ))}

      <g transform="translate(286 110) rotate(18)">
        <path d="M0 0 C10 -6 18 -4 24 6 C16 4 8 6 0 0 Z" fill="#5B8C6E" />
        <path d="M0 0 C10 6 18 10 26 4 C16 2 8 -2 0 0 Z" fill="#6FA37F" />
      </g>
    </svg>
  );
}

/**
 * Crossfades a single piece of copy whenever its text changes. Every
 * call site below reads from the same `locale`-derived `copy` object,
 * so all of them change key — and therefore crossfade — in the same
 * render, which is what makes the whole mockup translate at once
 * rather than one card in isolation.
 */
function LocaleFade({ text, className = "" }: { text: string; className?: string }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={text}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`inline-block ${className}`}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}

function useTranslationStage({
  progress,
  opacity,
}: {
  progress: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  // 0 → 1 across exactly this sequence's 0.25-wide window. Because
  // this is derived straight from scroll progress (not a JS timer),
  // scrolling back up naturally reverses everything below.
  const local = useTransform(progress, [0.25, 0.5], [0, 1]);

  const typedLocale = useTransform(local, (l): string => {
    const tp = clamp01(l / 0.5);
    return "it-IT".slice(0, Math.round(tp * "it-IT".length));
  });
  const outputOpacity = useTransform(local, [0.5, 0.58], [0, 1]);

  // Small hysteresis band so a scroll position hovering right at the
  // threshold doesn't flap the whole page back and forth.
  const [locale, setLocale] = useState<Locale>("en");
  useMotionValueEvent(local, "change", (l) => {
    setLocale((prev) => {
      if (l >= 0.62) return "it";
      if (l <= 0.48) return "en";
      return prev;
    });
  });

  const copy = RECIPE_COPY[locale];

  const terminal = (
    <StageLayer opacity={opacity} className="flex flex-col justify-center gap-3">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/30">
        <Languages size={12} /> scroll-linked translation
      </p>
      <p className="text-xs text-white/50">
        <PromptPrefix /> code i18n/localize.ts
      </p>
      <EditorPane filename="i18n/localize.ts">
        <CodeLine n={1} dim>{`import { translateNode } from "@/lib/i18n";`}</CodeLine>
        <CodeLine n={2} dim>{``}</CodeLine>
        <CodeLine n={3} dim>{`export async function localizeRecipe(doc: RecipeDoc) {`}</CodeLine>
        <CodeLine n={4} dim>{`  const source = "en-GB";`}</CodeLine>
        <CodeLine n={5} dim>{``}</CodeLine>
        <CodeLine n={6} glow>
          {'  return translateNode(doc, { target: "'}
          <motion.span
            className="text-yellow"
            style={{
              textShadow:
                "0 0 8px rgba(167,139,250,0.85), 0 0 18px rgba(167,139,250,0.45)",
            }}
          >
            {typedLocale}
          </motion.span>
          {'" });'}
          <BlinkingCursor />
        </CodeLine>
        <CodeLine n={7} dim>{`}`}</CodeLine>
        <CodeLine n={8} dim>{`// re-render triggers a full-tree locale swap`}</CodeLine>
      </EditorPane>
      <motion.p style={{ opacity: outputOpacity }} className="pl-1 text-xs text-yellow/70">
        ✓ 14 nodes retranslated → it-IT
      </motion.p>
    </StageLayer>
  );

  const visual = (
    <StageLayer
      opacity={opacity}
      className="flex items-center justify-center bg-[#EFE9DC] p-4 md:p-8"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_30px_80px_rgba(16,21,133,0.15)]">
        {/* fake browser chrome, echoing the wireframe in sequence 3 */}
        <div className="flex items-center gap-2 border-b border-navy/10 bg-[#F5F1E6] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-navy/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-navy/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-navy/10" />
          <span className="ml-2 flex-1 truncate rounded-full bg-white px-3 py-1 text-center font-mono text-[10px] text-navy/40">
            shortbread-recipes.app
          </span>
        </div>

        {/* site nav */}
        <div className="flex items-center justify-between border-b border-navy/10 px-5 py-3">
          <LocaleFade text={copy.siteName} className="font-serif text-sm font-bold text-navy" />
          <div className="hidden gap-4 sm:flex">
            {copy.nav.map((item, i) => (
              <LocaleFade
                key={i}
                text={item}
                className="text-[11px] uppercase tracking-wide text-navy/50"
              />
            ))}
          </div>
        </div>

        {/* hero */}
        <div className="px-5 pt-5">
          <div className="overflow-hidden rounded-xl bg-[#FBF7EC]">
            <ShortbreadIllustration className="h-36 w-full md:h-44" />
          </div>
        </div>

        <div className="px-5 py-5">
          <LocaleFade
            text={copy.eyebrow}
            className="mb-2 font-mono text-[10px] uppercase tracking-widest text-navy/40"
          />
          <LocaleFade
            text={copy.title}
            className="mb-1 text-xl font-black tracking-tight text-navy md:text-2xl"
          />
          <LocaleFade text={copy.subtitle} className="mb-4 text-sm text-navy/55" />

          <LocaleFade
            text={copy.ingredientsHeading}
            className="mb-2 text-xs font-bold uppercase tracking-widest text-navy/40"
          />
          <ul className="mb-4 space-y-1 text-sm text-navy/70">
            {copy.ingredients.map((ing, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-yellow">•</span>
                <LocaleFade text={ing} />
              </li>
            ))}
          </ul>

          <LocaleFade
            text={copy.methodHeading}
            className="mb-2 text-xs font-bold uppercase tracking-widest text-navy/40"
          />
          <LocaleFade text={copy.method} className="block text-sm leading-relaxed text-navy/70" />

          <div className="mt-5 inline-flex rounded-full bg-yellow px-5 py-2.5 text-sm font-semibold text-navy">
            <LocaleFade text={copy.cta} />
          </div>
        </div>
      </div>
    </StageLayer>
  );

  return { terminal, visual };
}

// ---------------------------------------------------------------------------
// Sequence 3 — The 3D CSS Tilt (0.50 – 0.75)
// ---------------------------------------------------------------------------

function useTiltStage({
  progress,
  opacity,
}: {
  progress: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  const local = useTransform(progress, [0.5, 0.75], [0, 1]);
  const lineOpacity = useTransform(local, [0, 0.12], [0, 1]);

  // Tied directly to overall scroll progress — no easing lag beyond
  // the top-level smoothing spring — so the mouse wheel is felt as
  // physically tilting the mockup.
  const rotateX = useTransform(progress, [0.5, 0.75], [8, -20]);
  const rotateY = useTransform(progress, [0.5, 0.75], [-22, 22]);
  const rotateXNum = useTransform(rotateX, (v): string => v.toFixed(1));
  const rotateYNum = useTransform(rotateY, (v): string => v.toFixed(1));

  const terminal = (
    <StageLayer opacity={opacity} className="flex flex-col justify-center gap-3">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/30">
        <Box size={12} /> direct DOM manipulation
      </p>
      <p className="text-xs text-white/50">
        <PromptPrefix /> code Mockup.tsx
      </p>
      <EditorPane filename="Mockup.tsx">
        <CodeLine n={1} dim>{`const mockupRef = useRef<HTMLDivElement>(null);`}</CodeLine>
        <CodeLine n={2} dim>{``}</CodeLine>
        <CodeLine n={3} dim>{`useEffect(() => {`}</CodeLine>
        <CodeLine n={4} dim>{`  const el = mockupRef.current;`}</CodeLine>
        <CodeLine n={5} dim>{`  if (!el) return;`}</CodeLine>
        <CodeLine n={6} dim>{``}</CodeLine>
        <motion.div style={{ opacity: lineOpacity }}>
          <CodeLine n={7} glow>
            {'  el.style.transform = `rotateX('}
            <motion.span className="text-yellow">{rotateXNum}</motion.span>
            {'deg) rotateY('}
            <motion.span className="text-yellow">{rotateYNum}</motion.span>
            {'deg)`;'}
          </CodeLine>
        </motion.div>
        <CodeLine n={8} dim>{``}</CodeLine>
        <CodeLine n={9} dim>{`  return () => { el.style.transform = ""; };`}</CodeLine>
        <CodeLine n={10} dim>{`}, [x, y]);`}</CodeLine>
      </EditorPane>
    </StageLayer>
  );

  const visual = (
    <StageLayer
      opacity={opacity}
      className="flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_20%,_#1a1fa8_0%,_#0a0b5e_60%,_#05062f_100%)]"
    >
      <div style={{ perspective: 1000 }}>
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="w-[280px] overflow-hidden rounded-xl border border-white/15 bg-navy-deep/80 shadow-[0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-sm md:w-[380px]"
        >
          <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
          </div>
          <div className="space-y-3 p-5">
            <div className="h-3 w-2/3 rounded-full bg-yellow/60" />
            <div className="h-2 w-full rounded-full bg-white/15" />
            <div className="h-2 w-5/6 rounded-full bg-white/15" />
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="h-14 rounded-lg bg-lilac/25" />
              <div className="h-14 rounded-lg bg-lilac/15" />
              <div className="h-14 rounded-lg bg-lilac/15" />
            </div>
            <div className="mt-3 h-8 w-24 rounded-full bg-yellow/80" />
          </div>
        </motion.div>
      </div>
    </StageLayer>
  );

  return { terminal, visual };
}

// ---------------------------------------------------------------------------
// Sequence 4 — Swapping Payment Gateways (0.75 – 1.0)
// ---------------------------------------------------------------------------

const STRIPE_DEP = '"@stripe/react-stripe-js": "^3.0.0",';
const WORLDPAY_DEP = '"worldpay-react-sdk": "^2.4.0",';

function depLineText(l: number): string {
  if (l <= 0.35) {
    const tp = clamp01(l / 0.35);
    return STRIPE_DEP.slice(0, Math.round(tp * STRIPE_DEP.length));
  }
  if (l <= 0.55) return STRIPE_DEP;
  if (l <= 0.62) {
    const tp = clamp01((l - 0.55) / 0.07);
    return STRIPE_DEP.slice(0, Math.round((1 - tp) * STRIPE_DEP.length));
  }
  const tp = clamp01((l - 0.62) / 0.33);
  return WORLDPAY_DEP.slice(0, Math.round(tp * WORLDPAY_DEP.length));
}

function StripeCheckout() {
  return (
    <div className="rounded-2xl border-2 border-navy/10 bg-white p-7 shadow-[0_20px_60px_rgba(16,21,133,0.12)] md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-navy/40">
          Checkout
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-navy/40">
          <Lock size={11} /> Powered by Stripe
        </span>
      </div>
      <p className="mb-1 text-2xl font-black text-navy">£48.00</p>
      <p className="mb-6 text-xs text-navy/45">Order #EU-2026-0417</p>
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-navy/15 px-4 py-3">
          <span className="font-mono text-sm tracking-widest text-navy/70">
            4242 4242 4242 4242
          </span>
          <CreditCard size={16} className="text-navy/30" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-navy/15 px-4 py-3 font-mono text-sm text-navy/70">
            12 / 29
          </div>
          <div className="rounded-lg border border-navy/15 px-4 py-3 font-mono text-sm text-navy/70">
            •••
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-full bg-yellow py-3 text-center text-sm font-semibold text-navy">
        Pay £48.00
      </div>
    </div>
  );
}

function WorldpayCheckout() {
  return (
    <div className="rounded-2xl border-2 border-navy/10 bg-white p-7 shadow-[0_20px_60px_rgba(16,21,133,0.12)] md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-navy/40">
          Checkout
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-navy/40">
          <Lock size={11} /> Powered by Worldpay
        </span>
      </div>
      <p className="mb-1 text-2xl font-black text-navy">£48.00</p>
      <p className="mb-5 text-xs text-navy/45">Order #EU-2026-0417</p>
      <div className="space-y-2.5">
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-navy/40">
            Card number
          </span>
          <div className="mt-1 rounded-lg border border-navy/15 px-4 py-2.5 font-mono text-sm text-navy/70">
            5454 5454 5454 5454
          </div>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-navy/40">
              Expiry
            </span>
            <div className="mt-1 rounded-lg border border-navy/15 px-4 py-2.5 font-mono text-sm text-navy/70">
              09 / 28
            </div>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-navy/40">
              CVC
            </span>
            <div className="mt-1 rounded-lg border border-navy/15 px-4 py-2.5 font-mono text-sm text-navy/70">
              •••
            </div>
          </label>
        </div>
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-navy/40">
            Billing address
          </span>
          <div className="mt-1 rounded-lg border border-navy/15 px-4 py-2.5 font-mono text-sm text-navy/70">
            Edinburgh, UK
          </div>
        </label>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-navy/40">
        <Lock size={10} /> 3D Secure · PCI-DSS compliant
      </div>
      <div className="mt-4 rounded-full bg-navy py-3 text-center text-sm font-semibold text-white">
        Confirm payment
      </div>
    </div>
  );
}

function usePaymentStage({
  progress,
  opacity,
}: {
  progress: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  const local = useTransform(progress, [0.75, 1], [0, 1]);
  const depText = useTransform(local, depLineText);
  const stripeNoteOpacity = useTransform(local, [0.36, 0.42, 0.5, 0.55], [0, 1, 1, 0]);
  const worldpayNoteOpacity = useTransform(local, [0.9, 0.97], [0, 1]);

  // Small hysteresis band around the swap point so a hovering scroll
  // position right at the threshold doesn't flap the mounted gateway.
  const [gateway, setGateway] = useState<"stripe" | "worldpay">("stripe");
  useMotionValueEvent(local, "change", (l) => {
    setGateway((prev) => {
      if (l >= 0.65) return "worldpay";
      if (l <= 0.55) return "stripe";
      return prev;
    });
  });

  const terminal = (
    <StageLayer opacity={opacity} className="flex flex-col justify-center gap-3">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/30">
        <Package size={12} /> swapping payment gateway
      </p>
      <p className="text-xs text-white/50">
        <PromptPrefix /> code package.json
      </p>
      <EditorPane filename="package.json">
        <CodeLine n={1} dim>{`{`}</CodeLine>
        <CodeLine n={2} dim>{`  "name": "euco-checkout",`}</CodeLine>
        <CodeLine n={3} dim>{`  "dependencies": {`}</CodeLine>
        <CodeLine n={4} dim>{`    "next": "16.1.6",`}</CodeLine>
        <CodeLine n={5} dim>{`    "react": "19.2.3",`}</CodeLine>
        <CodeLine n={6} glow>
          {"    "}
          <motion.span className="text-yellow">{depText}</motion.span>
          <BlinkingCursor />
        </CodeLine>
        <CodeLine n={7} dim>{`    "typescript": "^5"`}</CodeLine>
        <CodeLine n={8} dim>{`  }`}</CodeLine>
        <CodeLine n={9} dim>{`}`}</CodeLine>
      </EditorPane>
      <div className="relative h-4">
        <motion.p
          style={{ opacity: stripeNoteOpacity }}
          className="absolute inset-0 pl-1 text-xs text-yellow/70"
        >
          ✓ added 1 package · stripe-react-js@3.x
        </motion.p>
        <motion.p
          style={{ opacity: worldpayNoteOpacity }}
          className="absolute inset-0 pl-1 text-xs text-yellow/70"
        >
          ✓ added 1 package · worldpay-react-sdk@2.x
        </motion.p>
      </div>
    </StageLayer>
  );

  const visual = (
    <StageLayer
      opacity={opacity}
      className="flex items-center justify-center bg-paper p-8 md:p-12"
    >
      <div className="relative w-full max-w-sm">
        <AnimatePresence mode="wait">
          {gateway === "stripe" ? (
            <motion.div
              key="stripe"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              <StripeCheckout />
            </motion.div>
          ) : (
            <motion.div
              key="worldpay"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              <WorldpayCheckout />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StageLayer>
  );

  return { terminal, visual };
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function TerminalScrollShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const trackInView = useInView(trackRef, { amount: 0.05 });
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
  });

  const progress = reduceMotion ? scrollYProgress : smoothProgress;

  // Crossfade windows, each 0.25 wide with a ~0.03 overlap at the
  // boundary so consecutive sequences dissolve into one another
  // instead of cutting.
  const colorOpacity = useTransform(progress, [0, 0.22, 0.25], [1, 1, 0]);
  const translateOpacity = useTransform(
    progress,
    [0.22, 0.25, 0.47, 0.5],
    [0, 1, 1, 0],
  );
  const tiltOpacity = useTransform(
    progress,
    [0.47, 0.5, 0.72, 0.75],
    [0, 1, 1, 0],
  );
  const paymentsOpacity = useTransform(progress, [0.72, 0.75, 1], [0, 1, 1]);

  const stageLabel = useTransform(progress, (p): string => {
    if (p < 0.25) return "01 · theme";
    if (p < 0.5) return "02 · translate";
    if (p < 0.75) return "03 · tilt";
    return "04 · payments";
  });

  const colorStage = useColorLoopStage({
    opacity: colorOpacity,
    isPlaying: trackInView,
    reduceMotion: !!reduceMotion,
  });
  const translateStage = useTranslationStage({ progress, opacity: translateOpacity });
  const tiltStage = useTiltStage({ progress, opacity: tiltOpacity });
  const paymentStage = usePaymentStage({ progress, opacity: paymentsOpacity });

  return (
    <div ref={trackRef} className="relative h-[400vh]">
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-navy-deep md:flex-row">
        {/* Scroll progress rail */}
        <div className="absolute left-0 top-0 z-50 hidden h-full w-1 bg-white/10 md:block">
          <motion.div
            className="w-full origin-top bg-yellow"
            style={{ scaleY: progress, height: "100%" }}
          />
        </div>

        {/* LEFT — editor */}
        <div className="relative h-1/2 w-full border-b-2 border-yellow/30 bg-navy-deep md:h-full md:w-1/2 md:border-b-0 md:border-r-2">
          <div className="flex h-full flex-col font-mono text-[13px] md:text-sm">
            <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-5 py-4">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-lilac/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
              <span className="ml-3 flex items-center gap-1.5 text-xs text-white/40">
                <TerminalIcon size={12} /> live edits — web/showcase
              </span>
              <motion.span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-yellow/60">
                {stageLabel}
              </motion.span>
            </div>
            <div className="relative flex-1 overflow-hidden px-5 py-6 md:py-8">
              {colorStage.terminal}
              {translateStage.terminal}
              {tiltStage.terminal}
              {paymentStage.terminal}
            </div>
          </div>
        </div>

        {/* RIGHT — full-face visual output */}
        <div className="relative h-1/2 w-full overflow-hidden md:h-full md:w-1/2">
          {colorStage.visual}
          {translateStage.visual}
          {tiltStage.visual}
          {paymentStage.visual}
        </div>
      </div>
    </div>
  );
}

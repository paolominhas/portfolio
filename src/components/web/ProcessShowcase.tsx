"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { Guitar, Mic2, Terminal, Zap, ChevronRight } from "lucide-react";
import HeroText from "./HeroText";
import ScrollReveal from "./ScrollReveal";
import MagneticButton from "./MagneticButton";

/**
 * PROCESS SHOWCASE
 * ─────────────────────────────────────────────────────────────────
 * A hero, followed by a pinned split-screen section that runs two
 * independent animation systems at once:
 *
 *   1. An auto-playing terminal (left) that types out a fixed command
 *      sequence once, triggered the instant the pinned section reaches
 *      the top of the viewport (useInView).
 *   2. A scroll-tracked process list (right, foreground) whose opacity
 *      and position are driven directly by the user's scroll position
 *      through the pinned section (useScroll + useTransform) — this
 *      keeps advancing/reversing with the scrollbar regardless of
 *      what the terminal is doing.
 *
 * The two systems share only one thing: the terminal's completed
 * commands update a `visual` state object that the background (right,
 * behind the bullets) reads to crossfade imagery, swap locale text,
 * and layer in a grunge filter + stadium-light glow.
 *
 * ── The pin mechanic ─────────────────────────────────────────────
 * `wrapperRef` is a tall (350vh) block. Its only child, `pinnedRef`,
 * is `h-screen sticky top-0`. Because the sticky child sits at the
 * very top of the wrapper's flow, the moment the wrapper's top edge
 * reaches the viewport's top edge, the sticky child is *already*
 * exactly viewport-sized and stuck — so:
 *   - `useInView(pinnedRef, { amount: 0.98 })` fires right as pinning
 *     begins (this is what triggers the terminal).
 *   - `useScroll({ target: wrapperRef, offset: ["start start", "end end"] })`
 *     produces a clean 0→1 progress value that spans *exactly* the
 *     pinned duration (the remaining 250vh of scroll) — this is what
 *     drives the bullets.
 *
 * ── Swapping in real photography ─────────────────────────────────
 * The "musician imagery" here is deliberately built from gradients +
 * a lucide icon (no stock photo licensing, no placeholder asset
 * dependency). To swap in real images, replace the two `<div>` layers
 * inside `VisualStage` with `next/image` and keep the same
 * AnimatePresence crossfade wrapper — the timing logic doesn't change.
 *
 * ── Color system ─────────────────────────────────────────────────
 * Uses the navy / yellow / lilac / paper tokens already wired into
 * this repo's tailwind.config.ts. If dropping this into a different
 * app, swap those class names for your own palette — nothing else
 * here is repo-specific.
 */

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface TerminalCommand {
  id: "instrument" | "locale" | "filter" | "mode";
  command: string;
  output: string;
}

const COMMANDS: TerminalCommand[] = [
  {
    id: "instrument",
    command: 'equip --instrument "electric-guitar"',
    output: "instrument equipped → electric-guitar",
  },
  {
    id: "locale",
    command: 'set-locale --lang "it-IT"',
    output: "locale set → it-IT",
  },
  {
    id: "filter",
    command: 'apply-filter --style "vintage-grunge"',
    output: "filter applied → vintage-grunge",
  },
  {
    id: "mode",
    command: 'toggle-mode --concert "stadium-lights"',
    output: "mode engaged → stadium-lights",
  },
];

interface VisualState {
  instrument: "default" | "electric-guitar";
  locale: "en" | "it";
  grunge: boolean;
  stadiumLights: boolean;
}

const INITIAL_VISUAL_STATE: VisualState = {
  instrument: "default",
  locale: "en",
  grunge: false,
  stadiumLights: false,
};

const FINAL_VISUAL_STATE: VisualState = {
  instrument: "electric-guitar",
  locale: "it",
  grunge: true,
  stadiumLights: true,
};

const PROCESS_STEPS = [
  {
    title: "Discover",
    description:
      "A short call to understand what the project actually needs to do, and what it doesn't.",
  },
  {
    title: "Design",
    description:
      "A visual direction grounded in the subject — not a generic template with a new logo dropped in.",
  },
  {
    title: "Build",
    description:
      "Typed, componentised, and version-controlled from the first commit — built to be handed off later.",
  },
  {
    title: "Launch",
    description:
      "Deployed with CI/CD behind it, and available afterwards for the inevitable follow-up request.",
  },
] as const;

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

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

/**
 * One scroll-tracked bullet. Pulled out into its own component (rather
 * than calling useTransform inside a .map()) so each instance gets a
 * clean, rules-of-hooks-safe call to useTransform.
 */
function BulletItem({
  index,
  total,
  progress,
  title,
  description,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  title: string;
  description: string;
}) {
  const segment = 1 / total;
  const segStart = index * segment;
  const segEnd = segStart + segment;

  const isLast = index === total - 1;

  // Fade/slide in a touch before this bullet's segment starts, hold
  // through the segment, then fade/slide out a touch before the next
  // one takes over. The last bullet never fades out — it stays put
  // until the section unpins.
  const inputRange = isLast
    ? [Math.max(segStart - 0.05, 0), segStart + 0.03, 1]
    : [
        Math.max(segStart - 0.05, 0),
        segStart + 0.03,
        segEnd - 0.05,
        Math.min(segEnd + 0.02, 1),
      ];

  const opacityRange = isLast ? [0, 1, 1] : [0, 1, 1, 0];
  const yRange = isLast ? [18, 0, 0] : [18, 0, 0, -18];

  const opacity = useTransform(progress, inputRange, opacityRange);
  const y = useTransform(progress, inputRange, yRange);

  return (
    <motion.li style={{ opacity, y }} className="flex gap-4 items-start">
      <span className="mt-1 font-mono text-xs text-yellow shrink-0">
        0{index + 1}
      </span>
      <div>
        <h3 className="text-lg md:text-xl font-bold text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-white/55 leading-relaxed max-w-xs">
          {description}
        </p>
      </div>
    </motion.li>
  );
}

/**
 * Layered background: crossfading "portrait" gradients + centered
 * icon, a locale-swapped caption, a backdrop-filter grunge layer, and
 * a stadium-lights glow — each toggled independently by `visual`.
 */
function VisualStage({ visual }: { visual: VisualState }) {
  const isGuitar = visual.instrument === "electric-guitar";

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Layer 1: crossfading portrait gradients */}
      <AnimatePresence initial={false}>
        <motion.div
          key={visual.instrument}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className={`absolute inset-0 flex items-center justify-center ${
            isGuitar
              ? "bg-[radial-gradient(circle_at_50%_35%,_#1a1fa8_0%,_#101585_45%,_#0a0b5e_100%)]"
              : "bg-[radial-gradient(circle_at_50%_35%,_#26208f_0%,_#101585_50%,_#0a0b5e_100%)]"
          }`}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`rounded-full p-10 md:p-14 border ${
              isGuitar
                ? "border-yellow/30 bg-yellow/5"
                : "border-lilac/30 bg-lilac/5"
            }`}
          >
            {isGuitar ? (
              <Guitar size={96} className="text-yellow/80" strokeWidth={1.25} />
            ) : (
              <Mic2 size={96} className="text-lilac/80" strokeWidth={1.25} />
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Layer 2: vintage-grunge backdrop filter (affects layer 1 only) */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 transition-opacity duration-700 bg-navy-deep/10"
        style={{
          opacity: visual.grunge ? 1 : 0,
          backdropFilter: "contrast(1.3) saturate(0.55) sepia(0.2) brightness(0.85)",
          WebkitBackdropFilter:
            "contrast(1.3) saturate(0.55) sepia(0.2) brightness(0.85)",
        }}
      />

      {/* Layer 3: stadium lights — pulsing radial spotlights, screen-blended */}
      <div
        aria-hidden
        className="absolute inset-0 z-20 transition-opacity duration-700"
        style={{ opacity: visual.stadiumLights ? 1 : 0, mixBlendMode: "screen" }}
      >
        {[
          { top: "10%", left: "15%", size: 220, delay: 0 },
          { top: "60%", left: "70%", size: 260, delay: 0.6 },
          { top: "25%", left: "80%", size: 180, delay: 1.1 },
        ].map((light, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-yellow/40 blur-[60px]"
            style={{
              top: light.top,
              left: light.left,
              width: light.size,
              height: light.size,
            }}
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.15, 0.9] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: light.delay,
            }}
          />
        ))}
      </div>

      {/* Layer 4: locale-swapped caption */}
      <div className="absolute bottom-8 left-8 z-30">
        <AnimatePresence mode="wait">
          <motion.p
            key={visual.locale}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="font-mono text-xs uppercase tracking-widest text-white/50"
          >
            {visual.locale === "it" ? "Ora in scena" : "Now performing"}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Terminal (left panel)
// ---------------------------------------------------------------------------

interface TerminalPanelProps {
  triggerRef: RefObject<HTMLDivElement | null>;
  reduceMotion: boolean;
  onCommandComplete: (id: TerminalCommand["id"]) => void;
}

function TerminalPanel({
  triggerRef,
  reduceMotion,
  onCommandComplete,
}: TerminalPanelProps) {
  // Trigger fires once, exactly as the pinned section reaches the top
  // of the viewport (see the geometry note in the file header).
  const hasEnteredPin = useInView(triggerRef, { amount: 0.98, once: true });

  const [history, setHistory] = useState<TerminalCommand[]>([]);
  const [typedChars, setTypedChars] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Reduced-motion users get the finished state immediately, no
    // autoplaying typing loop.
    if (reduceMotion) {
      setHistory(COMMANDS);
      COMMANDS.forEach((c) => onCommandComplete(c.id));
      setDone(true);
      return;
    }

    if (!hasEnteredPin) return;

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timeouts.push(setTimeout(resolve, ms));
      });

    async function typeText(text: string) {
      for (let i = 1; i <= text.length; i++) {
        if (cancelled) return;
        setTypedChars(text.slice(0, i));
        await wait(16 + Math.random() * 28);
      }
    }

    async function runSequence() {
      for (let idx = 0; idx < COMMANDS.length; idx++) {
        if (cancelled) return;
        const cmd = COMMANDS[idx];

        setActiveIndex(idx);
        setTypedChars("");
        setIsRunning(false);

        await wait(350); // prompt beat before typing starts
        await typeText(cmd.command);
        if (cancelled) return;

        await wait(200); // beat before "executing"
        setIsRunning(true);
        await wait(450); // simulated processing time
        if (cancelled) return;

        onCommandComplete(cmd.id);
        setHistory((prev) => [...prev, cmd]);
        setIsRunning(false);
        setTypedChars("");

        await wait(600); // let the visual change land before the next command
      }
      if (!cancelled) setDone(true);
    }

    runSequence();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per trigger
  }, [hasEnteredPin, reduceMotion]);

  const activeCommand = COMMANDS[activeIndex];
  const showActiveLine = !reduceMotion && hasEnteredPin && !done;

  return (
    <div className="relative flex h-full w-full flex-col bg-navy-deep font-mono text-sm">
      {/* Chrome */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10 shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-yellow/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-lilac/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
        <span className="ml-3 flex items-center gap-1.5 text-xs text-white/40">
          <Terminal size={12} /> session — web.paolo.org.uk
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden px-5 py-5 md:py-6 flex flex-col justify-end gap-3">
        {history.map((cmd) => (
          <div key={cmd.id}>
            <p className="text-white/80">
              <span className="text-lilac">$</span> {cmd.command}
            </p>
            <p className="text-yellow/80 pl-4 text-xs mt-0.5">✓ {cmd.output}</p>
          </div>
        ))}

        {showActiveLine && (
          <div>
            <p className="text-white/80">
              <span className="text-lilac">$</span> {typedChars}
              {!isRunning && <BlinkingCursor />}
            </p>
            {isRunning && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/40 pl-4 text-xs mt-0.5"
              >
                running{" "}
                <span className="inline-flex gap-0.5 ml-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    >
                      .
                    </motion.span>
                  ))}
                </span>
              </motion.p>
            )}
          </div>
        )}

        {(done || reduceMotion) && (
          <p className="text-white/80">
            <span className="text-lilac">$</span> <BlinkingCursor />
          </p>
        )}

        {!hasEnteredPin && !reduceMotion && (
          <p className="text-white/30 text-xs">
            waiting for section to lock into view…
          </p>
        )}
      </div>

      {/* Screen-reader announcement, kept in sync with the last completed command */}
      <p aria-live="polite" className="sr-only">
        {history.length > 0
          ? `${activeCommand ? "" : ""}${history[history.length - 1].output}`
          : ""}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function ProcessShowcase() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const [visual, setVisual] = useState<VisualState>(INITIAL_VISUAL_STATE);

  const handleCommandComplete = useCallback((id: TerminalCommand["id"]) => {
    setVisual((prev) => {
      switch (id) {
        case "instrument":
          return { ...prev, instrument: "electric-guitar" };
        case "locale":
          return { ...prev, locale: "it" };
        case "filter":
          return { ...prev, grunge: true };
        case "mode":
          return { ...prev, stadiumLights: true };
        default:
          return prev;
      }
    });
  }, []);

  // Progress spans exactly the pinned duration — 0 the instant pinning
  // starts, 1 the instant it releases. See the geometry note above.
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const effectiveVisual = reduceMotion ? FINAL_VISUAL_STATE : visual;

  return (
    <div>
      {/* ================= HERO — standard, unpinned ================= */}
      <section className="relative bg-paper px-6 md:px-10 pt-40 pb-28 md:pt-48 md:pb-36 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 w-[28rem] h-[28rem] rounded-full bg-lilac/15 blur-[110px]"
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <ScrollReveal on="load" y={12}>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-navy bg-yellow px-3 py-1.5 rounded-full mb-8">
              <Zap size={12} /> How a build comes together
            </span>
          </ScrollReveal>
          <HeroText
            as="h1"
            text="Scroll down. Watch it build itself."
            highlightWords={["itself."]}
            className="text-4xl md:text-6xl font-black tracking-tight text-navy leading-[1.02] mb-6"
          />
          <ScrollReveal on="load" delay={0.5} y={14}>
            <p className="text-lg text-navy/60 max-w-xl mx-auto">
              The next section locks in place for a moment — a terminal runs
              a short setup sequence on its own, while your scroll drives the
              process notes on the right.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= PINNED WRAPPER ================= */}
      {/* Tall driver: 350vh gives 250vh of scroll distance *while pinned*
          (350vh total − 100vh sticky child height) for the bullets to
          animate across. Tune this to add/remove breathing room. */}
      <div ref={wrapperRef} className="relative h-[350vh]">
        <div
          ref={pinnedRef}
          className="sticky top-0 h-screen w-full overflow-hidden bg-navy flex flex-col md:flex-row"
        >
          {/* LEFT — terminal */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full border-b-2 md:border-b-0 md:border-r-2 border-yellow/40">
            <TerminalPanel
              triggerRef={pinnedRef}
              reduceMotion={!!reduceMotion}
              onCommandComplete={handleCommandComplete}
            />
          </div>

          {/* RIGHT — layered visuals (background) + scroll-tracked bullets (foreground) */}
          <div className="relative w-full md:w-1/2 h-1/2 md:h-full">
            <VisualStage visual={effectiveVisual} />

            {/* Scroll progress rail — small polish, makes the scroll-drive visible */}
            <div className="absolute top-0 left-0 z-30 h-full w-1 bg-white/10 hidden md:block">
              <motion.div
                className="w-full bg-yellow origin-top"
                style={{
                  scaleY: reduceMotion ? 1 : scrollYProgress,
                  height: "100%",
                }}
              />
            </div>

            <div className="relative z-40 h-full flex flex-col justify-center px-8 md:px-12 py-10">
              <p className="font-mono text-xs uppercase tracking-widest text-yellow/80 mb-6 flex items-center gap-2">
                <ChevronRight size={14} /> The process
              </p>
              <ul className="flex flex-col gap-8 md:gap-10">
                {PROCESS_STEPS.map((step, i) =>
                  reduceMotion ? (
                    <li key={step.title} className="flex gap-4 items-start">
                      <span className="mt-1 font-mono text-xs text-yellow shrink-0">
                        0{i + 1}
                      </span>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                          {step.title}
                        </h3>
                        <p className="text-sm text-white/55 leading-relaxed max-w-xs">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ) : (
                    <BulletItem
                      key={step.title}
                      index={i}
                      total={PROCESS_STEPS.length}
                      progress={scrollYProgress}
                      title={step.title}
                      description={step.description}
                    />
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ================= WHAT COMES NEXT, for context ================= */}
      <section className="bg-paper px-6 md:px-10 py-24 md:py-32 text-center">
        <ScrollReveal>
          <p className="text-navy/50 mb-8 max-w-md mx-auto">
            That&apos;s the whole sequence — the terminal only plays once per
            visit, but the process list keeps following your scroll for as
            long as you're in that section.
          </p>
          <div className="flex justify-center">
            <MagneticButton href="https://paolo.org.uk/contact" variant="secondary-dark">
              Start a project
            </MagneticButton>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

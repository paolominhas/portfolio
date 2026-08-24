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
 * "the terminal drives the visual" sequences: an autonomous theme
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
 * ── Per-sequence pattern ─────────────────────────────────────────
 * Each sequence is a custom hook (`useColorLoopStage`,
 * `useTranslationStage`, `useTiltStage`, `usePaymentStage`) that
 * takes the shared `progress` value plus a pre-computed crossfade
 * `opacity` for its 0.25-wide window, and returns `{ terminal, visual }`
 * — two JSX fragments rendered into the left and right panels
 * respectively. Keeping the state for a sequence colocated in one
 * hook (even though its output is split across two panels) is what
 * lets the terminal "drive" the visual without prop-drilling a big
 * shared state object through the tree.
 *
 * Wherever possible, dynamic text/values are plain `MotionValue`s
 * rendered as children of a `motion.*` element (`<motion.span>{mv}</motion.span>`),
 * which Framer Motion updates directly in the DOM without a React
 * re-render — this is what keeps typing/tilt/crossfade silky even
 * while the user is scrolling fast. React state is used only where
 * the DOM structure itself must change (the autonomous loop's typed
 * characters in sequence 1, and the mounted gateway component in
 * sequence 4, which is explicitly an AnimatePresence swap).
 */

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** The literal prompt string, reused on every terminal line. */
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

const THEME_COMMANDS = THEMES.map(
  (t) => `set-theme --bg "${t.bg}" --accent "${t.accent}"`,
);

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
  const [typedChars, setTypedChars] = useState(
    reduceMotion ? THEME_COMMANDS[0].length : 0,
  );
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">(
    reduceMotion ? "holding" : "typing",
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
        const cmd = THEME_COMMANDS[idx];

        setPhase("typing");
        for (let i = 1; i <= cmd.length; i++) {
          if (cancelled) return;
          setTypedChars(i);
          await wait(14 + Math.random() * 22);
        }
        if (cancelled) return;

        // Command "executes" — theme crossfades in on the right.
        setThemeIndex(idx);
        setPhase("holding");
        await wait(1500);
        if (cancelled) return;

        setPhase("deleting");
        for (let i = cmd.length; i >= 0; i--) {
          if (cancelled) return;
          setTypedChars(i);
          await wait(8 + Math.random() * 12);
        }
        if (cancelled) return;

        await wait(300);
        idx = (idx + 1) % THEME_COMMANDS.length;
      }
    }

    loop(0);
    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [isPlaying, reduceMotion]);

  const theme = THEMES[themeIndex];
  const commandText = reduceMotion
    ? THEME_COMMANDS[0]
    : THEME_COMMANDS[themeIndex].slice(0, typedChars);

  const terminal = (
    <StageLayer opacity={opacity} className="flex flex-col justify-end gap-2">
      <p className="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/30">
        <Palette size={12} /> autonomous theme loop
      </p>
      <p className="text-white/85 break-all">
        <PromptPrefix />
        {commandText}
        {!reduceMotion && phase !== "deleting" && <BlinkingCursor />}
      </p>
      <AnimatePresence>
        {phase === "holding" && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pl-4 text-xs text-yellow/70"
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

const TRANSLATE_CMD = 'translate-node --target "it-IT"';

const RECIPE_EN = {
  badge: "EN",
  title: "Classic Buttery Shortbread",
  ingredients: [
    "250g unsalted butter, softened",
    "125g caster sugar",
    "375g plain flour",
    "A pinch of salt",
  ],
  method:
    "Cream the butter and sugar until pale, work in the flour and salt, press into a tin, prick all over, and bake low and slow until barely golden.",
};

const RECIPE_IT = {
  badge: "IT",
  title: "Frollini Classici al Burro",
  ingredients: [
    "250g di burro non salato, ammorbidito",
    "125g di zucchero semolato",
    "375g di farina 00",
    "Un pizzico di sale",
  ],
  method:
    "Amalgama burro e zucchero fino a renderli chiari, incorpora farina e sale, stendi in una teglia, punzecchia la superficie e cuoci a bassa temperatura finché dorato.",
};

function RecipeCard({ recipe }: { recipe: typeof RECIPE_EN }) {
  return (
    <div className="rounded-2xl border-2 border-navy/10 bg-white p-7 shadow-[0_20px_60px_rgba(16,21,133,0.12)] md:p-8">
      <div className="mb-5 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-navy/40">
          Recipe card
        </span>
        <span className="rounded-full border border-navy/10 bg-lilac-light px-2 py-1 font-mono text-[11px] text-navy/70">
          {recipe.badge}
        </span>
      </div>
      <h3 className="mb-4 text-2xl font-black tracking-tight text-navy">
        {recipe.title}
      </h3>
      <p className="mb-2 text-xs uppercase tracking-widest text-navy/40">
        Ingredients
      </p>
      <ul className="mb-5 space-y-1 text-sm text-navy/70">
        {recipe.ingredients.map((ing) => (
          <li key={ing} className="flex gap-2">
            <span className="text-yellow">•</span>
            {ing}
          </li>
        ))}
      </ul>
      <p className="mb-2 text-xs uppercase tracking-widest text-navy/40">
        Method
      </p>
      <p className="text-sm leading-relaxed text-navy/70">{recipe.method}</p>
    </div>
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

  const typedText = useTransform(local, (l) => {
    const typeProgress = clamp01(l / 0.55);
    return TRANSLATE_CMD.slice(0, Math.round(typeProgress * TRANSLATE_CMD.length));
  });
  const outputOpacity = useTransform(local, [0.5, 0.6], [0, 1]);

  const englishOpacity = useTransform(local, [0.55, 0.85], [1, 0]);
  const italianOpacity = useTransform(local, [0.55, 0.85], [0, 1]);

  const terminal = (
    <StageLayer opacity={opacity} className="flex flex-col justify-end gap-2">
      <p className="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/30">
        <Languages size={12} /> scroll-linked translation
      </p>
      <p
        className="text-lilac/90"
        style={{
          textShadow:
            "0 0 8px rgba(167,139,250,0.85), 0 0 20px rgba(167,139,250,0.45)",
        }}
      >
        <PromptPrefix />
        <motion.span className="text-white">{typedText}</motion.span>
        <BlinkingCursor />
      </p>
      <motion.p
        style={{ opacity: outputOpacity }}
        className="pl-4 text-xs text-yellow/70"
      >
        ✓ locale set → it-IT
      </motion.p>
    </StageLayer>
  );

  const visual = (
    <StageLayer
      opacity={opacity}
      className="flex items-center justify-center bg-paper p-8 md:p-12"
    >
      <div className="relative w-full max-w-md">
        <motion.div style={{ opacity: englishOpacity }} className="absolute inset-0">
          <RecipeCard recipe={RECIPE_EN} />
        </motion.div>
        <motion.div style={{ opacity: italianOpacity }} className="relative">
          <RecipeCard recipe={RECIPE_IT} />
        </motion.div>
      </div>
    </StageLayer>
  );

  return { terminal, visual };
}

// ---------------------------------------------------------------------------
// Sequence 3 — The 3D CSS Tilt (0.50 – 0.75)
// ---------------------------------------------------------------------------

const TILT_CMD_1 = "document.getElementById('mockup')";
const TILT_CMD_2 = '.style.transform = "rotateX(…) rotateY(…)"';

function useTiltStage({
  progress,
  opacity,
}: {
  progress: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  const local = useTransform(progress, [0.5, 0.75], [0, 1]);

  const line1Text = useTransform(local, (l) => {
    const tp = clamp01(l / 0.35);
    return TILT_CMD_1.slice(0, Math.round(tp * TILT_CMD_1.length));
  });
  const line1Opacity = useTransform(local, (l) => (l > 0 ? 1 : 0));

  const line2Text = useTransform(local, (l) => {
    const tp = clamp01((l - 0.35) / 0.35);
    return TILT_CMD_2.slice(0, Math.round(tp * TILT_CMD_2.length));
  });
  const line2Opacity = useTransform(local, (l) => (l > 0.35 ? 1 : 0));

  // The rotation itself is tied directly to overall scroll progress —
  // no easing lag beyond the top-level smoothing spring — so the
  // mouse wheel is felt as physically tilting the mockup.
  const rotateX = useTransform(progress, [0.5, 0.75], [8, -20]);
  const rotateY = useTransform(progress, [0.5, 0.75], [-22, 22]);
  const rotateXLabel = useTransform(rotateX, (v) => `rotateX(${v.toFixed(1)}deg)`);
  const rotateYLabel = useTransform(rotateY, (v) => `rotateY(${v.toFixed(1)}deg)`);
  const readoutOpacity = useTransform(local, [0.66, 0.74], [0, 1]);

  const terminal = (
    <StageLayer opacity={opacity} className="flex flex-col justify-end gap-1.5">
      <p className="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/30">
        <Box size={12} /> direct DOM manipulation
      </p>
      <motion.p style={{ opacity: line1Opacity }} className="text-white/85">
        <PromptPrefix />
        <motion.span>{line1Text}</motion.span>
      </motion.p>
      <motion.p style={{ opacity: line2Opacity }} className="text-white/85">
        <PromptPrefix />
        <motion.span className="text-yellow/90">{line2Text}</motion.span>
        <BlinkingCursor />
      </motion.p>
      <motion.p
        style={{ opacity: readoutOpacity }}
        className="mt-1 flex gap-4 pl-4 text-xs text-lilac/80"
      >
        <span>
          → <motion.span>{rotateXLabel}</motion.span>
        </span>
        <motion.span>{rotateYLabel}</motion.span>
      </motion.p>
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
          {/* fake browser chrome */}
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

const STRIPE_CMD = "npm install @stripe/react-stripe-js";
const WORLDPAY_CMD =
  "npm uninstall @stripe/react-stripe-js && npm install worldpay-react-sdk";

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

  const line1Text = useTransform(local, (l) => {
    const tp = clamp01(l / 0.35);
    return STRIPE_CMD.slice(0, Math.round(tp * STRIPE_CMD.length));
  });
  const line1InstalledOpacity = useTransform(local, [0.35, 0.42], [0, 1]);
  const line1CursorOpacity = useTransform(local, (l) => (l < 0.35 ? 1 : 0));

  const line2Text = useTransform(local, (l) => {
    const tp = clamp01((l - 0.55) / 0.35);
    return WORLDPAY_CMD.slice(0, Math.round(tp * WORLDPAY_CMD.length));
  });
  const line2Opacity = useTransform(local, (l) => (l > 0.55 ? 1 : 0));

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
    <StageLayer opacity={opacity} className="flex flex-col justify-end gap-1.5">
      <p className="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/30">
        <Package size={12} /> swapping payment gateway
      </p>
      <p className="text-white/85">
        <PromptPrefix />
        <motion.span>{line1Text}</motion.span>
        <motion.span style={{ opacity: line1CursorOpacity }}>
          <BlinkingCursor />
        </motion.span>
      </p>
      <motion.p
        style={{ opacity: line1InstalledOpacity }}
        className="pl-4 text-xs text-yellow/70"
      >
        ✓ added 1 package · @stripe/react-stripe-js@3.x
      </motion.p>
      <motion.p style={{ opacity: line2Opacity }} className="text-white/85">
        <PromptPrefix />
        <motion.span className="text-yellow/90">{line2Text}</motion.span>
        <BlinkingCursor />
      </motion.p>
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

        {/* LEFT — terminal */}
        <div className="relative h-1/2 w-full border-b-2 border-yellow/30 bg-navy-deep md:h-full md:w-1/2 md:border-b-0 md:border-r-2">
          <div className="flex h-full flex-col font-mono text-[13px] md:text-sm">
            <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-5 py-4">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-lilac/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
              <span className="ml-3 flex items-center gap-1.5 text-xs text-white/40">
                <TerminalIcon size={12} /> zsh — web/showcase
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
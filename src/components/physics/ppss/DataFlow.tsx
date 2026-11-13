"use client";

import { useState } from "react";
import { Widget } from "./ui";
import { NUMBERS as N } from "@/data/ppss";

const n = (x: number) => x.toLocaleString("en-GB");

const STEPS = [
  {
    title: "Two samples",
    big: [`${n(N.signalMC)} simulated signal`, `${n(N.backgroundRaw)} real-data candidates`],
    text: "The signal is Monte Carlo: a computer simulation of the decay passing through the detector. The background is real LHCb data, which is almost all unrelated tracks that happen to look a bit like a Λc decay. Each candidate comes with 675 variables.",
  },
  {
    title: "Keep the high-mass sideband",
    big: [`${n(N.signalMC)} signal`, `${n(N.backgroundAfterSideband)} background`],
    text: "For training, the real-data background is restricted to candidates whose reconstructed Λc mass is above 2310 MeV/c², away from the mass peak where a real signal would sit, so the classifier cannot learn from true signal hiding in the data. Candidates with infinite or missing values are dropped (none were, in the final run).",
  },
  {
    title: "One labelled sample",
    big: [`${n(N.totalTrain)} events`, "signal = 1, background = 0"],
    text: "The two samples are stacked into one table with a target column: 1 for simulated signal, 0 for data. The sample is lopsided: only about 2% is signal.",
  },
  {
    title: "Train and test split",
    big: [`${n(N.trainSize)} to train`, `${n(N.testSize)} to test`],
    text: "A 70/30 split, stratified so both halves keep the same signal fraction. The model never sees the test half while it learns, which is what makes the test numbers honest.",
  },
  {
    title: "What the test half contains",
    big: [`${n(N.testSignal)} signal`, `${n(N.testBackground)} background`],
    text: "Everything later (ROC curves, the Punzi cut) is computed on these 24,257 events.",
  },
];

export default function DataFlow() {
  const [i, setI] = useState(0);
  const s = STEPS[i];
  const sigFrac = N.signalMC / N.totalTrain;
  return (
    <Widget title="From two files to a trained model">
      <div className="flex flex-wrap gap-2 mb-5">
        {STEPS.map((st, k) => (
          <button
            key={st.title}
            onClick={() => setI(k)}
            aria-pressed={k === i}
            className={`px-3 py-2 rounded-lg text-sm border ${
              k === i ? "bg-ember text-abyss border-ember font-bold" : "border-white/20 text-white/70 hover:bg-white/10"
            }`}
          >
            {k + 1}. {st.title}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 mb-4" aria-live="polite">
        {s.big.map((b) => (
          <div key={b} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 font-bodoni text-xl sm:text-2xl text-white">
            {b}
          </div>
        ))}
      </div>
      <p className="text-white/70">{s.text}</p>
      <div className="mt-6">
        <div className="flex justify-between text-xs text-white/45 mb-1">
          <span>Signal share of the training table</span>
          <span className="font-mono">{(sigFrac * 100).toFixed(1)}%</span>
        </div>
        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
          <div className="h-3 bg-ember" style={{ width: `${Math.max(sigFrac * 100, 0.8)}%` }} />
        </div>
      </div>
      <p className="mt-4 text-xs text-white/40">
        Numbers: the 1,727 / 214,977 / 675 come from the final slides; the 79,128, 80,855, 56,598 and 24,257 come from the final training log in the repo README. The notes do not say how many of the 214,977 the mass cut removes, so I have not drawn that step as a measured drop. The code comment says the cut is at 2300 but the code uses 2310.
      </p>
    </Widget>
  );
}

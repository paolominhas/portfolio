"use client";

import { useCallback, useState } from "react";
import { Play, Pause, Shuffle } from "lucide-react";
import IsingCanvas from "./IsingCanvas";
import SimulationSandbox, {
  SandboxSlider,
  SandboxToggle,
  SandboxStat,
  SandboxButton,
} from "./SimulationSandbox";
import CodePanel from "@/components/simulations/CodePanel";
import type { Dynamics } from "@/lib/physics/ising";

/**
 * ISING SANDBOX PAGE
 * ─────────────────────────────────────────────────────────────────
 * The state-orchestration layer: owns every slider/toggle value, the
 * play/pause/reset controls, and the live stats readout, and wires
 * them into IsingCanvas (physics + rendering) and SimulationSandbox
 * (layout chrome). Lives here rather than directly in
 * app/physics/simulations/ising/page.tsx because that file needs to
 * stay a Server Component to export `metadata` — see that file for
 * the split.
 */

// Verbatim from your 2016/2016.py — reproduced as-is since it's your
// own source, not third-party content. total_energy is trimmed to the
// lines this demo actually uses (the full function also threads
// through a couple of unused kwargs from that file's specific exam
// question).
const PYTHON_SOURCE = `@jit(nopython=True)
def glauber_sweep(grid, beta, J=-1.0, h=0):
    """One Glauber sweep (N² single-spin flip attempts).  β = 1/kT."""
    N, M = grid.shape
    for _ in range(N * M):
        i, j = np.random.randint(0, N), np.random.randint(0, M)
        nn = (grid[(i+1)%N, j] + grid[(i-1)%N, j] +
              grid[i, (j+1)%M] + grid[i, (j-1)%M])
        dE = 2.0 * ( (J * grid[i, j] * nn) + (h * grid[i, j]) )
        if dE <= 0 or np.random.random() < np.exp(-dE * beta):
            grid[i, j] *= -1
    return grid

@jit(nopython=True)
def ising_mag(grid):
    """Total magnetisation."""
    N, M = grid.shape
    s = 0
    for i in range(N):
        for j in range(M):
            s += grid[i, j]
    return s

@jit(nopython=True)
def total_energy(grid, J, h):
    """Total energy — right/down neighbours only, avoids double-counting bonds."""
    rows, columns = grid.shape
    E = 0.0
    for i in range(rows):
        for j in range(columns):
            E -= J * grid[i,j] * (grid[(i+1) % rows, j] + grid[i, (j+1) % columns]) + h * grid[i,j]
    return E`;

type Coupling = "ferro" | "antiferro";

export default function IsingSandboxPage() {
  const [temperature, setTemperature] = useState(2.0);
  const [coupling, setCoupling] = useState<Coupling>("ferro");
  const [h, setH] = useState(0);
  const [dynamics, setDynamics] = useState<Dynamics>("glauber");
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(2);
  const [resetKey, setResetKey] = useState(0);
  const [stats, setStats] = useState({ magnetisation: 0, energy: 0, sweeps: 0 });

  const J = coupling === "ferro" ? 1 : -1;

  const handleStats = useCallback(
    (s: { magnetisation: number; energy: number; sweeps: number }) => {
      setStats(s);
    },
    [],
  );

  return (
    <SimulationSandbox
      title="The Ising Model"
      subtitle="A 2D lattice of spins, flipping under thermal noise. Turn up the temperature and watch order dissolve into disorder — live, in the browser, no Python required."
      canvas={
        <IsingCanvas
          temperature={temperature}
          J={J}
          h={h}
          dynamics={dynamics}
          running={running}
          speed={speed}
          resetKey={resetKey}
          onStats={handleStats}
        />
      }
      controls={
        <>
          <div className="flex gap-2">
            <SandboxButton variant="solid" onClick={() => setRunning((r) => !r)}>
              {running ? (
                <>
                  <Pause size={13} /> Pause
                </>
              ) : (
                <>
                  <Play size={13} /> Play
                </>
              )}
            </SandboxButton>
            <SandboxButton onClick={() => setResetKey((k) => k + 1)}>
              <Shuffle size={13} /> Reshuffle
            </SandboxButton>
          </div>

          <SandboxSlider
            label="Temperature (kT/J)"
            value={temperature}
            min={0.5}
            max={5}
            step={0.05}
            onChange={setTemperature}
          />

          <SandboxSlider
            label="External field h"
            value={h}
            min={-5}
            max={5}
            step={0.1}
            onChange={setH}
          />

          <SandboxSlider
            label="Sweep speed"
            value={speed}
            min={1}
            max={8}
            step={1}
            onChange={(v) => setSpeed(Math.round(v))}
            formatValue={(v) => `${Math.round(v)}×`}
          />

          <SandboxToggle
            label="Coupling"
            value={coupling}
            options={[
              { value: "ferro", label: "Ferromagnetic" },
              { value: "antiferro", label: "Antiferromagnetic" },
            ]}
            onChange={setCoupling}
          />

          <SandboxToggle
            label="Dynamics"
            value={dynamics}
            options={[
              { value: "glauber", label: "Glauber" },
              { value: "kawasaki", label: "Kawasaki" },
            ]}
            onChange={setDynamics}
          />
        </>
      }
      stats={
        <>
          <SandboxStat label="Magnetisation" value={stats.magnetisation.toFixed(3)} />
          <SandboxStat label="Energy / site" value={stats.energy.toFixed(3)} />
          <SandboxStat label="Sweeps" value={stats.sweeps.toLocaleString()} />
          <SandboxStat label="Grid" value="60 × 60" />
        </>
      }
      sourceCode={
        <CodePanel
          code={PYTHON_SOURCE}
          caption="glauber_sweep, ising_mag, total_energy — 2016/2016.py"
        />
      }
    />
  );
}

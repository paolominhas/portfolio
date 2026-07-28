# Simulations → Articles

The architecture for embedding a matplotlib-style 2D grid simulation
(Ising, SIRS, Cahn-Hilliard, Game of Life, Poisson, ...) into a
physics article, without re-implementing the physics in JavaScript.

## The pipeline

```
Python simulation (NumPy)
        │  recorder.capture(grid)  — once per step
        ▼
scripts/simulations/export_frames.py
        │  recorder.save(...)
        ▼
public/simulations/<id>/manifest.json
public/simulations/<id>/frames.json
        │  fetch()'d client-side
        ▼
<SimulationPlayer simulationId="<id>" />
        │  used inside a { type: "simulation" } block
        ▼
src/data/physics-articles.ts  →  /physics/articles/<slug>
```

Matplotlib is never involved in the export — only NumPy. Matplotlib
is just how you were probably viewing the grid locally (`imshow`
inside a `FuncAnimation`); the web version only needs the raw arrays,
which the browser colours and draws to a `<canvas>` itself.

## Adding a new simulation to an article

1. **Export the data.** In your existing Python script, create a
   `SimulationRecorder(width, height, value_range=...)`, call
   `.capture(grid)` once per step (or inside your existing
   `FuncAnimation` update function), then `.save(...)` pointing at
   this project's `public/simulations` directory. See
   `scripts/simulations/export_frames.py` for the full API and
   `scripts/simulations/examples/game_of_life.py` for a worked
   example that generated the live one on the site.

2. **Pick a colormap** that matches what you'd use in matplotlib:
   - `coolwarm` — signed/diverging data (Ising spins, Cahn-Hilliard concentration)
   - `viridis` — general continuous fields (Poisson potential)
   - `binary` — 0/1 grids (Game of Life)
   - `grayscale` — anything else

3. **Add an article** to `src/data/physics-articles.ts` with a
   `{ type: "simulation", simulationId: "<id>" }` block wherever you
   want the player to appear, and optionally a
   `{ type: "code", code: "..." }` block showing the Python that
   produced it.

4. That's it — `/physics/articles/<slug>` picks it up automatically;
   there's no per-article routing to write.

## Scaling up

The current format (base64 JSON, one byte per cell) is deliberately
simple and is fine up to a few hundred KB per simulation — a 60×60
grid at 90 frames is ~420KB uncompressed, well under 100KB gzipped.
If a simulation needs a much bigger grid or many more frames:

- Gzip is already doing most of the work for you if your host
  compresses static assets (DigitalOcean/Caddy does this by default)
  — check that before optimising further.
- Beyond that, splitting `frames.json` into a single flat `.bin` file
  (concatenated raw bytes, no base64/JSON overhead) and fetching it
  with `response.arrayBuffer()` instead of `.json()` saves another
  ~30% and avoids the base64 decode step — a reasonable next step if
  a specific simulation outgrows the current format.

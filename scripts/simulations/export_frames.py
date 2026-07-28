"""
export_frames.py

Helper for exporting frames from a 2D grid simulation (Ising, SIRS,
Cahn-Hilliard, Game of Life, Poisson solver, ...) to the JSON format
the physics site's <SimulationPlayer> component reads.

You do NOT need matplotlib to use this — only numpy. Matplotlib was
just how you were viewing the grid locally; for the web version we
only need the raw arrays, which the browser then colours and draws
to a <canvas> itself.

MINIMAL USAGE
--------------
    from export_frames import SimulationRecorder

    recorder = SimulationRecorder(width=50, height=50, value_range=(-1, 1))

    grid = initial_state()
    for step in range(n_steps):
        grid = update(grid)
        recorder.capture(grid)

    recorder.save(
        output_dir="../../public/simulations",
        id="ising-t2.3",
        title="Ising model at T = 2.3",
        colormap="coolwarm",
        fps=15,
        parameters={"L": 50, "T": 2.3, "J": 1.0},
    )

HOOKING INTO AN EXISTING matplotlib.animation.FuncAnimation
-------------------------------------------------------------
If you already have an animation like this:

    def update(frame):
        global grid
        grid = ising_step(grid)
        im.set_data(grid)
        return [im]

    anim = animation.FuncAnimation(fig, update, frames=200, ...)
    plt.show()

...just add one line inside `update` to also record the frame:

    def update(frame):
        global grid
        grid = ising_step(grid)
        im.set_data(grid)
        recorder.capture(grid)          # <-- added
        return [im]

Then call `recorder.save(...)` after the animation finishes (or in a
separate headless run with `plt.show()` commented out, if you'd
rather not watch the whole thing render locally every time).

OUTPUT
------
`recorder.save(...)` writes two files to
`<output_dir>/<id>/`:

    manifest.json   — metadata (dimensions, fps, colormap, frame count...)
    frames.json     — { "frames": [<base64 string per frame>, ...] }

Each frame is quantised to a single byte per cell (0-255), using
`value_range` to normalise your data before quantising — so make sure
`value_range` actually brackets your data (e.g. (-1, 1) for Ising
spins, (0, 1) for a Game of Life 0/1 grid, or the true min/max of a
continuous field like a Cahn-Hilliard concentration).
"""

from __future__ import annotations

import base64
import json
from pathlib import Path
from typing import Iterable

import numpy as np

VALID_COLORMAPS = {"grayscale", "binary", "viridis", "coolwarm"}


class SimulationRecorder:
    """Accumulates frames from a running simulation and exports them."""

    def __init__(
        self,
        width: int,
        height: int,
        value_range: tuple[float, float] = (0.0, 1.0),
    ):
        self.width = width
        self.height = height
        self.value_range = value_range
        self.frames: list[str] = []

    def capture(self, grid: np.ndarray) -> None:
        """
        Append one frame. `grid` must be a 2D array of shape
        (height, width) — matching the width/height passed to the
        constructor. Values outside `value_range` are clipped, not
        rejected, so occasional numerical overshoot won't crash a run.
        """
        arr = np.asarray(grid, dtype=np.float64)
        if arr.shape != (self.height, self.width):
            raise ValueError(
                f"capture() got shape {arr.shape}, expected "
                f"({self.height}, {self.width})"
            )

        vmin, vmax = self.value_range
        normalized = np.clip((arr - vmin) / (vmax - vmin), 0.0, 1.0)
        quantized = (normalized * 255).astype(np.uint8)
        encoded = base64.b64encode(quantized.tobytes()).decode("ascii")
        self.frames.append(encoded)

    def save(
        self,
        output_dir: str | Path,
        id: str,
        title: str,
        fps: int = 12,
        colormap: str = "viridis",
        description: str | None = None,
        parameters: dict[str, float | int | str] | None = None,
    ) -> Path:
        """
        Write manifest.json + frames.json to <output_dir>/<id>/.
        `output_dir` is normally your Next.js project's `public/simulations`
        directory. Returns the path written to.
        """
        if colormap not in VALID_COLORMAPS:
            raise ValueError(
                f"colormap must be one of {sorted(VALID_COLORMAPS)}, got {colormap!r}"
            )
        if not self.frames:
            raise ValueError("No frames captured — call .capture(grid) in your loop first.")

        out_dir = Path(output_dir) / id
        out_dir.mkdir(parents=True, exist_ok=True)

        manifest = {
            "id": id,
            "title": title,
            "description": description,
            "width": self.width,
            "height": self.height,
            "frameCount": len(self.frames),
            "fps": fps,
            "colormap": colormap,
            "valueRange": list(self.value_range),
            "framesFile": "frames.json",
            "parameters": parameters or {},
        }

        (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2))
        (out_dir / "frames.json").write_text(json.dumps({"frames": self.frames}))

        total_kb = sum(len(f) for f in self.frames) / 1024
        print(
            f"Wrote {len(self.frames)} frames ({self.width}x{self.height}, "
            f"~{total_kb:.0f} KB) to {out_dir}"
        )
        return out_dir


def capture_all(
    recorder: SimulationRecorder, grids: Iterable[np.ndarray]
) -> None:
    """Convenience: capture an already-computed sequence of grids at once."""
    for grid in grids:
        recorder.capture(grid)

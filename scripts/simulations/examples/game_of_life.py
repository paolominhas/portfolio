"""
game_of_life.py

Worked example for the simulation-export architecture: runs Conway's
Game of Life on a 60x60 grid seeded with a couple of gliders and a
glider gun, and exports the run for the "Gliders, Guns, and Still
Lifes" article on the physics site.

Run from this directory:

    python game_of_life.py

This writes public/simulations/game-of-life-gliders/ into the Next.js
project (three levels up from scripts/simulations/examples/).
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np

sys.path.append(str(Path(__file__).resolve().parent.parent))
from export_frames import SimulationRecorder  # noqa: E402

WIDTH, HEIGHT = 60, 60
N_FRAMES = 90


def step(grid: np.ndarray) -> np.ndarray:
    """One Game of Life update, with wraparound (toroidal) boundaries."""
    neighbor_count = sum(
        np.roll(np.roll(grid, dy, axis=0), dx, axis=1)
        for dy in (-1, 0, 1)
        for dx in (-1, 0, 1)
        if (dy, dx) != (0, 0)
    )
    born = (neighbor_count == 3) & (grid == 0)
    survives = grid.astype(bool) & ((neighbor_count == 2) | (neighbor_count == 3))
    return (born | survives).astype(np.uint8)


def place(grid: np.ndarray, pattern: list[tuple[int, int]], origin: tuple[int, int]) -> None:
    oy, ox = origin
    for (dy, dx) in pattern:
        grid[(oy + dy) % HEIGHT, (ox + dx) % WIDTH] = 1


GLIDER = [(0, 1), (1, 2), (2, 0), (2, 1), (2, 2)]

# Gosper glider gun — a classic pattern that periodically emits gliders.
GLIDER_GUN = [
    (0, 24),
    (1, 22), (1, 24),
    (2, 12), (2, 13), (2, 20), (2, 21), (2, 34), (2, 35),
    (3, 11), (3, 15), (3, 20), (3, 21), (3, 34), (3, 35),
    (4, 0), (4, 1), (4, 10), (4, 16), (4, 20), (4, 21),
    (5, 0), (5, 1), (5, 10), (5, 14), (5, 16), (5, 17), (5, 22), (5, 24),
    (6, 10), (6, 16), (6, 24),
    (7, 11), (7, 15),
    (8, 12), (8, 13),
]


def build_initial_grid() -> np.ndarray:
    grid = np.zeros((HEIGHT, WIDTH), dtype=np.uint8)
    place(grid, GLIDER_GUN, origin=(2, 1))
    place(grid, GLIDER, origin=(40, 45))
    return grid


def main() -> None:
    grid = build_initial_grid()
    recorder = SimulationRecorder(width=WIDTH, height=HEIGHT, value_range=(0, 1))
    recorder.capture(grid)

    for _ in range(N_FRAMES - 1):
        grid = step(grid)
        recorder.capture(grid)

    project_root = Path(__file__).resolve().parents[3]
    output_dir = project_root / "public" / "simulations"

    recorder.save(
        output_dir=output_dir,
        id="game-of-life-gliders",
        title="Conway's Game of Life — Glider Gun",
        description="A Gosper glider gun (top-left) periodically emitting gliders, alongside a single glider crossing the grid.",
        fps=12,
        colormap="binary",
        parameters={"width": WIDTH, "height": HEIGHT, "rule": "B3/S23"},
    )


if __name__ == "__main__":
    main()

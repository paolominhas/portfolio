"""Digitise the stacked CC0pi histograms (StackedCC0pi{LF,GF}.png) from the repo's Graphs(Results).zip.
Read pixel colours per 0.125 GeV bin. Calibration comes from the axis ticks found in the image itself."""
import sys, json
from PIL import Image
import numpy as np
src = sys.argv[1]
OUT = {}
CAL = {  # (px of y=0, px per unit, unit scale in events)
    'LF': dict(y0=653.25, pxper=114.25/100e3),   # long ticks at 82,196,310,424,539 = 500,400,300,200,100 (x10^3)
    'GF': dict(y0=653.0, pxper=148.0/2000),      # long ticks at 209,357,505 = 6000,4000,2000
}
COLS = {'QE': (255,204,0), 'RES': (0,255,0), 'DIS': (255,0,0), 'MEC': (0,0,255)}
for n in ('LF','GF'):
    im = np.array(Image.open(f'{src}/StackedCC0pi{n}.png').convert('RGB')).astype(int)
    cal = CAL[n]
    masks = {k: (np.abs(im - np.array(c)).sum(2) < 40) for k, c in COLS.items()}
    bins = []
    for i in range(80):
        xs = range(99 + 10*i + 3, 99 + 10*i + 8)   # inside the bin, away from the outlines
        tops = {}
        for k, m in masks.items():
            t = []
            for x in xs:
                col = m[73:652, x].copy()
                if x > 690: col[:205] = False      # legend box (swatches + labels), top right
                ys = np.nonzero(col)[0]
                if len(ys): t.append(73 + ys.min())
            tops[k] = float(np.median(t)) if t else None
        # cumulative edge positions (px, upwards is smaller). The outline sits ~1px above the first fill pixel.
        edge = {}
        prev = cal['y0']
        for k in ('QE','RES','DIS','MEC'):
            if tops[k] is None: edge[k] = prev
            else: edge[k] = min(prev, tops[k] - 1.0)
            prev = edge[k]
        h = {}
        prev = cal['y0']
        for k in ('QE','RES','DIS','MEC'):
            h[k] = max(0.0, (prev - edge[k]) / cal['pxper']); prev = edge[k]
        bins.append(dict(lo=round(i*0.125,3), **{k: round(v, 1) for k, v in h.items()}))
    OUT[n] = bins
json.dump(OUT, open(sys.argv[2], 'w'))
for n in OUT:
    tot = {k: sum(b[k] for b in OUT[n]) for k in COLS}
    s = sum(tot.values()); print(n, {k: round(v) for k, v in tot.items()}, 'sum', round(s), {k: round(100*v/s, 1) for k, v in tot.items()})
    pk = max(OUT[n], key=lambda b: sum(b[k] for k in COLS)); print(' peak bin', pk)

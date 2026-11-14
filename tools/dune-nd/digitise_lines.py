"""Peak ratios for the 'finding CCQE' plots (Task2*LessData.png): CC0pi (green line), true CCQE (blue fill), 1mu1p (red line).
Calibration from the axis ticks found in each image: y=0 at row 427.5; x=0 at col 68.5, x=10 at col 627.5."""
import sys
from PIL import Image
import numpy as np
d = sys.argv[1]
CAL = {  # px per event (major tick spacing / value)
    'GArFHC': 69.6/1000, 'LArFHC': 113.2/100e3, 'GArRHC': 68.0/50, 'LArRHC': 122.9/5000,
}
WIN = {'GArFHC': (1.5, 2.5), 'LArFHC': (1.5, 2.5), 'GArRHC': (1.0, 2.0), 'LArRHC': (1.0, 2.0)}
for det, pp in CAL.items():
    im = np.array(Image.open(f'{d}/Task2{det}LessData.png').convert('RGB')).astype(int)
    R, G, B = im[:,:,0], im[:,:,1], im[:,:,2]
    green = (G > 200) & (R < 90) & (B < 90)
    red = (R > 170) & (G < 90) & (B < 90)
    blue = (B > 170) & (R < 140) & (G < 140) & (B - R > 60)
    out = {}
    for nm, m in (('cc0pi', green), ('ccqe', blue), ('mu1p', red)):
        vals = []
        for x in range(70, 627):
            e = (x - 68.5) / 55.9
            if not (WIN[det][0] <= e < WIN[det][1]): continue
            col = m[48:427, x]
            ys = np.nonzero(col)[0]
            if len(ys): vals.append((427.5 - (48 + ys.min())) / pp)
        out[nm] = float(np.median(vals)) if vals else float('nan')
    print(det, WIN[det], {k: round(v) for k, v in out.items()}, 'cc0pi/ccqe %.2f' % (out['cc0pi']/out['ccqe']), '1mu1p/ccqe %.2f' % (out['mu1p']/out['ccqe']))

#!/usr/bin/env python3
"""
prep-bg.py — turn a textless ChatGPT background into a page stage.

  python3 -I scripts/prep-bg.py scripts/bg-specs/<name>.json

Spec keys:
  src            path to the source image (textless background)
  name           output base name -> public/assets/bg/<name>.webp (+ -shade.webp)
  width          output width in px (desktop 2048, phone 1080)
  erase          [[x0,y0,x1,y1], ...] source-px boxes whose gold outlines are painted out to plain cream
  stretch        [[y0,y1,new_h], ...] source-px plain-cream bands resized vertically (taller text areas)
  keep           optional: max windows to keep (largest first)

Writes public/assets/bg/<name>.webp, <name>-shade.webp (inner shadow over the photos) and
scripts/bg-specs/<name>.out.json with the stage size and every photo window:
  { "w": 1000, "h": <units>, "windows": [ {"l","t","w","h" (stage units, width=1000), "path" (0..1 bbox path)} ] }
Windows are the flat dark #2A1D12 areas, found automatically, so photos sit exactly inside the gold lips.
"""
import json, sys, os
import numpy as np
import cv2
from PIL import Image, ImageFilter

spec = json.load(open(sys.argv[1]))
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
im = np.asarray(Image.open(spec['src']).convert('RGB')).copy()

# 1. paint out unwanted outlines (empty card frames): each row of the box becomes that row's
#    median cream (keeps the soft vertical light, removes every vertical structure), plus fine grain
for x0, y0, x1, y1 in spec.get('erase', []):
    reg = im[y0:y1, x0:x1].astype(np.float32)
    rowmed = np.median(reg, axis=1, keepdims=True)
    rowmed = cv2.GaussianBlur(np.repeat(rowmed, 3, axis=1), (0, 0), sigmaX=0.1, sigmaY=6)[:, :1]
    fill = np.repeat(rowmed, x1 - x0, axis=1)
    grain = reg - cv2.GaussianBlur(reg, (0, 0), 1.5)
    gold = (reg[..., 0] - reg[..., 2]) > 60
    grain = np.clip(grain, -5, 5) * (~cv2.dilate(gold.astype(np.uint8), np.ones((15, 15), np.uint8)).astype(bool))[..., None]
    out = np.clip(fill + grain, 0, 255)
    fy = np.minimum(np.arange(y1 - y0), np.arange(y1 - y0)[::-1])[:, None]
    fx = np.minimum(np.arange(x1 - x0), np.arange(x1 - x0)[::-1])[None, :]
    al = np.clip(np.minimum(fy, fx) / 22.0, 0, 1)[..., None]
    im[y0:y1, x0:x1] = (out * al + reg * (1 - al)).astype(np.uint8)

# 2. stretch plain-cream bands (process bottom-up so coordinates stay valid)
for st_ in sorted(spec.get('stretch', []), key=lambda s: -s[0]):
    y0, y1, nh = st_[:3]
    clean = len(st_) > 3 and st_[3]
    band = np.asarray(Image.fromarray(im[y0:y1]).resize((im.shape[1], nh), Image.LANCZOS)).astype(np.float32)
    if clean:  # x range to repaint with plain plaster (removes stretched leaves)
        cx0, cx1 = clean
        reg = band[:, cx0:cx1]
        ref = band[:, cx1:min(band.shape[1], cx1 + 160)]
        fill = np.repeat(np.median(ref, axis=1, keepdims=True), cx1 - cx0, axis=1)
        grain = np.clip(ref[:, :cx1 - cx0] - cv2.GaussianBlur(ref[:, :cx1 - cx0], (0, 0), 1.5), -5, 5) if ref.shape[1] >= cx1 - cx0 else 0
        fx = np.clip((cx1 - np.arange(cx0, cx1)) / 40.0, 0, 1)[None, :, None]
        band[:, cx0:cx1] = (fill + grain) * fx + reg * (1 - fx)
    im = np.vstack([im[:y0], np.clip(band, 0, 255).astype(np.uint8), im[y1:]])

# 3. scale to output width, light sharpen
W = spec['width']
s = W / im.shape[1]
H = int(round(im.shape[0] * s))
img = Image.fromarray(im).resize((W, H), Image.LANCZOS)
if s > 1.2:
    img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
arr = np.asarray(img).astype(np.int16)

# 4. find the dark photo windows (brown, not green)
r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
dark = ((r < 95) & (g < 70) & (b < 55) & (r >= g)).astype(np.uint8) * 255
dark = cv2.morphologyEx(dark, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
dark = cv2.morphologyEx(dark, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
n, lab, stats, _ = cv2.connectedComponentsWithStats(dark)
min_area = W * H * 0.0025
comps = [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] > min_area]
comps.sort(key=lambda i: -stats[i, cv2.CC_STAT_AREA])
if spec.get('keep'):
    comps = comps[:spec['keep']]

U = 1000 / W  # stage units per px
windows = []
shade = np.zeros((H, W), np.float32)
groups = [[comps[k] for k in grp] for grp in spec.get('merge', [])]
used = {i for g in groups for i in g}
groups += [[i] for i in comps if i not in used]
groups.sort(key=lambda g: -sum(stats[i, cv2.CC_STAT_AREA] for i in g))
for grp in groups:
    m = np.isin(lab, grp).astype(np.uint8) * 255
    m = cv2.GaussianBlur(m, (0, 0), 2.5)
    m = (m > 110).astype(np.uint8) * 255
    m = cv2.dilate(m, np.ones((5, 5), np.uint8))            # cover the dark fringe under the lip
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    cs = [cv2.approxPolyDP(c, 1.2, True)[:, 0, :].astype(float) for c in cs if cv2.contourArea(c) > 400]
    allp = np.vstack(cs)
    x0, y0 = allp[:, 0].min(), allp[:, 1].min()
    bw, bh = allp[:, 0].max() - x0, allp[:, 1].max() - y0
    path = ''.join('M' + ' L'.join('%.4f %.4f' % ((x - x0) / bw, (y - y0) / bh) for x, y in c) + 'Z' for c in cs)
    windows.append({'l': round(float(x0) * U, 2), 't': round(float(y0) * U, 2), 'w': round(float(bw) * U, 2), 'h': round(float(bh) * U, 2),
                    'cx': round(float(x0 + bw / 2) * U, 1), 'cy': round(float(y0 + bh / 2) * U, 1), 'path': path})
    # inner shadow: the lip shades the top-left of the photo, soft vignette all round
    inside = m > 0
    dist = cv2.distanceTransform(m, cv2.DIST_L2, 5)
    rim = np.exp(-dist / (W * 0.006)) * 0.55
    sh = cv2.GaussianBlur((np.roll(np.roll(~inside, int(W * .006), 0), int(W * .005), 1) & inside).astype(np.float32), (0, 0), W * .006) * 0.9
    shade = np.maximum(shade, np.clip(rim + sh, 0, 0.7) * inside)

os.makedirs(f'{root}/public/assets/bg', exist_ok=True)
base = f"{root}/public/assets/bg/{spec['name']}"
ov = np.zeros((H, W, 4), np.uint8)
ov[..., :3] = (40, 26, 12)
ov[..., 3] = (shade * 255).astype(np.uint8)
ovi = Image.fromarray(ov, 'RGBA')
# slices: [[y0, y1, "fixed"|"flex"], ...] in stage units; default one fixed slice
cuts = spec.get('cuts') or [[0, H * U, 'fixed']]
slices = []
for k, (u0, u1, kind) in enumerate(cuts):
    p0, p1 = int(round(u0 / U)), min(H, int(round(u1 / U)))
    fn = f"{spec['name']}-{k}"
    part = img.crop((0, p0, W, p1))
    if kind == 'flex' and spec.get('flatmid'):
        # clean stretch band: each column blends its top row into its bottom row, so it stretches with no streaks
        a = np.asarray(part).astype(np.float32)
        def clean_row(r):
            m = np.median(r[0, int(r.shape[1] * .2):int(r.shape[1] * .8)], 0)
            bad = np.abs(r[0] - m).sum(-1) > 45          # leaves, gold blobs: not plain plaster
            bad = cv2.dilate(bad.astype(np.uint8)[None], np.ones((1, 31), np.uint8))[0].astype(bool)
            r = r.copy(); r[0, bad] = m
            return cv2.GaussianBlur(r, (0, 0), sigmaX=10, sigmaY=0.1)
        top = clean_row(a[:3].mean(0, keepdims=True))
        bot = clean_row(a[-3:].mean(0, keepdims=True))
        t = np.linspace(0, 1, a.shape[0])[:, None, None]
        t = t * t * (3 - 2 * t)
        flat = top * (1 - t) + bot * t
        grain = np.clip(a - cv2.GaussianBlur(a, (0, 0), 1.5), -4, 4)
        part = Image.fromarray(np.clip(flat, 0, 255).astype(np.uint8))
    part.save(f"{root}/public/assets/bg/{fn}.webp", quality=spec.get('q', 82), method=6)
    ws = [dict(w, t=round(w['t'] - u0, 2), cy=round(w['cy'] - u0, 1)) for w in windows if w['t'] >= u0 - 1 and w['t'] + w['h'] <= u1 + 1]
    if ws:
        ovi.crop((0, p0, W, p1)).save(f"{root}/public/assets/bg/{fn}-shade.webp", quality=70, method=6)
    slices.append({'file': fn, 'kind': kind, 'y0': u0, 'h': round((p1 - p0) * U, 2), 'shade': bool(ws), 'windows': ws})
out = {'name': spec['name'], 'px': [W, H], 'w': 1000, 'h': round(H * U, 2), 'windows': windows, 'slices': slices}
json.dump(out, open(sys.argv[1].replace('.json', '.out.json'), 'w'), indent=1)
print(spec['name'], out['h'], len(windows), 'windows', [(x['kind'], x['h'], len(x['windows'])) for x in slices])
for k, w in enumerate(windows):
    print(k, {a: w[a] for a in ('l', 't', 'w', 'h')})

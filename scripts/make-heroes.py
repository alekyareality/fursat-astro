#!/usr/bin/env python3
"""Bake real Fursat photos into the corner-hero art (brown windows) -> one finished image per page.
Why: the page then loads ONE image, so guests never see an empty brown window while a photo loads.
Run from repo root:  python3 scripts/make-heroes.py   (needs Pillow, numpy, scipy)
Sources: art PNGs in originals/heroes/, photos in public/assets/. Output: public/assets/heroes/<page>-{768,1024,1536}.webp + -lqip.txt
"""
import json, os, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

A = 'public/assets/'
# page: art file, photos (largest window first), focal point (x,y 0..1) per photo
HEROES = {
  'cafe':    ('arch.png',  [('interior/tour-cafe.webp', (0.5, 0.42))]),
  'bar':     ('hex.png',   [('interior/bar-back.webp', (0.55, 0.42))]),
  'party':   ('ovals.png', [('venue/interior/long-table-dining.webp', (0.45, 0.62)), ('venue/banquet/banquet-hall-02.webp', (0.5, 0.45))]),
  'banquet': ('blob.png',  [('venue/banquet/banquet-tables-05.webp', (0.5, 0.6))]),
}
OUT = A + 'heroes/'
os.makedirs(OUT, exist_ok=True)

def cover(photo, w, h, focal):
    pw, ph = photo.size; s = max(w / pw, h / ph)
    photo = photo.resize((max(w, round(pw * s)), max(h, round(ph * s))), Image.LANCZOS)
    pw, ph = photo.size
    x = min(max(0, round(focal[0] * pw - w / 2)), pw - w); y = min(max(0, round(focal[1] * ph - h / 2)), ph - h)
    return photo.crop((x, y, x + w, y + h))

meta = {}
for page, (art_name, photos) in HEROES.items():
    art = Image.open('originals/heroes/' + art_name).convert('RGB')
    a = np.asarray(art).astype(int); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    brown = (r < 95) & (g < 65) & (b < 45) & (r >= g) & (g >= b)
    lab, n = ndimage.label(brown)
    sizes = ndimage.sum(brown, lab, range(1, n + 1))
    keep = [i + 1 for i in np.argsort(sizes)[::-1][:len(photos)] if sizes[i] > 5000]
    out = art.copy(); boxes = []
    for k, comp in enumerate(keep):
        m = ndimage.binary_fill_holes(lab == comp)
        m = ndimage.binary_dilation(m, iterations=3)          # cover the anti-aliased brown edge under the gold rim
        ys, xs = np.where(m); x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
        path, focal = photos[k]
        ph = cover(Image.open(A + path).convert('RGB'), x1 - x0, y1 - y0, focal)
        mask = Image.fromarray((m[y0:y1, x0:x1] * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))
        out.paste(ph, (int(x0), int(y0)), mask)
        boxes.append([round(x0 / art.width * 100, 2), round(y0 / art.height * 100, 2), round(x1 / art.width * 100, 2), round(y1 / art.height * 100, 2)])
    for w in (768, 1024, 1536):
        out.resize((w, round(w * art.height / art.width)), Image.LANCZOS).save(f'{OUT}{page}-{w}.webp', 'WEBP', quality=80, method=6)
    tiny = out.resize((24, round(24 * art.height / art.width)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6))
    import base64, io; buf = io.BytesIO(); tiny.save(buf, 'WEBP', quality=40)
    meta[page] = {'w': art.width, 'h': art.height, 'windows': boxes, 'lqip': 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()}
    print(page, 'windows', boxes)
json.dump(meta, open('src/data/heroes.json', 'w'), indent=1)
print('wrote src/data/heroes.json')

"""Link uploaded dish/drink photos to menu.json.

Usage (from the fursat/ folder):
    python3 link-photos.py

Drop photos into public/assets/ask/dishes/ named as the "Upload as" column
in fursat-dish-photos.csv (e.g. masala-omelette.webp). This script adds the
img field to every menu item whose photo now exists, and lists what is
still missing.
"""
import json, os, re

MENU = "public/data/menu.json"
DIR = "public/assets/ask/dishes"

slug = lambda s: re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

menu = json.load(open(MENU))
files = set(os.listdir(DIR))
linked, missing = [], []

for item in menu:
    if "img" in item:
        continue
    name = slug(item["n"]) + ".webp"
    if name in files:
        item["img"] = f"/assets/ask/dishes/{name}"
        linked.append(item["n"])
    else:
        missing.append(item["n"])

json.dump(menu, open(MENU, "w"), ensure_ascii=False, separators=(",", ":"))
print(f"Linked {len(linked)} new photos.")
for n in linked:
    print("  +", n)
print(f"Still missing: {len(missing)}")

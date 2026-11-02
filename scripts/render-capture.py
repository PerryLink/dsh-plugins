#!/usr/bin/env python3
"""Render a real captured command transcript into a terminal-style PNG.

Usage: render-capture.py <input.txt> <output.png> [--title "dsh-xxx — node --test"]

The input file must contain the actual stdout/stderr of a command, optionally with a
leading "$ <command>" line. Nothing in this script invents output text: it only draws
what the capture file already contains.
"""
import os
import sys
import unicodedata

from PIL import Image, ImageDraw, ImageFont

BG = (13, 17, 23)
BAR = (22, 27, 34)
FG = (201, 209, 217)
GREEN = (63, 185, 80)
DIM = (139, 148, 158)
ACCENT = (88, 166, 255)
# The bundled DejaVu mono font has no CJK glyphs. Set RENDER_CAPTURE_FONT (and
# optionally RENDER_CAPTURE_FONT_BOLD) to a monospace/CJK font to render Chinese,
# Japanese or Korean lines instead of empty boxes. Defaults are unchanged.
DEFAULT_FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
DEFAULT_FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
FONT_PATH = os.environ.get("RENDER_CAPTURE_FONT", DEFAULT_FONT)
if not os.path.exists(FONT_PATH):
    FONT_PATH = DEFAULT_FONT
BOLD_PATH = os.environ.get("RENDER_CAPTURE_FONT_BOLD", FONT_PATH if os.environ.get("RENDER_CAPTURE_FONT") else DEFAULT_FONT_BOLD)
if not os.path.exists(BOLD_PATH):
    BOLD_PATH = FONT_PATH
FONT_SIZE = 15
PAD = 22
LINE_H = 21


def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    src, dst = sys.argv[1], sys.argv[2]
    title = "terminal"
    if "--title" in sys.argv:
        title = sys.argv[sys.argv.index("--title") + 1]

    with open(src, encoding="utf-8") as fh:
        raw = fh.read().replace("\r\n", "\n")
    # the bundled font has no glyph for the info sign; substitute a visible dot so the
    # line stays readable without changing any captured text
    raw = raw.replace("\u2139 ", "\u00b7 ").replace("\u2139", "\u00b7")
    lines = raw.rstrip("\n").split("\n")
    # hard cap so a runaway transcript cannot produce a giant image
    if len(lines) > 40:
        lines = lines[:38] + ["… (truncated)"]

    font = ImageFont.truetype(FONT_PATH, FONT_SIZE)
    bold = ImageFont.truetype(BOLD_PATH, FONT_SIZE)
    small = ImageFont.truetype(FONT_PATH, 13)

    # East-Asian wide glyphs take two monospace cells; counting them as two keeps a
    # CJK transcript from being clipped on the right edge. Pure-ASCII input is unchanged.
    def cells(text):
        return sum(2 if unicodedata.east_asian_width(ch) in ("W", "F") else 1 for ch in text)

    width_chars = max([cells(title) + 6] + [cells(l) for l in lines])
    width_chars = min(max(width_chars, 56), 118)
    width = int(width_chars * (FONT_SIZE * 0.62)) + PAD * 2
    height = PAD * 2 + 34 + len(lines) * LINE_H + 10

    img = Image.new("RGB", (width, height), BG)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, width, 34], fill=BAR)
    for i, color in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        d.ellipse([16 + i * 20, 11, 16 + i * 20 + 12, 23], fill=color)
    d.text((84, 9), title, font=small, fill=DIM)

    y = 34 + PAD
    for line in lines:
        color = FG
        if line.startswith("$ "):
            color = ACCENT
        elif " fail 0" in line or line.startswith("✔") or "ok:" in line or "acceptance ok" in line:
            color = GREEN
        elif line.startswith("#") or line.startswith("ℹ"):
            color = DIM
        d.text((PAD, y), line, font=bold if line.startswith("$ ") else font, fill=color)
        y += LINE_H

    img.save(dst, "PNG")
    print(f"wrote {dst} ({width}x{height}, {len(lines)} lines)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

# நாமாவளி · नामावलिः

பூஜைக்கான அஷ்டோத்தர, த்ரிஶதீ, ஸஹஸ்ர நாமாவளிகள். தேவநாகரி, தமிழ், க்ரந்தம், English (IAST) எழுத்துகளில் படிக்கலாம். போனில் ஆப்பாக நிறுவலாம், இணையம் இல்லாமலும் வேலை செய்யும்.

**https://vaishvanaran.github.io/namavali/**

A free, ad-free, offline-capable (PWA) collection of nāmāvalis for pūjā.

## Sources
- [StotraSamhita — Nāmāvalī-mañjarī](https://github.com/stotrasamhita/namavali-manjari), used with permission.

## How it is built
- `site/` is the whole app (plain HTML/CSS/JS, no build step needed to serve). GitHub Pages serves it.
- Text is stored once in Devanagari (`site/data/*.json`); `site/translit.js` produces Tamil, Grantha and IAST in the browser.
- `tools/build.py` regenerates `site/data/` from the namavali-manjari `.tex` files; `tools/catalog.py` decides grouping and names.
- `tools/make_sw.py` writes the offline cache list (`site/sw.js`) — run it after any change.

Fonts: Tiro Devanagari Sanskrit, Noto Serif Tamil, Noto Serif Grantha, Noto Sans Tamil (SIL OFL).

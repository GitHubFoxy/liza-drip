Project layout

Made with Codex.

Linting/formatting is handled by Biome (see `package.json` scripts: `biome check`, `biome format`, `biome fix`).

```
/
├── src/
│   ├── lens/
│   │   ├── constants.js   # lens tuning knobs
│   │   ├── flashlightLens.js  # cursor-controlled reveal controller
│   │   └── math.js        # clamp + lerp helpers
│   └── main.js            # wires the lens controller into the DOM
├── index.html             # single-page artifact with before/after portraits
├── before.jpg            # default portrait
├── after.png             # fun reveal portrait
├── package.json
├── package-lock.json
└── README.md
```

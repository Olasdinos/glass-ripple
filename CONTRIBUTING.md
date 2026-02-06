# Contributing to glass-ripple

Thanks for your interest in contributing! The AI ecosystem moves fast — new models and tools drop every week. Whether it's adding the latest brand icon, fixing a shader bug, or building a new post-effect — all contributions are welcome.

## Getting Started

```bash
git clone https://github.com/ZenAlexa/glass-ripple.git
cd glass-ripple
pnpm install
pnpm dev          # starts dev server at localhost:5173
```

## Adding Icons

Adding a new icon preset is the easiest way to contribute. Each icon is a single file:

1. Create `src/icons/<name>.ts`:

```ts
import type { IconPreset } from '../types';

export const myBrand: IconPreset = {
  name: 'My Brand',
  category: 'Dev Tools',   // AI Models | Creative AI | Dev Tools | Cloud & Infra
  color: '#ff6600',
  icon: {
    svgPath: 'M12 2L2 22h20Z',  // from simpleicons.org
    color: '#ff6600',
    viewBox: 24,
    scale: 0.7,
    position: { x: 0.5, y: 0.42 },
  },
};
```

2. Add the export to `src/icons/index.ts` (both the named export and the `allPresets` array).

3. Test it in the dev server — your icon should appear in the picker bar.

**Where to find SVG paths:** [Simple Icons](https://simpleicons.org/) provides single-path SVG data for 3000+ brands under CC0 license.

## Code Changes

- Run `pnpm typecheck` before submitting
- Run `pnpm build:lib` to verify the library builds cleanly
- Keep PRs focused — one feature or fix per PR

## Project Structure

```
src/
├── glass-ripple.ts   # Main GlassRipple class
├── shaders.ts        # All GLSL shader sources
├── types.ts          # TypeScript interfaces
├── index.ts          # Demo page entry
└── icons/            # 52+ icon preset files
    ├── index.ts      # Barrel export + allPresets
    ├── claude.ts
    ├── openai.ts
    └── ...
```

## Commit Messages

Use [conventional commits](https://www.conventionalcommits.org/):

- `feat: add deepseek icon preset`
- `fix: correct normal map z-component`
- `docs: update configuration examples`

## Questions?

Open a [GitHub issue](https://github.com/ZenAlexa/glass-ripple/issues) — there are no bad questions.

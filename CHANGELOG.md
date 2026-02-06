# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2026-02-07

### Added
- 52 built-in icon presets covering the 2026 AI ecosystem: AI Models & Agents (22), Creative AI (8), Dev Tools & Agent Infra (14), Cloud & GPU Infra (8)
- `presetsByCategory` grouped export for UI rendering
- `setTint()` method for runtime halftone color updates
- Full SVG markup support (`svg` string mode) with async decoding
- Crossfade transition when switching icons via `setIcon()`
- Remotion showcase video project (`video/`)
- Playwright-based demo recording script

### Changed
- `IconConfig` is now a discriminated union: `SvgPathIcon | SvgStringIcon`
- `setIcon()` returns `Promise<void>` (for svg string mode compatibility)
- Library build uses `vite-plugin-dts` with `rollupTypes` for clean declarations

## [1.0.0] - 2026-02-06

### Added
- Initial release
- 11-pass WebGL2 shader pipeline
- Real-time 2D wave equation simulation at quarter resolution
- Post-processing: halftone, chromatic aberration, CRT screen, vignette
- Mouse interaction with continuous wake via line-segment distance
- TypeScript-first API with full type definitions
- Three.js peer dependency (externalized in build)

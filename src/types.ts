/** Icon defined by a single SVG path d-attribute (sync rendering via Path2D) */
export interface SvgPathIcon {
  svgPath: string;
  color?: string;
  viewBox?: number;
  scale?: number;
  position?: { x: number; y: number };
  fillRule?: 'nonzero' | 'evenodd';
}

/** Icon defined by full SVG markup string (async rendering via Image element) */
export interface SvgStringIcon {
  svg: string;
  scale?: number;
  position?: { x: number; y: number };
}

/** Discriminated union: either a single-path icon or a full SVG markup icon */
export type IconConfig = SvgPathIcon | SvgStringIcon;

/** Wraps an IconConfig with display metadata for the icon picker UI */
export interface IconPreset {
  name: string;
  icon: IconConfig;
  category?: string;
  color?: string;
}

export interface WaveConfig {
  /** Height & velocity damping per step (0-1), default 0.8 */
  damping?: number;
  /** Wave propagation speed multiplier, default 1.0 */
  speed?: number;
  /** Mouse interaction radius in UV space, default 0.025 */
  radius?: number;
  /** Mouse interaction intensity multiplier, default 20.0 */
  intensity?: number;
  /** Mouse smoothing factor (0 = no movement, 1 = instant), default 0.4 */
  momentum?: number;
  /** Simulation steps per frame, default 1 */
  steps?: number;
}

export interface HalftoneConfig {
  tint?: [number, number, number];
  mix?: number;
  scale?: number;
  angle?: number;
}

export interface EffectsConfig {
  /** Two halftone passes, or false to disable */
  halftone?: false | [HalftoneConfig?, HalftoneConfig?];
  /** Chromatic aberration, or false to disable */
  chromab?: false | { amount?: number };
  /** CRT retro screen, or false to disable */
  retroScreen?: false | { cellScale?: number; glow?: number };
  /** Vignette, or false to disable */
  vignette?: false | { intensity?: number };
}

export interface GlassRippleConfig {
  /** Target canvas element */
  canvas: HTMLCanvasElement;
  /** Icon configuration (SVG path + styling) */
  icon?: IconConfig;
  /** Wave simulation parameters */
  wave?: WaveConfig;
  /** Post-processing effects */
  effects?: EffectsConfig;
  /** Background fill color, default "#050505" */
  background?: string;
  /** Device pixel ratio cap, default min(devicePixelRatio, 2) */
  pixelRatio?: number;
}

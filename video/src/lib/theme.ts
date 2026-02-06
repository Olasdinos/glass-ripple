// Glass Ripple brand palette
export const theme = {
  bg: "#050505",
  bgAlt: "#0a0a0f",
  accent: "#D97757",
  accentGlow: "#ff9a70",
  cyan: "#00e5ff",
  violet: "#a855f7",
  gold: "#D4AF37",
  white: "#f0f0f0",
  muted: "#666",
  dimText: "#999",
  fontMono: "JetBrains Mono, Fira Code, SF Mono, monospace",
  fontSans: "Inter, system-ui, -apple-system, sans-serif",
} as const;

// Icon brand colors (bright for CRT visibility)
export const iconColors: Record<string, string> = {
  claude: "#D97757",
  openai: "#00e676",
  gemini: "#8ab4f8",
  meta: "#1877F2",
  mistral: "#ff7000",
  deepseek: "#4d6bfe",
  cursor: "#00ccff",
  copilot: "#6cc644",
  github: "#f0f0f0",
  vercel: "#f0f0f0",
};

// Pipeline stage colors
export const pipelineColors = [
  "#ff6b6b", // Wave sim
  "#ffd93d", // Normal map
  "#6bcb77", // Blur
  "#4d96ff", // Composite
  "#c084fc", // Halftone 1
  "#f472b6", // Halftone 2
  "#fb923c", // Chromab
  "#38bdf8", // CRT
  "#a78bfa", // Vignette
] as const;

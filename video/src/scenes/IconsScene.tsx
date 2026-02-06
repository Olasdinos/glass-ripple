import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme } from "../lib/theme";

const iconGrid = [
  // Row 1 — AI Models
  [
    { name: "Claude", color: "#D97757" },
    { name: "OpenAI", color: "#00e676" },
    { name: "Gemini", color: "#8ab4f8" },
    { name: "Meta", color: "#1877F2" },
    { name: "Mistral", color: "#ff7000" },
    { name: "DeepSeek", color: "#4d6bfe" },
    { name: "xAI", color: "#f0f0f0" },
    { name: "Qwen", color: "#615bff" },
  ],
  // Row 2 — More Models + Creative
  [
    { name: "Cohere", color: "#39594D" },
    { name: "Groq", color: "#f55036" },
    { name: "Yi", color: "#1a73e8" },
    { name: "Midjourney", color: "#f0f0f0" },
    { name: "Stability", color: "#a855f7" },
    { name: "DALL·E", color: "#00e676" },
    { name: "Suno", color: "#ffdd00" },
    { name: "ElevenLabs", color: "#f0f0f0" },
  ],
  // Row 3 — Dev Tools
  [
    { name: "GitHub", color: "#f0f0f0" },
    { name: "Copilot", color: "#6cc644" },
    { name: "Cursor", color: "#00ccff" },
    { name: "Vercel", color: "#f0f0f0" },
    { name: "Ollama", color: "#f0f0f0" },
    { name: "HuggingFace", color: "#ffbd2e" },
    { name: "LangChain", color: "#1c3c3c" },
    { name: "Dify", color: "#1677ff" },
  ],
  // Row 4 — Cloud & Infra
  [
    { name: "NVIDIA", color: "#76b900" },
    { name: "AWS", color: "#ff9900" },
    { name: "Azure", color: "#0078d4" },
    { name: "Google Cloud", color: "#4285f4" },
    { name: "Cloudflare", color: "#f38020" },
    { name: "Together", color: "#0ea5e9" },
    { name: "Fireworks", color: "#f97316" },
    { name: "Apple", color: "#f0f0f0" },
  ],
];

const categoryLabels = ["AI Models", "Creative AI", "Dev Tools", "Cloud & Infra"];

export const IconsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Counter animation
  const iconCount = Math.min(
    52,
    Math.round(interpolate(frame, [5, 40], [0, 52], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }))
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        padding: "50px 60px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          display: "flex",
          alignItems: "baseline",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <h2
          style={{
            fontFamily: theme.fontSans,
            fontSize: 42,
            fontWeight: 700,
            color: theme.white,
            margin: 0,
          }}
        >
          Icon Presets
        </h2>
        <span
          style={{
            fontFamily: theme.fontMono,
            fontSize: 28,
            color: theme.accent,
            fontWeight: 600,
          }}
        >
          {iconCount}+
        </span>
        <span
          style={{
            fontFamily: theme.fontMono,
            fontSize: 16,
            color: theme.muted,
          }}
        >
          tree-shakeable
        </span>
      </div>

      {/* Icon grid */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          flex: 1,
        }}
      >
        {iconGrid.map((row, rowIdx) => {
          const rowDelay = 8 + rowIdx * 12;

          return (
            <div key={rowIdx}>
              {/* Category label */}
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 11,
                  color: theme.muted,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  marginBottom: 8,
                  opacity: interpolate(frame - rowDelay, [0, 8], [0, 0.7], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                {categoryLabels[rowIdx]}
              </div>

              {/* Icons row */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                {row.map((icon, colIdx) => {
                  const cellDelay = rowDelay + colIdx * 3;
                  const cellScale = spring({
                    frame: frame - cellDelay,
                    fps,
                    config: { damping: 12, stiffness: 150 },
                  });
                  const cellOpacity = interpolate(
                    frame - cellDelay,
                    [0, 6],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  );

                  // Highlight wave effect
                  const wavePhase = (frame - 60) * 0.08 - (rowIdx * 0.3 + colIdx * 0.15);
                  const isHighlighted = Math.sin(wavePhase) > 0.7 && frame > 55;

                  return (
                    <div
                      key={colIdx}
                      style={{
                        flex: 1,
                        height: 100,
                        background: isHighlighted
                          ? `linear-gradient(135deg, ${icon.color}18, ${icon.color}08)`
                          : `${theme.white}04`,
                        border: `1px solid ${isHighlighted ? `${icon.color}50` : `${theme.white}08`}`,
                        borderRadius: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        opacity: cellOpacity,
                        transform: `scale(${cellScale})`,
                      }}
                    >
                      {/* Colored dot as icon placeholder */}
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: `radial-gradient(circle at 40% 40%, ${icon.color}, ${icon.color}88)`,
                          boxShadow: isHighlighted ? `0 0 12px ${icon.color}40` : "none",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: theme.fontMono,
                          fontSize: 10,
                          color: isHighlighted ? theme.white : theme.dimText,
                          textAlign: "center",
                          lineHeight: 1.1,
                        }}
                      >
                        {icon.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

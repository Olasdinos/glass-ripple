import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme, pipelineColors } from "../lib/theme";

const stages = [
  { label: "Wave Sim", detail: "2D wave equation ¼ res" },
  { label: "Normal Map", detail: "Surface normals from height" },
  { label: "Gaussian Blur", detail: "Separable H + V pass" },
  { label: "Composite", detail: "Refraction + specular" },
  { label: "Halftone ×2", detail: "Dot pattern overlay" },
  { label: "Chromab", detail: "Chromatic aberration" },
  { label: "CRT Screen", detail: "RGB subpixel grid" },
  { label: "Vignette", detail: "Elliptical darkening" },
];

export const PipelineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section title
  const headerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "11-pass" counter animation
  const passCount = Math.min(
    11,
    Math.round(interpolate(frame, [8, 45], [0, 11], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }))
  );

  // Pipeline flow indicator
  const flowProgress = interpolate(frame, [30, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        padding: 60,
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
          marginBottom: 40,
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
          Shader Pipeline
        </h2>
        <span
          style={{
            fontFamily: theme.fontMono,
            fontSize: 32,
            color: theme.accent,
            fontWeight: 600,
          }}
        >
          {passCount} passes
        </span>
      </div>

      {/* Pipeline visualization */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flex: 1,
        }}
      >
        {stages.map((stage, i) => {
          const staggerDelay = 10 + i * 8;
          const nodeScale = spring({
            frame: frame - staggerDelay,
            fps,
            config: { damping: 14, stiffness: 120 },
          });

          const nodeOpacity = interpolate(
            frame - staggerDelay,
            [0, 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Flow highlight — lights up each stage sequentially
          const flowHit = i / stages.length;
          const isLit = flowProgress >= flowHit;
          const glowIntensity = isLit
            ? interpolate(
                flowProgress,
                [flowHit, Math.min(flowHit + 0.15, 1)],
                [1, 0.4],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )
            : 0;

          const color = pipelineColors[i] ?? theme.accent;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: nodeOpacity,
                transform: `scale(${nodeScale}) translateX(${(1 - nodeScale) * -30}px)`,
              }}
            >
              {/* Stage number */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: isLit ? `${color}30` : `${color}12`,
                  border: `1.5px solid ${isLit ? color : `${color}40`}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: theme.fontMono,
                  fontSize: 14,
                  fontWeight: 600,
                  color: isLit ? color : theme.muted,
                  boxShadow: glowIntensity > 0.5 ? `0 0 16px ${color}50` : "none",
                  transition: "none",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>

              {/* Bar */}
              <div
                style={{
                  flex: 1,
                  height: 44,
                  background: isLit
                    ? `linear-gradient(90deg, ${color}20, ${color}08)`
                    : `${theme.white}06`,
                  borderRadius: 8,
                  border: `1px solid ${isLit ? `${color}40` : `${theme.white}10`}`,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 20px",
                  gap: 16,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Fill progress */}
                {isLit && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${Math.min(100, glowIntensity * 180)}%`,
                      background: `linear-gradient(90deg, ${color}15, transparent)`,
                    }}
                  />
                )}

                <span
                  style={{
                    fontFamily: theme.fontSans,
                    fontSize: 17,
                    fontWeight: 600,
                    color: isLit ? theme.white : theme.dimText,
                    position: "relative",
                  }}
                >
                  {stage.label}
                </span>
                <span
                  style={{
                    fontFamily: theme.fontMono,
                    fontSize: 13,
                    color: isLit ? `${color}cc` : `${theme.muted}80`,
                    position: "relative",
                  }}
                >
                  {stage.detail}
                </span>
              </div>

              {/* Arrow connector */}
              {i < stages.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: 77,
                    top: `calc(${((i + 1) / stages.length) * 100}%)`,
                    width: 1,
                    height: 10,
                    background: `${theme.white}15`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom annotation */}
      <div
        style={{
          opacity: interpolate(frame, [85, 100], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontFamily: theme.fontMono,
          fontSize: 14,
          color: theme.muted,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Base Texture → Wave Sim (ping-pong, ¼ res) → Normal → Blur → Composite → Post FX → Screen
      </div>
    </AbsoluteFill>
  );
};

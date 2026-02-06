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

const features = [
  { icon: "~", text: "WebGL2 + GLSL 300 ES" },
  { icon: "◈", text: "11-pass shader pipeline" },
  { icon: "◇", text: "52+ icon presets" },
  { icon: "△", text: "TypeScript-first" },
  { icon: "○", text: "Single <canvas>" },
];

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Main title
  const titleSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 10, stiffness: 80, mass: 0.6 },
  });

  const titleOpacity = interpolate(frame, [3, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Animated ripple background
  const rippleCount = 5;

  // GitHub link
  const linkOpacity = interpolate(frame, [70, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const linkY = interpolate(frame, [70, 85], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Ripple rings (background decoration) */}
      {Array.from({ length: rippleCount }).map((_, i) => {
        const delay = i * 15;
        const rippleProgress = interpolate(
          (frame - delay) % 90,
          [0, 90],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const radius = interpolate(rippleProgress, [0, 1], [50, 500]);
        const opacity = interpolate(rippleProgress, [0, 0.1, 0.6, 1], [0, 0.15, 0.08, 0]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: radius * 2,
              height: radius * 2,
              borderRadius: "50%",
              border: `1px solid ${theme.accent}`,
              opacity,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}

      {/* Gradient glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.accent}12 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          opacity: titleOpacity,
          transform: `scale(${titleSpring})`,
          position: "relative",
        }}
      >
        {/* Logo text */}
        <h1
          style={{
            fontFamily: theme.fontSans,
            fontSize: 72,
            fontWeight: 700,
            color: theme.white,
            margin: 0,
            letterSpacing: "-2.5px",
          }}
        >
          glass
          <span style={{ color: theme.accent }}>-</span>
          ripple
        </h1>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 800,
          }}
        >
          {features.map((feat, i) => {
            const pillDelay = 20 + i * 6;
            const pillScale = spring({
              frame: frame - pillDelay,
              fps,
              config: { damping: 14, stiffness: 140 },
            });
            const pillOpacity = interpolate(
              frame - pillDelay,
              [0, 8],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={i}
                style={{
                  background: `${theme.accent}10`,
                  border: `1px solid ${theme.accent}30`,
                  borderRadius: 24,
                  padding: "8px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  opacity: pillOpacity,
                  transform: `scale(${pillScale})`,
                }}
              >
                <span
                  style={{
                    fontFamily: theme.fontMono,
                    fontSize: 14,
                    color: theme.accent,
                  }}
                >
                  {feat.icon}
                </span>
                <span
                  style={{
                    fontFamily: theme.fontMono,
                    fontSize: 14,
                    color: theme.dimText,
                  }}
                >
                  {feat.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* npm install */}
        <div
          style={{
            opacity: interpolate(frame, [55, 68], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            background: "#0d1117",
            border: "1px solid #1a1a2e",
            borderRadius: 10,
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 8,
          }}
        >
          <span style={{ fontFamily: theme.fontMono, fontSize: 15, color: "#666" }}>
            $
          </span>
          <span style={{ fontFamily: theme.fontMono, fontSize: 15, color: theme.accent }}>
            npm install glass-ripple three
          </span>
        </div>

        {/* GitHub link */}
        <div
          style={{
            opacity: linkOpacity,
            transform: `translateY(${linkY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 4,
          }}
        >
          <span
            style={{
              fontFamily: theme.fontMono,
              fontSize: 16,
              color: theme.muted,
            }}
          >
            github.com/ZenAlexa/glass-ripple
          </span>
        </div>
      </div>

      {/* Corner brackets */}
      {[
        { top: 30, left: 30 },
        { top: 30, right: 30 },
        { bottom: 30, left: 30 },
        { bottom: 30, right: 30 },
      ].map((pos, i) => {
        const cornerOpacity = interpolate(
          frame - 10 - i * 3,
          [0, 8],
          [0, 0.25],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const isLeft = "left" in pos;
        const isTop = "top" in pos;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              width: 24,
              height: 24,
              borderColor: theme.accent,
              borderStyle: "solid",
              borderWidth: 0,
              ...(isTop ? { borderTopWidth: 1.5 } : { borderBottomWidth: 1.5 }),
              ...(isLeft ? { borderLeftWidth: 1.5 } : { borderRightWidth: 1.5 }),
              opacity: cornerOpacity,
            }}
          />
        );
      })}

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          display: "flex",
          gap: 24,
          alignItems: "center",
          opacity: interpolate(frame, [80, 90], [0, 0.5], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span style={{ fontFamily: theme.fontMono, fontSize: 11, color: theme.muted }}>
          MIT License
        </span>
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: theme.muted }} />
        <span style={{ fontFamily: theme.fontMono, fontSize: 11, color: theme.muted }}>
          TypeScript
        </span>
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: theme.muted }} />
        <span style={{ fontFamily: theme.fontMono, fontSize: 11, color: theme.muted }}>
          Three.js
        </span>
      </div>
    </AbsoluteFill>
  );
};

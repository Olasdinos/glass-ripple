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

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ripple rings expanding outward
  const rings = [0, 8, 16, 24, 32];

  // Title spring
  const titleScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
  });

  const titleOpacity = interpolate(frame, [18, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle fade
  const subOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subY = interpolate(frame, [40, 55], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Version badge
  const badgeScale = spring({
    frame: frame - 55,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // Scanline effect
  const scanY = interpolate(frame, [0, 120], [-100, 820], {
    extrapolateRight: "extend",
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
      {/* Animated ripple rings */}
      {rings.map((delay, i) => {
        const ringProgress = interpolate(
          frame - delay,
          [0, 80],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const ringRadius = interpolate(ringProgress, [0, 1], [0, 400]);
        const ringOpacity = interpolate(ringProgress, [0, 0.2, 0.8, 1], [0, 0.3, 0.15, 0]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: ringRadius * 2,
              height: ringRadius * 2,
              borderRadius: "50%",
              border: `1.5px solid ${theme.accent}`,
              opacity: ringOpacity,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}

      {/* Subtle radial glow behind title */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.accent}15 0%, transparent 70%)`,
          opacity: interpolate(frame, [10, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* Title */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        <h1
          style={{
            fontFamily: theme.fontSans,
            fontSize: 80,
            fontWeight: 700,
            color: theme.white,
            margin: 0,
            letterSpacing: "-3px",
            lineHeight: 1,
          }}
        >
          glass
          <span style={{ color: theme.accent }}>-</span>
          ripple
        </h1>

        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <p
            style={{
              fontFamily: theme.fontMono,
              fontSize: 20,
              color: theme.dimText,
              margin: 0,
              letterSpacing: "0.5px",
            }}
          >
            WebGL2 Water Ripple + CRT Retro Aesthetics
          </p>

          {/* Version badge */}
          <div
            style={{
              transform: `scale(${badgeScale})`,
              background: `linear-gradient(135deg, ${theme.accent}22, ${theme.accent}08)`,
              border: `1px solid ${theme.accent}44`,
              borderRadius: 20,
              padding: "6px 18px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: theme.fontMono,
                fontSize: 14,
                color: theme.accent,
                fontWeight: 600,
              }}
            >
              v2.1.0
            </span>
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: theme.accent,
              }}
            />
            <span
              style={{
                fontFamily: theme.fontMono,
                fontSize: 14,
                color: theme.muted,
              }}
            >
              Three.js + GLSL 300 ES
            </span>
          </div>
        </div>
      </div>

      {/* CRT scanline sweep */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: "100%",
          height: 2,
          top: scanY,
          background: `linear-gradient(90deg, transparent, ${theme.accent}18, transparent)`,
          boxShadow: `0 0 30px 10px ${theme.accent}08`,
        }}
      />

      {/* Corner brackets (tech aesthetic) */}
      {[
        { top: 30, left: 30 },
        { top: 30, right: 30 },
        { bottom: 30, left: 30 },
        { bottom: 30, right: 30 },
      ].map((pos, i) => {
        const cornerOpacity = interpolate(
          frame - 60 - i * 4,
          [0, 10],
          [0, 0.3],
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
    </AbsoluteFill>
  );
};

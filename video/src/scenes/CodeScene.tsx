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

const codeLines = [
  { text: "import", rest: " { GlassRipple } ", from: "from 'glass-ripple';", kind: "import" },
  { text: "import", rest: " { claude } ", from: "from 'glass-ripple/icons';", kind: "import" },
  { text: "", rest: "", from: "", kind: "blank" },
  { text: "const", rest: " gr = ", from: "new GlassRipple({", kind: "decl" },
  { text: "  canvas:", rest: " document.getElementById", from: "('canvas'),", kind: "prop" },
  { text: "  icon:", rest: " claude", from: ".icon,", kind: "prop" },
  { text: "  wave:", rest: " { damping: 0.8,", from: " speed: 1.0 },", kind: "prop" },
  { text: "  effects:", rest: " {", from: "", kind: "prop" },
  { text: "    halftone:", rest: " [{ mix: 0.29 },", from: " { mix: 0.38 }],", kind: "nested" },
  { text: "    chromab:", rest: " { amount:", from: " 0.2 },", kind: "nested" },
  { text: "    retroScreen:", rest: " { cellScale:", from: " 0.028 },", kind: "nested" },
  { text: "  },", rest: "", from: "", kind: "close" },
  { text: "});", rest: "", from: "", kind: "close" },
];

const syntaxColor = (kind: string, part: "keyword" | "rest" | "from") => {
  if (part === "keyword") {
    if (kind === "import") return "#c792ea";
    if (kind === "decl") return "#c792ea";
    return theme.accent;
  }
  if (part === "from") return "#98c379";
  return "#abb2bf";
};

export const CodeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Window chrome
  const windowScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 60,
          opacity: headerOpacity,
          display: "flex",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <h2
          style={{
            fontFamily: theme.fontSans,
            fontSize: 38,
            fontWeight: 700,
            color: theme.white,
            margin: 0,
          }}
        >
          Quick Start
        </h2>
        <span
          style={{
            fontFamily: theme.fontMono,
            fontSize: 16,
            color: theme.muted,
          }}
        >
          3 lines to launch
        </span>
      </div>

      {/* Code editor window */}
      <div
        style={{
          width: 900,
          transform: `scale(${windowScale})`,
          marginTop: 40,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: "#1a1a2e",
            borderRadius: "12px 12px 0 0",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
          <span
            style={{
              fontFamily: theme.fontMono,
              fontSize: 12,
              color: theme.muted,
              marginLeft: 12,
            }}
          >
            main.ts
          </span>
        </div>

        {/* Code body */}
        <div
          style={{
            background: "#0d1117",
            borderRadius: "0 0 12px 12px",
            padding: "20px 24px",
            border: "1px solid #1a1a2e",
            borderTop: "none",
          }}
        >
          {codeLines.map((line, i) => {
            const lineDelay = 12 + i * 4;
            const lineOpacity = interpolate(
              frame - lineDelay,
              [0, 6],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const lineX = interpolate(
              frame - lineDelay,
              [0, 6],
              [8, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );

            // Cursor blink on last revealed line
            const isLastRevealed =
              frame >= lineDelay && (i === codeLines.length - 1 || frame < 12 + (i + 1) * 4);
            const cursorOpacity = isLastRevealed ? (Math.sin(frame * 0.3) > 0 ? 0.8 : 0) : 0;

            if (line.kind === "blank") {
              return (
                <div key={i} style={{ height: 24, opacity: lineOpacity }} />
              );
            }

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 28,
                  opacity: lineOpacity,
                  transform: `translateX(${lineX}px)`,
                  fontFamily: theme.fontMono,
                  fontSize: 15,
                  lineHeight: "28px",
                }}
              >
                {/* Line number */}
                <span
                  style={{
                    width: 32,
                    color: "#444",
                    textAlign: "right",
                    marginRight: 16,
                    fontSize: 12,
                    flexShrink: 0,
                    userSelect: "none",
                  }}
                >
                  {i + 1}
                </span>

                <span style={{ color: syntaxColor(line.kind, "keyword") }}>
                  {line.text}
                </span>
                <span style={{ color: syntaxColor(line.kind, "rest") }}>
                  {line.rest}
                </span>
                <span style={{ color: syntaxColor(line.kind, "from") }}>
                  {line.from}
                </span>

                {/* Blinking cursor */}
                {cursorOpacity > 0 && (
                  <span
                    style={{
                      width: 2,
                      height: 18,
                      background: theme.accent,
                      opacity: cursorOpacity,
                      marginLeft: 2,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Install hint */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          opacity: interpolate(frame, [80, 95], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: theme.fontMono,
            fontSize: 16,
            color: theme.muted,
          }}
        >
          $
        </span>
        <span
          style={{
            fontFamily: theme.fontMono,
            fontSize: 16,
            color: theme.accent,
          }}
        >
          npm install glass-ripple three
        </span>
      </div>
    </AbsoluteFill>
  );
};

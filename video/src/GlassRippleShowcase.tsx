import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { IntroScene } from "./scenes/IntroScene";
import { PipelineScene } from "./scenes/PipelineScene";
import { CodeScene } from "./scenes/CodeScene";
import { IconsScene } from "./scenes/IconsScene";
import { OutroScene } from "./scenes/OutroScene";
import { theme } from "./lib/theme";

export const GlassRippleShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle noise grain overlay opacity
  const grainOpacity = 0.03;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <TransitionSeries>
        {/* Scene 1: Intro — brand reveal with ripple rings */}
        <TransitionSeries.Sequence durationInFrames={110}>
          <IntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 18 })}
        />

        {/* Scene 2: Shader Pipeline — 11-pass visualization */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <PipelineScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 3: Quick Start Code */}
        <TransitionSeries.Sequence durationInFrames={115}>
          <CodeScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 18 })}
        />

        {/* Scene 4: Icon Presets Grid */}
        <TransitionSeries.Sequence durationInFrames={115}>
          <IconsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* Scene 5: Outro — CTA with features */}
        <TransitionSeries.Sequence durationInFrames={110}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Global CRT scanline overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          )`,
          pointerEvents: "none",
        }}
      />

      {/* Subtle vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

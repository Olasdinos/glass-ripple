import React from "react";
import { Composition } from "remotion";
import { GlassRippleShowcase } from "./GlassRippleShowcase";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="GlassRippleShowcase"
        component={GlassRippleShowcase}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};

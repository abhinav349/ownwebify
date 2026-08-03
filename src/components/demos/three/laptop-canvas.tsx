"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { MotionValue } from "motion/react";
import { useTheme } from "next-themes";
import { SceneLaptop } from "@/components/demos/three/scene-laptop";
import type { SiteMock } from "@/components/demos/three/site-screen-texture";
import type { DeviceTier } from "@/hooks/use-device-tier";

type LaptopCanvasProps = {
  sites: SiteMock[];
  scrollProgress?: MotionValue<number>;
  deviceTier: DeviceTier;
  /** False while the section is well outside the viewport — freezes the loop. */
  active: boolean;
  /** Fired on the first frame that reaches the screen. */
  onReady?: () => void;
};

export default function LaptopCanvas({
  sites,
  scrollProgress,
  deviceTier,
  active,
  onReady,
}: LaptopCanvasProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Anodised aluminium: silver against a light page, graphite against a dark
  // one. Both stay desaturated — the brand colour belongs in the light rig and
  // on the screen, not smeared over the chassis.
  const body = isDark ? "#8f939c" : "#c3c6ce";
  // What unlit faces reflect, so it sets the chassis' base tone. As with the
  // hero crystal, dark mode needs this far brighter than it looks like it
  // should, or the laptop renders as a hole in the page.
  const shell = isDark ? "#514b74" : "#eceaf6";
  const accent = isDark ? "#8b5cf6" : "#a78bfa";
  const cyan = isDark ? "#22d3ee" : "#38bdf8";
  const shadowColor = isDark ? "#000000" : "#4c1d95";
  const highQuality = deviceTier === "high";

  return (
    <Canvas
      // `never` rather than unmounting: tearing down the WebGL context on every
      // pass would re-upload the deck and screen textures each time the section
      // comes back into view.
      frameloop={active ? "always" : "never"}
      dpr={[1, highQuality ? 1.6 : 1]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      camera={{ position: [0, 0.95, 5.4], fov: 34, near: 0.1, far: 60 }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <SceneLaptop
          sites={sites}
          body={body}
          accent={accent}
          cyan={cyan}
          shell={shell}
          shadowColor={shadowColor}
          scrollProgress={scrollProgress}
          highQuality={highQuality}
          onReady={onReady}
        />
        {highQuality && (
          <EffectComposer>
            {/* Threshold sits above the chassis highlights on purpose: the only
                thing that should bloom is the lit panel. */}
            <Bloom
              luminanceThreshold={0.62}
              luminanceSmoothing={0.85}
              intensity={isDark ? 0.85 : 0.45}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}

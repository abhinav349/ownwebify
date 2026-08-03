"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { MotionValue } from "motion/react";
import { useTheme } from "next-themes";
import { SceneHeroCrystal } from "@/components/demos/three/scene-hero-crystal";
import { SceneParticles } from "@/components/demos/three/scene-particles";
import type { DeviceTier } from "@/hooks/use-device-tier";

type HeroCrystalCanvasProps = {
  scrollProgress?: MotionValue<number>;
  deviceTier: DeviceTier;
};

export default function HeroCrystalCanvas({ scrollProgress, deviceTier }: HeroCrystalCanvasProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  // On metal, `color` tints every reflection, so it stays desaturated — the
  // brand hues live in the light rig, where they read as coloured highlights
  // rather than flattening the whole surface to one shade.
  const color = isDark ? "#e4dcff" : "#cfc6ee";
  const accent = isDark ? "#8b5cf6" : "#a78bfa";
  const cyan = isDark ? "#22d3ee" : "#38bdf8";
  // Brightness of the enclosing shell: this is what unlit facets reflect, so
  // it sets the object's base tone. Dark mode needs it higher than instinct
  // suggests — against a near-black page a dim shell renders a silhouette.
  const shell = isDark ? "#5b51a8" : "#a9a1dd";
  const envIntensity = isDark ? 2.6 : 2.1;
  const highQuality = deviceTier === "high";

  return (
    <Canvas
      dpr={[1, highQuality ? 1.75 : 1]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      camera={{ position: [0, 0.3, 5], fov: 42, near: 0.1, far: 60 }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <SceneParticles
          color={isDark ? "#22d3ee" : "#93c5fd"}
          count={highQuality ? 900 : 350}
          scrollProgress={scrollProgress}
        />
        <SceneHeroCrystal
          color={color}
          accent={accent}
          cyan={cyan}
          shell={shell}
          envIntensity={envIntensity}
          scrollProgress={scrollProgress}
          highQuality={highQuality}
        />
        {highQuality && (
          <EffectComposer>
            <Bloom
              luminanceThreshold={isDark ? 0.5 : 0.75}
              luminanceSmoothing={0.9}
              intensity={isDark ? 1 : 0.5}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}

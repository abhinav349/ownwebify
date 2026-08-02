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
  const color = isDark ? "#a78bfa" : "#6d28d9";
  const envPreset = isDark ? "night" : "sunset";
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
          envPreset={envPreset}
          scrollProgress={scrollProgress}
          highQuality={highQuality}
        />
        {highQuality && (
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              intensity={0.6}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}

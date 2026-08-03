"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { MotionValue } from "motion/react";
import { useTheme } from "next-themes";
import { SceneParticles } from "@/components/demos/three/scene-particles";
import type { DeviceTier } from "@/hooks/use-device-tier";

type HeroParticlesCanvasProps = {
  scrollProgress?: MotionValue<number>;
  deviceTier: DeviceTier;
  /** False once the hero has scrolled away — freezes the render loop. */
  active?: boolean;
};

/**
 * Ambient particle drift behind the hero copy.
 *
 * This canvas used to also carry a faceted iridescent gem. It was removed:
 * positioned off to the right in world space, it crowded the headline at
 * common viewport widths and pulled the eye away from the words it was meant
 * to frame. What remains is atmosphere that stays behind the text instead of
 * competing with it.
 */
export default function HeroParticlesCanvas({
  scrollProgress,
  deviceTier,
  active = true,
}: HeroParticlesCanvasProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const highQuality = deviceTier === "high";

  return (
    <Canvas
      // The hero is one viewport tall, so without this the field kept drawing
      // at 60fps behind eight sections of content that hide it completely —
      // burning battery and competing for the main thread exactly when the
      // work section's laptop scene is trying to initialise.
      frameloop={active ? "always" : "never"}
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
        {highQuality && (
          <EffectComposer>
            {/* Threshold sits above the page background but below a lit
                particle, so only the points themselves pick up a halo. */}
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

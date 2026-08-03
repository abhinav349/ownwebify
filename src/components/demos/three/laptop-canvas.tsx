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
  // Dark mode runs a genuine graphite rather than a light grey: against a
  // near-black page the old value read as a pale slab floating in the void.
  const body = isDark ? "#6e727b" : "#c0c3cb";
  // The environment gradient the chassis reflects: bright above falling to a
  // darker floor. This is what gives the metal its top-to-bottom falloff, so
  // it has to be a ramp rather than one tone. Dark mode still needs the whole
  // ramp lifted well above the page colour — a shell near black renders the
  // laptop as a hole rather than an object.
  const shellTop = isDark ? "#8b83bd" : "#ffffff";
  const shellMid = isDark ? "#4a4468" : "#e7e5f1";
  const shellBottom = isDark ? "#1b1926" : "#a9a6bd";
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
          shellTop={shellTop}
          shellMid={shellMid}
          shellBottom={shellBottom}
          shadowColor={shadowColor}
          scrollProgress={scrollProgress}
          highQuality={highQuality}
          onReady={onReady}
        />
        {highQuality && (
          <EffectComposer>
            {/* Raised from 0.62. At that level the rig's specular streaks on
                the chassis edges crossed the threshold too, wrapping the lid
                and the front lip in a glowing outline that read as neon strip
                lighting. Only the lit panel should bloom. */}
            <Bloom
              luminanceThreshold={0.9}
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

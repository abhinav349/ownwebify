"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { SceneParticles } from "@/components/demos/three/scene-particles";
import { SceneOrb } from "@/components/demos/three/scene-orb";

type HeroCanvasProps = {
  variant?: "particles" | "orb";
  color?: string;
  scrollProgress?: MotionValue<number>;
};

export default function HeroCanvas({
  variant = "particles",
  color,
  scrollProgress,
}: HeroCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.3, 5], fov: 42, near: 0.1, far: 60 }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        {variant === "orb" ? (
          <SceneOrb color={color} />
        ) : (
          <SceneParticles color={color} scrollProgress={scrollProgress} />
        )}
      </Suspense>
    </Canvas>
  );
}

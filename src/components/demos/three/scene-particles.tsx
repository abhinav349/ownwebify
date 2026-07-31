"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import type { Points as PointsImpl } from "three";
import type { MotionValue } from "motion/react";

/** Deterministic pseudo-random in [0, 1) — avoids calling Math.random during render. */
function hashRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function useScrollValue(mv?: MotionValue<number>) {
  const ref = useRef(0);
  useFrame(() => {
    if (mv) ref.current = mv.get();
  });
  return ref;
}

export function SceneParticles({
  color = "#c9af66",
  count = 1400,
  scrollProgress,
}: {
  color?: string;
  count?: number;
  scrollProgress?: MotionValue<number>;
}) {
  const pointsRef = useRef<PointsImpl>(null);
  const { viewport, pointer } = useThree();
  const scroll = useScrollValue(scrollProgress);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.2 + hashRandom(i * 3 + 1) * 2.4;
      const theta = hashRandom(i * 3 + 2) * Math.PI * 2;
      const phi = Math.acos(hashRandom(i * 3 + 3) * 2 - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
      arr[i * 3 + 2] = radius * Math.cos(phi) * 0.5 - 1;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.035;
    pointsRef.current.rotation.x = pointer.y * 0.08;
    pointsRef.current.position.y = -scroll.current * 1.4;
    pointsRef.current.position.x = pointer.x * (viewport.width * 0.01);
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.028}
        sizeAttenuation
        depthWrite={false}
        opacity={0.75}
      />
    </Points>
  );
}

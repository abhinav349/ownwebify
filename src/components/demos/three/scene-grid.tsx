"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid, Float } from "@react-three/drei";
import type { Group } from "three";
import { hashRandom } from "@/components/demos/three/utils";

/** A tilted, drifting blueprint/terrain grid — reads as architectural precision. */
export function SceneGrid({ color = "#7c8b9a" }: { color?: string }) {
  const groupRef = useRef<Group>(null);

  const markers = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      x: (hashRandom(i * 2 + 1) - 0.5) * 6,
      z: (hashRandom(i * 2 + 2) - 0.5) * 6,
      y: hashRandom(i * 2 + 3) * 1.2,
    }));
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.03;
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 3]} intensity={1} color={color} />
      <group ref={groupRef} rotation={[-0.3, 0, 0]} position={[0, -0.8, -1.5]}>
        <Grid
          args={[12, 12]}
          cellColor={color}
          sectionColor={color}
          cellSize={0.5}
          cellThickness={0.6}
          sectionSize={2}
          sectionThickness={1}
          fadeDistance={9}
          fadeStrength={1.5}
          infiniteGrid
          followCamera={false}
          position={[0, 0, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        {markers.map((m, i) => (
          <Float key={i} speed={1.2} floatIntensity={0.6} rotationIntensity={0.3}>
            <mesh position={[m.x, m.y, m.z]}>
              <ringGeometry args={[0.12, 0.16, 24]} />
              <meshBasicMaterial color={color} transparent opacity={0.6} />
            </mesh>
          </Float>
        ))}
      </group>
    </>
  );
}

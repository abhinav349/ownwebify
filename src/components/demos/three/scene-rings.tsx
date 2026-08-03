"use client";

import { useMemo } from "react";
import { Float, Environment, Lightformer } from "@react-three/drei";
import { hashRandom } from "@/components/demos/three/utils";

/** A small cluster of independently drifting rings — aperture / floating-object motif. */
export function SceneRings({
  color = "#d8d8d8",
  count = 5,
}: {
  color?: string;
  count?: number;
}) {
  // Pushed well behind the camera plane and kept thin/translucent: these sit
  // directly behind hero headlines, so they have to read as atmosphere rather
  // than compete with the text for contrast.
  const rings = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      radius: 0.6 + hashRandom(i * 5 + 1) * 0.9,
      x: (hashRandom(i * 5 + 2) - 0.5) * 5.5,
      y: (hashRandom(i * 5 + 3) - 0.5) * 3,
      z: -4 - hashRandom(i * 5 + 4) * 3,
      rotX: hashRandom(i * 5 + 5) * Math.PI,
      speed: 0.6 + hashRandom(i * 5 + 1) * 0.8,
    }));
  }, [count]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={0.9} />
      {/* Local Lightformer rig rather than `preset="studio"` — see the note
          in scene-orb: presets pull an HDRI from raw.githack.com at runtime.
          These rings sit behind headlines as atmosphere, so a soft two-sided
          wash is all the reflection detail the preset was contributing. */}
      <Environment resolution={128}>
        <Lightformer
          form="rect"
          intensity={1.8}
          position={[0, 4, 4]}
          scale={[10, 6, 1]}
          color="#ffffff"
          rotation={[-Math.PI / 6, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          position={[-5, -1, 2]}
          scale={[6, 6, 1]}
          color="#ffffff"
          rotation={[0, Math.PI / 3, 0]}
        />
      </Environment>
      {rings.map((r, i) => (
        <Float key={i} speed={r.speed} floatIntensity={1} rotationIntensity={0.8}>
          <mesh position={[r.x, r.y, r.z]} rotation={[r.rotX, r.rotX * 0.5, 0]}>
            <torusGeometry args={[r.radius, r.radius * 0.03, 12, 48]} />
            <meshStandardMaterial
              color={color}
              roughness={0.35}
              metalness={0.6}
              transparent
              opacity={0.45}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

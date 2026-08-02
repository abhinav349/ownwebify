"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Environment } from "@react-three/drei";
import type { Mesh } from "three";
import type { MotionValue } from "motion/react";

function useScrollValue(mv?: MotionValue<number>) {
  const ref = useRef(0);
  useFrame(() => {
    if (mv) ref.current = mv.get();
  });
  return ref;
}

export function SceneHeroCrystal({
  color = "#a78bfa",
  envPreset = "city",
  scrollProgress,
  highQuality = true,
}: {
  color?: string;
  envPreset?: "city" | "sunset" | "night" | "dawn";
  scrollProgress?: MotionValue<number>;
  highQuality?: boolean;
}) {
  const meshRef = useRef<Mesh>(null);
  const groupPointer = useThree((s) => s.pointer);
  const scroll = useScrollValue(scrollProgress);

  const baseScale = 0.8;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.18;
    meshRef.current.rotation.x = groupPointer.y * 0.25;
    meshRef.current.rotation.z = groupPointer.x * -0.12;
    meshRef.current.position.y = 0.1 - scroll.current * 1.6;
    meshRef.current.scale.setScalar(baseScale - scroll.current * 0.3);
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={2} color={color} />
      <directionalLight position={[-4, -2, -3]} intensity={0.8} color="#22d3ee" />
      <Environment preset={envPreset} environmentIntensity={0.6} />

      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1.1}>
        <mesh ref={meshRef} position={[2.6, 0.1, -0.8]} scale={baseScale}>
          <icosahedronGeometry args={[1, highQuality ? 4 : 1]} />
          <MeshTransmissionMaterial
            color={color}
            thickness={0.4}
            roughness={0.18}
            transmission={0.96}
            ior={1.3}
            chromaticAberration={highQuality ? 0.06 : 0}
            anisotropy={0.2}
            distortion={0.2}
            distortionScale={0.35}
            temporalDistortion={0.1}
            samples={highQuality ? 6 : 2}
            resolution={highQuality ? 512 : 256}
            backside
          />
        </mesh>
      </Float>
    </>
  );
}

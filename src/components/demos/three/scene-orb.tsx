"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import type { Mesh } from "three";

export function SceneOrb({ color = "#e8e6e1" }: { color?: string }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x += delta * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <Environment preset="city" environmentIntensity={0.35} />
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh ref={meshRef} scale={1.7}>
          <icosahedronGeometry args={[1, 6]} />
          <MeshDistortMaterial
            color={color}
            roughness={0.15}
            metalness={0.6}
            distort={0.32}
            speed={1.6}
          />
        </mesh>
      </Float>
    </>
  );
}

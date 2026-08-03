"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Environment,
  Lightformer,
} from "@react-three/drei";
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
      {/* Built from Lightformers rather than `preset="city"`. A preset makes
          drei fetch a multi-megabyte HDRI from raw.githack.com at runtime,
          which puts a third party on the critical path of a first-party page:
          a blocked or slow fetch throws inside the Canvas and takes the whole
          route to its error boundary. Same idiom as scene-hero-crystal. */}
      <Environment resolution={128}>
        <Lightformer
          form="rect"
          intensity={2.4}
          position={[3, 3, 4]}
          scale={[8, 8, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[-4, 0, 2]}
          scale={[6, 6, 1]}
          color="#c9d4ff"
          rotation={[0, Math.PI / 3, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          position={[0, -4, -3]}
          scale={[8, 5, 1]}
          color="#ffe9c9"
          rotation={[Math.PI / 2, 0, 0]}
        />
      </Environment>
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

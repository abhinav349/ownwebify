"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Mesh, PlaneGeometry } from "three";

/** A flowing, silk-like displaced plane — reads as water/ribbon motion. */
export function SceneWave({
  color = "#e8a87c",
  speed = 0.6,
}: {
  color?: string;
  speed?: number;
}) {
  const meshRef = useRef<Mesh>(null);
  const { pointer } = useThree();
  const elapsed = useRef(0);

  const segments = 64;
  const geometry = useMemo(() => {
    return { width: 9, height: 6, widthSegments: segments, heightSegments: segments };
  }, []);

  useFrame((_, delta) => {
    elapsed.current += delta * speed;
    const mesh = meshRef.current;
    if (!mesh) return;

    const geo = mesh.geometry as PlaneGeometry;
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z =
        Math.sin(x * 0.6 + elapsed.current) * 0.35 +
        Math.cos(y * 0.8 + elapsed.current * 0.7) * 0.25;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    mesh.rotation.z = pointer.x * 0.05;
    mesh.rotation.x = -1.15 + pointer.y * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 4]} intensity={1.2} color={color} />
      <mesh ref={meshRef} position={[0, -0.6, -1]} rotation={[-1.15, 0, 0]}>
        <planeGeometry
          args={[geometry.width, geometry.height, geometry.widthSegments, geometry.heightSegments]}
        />
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.5}
          roughness={0.6}
        />
      </mesh>
    </>
  );
}

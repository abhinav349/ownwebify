"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, Lightformer } from "@react-three/drei";
import { BackSide, type Group, type Mesh } from "three";
import type { MotionValue } from "motion/react";

function useScrollValue(mv?: MotionValue<number>) {
  const ref = useRef(0);
  useFrame(() => {
    if (mv) ref.current = mv.get();
  });
  return ref;
}

/**
 * Studio lighting rig built from shaped emitters rather than a photographic
 * HDRI. A stock environment preset makes a reflective object read as a photo
 * wrapped on a ball — recognisable skies and buildings show straight through
 * it. Hard rectangular strips instead give crisp specular streaks that read as
 * a lit surface, and stay abstract at any angle.
 */
function StudioRig({ accent, cyan, shell }: { accent: string; cyan: string; shell: string }) {
  const rigRef = useRef<Group>(null);

  // Drifting the rig (not the object) keeps highlights travelling across the
  // facets even while the crystal itself turns slowly.
  useFrame((state) => {
    if (rigRef.current) {
      rigRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.4;
    }
  });

  return (
    <Environment resolution={256}>
      {/* An enclosing shell, not a panel. Anything the emitters do not cover
          stays black in the cubemap, and a mirrored surface samples it from
          every direction — so without a full surround the object renders as a
          near-black silhouette regardless of how bright the key light is. */}
      <mesh scale={60}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={shell} side={BackSide} />
      </mesh>
      <group ref={rigRef}>
        {/* Key: narrow, very bright strip. Thin and hot rather than broad and
            soft — a wide gentle source just lifts the whole surface evenly and
            the facets stop reading. */}
        <Lightformer form="rect" intensity={14} position={[1, 4, 3]} scale={[8, 0.6, 1]} color="#ffffff" rotation={[-Math.PI / 4, 0, 0]} />
        {/* Second streak, crossing the first at an angle */}
        <Lightformer form="rect" intensity={9} position={[-3, 1, 3]} scale={[5, 0.4, 1]} color="#ffffff" rotation={[0, Math.PI / 5, Math.PI / 3]} />
        {/* Fill: brand colour washing the left flank */}
        <Lightformer form="rect" intensity={5} position={[-5, 0, 1]} scale={[5, 5, 1]} color={accent} rotation={[0, Math.PI / 3, 0]} />
        {/* Rim: cool accent separating the trailing edge from the page */}
        <Lightformer form="rect" intensity={7} position={[5, -1, -1]} scale={[5, 4, 1]} color={cyan} rotation={[0, -Math.PI / 3, 0]} />
        {/* Kicker: single sharp glint low and right */}
        <Lightformer form="circle" intensity={8} position={[2.5, -3, 2]} scale={1.4} color="#ffffff" />
      </group>
    </Environment>
  );
}

export function SceneHeroCrystal({
  color = "#a78bfa",
  accent = "#7c3aed",
  cyan = "#22d3ee",
  shell = "#ffffff",
  envIntensity = 2.1,
  scrollProgress,
  highQuality = true,
}: {
  color?: string;
  accent?: string;
  cyan?: string;
  shell?: string;
  envIntensity?: number;
  scrollProgress?: MotionValue<number>;
  highQuality?: boolean;
}) {
  const meshRef = useRef<Mesh>(null);
  const pointer = useThree((s) => s.pointer);
  const scroll = useScrollValue(scrollProgress);

  const baseScale = 0.78;

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.rotation.y += delta * 0.22;
    mesh.rotation.x += delta * 0.06;
    // Pointer parallax is applied to position, not rotation, so the facet
    // pattern stays legible instead of shearing as the cursor moves.
    mesh.position.x = 2.35 + pointer.x * 0.18;
    mesh.position.y = -0.35 + pointer.y * 0.14 - scroll.current * 1.6;
    mesh.scale.setScalar(baseScale - scroll.current * 0.25);
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <StudioRig accent={accent} cyan={cyan} shell={shell} />

      <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.9}>
        <mesh ref={meshRef} position={[2.35, -0.35, -0.5]} scale={baseScale}>
          {/* detail 0 = the raw 20 faces. Any subdivision rounds the silhouette
              toward the soap-bubble this replaced; the flat faces are what give
              it distinct edges and a cut-stone read. */}
          <icosahedronGeometry args={[1, 0]} />
          {/* Polished iridescent metal rather than transmissive glass.
              Transmission renders whatever sits behind the mesh, and this
              canvas is transparent so the page gradient shows through — there
              is nothing behind it to refract, which is why glass here came out
              either black or a flat matte wash. Metal reflects the light rig
              instead, so it stays crisp regardless of the page beneath, and
              iridescence supplies the colour shift across facets. */}
          <meshPhysicalMaterial
            color={color}
            metalness={1}
            roughness={0.06}
            envMapIntensity={envIntensity}
            /* Iridescence is a second BRDF layer; it is the most expensive
               part of this material, so lower tiers drop it and keep plain
               polished metal, which still reads correctly. */
            iridescence={highQuality ? 1 : 0}
            iridescenceIOR={1.9}
            iridescenceThicknessRange={[120, 680]}
          />
        </mesh>
      </Float>
    </>
  );
}

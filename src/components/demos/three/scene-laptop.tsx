"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Environment, Lightformer, ContactShadows } from "@react-three/drei";
import {
  BackSide,
  CanvasTexture,
  DoubleSide,
  MathUtils,
  SRGBColorSpace,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type PointLight,
} from "three";
import type { MotionValue } from "motion/react";
import { SiteScreen, type SiteMock } from "@/components/demos/three/site-screen-texture";
import { createDeckTexture } from "@/components/demos/three/laptop-deck-texture";

// ── Geometry ───────────────────────────────────────────────────────────────
const BASE_W = 3.3;
const BASE_D = 2.26;
// Slimmer than before, with a much tighter corner radius. At 0.13 deep and a
// 0.045 radius the front edge rendered as a fat rounded tube with a hard white
// line down it — a plastic bumper rather than a machined chamfer.
const BASE_H = 0.115;
const BASE_R = 0.028;
const LID_W = 3.3;
const LID_H = 2.12;
const LID_T = 0.085;
const LID_R = 0.022;
const SCREEN_W = 3.04;
const SCREEN_H = 1.9; // 16:10, matching the texture
const SCREEN_Y = 1.11; // leaves a 0.06 top bezel and a 0.16 chin
const HINGE_Z = -BASE_D / 2 + 0.05;

/**
 * Lid angles, in radians about the hinge. Local +y runs up the lid, so 0 is
 * straight up, +π/2 is folded forward onto the base and negative leans back.
 */
const CLOSED = Math.PI / 2 - 0.016;
const OPEN = -0.3;

/**
 * Vertical gradient for the environment shell.
 *
 * A flat single-colour shell is what made the chassis read as matte plastic:
 * a metal surface samples the environment from every direction, so if every
 * direction returns the same value the surface returns one flat tone no matter
 * how it curves. A bright top falling to a darker floor is the minimum a
 * reflective material needs in order to show its own shape.
 */
function createShellTexture(top: string, mid: string, bottom: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, top);
  g.addColorStop(0.52, mid);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 8, 256);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/**
 * Baked glass sheen: a soft highlight falling from the top-left corner.
 *
 * Deliberately painted rather than reflected. A real reflective layer over the
 * panel mirrored the rig's key light as a hard white dot in the middle of the
 * screen — at the roughness that makes glass look like glass, a small bright
 * emitter stays a small bright dot, and it landed straight over the site being
 * shown. A baked ramp gives the same "there is glass in front of this" read
 * with no hotspot and nothing that moves as the lid rotates.
 */
function createGlassSheen() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 130, 105);
  g.addColorStop(0, "rgba(255,255,255,0.34)");
  g.addColorStop(0.22, "rgba(255,255,255,0.07)");
  g.addColorStop(0.45, "rgba(255,255,255,0.01)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 160);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Maps progress through the pinned track to how far the lid is open.
 *
 * Rises to fully open, holds, then falls back to shut, so the open *and* the
 * close are both scrubbed by the user rather than played on a timer. Both edges
 * sit inside the pinned range on purpose: if the close ran while the section
 * was already leaving the viewport, it would happen off-screen and the lid
 * would just be mysteriously shut on the way back up. The flat middle is
 * deliberately wide — the lid should be still while the screen is being read.
 */
function openness(p: number) {
  return smoothstep(0.06, 0.34, p) * (1 - smoothstep(0.7, 0.96, p));
}

function CameraRig() {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    // Framed slightly from above, the way a laptop sits on a desk in front of
    // you. Without this the default camera stares level at the hinge.
    camera.lookAt(0, 0.36, 0);
  }, [camera]);
  return null;
}

/**
 * Compact studio rig: a full enclosing shell, because brushed aluminium
 * samples the environment from every direction and renders as a silhouette
 * against anything it doesn't cover. Emitters shaped as hard strips rather
 * than a photographic HDRI — a stock preset makes a reflective surface read as
 * a photo wrapped round it, with recognisable sky and buildings showing
 * through. The two strips are what draw the specular highlight down the lid.
 */
function LaptopRig({
  accent,
  cyan,
  shellTop,
  shellMid,
  shellBottom,
}: {
  accent: string;
  cyan: string;
  shellTop: string;
  shellMid: string;
  shellBottom: string;
}) {
  const shellTexture = useMemo(
    () => createShellTexture(shellTop, shellMid, shellBottom),
    [shellTop, shellMid, shellBottom]
  );
  useEffect(() => () => shellTexture.dispose(), [shellTexture]);

  return (
    // 128. This cubemap is rendered before the first frame can be presented,
    // and its only job is to supply broad specular streaks across brushed
    // aluminium — a roughness-0.3 surface blurs the reflection anyway, so
    // there is no fine detail to preserve and the pixels above this only sat
    // on the critical path.
    <Environment resolution={128}>
      <mesh scale={50}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial map={shellTexture} side={BackSide} />
      </mesh>
      {/* Key: a long strip above and in front, angled down across the lid. */}
      <Lightformer
        form="rect"
        intensity={6}
        position={[0.5, 5, 4]}
        // Narrower than the chassis on purpose. A strip wider than the object
        // lit the whole front chamfer to an identical value, producing a hard
        // uniform white bar across the full width that read as a neon tube.
        // Narrower gives the same chamfer glint but with falloff at the ends.
        scale={[5.5, 0.7, 1]}
        color="#ffffff"
        rotation={[-Math.PI / 3.4, 0, 0]}
      />
      {/* Broad soft top light. Without something wide and gentle above it, the
          chassis only ever caught the narrow key streak and read as one flat
          tone either side of it. */}
      <Lightformer
        form="rect"
        intensity={2.2}
        position={[0, 6, -1]}
        scale={[9, 6, 1]}
        color="#ffffff"
        rotation={[-Math.PI / 2, 0, 0]}
      />
      {/* Brand fill on the left flank, and a cool rim on the right. Both are
          far weaker than they were: at their old intensities they wrapped the
          chassis edges in saturated violet and cyan that read as gaming RGB
          lighting rather than as a lit metal object. */}
      <Lightformer
        form="rect"
        intensity={1.9}
        position={[-5, 1, 2]}
        scale={[5, 5, 1]}
        color={accent}
        rotation={[0, Math.PI / 3, 0]}
      />
      <Lightformer
        form="rect"
        intensity={2.1}
        position={[5, 0.5, -1]}
        scale={[5, 4, 1]}
        color={cyan}
        rotation={[0, -Math.PI / 3, 0]}
      />
    </Environment>
  );
}

export function SceneLaptop({
  sites,
  body = "#b7bac2",
  accent = "#7c3aed",
  cyan = "#22d3ee",
  shellTop = "#ffffff",
  shellMid = "#e9e7f2",
  shellBottom = "#b4b1c4",
  shadowColor = "#1a1030",
  scrollProgress,
  highQuality = true,
  onReady,
}: {
  sites: SiteMock[];
  body?: string;
  accent?: string;
  cyan?: string;
  shellTop?: string;
  shellMid?: string;
  shellBottom?: string;
  shadowColor?: string;
  scrollProgress?: MotionValue<number>;
  highQuality?: boolean;
  /** Fired once, on the first frame that actually reaches the screen. */
  onReady?: () => void;
}) {
  const rootRef = useRef<Group>(null);
  const lidRef = useRef<Group>(null);
  const screenRef = useRef<Mesh>(null);
  const glowRef = useRef<PointLight>(null);
  const pointer = useThree((s) => s.pointer);

  const screen = useMemo(() => new SiteScreen(sites), [sites]);
  const deck = useMemo(() => createDeckTexture(body), [body]);
  const sheen = useMemo(() => createGlassSheen(), []);
  const firstFrame = useRef(false);

  useEffect(() => () => screen.dispose(), [screen]);
  useEffect(() => () => deck.dispose(), [deck]);
  useEffect(() => () => sheen.dispose(), [sheen]);

  useFrame((state, delta) => {
    if (!firstFrame.current) {
      firstFrame.current = true;
      onReady?.();
    }
    // Guard against a long tab-switch or a stalled main thread handing us a
    // huge delta, which would otherwise skip the crossfade in one step.
    const dt = Math.min(delta, 1 / 20);
    const progress = scrollProgress?.get() ?? 0;
    const open = openness(progress);

    if (lidRef.current) {
      lidRef.current.rotation.x = MathUtils.lerp(CLOSED, OPEN, open);
    }

    if (rootRef.current) {
      const t = state.clock.elapsedTime;
      rootRef.current.rotation.y =
        pointer.x * 0.24 + Math.sin(t * 0.24) * 0.05;
      rootRef.current.rotation.x = -pointer.y * 0.06;
      rootRef.current.position.y = -0.42 + Math.sin(t * 0.5) * 0.015;
    }

    // The panel wakes a beat after the lid cracks open, so it reads as booting
    // rather than as having been on the whole time behind a shut lid. Starting
    // this any later leaves a fully-open laptop showing a dead black screen,
    // which looks like a failed texture rather than a deliberate beat.
    const lit = smoothstep(0.25, 0.65, open);
    if (screenRef.current) {
      (screenRef.current.material as MeshBasicMaterial).color.setScalar(lit);
    }
    if (glowRef.current) {
      glowRef.current.intensity = lit * 1.6;
    }

    screen.update(dt, lit > 0.85);
  });

  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.45} />
      <LaptopRig
        accent={accent}
        cyan={cyan}
        shellTop={shellTop}
        shellMid={shellMid}
        shellBottom={shellBottom}
      />

      <group ref={rootRef} position={[0, -0.42, 0]}>
        {/* ── Base ── */}
        <RoundedBox args={[BASE_W, BASE_H, BASE_D]} radius={BASE_R} smoothness={4}>
          {/* Roughness down from 0.34: anodised aluminium holds a tighter
              specular than this had, and a broader lobe smeared the rig's
              streaks into the flat wash that read as plastic. */}
          <meshStandardMaterial color={body} metalness={0.95} roughness={0.31} envMapIntensity={1.2} />
        </RoundedBox>

        {/* Deck sits a hair above the base's top face rather than on it, so it
            can't z-fight with the rounded box's flat top. The tighter corner
            radius lets it run closer to the edge, which narrows the bare metal
            border that used to frame the whole deck. */}
        <mesh position={[0, BASE_H / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[BASE_W - 0.07, BASE_D - 0.07]} />
          <meshStandardMaterial map={deck} metalness={0.35} roughness={0.5} envMapIntensity={0.45} />
        </mesh>

        {/* Hinge barrel. The lid previously grew straight out of the deck with
            no join at all, which is the kind of missing cue that reads as
            "cheap 3D" without being consciously noticed. */}
        <mesh
          position={[0, BASE_H / 2 - 0.012, HINGE_Z]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.042, 0.042, BASE_W - 0.46, 16]} />
          <meshStandardMaterial color="#16161c" metalness={0.8} roughness={0.42} />
        </mesh>

        {/* ── Lid ── */}
        <group ref={lidRef} position={[0, BASE_H / 2, HINGE_Z]} rotation={[CLOSED, 0, 0]}>
          <RoundedBox
            args={[LID_W, LID_H, LID_T]}
            radius={LID_R}
            smoothness={4}
            position={[0, LID_H / 2, -LID_T / 2]}
          >
            <meshStandardMaterial color={body} metalness={0.95} roughness={0.31} envMapIntensity={1.2} />
          </RoundedBox>

          {/* Glass panel across the whole lid face — the bezel is this showing
              around the edges of the image, not separate geometry. */}
          <mesh position={[0, LID_H / 2, 0.004]}>
            <planeGeometry args={[LID_W - 0.05, LID_H - 0.05]} />
            <meshStandardMaterial color="#08080b" metalness={0.4} roughness={0.18} envMapIntensity={0.5} />
          </mesh>

          <mesh ref={screenRef} position={[0, SCREEN_Y, 0.007]}>
            <planeGeometry args={[SCREEN_W, SCREEN_H]} />
            {/* Basic + untonemapped: a display emits, so it must not be shaded
                by the rig or rolled off by tone mapping. `color` is the
                brightness envelope the frame loop drives. */}
            <meshBasicMaterial
              map={screen.texture}
              toneMapped={false}
              color="#000000"
              side={DoubleSide}
            />
          </mesh>

          {/* Glass over the panel. Without something here the screen reads as
              a printed sticker: a lit display sits behind glass, and the tell
              is that the glass keeps catching the room even where the image is
              black. `depthWrite` off so it composites over the panel rather
              than occluding it. */}
          <mesh position={[0, LID_H / 2, 0.0105]}>
            <planeGeometry args={[LID_W - 0.05, LID_H - 0.05]} />
            <meshBasicMaterial
              map={sheen}
              transparent
              // Low: the site on the panel is the point of the whole object,
              // and at 0.5 this hazed over the top-left third of it.
              opacity={0.16}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          {/* Webcam */}
          <mesh position={[0, LID_H - 0.032, 0.006]}>
            <circleGeometry args={[0.018, 16]} />
            <meshStandardMaterial color="#15151a" roughness={0.25} metalness={0.6} />
          </mesh>

          {/* Screen spill onto the deck. Sits in front of the panel and rides
              with the lid, so the light swings down as it closes. Held well off
              the glass with a long falloff — closer in, the inverse-square term
              burns a hard hotspot into the trackpad instead of a soft wash. */}
          <pointLight ref={glowRef} position={[0, SCREEN_Y, 0.8]} intensity={0} distance={6} color="#cddcff" />
        </group>
      </group>

      {highQuality && (
        <ContactShadows
          position={[0, -0.52, 0]}
          scale={9}
          blur={2.8}
          opacity={0.5}
          far={2.5}
          // A heavily blurred contact shadow: 256 is upsampled past the point
          // the blur radius makes the difference recoverable.
          resolution={256}
          color={shadowColor}
        />
      )}
    </>
  );
}

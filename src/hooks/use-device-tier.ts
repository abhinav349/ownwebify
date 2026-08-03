"use client";

import { useSyncExternalStore } from "react";
import { usePrefersReducedMotion, useHoverCapable } from "@/hooks/use-reduced-motion";

export type DeviceTier = "high" | "low" | "reduced";

function subscribe() {
  return () => {};
}

function getCoresOkSnapshot() {
  return (navigator.hardwareConcurrency ?? 4) >= 6;
}

function getServerSnapshot() {
  return false;
}

/**
 * Renderer strings reported when WebGL is running on the CPU — no GPU, a
 * blocklisted driver, or a VM. SwiftShader is Chrome's fallback, llvmpipe and
 * softpipe are Mesa's.
 */
const SOFTWARE_RENDERERS = /swiftshader|llvmpipe|softpipe|basic render|generic renderer/i;

let gpuProbe: boolean | null = null;

/**
 * True when WebGL would be rasterised on the CPU.
 *
 * Worth the one-off context creation because the difference is not a matter of
 * degree: measured on this project's home page, first render of the laptop
 * scene took 455ms on a real GPU and 3,639ms under SwiftShader, with 3.9s of
 * blocking main-thread work behind it. No quality knob recovers that — the
 * only correct answer is not to run the scene at all.
 *
 * The result is cached: the probe allocates a real WebGL context, and browsers
 * cap how many can exist at once, so re-probing per component risks evicting a
 * live canvas' context.
 */
function isSoftwareRenderer(): boolean {
  if (gpuProbe !== null) return gpuProbe;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      (canvas.getContext("webgl") as WebGLRenderingContext | null);
    if (!gl) {
      gpuProbe = true;
      return gpuProbe;
    }
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info
      ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
      : "";
    gpuProbe = SOFTWARE_RENDERERS.test(renderer);
    // Release the probe context rather than waiting for GC.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    // A thrown probe means WebGL is unavailable or blocked; treat as software
    // so the caller falls back rather than mounting a canvas that cannot draw.
    gpuProbe = true;
  }
  return gpuProbe;
}

function getGpuOkSnapshot() {
  return !isSoftwareRenderer();
}

/**
 * Coarse perf tier for gating expensive visuals (postprocessing/bloom, particle
 * counts, the loading sequence). Defaults to "low" during SSR/first paint so
 * nothing heavy flashes in before we know the real device capability.
 *
 * "reduced" means "do not run WebGL here at all", which covers both a stated
 * motion preference and a machine that would rasterise it on the CPU.
 */
export function useDeviceTier(): DeviceTier {
  const reducedMotion = usePrefersReducedMotion();
  const hoverCapable = useHoverCapable();
  const coresOk = useSyncExternalStore(subscribe, getCoresOkSnapshot, getServerSnapshot);
  const gpuOk = useSyncExternalStore(subscribe, getGpuOkSnapshot, getServerSnapshot);

  if (reducedMotion || !gpuOk) return "reduced";
  if (hoverCapable && coresOk) return "high";
  return "low";
}

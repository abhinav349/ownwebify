"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useHoverCapable, usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, [data-cursor="link"]';

/** Desktop-only custom cursor. `accent` should be a CSS color (hex/rgb/oklch). */
export function DemoCursor({ accent = "#ffffff" }: { accent?: string }) {
  const hoverCapable = useHoverCapable();
  const reducedMotion = usePrefersReducedMotion();
  // A spring-lerped element chasing the pointer is exactly the kind of
  // incidental motion prefers-reduced-motion is meant to suppress.
  const enabled = hoverCapable && !reducedMotion;
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 28, stiffness: 320, mass: 0.4 });
  const springY = useSpring(y, { damping: 28, stiffness: 320, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsVisible(true);
    };

    const handleOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(Boolean(target.closest(INTERACTIVE_SELECTOR)));
    };

    const handleLeave = () => setIsVisible(false);

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerover", handleOver, { passive: true });
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[80] mix-blend-difference"
      style={{ x: springX, y: springY, opacity: isVisible ? 1 : 0 }}
    >
      <motion.div
        className="rounded-full border bg-transparent"
        style={{ borderColor: accent }}
        animate={{
          width: isHovering ? 56 : 18,
          height: isHovering ? 56 : 18,
          x: isHovering ? -28 : -9,
          y: isHovering ? -28 : -9,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}

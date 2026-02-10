"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
}: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, target, {
        duration,
        ease: "easeOut",
        onUpdate: (v) => setDisplayValue(Math.floor(v)),
      });
      return controls.stop;
    }
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue.toLocaleString("es-GT")}
      {suffix}
    </span>
  );
}

"use client";

import { useRef, type ReactNode } from "react";

type SpotlightProps = {
  children: ReactNode;
  className?: string;
};

export function Spotlight({ children, className = "" }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    ref.current?.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    ref.current?.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className={`group relative ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(95, 179, 163, 0.12), transparent 60%)",
        }}
      />
      {children}
    </div>
  );
}

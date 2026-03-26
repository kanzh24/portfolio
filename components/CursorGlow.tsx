"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const target = targetRef.current;
      const current = currentRef.current;

      currentRef.current = {
        x: current.x + (target.x - current.x) * 0.15,
        y: current.y + (target.y - current.y) * 0.15,
      };

      cursor.style.left = `${currentRef.current.x}px`;
      cursor.style.top = `${currentRef.current.y}px`;

      requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    const frame = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      id="cursor-glow"
      ref={cursorRef}
      className="pointer-events-none fixed w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 z-[-1] transition-transform duration-150 ease-out"
      style={{
        background:
          "radial-gradient(circle, rgba(0, 218, 243, 0.08) 0%, transparent 70%)",
        borderRadius: "50%",
      }}
      aria-hidden
    />
  );
}

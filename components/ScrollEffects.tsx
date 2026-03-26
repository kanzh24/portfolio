"use client";

import { useEffect, useRef } from "react";

export function ScrollEffects() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleScroll = () => {
      const scrollPercent =
        window.pageYOffset /
        (document.documentElement.scrollHeight - window.innerHeight);
      grid.style.transform = `translateY(${scrollPercent * 100}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div ref={gridRef} id="dynamic-grid" className="grid-bg" />;
}

"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains("light"));
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    html.classList.toggle("light");
    setIsDark(html.classList.contains("dark"));
  };

  return (
    <button
      onClick={toggle}
      className="p-2.5 rounded-sm glass-card hover:bg-black/5 dark:hover:bg-white/10 text-primary transition-all flex items-center justify-center"
      aria-label="Toggle theme"
    >
      <span className="material-symbols-outlined text-xl">
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}

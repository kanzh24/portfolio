"use client";

import { ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  as?: "button" | "a";
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  className = "",
  as: Component = "button",
  href,
  type = "button",
  disabled,
  onClick,
}: MagneticButtonProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px) scale(1.05)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "";
  };

  const baseClassName =
    "magnetic-btn transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 " +
    className;

  if (Component === "a" && href) {
    return (
      <a
        href={href}
        className={baseClassName}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={baseClassName}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={!disabled ? handleMouseMove : undefined}
      onMouseLeave={!disabled ? handleMouseLeave : undefined}
    >
      {children}
    </button>
  );
}

// src/components/layout/AnimatedBackground.tsx
import { useEffect } from "react";

export default function AnimatedBackground() {
  useEffect(() => {
    const interval = setInterval(() => {
      const root = document.documentElement;
      const hue = Math.floor(Math.random() * 360);
      root.style.setProperty("--tw-gradient-from", `hsl(${hue}, 100%, 85%)`);
      root.style.setProperty("--tw-gradient-to", `hsl(${(hue + 60) % 360}, 100%, 85%)`);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full bg-gradient-to-br from-orange-100 to-red-100 transition-all duration-1000 dark:from-orange-900/30 dark:to-red-900/30"
      aria-hidden="true"
    />
  );
}

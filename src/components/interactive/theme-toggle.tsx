"use client";

import { useEffect, useState } from "react";

import { ui } from "@/content/ui";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    localStorage.setItem("zurayq-theme", next);
    setTheme(next);
  }

  const label = theme === "dark" ? ui.modes.themeLight : ui.modes.themeDark;

  return (
    <button type="button" className="icon-control" onClick={toggleTheme} aria-label={label} title={label}>
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 15.2A8.7 8.7 0 0 1 8.8 4 8.8 8.8 0 1 0 20 15.2Z" />
        </svg>
      )}
    </button>
  );
}

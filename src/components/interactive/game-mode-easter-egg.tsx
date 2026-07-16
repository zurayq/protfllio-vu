"use client";

import { useEffect, useState } from "react";

type Point = { x: number; y: number };

export function GameModeEasterEgg() {
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState<Point>({ x: 50, y: 76 });

  useEffect(() => {
    if (!enabled) return;
    const timeout = window.setTimeout(() => setEnabled(false), 8000);
    return () => window.clearTimeout(timeout);
  }, [enabled]);

  useEffect(() => {

    function hide() {
      setEnabled(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }

      if (event.key.toLowerCase() === "g" && !enabled) {
        if (document.documentElement.dataset.recruiter === "true") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        setEnabled(true);
        setPosition({ x: 50, y: 76 });
        return;
      }

      if (!enabled) return;
      if (event.key === "Escape") {
        hide();
        return;
      }

      const moves: Record<string, Point> = {
        ArrowLeft: { x: -4, y: 0 },
        ArrowRight: { x: 4, y: 0 },
        ArrowUp: { x: 0, y: -6 },
        ArrowDown: { x: 0, y: 6 },
      };
      const move = moves[event.key];
      if (!move) return;
      event.preventDefault();
      setPosition((point) => ({
        x: Math.min(94, Math.max(6, point.x + move.x)),
        y: Math.min(92, Math.max(10, point.y + move.y)),
      }));
    }

    function onRecruiterMode(event: Event) {
      if ((event as CustomEvent<boolean>).detail) hide();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("zurayq:recruiter", onRecruiterMode);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("zurayq:recruiter", onRecruiterMode);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="easter-overlay" aria-live="polite">
      <div className="easter-status">game mode enabled · arrows move · esc exits</div>
      <div
        className="tiny-player"
        style={{ left: position.x + "%", top: position.y + "%" }}
        aria-hidden="true"
      >
        <span />
      </div>
    </div>
  );
}

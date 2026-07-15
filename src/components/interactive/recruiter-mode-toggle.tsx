"use client";

import { useEffect, useState } from "react";

import { ui } from "@/content/ui";
import { trackEvent } from "@/lib/analytics";

export function RecruiterModeToggle({ compact = false }: { compact?: boolean }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setEnabled(document.documentElement.dataset.recruiter === "true");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggle() {
    const next = !enabled;
    document.documentElement.dataset.recruiter = String(next);
    localStorage.setItem("zurayq-recruiter-mode", String(next));
    window.dispatchEvent(new CustomEvent("zurayq:recruiter", { detail: next }));
    trackEvent(next ? "recruiter_mode_enabled" : "recruiter_mode_disabled");
    setEnabled(next);
  }

  return (
    <button
      type="button"
      className={compact ? "mode-switch mode-switch-compact" : "mode-switch"}
      role="switch"
      aria-checked={enabled}
      onClick={toggle}
    >
      <span className="mode-switch-track" aria-hidden="true">
        <span className="mode-switch-thumb" />
      </span>
      <span className="mode-switch-label">{compact ? "Recruiter" : ui.modes.recruiter}</span>
    </button>
  );
}

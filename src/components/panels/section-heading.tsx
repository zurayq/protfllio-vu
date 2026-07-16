"use client";

import { useEffect, useState } from "react";

import { ui } from "@/content/ui";

type SectionHeadingProps = {
  command: string;
  title: string;
  casualDescription?: string;
  recruiterDescription?: string;
  copyable?: boolean;
};

export function SectionHeading({
  command,
  title,
  casualDescription,
  recruiterDescription,
  copyable = false,
}: SectionHeadingProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="section-heading">
      <div>
        <div className="section-command-row">
          <span className="section-command">{command}</span>
          {copyable ? (
            <button
              type="button"
              className="copy-command"
              onClick={copyCommand}
              aria-label={ui.common.copy + ": " + command}
            >
              {copied ? "✓" : "⧉"}
            </button>
          ) : null}
        </div>
        <h2>{title}</h2>
      </div>
      {casualDescription || recruiterDescription ? (
        <p className="section-description">
          <span className="normal-only">{casualDescription}</span>
          <span className="recruiter-only">{recruiterDescription ?? casualDescription}</span>
        </p>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {copied ? ui.common.copied : ""}
      </span>
    </div>
  );
}

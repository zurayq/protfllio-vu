"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type LinkButtonProps = {
  href: string | null;
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet";
  className?: string;
  download?: boolean;
  event?: AnalyticsEvent;
  eventProperties?: Record<string, string | number | boolean | undefined>;
  disabledLabel?: string;
};

export function LinkButton({
  href,
  children,
  variant = "secondary",
  className,
  download,
  event,
  eventProperties,
  disabledLabel,
}: LinkButtonProps) {
  const classes = cn("link-button", "link-button-" + variant, className);

  if (!href) {
    return (
      <span className={cn(classes, "link-button-disabled")} aria-disabled="true">
        {disabledLabel ?? children}
      </span>
    );
  }

  const external = href.startsWith("http");
  const onClick = () => {
    if (event) trackEvent(event, eventProperties);
  };

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
      >
        {children}
        <span aria-hidden="true">↗</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes} download={download} onClick={onClick}>
      {children}
    </Link>
  );
}

export type AnalyticsEvent =
  | "project_opened"
  | "recruiter_mode_enabled"
  | "recruiter_mode_disabled"
  | "cv_clicked"
  | "game_play_clicked";

export type AnalyticsProperties = Record<string, string | number | boolean | undefined>;

export function trackEvent(event: AnalyticsEvent, properties: AnalyticsProperties = {}) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("zurayq:analytics", { detail: { event, properties } }),
  );
}

// No provider is connected by default. Listen for the custom event above in a
// small client adapter when an analytics service is chosen.

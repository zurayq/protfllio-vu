"use client";

import { useState } from "react";

import { GalleryDialog } from "@/components/interactive/gallery-dialog";
import type { ExperienceEntry } from "@/types/content";

export function ExperienceCard({ entry }: { entry: ExperienceEntry }) {
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <article className="experience-card">
      <div className="experience-date">
        {entry.startDate} — {entry.current ? "Present" : entry.endDate ?? "TODO"}
      </div>
      <div>
        <p>{entry.organization}</p>
        <h3>{entry.role}</h3>
        {entry.description ? <p>{entry.description}</p> : null}
        {entry.highlights?.length ? (
          <ul>{entry.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
        ) : null}
        {entry.gallery?.length ? (
          <button type="button" className="text-action" onClick={() => setGalleryOpen(true)}>
            Open photo log ({entry.gallery.length})
          </button>
        ) : null}
      </div>
      {entry.gallery ? (
        <GalleryDialog
          open={galleryOpen}
          title={entry.organization}
          items={entry.gallery}
          onClose={() => setGalleryOpen(false)}
        />
      ) : null}
    </article>
  );
}

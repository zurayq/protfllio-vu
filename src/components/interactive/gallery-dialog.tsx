"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";

import type { GalleryItem } from "@/types/content";

type GalleryDialogProps = {
  open: boolean;
  title: string;
  items: GalleryItem[];
  onClose: () => void;
};

export function GalleryDialog({ open, title, items, onClose }: GalleryDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    document.body.style.overflow = "";
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="gallery-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClose={() => {
        document.body.style.overflow = "";
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      <div className="gallery-dialog-panel">
        <div className="gallery-dialog-header">
          <div>
            <span>PHOTO LOG</span>
            <h2 id={titleId}>{title}</h2>
          </div>
          <button type="button" onClick={close} className="dialog-close" aria-label="Close gallery">
            ×
          </button>
        </div>
        <div className="gallery-dialog-grid">
          {items.map((item) => (
            <figure key={item.src}>
              <Image src={item.src} alt={item.alt} width={1200} height={800} sizes="90vw" />
              {item.caption ? <figcaption>{item.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    </dialog>
  );
}

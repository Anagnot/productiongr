"use client";

import { useCallback, useEffect, useState } from "react";

type Labels = {
  open: string;
  close: string;
  prev: string;
  next: string;
};

type Props = {
  images: string[];
  alt: string;
  labels: Labels;
};

export function GalleryLightbox({ images, alt, labels }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const total = images.length;
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % total)),
    [total],
  );
  const prev = useCallback(
    () =>
      setOpenIndex((i) => (i === null ? null : (i - 1 + total) % total)),
    [total],
  );

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, next, prev]);

  return (
    <>
      <div className="gallery-grid">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className="gallery-item"
            onClick={() => setOpenIndex(i)}
            aria-label={`${labels.open} ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${alt} — ${i + 1}`}
              loading={i < 3 ? "eager" : "lazy"}
            />
          </button>
        ))}
      </div>

      {isOpen ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={close}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={close}
            aria-label={labels.close}
          >
            <span aria-hidden="true">×</span>
          </button>

          {total > 1 ? (
            <button
              type="button"
              className="lightbox-nav lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label={labels.prev}
            >
              <span aria-hidden="true">‹</span>
            </button>
          ) : null}

          <figure
            className="lightbox-figure"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[openIndex]}
              alt={`${alt} — ${openIndex + 1}`}
            />
            <figcaption className="lightbox-counter">
              {openIndex + 1} / {total}
            </figcaption>
          </figure>

          {total > 1 ? (
            <button
              type="button"
              className="lightbox-nav lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label={labels.next}
            >
              <span aria-hidden="true">›</span>
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Photo = {
  src: string;
  displayType?: string;
  brand?: string;
  caption?: string;
  portrait?: boolean;
};

// Portrait images keep object-fit:contain (no harsh crop); everything else uses cover.
function onImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  const media = img.closest(".ch-slide-media");
  if (media) media.classList.toggle("is-portrait", img.naturalHeight > img.naturalWidth);
}

type Props = {
  photos: Photo[];
  alt: string;
  prevLabel?: string;
  nextLabel?: string;
};

export function ChannelCarousel({
  photos,
  alt,
  prevLabel = "Previous",
  nextLabel = "Next",
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const total = photos.length;

  const stepSize = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 0;
    const first = el.querySelector<HTMLElement>("[data-slide]");
    if (!first) return el.clientWidth;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    return first.offsetWidth + gap;
  }, []);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = stepSize();
    setActive(step ? Math.round(el.scrollLeft / step) : 0);
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, [stepSize]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollByDir = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * stepSize(), behavior: "smooth" });
  };

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * stepSize(), behavior: "smooth" });
  };

  if (total === 0) return null;

  return (
    <div className="ch-carousel" aria-roledescription="carousel">
      <div className="ch-carousel-scroller" ref={scrollerRef}>
        {photos.map((p, i) => {
          const hasCap = Boolean(p.displayType || p.brand || p.caption);
          return (
            <figure
              key={p.src}
              className="ch-slide"
              data-slide
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${total}`}
            >
              <div className={`ch-slide-media${p.portrait ? " is-portrait" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={
                    hasCap
                      ? `${alt} — ${[p.displayType, p.brand].filter(Boolean).join(" · ")}`
                      : `${alt} — ${i + 1}`
                  }
                  loading={i < 2 ? "eager" : "lazy"}
                  draggable={false}
                  onLoad={onImgLoad}
                />
              </div>
              {hasCap && (
                <figcaption className="ch-slide-cap">
                  {(p.displayType || p.brand) && (
                    <div className="ch-slide-head">
                      {p.displayType && (
                        <span className="ch-slide-type">{p.displayType}</span>
                      )}
                      {p.brand && <span className="ch-slide-brand">{p.brand}</span>}
                    </div>
                  )}
                  {p.caption && <p className="ch-slide-text">{p.caption}</p>}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {total > 1 && (
        <div className="ch-carousel-controls">
          <button
            type="button"
            className="ch-carousel-arrow"
            onClick={() => scrollByDir(-1)}
            disabled={atStart}
            aria-label={prevLabel}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="ch-carousel-dots" role="tablist">
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`${i + 1}`}
                className={`ch-carousel-dot${i === active ? " is-active" : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className="ch-carousel-arrow"
            onClick={() => scrollByDir(1)}
            disabled={atEnd}
            aria-label={nextLabel}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

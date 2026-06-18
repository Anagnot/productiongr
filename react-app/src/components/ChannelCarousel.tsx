"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type Photo = {
  src: string;
  displayType?: string;
  brand?: string;
  caption?: string;
  portrait?: boolean;
};

// Progress ring geometry (SVG viewBox 36×36).
const RING_R = 16;
const RING_C = 2 * Math.PI * RING_R;
const DEFAULT_AUTOPLAY_MS = 3500;

// External stores: reduced-motion preference + tab visibility (SSR snapshot = false).
const RM_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const m = window.matchMedia(RM_QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(RM_QUERY).matches;
const subscribeVis = (cb: () => void) => {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
};
const getHidden = () => document.hidden;
const serverFalse = () => false;

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
  pauseLabel?: string;
  playLabel?: string;
  closeLabel?: string;
  openLabel?: string;
  autoPlayMs?: number;
};

export function ChannelCarousel({
  photos,
  alt,
  prevLabel = "Previous",
  nextLabel = "Next",
  pauseLabel = "Pause",
  playLabel = "Play",
  closeLabel = "Close",
  openLabel = "Open image",
  autoPlayMs = DEFAULT_AUTOPLAY_MS,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const accumRef = useRef(0); // ms elapsed toward the next auto-advance

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const reducedMotion = useSyncExternalStore(subscribeRM, getRM, serverFalse);
  const hidden = useSyncExternalStore(subscribeVis, getHidden, serverFalse);

  const total = photos.length;
  const isOpen = openIndex !== null;
  // Reduced-motion users never get auto-advance; the control reflects that.
  const autoplayOn = playing && !reducedMotion;

  const setRing = useCallback((p: number) => {
    const c = ringRef.current;
    if (c) c.style.strokeDashoffset = String(RING_C * (1 - Math.min(Math.max(p, 0), 1)));
  }, []);

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
    const idx = step ? Math.round(el.scrollLeft / step) : 0;
    activeRef.current = idx;
    setActive(idx);
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

  // Loop-aware navigation. Always resets the auto-advance progress.
  const goTo = useCallback(
    (i: number) => {
      const el = scrollerRef.current;
      if (!el || total === 0) return;
      const idx = ((i % total) + total) % total;
      el.scrollTo({ left: idx * stepSize(), behavior: "smooth" });
      accumRef.current = 0;
      setRing(0);
    },
    [total, stepSize, setRing],
  );

  const next = useCallback(() => goTo(activeRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(activeRef.current - 1), [goTo]);

  // Auto-advance loop (rAF-driven so pause/resume keeps the elapsed progress).
  const running = autoplayOn && total > 1 && !isOpen && !hidden;
  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      accumRef.current += now - last;
      last = now;
      if (accumRef.current >= autoPlayMs) {
        accumRef.current = 0;
        next(); // advances + resets ring
      } else {
        setRing(accumRef.current / autoPlayMs);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, next, setRing, autoPlayMs]);

  // ---- Lightbox ----
  const open = useCallback((i: number) => setOpenIndex(i), []);
  const close = useCallback(() => setOpenIndex(null), []);
  const lbNext = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % total)),
    [total],
  );
  const lbPrev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + total) % total)),
    [total],
  );

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") lbNext();
      else if (e.key === "ArrowLeft") lbPrev();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, lbNext, lbPrev]);

  if (total === 0) return null;

  const lb = isOpen ? photos[openIndex] : null;
  const lbHasCap = Boolean(lb && (lb.displayType || lb.brand || lb.caption));

  return (
    <div className="ch-carousel" aria-roledescription="carousel">
      <div className="ch-carousel-viewport">
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
                <button
                  type="button"
                  className="ch-slide-trigger"
                  onClick={() => open(i)}
                  aria-label={`${openLabel} ${i + 1}`}
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
                </button>
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
          <div className="ch-carousel-overlay">
            <button
              type="button"
              className="ch-nav ch-nav-prev"
              onClick={prev}
              aria-label={prevLabel}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              className="ch-nav ch-nav-next"
              onClick={next}
              aria-label={nextLabel}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              className="ch-autoplay"
              onClick={() => setPlaying((v) => !v)}
              aria-label={autoplayOn ? pauseLabel : playLabel}
              aria-pressed={!autoplayOn}
            >
              <svg className="ch-autoplay-ring" viewBox="0 0 36 36" aria-hidden="true">
                <circle className="track" cx="18" cy="18" r={RING_R} fill="none" strokeWidth="2.5" />
                <circle
                  ref={ringRef}
                  className="bar"
                  cx="18"
                  cy="18"
                  r={RING_R}
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ strokeDasharray: RING_C, strokeDashoffset: RING_C }}
                />
              </svg>
              <span className="ch-autoplay-icon" aria-hidden="true">
                {autoplayOn ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6.5" y="5" width="3.6" height="14" rx="1" />
                    <rect x="13.9" y="5" width="3.6" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5.5v13l11-6.5z" />
                  </svg>
                )}
              </span>
            </button>
          </div>
        )}
      </div>

      {total > 1 && (
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
      )}

      {isOpen && lb &&
        createPortal(
          <div
            className="ch-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            ref={dialogRef}
            tabIndex={-1}
            onClick={close}
          >
            <button
              type="button"
              className="ch-lightbox-close"
              onClick={close}
              aria-label={closeLabel}
            >
              <span aria-hidden="true">×</span>
            </button>

            {total > 1 && (
              <button
                type="button"
                className="ch-lightbox-nav ch-lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  lbPrev();
                }}
                aria-label={prevLabel}
              >
                <span aria-hidden="true">‹</span>
              </button>
            )}

            <figure className="ch-lightbox-figure" onClick={(e) => e.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lb.src} alt={`${alt} — ${openIndex + 1}`} />
              <figcaption className="ch-lightbox-cap">
                {lbHasCap && (
                  <>
                    {(lb.displayType || lb.brand) && (
                      <div className="ch-lightbox-head">
                        {lb.displayType && (
                          <span className="ch-lightbox-type">{lb.displayType}</span>
                        )}
                        {lb.brand && <span className="ch-lightbox-brand">{lb.brand}</span>}
                      </div>
                    )}
                    {lb.caption && <p className="ch-lightbox-text">{lb.caption}</p>}
                  </>
                )}
                <span className="ch-lightbox-counter">
                  {openIndex + 1} / {total}
                </span>
              </figcaption>
            </figure>

            {total > 1 && (
              <button
                type="button"
                className="ch-lightbox-nav ch-lightbox-next"
                onClick={(e) => {
                  e.stopPropagation();
                  lbNext();
                }}
                aria-label={nextLabel}
              >
                <span aria-hidden="true">›</span>
              </button>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}

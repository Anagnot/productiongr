"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  images: string[];
  alt: string;
  prevLabel?: string;
  nextLabel?: string;
};

export function ChannelCarousel({
  images,
  alt,
  prevLabel = "Previous",
  nextLabel = "Next",
}: Props) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const total = images.length;

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      const wrapped = ((next % total) + total) % total;
      setIndex(wrapped);
    },
    [total],
  );

  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // touch / swipe
  const touchStart = useRef<number | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) next();
      else prev();
    }
    touchStart.current = null;
  }

  if (total === 0) return null;

  return (
    <div className="ch-carousel" aria-roledescription="carousel">
      <div
        className="ch-carousel-viewport"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className="ch-carousel-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="ch-carousel-slide"
              aria-hidden={i !== index}
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${total}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${alt} — ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {total > 1 ? (
          <>
            <button
              type="button"
              className="ch-carousel-arrow ch-carousel-arrow-prev"
              onClick={prev}
              aria-label={prevLabel}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M15 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="ch-carousel-arrow ch-carousel-arrow-next"
              onClick={next}
              aria-label={nextLabel}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        ) : null}

        <div className="ch-carousel-counter" aria-live="polite">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="ch-carousel-counter-sep">/</span>
          <span>{String(total).padStart(2, "0")}</span>
        </div>
      </div>

      {total > 1 ? (
        <div className="ch-carousel-dots" role="tablist">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${i + 1}`}
              className={`ch-carousel-dot${i === index ? " is-active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

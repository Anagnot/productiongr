"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  images: string[];
  intervalMs?: number;
};

export function HeroSlider({ images, intervalMs = 1700 }: Props) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const timerRef = useRef<number | null>(null);

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function startTimer() {
    clearTimer();
    if (total <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, intervalMs);
  }

  useEffect(() => {
    startTimer();
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, intervalMs]);

  function go(i: number) {
    setIndex(i);
    startTimer();
  }

  if (total === 0) return null;

  return (
    <>
      <div className="hero-slider" aria-hidden="true">
        {images.map((src, i) => (
          <div
            key={src}
            className={`hero-slide${i === index ? " active" : ""}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className="hero-slide-overlay" />
      </div>
      <div className="hero-dots" role="tablist" aria-label="Hero slider">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1}`}
            className={`hero-dot${i === index ? " active" : ""}`}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </>
  );
}

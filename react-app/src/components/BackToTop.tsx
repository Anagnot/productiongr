"use client";

import { useEffect, useState } from "react";

const SHOW_THRESHOLD = 480;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    let current = false;

    function update() {
      const shouldShow = window.pageYOffset > SHOW_THRESHOLD;
      if (shouldShow !== current) {
        current = shouldShow;
        setVisible(shouldShow);
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      className={`ui-back-to-top${visible ? " is-visible" : ""}`}
      aria-label="Επιστροφή στην κορυφή"
      onClick={handleClick}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

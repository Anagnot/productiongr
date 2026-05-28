"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const HERO_SELECTORS = [
  ".hero .eyebrow",
  ".hero h1",
  ".hero .lede",
  ".hero .actions",
  ".hero .meta-row",
  ".hero .stage",
  ".page-hero h1",
  ".page-hero .lede",
  ".page-hero .stats-line",
  ".page-hero .right",
  ".case-hero h1",
  ".case-hero .lede",
  ".case-meta",
  ".wizard-shell h1",
  ".wizard-shell .lede",
  ".wizard-shell .save-state",
  ".progress-strip",
].join(",");

const REVEAL_SELECTORS = [
  "section .section-head",
  ".services-grid > *",
  ".work-grid > *",
  ".process-step",
  ".reasons-grid > *",
  ".mat",
  ".sub-type",
  ".mvp-grid > *",
  ".values-grid > *",
  ".archetype-grid > *",
  ".ms",
  ".channels-grid > *",
  ".industries-grid > *",
  ".pillar",
  ".stat",
  ".product",
  ".testimonials-grid > *",
  ".personas-grid > *",
  ".about-strip .visual",
  ".about-strip > div:not(.visual)",
  ".facility",
  ".cap-grid .c",
  ".matrix-band .matrix",
  ".svc-cat .left",
  ".svc-cat .sub",
  ".cert",
  ".info-card",
  ".gallery .img",
  ".timeline-grid .step",
  ".specs-table .row",
  ".case-meta .m",
  ".spec-strip .s",
  ".uni-grid .work-card",
  ".featured-row .featured-card",
  ".related-grid .tile",
  ".team-grid .person",
  ".milestones-grid .ms",
  ".clients-wall-grid .c",
  ".results-grid .r",
  ".bigvisual .frame",
  ".cta-block h2",
  ".cta-block .cta",
  ".materials-list .m",
  ".story h2",
  ".story p",
  ".story .pull",
  ".story .sig-block",
  ".page-grid > .page-card",
].join(",");

const GROUP_SELECTORS = [
  ".services-grid",
  ".reasons-grid",
  ".process-steps",
  ".industries-grid",
  ".channels-grid",
  ".work-grid",
  ".stats-grid",
  ".product-grid",
  ".values-grid",
  ".archetype-grid",
  ".mvp-grid",
  ".cap-grid",
  ".milestones-grid",
  ".team-grid",
  ".related-grid",
  ".timeline-grid",
  ".uni-grid",
  ".case-meta",
  ".spec-strip",
  ".results-grid",
  ".testimonials-grid",
  ".personas-grid",
  ".clients-wall-grid",
  ".facilities-grid",
  ".matrix-band .head",
  ".page-grid",
].join(",");

const STAT_SELECTORS = [
  ".stat .num",
  ".reasons-grid .r .metric .v",
  ".page-hero .stats-line .s .v",
  ".results-grid .r .v",
  ".summary .estimate .v",
].join(",");

function animateNumber(el: Element) {
  const html = (el as HTMLElement).innerHTML;
  const match = html.match(/(\d+[.,]?\d*)/);
  if (!match) return;
  const targetStr = match[1];
  const target = parseFloat(targetStr.replace(",", "."));
  if (isNaN(target) || target === 0) return;

  const hasDecimal = /[.,]/.test(targetStr);
  const start = performance.now();
  const dur = 1100;

  (el as HTMLElement).classList.add("p-counting");

  function frame(now: number) {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const cur = target * eased;
    const display = hasDecimal ? cur.toFixed(1) : Math.round(cur).toString();
    (el as HTMLElement).innerHTML = html.replace(/(\d+[.,]?\d*)/, display);
    if (t < 1) requestAnimationFrame(frame);
    else {
      (el as HTMLElement).innerHTML = html;
      (el as HTMLElement).classList.remove("p-counting");
    }
  }
  requestAnimationFrame(frame);
}

function setupMarquee(row: HTMLElement) {
  if (row.dataset.marqueeReady === "1") return;
  const items = Array.from(row.children);
  if (items.length === 0) return;

  const track = document.createElement("div");
  track.className = "p-marquee-track";
  items.forEach((item) => track.appendChild(item));
  items.forEach((item) => track.appendChild(item.cloneNode(true)));

  row.style.display = "block";
  row.style.gap = "";
  row.classList.add("p-marquee-wrap");
  row.appendChild(track);
  row.dataset.marqueeReady = "1";
}

export function AnimationsInit() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      document
        .querySelectorAll(".p-reveal")
        .forEach((el) => el.classList.add("p-in"));
      return;
    }

    const observers: IntersectionObserver[] = [];
    let cancelled = false;

    const rafId = requestAnimationFrame(() => {
      if (cancelled) return;

      // 1. Hero / page-hero entrance cascade
      const heroEls = document.querySelectorAll(HERO_SELECTORS);
      heroEls.forEach((el, i) => {
        el.classList.add("p-enter");
        (el as HTMLElement).style.animationDelay = i * 70 + "ms";
      });

      // 2. Reveal-on-scroll
      const revealEls = document.querySelectorAll(REVEAL_SELECTORS);
      revealEls.forEach((el) => el.classList.add("p-reveal"));

      if ("IntersectionObserver" in window) {
        const revealIo = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("p-in");
                revealIo.unobserve(e.target);
              }
            });
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
        );
        revealEls.forEach((el) => revealIo.observe(el));
        observers.push(revealIo);

        const groupIo = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("p-in");
                groupIo.unobserve(e.target);
              }
            });
          },
          { rootMargin: "0px 0px -5% 0px", threshold: 0.08 },
        );
        document.querySelectorAll(GROUP_SELECTORS).forEach((g) => {
          g.classList.add("p-stagger");
          groupIo.observe(g);
        });
        observers.push(groupIo);

        // 3. Stat counters
        const statIo = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                animateNumber(e.target);
                statIo.unobserve(e.target);
              }
            });
          },
          { threshold: 0.5 },
        );
        document.querySelectorAll(STAT_SELECTORS).forEach((s) => statIo.observe(s));
        observers.push(statIo);
      } else {
        revealEls.forEach((el) => el.classList.add("p-in"));
      }

      // 4. Clients marquee
      document
        .querySelectorAll<HTMLElement>(".clients-row")
        .forEach(setupMarquee);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      observers.forEach((o) => o.disconnect());
    };
  }, [pathname]);

  return null;
}

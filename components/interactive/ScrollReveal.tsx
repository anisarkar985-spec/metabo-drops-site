"use client";

import { useEffect } from "react";

/**
 * ScrollReveal — Adds `.visible` class to elements with `.reveal` class
 * as they scroll into view (one-shot per element).
 *
 * Mount this component once on each page. It finds all `.reveal` elements
 * currently in the DOM and observes them with IntersectionObserver.
 *
 * CSS handles the actual animation via `.reveal.visible { ... }` rules.
 */
export default function ScrollReveal() {
  useEffect(() => {
    // Feature-detect IntersectionObserver for older browsers
    if (typeof IntersectionObserver === "undefined") {
      // Fallback: immediately mark all as visible so content isn't hidden
      document
        .querySelectorAll(".reveal")
        .forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    // v25.35 — Safety-net timer for IntersectionObserver misses.
    // Root cause of the "3rd bonus card missing" symptom that survived
    // v25.31-v25.34 (data was correct at every pipeline stage): IO
    // occasionally never fires for an element under edge viewport /
    // grid-wrap / mount-race conditions, leaving .reveal stuck at
    // opacity:0 permanently. 2500ms after mount, any .reveal still
    // lacking .visible is force-added. The :not(.visible) selector
    // makes this idempotent with the IO path — elements already
    // revealed by IO are skipped entirely.
    const fallbackTimer = window.setTimeout(() => {
      document
        .querySelectorAll(".reveal:not(.visible)")
        .forEach((el) => el.classList.add("visible"));
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  return null;
}

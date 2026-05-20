"use client";

import { useEffect, useRef, useState } from "react";
import type { LiveNotifyPerson } from "@/types/site-data";

interface LiveNotifyPopupProps {
  people: LiveNotifyPerson[];
}

interface DisplayState {
  person: LiveNotifyPerson;
  minutesAgo: number;
}

/**
 * LiveNotifyPopup — Rotating "social proof" popup shown in the bottom-left.
 *
 * Behavior (matches HTML reference):
 *   - First popup appears 2 seconds after mount
 *   - Each popup is visible for 4 seconds, then hides
 *   - 9-second gap before next popup shows (~13s total cycle)
 *   - Random "X min ago" between 1-9
 *   - Avatar tries ui-avatars.com first, falls back to gradient + initials
 *   - People list rotates in order and loops indefinitely
 */
export default function LiveNotifyPopup({ people }: LiveNotifyPopupProps) {
  const [visible, setVisible] = useState(false);
  const [display, setDisplay] = useState<DisplayState | null>(null);
  const [imageOk, setImageOk] = useState(true);

  // Use refs to avoid re-renders from timer logic and to allow cleanup
  const indexRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Don't run if empty list
    if (!people || people.length === 0) return;

    const randomMinutes = () => Math.floor(Math.random() * 9) + 1;

    const showNext = () => {
      if (!mountedRef.current) return;

      const person = people[indexRef.current % people.length];
      indexRef.current = (indexRef.current + 1) % people.length;

      setDisplay({ person, minutesAgo: randomMinutes() });
      setImageOk(true);
      setVisible(true);

      // Hide after 4 seconds
      const hideTimer = setTimeout(() => {
        if (!mountedRef.current) return;
        setVisible(false);
      }, 4000);

      // Show next after: 4s visible + 0.8s slide-out + 9s gap
      const nextTimer = setTimeout(() => {
        if (!mountedRef.current) return;
        showNext();
      }, 4000 + 800 + 9000);

      timersRef.current.push(hideTimer, nextTimer);
    };

    // First popup after 2s delay
    const initialTimer = setTimeout(showNext, 2000);
    timersRef.current.push(initialTimer);

    return () => {
      mountedRef.current = false;
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, [people]);

  if (!display) {
    // Render the element but invisible so CSS transitions work on first show
    return (
      <div className="live-notify" id="liveNotify" aria-live="polite">
        <div className="live-notify-avatar" />
        <strong>—</strong>
        <div className="meta">
          <span className="dot" />
          <span>—</span>
        </div>
      </div>
    );
  }

  const { person, minutesAgo } = display;
  const initials = (person.first[0] + person.last[0]).toUpperCase();
  const imgUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    person.first + "+" + person.last
  )}&background=random&color=fff&bold=true&size=104&format=png`;
  const nameText = `${person.first} ${person.last[0]}. · ${person.city}`;
  const actionText = `${minutesAgo} min ago · ${person.action}`;

  return (
    <div
      className={visible ? "live-notify visible" : "live-notify"}
      id="liveNotify"
      aria-live="polite"
    >
      <div
        className="live-notify-avatar"
        style={{ background: person.gradient }}
      >
        {imageOk ? (
          <img
            src={imgUrl}
            alt={person.first}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onError={() => setImageOk(false)}
          />
        ) : (
          <span
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "16px",
            }}
          >
            {initials}
          </span>
        )}
      </div>
      <strong>{nameText}</strong>
      <div className="meta">
        <span className="dot" />
        <span>{actionText}</span>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { siteData } from "@/lib/site-data";

// v25.67 — IndexNow first-visitor ping.
//
// IndexNow is Bing's content-freshness API: when a site notifies the
// service about new/changed URLs, Bing crawls them within minutes
// instead of waiting days for organic discovery. For a freshly
// deployed affiliate site this is the difference between ranking in
// week 1 vs. week 4.
//
// How this works:
//   1. Operator generates a key at bing.com/indexnow/getstarted
//   2. Operator hosts the key as /{KEY}.txt in public/ (instructions
//      in the deployment README) and sets NEXT_PUBLIC_INDEXNOW_KEY
//   3. On the FIRST visitor to the deployed site, this client
//      component fires a single POST to api.indexnow.org submitting
//      every URL from the sitemap
//   4. localStorage flag prevents re-submission on subsequent visits
//
// Why client-side: static export has no server-side hooks for "first
// deploy" detection. The first-visitor approach is reliable, free,
// and naturally rate-limited (one ping per browser, ever).
//
// Pre-v25.67 the README claimed this feature existed but no code
// implemented it — IndexNow was advertised but never actually fired.

const SUBMITTED_KEY = "indexnow:submitted-v1";

export default function IndexNowPing() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_INDEXNOW_KEY;
    if (!key) return;
    if (typeof window === "undefined") return;
    try {
      if (window.localStorage.getItem(SUBMITTED_KEY)) return;
    } catch {
      return; // localStorage blocked → silently skip
    }

    const baseUrl = siteData.site.url.replace(/\/+$/, "");
    let host = "";
    try {
      host = new URL(baseUrl).host;
    } catch {
      return;
    }
    if (!host) return;

    // v25.94 — submit only canonical, indexable URLs. /cookie is
    // noindex (excluded from sitemap.ts for the same reason); pinging
    // Bing about a noindex URL gives the wrong signal. Mirrors the
    // sitemap.ts inclusion list exactly.
    const urlList = [
      `${baseUrl}/`,
      `${baseUrl}/ingredients`,
      `${baseUrl}/benefits`,
      `${baseUrl}/reviews`,
      `${baseUrl}/contact`,
      `${baseUrl}/disclaimer`,
      `${baseUrl}/terms`,
      `${baseUrl}/privacy`,
    ];

    const body = {
      host,
      key,
      keyLocation: `${baseUrl}/${key}.txt`,
      urlList,
    };

    // Fire-and-forget; mark submitted optimistically so failure
    // doesn't cause an infinite retry loop on every page load.
    try {
      window.localStorage.setItem(SUBMITTED_KEY, String(Date.now()));
    } catch {}

    fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
      // No-cors keepalive so the POST survives a navigation away
      // before the response lands.
      keepalive: true,
    }).catch(() => {
      // Silent — IndexNow's response codes (200/202/422 etc) aren't
      // actionable from the client. The localStorage flag prevents
      // retry storms on transient failures.
    });
  }, []);

  return null;
}

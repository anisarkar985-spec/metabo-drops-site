#!/usr/bin/env node
// v25.67.2 — IndexNow key file auto-creator (runs as prebuild).
//
// Bing's IndexNow protocol requires the verification key to be hosted at
// the site root as `<key>.txt` containing exactly the key text. This
// script reads NEXT_PUBLIC_INDEXNOW_KEY from the environment (or .env)
// and writes `public/<key>.txt` if it doesn't already exist.
//
// Behaviour:
//   - Env var unset → silent no-op (operator hasn't set up IndexNow yet)
//   - File already exists → silent no-op (don't overwrite)
//   - Otherwise → create the file with the key as content
//
// Runs before `next build` automatically because of the package.json
// "prebuild" hook. Hostinger / Cloudflare / Netlify all honour this.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const KEY = (process.env.NEXT_PUBLIC_INDEXNOW_KEY || "").trim();
if (!KEY) {
  // No key configured — IndexNowPing will also no-op at runtime. Done.
  process.exit(0);
}

// Sanity-check key shape (Bing requires hex 32-128 chars; reject obvious
// junk to prevent shipping a placeholder file).
if (!/^[a-zA-Z0-9-]{8,128}$/.test(KEY)) {
  console.warn(
    `[indexnow-key] NEXT_PUBLIC_INDEXNOW_KEY ("${KEY.slice(0, 12)}...") doesn't look like a valid IndexNow key. Skipping key-file creation.`,
  );
  process.exit(0);
}

const publicDir = path.resolve(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const keyFile = path.join(publicDir, `${KEY}.txt`);
if (fs.existsSync(keyFile)) {
  // Operator already created it manually — leave alone.
  process.exit(0);
}

fs.writeFileSync(keyFile, KEY, "utf8");
console.log(`[indexnow-key] Created public/${KEY}.txt for Bing IndexNow verification.`);

/**
 * Quran App – Service Worker
 *
 * Strategies:
 *   Audio  (cdn.islamic.network/quran/audio)  → Cache-First  (never re-download same file)
 *   API    (api.quran.com)                    → Stale-While-Revalidate (works offline)
 *   Assets (same-origin)                      → Network-First with cache fallback
 */

const AUDIO_CACHE = "quran-audio-v1";
const API_CACHE   = "quran-api-v1";

// ── Lifecycle ─────────────────────────────────────────────────────────────────

self.addEventListener("install", () => {
  self.skipWaiting(); // activate immediately on new SW install
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // take control of all open tabs
      // Clean up old cache versions
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== AUDIO_CACHE && k !== API_CACHE)
            .map((k) => caches.delete(k))
        )
      ),
    ])
  );
});

// ── Fetch Interception ────────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // ── Audio: Cache-First ────────────────────────────────────────────────────
  if (url.includes("cdn.islamic.network/quran/audio")) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached; // instant cache hit

        try {
          const response = await fetch(event.request);
          if (response.ok) {
            cache.put(event.request, response.clone()); // store for next time
          }
          return response;
        } catch {
          // Offline and not cached
          return new Response("Audio unavailable offline", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        }
      })
    );
    return;
  }

  // ── Quran API: Stale-While-Revalidate ─────────────────────────────────────
  if (url.includes("api.quran.com")) {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);

        // Kick off network fetch in background to keep cache fresh
        const networkFetch = fetch(event.request)
          .then((response) => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => null);

        // Return cached immediately if available, otherwise wait for network
        if (cached) return cached;
        const fresh = await networkFetch;
        return (
          fresh ||
          new Response('{"error":"offline","verses":[]}', {
            status: 503,
            headers: { "Content-Type": "application/json" },
          })
        );
      })
    );
    return;
  }

  // All other requests: let the browser handle normally
});

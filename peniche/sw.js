/* Peniche service worker: app shell offline, forecast data network-first */
const SHELL = "peniche-shell-v3";
const DATA = "peniche-data-v1";
const FILES = ["./", "index.html", "js/psm.js", "js/app.js", "manifest.webmanifest", "../icons/icon-192.png", "../icons/icon-512.png", "../icons/apple-touch-icon.png", "../vendor/leaflet/leaflet.js", "../vendor/leaflet/leaflet.css"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== SHELL && k !== DATA).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.hostname.endsWith("open-meteo.com")) {
    // network first, fall back to last good response
    e.respondWith(fetch(e.request).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(DATA).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request)));
    return;
  }
  if (url.origin === location.origin) {
    // shell: network first so updates land, cache as fallback
    e.respondWith(fetch(e.request, {cache: "no-cache"}).then(r => {
      const copy = r.clone(); caches.open(SHELL).then(c => c.put(e.request, copy)); return r;
    }).catch(() => caches.match(e.request).then(m => m || caches.match("index.html"))));
  }
});

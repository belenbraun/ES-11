// Service worker de La Gota de Alegría.
// Fase 1 (esqueleto): cache mínimo de app shell para que la PWA sea
// instalable y arranque offline, + manejo de Web Push.
// La lógica de qué se cachea/precachea se va a afinar cuando el feed
// dependa de Supabase (fetch dinámico vs. shell estático).

const CACHE_NAME = "gota-shell-v1";
const APP_SHELL = ["/", "/manifest.webmanifest", "/icons/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request)),
  );
});

// --- Web Push ---
// El payload lo arma la función serverless que dispara la notificación
// por pilar activo (ver brief-la-gota.md, paso 4). Se espera JSON:
// { title, body, url }
self.addEventListener("push", (event) => {
  let data = { title: "La Gota de Alegría", body: "Hay algo nuevo 💧" };
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon.svg",
      badge: "/icons/icon.svg",
      data: { url: data.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(url));
      if (existing) return existing.focus();
      return self.clients.openWindow(url);
    }),
  );
});

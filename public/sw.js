const CACHE_VERSION = "v1";
const CACHE_NAME = `mansfield-${CACHE_VERSION}`;

const SUITS = ["Clubs", "Diamonds", "Hearts", "Spades"];
const NUMBERS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Ace",
  "Jack",
  "Queen",
  "King",
];

const CARD_URLS = [
  "./public/cards/BackBlue.svg",
  "./public/cards/BackRed.svg",
  "./public/cards/Suit=Other,Number=Joker.svg",
  ...SUITS.flatMap((suit) =>
    NUMBERS.map((num) => `./public/cards/Suit=${suit},Number=${num}.svg`),
  ),
];

const APP_SHELL = ["./", "./manifest.json"];

const PRECACHE_URLS = [...APP_SHELL, ...CARD_URLS];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (name) => name.startsWith("mansfield-") && name !== CACHE_NAME,
            )
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Navigation requests: network-first with offline fallback to cached scope root
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches
            .match(self.registration.scope)
            .then((res) => res ?? Response.error()),
        ),
    );
    return;
  }

  // Static assets (card images, icons, etc.): cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (
          !response ||
          response.status !== 200 ||
          response.type === "opaque"
        ) {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
    }),
  );
});

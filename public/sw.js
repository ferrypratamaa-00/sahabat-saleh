const CACHE_NAME = 'sahabat-saleh-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/opening/character_boy.png',
  '/images/opening/character_girl.png',
  '/audio/wudu/opening_welcome.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
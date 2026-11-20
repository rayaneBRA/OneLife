const CACHE_NAME = 'hayati-v4';
const urlsToCache = [
  '/OneLife/',
  '/OneLife/index.html',
  '/OneLife/icon.png',
  '/OneLife/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch(err => console.log('Cache error:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// استقبال رسالة من الصفحة لإرسال إشعار
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRAYER_NOTIFICATION') {
    const { prayerName, prayerTime } = event.data;
    
    self.registration.showNotification('🕌 وقت الصلاة', {
      body: `حان الآن وقت صلاة ${prayerName} (${prayerTime})`,
      icon: '/OneLife/icon.png',
      badge: '/OneLife/icon.png',
      vibrate: [150, 80, 150],
      tag: 'prayer-' + prayerName,
      requireInteraction: false,
      silent: false
    });
  }
});

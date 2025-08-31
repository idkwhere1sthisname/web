const cacheName = 'v1';
const cachedFiles = [
  '/css/main.css',
  '/js/main.js',
  '/images/Dialog.png',
  '/images/dialogbtn.png',
  '/images/dialogbtn_hover.png',
  '/offline.html',
  '/sound/hvr.wav',
  '/sound/ktv_popup.wav',
  '/sound/ktv_popup_leave.wav',
  '/sound/sel.wav',
  '/sound/save_amp.wav',
  '/font/KTV_NARROW.ttf',
  '/js/jquery.js',
  '/favicon.ico',
  '/images/favicon/frame_13.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Opened cache');
      return cache.addAll(cachedFiles);
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [cacheName];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (!cacheWhitelist.includes(cache)) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }

      if (!navigator.onLine) {
        return caches.match('/offline.html');
      }

      return fetch(event.request).catch(error => {
        return caches.match('/offline.html');
      });
    })
  );
});

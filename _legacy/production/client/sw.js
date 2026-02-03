const CACHE_NAME = 'moto-taller-v1';
const ASSETS = [
    './index.html',
    './appointments.html',
    './manifest.json',
    '../engine_bg.png',
    '../banner_diagnostics.png',
    '../moto_dark_red_abstract_bg.png',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
];

// Install Event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(ASSETS);
            })
    );
});

// Fetch Event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache Hit - Return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Activate Event (Cleanup)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

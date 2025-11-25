const CACHE_NAME = 'village-maudit-v3.1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Almendra&display=swap',
  'https://fonts.googleapis.com/css2?family=Pirata+One&display=swap',
  // Images (Liste non exhaustive, le SW essaiera d'en cacher d'autres dynamiquement)
  './le_paysan.png',
  './le_loup_garou.png',
  './la_sorciere.png',
  './la_voyante.png',
  './le_chasseur.png',
  './cupidon.png',
  './la_petite_fille.png',
  './le_voleur.png'
];

// Installation du Service Worker et mise en cache initiale
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Mise en cache des fichiers...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// Interception des requêtes (Stratégie : Cache First, puis Réseau)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si trouvé dans le cache, on le retourne
        if (response) {
          return response;
        }
        // Sinon, on va le chercher sur le réseau
        return fetch(event.request).then(
          (response) => {
            // Vérification de la validité de la réponse
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // On met en cache la nouvelle ressource pour la prochaine fois
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});
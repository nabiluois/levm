const CACHE_NAME = 'village-maudit-v5.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  
  // Polices externes
  'https://fonts.googleapis.com/css2?family=Almendra&display=swap',
  'https://fonts.googleapis.com/css2?family=Pirata+One&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',

  // Icônes de l'interface (Essentielles pour le menu)
  './Village.svg',
  './Loup.svg',
  './Solo.svg',
  './Vampires.svg',
  './Cartes_vm.svg',
  './Details.svg',
  './Bug.svg',
  './icon.png',

  // Images des Rôles (Noms corrigés selon ton HTML)
  './le_paysan.png',
  './le_loup_garou.png',
  './la_sorciere.png',
  './le_voyant.png',               // CORRIGÉ (était la_voyante)
  './le_chasseur_de_vampires.png', // CORRIGÉ (était le_chasseur)
  './l_orphelin.png',              // CORRIGÉ (était cupidon)
  './la_fille.png',                // CORRIGÉ (était la_petite_fille)
  './le_clodo.png',                // CORRIGÉ (était le_voleur)
  './le_bucheron.png',
  './le_bienfaiteur.png',
  './l_homme_a_la_hache.png',
  './le_loup_garou_rouge.png',
  './le_loup_garou_maudit.png',
  './le_papa_des_loups.png'
  
  // NOTE : Les autres images (SVG manquants, cartes VM, etc.) seront ajoutées 
  // au cache automatiquement dès qu'elles seront affichées une première fois 
  // grâce à la fonction "fetch" ci-dessous.
];

// 1. Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Mise en cache des fichiers essentiels...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// 2. Activation et nettoyage des anciens caches (Mise à jour)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('Suppression de l\'ancien cache :', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// 3. Interception des requêtes (Stratégie : Cache First, puis Réseau)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // A. Si le fichier est dans le cache, on le sert direct (Rapide !)
        if (response) {
          return response;
        }
        
        // B. Sinon, on va le chercher sur Internet
        return fetch(event.request).then(
          (response) => {
            // Vérification basique que la réponse est valide
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // C. On met en cache ce nouveau fichier pour la prochaine fois
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
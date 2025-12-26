/* ============================================
   1. CONFIGURATION & FICHIERS À CACHER
   ============================================ */
const CACHE_NAME = 'village-maudit-v6.5'; // J'ai incrémenté la version pour forcer la mise à jour

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

    // Icônes de l'interface (SVG RESTENT SVG)
    './Village.svg',
    './Loup.svg',
    './Solo.svg',
    './Vampires.svg',
    './Cartes_vm.svg',
    './Details.svg',
    './Bug.svg',
    './icon.webp', // Changé en webp

    // DOS DE CARTES (ESSENTIEL OFFLINE - Changés en webp)
    './back.webp',
    './back_or.webp',
    './back_argant.webp',
    './back_bronze.webp',

    // Images des Rôles (Changés en webp)
    './le_paysan.webp',
    './le_loup_garou.webp',
    './la_sorciere.webp',
    './le_voyant.webp',
    './le_chasseur_de_vampires.webp',
    './l_orphelin.webp',
    './la_fille.webp',
    './le_clodo.webp',
    './le_bucheron.webp',
    './le_bienfaiteur.webp',
    './l_homme_a_la_hache.webp',
    './le_loup_garou_rouge.webp',
    './le_loup_garou_maudit.webp',
    './le_papa_des_loups.webp'
];

/* ============================================
   2. INSTALLATION (MISE EN CACHE)
   ============================================ */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Mise en cache des fichiers essentiels...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

/* ============================================
   3. ACTIVATION (NETTOYAGE ANCIENS CACHES)
   ============================================ */
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

/* ============================================
   4. INTERCEPTION (STRATÉGIE CACHE-FIRST)
   ============================================ */
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
                        if (!response || response.status !== 200 || response.type !== 'basic') {
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

/* ============================================
   5. MESSAGE (FORCE UPDATE)
   ============================================ */
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
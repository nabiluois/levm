<div id="hack-overlay" style="
    position: fixed; 
    top: 0; left: 0; 
    width: 100%; height: 100%; 
    background-color: black; 
    z-index: 9999999; 
    color: #ff0000; 
    font-family: 'Courier New', Courier, monospace; 
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
    text-align: center;
    padding: 20px;
">
    <h1 style="font-size: 3em; margin-bottom: 20px; text-shadow: 0 0 10px red;">⚠️ CRITICAL SECURITY ALERT ⚠️</h1>
    <h2 style="color: white;">UNAUTHORIZED ACCESS DETECTED</h2>
    <p style="font-size: 1.2em; max-width: 600px; margin: 20px auto;">
        SYSTEM FAILURE: PUBLIC URL LEAK DETECTED.<br>
        SOURCE IP: UNKNOWN (EXTERNAL ACCESS)<br>
        FIREBASE DATABASE: <span style="background: red; color: black; padding: 2px 5px; font-weight: bold;">DELETED / PURGED</span>
    </p>
    <div style="border: 1px solid red; padding: 15px; margin-top: 30px; color: white;">
        ERROR CODE: 0xDEAD_BEEF<br>
        STATUS: IRREVERSIBLE DATA LOSS<br>
        <br>
        <i>"Le lien n'aurait pas dû être partagé."</i>
    </div>
    <script>
        // Ce petit script fait clignoter le fond pour plus de stress
        setInterval(() => {
            document.getElementById('hack-overlay').style.backgroundColor = 
                document.getElementById('hack-overlay').style.backgroundColor === 'black' ? '#1a0000' : 'black';
        }, 500);
        // Empêche le clic droit
        document.addEventListener('contextmenu', event => event.preventDefault());
    </script>
</div>



/* ============================================
   1. CONFIGURATION & FICHIERS À CACHER (SQUELETTE)
   ============================================ */
const CACHE_NAME = 'village-maudit-v1.9'; // Version incrémentée pour forcer la MAJ

// On ne cache ici que le STRICT MINIMUM pour que l'app se lance (le "squelette")
// Les images des cartes se mettront en cache toutes seules quand on les verra (Lazy Caching)
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './online.js',
    './manifest.json',

    // Polices externes
    'https://fonts.googleapis.com/css2?family=Almendra&display=swap',
    'https://fonts.googleapis.com/css2?family=Pirata+One&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',

    // Icônes essentielles de l'interface (Navigation & UI)
    './Village.svg',
    './Loup.svg',
    './Solo.svg',
    './Vampires.svg',
    './Cartes_vm.svg',
    './Details.svg',
    './Bug.svg',
    './icon.webp',
    './back.webp' // Gardé car utilisé souvent dans l'UI (menu)
];

/* ============================================
   2. INSTALLATION (PRÉ-CHARGEMENT DU SQUELETTE)
   ============================================ */
self.addEventListener('install', (event) => {
    // Force le nouveau Service Worker à s'activer immédiatement sans attendre
    self.skipWaiting(); 
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Installation : Mise en cache du squelette...');
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
                    console.log('Nettoyage : Suppression de l\'ancien cache', key);
                    return caches.delete(key);
                }
            }));
        })
        // Permet au SW de prendre le contrôle des pages ouvertes immédiatement
        .then(() => self.clients.claim()) 
    );
});

/* ============================================
   4. INTERCEPTION (STRATÉGIE CACHE-FIRST + RUNTIME CACHING)
   ============================================ */
self.addEventListener('fetch', (event) => {
    // On ignore les requêtes non-GET ou vers d'autres domaines bizarres si besoin
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // A. Si le fichier est déjà en cache, on le sert (Super rapide)
                if (response) {
                    return response;
                }

                // B. Sinon, on va le chercher sur Internet
                return fetch(event.request).then(
                    (response) => {
                        // Vérifications de sécurité
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // C. C'est ici que la magie opère :
                        // On a récupéré un nouveau fichier (ex: le_bucheron.webp),
                        // on le clone et on le met dans le cache pour la prochaine fois !
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
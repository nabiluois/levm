// ============================================
// SYSTEME EN LIGNE - V88 (FINAL STRUCTURÉ)
// ============================================

/* ============================================
   1. IMPORTS & CONFIGURATION FIREBASE
   ============================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, update, get, child, remove, onDisconnect } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDbOZGB_e-v82n3eZaXq3_Eq8GHW0OLkXo",
    authDomain: "le-village-maudit.firebaseapp.com",
    databaseURL: "https://le-village-maudit-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "le-village-maudit",
    storageBucket: "le-village-maudit.firebasestorage.app",
    messagingSenderId: "383628308052",
    appId: "1:383628308052:web:133e1c7c63b6c4aa94c7c1",
    measurementId: "G-SKED9ZP8SN"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* ============================================
   2. VARIABLES GLOBALES
   ============================================ */
let currentGameCode = null;
let myPlayerId = null;
let myCurrentRoleId = null;
let targetResurrectId = null;
let targetEventCategory = null; 
let detectedRoles = [];
let detectedEvents = { gold: [], silver: [], bronze: [] };
let isDraftMode = false; 
let playerPhotoData = null; 
let distributionSelection = [];
let currentPlayersData = {};
let cardsLockedState = false; // Variable pour le blocage des cartes 

// Variables Action
let actionSourceRole = null;
let actionSourceId = null;
let currentlyOpenedPlayerId = null; 

// --- NOUVEAU : TRACKERS POUR DÉCONNEXION PROPRE ---
let unsubscribeVote = null;
let unsubscribePlayer = null;
let unsubscribeGlobal = null;

// =========================================================
// ⚠️ FONCTION DE CLIC (CORRIGÉE : PLUS DE POP-UP) 
// =========================================================
window.handleCardClick = function(cardElement) {
    if (cardsLockedState) {
        // Si c'est bloqué par le MJ : 
        // On ne fait RIEN (pas de pop-up), juste une vibration d'erreur.
        if(navigator.vibrate) navigator.vibrate(100);
    } else {
        // Si c'est libre : On retourne la carte
        cardElement.classList.toggle('flipped');
        if(navigator.vibrate) navigator.vibrate(20);
    }
};

/* ============================================
   3. INITIALISATION & LISTENERS GLOBAUX
   ============================================ */

// Fonction de Hachage (Simple & Robuste pour masquer le mot de passe)
function cypherInput(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convertit en 32bit integer
    }
    return hash;
}

// ÉCOUTEUR DE CLIC SÉCURISÉ (Création de partie)
document.addEventListener('click', function(e) {
    const btn = e.target.closest('#btn-create-game');
    
    if (btn) {
        e.preventDefault();
        e.stopPropagation();

        // Demande du mot de passe
        const input = prompt("🔐 Mot de passe MJ :");
        
        if (input) {
            const cleanInput = input.trim(); 
            const attemptHash = cypherInput(cleanInput); 

            // HASH SÉCURISÉ (Ceci correspond à ton mot de passe actuel masqué)
            // Si tu changes de mot de passe, tu devras générer un nouveau hash.
            const targetHash = 1427395148; 

            if(attemptHash === targetHash) { 
                if (typeof window.initCreateGame === 'function') {
                    window.initCreateGame(); 
                } else {
                    internalShowNotification("Erreur", "Le système charge encore...");
                }
            } else { 
                internalShowNotification("Accès Refusé", "Mot de passe incorrect.");
                if(navigator.vibrate) navigator.vibrate(200);
            }
        }
    }
});

// Initialisation optimisée
document.addEventListener('DOMContentLoaded', () => {
    // On lance le scan (qui utilisera désormais paniniRoles en priorité)
    try { scanContentFromHTML(); } catch(e) { console.error(e); }
    
    const btnJoin = document.getElementById('btn-join-action');
    if(btnJoin) btnJoin.onclick = joinGame;

    const savedAdminCode = localStorage.getItem('adminGameCode');
    if (savedAdminCode) { showResumeButton(savedAdminCode); }
    checkPlayerSession();
});

/* ============================================
   4. UTILITAIRES (AVATAR, SESSION, SCAN)
   ============================================ */

// GÉNÉRATEUR UNIVERSEL DE BADGES
function generateBadgesHTML(player, isSummary = false) {
    let html = "";
    // CONFIGURATION DES POSITIONS
    const pos = isSummary ? 
        { m_t: '-12px', m_l: '-10px', tr_t: '-8px', tr_r: '-8px', bl_b: '-5px', bl_l: '-5px' } : 
        { m_t: '-8px', m_l: '-8px', tr_t: '-4px', tr_r: '-4px', bl_b: '-2px', bl_l: '-2px' };

    // 1. LE MAIRE
    if (player.isMayor) {
        html += `<span style="position:absolute; top:${pos.m_t}; left:${pos.m_l}; font-size:2.2em; z-index:100; filter:drop-shadow(0 2px 2px black);">🎖️</span>`;
    }

    // 2. RECUPERATION DES EFFETS
    let effects = [];
    if (player.attributes) {
        const a = player.attributes;
        if (Object.keys(a).some(k => k.startsWith('lover'))) effects.push('💘');
        if (Object.keys(a).some(k => k.startsWith('linked_red'))) effects.push('❤️');
        if (Object.keys(a).some(k => k.startsWith('infected'))) effects.push('🐾');
        if (Object.keys(a).some(k => k.startsWith('target'))) effects.push('🎯');
        if (Object.keys(a).some(k => k.startsWith('bewitched'))) effects.push('😵‍💫');
        if (Object.keys(a).some(k => k.startsWith('silenced'))) effects.push('🤐');
    }

    // 3. PLACEMENT DES EMOJIS
    if (effects.length > 0) {
        html += `<span style="position:absolute; top:${pos.tr_t}; right:${pos.tr_r}; font-size:1.8em; z-index:90; text-shadow:0 0 3px black;">${effects[0]}</span>`;
        if (effects.length > 1) {
            const others = effects.slice(1).join('');
            html += `<div style="position:absolute; bottom:${pos.bl_b}; left:${pos.bl_l}; display:flex; flex-direction:row-reverse; z-index:90; font-size:1.5em; letter-spacing:-5px; text-shadow:0 0 3px black;">${others}</div>`;
        }
    }
    return html;
}

// GÉNÉRATEUR D'AVATAR COMPLET
function generateAvatarWithBadges(player, size = "60px", border = "2px solid var(--gold)", isSummary = false) {
    const avatarSrc = player.avatar || "icon.webp";
    const badgesHtml = generateBadgesHTML(player, isSummary);

    return `
        <div class="admin-avatar-container" style="position:relative; width:${size}; height:${size}; min-width:${size}; overflow:visible;">
            <img src="${avatarSrc}" alt="Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%; border:${border}; display:block; background:#000;">
            ${badgesHtml}
        </div>
    `;
}

window.previewPlayerPhoto = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewDiv = document.getElementById('photo-preview');
            previewDiv.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
            compressImage(e.target.result, 300, 0.7).then(compressedBase64 => { playerPhotoData = compressedBase64; });
        }
        reader.readAsDataURL(input.files[0]);
    }
};

function compressImage(base64Str, maxWidth = 300, quality = 0.7) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > height) { if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; } } 
            else { if (height > maxWidth) { width *= maxWidth / height; height = maxWidth; } }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
    });
}

function checkPlayerSession() {
    const savedPCode = localStorage.getItem('vm_player_code');
    const savedPId = localStorage.getItem('vm_player_id');
    const savedPName = localStorage.getItem('vm_player_name');
    if (savedPCode && savedPId) {
        const content = document.querySelector('#modal-online-menu .modal-content');
        if (document.getElementById('btn-resume-player')) return;
        
        const resumeBtn = document.createElement('button');
        resumeBtn.id = "btn-resume-player";
        resumeBtn.className = "btn-menu"; 
        resumeBtn.style.cssText = "background:linear-gradient(135deg, #27ae60, #2ecc71); border:2px solid white; margin-bottom:15px; width:90%; margin-left:5%; padding:10px; border-radius:8px; color:white; font-family:'Pirata One'; font-size:1.2em; cursor:pointer;";
        resumeBtn.innerHTML = `🔄 REJOINDRE (${savedPName || 'Partie'})`;
        resumeBtn.onclick = function() { restorePlayerSession(savedPCode, savedPId); };
        
        const title = content.querySelector('h2');
        if(title) title.insertAdjacentElement('afterend', resumeBtn);
    }
}

// 2. RESTAURATION SESSION
window.restorePlayerSession = function(code, id) {
    cleanupListeners(); 
    cardsLockedState = false; 

    currentGameCode = code;
    myPlayerId = id;
    get(child(ref(db), `games/${code}/players/${id}`)).then((snapshot) => {
        if(snapshot.exists()) {
            document.getElementById('btn-join-action').style.display = 'none';
            const lobbyStatus = document.getElementById('player-lobby-status');
            if(lobbyStatus) lobbyStatus.style.display = 'block';
            
            if(window.closeModal) window.closeModal('modal-online-menu'); 
            if(window.openModal) window.openModal('modal-join-game');            
            
            listenForPlayerUpdates(); 
            listenToGlobalPlayers();  
            listenForVoteState();      
            listenForGameSettings(); 
        } else {
            internalShowNotification("Info", "Partie terminée ou expirée.");
            localStorage.removeItem('vm_player_code');
            localStorage.removeItem('vm_player_id');
            location.reload();
        }
    });
};

function showResumeButton(code) {
    const content = document.querySelector('#modal-online-menu .modal-content');
    if(content && !document.getElementById('btn-resume-admin')) {
        const resumeBtn = document.createElement('button');
        resumeBtn.id = "btn-resume-admin";
        resumeBtn.className = "btn-menu";
        resumeBtn.style.cssText = "background:linear-gradient(135deg, #8e44ad, #c0392b); border:2px solid gold; margin-bottom:15px; width:90%; margin-left:5%; padding:10px; border-radius:8px; color:white; font-family:'Pirata One'; font-size:1.2em; cursor:pointer;";
        resumeBtn.innerHTML = `👑 GÉRER MA PARTIE (${code})`;
        resumeBtn.onclick = () => window.restoreAdminSession(code);
        
        const title = content.querySelector('h2');
        if(title) title.insertAdjacentElement('afterend', resumeBtn);
    }
}

// OPTIMISATION MAJEURE : SCAN FIABLE AVEC CATÉGORISATION FORCÉE + CORRECTIF IDs
function scanContentFromHTML() {
    detectedRoles = [];
    detectedEvents = { gold: [], silver: [], bronze: [] };
    
    // 1. Chargement des Rôles depuis paniniRoles (Source Fiable)
    if (typeof window.paniniRoles !== 'undefined' && Array.isArray(window.paniniRoles)) {
        console.log("✅ Chargement des rôles depuis la configuration...");
        window.paniniRoles.forEach(role => {
            // FIX IDs : On utilise le nom de l'image pour l'ID pour la compatibilité
            // (ex: "le_paysan.webp" -> "le_paysan" au lieu de "LE PAYSAN")
            const fileId = role.image.split('/').pop().replace(/\.[^/.]+$/, "").toLowerCase();
            
            detectedRoles.push({
                id: fileId, // ON UTILISE L'ID BASÉ SUR LE FICHIER
                title: role.title,
                image: role.image,
                category: detectRoleCategory(fileId) // Tri automatique
            });
            // Préchargement
            const preloadLink = new Image();
            preloadLink.src = role.image;
        });
    } else {
        // Fallback (Ancienne méthode si paniniRoles manque)
        console.warn("⚠️ paniniRoles absent, scan HTML...");
        const cards = document.querySelectorAll('.carte-jeu');
        cards.forEach((card) => {
            const imgTag = card.querySelector('.carte-front img');
            const titleTag = card.querySelector('.carte-back h3'); 
            if (imgTag && titleTag) {
                const imgSrc = imgTag.getAttribute('src');
                const id = imgSrc.split('/').pop().replace(/\.[^/.]+$/, "").toLowerCase();
                detectedRoles.push({ 
                    id: id, 
                    title: titleTag.innerText.trim(), 
                    image: imgSrc, 
                    category: detectRoleCategory(id)
                });
            }
        });
    }

    // 2. Chargement des Cartes VM
    document.querySelectorAll('.carte-vm').forEach((card) => {
        const imgTag = card.querySelector('img');
        if (imgTag) {
            const imgSrc = imgTag.getAttribute('src');
            if (card.classList.contains('gold')) detectedEvents.gold.push(imgSrc);
            else if (card.classList.contains('silver')) detectedEvents.silver.push(imgSrc);
            else if (card.classList.contains('bronze')) detectedEvents.bronze.push(imgSrc);
            const preloadLink = new Image();
            preloadLink.src = imgSrc;
        }
    });
}

// Helper INTELLIGENT pour trier les rôles (Sans dépendre du HTML)
function detectRoleCategory(idRaw) {
    const id = idRaw.toLowerCase();
    
    // 1. VAMPIRES (On vérifie en priorité)
    if (id.includes('chasseur_de_vampires')) return 'vampires'; 
    if (['dracula', 'succube', 'vampire'].some(v => id.includes(v))) return 'vampires';
    
    // 2. SOLOS (Liste précise)
    const solos = ['bete', 'avocat', 'valkyrie', 'clown', 'diable', 'gourou', 'chevalier', 'serial', 'sauvage', 'jumeaux'];
    if (solos.some(s => id.includes(s))) return 'solo';
    
    // 3. LOUPS (Le reste des loups)
    if (id.includes('loup') || id.includes('papa') || id.includes('alpha')) return 'loups';
    
    // 4. PAR DÉFAUT -> VILLAGE
    return 'village'; 
}

window.closeAdminPanel = function() {
    if(confirm("Quitter le mode Admin ?")) {
        localStorage.removeItem('adminGameCode');
        document.body.classList.remove('no-scroll'); 
        location.reload(); 
    }
};

function escapeHtml(text) {
    if (!text) return text;
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

/* ============================================
   5. ADMIN : INITIALISATION & CONNEXION
   ============================================ */

// 1. CRÉATION DE PARTIE
window.initCreateGame = function() {
    console.log("🚀 Lancement de la création...");

    // A. Génération du Code
    currentGameCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    myPlayerId = "MJ_ADMIN";

    // B. Sauvegarde Locale
    localStorage.setItem('adminGameCode', currentGameCode);

    // C. Interface Immédiate
    launchAdminInterface();

    // D. Envoi Firebase
    set(ref(db, 'games/' + currentGameCode), {
        status: 'waiting',
        created_at: Date.now()
    }).then(() => {
        console.log("✅ Partie créée sur Firebase : " + currentGameCode);
        internalShowNotification("Succès", "Salle " + currentGameCode + " ouverte !");
    }).catch((error) => {
        console.error("ERREUR FIREBASE:", error);
        internalShowNotification("Erreur Critique", error.message);
    });
};

// 2. RESTAURATION DE SESSION
window.restoreAdminSession = function(savedCode) {
    currentGameCode = savedCode;
    myPlayerId = "MJ_ADMIN";

    get(child(ref(db), `games/${currentGameCode}`)).then((snapshot) => {
        if(snapshot.exists()) {
            internalShowNotification("Admin", `Reconnexion réussie : ${currentGameCode}`);
            launchAdminInterface();
        } else {
            internalShowNotification("Erreur", "Cette partie n'existe plus ou a expiré.");
            localStorage.removeItem('adminGameCode');
            setTimeout(() => location.reload(), 2000);
        }
    }).catch((err) => {
        internalShowNotification("Erreur Connexion", err.message);
    });
};

// 3. LANCEMENT DE L'INTERFACE ADMIN
function launchAdminInterface() {
    console.log("💻 Ouverture du Dashboard Admin");

    const codeDisplay = document.getElementById('game-code-display');
    if(codeDisplay) codeDisplay.innerText = currentGameCode;

    if(window.closeModal) window.closeModal('modal-online-menu');

    const adminDash = document.getElementById('admin-dashboard');
    if(adminDash) {
        adminDash.style.display = 'flex';
    } else {
        console.error("❌ ERREUR : Élément #admin-dashboard introuvable !");
        return;
    }

    document.body.classList.add('no-scroll');
    
    const scrollContent = document.querySelector('.admin-content-scroll');
    if(scrollContent) scrollContent.style.overflowY = 'auto';

    setupAdminListeners();
    if(typeof generateDashboardControls === 'function') {
        generateDashboardControls();
    }
}

// 4. ÉCOUTEURS FIREBASE
function setupAdminListeners() {
    listenForGameSettings();
    // A. Écoute des Joueurs
    onValue(ref(db, 'games/' + currentGameCode + '/players'), (snapshot) => {
        const players = snapshot.val() || {};
        currentPlayersData = players; 

        if(typeof updateAdminUI === 'function') {
            updateAdminUI(players);
        }

        const panel = document.querySelector('.details-panel');
        if (panel && panel.classList.contains('active')) {
            const header = panel.querySelector('.panini-admin-header h2');
            if (header && header.textContent.includes('DASHBOARD')) {
                window.openRoleSummaryPanel();
            }
        }

        if (currentlyOpenedPlayerId && players[currentlyOpenedPlayerId]) {
            const p = players[currentlyOpenedPlayerId];
            const roleId = p.draftRole || p.role;
            const isDead = p.status === 'dead';
            
            if(window.refreshAdminPlayerContent) {
                window.refreshAdminPlayerContent(currentlyOpenedPlayerId, p.name, roleId, isDead, p.avatar, p.isMayor, p);
            }
        }
    });

    // B. ÉCOUTE DU VOTE
    listenForVoteState(); 

    // C. Surveillance Connexion
    const connectedRef = ref(db, ".info/connected");
    onValue(connectedRef, (snap) => {
        if (snap.val() === false) {
            console.warn("⚠️ Perte de connexion Firebase");
        } else {
            console.log("✅ Connecté à Firebase");
        }
    });
}

/* ============================================
   6. ADMIN : DASHBOARD & GRILLE JOUEURS
   ============================================ */
function updateAdminUI(players) {
    const listDiv = document.getElementById('player-list-admin');
    if(!listDiv) return;
    listDiv.innerHTML = "";
    
    const isDraft = Object.values(players).some(p => p.draftRole);
    isDraftMode = isDraft;

    // --- CORRECTION : ON NE TOUCHE PAS A LA SELECTION ICI ---
    // (J'ai supprimé le bloc qui vidait distributionSelection)

    generateDashboardControls(); 

    const count = Object.keys(players).length;
    if(count === 0) {
        listDiv.innerHTML = '<div style="color:#aaa; font-style:italic; grid-column:1/-1;">En attente de joueurs...</div>';
    } else {
        const sortedPlayers = Object.entries(players).sort(([,a], [,b]) => {
            if (a.isMayor && !b.isMayor) return -1;
            if (!a.isMayor && b.isMayor) return 1;
            if (a.status !== 'dead' && b.status === 'dead') return -1;
            if (a.status === 'dead' && b.status !== 'dead') return 1;
            return a.name.localeCompare(b.name);
        });

        let gridHTML = "";

        sortedPlayers.forEach(([id, p]) => {
            let currentRoleId = p.draftRole || p.role;
            let roleTitle = "";
            let roleCategory = "inconnu";
            
            if(currentRoleId && detectedRoles.length > 0) {
                const r = detectedRoles.find(x => x.id === currentRoleId);
                if(r) { 
                    roleTitle = r.title;
                    roleCategory = r.category;
                }
            }

            const isDead = p.status === 'dead';
            const avatarHtml = generateAvatarWithBadges(p, "60px", isDead ? "1px solid #555" : "1px solid var(--gold)");

            let draftBtn = "";
            if(isDraft) {
                draftBtn = `<button class="btn-admin-mini" style="background:#3498db; color:white; width:100%; border:none; padding:8px; font-family:'Pirata One'; font-size:1em; margin-top:3px; position:relative; z-index:100;" onclick="event.stopPropagation(); window.openResurrectModal('${id}')">🔄 CHANGER</button>`;
            }

            // SÉCURITÉ : On nettoie le nom avant de l'afficher
            const safeName = escapeHtml(p.name); 

            gridHTML += `
                <div class="admin-player-card ${isDead ? 'dead' : ''}" style="position:relative; cursor:pointer;" onclick="window.openAdminPlayerDetail('${id}', '${safeName.replace(/'/g, "\\'")}', '${currentRoleId || ''}', ${isDead}, '${p.avatar}', ${p.isMayor})">
                    ${isDraft ? '<div style="background:#e67e22; color:white; font-size:0.6em; padding:2px 5px; border-radius:4px; position:absolute; top:3px; left:3px; z-index:10; font-weight:bold;">PROV.</div>' : ''}
                    
                    <div class="admin-avatar-container" style="border:none; width:auto; height:auto; background:transparent;">
                        ${avatarHtml}
                    </div>
                    
                    <strong style="font-size:0.9em;">${safeName}</strong>
                    ${roleTitle ? `<div class="role-text-badge badge-${roleCategory}">${roleTitle}</div>` : ''}
                    
                    ${draftBtn}
                </div>
            `;
        });
        
        listDiv.innerHTML = gridHTML;
    }
    updateAdminButtons(count);
}

function hasAttribute(player, attrType) {
    if (!player.attributes) return false;
    return Object.keys(player.attributes).some(key => key.startsWith(attrType));
}

// Remplace la fonction generateDashboardControls existante par celle-ci :
function generateDashboardControls() {
    const container = document.getElementById('roles-selection-list');
    if(!container) return;
    
    container.innerHTML = "";
    container.style.border = "none";
    container.style.background = "transparent";
    container.style.maxHeight = "none";

    if (distributionSelection.length === 0 && currentPlayersData) {
        Object.values(currentPlayersData).forEach(p => {
            if (p.draftRole) distributionSelection.push(p.draftRole);
            else if (p.role && !isDraftMode) distributionSelection.push(p.role);
        });
    }

    const wrapper = document.createElement('div');
    wrapper.className = "admin-controls-wrapper";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "8px";

    const btnVote = document.createElement('button');
    btnVote.className = "btn-admin-action";
    btnVote.style.cssText = "background:#d35400; color:white; border:1px solid #e67e22; padding:12px; width:100%; border-radius:6px; font-family:'Pirata One'; font-size:1.2em; cursor:pointer; margin-bottom:5px;";
    btnVote.innerHTML = "🗳️ GÉRER LES VOTES";
    btnVote.onclick = () => window.openVotePanel();
    wrapper.appendChild(btnVote);

    const btnTable = document.createElement('button');
    btnTable.className = "btn-admin-action";
    btnTable.style.cssText = "background:#34495e; color:#ecf0f1; border:1px solid #7f8c8d; padding:10px; width:100%; border-radius:6px; font-family:'Pirata One'; font-size:1.1em; cursor:pointer;";
    btnTable.innerHTML = `📊 DASHBOARD (<span id="ctrl-total">${distributionSelection.length}</span>)`;
    btnTable.onclick = () => window.openRoleSummaryPanel();
    wrapper.appendChild(btnTable);

    const btnSelect = document.createElement('button');
    btnSelect.className = "btn-admin-action";
    btnSelect.style.cssText = "background:#2c3e50; color:#bdc3c7; border:1px solid #7f8c8d; padding:10px; width:100%; border-radius:6px; font-family:'Pirata One'; font-size:1.1em; cursor:pointer;";
    btnSelect.innerHTML = "📂 RÔLES SÉLECTION";
    btnSelect.onclick = () => window.openDistributionSelector();
    wrapper.appendChild(btnSelect);

    container.appendChild(wrapper);

    const noteWrapper = document.createElement('div');
    noteWrapper.className = "mj-notepad-wrapper";
    noteWrapper.style.marginTop = "15px";
    noteWrapper.style.marginBottom = "15px";
    noteWrapper.innerHTML = `<label style="color:var(--gold); font-family:'Pirata One'; display:block; margin-bottom:5px;">📝 Mémoire du MJ</label>`;
    const textArea = document.createElement('textarea');
    textArea.className = "mj-notepad-area";
    textArea.placeholder = "Note ici les infos secrètes...\nSauvegarde auto.";
    const savedNote = localStorage.getItem(`vm_notes_${currentGameCode}`);
    if(savedNote) textArea.value = savedNote;
    textArea.oninput = function() { localStorage.setItem(`vm_notes_${currentGameCode}`, this.value); };
    noteWrapper.appendChild(textArea);
    container.appendChild(noteWrapper);

    const bottomWrapper = document.createElement('div');
    bottomWrapper.style.display = "flex";
    bottomWrapper.style.flexDirection = "column";
    bottomWrapper.style.gap = "8px";

    // --- BOUTON BLOCK CARD (MISE À JOUR) ---
    const btnBlock = document.createElement('button');
    btnBlock.id = "btn-block-cards";
    btnBlock.className = "btn-admin-action";
    if (cardsLockedState) {
        btnBlock.style.cssText = "background:#c0392b; color:white; border:2px solid white; padding:12px; width:100%; border-radius:6px; font-family:'Pirata One'; font-size:1.2em; cursor:pointer;";
        btnBlock.innerHTML = "🔒 UNLOCK CARD";
    } else {
        btnBlock.style.cssText = "background:#27ae60; color:white; border:1px solid #2ecc71; padding:12px; width:100%; border-radius:6px; font-family:'Pirata One'; font-size:1.2em; cursor:pointer;";
        btnBlock.innerHTML = "🔓 BLOCK CARD LIBRE";
    }
    btnBlock.onclick = () => window.toggleCardLock();
    bottomWrapper.appendChild(btnBlock);

    const btnDistribute = document.createElement('button');
    btnDistribute.id = "btn-distribute";
    btnDistribute.className = "btn-admin-action";
    btnDistribute.style.cssText = "background:grey; color:white; border:none; padding:12px; width:100%; border-radius:6px; font-family:'Pirata One'; font-size:1.1em; transition:0.3s; margin-top:10px;";
    btnDistribute.disabled = true;
    btnDistribute.innerText = "ATTENTE...";
    btnDistribute.onclick = distributeRoles;
    bottomWrapper.appendChild(btnDistribute);

    const btnReveal = document.createElement('button');
    btnReveal.id = "btn-reveal";
    btnReveal.className = "btn-admin-action";
    btnReveal.style.cssText = "background:grey; color:white; border:none; padding:12px; width:100%; border-radius:6px; font-family:'Pirata One'; font-size:1.1em; display:none;";
    btnReveal.innerText = "📢 RÉVÉLER À TOUS";
    btnReveal.disabled = true;
    btnReveal.onclick = revealRolesToEveryone;
    bottomWrapper.appendChild(btnReveal);

    const btnReset = document.createElement('button');
    btnReset.className = "btn-admin-action";
    btnReset.style.cssText = "background:#c0392b; color:white; border:1px solid #e74c3c; padding:8px; width:100%; border-radius:6px; font-family:'Pirata One'; font-size:1em; cursor:pointer; opacity:0.8; margin-top:10px;";
    btnReset.innerHTML = "🗑️ RESET PARTIE";
    btnReset.onclick = () => window.resetGameToLobby();
    bottomWrapper.appendChild(btnReset);

    container.appendChild(bottomWrapper);
    
    get(child(ref(db), `games/${currentGameCode}/players`)).then((snapshot) => {
        const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
        updateAdminButtons(count);
    });
}

/* ============================================
   7. TABLEAU RECAPITULATIF (DASHBOARD)
   ============================================ */

window.openRoleSummaryPanel = function() {
    const rolesVillage = [];
    const rolesLoup = [];
    const rolesSolo = [];
    const rolesVampire = [];
    
    const interactiveRoles = ['l_orphelin', 'target', 'le_loup_garou_rouge', 'le_loup_garou_maudit', 'le_loup_garou_alpha', 'le_papa_des_loups', 'le_chuchoteur', 'le_marabout'];

    const safeStr = (str) => str ? str.replace(/'/g, "\\'") : "";

    const createLine = (roleId, playerObj, playerId) => {
        const role = detectedRoles.find(r => r.id === roleId);
        if(!role) return null;
        
        let html = "";
        
        if (playerObj) {
            const isDead = playerObj.status === 'dead';
            const bgStyle = isDead 
                ? "background:#2c3e50; color:#95a5a6; border:1px solid #7f8c8d;" 
                : "background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,215,0,0.3);";
            
            // Mode Large (isSummary = true)
            const avatarHtml = generateAvatarWithBadges(playerObj, "50px", "2px solid var(--gold)", true);
            
            const safeName = safeStr(playerObj.name);
            const safeAvatar = safeStr(playerObj.avatar);

            let actionBtn = "";
            if (interactiveRoles.includes(roleId) && !isDead) {
                actionBtn = `
                    <button class="action-btn-flash" onclick="event.stopPropagation(); window.openPlayerSelectorForAction('${roleId}', '${playerId}')">
                        ⚡
                    </button>
                `;
            }

            html = `
                <div class="summary-list-item ${isDead ? 'dead-item' : ''}" style="${bgStyle}">
                    <div class="summary-click-area" onclick="window.openAdminPlayerDetail('${playerId}', '${safeName}', '${roleId}', ${isDead}, '${safeAvatar}', ${playerObj.isMayor})">
                        ${avatarHtml}
                        <div class="summary-text-col">
                            <span class="player-name">${playerObj.name}</span>
                            <span class="role-name">${role.title}</span>
                        </div>
                    </div>
                    ${actionBtn}
                </div>`;
        } else {
            html = `<div class="summary-list-item empty" style="color:#888; font-style:italic;">${role.title}</div>`;
        }
        return { html, cat: role.category };
    };

    let assignedCount = 0;
    if (Object.keys(currentPlayersData).length > 0) {
        Object.entries(currentPlayersData).forEach(([pid, p]) => {
            const roleToDisplay = p.role || p.draftRole;
            if (roleToDisplay) {
                assignedCount++;
                const item = createLine(roleToDisplay, p, pid);
                if(item) {
                    if(item.cat === 'village') rolesVillage.push(item.html);
                    else if(item.cat === 'loups') rolesLoup.push(item.html);
                    else if(item.cat === 'vampires') rolesVampire.push(item.html);
                    else rolesSolo.push(item.html);
                }
            }
        });
    }

    if (assignedCount === 0 && distributionSelection.length > 0) {
        const grouped = {};
        distributionSelection.forEach(id => { grouped[id] = (grouped[id] || 0) + 1; });
        Object.entries(grouped).forEach(([id, qty]) => {
            const role = detectedRoles.find(r => r.id === id);
            if(role) {
                const txt = qty > 1 ? `${role.title} (x${qty})` : role.title;
                const html = `<div class="summary-list-item empty" style="color:#aaa;">${txt}</div>`;
                if(role.category === 'village') rolesVillage.push(html);
                else if(role.category === 'loups') rolesLoup.push(html);
                else if(role.category === 'vampires') rolesVampire.push(html);
                else rolesSolo.push(html);
            }
        });
    }

    // MODIFICATION ICI : Header repensé pour éviter le chevauchement
    const summaryHTML = `
        <div class="panini-admin-header" style="position:relative; padding:15px 50px 15px 15px; border-bottom:2px solid var(--gold); margin-bottom:20px;">
            <h2 style="color:var(--gold); font-family:'Pirata One'; font-size:2em; margin:0; width:100%; text-align:center;">DASHBOARD</h2>
            
            <button class="close-details" onclick="window.internalCloseDetails()" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:transparent; border:none; color:gold; font-size:2em; cursor:pointer; pointer-events:auto; z-index:20002;">✕</button>
        </div>
        
        <div class="summary-container">
            ${rolesVillage.length ? `<div class="summary-col village-col"><img src="Village.svg"> <strong>VILLAGE (${rolesVillage.length})</strong><div class="col-content">${rolesVillage.join('')}</div></div>` : ''}
            ${rolesLoup.length ? `<div class="summary-col loup-col"><img src="Loup.svg"> <strong>LOUPS (${rolesLoup.length})</strong><div class="col-content">${rolesLoup.join('')}</div></div>` : ''}
            ${rolesSolo.length ? `<div class="summary-col solo-col"><img src="Solo.svg"> <strong>SOLOS (${rolesSolo.length})</strong><div class="col-content">${rolesSolo.join('')}</div></div>` : ''}
            ${rolesVampire.length ? `<div class="summary-col vampire-col"><img src="Vampires.svg"> <strong>VAMPIRES (${rolesVampire.length})</strong><div class="col-content">${rolesVampire.join('')}</div></div>` : ''}
        </div>
        <br><br><br>
    `;

    const panel = document.querySelector('.details-panel');
    const overlay = document.querySelector('.details-overlay');
    if(panel && overlay) {
        let contentDiv = panel.querySelector('.details-content');
        if(!contentDiv) {
             panel.innerHTML = '<div class="details-content"></div>';
             contentDiv = panel.querySelector('.details-content');
        }
        contentDiv.innerHTML = summaryHTML;
        
        panel.style.zIndex = "99999";
        overlay.style.zIndex = "99998";
        
        panel.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('no-scroll');
    }
};

/* ============================================
   9. ROLE SELECTION & DISTRIBUTION
   ============================================ */

window.updateDistributionDashboard = function() {
    let cVillage = 0, cLoups = 0, cSolo = 0, cVampire = 0, total = 0;
    
    distributionSelection.forEach(id => {
        const role = detectedRoles.find(r => r.id === id);
        if (role) {
            if (role.category === 'village') cVillage++;
            else if (role.category === 'loups') cLoups++;
            else if (role.category === 'vampires') cVampire++; // VAMPIRES COMPTÉS ICI
            else cSolo++; 
            total++;
        }
    });

    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    
    setTxt('pop-count-village', cVillage);
    setTxt('pop-count-loup', cLoups);
    setTxt('pop-count-solo', cSolo);
    setTxt('pop-count-vampire', cVampire);
    setTxt('pop-total', total);
    setTxt('ctrl-total', total);
};

window.generateResurrectionGrid = function(mode = 'single') {
    if (!detectedRoles || detectedRoles.length === 0) {
        try { scanContentFromHTML(); } catch(e) { console.warn(e); }
    }

    const grid = document.getElementById('admin-role-grid');
    if(!grid) return; 
    
    const h2 = document.querySelector('#modal-role-selector h2');
    if(h2) h2.style.display = 'block';
    
    const ps = document.querySelectorAll('#modal-role-selector p');
    ps.forEach(p => p.style.display = 'block');

    grid.style.display = "block"; 
    grid.innerHTML = "";
    
    if (mode === 'multi') {
        const dashboard = document.createElement('div');
        dashboard.className = "selection-dashboard";
        // AJOUT ICONE VAMPIRE
        dashboard.innerHTML = `
            <div class="dashboard-stats">
                <div class="stat-item"><img src="Village.svg"><span id="pop-count-village">0</span></div>
                <div class="stat-item"><img src="Loup.svg"><span id="pop-count-loup">0</span></div>
                <div class="stat-item"><img src="Solo.svg"><span id="pop-count-solo">0</span></div>
                <div class="stat-item"><img src="Vampires.svg"><span id="pop-count-vampire">0</span></div>
            </div>
            <button class="btn-compact" onclick="window.validateDistribution()">OK (<span id="pop-total">0</span>)</button>
        `;
        grid.appendChild(dashboard);
        setTimeout(updateDistributionDashboard, 50); 
    }

    const categoriesOrder = { 
        'village': '<img src="Village.svg" style="width:25px; vertical-align:middle; margin-right:8px;"> VILLAGE', 
        'loups': '<img src="Loup.svg" style="width:25px; vertical-align:middle; margin-right:8px;"> LOUPS', 
        'solo': '<img src="Solo.svg" style="width:25px; vertical-align:middle; margin-right:8px;"> SOLOS', 
        'vampires': '<img src="Vampires.svg" style="width:25px; vertical-align:middle; margin-right:8px;"> VAMPIRES' 
    };

    const mainFragment = document.createDocumentFragment();

    for (const [catKey, catTitleHTML] of Object.entries(categoriesOrder)) {
        const rolesInCat = detectedRoles.filter(r => r.category === catKey);
        if (rolesInCat.length > 0) {
            const titleDiv = document.createElement('div');
            titleDiv.className = "category-separator";
            titleDiv.style.cssText = "margin-top:25px; margin-bottom:10px; padding-bottom:5px; border-bottom:1px solid #555; display:flex; align-items:center; color:var(--gold); font-family:'Pirata One'; font-size:1.4em; clear:both;";
            titleDiv.innerHTML = catTitleHTML;
            mainFragment.appendChild(titleDiv);
            
            const catGrid = document.createElement('div');
            catGrid.className = "admin-grid-container";
            
            rolesInCat.sort((a, b) => a.title.localeCompare(b.title));
            rolesInCat.forEach(role => {
                const div = document.createElement('div');
                div.className = "role-select-item";
                
                if (mode === 'multi') {
                    const count = distributionSelection.filter(id => id === role.id).length;
                    if (count > 0) {
                        div.classList.add('selected');
                        div.innerHTML += `<div class="qty-badge">x${count}</div>`;
                    }
                }
                div.innerHTML += `<img src="${role.image}" loading="eager" style="width:100%; border-radius:6px; display:block;">`;
                div.onclick = () => mode === 'multi' ? window.handleMultiSelection(role.id, div) : window.assignRoleToPlayer(role.id);
                catGrid.appendChild(div);
            });
            mainFragment.appendChild(catGrid);
        }
    }
    grid.appendChild(mainFragment);
};

window.openDistributionSelector = function() {
    if (!detectedRoles || detectedRoles.length === 0) {
        scanContentFromHTML();
    }
    window.generateResurrectionGrid('multi');
    const modal = document.getElementById('modal-role-selector');
    if(modal) {
        modal.style.zIndex = "999999"; 
        
        const h2 = modal.querySelector('h2');
        if(h2) h2.style.display = "none"; 
        
        window.openModal('modal-role-selector');
        modal.classList.add('active');
        
        const closeBtn = modal.querySelector('.close-modal');
        if(closeBtn) {
            closeBtn.onclick = function() {
                modal.style.display = ''; 
                modal.style.zIndex = '';  
                window.closeModal('modal-role-selector');
            };
        }
    } else {
        alert("Erreur: Modale de sélection introuvable dans le HTML.");
    }
};

window.openResurrectModal = function(playerId) {
    targetResurrectId = playerId;
    window.generateResurrectionGrid('single'); 
    const modalTitle = document.querySelector('#modal-role-selector h2');
    if(modalTitle) {
        modalTitle.style.display = 'block';
        modalTitle.innerText = isDraftMode ? "CHANGER CARTE" : "RESSUSCITER";
    }
    // MODIFICATION ICI : Z-Index augmenté à 200000 pour passer devant le profil
    document.getElementById('modal-role-selector').style.zIndex = "200000"; 
    window.openModal('modal-role-selector');
};

window.handleMultiSelection = function(roleId, divElement) {
    let currentCount = distributionSelection.filter(id => id === roleId).length;
    let newCount = 0;
    
    const isMultiCard = (roleId === 'le_paysan' || roleId === 'le_loup_garou');
    const isDuoCard = (roleId === 'olaf_et_pilaf' || roleId === 'les_jumeaux_explosifs');

    if (isMultiCard) {
        let input = prompt(`Combien ?`, currentCount || 0);
        if (input === null) return; 
        newCount = Math.max(0, parseInt(input) || 0);
    } 
    else if (isDuoCard) {
        let input = prompt(`Duo (0 ou 2) ?`, currentCount || 0);
        if (input === null) return;
        newCount = parseInt(input);
        if(newCount !== 2 && newCount !== 0) newCount = 0;
    }
    else { newCount = currentCount > 0 ? 0 : 1; }

    distributionSelection = distributionSelection.filter(id => id !== roleId);
    for(let i=0; i<newCount; i++) distributionSelection.push(roleId);

    const existingBadge = divElement.querySelector('.qty-badge');
    if(existingBadge) existingBadge.remove();

    if (newCount > 0) {
        divElement.classList.add('selected'); 
        const badge = document.createElement('div');
        badge.className = 'qty-badge';
        badge.innerText = `x${newCount}`;
        divElement.appendChild(badge);
    } else {
        divElement.classList.remove('selected'); 
    }
    
    if(typeof updateDistributionDashboard === 'function') {
        updateDistributionDashboard();
    }
};

window.validateDistribution = function() {
    // 1. Fermer la modale
    const modal = document.getElementById('modal-role-selector');
    if(modal) {
        modal.classList.remove('active');
        modal.style.display = '';
        modal.style.zIndex = '';
    }
    window.closeModal('modal-role-selector');

    // 2. Mettre à jour l'affichage des boutons (Attente X rôles...)
    if(typeof generateDashboardControls === 'function') {
        generateDashboardControls();
    }
    
    // 3. Petit feedback
    console.log("Sélection validée : " + distributionSelection.length + " rôles.");
};

/* ============================================
   10. CARTES VM & ATTRIBUTION (AVEC LOADER)
   ============================================ */

window.openEventSelector = function(playerId, category) {
    targetResurrectId = playerId;
    targetEventCategory = category;
    
    // 1. AFFICHER LE LOADER
    if(window.showLoader) window.showLoader();

    const grid = document.getElementById('admin-role-grid');
    if(!grid) return;
    grid.style.display = "block"; grid.innerHTML = "";
    
    const title = document.querySelector('#modal-role-selector h2');
    if(title) { title.style.display = 'block'; title.innerText = `CARTE ${category.toUpperCase()}`; }

    const randomBtn = document.createElement('button');
    randomBtn.className = "btn-validate";
    randomBtn.innerText = "🎲 ALÉATOIRE";
    randomBtn.onclick = function() { window.adminDraw(playerId, category, true); };
    grid.appendChild(randomBtn);

    const catGrid = document.createElement('div');
    catGrid.className = "admin-grid-container";
    const cards = detectedEvents[category] || [];
    
    // 2. PETIT DÉLAI POUR LE LOADER
    setTimeout(() => {
        cards.forEach(imgSrc => {
            const div = document.createElement('div');
            div.className = "role-select-item";
            div.innerHTML = `<img src="${imgSrc}" loading="eager" style="width:100%; border-radius:6px;">`;
            div.onclick = function() { window.adminDraw(playerId, category, false, imgSrc); };
            catGrid.appendChild(div);
        });
        grid.appendChild(catGrid);
        
        // MODIFICATION ICI : Z-Index augmenté à 200000 pour passer devant tout
        document.getElementById('modal-role-selector').style.zIndex = "200000"; 
        window.openModal('modal-role-selector');
        
        // 3. CACHER LE LOADER
        if(window.hideLoader) window.hideLoader();
    }, 100);
};

window.adminDraw = function(playerId, category, isRandom, manualImg) {
    let finalCard = manualImg;
    if (isRandom) {
        const cards = detectedEvents[category];
        if(cards && cards.length > 0) finalCard = cards[Math.floor(Math.random() * cards.length)];
    }
    if (finalCard) {
        update(ref(db, `games/${currentGameCode}/players/${playerId}`), { drawnCard: { image: finalCard, category: category.toUpperCase() } });
        window.closeModal('modal-role-selector');
        internalShowNotification("Envoyé", `Carte ${category.toUpperCase()} envoyée !`);
    }
};

window.assignRoleToPlayer = function(newRoleId) {
    if(!targetResurrectId) return;

    const multiRoles = ['le_paysan', 'le_loup_garou']; 
    const playersRef = child(ref(db), `games/${currentGameCode}/players`);
    
    get(playersRef).then((snapshot) => {
        const players = snapshot.val() || {};
        const updates = {};
        const p1Id = targetResurrectId;
        const p1Data = players[p1Id];
        const p1OldRole = isDraftMode ? p1Data.draftRole : p1Data.role;
        
        const allowDuplicates = !isDraftMode ? true : (multiRoles.includes(newRoleId));
        let p2Id = null;

        if (!allowDuplicates) {
            const found = Object.entries(players).find(([pid, p]) => {
                const r = isDraftMode ? p.draftRole : p.role;
                return r === newRoleId && pid !== p1Id; 
            });
            if (found) p2Id = found[0]; 
        }

        if (isDraftMode) {
            updates[`games/${currentGameCode}/players/${p1Id}/draftRole`] = newRoleId;
        } else {
            updates[`games/${currentGameCode}/players/${p1Id}/role`] = newRoleId;
            updates[`games/${currentGameCode}/players/${p1Id}/status`] = 'alive';
            updates[`games/${currentGameCode}/players/${p1Id}/drawnCard`] = null;
        }

        if (p2Id) {
            if (isDraftMode) {
                updates[`games/${currentGameCode}/players/${p2Id}/draftRole`] = p1OldRole;
            } else {
                updates[`games/${currentGameCode}/players/${p2Id}/role`] = p1OldRole;
            }
        }

        if (isDraftMode) {
            if (!p2Id) {
                if (p1OldRole) {
                    const idx = distributionSelection.indexOf(p1OldRole);
                    if (idx > -1) distributionSelection.splice(idx, 1);
                }
                distributionSelection.push(newRoleId);
            }
        }

        update(ref(db), updates).then(() => {
            const modal = document.getElementById('modal-role-selector');
            if(modal) { modal.style.zIndex = ''; modal.style.display = ''; }
            window.closeModal('modal-role-selector');
            
            let msg = "Rôle attribué !";
            if (p2Id) msg = "🔄 Échange effectué avec le joueur qui avait ce rôle.";
            internalShowNotification("Succès", msg);
            
            if(isDraftMode) generateDashboardControls();
        });
    });
};

function distributeRoles() {
    let selectedRoles = [...distributionSelection];
    for (let i = selectedRoles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selectedRoles[i], selectedRoles[j]] = [selectedRoles[j], selectedRoles[i]];
    }

    const playersRef = ref(db, 'games/' + currentGameCode + '/players');
    
    get(playersRef).then((snapshot) => {
        const players = snapshot.val();
        if(!players) return;
        
        const playerIds = Object.keys(players);
        const updates = {};

        // On ne touche pas à cardsLocked ici pour respecter le choix du MJ
        playerIds.forEach((id, index) => {
            if (selectedRoles[index]) {
                updates[`games/${currentGameCode}/players/${id}/draftRole`] = selectedRoles[index];
                updates[`games/${currentGameCode}/players/${id}/attributes`] = null; 
            }
        });
        
        update(ref(db), updates);
        internalShowNotification("Mélange", "Les rôles ont été mélangés !");
    });
}

window.revealRolesToEveryone = function() {
    if(!confirm("Valider cette distribution et révéler les rôles ?")) return;
    
    get(child(ref(db), `games/${currentGameCode}/players`)).then((snapshot) => {
        const players = snapshot.val();
        if(!players) return;
        
        const updates = {};
        // On maintient l'état actuel de cardsLockedState au lieu de forcer 'false'
        updates[`games/${currentGameCode}/cardsLocked`] = cardsLockedState; 

        Object.entries(players).forEach(([id, p]) => {
            if(p.draftRole) {
                updates[`games/${currentGameCode}/players/${id}/role`] = p.draftRole;
                updates[`games/${currentGameCode}/players/${id}/draftRole`] = null; 
                updates[`games/${currentGameCode}/players/${id}/status`] = 'alive';
            }
        });
        
        update(ref(db), updates).then(() => {
            internalShowNotification("Succès", "Rôles révélés à tous les joueurs !");
            isDraftMode = false;
            if(typeof generateDashboardControls === 'function') {
                generateDashboardControls();
            }
        });
    });
};

function updateAdminButtons(playerCount) {
    const btnDistribute = document.getElementById('btn-distribute');
    const btnReveal = document.getElementById('btn-reveal');
    const selectedCount = distributionSelection.length; 
    
    if(!btnDistribute || !btnReveal) return; 

    if (playerCount > 0 && selectedCount === playerCount) {
        btnDistribute.disabled = false;
        btnDistribute.style.background = "linear-gradient(135deg, #d4af37, #b8941f)";
        btnDistribute.style.cursor = "pointer";
        btnDistribute.innerHTML = isDraftMode ? "🃏 REMÉLANGER" : "🃏 PRÉPARER LA DISTRIBUTION";
        
        btnReveal.disabled = false;
        btnReveal.style.background = "#27ae60"; 
        btnReveal.style.cursor = "pointer";
    } else {
        btnDistribute.disabled = true;
        btnDistribute.style.background = "grey";
        btnDistribute.style.cursor = "not-allowed";
        btnDistribute.innerHTML = `Attente (${playerCount}J / ${selectedCount}R)`;
        
        btnReveal.disabled = true;
        btnReveal.style.background = "grey";
        btnReveal.style.cursor = "not-allowed";
    }
    btnReveal.style.display = isDraftMode ? "block" : "none";
}

/* ============================================
   11. PANINI JOUEUR (ADMIN)
   ============================================ */

window.openAdminPlayerDetail = function(pid, name, roleId, isDead, avatarSrc, isMayor) {
    const modal = document.getElementById('modal-player-detail');
    if(!modal) return;

    currentlyOpenedPlayerId = pid; 

    const players = currentPlayersData || {};
    const fullData = players[pid]; 
    refreshAdminPlayerContent(pid, name, roleId, isDead, avatarSrc, isMayor, fullData);

    // FIX Z-INDEX : Doit être supérieur au panel (99999)
    modal.style.zIndex = "100005";
    window.openModal('modal-player-detail');
};

window.refreshAdminPlayerContent = function(pid, name, roleId, isDead, avatarSrc, isMayor, fullData) {
    const pPseudo = document.getElementById('detail-pseudo');
    // On cible le WRAPPER (le conteneur) au lieu de l'image directe
    const pAvatarWrapper = document.getElementById('detail-avatar-wrapper'); 
    
    const pRoleName = document.getElementById('detail-role-name');
    const pCard = document.getElementById('detail-card');
    const pStatus = document.getElementById('detail-status');
    const pActions = document.getElementById('detail-actions');

    if(pPseudo) pPseudo.innerText = name;
    
    // FIX PHOTO : On injecte la grande photo (150px) dans le wrapper propre
    if(pAvatarWrapper) {
        const avatarContainer = generateAvatarWithBadges(fullData || {name:name, avatar:avatarSrc, isMayor:isMayor}, "150px", "4px solid var(--gold)");
        pAvatarWrapper.innerHTML = avatarContainer;
    }
    
    let displayImage = "back.webp";
    let displayName = "Aucun rôle";

    const r = detectedRoles.find(x => x.id === roleId);
    if(r) {
        displayImage = r.image;
        displayName = r.title;
    }

    if (fullData && fullData.drawnCard && fullData.drawnCard.image) {
        displayImage = fullData.drawnCard.image;
    }

    if(pRoleName) pRoleName.innerText = displayName;
    if(pCard) pCard.src = displayImage;

    if(pStatus) {
        if(isDead) {
            pStatus.innerText = "MORT";
            pStatus.style.color = "#c0392b";
        } else {
            pStatus.innerText = "VIVANT";
            pStatus.style.color = "#2ecc71";
        }
    }

    if(pActions) {
        pActions.innerHTML = ""; 
        
        const btnState = document.createElement('button');
        btnState.className = isDead ? "btn-validate" : "btn-submit"; 
        btnState.style.background = isDead ? "#27ae60" : "#c0392b";
        btnState.style.color = "white";
        btnState.innerText = isDead ? "💊 RESSUSCITER" : "☠️ TUER";
        btnState.onclick = () => window.togglePlayerStatus(pid, isDead ? 'alive' : 'dead');
        pActions.appendChild(btnState);

        const btnMayor = document.createElement('button');
        btnMayor.className = "btn-submit";
        btnMayor.style.background = isMayor ? "#7f8c8d" : "#f1c40f";
        btnMayor.style.color = isMayor ? "white" : "black";
        btnMayor.innerText = isMayor ? "❌ DESTITUER" : "🎖️ NOMMER MAIRE";
        btnMayor.onclick = () => window.toggleMayor(pid, !isMayor);
        pActions.appendChild(btnMayor);

        const btnChangeRole = document.createElement('button');
        btnChangeRole.className = "btn-submit";
        btnChangeRole.style.cssText = "background:#3498db; color:white; grid-column: 1 / -1;";
        btnChangeRole.innerText = "🎭 CHANGER RÔLE";
        btnChangeRole.onclick = () => window.openResurrectModal(pid);
        pActions.appendChild(btnChangeRole);

        if(isDead) {
            const categories = [
                {id:'gold', label:'VM OR', color:'gold'},
                {id:'silver', label:'VM ARGENT', color:'silver'},
                {id:'bronze', label:'VM BRONZE', color:'#cd7f32'}
            ];
            categories.forEach(cat => {
                const btn = document.createElement('button');
                btn.style.cssText = `background:transparent; border:1px solid ${cat.color}; color:${cat.color}; padding:8px; border-radius:5px; cursor:pointer; font-size:0.9em; font-family:'Pirata One'; font-weight:bold;`;
                btn.innerHTML = cat.label;
                btn.onclick = () => window.openEventSelector(pid, cat.id);
                pActions.appendChild(btn);
            });
        }

        // --- NOUVEAU : BOUTON KICK ---
        const btnKick = document.createElement('button');
        btnKick.className = "btn-submit";
        btnKick.style.cssText = "background:#111; color:#e74c3c; border:1px solid #c0392b; grid-column: 1 / -1; margin-top:15px; opacity:0.8;";
        btnKick.innerHTML = "🚫 EXPULSER (KICK)";
        btnKick.onclick = () => window.kickPlayer(pid);
        pActions.appendChild(btnKick);
    }
};

window.internalCloseDetails = function() {
    currentlyOpenedPlayerId = null; 
    const panel = document.querySelector('.details-panel');
    const overlay = document.querySelector('.details-overlay');
    if(panel) panel.classList.remove('active');
    if(overlay) overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
};

/* ============================================
   12. GAME ACTIONS (MORT, MAIRE)
   ============================================ */

window.checkLinkedDeaths = function(pid, isKilling) {
    if (!isKilling) return; 

    const victim = currentPlayersData[pid];
    if (!victim || !victim.attributes) return;

    const updates = {};
    let triggered = false;

    // AMOUREUX
    const loverKey = Object.keys(victim.attributes).find(k => k.startsWith('lover_by_'));
    if (loverKey) {
        Object.entries(currentPlayersData).forEach(([otherPid, p]) => {
            if (otherPid !== pid && p.status !== 'dead' && p.attributes && p.attributes[loverKey]) {
                if(confirm(`💔 ${victim.name} est mort(e) ! Son amoureux(se) ${p.name} doit-il/elle mourir aussi ?`)) {
                    updates[`games/${currentGameCode}/players/${otherPid}/status`] = 'dead';
                    triggered = true;
                }
            }
        });
    }

    // LOUP ROUGE
    const redLinkKey = Object.keys(victim.attributes).find(k => k.startsWith('linked_red_by_'));
    if (redLinkKey) {
        const wolfId = redLinkKey.replace('linked_red_by_', '');
        const wolf = currentPlayersData[wolfId];
        if (wolf && wolf.status !== 'dead') {
            if(confirm(`🩸 ${victim.name} était le Cœur de ${wolf.name} (Loup Rouge). Tuer le Loup Rouge ?`)) {
                updates[`games/${currentGameCode}/players/${wolfId}/status`] = 'dead';
                triggered = true;
            }
        }
    }

    if (triggered) {
        update(ref(db), updates);
    }
};

window.togglePlayerStatus = function(pid, newStatus) {
    const isKilling = newStatus === 'dead';
    update(ref(db, `games/${currentGameCode}/players/${pid}`), { status: newStatus }).then(() => {
        if (isKilling) {
            window.checkLinkedDeaths(pid, true);
        }
        internalShowNotification("Mise à jour", `Joueur ${isKilling ? 'éliminé' : 'ressuscité'}.`);
    });
};

window.toggleMayor = function(pid, isMayor) {
    const updates = {};
    if(isMayor) {
        Object.keys(currentPlayersData).forEach(p => {
            updates[`games/${currentGameCode}/players/${p}/isMayor`] = false;
        });
    }
    updates[`games/${currentGameCode}/players/${pid}/isMayor`] = isMayor;
    
    update(ref(db), updates).then(() => {
        internalShowNotification("Maire", isMayor ? "Nouveau Maire nommé !" : "Maire destitué.");
    });
};

/* ============================================
   13. CÔTÉ JOUEUR (JOIN, LISTEN, CLEANUP)
   ============================================ */

// 1. NETTOYAGE DES ÉCOUTEURS (Anti-Fantôme)
function cleanupListeners() {
    if (unsubscribeVote) { unsubscribeVote(); unsubscribeVote = null; }
    if (unsubscribePlayer) { unsubscribePlayer(); unsubscribePlayer = null; }
    if (unsubscribeGlobal) { unsubscribeGlobal(); unsubscribeGlobal = null; }
    
    // On nettoie aussi l'interface visuelle du vote
    const existingOverlay = document.getElementById('vote-overlay-ui');
    if(existingOverlay) {
        existingOverlay.remove();
        document.body.style.overflow = '';
    }
}

// 2. RESTAURATION SESSION (Avec nettoyage préalable)
window.restorePlayerSession = function(code, id) {
    cleanupListeners(); // <--- COUPURE NETTE
    
    // IMPORTANT : On remet la variable à zéro par défaut !
    cardsLockedState = false; 

    currentGameCode = code;
    myPlayerId = id;
    get(child(ref(db), `games/${code}/players/${id}`)).then((snapshot) => {
        if(snapshot.exists()) {
            document.getElementById('btn-join-action').style.display = 'none';
            const lobbyStatus = document.getElementById('player-lobby-status');
            if(lobbyStatus) lobbyStatus.style.display = 'block';
            
            if(window.closeModal) window.closeModal('modal-online-menu'); 
            if(window.openModal) window.openModal('modal-join-game');            
            
            // LANCE LES ÉCOUTEURS
            listenForPlayerUpdates(); 
            listenToGlobalPlayers();  
            listenForVoteState();      
            listenForGameSettings(); 
        } else {
            internalShowNotification("Info", "Partie terminée ou expirée.");
            localStorage.removeItem('vm_player_code');
            localStorage.removeItem('vm_player_id');
            location.reload();
        }
    });
};

// 3. ÉCOUTE LISTE JOUEURS (Live update pour Résurrection)
function listenToGlobalPlayers() {
    if (unsubscribeGlobal) unsubscribeGlobal();
    const allPlayersRef = ref(db, `games/${currentGameCode}/players`);
    
    unsubscribeGlobal = onValue(allPlayersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            currentPlayersData = data; 
            // Si un vote est en cours, on rafraîchit l'interface
            if (window.currentVoteData && window.currentVoteData.status === 'voting') {
                renderVoteInterface(); 
            }
        }
    });
}

// ============================================
// GESTION DU BLOCAGE (CORRECTION DÉFINITIVE)
// ============================================

// 1. Nouvelle fonction pour forcer l'aspect visuel du cadenas
window.refreshLockVisuals = function() {
    const cardEl = document.querySelector('.details-panel .carte-jeu');
    
    // Si pas de carte ou si le joueur est mort, on ne fait rien
    if (!cardEl || cardEl.classList.contains('dead-card')) return;

    if (cardsLockedState) {
        // C'EST BLOQUÉ : On force le dos et on met le cadenas
        if (cardEl.classList.contains('flipped')) {
            cardEl.classList.remove('flipped');
        }
        cardEl.classList.add('locked-by-mj');
    } else {
        // C'EST LIBRE : On enlève juste le cadenas
        cardEl.classList.remove('locked-by-mj');
    }
};

// 2. Fonction MJ pour basculer le verrou (Avec Set pour Firebase)
window.toggleCardLock = function() {
    const newState = !cardsLockedState;
    set(ref(db, `games/${currentGameCode}/cardsLocked`), newState).then(() => {
        internalShowNotification("Admin", newState ? "Cartes BLOQUÉES" : "Cartes DÉBLOQUÉES");
        if(typeof generateDashboardControls === 'function') generateDashboardControls(); 
    });
};

// 3. L'Écouteur Firebase
function listenForGameSettings() {
    onValue(ref(db, `games/${currentGameCode}/cardsLocked`), (snapshot) => {
        cardsLockedState = snapshot.val() || false;
        
        // Mise à jour immédiate du bouton MJ si on est l'admin
        if (myPlayerId === 'MJ_ADMIN') {
            const btnBlock = document.getElementById('btn-block-cards');
            if (btnBlock) {
                if (cardsLockedState) {
                    btnBlock.style.background = "#c0392b";
                    btnBlock.style.border = "2px solid white";
                    btnBlock.innerHTML = "🔒 UNLOCK CARD";
                } else {
                    btnBlock.style.background = "#27ae60";
                    btnBlock.style.border = "1px solid #2ecc71";
                    btnBlock.innerHTML = "🔓 BLOCK CARD LIBRE";
                }
            }
        } 
        // Mise à jour interface JOUEUR
        else {
            window.refreshLockVisuals();
        }
    });
}

// 4. REJOINDRE LA PARTIE
function joinGame() {
    const pseudo = document.getElementById('join-pseudo').value.trim();
    const code = document.getElementById('join-code').value.toUpperCase().trim();
    const avatar = playerPhotoData || null; 
    
    if(!pseudo || !code) { 
        internalShowNotification("Erreur", "Pseudo & Code requis !");
        return; 
    }

    cleanupListeners(); // <--- COUPURE NETTE

    currentGameCode = code;
    get(child(ref(db), `games/${code}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const newPlayerRef = push(ref(db, `games/${code}/players`));
            myPlayerId = newPlayerRef.key;
            localStorage.setItem('vm_player_code', currentGameCode);
            localStorage.setItem('vm_player_id', myPlayerId);
            localStorage.setItem('vm_player_name', pseudo);
            set(newPlayerRef, { name: pseudo, role: null, status: 'alive', avatar: avatar }).then(() => {
                document.getElementById('btn-join-action').style.display = 'none';
                const lobbyStatus = document.getElementById('player-lobby-status');
                if(lobbyStatus) lobbyStatus.style.display = 'block';
                
                // LANCE LES ÉCOUTEURS
                listenForPlayerUpdates();
                listenToGlobalPlayers(); 
                listenForVoteState();      
                listenForGameSettings(); 
            });
        } else { 
            internalShowNotification("Erreur", "Code partie introuvable !");
        }
    });
}

// 5. ÉCOUTE MISES À JOUR JOUEUR (Rôle, Mort, Carte, Menu)
function listenForPlayerUpdates() {
    if (unsubscribePlayer) unsubscribePlayer(); 
    const myPlayerRef = ref(db, `games/${currentGameCode}/players/${myPlayerId}`);
    let lastRole = null;
    let lastCardImg = null;
    let currentAttributes = {}; 
    let lastMayor = false;
    
    unsubscribePlayer = onValue(myPlayerRef, (snapshot) => {
        const data = snapshot.val();
        
        // --- DETECTION EXPULSION (KICK) ---
        if (!data) {
            document.body.innerHTML = `
                <div style="height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; background:#111; color:white; font-family:'Pirata One'; text-align:center; padding:20px;">
                    <h1 style="color:#c0392b; font-size:3em; margin:0;">🚫 EXPULSÉ</h1>
                    <p style="font-size:1.5em; margin:20px; color:#aaa;">Le Maître du Jeu t'a retiré de la partie.</p>
                    <button onclick="location.reload()" style="padding:15px 30px; background:var(--gold); border:none; color:black; font-family:'Pirata One'; font-size:1.5em; cursor:pointer; border-radius:8px;">RETOUR AU MENU</button>
                </div>
            `;
            localStorage.removeItem('vm_player_code');
            localStorage.removeItem('vm_player_id');
            return;
        }

        // BOUTON MENU
        const menuBtn = document.getElementById('menu-my-card-li');
        if (!data || !data.role) {
            if(menuBtn) menuBtn.style.display = 'none';
        } else {
            if(menuBtn) menuBtn.style.display = 'block';
        }

        const currentStatus = data.status || 'alive';
        const panel = document.querySelector('.details-panel');
        const overlay = document.querySelector('.details-overlay');

        let uiHtml = "";

        if (currentStatus === 'dead') {
            document.body.classList.add('dead-state'); 
            uiHtml += `<h1 style="color:#c0392b; font-size:3em; text-align:center;">TU ES MORT 💀</h1>`;
            const cardEl = document.querySelector('#online-content-wrapper .carte-jeu');
            if(cardEl) {
                cardEl.style.filter = "grayscale(100%)";
                cardEl.classList.remove('flipped'); 
                cardEl.onclick = null; 
            }
        } else {
            document.body.classList.remove('dead-state');
            uiHtml += `<h3 style="color:var(--gold);">Tu es en jeu !</h3>`;
            
            const cardEl = document.querySelector('#online-content-wrapper .carte-jeu');
            if(cardEl) {
                cardEl.style.filter = "none";
                
                // GESTION CLIC + BLOCAGE MJ (MODIFIÉ : PLUS DE NOTIF)
                cardEl.onclick = function() { 
                    if(cardsLockedState) {
                        // Pas de notif, juste une vibration
                        if(navigator.vibrate) navigator.vibrate(100);
                        return;
                    }
                    this.classList.toggle('flipped'); 
                };
                
                if(cardsLockedState) {
                    cardEl.classList.remove('flipped');
                    cardEl.classList.add('locked-by-mj');
                } else {
                    cardEl.classList.remove('locked-by-mj');
                }
            }
        }

        if (data.role) {
            myCurrentRoleId = data.role;
            
            const isVisible = document.querySelector('.details-panel').classList.contains('active');
            
            if (data.role !== lastRole || data.isMayor !== lastMayor || !isVisible) { 
                lastRole = data.role; 
                lastMayor = data.isMayor;
                setTimeout(() => {
                    window.revealRole(data.role, currentStatus, data.isMayor);
                }, 200);
            }

            // AJOUT DU BOUTON CHANGEMENT PHOTO ICI
            uiHtml += `
            <div style="text-align:center; margin-bottom:15px; margin-top:10px;">
                <label for="update-avatar-input" style="cursor:pointer; display:inline-block; position:relative;">
                    <img src="${data.avatar || 'icon.webp'}" style="width:70px; height:70px; border-radius:50%; border:2px solid var(--gold); object-fit:cover;">
                    <div style="position:absolute; bottom:0; right:0; background:var(--gold); color:black; border-radius:50%; width:22px; height:22px; font-size:12px; line-height:22px; border:1px solid black;">✏️</div>
                </label>
                <input type="file" id="update-avatar-input" style="display:none;" accept="image/*" onchange="window.uploadNewAvatar(this)">
                <div style="font-size:0.8em; color:#aaa; margin-top:5px;">${data.name}</div>
            </div>

            <div style="margin:20px 0;">
                <button class="btn-menu" style="background:var(--gold); color:black; font-weight:bold; padding:15px; width:100%; border:2px solid #fff;" onclick="window.revealRole('${data.role}', '${currentStatus}', ${data.isMayor})">
                    🃏 VOIR MA CARTE
                </button>
            </div>`;
            
            const lobbyStatus = document.getElementById('player-lobby-status');
            if(lobbyStatus) lobbyStatus.innerHTML = uiHtml;
        }

        if (data.drawnCard && data.drawnCard.image !== lastCardImg) {
            lastCardImg = data.drawnCard.image;
            let backImage = "back.webp"; 
            const cat = data.drawnCard.category ? data.drawnCard.category.toUpperCase() : "";
            if (cat.includes('GOLD') || cat.includes('OR')) backImage = "back_or.webp";
            else if (cat.includes('SILVER') || cat.includes('ARGENT')) backImage = "back_argent.webp";
            else if (cat.includes('BRONZE')) backImage = "back_bronze.webp";
            
            if(panel && overlay) {
                panel.style.padding = "0"; 
                panel.innerHTML = `
                <div id="online-content-wrapper" style="width:100%; height:100dvh; display:flex; flex-direction:column; justify-content:center; align-items:center; position:relative;">
                    <button class="close-details" onclick="window.internalCloseDetails()" style="position:absolute; top:20px; right:20px; z-index:100; background:rgba(0,0,0,0.6); color:white; border:1px solid gold; border-radius:50%; width:40px; height:40px; font-size:20px;">✕</button>
                    <div class="carte-jeu visible" onclick="this.classList.toggle('flipped')" style="width:300px; height:450px; margin:0; transform:translateY(0); opacity:1; flex-shrink:0;">
                        <div class="carte-inner">
                            <div class="carte-front"><img src="${backImage}" style="width:100%; height:100%; object-fit:cover;"></div>
                            <div class="carte-back" style="padding:0;"><img src="${data.drawnCard.image}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;"></div>
                        </div>
                    </div>
                </div>`;
                panel.classList.add('active'); 
                overlay.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        }

        if (JSON.stringify(data.attributes) !== JSON.stringify(currentAttributes)) {
            currentAttributes = data.attributes || {};
            window.updateCardBackEmojis(currentAttributes);
        }
    });
}

// 6. AFFICHAGE CARTE (CORRIGÉ : VARIABLE clickAction + FIX MATCHING RÔLE)
window.revealRole = function(roleId, status, isMayor) {
    // 1. On récupère les données du rôle (FIX : on cherche l'ID exact ou en majuscule)
    let roleData = detectedRoles.find(r => r.id === roleId);

    if (!roleData && typeof paniniRoles !== 'undefined') {
        roleData = paniniRoles.find(r => r.id === roleId || r.id === roleId.toUpperCase());
    }

    if(!roleData) {
        console.warn("Rôle introuvable pour l'affichage :", roleId);
        return;
    }

    const panel = document.querySelector('.details-panel');
    const overlay = document.querySelector('.details-overlay');
    
    // 2. Préparation des classes (Mort / Blocage MJ)
    const isDead = status === 'dead';
    const lockedClass = (window.cardsLockedState) ? "locked-by-mj" : ""; 
    const deadClass = isDead ? "dead-card" : "";
    
    // 3. Construction HTML
    panel.innerHTML = `
    <div id="online-content-wrapper" style="width:100%; height:100dvh; display:flex; flex-direction:column; justify-content:center; align-items:center;">
        <button class="close-details" onclick="window.internalCloseDetails()" style="position:absolute; top:20px; right:20px; z-index:100; background:rgba(0,0,0,0.6); color:white; border:1px solid gold; border-radius:50%; width:40px; height:40px;">✕</button>
        <div class="carte-jeu visible ${lockedClass} ${deadClass}" onclick="window.handleCardClick(this)" style="width:300px; height:450px;">
            <div class="carte-inner">
                <div class="carte-front">
                    <img src="back.webp" style="width:100%; height:100%; object-fit:cover;">
                    ${isMayor ? '<div style="position:absolute; top:-10px; left:-10px; font-size:3.5em; z-index:100;">🎖️</div>' : ''}
                </div>
                <div class="carte-back" style="padding:0;">
                    <img src="${roleData.image}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">
                </div>
            </div>
        </div>
        <p style="color:white; margin-top:20px; font-family:'Pirata One'; font-size:1.5em;">${isDead ? "TU ES MORT" : "CLIQUE POUR RETOURNER"}</p>
    </div>`;
    
    // 4. Affichage
    panel.style.zIndex = "200000";
    overlay.style.zIndex = "199999";

    panel.classList.add('active'); 
    overlay.classList.add('active');
    document.body.classList.add('no-scroll');
    
    // 5. Application immédiate du verrouillage visuel
    if(window.refreshLockVisuals) window.refreshLockVisuals();
};

/* ============================================
   14. NOTIFICATIONS
   ============================================ */

function internalShowNotification(title, message) { 
    if(window.showNotification) window.showNotification(title, message);
    else alert(title + "\n" + message); 
}

/* ============================================
   15. INTERACTIONS & ACTION SELECTOR (MARABOUT ILLIMITÉ)
   ============================================ */

let currentSelection = []; 
let maxSelection = 1;       

// NOTE : La fonction getBadgesHTML a été supprimée car remplacée par generateBadgesHTML (Bloc 4)

window.openPlayerSelectorForAction = function(sourceRoleId, sourcePlayerId) {
    actionSourceRole = sourceRoleId;
    actionSourceId = sourcePlayerId;
    currentSelection = []; 

    const players = currentPlayersData || {};
    const aliveCount = Object.values(players).filter(p => p.status !== 'dead').length;

    // 1. DÉFINITION DES LIMITES
    if (sourceRoleId === 'l_orphelin') {
        maxSelection = 2; 
    } 
    else if (sourceRoleId === 'le_marabout') {
        maxSelection = aliveCount; // Marabout illimité
    }
    else {
        maxSelection = 1;
    }

    const modal = document.getElementById('modal-role-selector');
    if(!modal) return;

    const sourcePlayer = players[sourcePlayerId];
    const sourceRoleName = detectedRoles.find(r=>r.id===sourceRoleId)?.title || 'Action';

    const h2 = modal.querySelector('h2');
    if(h2) h2.style.display = 'none';
    modal.querySelectorAll('p').forEach(p => p.style.display = 'none');

    const grid = document.getElementById('admin-role-grid');
    grid.innerHTML = "";
    
    // --- PRÉ-SÉLECTION AUTOMATIQUE (CORRIGÉE AVEC ALPHA) ---
    Object.entries(players).forEach(([pid, p]) => {
        if (!p.attributes) return;
        const attrs = Object.keys(p.attributes);
        let isSelected = false;

        if (sourceRoleId === 'l_orphelin' && attrs.some(k => k.startsWith('lover_'))) isSelected = true;
        else if (sourceRoleId === 'le_loup_garou_rouge' && attrs.some(k => k.startsWith(`linked_red_by_${sourcePlayerId}`))) isSelected = true;
        else if (sourceRoleId === 'target' && attrs.some(k => k.startsWith(`target_mirror_by_${sourcePlayerId}`))) isSelected = true;
        
        // ICI : On remet bien l'Alpha avec le Papa Loup
        else if ((sourceRoleId === 'le_papa_des_loups' || sourceRoleId === 'le_loup_garou_alpha') && attrs.some(k => k.startsWith('infected'))) isSelected = true;
        
        else if (sourceRoleId === 'le_chuchoteur' && attrs.some(k => k.startsWith('silenced'))) isSelected = true;
        else if ((sourceRoleId === 'le_marabout' || sourceRoleId === 'le_gourou') && attrs.some(k => k.startsWith('bewitched'))) isSelected = true;

        if (isSelected) currentSelection.push(pid);
    });
    // -------------------------------------------

    // HEADER AVEC PSEUDO
    const headerDiv = document.createElement('div');
    headerDiv.className = "initiator-header";
    headerDiv.innerHTML = `
        <div style="display:flex; align-items:center; gap:15px;">
            ${generateAvatarWithBadges(sourcePlayer, "50px", "2px solid white")}
            <div style="text-align:left;">
                <div style="color:white; font-family:'Pirata One'; font-size:1.3em; line-height:1;">${sourceRoleName}</div>
                <div style="color:var(--gold); font-size:1em; font-weight:bold;">${sourcePlayer.name}</div>
                <div style="color:#ccc; font-size:0.8em; margin-top:3px;">Choisis <span id="selection-counter" style="color:#2ecc71; font-weight:bold;">${currentSelection.length}</span>/${maxSelection}</div>
            </div>
        </div>
    `;
    grid.appendChild(headerDiv);

    // GRILLE DES CIBLES
    const alivePlayers = Object.entries(players).filter(([id, p]) => p.status !== 'dead');
    const container = document.createElement('div');
    container.className = "action-grid";

    alivePlayers.forEach(([pid, p]) => {
        if (pid === sourcePlayerId && sourceRoleId === 'l_orphelin') return; 
        if (pid === sourcePlayerId) return; 

        const badges = generateBadgesHTML(p); 
        const targetRoleName = detectedRoles.find(r => r.id === (p.role || p.draftRole))?.title || "???";
        const isPreSelected = currentSelection.includes(pid);

        const card = document.createElement('div');
        card.className = `player-select-card ${isPreSelected ? 'selected' : ''}`; 
        card.id = `card-${pid}`;
        
        card.innerHTML = `
            <div style="position:relative; width:50px; height:50px; margin:0 auto; overflow:visible;">
                <img src="${p.avatar || 'icon.webp'}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
                ${badges}
            </div>
            <strong>${p.name}</strong>
            <small>${targetRoleName}</small>
        `;

        card.onclick = () => toggleSelection(pid, card);
        container.appendChild(card);
    });
    grid.appendChild(container);

    const btnValider = document.createElement('button');
    btnValider.className = "btn-confirm-action";
    btnValider.innerHTML = "VALIDER ✔";
    btnValider.onclick = confirmActionSelection;
    grid.appendChild(btnValider);

    modal.style.zIndex = "200000"; 
    window.openModal('modal-role-selector');
};

function toggleSelection(pid, cardElement) {
    if (currentSelection.includes(pid)) {
        currentSelection = currentSelection.filter(id => id !== pid);
        cardElement.classList.remove('selected');
    } else {
        if (currentSelection.length >= maxSelection) {
            const first = currentSelection.shift();
            const el = document.getElementById(`card-${first}`);
            if(el) el.classList.remove('selected');
        }
        currentSelection.push(pid);
        cardElement.classList.add('selected');
    }
    const counter = document.getElementById('selection-counter');
    if(counter) counter.innerText = currentSelection.length;
}

function confirmActionSelection() {
    if (actionSourceRole === 'l_orphelin' && currentSelection.length === 1) {
        if(!confirm("Tu n'as choisi qu'une seule personne pour le couple. Continuer ?")) return;
    }
    
    const updates = {};
    let msg = "Action effectuée.";
    const players = currentPlayersData || {};
    const isReset = currentSelection.length === 0; 

    // Nettoyage préalable des attributs
    const clearAttribute = (prefix) => {
        Object.entries(players).forEach(([pid, p]) => {
            if(p.attributes) {
                Object.keys(p.attributes).forEach(k => {
                    if(k.startsWith(prefix)) {
                        updates[`games/${currentGameCode}/players/${pid}/attributes/${k}`] = null;
                    }
                });
            }
        });
    };

    // 1. ORPHELIN
    if (actionSourceRole === 'l_orphelin') {
        clearAttribute('lover_'); 
        if (!isReset) {
            const coupleId = "couple_" + Date.now();
            currentSelection.forEach(pid => {
                updates[`games/${currentGameCode}/players/${pid}/attributes/lover_${coupleId}`] = true;
            });
            msg = "💘 Couple formé !";
        } else {
            msg = "💔 Couple annulé.";
        }
    }
    // 2. LOUP ROUGE
    else if (actionSourceRole === 'le_loup_garou_rouge') {
        clearAttribute(`linked_red_by_${actionSourceId}`);
        if (!isReset) {
            const targetId = currentSelection[0];
            updates[`games/${currentGameCode}/players/${targetId}/attributes/linked_red_by_${actionSourceId}`] = true;
            msg = "🩸 Cœur donné.";
        } else {
            msg = "🩸 Don de cœur annulé.";
        }
    }
    // 3. TARGET
    else if (actionSourceRole === 'target') {
        clearAttribute(`target_mirror_by_${actionSourceId}`);
        if (!isReset) {
            const targetId = currentSelection[0];
            updates[`games/${currentGameCode}/players/${targetId}/attributes/target_mirror_by_${actionSourceId}`] = true;
            msg = "🎯 Cible miroir définie.";
        } else {
            msg = "🎯 Cible annulée.";
        }
    }
    // 4. PAPA LOUP ET LOUP ALPHA (Même effet : Patte 🐾)
    else if (actionSourceRole === 'le_papa_des_loups' || actionSourceRole === 'le_loup_garou_alpha') {
        clearAttribute('infected'); 
        if (!isReset) {
            updates[`games/${currentGameCode}/players/${currentSelection[0]}/attributes/infected`] = true;
            msg = "🐾 Infection réussie.";
        } else {
            msg = "🐾 Infection annulée.";
        }
    }
    // 5. CHUCHOTEUR
    else if (actionSourceRole === 'le_chuchoteur') {
        clearAttribute('silenced');
        if (!isReset) {
            updates[`games/${currentGameCode}/players/${currentSelection[0]}/attributes/silenced`] = true;
            msg = "🤐 Silence imposé.";
        } else {
            msg = "🤐 Silence levé.";
        }
    }
    // 6. MARABOUT / GOUROU
    else if (actionSourceRole === 'le_marabout' || actionSourceRole === 'le_gourou') {
        clearAttribute('bewitched');
        if (!isReset) {
            currentSelection.forEach(pid => {
                 updates[`games/${currentGameCode}/players/${pid}/attributes/bewitched`] = true;
            });
            msg = "😵‍💫 Ensorcellement réussi.";
        } else {
            msg = "✨ Ensorcellement dissipé.";
        }
    }

    update(ref(db), updates).then(() => {
        internalShowNotification("Action Validée", msg);
        window.closeModal('modal-role-selector');
    });
}

// LOGIQUE MORT EN CHAINE
window.checkLinkedDeaths = function(victimId, isKilling) {
    if (!isKilling) return; 

    const players = currentPlayersData;
    const victim = players[victimId];
    if (!victim || !victim.attributes) return;

    const updates = {};
    let triggered = false;

    // A. GESTION AMOUREUX (Recursif)
    const loverAttr = Object.keys(victim.attributes).find(k => k.startsWith('lover_'));
    if (loverAttr) {
        Object.entries(players).forEach(([pid, p]) => {
            if (pid !== victimId && p.status !== 'dead' && p.attributes && p.attributes[loverAttr]) {
                if(confirm(`💔 ${victim.name} est mort(e) ! Son amoureux(se) ${p.name} doit-il mourir aussi ?`)) {
                    updates[`games/${currentGameCode}/players/${pid}/status`] = 'dead';
                    triggered = true;
                    setTimeout(() => window.checkLinkedDeaths(pid, true), 500);
                }
            }
        });
    }

    // B. GESTION LOUP ROUGE
    const redLinkAttr = Object.keys(victim.attributes).find(k => k.startsWith('linked_red_by_'));
    if (redLinkAttr) {
        const wolfId = redLinkAttr.replace('linked_red_by_', '');
        const wolf = players[wolfId];
        if (wolf && wolf.status !== 'dead') {
            if(confirm(`🩸 ${victim.name} (Porteur du Cœur) est mort(e). Le Loup Rouge (${wolf.name}) doit-il mourir ?`)) {
                updates[`games/${currentGameCode}/players/${wolfId}/status`] = 'dead';
                triggered = true;
            }
        }
    }

    if (triggered) {
        update(ref(db), updates);
    }
};

window.togglePlayerStatus = function(pid, newStatus) {
    const isKilling = newStatus === 'dead';
    const updates = {};
    updates[`games/${currentGameCode}/players/${pid}/status`] = newStatus;

    if (!isKilling) {
        if(confirm("Réinitialiser les pouvoirs de ce joueur (pour qu'il puisse rejouer à zéro) ?")) {
            updates[`games/${currentGameCode}/players/${pid}/attributes`] = null;
            updates[`games/${currentGameCode}/players/${pid}/drawnCard`] = null;
        }
    }

    update(ref(db), updates).then(() => {
        if (isKilling) window.checkLinkedDeaths(pid, true);
        internalShowNotification("Mise à jour", `Joueur ${isKilling ? 'éliminé' : 'ressuscité'}.`);
    });
};

/* ============================================
   16. SYSTÈME DE VOTE (FINAL & CORRIGÉ)
   ============================================ */

// ------------------------------------------------
// A. GESTION MJ (Panneau de contrôle)
// ------------------------------------------------

window.openVotePanel = function() {
    const grid = document.getElementById('admin-role-grid');
    if(!grid) return;
    
    // Config Modale
    const h2 = document.querySelector('#modal-role-selector h2');
    if(h2) { h2.style.display = 'block'; h2.innerText = "GÉRER LE VOTE"; }
    document.querySelectorAll('#modal-role-selector p').forEach(p => p.style.display = 'none');
    
    grid.innerHTML = "";
    grid.style.display = 'flex';
    grid.style.flexDirection = 'column';
    grid.style.gap = '15px';

    // ZONE INFO / PROGRESSION ADMIN
    const infoDiv = document.createElement('div');
    infoDiv.style.cssText = "text-align:center; color:#ccc; font-family:'Almendra'; font-size:1.1em; margin-bottom:10px;";
    infoDiv.id = "admin-vote-progress";
    infoDiv.innerHTML = "Chargement...";
    grid.appendChild(infoDiv);

    // 1. Bouton LANCER
    const btnStart = document.createElement('button');
    btnStart.className = "btn-submit";
    btnStart.style.background = "#27ae60";
    btnStart.innerHTML = "🗳️ LANCER LE VOTE";
    btnStart.onclick = () => window.updateVoteState('voting');
    grid.appendChild(btnStart);

    // 2. Bouton ARRÊTER & RÉVÉLER
    const btnReveal = document.createElement('button');
    btnReveal.className = "btn-submit";
    btnReveal.style.background = "#e67e22";
    btnReveal.innerHTML = "📢 RÉVÉLER LES RÉSULTATS";
    btnReveal.onclick = () => window.calculateAndRevealVotes();
    grid.appendChild(btnReveal);

    // 3. Bouton STOP (Retour jeu)
    const btnStop = document.createElement('button');
    btnStop.className = "btn-submit";
    btnStop.style.background = "#c0392b";
    btnStop.innerHTML = "❌ FIN DU VOTE (RETOUR JEU)";
    btnStop.onclick = () => window.updateVoteState('inactive');
    grid.appendChild(btnStop);

    document.getElementById('modal-role-selector').style.zIndex = "200000"; 
    window.openModal('modal-role-selector');

    // Écouteur AVANCÉ pour le MJ
    const votesRef = ref(db, `games/${currentGameCode}/vote/votes`);
    onValue(votesRef, (snapshot) => {
        const votes = snapshot.val() || {};
        const votersIds = Object.keys(votes);
        
        const alivePlayers = Object.entries(currentPlayersData)
            .filter(([id, p]) => p.status !== 'dead')
            .map(([id, p]) => ({id: id, name: p.name}));
            
        const totalAlive = alivePlayers.length;
        const count = votersIds.length;
        const percent = totalAlive > 0 ? (count / totalAlive) * 100 : 0;
        
        // Qui manque ?
        const missing = alivePlayers.filter(p => !votersIds.includes(p.id));
        let missingHtml = "";
        
        if (missing.length > 0 && missing.length < totalAlive) {
            missingHtml = `<div class="missing-voters-list">`;
            missing.forEach(m => { missingHtml += `<span class="missing-voter-badge">${m.name}</span>`; });
            missingHtml += `</div>`;
        } else if (count === totalAlive && totalAlive > 0) {
            missingHtml = `<div style="color:#2ecc71; font-weight:bold; margin-top:5px; animation:pulse 1s infinite;">✅ COMPLET (100%) - PRÊT À RÉVÉLER</div>`;
        }

        const info = document.getElementById('admin-vote-progress');
        if(info) {
            info.innerHTML = `
                <div style="font-size:1.5em; color:var(--gold); font-weight:bold;">${count} / ${totalAlive}</div>
                <div style="background:#333; height:10px; border-radius:5px; margin:5px 0; border:1px solid #555;">
                    <div style="height:100%; background:#27ae60; width:${percent}%; transition:width 0.3s;"></div>
                </div>
                ${missingHtml}
            `;
        }
    });
};

// ------------------------------------------------
// B. LOGIQUE DE MISE À JOUR ET RENDU
// ------------------------------------------------

// MISE À JOUR FIREBASE (MJ)
window.updateVoteState = function(newState, extraData = {}) {
    const updates = {};
    
    if(newState === 'inactive') {
        // SUPPRESSION TOTALE du noeud vote (Nettoyage radical)
        updates[`games/${currentGameCode}/vote`] = null;
    } else {
        // MISE A JOUR NORMALE
        updates[`games/${currentGameCode}/vote/status`] = newState;
        
        if(newState === 'voting') {
            updates[`games/${currentGameCode}/vote/votes`] = null;
            updates[`games/${currentGameCode}/vote/result`] = null;
        }
        
        Object.keys(extraData).forEach(k => {
            updates[`games/${currentGameCode}/vote/${k}`] = extraData[k];
        });
    }

    update(ref(db), updates).then(() => {
        if(newState === 'voting') internalShowNotification("Vote", "Le vote est ouvert !");
        if(newState === 'inactive') window.closeModal('modal-role-selector');
    });
};

// MOTEUR D'AFFICHAGE (Côté Joueur + MJ Résultats)
window.renderVoteInterface = function() {
    const voteData = window.currentVoteData;
    
    // --- CAS 1 : VOTE INACTIF OU FINI (BOUTON ROUGE) ---
    if (!voteData || voteData.status === 'inactive') {
        const overlay = document.getElementById('vote-overlay-ui');
        
        // 1. On supprime l'écran de vote/résultat
        if (overlay) overlay.remove();
        document.body.style.overflow = '';
        
        // 2. ON FORCE LA CARTE A SE RETOURNER (DOS VISIBLE)
        const playerCard = document.querySelector('.carte-jeu');
        if (playerCard) {
            playerCard.classList.remove('flipped'); 
        }
        
        // 3. On ferme les modales résiduelles
        window.internalCloseDetails();
        
        // 4. Si c'est le MJ, on ferme son menu de gestion
        if (myPlayerId === 'MJ_ADMIN') window.closeModal('modal-role-selector');
        return;
    }

    // Le MJ ADMIN ne voit pas l'interface de vote des joueurs (sauf resultats)
    if (myPlayerId === 'MJ_ADMIN' && voteData.status === 'voting') return;

    // Création du conteneur si absent
    let ui = document.getElementById('vote-overlay-ui');
    if (!ui) {
        const div = document.createElement('div');
        div.id = 'vote-overlay-ui';
        div.className = 'vote-overlay';
        document.body.appendChild(div);
        document.body.style.overflow = 'hidden';
        ui = div;
    }

    // --- CAS 2 : PHASE DE VOTE (Joueurs) ---
    if (voteData.status === 'voting') {
        window.internalCloseDetails(); 

        const myVote = (voteData.votes && voteData.votes[myPlayerId]) ? voteData.votes[myPlayerId] : null;
        // Le calcul inclut maintenant correctement les ressuscités
        const totalAlive = Object.values(currentPlayersData).filter(p => p.status !== 'dead').length;
        const currentVotesCount = voteData.votes ? Object.keys(voteData.votes).length : 0;
        const percent = totalAlive > 0 ? Math.min(100, (currentVotesCount / totalAlive) * 100) : 0;
        
        const isVoteComplete = (currentVotesCount >= totalAlive && totalAlive > 0);
        let statusText = isVoteComplete ? "🔒 VOTES COMPLETS - ATTENTE DU MJ" : `${currentVotesCount} / ${totalAlive} ont voté`;

        // SI JOUEUR EST MORT (Vraiment mort)
        if (currentPlayersData[myPlayerId]?.status === 'dead') {
            ui.innerHTML = `<h2 class="vote-title">VOTE EN COURS...</h2>
                            <div class="vote-progress-wrapper">
                                <div class="vote-progress-track"><div class="vote-progress-fill" style="width:${percent}%"></div></div>
                                <div class="vote-progress-text" style="color:#ccc;">${currentVotesCount} / ${totalAlive} ont voté</div>
                            </div>
                            <p style="color:#c0392b; text-align:center; margin-top:20px;">Les morts ne parlent pas...</p>`;
            return;
        }

        // SI JOUEUR VIVANT (Y compris Ressuscité)
        let html = `<h2 class="vote-title">QUI DOIT MOURIR ?</h2>
                    <div class="${isVoteComplete ? 'vote-status-message' : ''}">${isVoteComplete ? statusText : ''}</div>
                    <div class="vote-progress-wrapper">
                        <div class="vote-progress-track"><div class="vote-progress-fill" style="width:${percent}%"></div></div>
                        <div class="vote-progress-text" style="color:#ccc;">${currentVotesCount} / ${totalAlive} ont voté</div>
                    </div>`;

        html += `<div class="btn-vote-blanc ${myVote === 'vote_blanc' ? 'selected' : ''}" onclick="window.selectVoteTarget(this, 'vote_blanc')"><span>🏳️</span> VOTER BLANC</div>`;
        html += `<div class="vote-grid ${isVoteComplete ? 'locked' : ''}">`;
        
        Object.entries(currentPlayersData).forEach(([pid, p]) => {
            if (p.status !== 'dead') {
                html += `<div class="vote-card ${myVote === pid ? 'selected' : ''}" onclick="window.selectVoteTarget(this, '${pid}')">
                            <img src="${p.avatar || 'icon.webp'}"><span>${p.name}</span>
                         </div>`;
            }
        });
        html += `</div>`;
        ui.innerHTML = html;
    }

    // --- CAS 3 : RÉSULTATS (Joueurs + MJ) ---
    else if (voteData.status === 'revealed' || voteData.status === 'tie_break') {
        ui.innerHTML = "";
        
        // BOUTON SPÉCIAL MJ (CROIX ROUGE - FERMETURE LOCALE)
        if (myPlayerId === 'MJ_ADMIN') {
            const btnCloseLocal = document.createElement('button');
            btnCloseLocal.className = 'mj-floating-stop';
            btnCloseLocal.innerHTML = '❌ FIN DU VOTE';
            btnCloseLocal.style.background = "#c0392b"; 
            btnCloseLocal.onclick = function(e) {
                e.preventDefault(); e.stopPropagation(); 
                // 1. Ferme la fenêtre résultat UNIQUEMENT pour le MJ
                if(document.getElementById('vote-overlay-ui')) document.getElementById('vote-overlay-ui').remove();
                document.body.style.overflow = '';
                // 2. Rouvre le menu "Gérer le vote"
                window.openVotePanel();
            };
            ui.appendChild(btnCloseLocal);
        }

        const votes = voteData.votes || {};
        const scores = {};
        const votersByTarget = {};

        Object.entries(votes).forEach(([voterId, targetId]) => {
            if(!votersByTarget[targetId]) votersByTarget[targetId] = [];
            if(currentPlayersData[voterId]) votersByTarget[targetId].push(currentPlayersData[voterId]);
            scores[targetId] = (scores[targetId] || 0) + 1;
        });

        let title = "RÉSULTATS";
        const header = document.createElement('div');
        header.style.textAlign = "center"; header.style.marginBottom = "20px";

        if (voteData.status === 'tie_break') {
            title = "ÉGALITÉ ! LE MAIRE TRANCHE";
            header.innerHTML = `<h2 class="vote-title">${title}</h2>`;
        } else if (voteData.result) {
            const victim = currentPlayersData[voteData.result];
            if(victim) {
                header.innerHTML = `<img src="${victim.avatar || 'icon.webp'}" class="eliminated-photo"><h2 class="vote-title">${victim.name.toUpperCase()} EST ÉLIMINÉ(E)</h2>`;
            } else {
                header.innerHTML = `<h2 class="vote-title">PERSONNE N'EST ÉLIMINÉ</h2>`;
            }
        }
        ui.appendChild(header);

        const container = document.createElement('div');
        container.className = 'results-container';
        const sortedTargets = Object.keys(votersByTarget).sort((a,b) => (scores[b] - scores[a]) || (a==='vote_blanc'?1:0));

        sortedTargets.forEach(targetId => {
            const isBlanc = targetId === 'vote_blanc';
            const target = isBlanc ? { name: "BLANC", avatar: null } : currentPlayersData[targetId];
            if (!target && !isBlanc) return;

            const voters = votersByTarget[targetId];
            const isLeader = (voteData.status === 'tie_break' && voteData.tieCandidates?.includes(targetId)) || voteData.result === targetId;

            const col = document.createElement('div');
            col.className = `result-column ${isLeader ? 'leader' : ''} ${isBlanc ? 'blanc' : ''}`;
            
            let votersHtml = "";
            voters.forEach(v => votersHtml += `<img src="${v.avatar || 'icon.webp'}" class="voter-mini">`);
            let avatarHtml = isBlanc ? `<div style="width:80px; height:80px; border-radius:50%; border:3px solid #aaa; background:#fff; display:flex; align-items:center; justify-content:center; font-size:40px; margin-bottom:10px;">🏳️</div>` : `<img src="${target.avatar || 'icon.webp'}" class="accused-avatar">`;

            col.innerHTML = `${avatarHtml}<strong style="color:white; font-family:'Pirata One'; font-size:1.2em;">${target.name}</strong><div style="color:var(--gold); font-weight:bold;">${scores[targetId]} voix</div><div class="voters-stack">${votersHtml}</div>`;
            container.appendChild(col);
        });
        ui.appendChild(container);

        if (voteData.status === 'tie_break') {
            const me = currentPlayersData[myPlayerId];
            if ((me && me.isMayor && me.status !== 'dead') || myPlayerId === 'MJ_ADMIN') {
                const choiceDiv = document.createElement('div');
                choiceDiv.style.cssText = "position:fixed; bottom:20px; left:0; width:100%; text-align:center; padding:10px; background:rgba(0,0,0,0.9); z-index:60010; border-top:2px solid gold;";
                choiceDiv.innerHTML = `<h3 style="color:gold; margin:0 0 10px 0;">MAIRE, FAIS TON CHOIX</h3>`;
                const wrp = document.createElement('div');
                wrp.style.display = "flex"; wrp.style.justifyContent = "center"; wrp.style.gap = "20px";
                voteData.tieCandidates.forEach(cid => {
                    const cand = currentPlayersData[cid];
                    if(cand) {
                        const btn = document.createElement('button');
                        btn.style.cssText = "background:#c0392b; color:white; padding:10px 20px; border:2px solid white; border-radius:10px; font-family:'Pirata One'; font-size:1.2em; cursor:pointer;";
                        btn.innerHTML = `☠️ ${cand.name}`;
                        btn.onclick = () => window.mayorDecides(cid);
                        wrp.appendChild(btn);
                    }
                });
                choiceDiv.appendChild(wrp);
                ui.appendChild(choiceDiv);
            } else {
                ui.insertAdjacentHTML('beforeend', `<p style="color:#aaa; text-align:center; margin-top:20px;">En attente de la décision du Maire...</p>`);
            }
        }
    }
};

// ------------------------------------------------
// C. HELPERS & ECOUTEURS
// ------------------------------------------------

window.selectVoteTarget = function(el, pid) {
    if(el.closest('.vote-grid')?.classList.contains('locked')) return;
    document.querySelectorAll('.vote-card, .btn-vote-blanc').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    window.submitMyVote(pid);
};

window.calculateAndRevealVotes = function() {
    get(child(ref(db), `games/${currentGameCode}/vote/votes`)).then((snapshot) => {
        const votes = snapshot.val();
        
        if (!votes) {
            internalShowNotification("Vote", "⚠️ Aucun vote enregistré !");
            return;
        }

        window.closeModal('modal-role-selector');

        const scores = {};
        Object.values(votes).forEach(targetId => {
            scores[targetId] = (scores[targetId] || 0) + 1;
        });

        let maxVotes = 0;
        Object.keys(scores).forEach(targetId => { 
            if(targetId !== 'vote_blanc') {
                if(scores[targetId] > maxVotes) maxVotes = scores[targetId]; 
            }
        });

        if (maxVotes === 0) {
            window.updateVoteState('revealed', { result: null });
            return;
        }

        const leaders = Object.keys(scores).filter(id => id !== 'vote_blanc' && scores[id] === maxVotes);

        if (leaders.length === 1) {
            const victimId = leaders[0];
            const updates = {};
            updates[`games/${currentGameCode}/vote/status`] = 'revealed';
            updates[`games/${currentGameCode}/vote/result`] = victimId;
            updates[`games/${currentGameCode}/players/${victimId}/status`] = 'dead'; 
            
            update(ref(db), updates);
            setTimeout(() => window.checkLinkedDeaths(victimId, true), 1000);

        } else {
            window.updateVoteState('tie_break', { tieCandidates: leaders });
        }
    }).catch(err => {
        console.error(err);
        internalShowNotification("Erreur", "Problème technique calcul.");
    });
};

window.submitMyVote = function(targetId) {
    if(!targetId) return;
    set(ref(db, `games/${currentGameCode}/vote/votes/${myPlayerId}`), targetId)
    .catch((err) => { console.error("Erreur vote", err); });
};

window.mayorDecides = function(victimId) {
    const updates = {};
    updates[`games/${currentGameCode}/vote/status`] = 'revealed';
    updates[`games/${currentGameCode}/vote/result`] = victimId;
    updates[`games/${currentGameCode}/players/${victimId}/status`] = 'dead'; 
    
    update(ref(db), updates);
    setTimeout(() => window.checkLinkedDeaths(victimId, true), 1000);
};

// ECOUTEUR PRINCIPAL
function listenForVoteState() {
    if (unsubscribeVote) unsubscribeVote();
    unsubscribeVote = onValue(ref(db, `games/${currentGameCode}/vote`), (snapshot) => {
        window.currentVoteData = snapshot.val(); 
        renderVoteInterface(); 
    });
}

/* ============================================
   17. FONCTIONS OUTILS (RESET & VALIDATION OK)
   ============================================ */

// Fonction du bouton "OK" (Vert) dans la sélection
window.validateDistribution = function() {
    // 1. Fermer la modale
    const modal = document.getElementById('modal-role-selector');
    if(modal) {
        modal.classList.remove('active');
        modal.style.display = '';
        modal.style.zIndex = '';
    }
    window.closeModal('modal-role-selector');

    // 2. Mettre à jour l'affichage des boutons (Attente X rôles...)
    if(typeof generateDashboardControls === 'function') {
        generateDashboardControls();
    }
};

// Fonction du bouton "RESET" (Rouge)
window.resetGameToLobby = function() {
    if(!confirm("⚠️ ATTENTION : Cela va effacer tous les rôles, vider la sélection et remettre tous les joueurs en attente au Lobby.\n\nContinuer ?")) return;

    distributionSelection = [];
    isDraftMode = false;

    const updates = {};
    if(currentPlayersData) {
        Object.keys(currentPlayersData).forEach(pid => {
            updates[`games/${currentGameCode}/players/${pid}/role`] = null;
            updates[`games/${currentGameCode}/players/${pid}/draftRole`] = null;
            updates[`games/${currentGameCode}/players/${pid}/status`] = 'alive';
            updates[`games/${currentGameCode}/players/${pid}/attributes`] = null;
            updates[`games/${currentGameCode}/players/${pid}/drawnCard`] = null;
            updates[`games/${currentGameCode}/players/${pid}/isMayor`] = false;
        });
    }

    updates[`games/${currentGameCode}/vote`] = null;s
    
    // SÉCURITÉ : On débloque les cartes au Reset
    updates[`games/${currentGameCode}/cardsLocked`] = false; 

    update(ref(db), updates).then(() => {
        internalShowNotification("Reset", "Partie réinitialisée.");
        generateDashboardControls(); 
    });
};

/* ============================================
   18. FONCTION KICK (EXPULSION)
   ============================================ */
window.kickPlayer = function(pid) {
    // On demande confirmation avec un confirm natif (Seul le MJ le voit, c'est acceptable)
    if(confirm("⚠️ ATTENTION : Voulez-vous vraiment EXPULSER ce joueur de la partie ?\n\nIl sera déconnecté et supprimé de la liste.")) {
        
        remove(ref(db, `games/${currentGameCode}/players/${pid}`))
        .then(() => {
            internalShowNotification("Admin", "Joueur expulsé avec succès.");
            window.internalCloseDetails();
        })
        .catch((err) => {
            console.error("Erreur Kick:", err);
            internalShowNotification("Erreur", "Impossible d'expulser le joueur.");
        });
    }
};
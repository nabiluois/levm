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

// Variables Action
let actionSourceRole = null;
let actionSourceId = null;
let currentlyOpenedPlayerId = null; 

/* ============================================
   3. INITIALISATION & LISTENERS GLOBAUX
   ============================================ */

// ÉCOUTEUR DE CLIC UNIVERSEL (C'est lui qui fait marcher le bouton)
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'btn-create-game') {
        e.preventDefault();
        e.stopPropagation();

        const password = prompt("🔐 Mot de passe MJ :");
        if(password === "1234") { 
            // Appel de la fonction publique
            if (typeof window.initCreateGame === 'function') {
                window.initCreateGame(); 
            } else {
                alert("Erreur : Attends 2 secondes que le système charge.");
            }
        } else if (password !== null) { 
            alert("⛔ Mot de passe incorrect !");
        }
    }
});

// Initialisation classique
document.addEventListener('DOMContentLoaded', () => {
    try { scanContentFromHTML(); } catch(e) { console.error(e); }
    
    // Bouton Rejoindre
    const btnJoin = document.getElementById('btn-join-action');
    if(btnJoin) btnJoin.onclick = joinGame;

    // Reprise Session
    const savedAdminCode = localStorage.getItem('adminGameCode');
    if (savedAdminCode) { showResumeButton(savedAdminCode); }
    checkPlayerSession();
});

/* ============================================
   4. UTILITAIRES (AVATAR, SESSION, SCAN)
   ============================================ */

// FIX AVATAR : Image ronde + Emojis visibles (overflow visible)
function generateAvatarWithBadges(player, size = "60px", border = "2px solid var(--gold)") {
    const avatarSrc = player.avatar || "icon.png";
    const isMayor = player.isMayor;
    let iconsHtml = "";

    if (player.attributes) {
        const attrs = Object.keys(player.attributes);
        if (attrs.some(k => k.startsWith('lover'))) iconsHtml += `<span style="position:absolute; top:-5px; right:-5px; font-size:1.4em; text-shadow:0 0 2px black; z-index:50;">💘</span>`;
        if (attrs.some(k => k.startsWith('target'))) iconsHtml += `<span style="position:absolute; bottom:-5px; right:-5px; font-size:1.4em; text-shadow:0 0 2px black; z-index:50;">🎯</span>`;
        if (attrs.some(k => k.startsWith('infected'))) iconsHtml += `<span style="position:absolute; bottom:-5px; left:-5px; font-size:1.4em; text-shadow:0 0 2px black; z-index:50;">🐾</span>`;
        if (attrs.some(k => k.startsWith('linked_red'))) iconsHtml += `<span style="position:absolute; top:-5px; left:-5px; font-size:1.4em; text-shadow:0 0 2px black; z-index:50;">🩸</span>`;
        
        if (attrs.some(k => k.startsWith('silenced'))) iconsHtml += `<span style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:2em; z-index:60; opacity:0.9;">🤐</span>`;
        if (attrs.some(k => k.startsWith('bewitched'))) iconsHtml += `<span style="position:absolute; top:0; left:50%; transform:translateX(-50%); font-size:1.5em; z-index:50;">😵‍💫</span>`;
    }

    if (isMayor) {
        iconsHtml += `<span style="position:absolute; top:-15px; left:-10px; font-size:1.8em; z-index:70; filter:drop-shadow(0 2px 2px black);">🎖️</span>`;
    }

    return `
        <div class="admin-avatar-container" style="position:relative; width:${size}; height:${size}; min-width:${size}; overflow:visible;">
            <img src="${avatarSrc}" alt="Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%; border:${border}; display:block; background:#000;">
            ${iconsHtml}
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

function restorePlayerSession(code, id) {
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
        } else {
            internalShowNotification("Info", "Partie terminée ou expirée.");
            localStorage.removeItem('vm_player_code');
            localStorage.removeItem('vm_player_id');
            location.reload();
        }
    });
}

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

function scanContentFromHTML() {
    detectedRoles = [];
    detectedEvents = { gold: [], silver: [], bronze: [] };
    
    const cards = document.querySelectorAll('.carte-jeu');
    if (cards.length > 0) {
        cards.forEach((card) => {
            const imgTag = card.querySelector('.carte-front img');
            const titleTag = card.querySelector('.carte-back h3'); 
            const section = card.closest('section');
            const categoryId = section ? section.id : 'village'; 
            
            if (imgTag && titleTag) {
                const imgSrc = imgTag.getAttribute('src');
                const id = imgSrc.split('/').pop().replace(/\.[^/.]+$/, "");
                detectedRoles.push({ id: id, title: titleTag.innerText.trim(), image: imgSrc, category: categoryId });
                
                // PRÉCHARGEMENT IMMÉDIAT
                const preloadLink = new Image();
                preloadLink.src = imgSrc;
            }
        });
    }

    document.querySelectorAll('.carte-vm').forEach((card) => {
        const imgTag = card.querySelector('img');
        if (imgTag) {
            const imgSrc = imgTag.getAttribute('src');
            if (card.classList.contains('gold')) detectedEvents.gold.push(imgSrc);
            else if (card.classList.contains('silver')) detectedEvents.silver.push(imgSrc);
            else if (card.classList.contains('bronze')) detectedEvents.bronze.push(imgSrc);
            
            // PRÉCHARGEMENT IMMÉDIAT
            const preloadLink = new Image();
            preloadLink.src = imgSrc;
        }
    });
}

window.closeAdminPanel = function() {
    if(confirm("Quitter le mode Admin ?")) {
        localStorage.removeItem('adminGameCode');
        document.body.classList.remove('no-scroll'); 
        location.reload(); 
    }
};
/* ============================================
   5. ADMIN : INITIALISATION & CONNEXION
   ============================================ */

// 1. CRÉATION DE PARTIE (Accessible via window.initCreateGame)
// IMPORTANT : Le "window." est obligatoire pour que le bouton HTML le trouve
window.initCreateGame = function() {
    console.log("🚀 Lancement de la création...");

    // A. Génération du Code (4 lettres majuscules)
    currentGameCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    myPlayerId = "MJ_ADMIN";

    // B. Sauvegarde Locale
    localStorage.setItem('adminGameCode', currentGameCode);

    // C. Interface Immédiate
    launchAdminInterface();

    // D. Envoi Firebase (Création de la salle)
    set(ref(db, 'games/' + currentGameCode), {
        status: 'waiting',
        created_at: Date.now()
    }).then(() => {
        console.log("✅ Partie créée sur Firebase : " + currentGameCode);
        if(window.showNotification) internalShowNotification("Succès", "Salle " + currentGameCode + " ouverte !");
    }).catch((error) => {
        console.error("ERREUR FIREBASE:", error);
        alert("Erreur critique Firebase : " + error.message);
    });
};

// 2. RESTAURATION DE SESSION
window.restoreAdminSession = function(savedCode) {
    currentGameCode = savedCode;
    myPlayerId = "MJ_ADMIN";

    // Vérification si la partie existe encore
    get(child(ref(db), `games/${currentGameCode}`)).then((snapshot) => {
        if(snapshot.exists()) {
            if(window.showNotification) internalShowNotification("Admin", `Reconnexion réussie : ${currentGameCode}`);
            launchAdminInterface();
        } else {
            alert("Cette partie n'existe plus ou a expiré.");
            localStorage.removeItem('adminGameCode');
            location.reload();
        }
    }).catch((err) => {
        alert("Erreur de connexion : " + err.message);
    });
};

// 3. LANCEMENT DE L'INTERFACE ADMIN
function launchAdminInterface() {
    console.log("💻 Ouverture du Dashboard Admin");

    // Affichage du Code
    const codeDisplay = document.getElementById('game-code-display');
    if(codeDisplay) codeDisplay.innerText = currentGameCode;

    // Fermeture du menu
    if(window.closeModal) window.closeModal('modal-online-menu');

    // Affichage du Dashboard
    const adminDash = document.getElementById('admin-dashboard');
    if(adminDash) {
        adminDash.style.display = 'flex';
    } else {
        console.error("❌ ERREUR : Élément #admin-dashboard introuvable !");
        return;
    }

    // Verrouillage Scroll
    document.body.classList.add('no-scroll');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '0';

    // Démarrage des Écouteurs et Contrôles
    setupAdminListeners();
    if(typeof generateDashboardControls === 'function') {
        generateDashboardControls();
    }
}

// 4. ÉCOUTEURS FIREBASE (Mises à jour en temps réel)
function setupAdminListeners() {
    // A. Écoute des Joueurs
    onValue(ref(db, 'games/' + currentGameCode + '/players'), (snapshot) => {
        const players = snapshot.val() || {};
        currentPlayersData = players; // Mise à jour de la variable globale

        // Mise à jour de la liste visuelle
        if(typeof updateAdminUI === 'function') {
            updateAdminUI(players);
        }

        // Mise à jour temps réel d'un joueur ouvert (Panini)
        if (currentlyOpenedPlayerId && players[currentlyOpenedPlayerId]) {
            const p = players[currentlyOpenedPlayerId];
            const roleId = p.draftRole || p.role;
            const isDead = p.status === 'dead';
            // Appel sécurisé à refresh
            if(window.refreshAdminPlayerContent) {
                window.refreshAdminPlayerContent(currentlyOpenedPlayerId, p.name, roleId, isDead, p.avatar, p.isMayor, p);
            }
        }
    });

    // B. Surveillance Connexion
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

    distributionSelection = []; 
    Object.values(players).forEach(p => { 
        if(isDraft && p.draftRole) distributionSelection.push(p.draftRole);
        else if (!isDraft && p.role) distributionSelection.push(p.role);
    });

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

            gridHTML += `
                <div class="admin-player-card ${isDead ? 'dead' : ''}" style="position:relative; cursor:pointer;" onclick="window.openAdminPlayerDetail('${id}', '${p.name}', '${currentRoleId || ''}', ${isDead}, '${p.avatar}', ${p.isMayor})">
                    ${isDraft ? '<div style="background:#e67e22; color:white; font-size:0.6em; padding:2px 5px; border-radius:4px; position:absolute; top:3px; left:3px; z-index:10; font-weight:bold;">PROV.</div>' : ''}
                    
                    <div class="admin-avatar-container" style="border:none; width:auto; height:auto; background:transparent;">
                        ${avatarHtml}
                    </div>
                    
                    <strong style="font-size:0.9em;">${p.name}</strong>
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

function generateDashboardControls() {
    const container = document.getElementById('roles-selection-list');
    if(!container) return;
    
    container.innerHTML = "";
    container.style.border = "none";
    container.style.background = "transparent";
    container.style.maxHeight = "none";

    const wrapper = document.createElement('div');
    wrapper.className = "admin-controls-wrapper";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "8px";

    const btnTable = document.createElement('button');
    btnTable.className = "btn-admin-action";
    btnTable.style.cssText = "background:#34495e; color:#ecf0f1; border:1px solid #7f8c8d; padding:10px; width:100%; border-radius:6px; font-family:'Pirata One'; font-size:1.1em; cursor:pointer;";
    btnTable.innerHTML = `📊 TABLEAU DES RÔLES (<span id="ctrl-total">${distributionSelection.length}</span>)`;
    btnTable.onclick = () => window.openRoleSummaryPanel();
    wrapper.appendChild(btnTable);

    const btnSelect = document.createElement('button');
    btnSelect.className = "btn-admin-action";
    btnSelect.style.cssText = "background:#2c3e50; color:#bdc3c7; border:1px solid #7f8c8d; padding:10px; width:100%; border-radius:6px; font-family:'Pirata One'; font-size:1.1em; cursor:pointer;";
    btnSelect.innerHTML = "📂 RÔLES SÉLECTION";
    btnSelect.onclick = () => window.openDistributionSelector();
    wrapper.appendChild(btnSelect);

    const btnReset = document.createElement('button');
    btnReset.className = "btn-admin-action";
    btnReset.style.cssText = "background:#c0392b; color:white; border:1px solid #e74c3c; padding:8px; width:100%; border-radius:6px; font-family:'Pirata One'; font-size:1em; cursor:pointer; opacity:0.8;";
    btnReset.innerHTML = "🗑️ DÉSICÔNISER (RESET)";
    btnReset.onclick = () => window.resetGameToLobby();
    wrapper.appendChild(btnReset);

    const btnDistribute = document.createElement('button');
    btnDistribute.id = "btn-distribute";
    btnDistribute.className = "btn-admin-action";
    btnDistribute.style.cssText = "background:grey; color:white; border:none; padding:12px; width:100%; border-radius:6px; font-family:'Pirata One'; font-size:1.1em; margin-top:5px; transition:0.3s;";
    btnDistribute.disabled = true;
    btnDistribute.innerText = "ATTENTE...";
    btnDistribute.onclick = distributeRoles;
    wrapper.appendChild(btnDistribute);

    const btnReveal = document.createElement('button');
    btnReveal.id = "btn-reveal";
    btnReveal.className = "btn-admin-action";
    btnReveal.style.cssText = "background:grey; color:white; border:none; padding:12px; width:100%; border-radius:6px; font-family:'Pirata One'; font-size:1.1em; margin-top:5px; display:none;";
    btnReveal.innerText = "📢 RÉVÉLER À TOUS";
    btnReveal.disabled = true;
    btnReveal.onclick = revealRolesToEveryone;
    wrapper.appendChild(btnReveal);

    container.appendChild(wrapper);
    
    get(child(ref(db), `games/${currentGameCode}/players`)).then((snapshot) => {
        const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
        updateAdminButtons(count);
    });
}

window.resetGameToLobby = function() {
    if(!confirm("⚠️ ATTENTION : Cela va remettre TOUS les joueurs à l'état initial (vivants, sans rôle, sans maire). Êtes-vous sûr ?")) return;

    const updates = {};
    Object.keys(currentPlayersData).forEach(pid => {
        updates[`games/${currentGameCode}/players/${pid}/role`] = null;
        updates[`games/${currentGameCode}/players/${pid}/draftRole`] = null;
        updates[`games/${currentGameCode}/players/${pid}/status`] = 'alive';
        updates[`games/${currentGameCode}/players/${pid}/isMayor`] = false;
        updates[`games/${currentGameCode}/players/${pid}/attributes`] = null;
        updates[`games/${currentGameCode}/players/${pid}/drawnCard`] = null;
    });

    update(ref(db), updates).then(() => {
        internalShowNotification("Reset", "Le jeu a été réinitialisé.");
    });
};

/* ============================================
   7. TABLEAU RECAPITULATIF (CORRIGÉ V90 - CLICS)
   ============================================ */
window.openRoleSummaryPanel = function() {
    const rolesVillage = [];
    const rolesLoup = [];
    const rolesSolo = [];
    const rolesVampire = [];
    
    const interactiveRoles = ['l_orphelin', 'target', 'le_loup_garou_rouge', 'le_loup_garou_maudit', 'le_loup_garou_alpha', 'le_papa_des_loups', 'le_chuchoteur', 'le_marabout'];

    // Fonction de nettoyage pour éviter les bugs d'apostrophe
    const safeStr = (str) => str ? str.replace(/'/g, "\\'") : "";

    const createLine = (roleId, playerObj, playerId) => {
        const role = detectedRoles.find(r => r.id === roleId);
        if(!role) return null;
        
        let html = "";
        
        if (playerObj) {
            const isDead = playerObj.status === 'dead';
            // Style de base de la ligne
            const bgStyle = isDead 
                ? "background:#2c3e50; color:#95a5a6; border:1px solid #7f8c8d;" 
                : "background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,215,0,0.3);";
            
            const avatarHtml = generateAvatarWithBadges(playerObj, "50px");
            const safeName = safeStr(playerObj.name);
            const safeAvatar = safeStr(playerObj.avatar);

            // Bouton Action (Eclair)
            let actionBtn = "";
            if (interactiveRoles.includes(roleId) && !isDead) {
                actionBtn = `
                    <button class="action-btn-flash" onclick="event.stopPropagation(); window.openPlayerSelectorForAction('${roleId}', '${playerId}')">
                        ⚡
                    </button>
                `;
            }

            // Ligne Joueur Complète (Cliquable)
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

    const summaryHTML = `
        <div class="panini-admin-header">
            <h2 style="color:var(--gold); font-family:'Pirata One'; font-size:2em; margin:0;">RÉPARTITION</h2>
            <button class="close-details" onclick="window.internalCloseDetails()" style="position:absolute; right:0; top:0; background:transparent; border:none; color:gold; font-size:2em; cursor:pointer; pointer-events:auto; z-index:20002;">✕</button>
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
        
        // SECURITE JS : On force le Z-Index au max
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
    let cVillage = 0, cLoups = 0, cSolo = 0, total = 0;
    
    distributionSelection.forEach(id => {
        const role = detectedRoles.find(r => r.id === id);
        if (role) {
            if (role.category === 'village') cVillage++;
            else if (role.category === 'loups') cLoups++;
            else cSolo++; 
            total++;
        }
    });

    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    
    setTxt('pop-count-village', cVillage);
    setTxt('pop-count-loup', cLoups);
    setTxt('pop-count-solo', cSolo);
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
        dashboard.innerHTML = `
            <div class="dashboard-stats">
                <div class="stat-item"><img src="Village.svg"><span id="pop-count-village">0</span></div>
                <div class="stat-item"><img src="Loup.svg"><span id="pop-count-loup">0</span></div>
                <div class="stat-item"><img src="Solo.svg"><span id="pop-count-solo">0</span></div>
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
    document.getElementById('modal-role-selector').style.zIndex = "25000"; 
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
    const modal = document.getElementById('modal-role-selector');
    if(modal) {
        modal.style.display = '';
        modal.style.zIndex = '';
    }
    window.closeModal('modal-role-selector');
    generateDashboardControls(); 
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
        
        document.getElementById('modal-role-selector').style.zIndex = "25000"; 
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

    modal.style.zIndex = "20000";
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
    
    let displayImage = "back.png";
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
   13. CÔTÉ JOUEUR (JOIN, LISTEN)
   ============================================ */
function joinGame() {
    const pseudo = document.getElementById('join-pseudo').value.trim();
    const code = document.getElementById('join-code').value.toUpperCase().trim();
    const avatar = playerPhotoData || null; 
    if(!pseudo || !code) { 
        internalShowNotification("Erreur", "Pseudo & Code requis !");
        return; 
    }
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
                listenForPlayerUpdates();
            });
        } else { 
            internalShowNotification("Erreur", "Code partie introuvable !");
        }
    });
}

function listenForPlayerUpdates() {
    const myPlayerRef = ref(db, `games/${currentGameCode}/players/${myPlayerId}`);
    let lastRole = null;
    let lastCardImg = null;
    let currentAttributes = {}; 
    let currentStatus = 'alive';
    let lastMayor = false;
    
    onValue(myPlayerRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        
        currentStatus = data.status || 'alive';
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
                cardEl.onclick = function() { this.classList.toggle('flipped'); };
            }
        }

        if (data.role) {
            myCurrentRoleId = data.role; 
            
            if (data.role !== lastRole || data.isMayor !== lastMayor) { 
                lastRole = data.role; 
                lastMayor = data.isMayor;
                revealRole(data.role, currentStatus, data.isMayor); 
            }
            
            const btnColor = currentStatus === 'dead' ? '#555' : 'var(--gold)';
            const btnText = currentStatus === 'dead' ? '#999' : 'black';
            const btnLabel = currentStatus === 'dead' ? '🃏 VOIR MA CARTE (MÉMOIRE)' : '🃏 VOIR MA CARTE';
            
            uiHtml += `
            <div style="margin:20px 0;">
                <button class="btn-menu" style="background:${btnColor}; color:${btnText}; font-weight:bold; padding:15px; width:100%; border:2px solid #fff;" onclick="window.showMyRoleAgain()">
                    ${btnLabel}
                </button>
            </div>`;
            
            const lobbyStatus = document.getElementById('player-lobby-status');
            if(lobbyStatus) lobbyStatus.innerHTML = uiHtml;
        }

        if (data.drawnCard && data.drawnCard.image !== lastCardImg) {
            lastCardImg = data.drawnCard.image;
            let backImage = "back.png"; 
            const cat = data.drawnCard.category ? data.drawnCard.category.toUpperCase() : "";
            if (cat.includes('GOLD') || cat.includes('OR')) backImage = "back_or.png";
            else if (cat.includes('SILVER') || cat.includes('ARGENT')) backImage = "back_argant.png";
            else if (cat.includes('BRONZE')) backImage = "back_bronze.png";
            
            if(panel && overlay) {
                panel.innerHTML = `
                <div id="online-content-wrapper" style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <button class="close-details" onclick="window.internalCloseDetails()" style="position:absolute; top:20px; right:20px; z-index:100; background:rgba(0,0,0,0.6); color:white; border:1px solid gold; border-radius:50%; width:40px; height:40px; font-size:20px;">✕</button>
                    <div class="carte-jeu visible" onclick="this.classList.toggle('flipped')" style="width:300px; height:450px; margin:0 auto; transform:translateY(0); opacity:1;">
                        <div class="carte-inner">
                            <div class="carte-front"><img src="${backImage}" style="width:100%; height:100%; object-fit:cover;"></div>
                            <div class="carte-back" style="padding:0;"><img src="${data.drawnCard.image}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;"></div>
                        </div>
                    </div>
                </div>`;
                panel.classList.add('active'); overlay.classList.add('active');
            }
        }

        if (JSON.stringify(data.attributes) !== JSON.stringify(currentAttributes)) {
            currentAttributes = data.attributes || {};
            window.updateCardBackEmojis(currentAttributes);
        }
    });
}

window.showMyRoleAgain = function() { 
    if(!myCurrentRoleId) return; 
    get(child(ref(db), `games/${currentGameCode}/players/${myPlayerId}`)).then((snapshot) => {
        const d = snapshot.val();
        if(d) revealRole(d.role, d.status || 'alive', d.isMayor || false);
    });
};

function revealRole(roleId, status, isMayor) {
    if(window.closeModal) {
        window.closeModal('modal-join-game'); 
        window.closeModal('modal-online-menu');
    }
    const roleData = detectedRoles.find(r => r.id === roleId);
    if(roleData) {
        if(navigator.vibrate) navigator.vibrate([200, 100, 200]);
        const panel = document.querySelector('.details-panel');
        const overlay = document.querySelector('.details-overlay');
        if(!panel || !overlay) return;
        
        const isDead = status === 'dead';
        const filterStyle = isDead ? "grayscale(100%)" : "none";
        const clickAction = isDead ? "" : "this.classList.toggle('flipped')";
        const instructionText = isDead ? "TU ES MORT" : "CLIQUE POUR RETOURNER";
        const mayorBadge = isMayor ? `<div style="position:absolute; top:-10px; left:-10px; font-size:3.5em; z-index:100; filter:drop-shadow(2px 4px 6px black);">🎖️</div>` : '';
        
        panel.innerHTML = `
        <div id="online-content-wrapper" style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center;">
            <button class="close-details" onclick="window.internalCloseDetails()" style="position:absolute; top:20px; right:20px; z-index:100; background:rgba(0,0,0,0.6); color:white; border:1px solid gold; border-radius:50%; width:40px; height:40px; font-size:20px;">✕</button>
            
            <div class="carte-jeu visible" onclick="${clickAction}" style="width:300px; height:450px; margin:0 auto; transform:translateY(0); opacity:1; filter:${filterStyle}; transition:filter 0.5s;">
                <div class="carte-inner">
                    <div class="carte-front">
                        <img src="back.png" style="width:100%; height:100%; object-fit:cover;">
                        ${mayorBadge}
                        <div id="card-emoji-container" style="position:absolute; top:10px; left:10px; display:flex; flex-direction:column; gap:5px; z-index:50;"></div>
                    </div>
                    <div class="carte-back" style="padding:0; border:none;">
                        <img src="${roleData.image}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">
                    </div>
                </div>
            </div>
            
            <p style="color:${isDead ? '#c0392b' : 'white'}; margin-top:20px; font-family:'Pirata One'; font-size:1.5em; text-shadow:0 0 5px black;">${instructionText}</p>
        </div>`;
        panel.classList.add('active'); overlay.classList.add('active');
    }
}

/* ============================================
   14. NOTIFICATIONS
   ============================================ */
function internalShowNotification(title, message) { 
    if(window.showNotification) window.showNotification(title, message);
    else alert(title + "\n" + message); 
}

/* ============================================
   15. INTERACTIONS & ACTION SELECTOR (FINAL V5 - EMOJIS & LOGIC)
   ============================================ */
let currentSelection = []; // Liste des ID sélectionnés
let maxSelection = 1;      // Limite (1 ou 2)

// FONCTION UTILITAIRE : GÉNÉRER LES BADGES (HTML SEUL)
function getBadgesHTML(player) {
    let iconsHtml = "";
    if (player.attributes) {
        const attrs = Object.keys(player.attributes);
        if (attrs.some(k => k.startsWith('lover'))) iconsHtml += `<span style="position:absolute; top:0; right:0; font-size:1.2em; text-shadow:0 0 2px black; z-index:50;">💘</span>`;
        if (attrs.some(k => k.startsWith('target'))) iconsHtml += `<span style="position:absolute; bottom:0; right:0; font-size:1.2em; text-shadow:0 0 2px black; z-index:50;">🎯</span>`;
        if (attrs.some(k => k.startsWith('infected'))) iconsHtml += `<span style="position:absolute; bottom:0; left:0; font-size:1.2em; text-shadow:0 0 2px black; z-index:50;">🐾</span>`;
        if (attrs.some(k => k.startsWith('linked_red'))) iconsHtml += `<span style="position:absolute; top:0; left:0; font-size:1.2em; text-shadow:0 0 2px black; z-index:50;">🩸</span>`;
        if (attrs.some(k => k.startsWith('silenced'))) iconsHtml += `<span style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:1.5em; z-index:60;">🤐</span>`;
        if (attrs.some(k => k.startsWith('bewitched'))) iconsHtml += `<span style="position:absolute; top:-5px; left:50%; transform:translateX(-50%); font-size:1.2em; z-index:50;">😵‍💫</span>`;
    }
    if (player.isMayor) iconsHtml += `<span style="position:absolute; top:-10px; left:-5px; font-size:1.5em; z-index:70; filter:drop-shadow(0 2px 2px black);">🎖️</span>`;
    return iconsHtml;
}

window.openPlayerSelectorForAction = function(sourceRoleId, sourcePlayerId) {
    actionSourceRole = sourceRoleId;
    actionSourceId = sourcePlayerId;
    currentSelection = []; // Remise à zéro

    // 1. DÉFINITION DE LA LIMITE
    if (sourceRoleId === 'l_orphelin') maxSelection = 2; // Couple
    else maxSelection = 1;

    const modal = document.getElementById('modal-role-selector');
    if(!modal) return;

    // 2. Info Source Player
    const players = currentPlayersData || {};
    const sourcePlayer = players[sourcePlayerId];
    const sourceRoleName = detectedRoles.find(r=>r.id===sourceRoleId)?.title || 'Rôle Inconnu';

    const h2 = modal.querySelector('h2');
    if(h2) h2.style.display = 'none'; // Cache le titre par défaut
    
    const ps = modal.querySelectorAll('p');
    ps.forEach(p => p.style.display = 'none');

    // 3. HEADER CUSTOM (Photo du Donneur d'Ordre)
    const grid = document.getElementById('admin-role-grid');
    grid.innerHTML = "";
    
    const headerDiv = document.createElement('div');
    headerDiv.className = "initiator-header";
    headerDiv.innerHTML = `
        <span style="color:var(--gold); font-family:'Pirata One'; font-size:1.1em; letter-spacing:1px;">ACTION DE :</span>
        <div style="font-size:1.6em; color:white; font-family:'Pirata One'; margin-bottom:10px; line-height:1;">${sourceRoleName}</div>
        ${generateAvatarWithBadges(sourcePlayer, "90px", "3px solid white")}
        <div style="color:#2ecc71; font-size:1em; margin-top:10px; font-weight:bold;">
            Sélectionne <span id="selection-counter">0</span> / ${maxSelection}
        </div>
    `;
    grid.appendChild(headerDiv);

    // 4. GRILLE DES CIBLES (Vivants seulement)
    const alivePlayers = Object.entries(players).filter(([id, p]) => p.status !== 'dead');
    const container = document.createElement('div');
    container.className = "action-grid";

    alivePlayers.forEach(([pid, p]) => {
        // L'Orphelin ne peut pas se choisir lui-même
        if (pid === sourcePlayerId && sourceRoleId === 'l_orphelin') return; 
        if (pid === sourcePlayerId) return; // Par défaut, on ne se cible pas soi-même

        const targetRoleName = detectedRoles.find(r => r.id === (p.role || p.draftRole))?.title || "???";
        const badges = getBadgesHTML(p); // On récupère les emojis

        const card = document.createElement('div');
        card.className = "player-select-card"; // Géré par le CSS (Grayscale -> Couleur)
        card.id = `card-${pid}`;
        
        card.innerHTML = `
            <div style="position:relative; width:60px; height:60px; margin-bottom:5px;">
                <img src="${p.avatar || 'icon.png'}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
                ${badges}
            </div>
            <strong>${p.name}</strong>
            <small>${targetRoleName}</small>
        `;

        card.onclick = () => toggleSelection(pid, card);
        container.appendChild(card);
    });
    grid.appendChild(container);

    // 5. BOUTON VALIDER
    const btnValider = document.createElement('button');
    btnValider.className = "btn-confirm-action";
    btnValider.innerText = "VALIDER";
    btnValider.onclick = confirmActionSelection;
    grid.appendChild(btnValider);

    // 6. Z-Index MAX (Passe devant tout)
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
    if (currentSelection.length === 0) {
        alert("Tu dois sélectionner quelqu'un !");
        return;
    }
    if (actionSourceRole === 'l_orphelin' && currentSelection.length < 2) {
        if(!confirm("Tu n'as choisi qu'une seule personne pour le couple. Continuer ?")) return;
    }
    
    const updates = {};
    let msg = "";

    // 1. ORPHELIN (Couple)
    if (actionSourceRole === 'l_orphelin') {
        const coupleId = "couple_" + Date.now();
        currentSelection.forEach(pid => {
            updates[`games/${currentGameCode}/players/${pid}/attributes/lover_${coupleId}`] = true;
        });
        msg = "💘 Couple formé !";
    }
    // 2. LOUP ROUGE (Cœur)
    else if (actionSourceRole === 'le_loup_garou_rouge') {
        const targetId = currentSelection[0];
        updates[`games/${currentGameCode}/players/${targetId}/attributes/linked_red_by_${actionSourceId}`] = true;
        msg = "🩸 Cœur donné.";
    }
    // 3. TARGET (Miroir)
    else if (actionSourceRole === 'target') {
        const targetId = currentSelection[0];
        updates[`games/${currentGameCode}/players/${targetId}/attributes/target_mirror_by_${actionSourceId}`] = true;
        msg = "🎯 Cible miroir définie.";
    }
    // 4. AUTRES
    else if (actionSourceRole === 'le_papa_des_loups') {
        updates[`games/${currentGameCode}/players/${currentSelection[0]}/attributes/infected`] = true;
        msg = "🐾 Infection réussie.";
    }
    else if (actionSourceRole === 'le_chuchoteur') {
        updates[`games/${currentGameCode}/players/${currentSelection[0]}/attributes/silenced`] = true;
        msg = "🤐 Silence imposé.";
    }
    else if (actionSourceRole === 'le_marabout' || actionSourceRole === 'le_gourou') {
        updates[`games/${currentGameCode}/players/${currentSelection[0]}/attributes/bewitched`] = true;
        msg = "😵‍💫 Ensorcellement réussi.";
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

function internalShowNotification(title, message) { 
    if(window.showNotification) window.showNotification(title, message);
    else alert(title + "\n" + message); 
}
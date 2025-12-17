// ============================================
// SYSTEME EN LIGNE - V65 (INTERACTIONS OPTIMISÉES)
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, update, get, child, remove } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 1. CONFIGURATION
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

// Variables Globales
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

// Variables pour les Liaisons (Action)
let actionSourceRole = null;
let actionSourceId = null; // ID du joueur qui initie l'action (ex: l'Orphelin)

// ============================================
// A. INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { scanContentFromHTML(); }, 300);
    
    const btnJoin = document.getElementById('btn-join-action');
    if(btnJoin) btnJoin.addEventListener('click', joinGame);

    attachCreateEvent();
    setInterval(attachCreateEvent, 1000);

    const savedAdminCode = localStorage.getItem('adminGameCode');
    if (savedAdminCode) { showResumeButton(savedAdminCode); }
    
    checkPlayerSession();
});

function attachCreateEvent() {
    const btnCreate = document.getElementById('btn-create-game');
    if(btnCreate && !btnCreate.getAttribute('data-ready')) {
        btnCreate.addEventListener('click', () => {
            const password = prompt("🔐 Mot de passe MJ :");
            if(password === "1234") { window.initCreateGame(); } 
            else if (password !== null) { 
                internalShowNotification("⛔ Erreur", "Accès refusé !");
            }
        });
        btnCreate.setAttribute('data-ready', 'true');
    }
}

// --- GESTION PHOTO ---
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
    
    document.querySelectorAll('.carte-jeu').forEach((card) => {
        const imgTag = card.querySelector('.carte-front img');
        const titleTag = card.querySelector('.carte-back h3'); 
        const section = card.closest('section');
        const categoryId = section ? section.id : 'village'; 
        
        if (imgTag && titleTag) {
            const imgSrc = imgTag.getAttribute('src');
            const id = imgSrc.split('/').pop().replace(/\.[^/.]+$/, "");
            detectedRoles.push({
                id: id,
                title: titleTag.innerText.trim(),
                image: imgSrc,
                category: categoryId
            });

            // PRELOAD
            const preloadImg = new Image();
            preloadImg.src = imgSrc;
        }
    });

    document.querySelectorAll('.carte-vm').forEach((card) => {
        const imgTag = card.querySelector('img');
        if (imgTag) {
            const imgSrc = imgTag.getAttribute('src');
            if (card.classList.contains('gold')) detectedEvents.gold.push(imgSrc);
            else if (card.classList.contains('silver')) detectedEvents.silver.push(imgSrc);
            else if (card.classList.contains('bronze')) detectedEvents.bronze.push(imgSrc);
            
            // PRELOAD
            const preloadImg = new Image();
            preloadImg.src = imgSrc;
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

// ============================================
// B. ADMIN (MJ) - LOGIQUE
// ============================================

window.initCreateGame = function() {
    currentGameCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    myPlayerId = "MJ_ADMIN";
    localStorage.setItem('adminGameCode', currentGameCode);
    launchAdminInterface();
    set(ref(db, 'games/' + currentGameCode), { status: 'waiting', created_at: Date.now() });
};

window.restoreAdminSession = function(savedCode) {
    currentGameCode = savedCode;
    myPlayerId = "MJ_ADMIN";
    get(child(ref(db), `games/${currentGameCode}`)).then((snapshot) => {
        if(snapshot.exists()) {
            internalShowNotification("Admin", `Reconnexion réussie : ${currentGameCode}`);
            launchAdminInterface();
        } else {
            alert("Partie introuvable.");
            localStorage.removeItem('adminGameCode');
            location.reload();
        }
    });
};

function launchAdminInterface() {
    const codeDisplay = document.getElementById('game-code-display');
    if(codeDisplay) codeDisplay.innerText = currentGameCode;
    
    const adminDash = document.getElementById('admin-dashboard');
    if(window.closeModal) window.closeModal('modal-online-menu');
    
    if(adminDash) adminDash.style.display = 'flex';
    document.body.classList.add('no-scroll'); 
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '0';
    
    setupAdminListeners();
    generateDashboardControls(); 
}

function setupAdminListeners() {
    onValue(ref(db, 'games/' + currentGameCode + '/players'), (snapshot) => {
        const players = snapshot.val() || {};
        currentPlayersData = players;
        updateAdminUI(players);
        // Rafraichit le tableau s'il est déjà ouvert
        if(document.querySelector('.panini-admin-header') && document.querySelector('.summary-container')) {
            window.openRoleSummaryPanel();
        }
    });
}

// ============================================
// C. LOGIQUE SÉLECTION & DASHBOARD
// ============================================

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

        const fragment = document.createDocumentFragment();

        sortedPlayers.forEach(([id, p]) => {
            let currentRoleId = p.draftRole || p.role;
            let roleTitle = "";
            let roleCategory = "inconnu";
            let roleImageSrc = "icon.png"; 

            if(currentRoleId && detectedRoles.length > 0) {
                const r = detectedRoles.find(x => x.id === currentRoleId);
                if(r) { 
                    roleTitle = r.title;
                    roleCategory = r.category;
                    roleImageSrc = r.image;
                }
            }

            // MODIF : Photo prioritaire
            let displayAvatar = p.avatar ? p.avatar : (currentRoleId ? roleImageSrc : "icon.png");
            
            const isDead = p.status === 'dead';
            
            const cardDiv = document.createElement('div');
            cardDiv.className = isDead ? "admin-player-card dead" : "admin-player-card";
            cardDiv.style.position = 'relative';
            cardDiv.style.cursor = 'pointer'; 
            
            let innerHTML = `
                <div class="admin-avatar-container">
                    <img src="${displayAvatar}" alt="Avatar">
                    ${p.isMayor ? `<span class="mayor-badge">🎖️</span>` : ''}
                    ${hasAttribute(p, 'infected') ? `<span class="attr-icon" style="bottom:0; right:0;">🐾</span>` : ''}
                    ${hasAttribute(p, 'target') ? `<span class="attr-icon" style="bottom:0; left:0;">🎯</span>` : ''}
                    ${hasAttribute(p, 'linked_red') ? `<span class="attr-icon" style="top:0; right:0;">❤️</span>` : ''}
                    ${hasAttribute(p, 'lover') ? `<span class="attr-icon" style="top:0; left:0;">💘</span>` : ''}
                </div>
                <strong style="font-size:0.9em;">${p.name}</strong>
            `;

            if (roleTitle) innerHTML += `<div class="role-text-badge badge-${roleCategory}">${roleTitle}</div>`;
            if(isDraft) innerHTML = `<div style="background:#e67e22; color:white; font-size:0.6em; padding:2px 5px; border-radius:4px; position:absolute; top:3px; left:3px; z-index:10; font-weight:bold;">PROV.</div>` + innerHTML;
            
            cardDiv.innerHTML = innerHTML;
            cardDiv.onclick = function() { window.openAdminPlayerDetail(id, p.name, currentRoleId, isDead, displayAvatar, p.isMayor); };

            if(isDraft) {
                const btnChange = document.createElement('button');
                btnChange.className = "btn-admin-mini";
                btnChange.style.cssText = `background:#3498db; color:white; width:100%; border:none; padding:8px; font-family:'Pirata One'; font-size:1em; margin-top:3px; position:relative; z-index:20;`; 
                btnChange.innerText = "🔄 CHANGER";
                btnChange.onclick = (e) => { e.stopPropagation(); window.openResurrectModal(id); };
                cardDiv.appendChild(btnChange);
            }
            fragment.appendChild(cardDiv);
        });
        listDiv.appendChild(fragment);
    }
    updateAdminButtons(count);
}

// Fonction helper pour vérifier les attributs (avec les nouvelles clés dynamiques)
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
    btnSelect.innerHTML = "📂 MODIFIER SÉLECTION";
    btnSelect.onclick = () => window.openDistributionSelector();
    wrapper.appendChild(btnSelect);

    // --- BOUTON DÉSICÔNISER (RESET) DEMANDÉ ---
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

// Fonction Reset Total
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

// ============================================
// D. TABLEAU RÉPARTITION & LOGIQUE SPECIALE
// ============================================

window.openRoleSummaryPanel = function() {
    const rolesVillage = [];
    const rolesLoup = [];
    const rolesSolo = [];
    const rolesVampire = [];
    
    const hasActivePlayers = Object.keys(currentPlayersData).length > 0;
    
    // LISTE DES RÔLES INTERACTIFS QUI ONT LE BOUTON ÉCLAIR
    const interactiveRoles = ['l_orphelin', 'target', 'le_loup_garou_rouge', 'le_loup_garou_maudit', 'le_loup_garou_alpha', 'le_papa_des_loups', 'le_chuchoteur', 'le_marabout'];

    const createLine = (roleId, playerObj, playerId) => {
        const role = detectedRoles.find(r => r.id === roleId);
        if(!role) return null;
        
        let html = "";
        
        if (hasActivePlayers && playerObj) {
            const isDead = playerObj.status === 'dead';
            const style = isDead 
                ? "background:#2c3e50; color:#95a5a6; text-decoration:line-through; border:1px solid #7f8c8d; opacity:0.7;" 
                : "background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,215,0,0.3);";
            
            const avatar = playerObj.avatar || "icon.png";
            
            // --- BOUTON D'ACTION SÉPARÉ (DEMANDE SPÉCIFIQUE) ---
            let actionBtn = "";
            if (interactiveRoles.includes(roleId) && !isDead && !isDraftMode) {
                actionBtn = `
                    <button onclick="event.stopPropagation(); window.openPlayerSelectorForAction('${roleId}', '${playerId}')" 
                        style="background:linear-gradient(135deg, #f1c40f, #d35400); border:1px solid white; border-radius:50%; width:45px; height:45px; display:flex; align-items:center; justify-content:center; font-size:1.5em; cursor:pointer; box-shadow:0 0 10px rgba(243, 156, 18, 0.5); margin-left:auto; flex-shrink:0;">
                        ⚡
                    </button>
                `;
            }

            // MISE EN PAGE : Div principale clicable pour profil + Bouton séparé
            html = `
                <div class="summary-list-item" style="${style} display:flex; align-items:center; gap:15px; padding:10px 10px; margin:8px 0; border-radius:15px; width:96%; position:relative;">
                    
                    <div style="flex:1; display:flex; align-items:center; gap:15px; cursor:pointer;" onclick="window.openAdminPlayerDetail('${playerId}', '${playerObj.name}', '${roleId}', ${isDead}, '${avatar}', ${playerObj.isMayor})">
                        <div style="position:relative; width:55px; height:55px;">
                            <img src="${avatar}" style="width:55px; height:55px; border-radius:50%; object-fit:cover; border:2px solid gold;">
                        </div>
                        <div style="display:flex; flex-direction:column;">
                            <span style="font-family:'Almendra'; font-size:1.3em; font-weight:bold; line-height:1.1;">${playerObj.name}</span>
                            <span style="font-size:1em; color:#ddd;">${role.title}</span>
                        </div>
                    </div>

                    ${actionBtn}
                </div>`;
        } else {
            html = `<div class="summary-list-item" style="color:#ddd; padding:8px; font-size:1.1em;">${role.title}</div>`;
        }
        return { html, cat: role.category };
    };

    if (hasActivePlayers && !isDraftMode) {
        Object.entries(currentPlayersData).forEach(([pid, p]) => {
            const item = createLine(p.role, p, pid);
            if(item) {
                if(item.cat === 'village') rolesVillage.push(item.html);
                else if(item.cat === 'loups') rolesLoup.push(item.html);
                else if(item.cat === 'vampires') rolesVampire.push(item.html);
                else rolesSolo.push(item.html);
            }
        });
    } else {
        const grouped = {};
        distributionSelection.forEach(id => { grouped[id] = (grouped[id] || 0) + 1; });
        Object.entries(grouped).forEach(([id, qty]) => {
            const role = detectedRoles.find(r => r.id === id);
            if(role) {
                const txt = qty > 1 ? `${role.title} (x${qty})` : role.title;
                const html = `<div class="summary-list-item" style="color:#ddd;">${txt}</div>`;
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
            <button class="close-details" onclick="window.internalCloseDetails()" style="position:absolute; right:0; top:0; background:transparent; border:none; color:gold; font-size:1.5em; cursor:pointer;">✕</button>
        </div>
        <div class="summary-container" style="display:flex; flex-direction:column; gap:10px;">
            ${rolesVillage.length ? `<div class="summary-col" style="border-bottom:1px solid #333; padding-bottom:10px;"><img src="Village.svg" style="width:40px; margin-bottom:5px;"> <strong style="display:block; color:#2ecc71;">VILLAGE (${rolesVillage.length})</strong>${rolesVillage.join('')}</div>` : ''}
            ${rolesLoup.length ? `<div class="summary-col" style="border-bottom:1px solid #333; padding-bottom:10px;"><img src="Loup.svg" style="width:40px; margin-bottom:5px;"> <strong style="display:block; color:#c0392b;">LOUPS (${rolesLoup.length})</strong>${rolesLoup.join('')}</div>` : ''}
            ${rolesSolo.length ? `<div class="summary-col"><img src="Solo.svg" style="width:40px; margin-bottom:5px;"> <strong style="display:block; color:#9b59b6;">SOLOS (${rolesSolo.length})</strong>${rolesSolo.join('')}</div>` : ''}
            ${rolesVampire.length ? `<div class="summary-col" style="border-top:1px solid #333; padding-top:10px;"><img src="Vampires.svg" style="width:40px; margin-bottom:5px;"> <strong style="display:block; color:#34495e;">VAMPIRES (${rolesVampire.length})</strong>${rolesVampire.join('')}</div>` : ''}
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
        panel.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('no-scroll');
    }
}

// --- SÉLECTEUR D'ACTIONS (V65 - COMPATIBLE DOUBLONS & TOGGLE) ---
window.openPlayerSelectorForAction = function(roleType, sourceId) {
    actionSourceRole = roleType;
    actionSourceId = sourceId; 
    
    let title = "CHOISIR CIBLE";
    let maxSelection = 1;
    let attributeKey = "";
    
    if(roleType === 'l_orphelin') { 
        title = "CHOISIR LES 2 AMOUREUX"; 
        maxSelection = 2; 
        attributeKey = "lover"; 
    }
    else if(roleType === 'target') { title = "DÉTOURNEMENT"; attributeKey = "target"; }
    else if(roleType === 'le_loup_garou_rouge') { title = "LIER AU CŒUR"; attributeKey = "linked_red"; }
    else if(roleType === 'le_loup_garou_maudit') { title = "CHOISIR MENTOR"; attributeKey = "cursed_mentor"; }
    else if(roleType === 'le_papa_des_loups' || roleType === 'le_loup_garou_alpha') { title = "INFECTER"; attributeKey = "infected"; }
    else { title = "ACTION"; attributeKey = "generic_action"; }

    const grid = document.getElementById('admin-role-grid');
    const modal = document.getElementById('modal-role-selector');
    if(!grid || !modal) return;

    // Masquer le titre par défaut pour mettre le Header custom
    const defaultH2 = modal.querySelector('h2');
    if(defaultH2) defaultH2.style.display = 'none';

    grid.style.display = "block"; 
    grid.innerHTML = "";

    // 1. Header Initiateur (Visualisation de qui fait l'action)
    const initiator = currentPlayersData[sourceId];
    const headerDiv = document.createElement('div');
    headerDiv.className = "initiator-header";
    headerDiv.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:20px; border-bottom:1px solid #555; padding-bottom:10px; width:100%;">
            <span style="color:#aaa; font-size:0.9em; text-transform:uppercase; letter-spacing:1px;">INITIÉ PAR</span>
            <div style="position:relative; margin-top:5px;">
                <img src="${initiator.avatar || 'icon.png'}" style="width:80px; height:80px; border-radius:50%; border:3px solid var(--gold); object-fit:cover;">
                <span style="display:block; color:var(--gold); font-family:'Pirata One'; font-size:1.4em; margin-top:5px;">${initiator.name}</span>
            </div>
            <h3 style="color:white; margin:10px 0 0 0; font-size:1.2em;">${title}</h3>
            <small style="color:#888;">(Max: ${maxSelection})</small>
        </div>
    `;
    grid.appendChild(headerDiv);

    // 2. Grille 2 Colonnes
    const catGrid = document.createElement('div');
    catGrid.className = "player-selector-grid"; 
    catGrid.style.cssText = "display:grid; grid-template-columns: 1fr 1fr; gap:10px; padding-bottom:50px;";

    Object.entries(currentPlayersData).forEach(([pid, p]) => {
        // Clé unique pour gérer les doublons (ex: lover_by_ID1 vs lover_by_ID2)
        const uniqueAttrKey = `${attributeKey}_by_${sourceId}`; 
        const isSelected = p.attributes && p.attributes[uniqueAttrKey];

        const div = document.createElement('div');
        div.className = `player-select-card ${isSelected ? 'active' : ''}`;
        div.style.cssText = `
            position: relative; 
            background: rgba(255,255,255,0.05); 
            border-radius: 12px; 
            overflow: hidden; 
            aspect-ratio: 1/1;
            border: 2px solid ${isSelected ? '#2ecc71' : 'transparent'};
            cursor: pointer;
        `;
        
        div.innerHTML = `
            <img src="${p.avatar || 'icon.png'}" style="width:100%; height:100%; object-fit:cover; opacity:${isSelected ? 1 : 0.6}; transition:opacity 0.2s;">
            <div style="position:absolute; bottom:0; left:0; width:100%; background:rgba(0,0,0,0.7); color:white; padding:5px; text-align:center; font-size:0.9em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${p.name}
            </div>
            ${isSelected ? '<div style="position:absolute; top:5px; right:5px; background:#2ecc71; color:white; border-radius:50%; width:25px; height:25px; display:flex; align-items:center; justify-content:center; font-weight:bold;">✓</div>' : ''}
        `;
        
        div.onclick = () => window.togglePlayerSelection(pid, attributeKey, maxSelection, uniqueAttrKey);
        catGrid.appendChild(div);
    });
    grid.appendChild(catGrid);
    
    modal.style.zIndex = "20000"; 
    window.openModal('modal-role-selector');
};

window.togglePlayerSelection = function(targetPid, baseAttrKey, maxLimit, uniqueAttrKey) {
    let currentCount = 0;
    Object.values(currentPlayersData).forEach(p => {
        if(p.attributes && p.attributes[uniqueAttrKey]) currentCount++;
    });

    const targetPlayer = currentPlayersData[targetPid];
    const isCurrentlySelected = targetPlayer.attributes && targetPlayer.attributes[uniqueAttrKey];

    const updates = {};

    if (isCurrentlySelected) {
        updates[`games/${currentGameCode}/players/${targetPid}/attributes/${uniqueAttrKey}`] = null;
    } else {
        if (currentCount >= maxLimit) {
            alert(`Maximum ${maxLimit} joueur(s) déjà sélectionné(s) ! Désélectionnez-en un d'abord.`);
            return;
        }
        updates[`games/${currentGameCode}/players/${targetPid}/attributes/${uniqueAttrKey}`] = true;
    }

    update(ref(db), updates).then(() => {
        window.openPlayerSelectorForAction(actionSourceRole, actionSourceId);
        if(!isCurrentlySelected) internalShowNotification("Action", "Joueur sélectionné.");
        else internalShowNotification("Action", "Joueur retiré.");
    });
};

// --- FICHE JOUEUR PANINI (ADMIN) ---
window.openAdminPlayerDetail = function(playerId, playerPseudo, roleId, isDead, avatarBase64, isMayor) {
    const panel = document.querySelector('.details-panel');
    const overlay = document.querySelector('.details-overlay');
    if(!panel || !overlay) return;

    let roleImg = "back.png";
    let roleTitle = "En attente...";
    let campIcon = "";

    if(roleId && detectedRoles.length > 0) {
        const r = detectedRoles.find(x => x.id === roleId);
        if(r) { 
            roleImg = r.image; 
            roleTitle = r.title; 
            if(r.category === 'loups') campIcon = `<img src="Loup.svg" style="width:30px; vertical-align:middle; margin-right:5px;">`;
            else if(r.category === 'solo') campIcon = `<img src="Solo.svg" style="width:30px; vertical-align:middle; margin-right:5px;">`;
            else if(r.category === 'vampires') campIcon = `<img src="Vampires.svg" style="width:30px; vertical-align:middle; margin-right:5px;">`;
            else campIcon = `<img src="Village.svg" style="width:30px; vertical-align:middle; margin-right:5px;">`;
        }
    }

    let statusHTML = "";
    if(isDead) statusHTML += `<span style="color:#c0392b; margin-right:10px; font-weight:bold;">MORT 💀</span>`;
    if(isMayor) statusHTML += `<span style="color:gold; font-weight:bold;">MAIRE 🎖️</span>`;

    // GESTION DES BOUTONS DE DESINCHRONISATION (AVEC NOUVELLES CLES)
    let effectsHTML = "";
    const p = currentPlayersData[playerId];
    if (p && p.attributes) {
        Object.keys(p.attributes).forEach(key => {
            if (key.startsWith('lover_by_')) {
                effectsHTML += `<button class="btn-admin-action" style="background:#e74c3c; color:white; border:1px solid white;" onclick="window.removePlayerAttribute('${playerId}', '${key}')">💔 BRISER COUPLE</button>`;
            }
            if (key.startsWith('infected_by_')) {
                effectsHTML += `<button class="btn-admin-action" style="background:#8e44ad; color:white; border:1px solid white;" onclick="window.removePlayerAttribute('${playerId}', '${key}')">💉 SOIGNER INFECTION</button>`;
            }
            if (key.startsWith('target_by_')) {
                effectsHTML += `<button class="btn-admin-action" style="background:#34495e; color:white; border:1px solid white;" onclick="window.removePlayerAttribute('${playerId}', '${key}')">🚫 RETIRER CIBLE</button>`;
            }
            if (key.startsWith('linked_red_by_')) {
                effectsHTML += `<button class="btn-admin-action" style="background:#c0392b; color:white; border:1px solid white;" onclick="window.removePlayerAttribute('${playerId}', '${key}')">🩸 DÉLIER LOUP ROUGE</button>`;
            }
            if (key.startsWith('cursed_mentor_by_')) {
                effectsHTML += `<button class="btn-admin-action" style="background:#f39c12; color:white; border:1px solid white;" onclick="window.removePlayerAttribute('${playerId}', '${key}')">🌙 RETIRER MENTOR</button>`;
            }
        });
    }

    const htmlContent = `
        <div class="panini-admin-header">
            <button class="close-details" onclick="window.internalCloseDetails()" style="position:absolute; right:0; top:0; background:transparent; border:none; color:gold; font-size:1.5em; cursor:pointer; z-index:11100;">✕</button>
            <img src="${avatarBase64}" class="panini-big-avatar">
            <h2 style="color:var(--gold); margin:0; font-size:1.8em;">${playerPseudo}</h2>
            <div style="font-size:1.2em; margin-top:5px;">${statusHTML}</div>
        </div>

        <div style="text-align:center; margin-bottom:20px;">
            <div style="display:flex; align-items:center; justify-content:center; margin-bottom:5px;">${campIcon} <span style="font-family:'Almendra'; font-size:1.4em; color:#fff;">${roleTitle}</span></div>
            <img src="${roleImg}" class="panini-big-card" style="filter:${isDead ? 'grayscale(100%)' : 'none'}">
        </div>

        <div class="admin-actions-grid">
            <button id="btn-mayor" class="btn-admin-action" style="background:${isMayor ? '#7f8c8d' : '#f1c40f'}; color:${isMayor ? '#fff' : '#000'}; border:2px solid #fff; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer;"
                onclick="window.toggleMayor('${playerId}', ${!isMayor}, this)">
                ${isMayor ? '❌ DESTITUER MAIRE' : '🎖️ NOMMER MAIRE'}
            </button>

            ${effectsHTML} 

            <button id="btn-life" class="btn-admin-action" style="background:${isDead ? '#2ecc71' : '#c0392b'}; color:#fff; border:2px solid #fff; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer;"
                onclick="window.toggleLife('${playerId}', ${!isDead}, this)">
                ${isDead ? '♻️ RESSUSCITER' : '💀 TUER LE JOUEUR'}
            </button>

            <button class="btn-admin-action" style="background:#3498db; color:#fff; border:2px solid #fff; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer;"
                onclick="window.internalCloseDetails(); window.openResurrectModal('${playerId}')">
                🔄 CHANGER LE RÔLE
            </button>
        </div>

        ${isDead ? `
            <div class="event-buttons-row">
                <button class="btn-event" style="background:gold;" onclick="window.adminDrawEvent('${playerId}', 'gold')">OR</button>
                <button class="btn-event" style="background:silver;" onclick="window.adminDrawEvent('${playerId}', 'silver')">ARGENT</button>
                <button class="btn-event" style="background:#cd7f32;" onclick="window.adminDrawEvent('${playerId}', 'bronze')">BRONZE</button>
            </div>
        ` : ''}
        <br><br><br>
    `;

    let contentDiv = panel.querySelector('.details-content');
    if(!contentDiv) {
          panel.innerHTML = '<div class="details-content"></div>';
          contentDiv = panel.querySelector('.details-content');
    }
    contentDiv.innerHTML = htmlContent;
    panel.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('no-scroll');
};

// ============================================
// E. FONCTIONS UTILITAIRES (AVEC LOGIQUE MORT EN CHAINE)
// ============================================

window.removePlayerAttribute = function(pid, attrKey) {
    if(!confirm("Retirer cet effet ?")) return;
    
    update(ref(db, `games/${currentGameCode}/players/${pid}/attributes/${attrKey}`), null).then(() => {
        window.internalCloseDetails(); 
        internalShowNotification("Effet", "L'effet a été retiré.");
    });
};

window.toggleMayor = function(pid, state, btn) {
    if(btn) {
        btn.style.background = state ? "#7f8c8d" : "#f1c40f";
        btn.style.color = state ? "#fff" : "#000";
        btn.innerText = state ? '❌ DESTITUER MAIRE' : '🎖️ NOMMER MAIRE';
        btn.setAttribute('onclick', `window.toggleMayor('${pid}', ${!state}, this)`);
    }
    update(ref(db, `games/${currentGameCode}/players/${pid}`), { isMayor: state });
};

window.toggleLife = function(pid, state, btn) {
    const status = state ? 'alive' : 'dead';
    if(!state && !confirm("Tuer ce joueur ?")) return;
    
    // GESTION DES REPERCUSSIONS (MORT)
    if (!state) { // Si on tue (state = false = mort)
        const victim = currentPlayersData[pid];
        if (victim && victim.attributes) {
            
            // 1. Amoureux (On cherche les clés commencant par lover_by_)
            const loverKeys = Object.keys(victim.attributes).filter(k => k.startsWith('lover_by_'));
            
            loverKeys.forEach(loverKey => {
                // Trouver le PARTENAIRE qui a la MÊME clé
                const partnerEntry = Object.entries(currentPlayersData).find(([pId, p]) => {
                    return pId !== pid && p.attributes && p.attributes[loverKey];
                });

                if (partnerEntry) {
                    const [partnerId, partner] = partnerEntry;
                    if (partner.status !== 'dead') {
                        setTimeout(() => {
                            alert(`💔 ${victim.name} est mort... Son amour ${partner.name} se suicide !`);
                            window.toggleLife(partnerId, false);
                        }, 500);
                    }
                }
            });

            // 2. Lié au Loup Rouge
            const redKey = Object.keys(victim.attributes).find(k => k.startsWith('linked_red_by_'));
            if(redKey) {
                const redWolfId = redKey.replace('linked_red_by_', '');
                const redWolf = currentPlayersData[redWolfId];
                if (redWolf && redWolf.status !== 'dead') {
                    setTimeout(() => {
                        alert(`🩸 Le cœur du Loup Garou Rouge (${redWolf.name}) a cessé de battre... Il meurt !`);
                        window.toggleLife(redWolfId, false);
                    }, 800);
                }
            }

            // 3. Mentor du Maudit
            if (hasAttribute(victim, 'cursed_mentor_by')) {
                setTimeout(() => {
                    alert(`🐺 ATTENTION MJ : Le Mentor est mort. Le Loup-Garou Maudit doit se réveiller et rejoindre la meute !`);
                }, 500);
            }
        }
    }

    if(btn) {
        btn.style.background = state ? "#c0392b" : "#2ecc71"; 
        btn.innerText = state ? '💀 TUER LE JOUEUR' : '♻️ RESSUSCITER';
        btn.setAttribute('onclick', `window.toggleLife('${pid}', ${!state}, this)`);
        
        const cardImg = document.querySelector('.panini-big-card');
        if(cardImg) cardImg.style.filter = state ? 'none' : 'grayscale(100%)';
        
        const contentDiv = document.querySelector('.details-content');
        const existingRow = document.querySelector('.event-buttons-row');
        if(!state && !existingRow && contentDiv) {
             const row = document.createElement('div');
             row.className = 'event-buttons-row';
             row.innerHTML = `<button class="btn-event" style="background:gold;" onclick="window.adminDrawEvent('${pid}', 'gold')">OR</button><button class="btn-event" style="background:silver;" onclick="window.adminDrawEvent('${pid}', 'silver')">ARGENT</button><button class="btn-event" style="background:#cd7f32;" onclick="window.adminDrawEvent('${pid}', 'bronze')">BRONZE</button>`;
             contentDiv.appendChild(row);
        } else if (state && existingRow) { existingRow.remove(); }
    }
    
    update(ref(db, `games/${currentGameCode}/players/${pid}`), { status: status });
};

window.adminDrawEvent = function(pid, cat) { window.openEventSelector(pid, cat); };

window.internalCloseDetails = function() {
    const panel = document.querySelector('.details-panel');
    const overlay = document.querySelector('.details-overlay');
    if(panel) panel.classList.remove('active');
    if(overlay) overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
};

function updateDistributionDashboard() {
    const countVillage = distributionSelection.filter(id => { const r = detectedRoles.find(role => role.id === id); return r && r.category === 'village'; }).length;
    const countLoup = distributionSelection.filter(id => { const r = detectedRoles.find(role => role.id === id); return r && r.category === 'loups'; }).length;
    const countSolo = distributionSelection.filter(id => { const r = detectedRoles.find(role => role.id === id); return r && r.category === 'solo'; }).length;

    if(document.getElementById('pop-count-village')) document.getElementById('pop-count-village').innerText = countVillage;
    if(document.getElementById('pop-count-loup')) document.getElementById('pop-count-loup').innerText = countLoup;
    if(document.getElementById('pop-count-solo')) document.getElementById('pop-count-solo').innerText = countSolo;
    if(document.getElementById('pop-total')) document.getElementById('pop-total').innerText = distributionSelection.length;
}

// --- OPTIMISATION GENERATION GRILLE (Fragment + SVG + EAGER) ---
window.generateResurrectionGrid = function(mode = 'single') {
    const grid = document.getElementById('admin-role-grid');
    if(!grid) return;
    if (detectedRoles.length === 0) scanContentFromHTML();
    grid.style.display = "block"; grid.innerHTML = "";
    
    if (mode === 'multi') {
        const dashboard = document.createElement('div');
        dashboard.className = "selection-dashboard";
        dashboard.innerHTML = `<div class="dashboard-stats"><div class="stat-item"><img src="Village.svg"><span id="pop-count-village">0</span></div><div class="stat-item"><img src="Loup.svg"><span id="pop-count-loup">0</span></div><div class="stat-item"><img src="Solo.svg"><span id="pop-count-solo">0</span></div></div><button class="btn-compact" onclick="window.validateDistribution()">OK (<span id="pop-total">0</span>)</button>`;
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
                div.onclick = () => mode === 'multi' ? handleMultiSelection(role.id, div) : window.assignRoleToPlayer(role.id);
                catGrid.appendChild(div);
            });
            mainFragment.appendChild(catGrid);
        }
    }
    grid.appendChild(mainFragment);
};

window.openDistributionSelector = function() {
    window.generateResurrectionGrid('multi');
    const modal = document.getElementById('modal-role-selector');
    if(modal) {
        modal.style.zIndex = "20000"; 
        const h2 = modal.querySelector('h2');
        if(h2) h2.style.display = "none"; // CACHÉ
        window.openModal('modal-role-selector');
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
    document.getElementById('modal-role-selector').style.zIndex = "20000"; 
    window.openModal('modal-role-selector');
};

function handleMultiSelection(roleId, divElement) {
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
    updateDistributionDashboard();
}

window.validateDistribution = function() {
    window.closeModal('modal-role-selector');
    generateDashboardControls(); 
};

window.openEventSelector = function(playerId, category) {
    targetResurrectId = playerId;
    targetEventCategory = category;
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
    cards.forEach(imgSrc => {
        const div = document.createElement('div');
        div.className = "role-select-item";
        div.innerHTML = `<img src="${imgSrc}" loading="lazy" style="width:100%; border-radius:6px;">`;
        div.onclick = function() { window.adminDraw(playerId, category, false, imgSrc); };
        catGrid.appendChild(div);
    });
    grid.appendChild(catGrid);
    document.getElementById('modal-role-selector').style.zIndex = "20000"; 
    window.openModal('modal-role-selector');
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
        const allowDuplicates = multiRoles.includes(newRoleId) || !isDraftMode;
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
            window.closeModal('modal-role-selector');
            window.internalCloseDetails(); 
            
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

// CÔTÉ JOUEUR
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
    let currentAttributes = {}; // Pour suivre les changements d'emojis
    
    onValue(myPlayerRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        
        const panel = document.querySelector('.details-panel');
        const overlay = document.querySelector('.details-overlay');

        if (data.status === 'dead') {
            document.body.classList.add('dead-state'); 
            const lobbyStatus = document.getElementById('player-lobby-status');
            if(lobbyStatus) lobbyStatus.innerHTML = `<h1 style="color:#c0392b; font-size:3em; text-align:center;">TU ES MORT 💀</h1>`;
        } else {
            document.body.classList.remove('dead-state');
        }

        if (data.role) {
            myCurrentRoleId = data.role; 
            if (data.role !== lastRole) { 
                lastRole = data.role; 
                revealRole(data.role); 
            }
            if (data.status !== 'dead') {
                const lobbyStatus = document.getElementById('player-lobby-status');
                let statusHTML = `
                    <h3 style="color:var(--gold);">Tu es en jeu !</h3>
                    <div style="margin:20px 0;">
                        <button class="btn-menu" style="background:var(--gold); color:black; font-weight:bold; padding:15px; width:100%; border:2px solid #fff;" onclick="window.showMyRoleAgain()">🃏 VOIR MA CARTE</button>
                    </div>
                `;
                if(lobbyStatus) lobbyStatus.innerHTML = statusHTML;
            }
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
                    <div class="scene-flip" onclick="this.classList.toggle('is-flipped')" style="margin:0;">
                        <div class="card-object">
                            <div class="card-face face-front"><img src="${backImage}" class="card-back-img" style="width:100%; height:100%; object-fit:cover; border-radius:15px;"></div>
                            <div class="card-face face-back"><img src="${data.drawnCard.image}" style="width:100%; height:100%; object-fit:cover; border-radius:15px;"></div>
                        </div>
                    </div>
                </div>`;
                panel.classList.add('active'); overlay.classList.add('active');
            }
        }

        // --- GESTION DES EMOJIS AU DOS DE LA CARTE ---
        if (JSON.stringify(data.attributes) !== JSON.stringify(currentAttributes)) {
            currentAttributes = data.attributes || {};
            window.updateCardBackEmojis(currentAttributes);
        }

        if (data.isMayor) {
            if (!document.getElementById('player-medal')) {
                const medal = document.createElement('div');
                medal.id = 'player-medal';
                medal.className = 'player-mayor-badge'; 
                medal.innerHTML = '🎖️';
                document.body.appendChild(medal);
            }
        } else {
            const medal = document.getElementById('player-medal');
            if(medal) medal.remove();
        }
    });
}

window.showMyRoleAgain = function() { if(!myCurrentRoleId) return; revealRole(myCurrentRoleId); };

function revealRole(roleId) {
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
        
        panel.innerHTML = `
        <div id="online-content-wrapper" style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center;">
            <button class="close-details" onclick="window.internalCloseDetails()" style="position:absolute; top:20px; right:20px; z-index:100; background:rgba(0,0,0,0.6); color:white; border:1px solid gold; border-radius:50%; width:40px; height:40px; font-size:20px;">✕</button>
            <div class="scene-flip" onclick="this.classList.toggle('is-flipped')" style="margin:0;">
                <div class="card-object">
                    <div class="card-face face-front">
                        <img src="back.png" class="card-back-img" style="width:100%; height:100%; object-fit:cover; border-radius:15px;">
                        <div id="card-emoji-container" style="position:absolute; top:10px; left:10px; display:flex; flex-direction:column; gap:5px; z-index:50;"></div>
                    </div>
                    <div class="card-face face-back"><img src="${roleData.image}" style="width:100%; height:100%; object-fit:cover; border-radius:15px;"></div>
                </div>
            </div>
        </div>`;
        panel.classList.add('active'); overlay.classList.add('active');
    }
}

function internalShowNotification(title, message) { 
    if(window.showNotification) window.showNotification(title, message);
    else alert(title + "\n" + message); 
}
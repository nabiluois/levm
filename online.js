// ============================================
// SYSTEME EN LIGNE - LE VILLAGE MAUDIT (V13 - RETOUR DU BOUTON BLEU)
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
let detectedRoles = [];
let detectedEvents = { gold: [], silver: [], bronze: [] };
let isDraftMode = false; 

// ============================================
// A. GESTION DU MENU & SCAN & RECONNEXION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    scanContentFromHTML();
    ensureAdminButtonsExist(); // Auto-réparation des boutons

    const btnJoin = document.getElementById('btn-join-action');
    if(btnJoin) btnJoin.addEventListener('click', joinGame);

    const btnDistribute = document.getElementById('btn-distribute');
    if(btnDistribute) btnDistribute.addEventListener('click', distributeRoles);

    const btnReveal = document.getElementById('btn-reveal');
    if(btnReveal) btnReveal.addEventListener('click', revealRolesToEveryone);

    const savedAdminCode = localStorage.getItem('adminGameCode');
    if (savedAdminCode) {
        showResumeButton(savedAdminCode);
    }
});

function ensureAdminButtonsExist() {
    const btnDistribute = document.getElementById('btn-distribute');
    let btnReveal = document.getElementById('btn-reveal');

    if (btnDistribute && !btnReveal) {
        const container = document.createElement('div');
        container.className = "admin-buttons-container";
        container.style.display = "flex";
        container.style.gap = "10px";
        container.style.marginTop = "15px";

        btnDistribute.parentNode.insertBefore(container, btnDistribute);
        container.appendChild(btnDistribute);

        btnReveal = document.createElement('button');
        btnReveal.id = "btn-reveal";
        btnReveal.className = "btn-validate btn-distribute-big";
        btnReveal.style.flex = "1";
        btnReveal.style.background = "#27ae60"; 
        btnReveal.style.display = "none";
        btnReveal.innerText = "📢 RÉVÉLER";
        
        container.appendChild(btnReveal);
        btnDistribute.style.flex = "1";
        btnDistribute.style.width = "auto";
    }
}

function showResumeButton(code) {
    const menuContainer = document.querySelector('.modal-content'); 
    if(menuContainer && !document.getElementById('btn-resume-admin')) {
        const resumeBtn = document.createElement('button');
        resumeBtn.id = "btn-resume-admin";
        resumeBtn.className = "btn-menu";
        resumeBtn.style.background = "linear-gradient(135deg, #8e44ad, #c0392b)";
        resumeBtn.style.border = "2px solid gold";
        resumeBtn.style.marginBottom = "15px";
        resumeBtn.innerHTML = `👑 REPRENDRE LA PARTIE (${code})`;
        resumeBtn.onclick = () => window.restoreAdminSession(code);
        
        const title = menuContainer.querySelector('h2');
        if(title) title.insertAdjacentElement('afterend', resumeBtn);
    }
}

function scanContentFromHTML() {
    detectedRoles = [];
    detectedEvents = { gold: [], silver: [], bronze: [] };

    document.querySelectorAll('.carte-jeu').forEach((card) => {
        const imgTag = card.querySelector('.carte-front img');
        const titleTag = card.querySelector('.carte-back h3');
        if (imgTag && titleTag) {
            const imgSrc = imgTag.getAttribute('src');
            const id = imgSrc.split('/').pop().replace(/\.[^/.]+$/, "");
            detectedRoles.push({
                id: id,
                title: titleTag.innerText,
                image: imgSrc,
                description: card.querySelector('.carte-back p') ? card.querySelector('.carte-back p').innerHTML : ""
            });
        }
    });

    document.querySelectorAll('.carte-vm').forEach((card) => {
        const imgTag = card.querySelector('img');
        if (imgTag) {
            const imgSrc = imgTag.getAttribute('src');
            if (card.classList.contains('gold')) detectedEvents.gold.push(imgSrc);
            else if (card.classList.contains('silver')) detectedEvents.silver.push(imgSrc);
            else if (card.classList.contains('bronze')) detectedEvents.bronze.push(imgSrc);
        }
    });
}

// Sécurité MJ
window.checkAdminPassword = function() {
    const password = prompt("🔐 Mot de passe MJ :");
    if(password === "1234") {
        window.initCreateGame();
    } else if (password !== null) {
        alert("⛔ Accès refusé !");
    }
};

window.closeAdminPanel = function() {
    if(confirm("Quitter le mode Admin ?")) {
        document.getElementById('admin-dashboard').style.display = 'none';
        document.body.style.overflow = 'auto';
        localStorage.removeItem('adminGameCode');
        location.reload(); 
    }
};

// ============================================
// B. ADMIN (MJ) - CRÉATION & RESTAURATION
// ============================================

window.initCreateGame = function() {
    currentGameCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    myPlayerId = "MJ_ADMIN";
    
    localStorage.setItem('adminGameCode', currentGameCode);
    launchAdminInterface();
    
    set(ref(db, 'games/' + currentGameCode), {
        status: 'waiting',
        created_at: Date.now()
    });
};

window.restoreAdminSession = function(savedCode) {
    currentGameCode = savedCode;
    myPlayerId = "MJ_ADMIN";
    
    get(child(ref(db), `games/${currentGameCode}`)).then((snapshot) => {
        if(snapshot.exists()) {
            alert(`Reconnexion réussie à la partie ${currentGameCode} !`);
            launchAdminInterface();
        } else {
            alert("Cette partie n'existe plus.");
            localStorage.removeItem('adminGameCode');
            location.reload();
        }
    });
};

function launchAdminInterface() {
    document.getElementById('game-code-display').innerText = currentGameCode;
    document.getElementById('admin-dashboard').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    window.closeModal('modal-online-menu');

    setupAdminListeners();
    generateRoleChecklist();
    generateResurrectionGrid();
}

function setupAdminListeners() {
    onValue(ref(db, 'games/' + currentGameCode + '/players'), (snapshot) => {
        const players = snapshot.val() || {};
        isDraftMode = Object.values(players).some(p => p.draftRole);
        updateAdminUI(players);
    });
}

function updateAdminUI(players) {
    const listDiv = document.getElementById('player-list-admin');
    if(!listDiv) return;
    
    listDiv.innerHTML = "";
    const count = Object.keys(players).length;
    
    if(count === 0) {
        listDiv.innerHTML = '<div style="color:#aaa; font-style:italic; grid-column:1/-1;">En attente de joueurs...</div>';
    } else {
        Object.entries(players).forEach(([id, p]) => {
            
            let currentRoleId = p.role;
            let isDraft = false;

            if (p.draftRole) {
                currentRoleId = p.draftRole; 
                isDraft = true;
            }

            let cardImage = "icon.png"; 
            let roleTitle = "En attente...";
            
            if(currentRoleId && detectedRoles.length > 0) {
                const r = detectedRoles.find(x => x.id === currentRoleId);
                if(r) {
                    cardImage = r.image;
                    roleTitle = r.title;
                }
            }

            const isDead = p.status === 'dead';
            const cardClass = isDead ? "admin-player-card dead" : "admin-player-card";
            let buttonsHtml = "";
            let draftBadge = "";

            if (isDraft) {
                // --- MODE BROUILLON (LE BOUTON BLEU EST ICI) ---
                draftBadge = `<div style="background:#e67e22; color:white; font-size:0.7em; padding:2px 6px; border-radius:4px; position:absolute; top:5px; right:5px; z-index:10; font-family:sans-serif;">PROVISOIRE</div>`;
                
                // IMPORTANT : On force pointer-events: auto pour être sûr que le clic passe
                buttonsHtml = `
                    <button class="btn-admin-mini" 
                        style="background:#3498db; color:white; width:100%; border:none; padding:10px; border-radius:5px; cursor:pointer; font-family:'Pirata One'; font-size:1.1em; pointer-events: auto; margin-top:5px; position:relative; z-index:100;" 
                        onclick="event.stopPropagation(); window.openResurrectModal('${id}')">
                        🔄 CHANGER
                    </button>
                `;
            } 
            else if (!currentRoleId) {
                buttonsHtml = `<span style="font-size:0.8em; opacity:0.5;">...</span>`;
            } 
            else if (isDead) {
                buttonsHtml = `<div class="admin-actions">`;
                if(detectedEvents.gold.length > 0) buttonsHtml += `<button class="btn-admin-mini" style="background:gold; color:black;" onclick="event.stopPropagation(); window.adminDraw('${id}', 'gold')">OR</button>`;
                if(detectedEvents.silver.length > 0) buttonsHtml += `<button class="btn-admin-mini" style="background:silver; color:black;" onclick="event.stopPropagation(); window.adminDraw('${id}', 'silver')">ARG</button>`;
                if(detectedEvents.bronze.length > 0) buttonsHtml += `<button class="btn-admin-mini" style="background:#cd7f32; color:black;" onclick="event.stopPropagation(); window.adminDraw('${id}', 'bronze')">BRZ</button>`;
                buttonsHtml += `</div>
                    <button class="btn-admin-mini" style="background:#2ecc71; color:white; width:100%; margin-top:5px;" onclick="event.stopPropagation(); window.openResurrectModal('${id}')">♻️ REVIENT</button>
                `;
            } else {
                buttonsHtml = `<div class="admin-actions"><button class="btn-admin-mini" style="background:#c0392b; color:white; width:100%;" onclick="event.stopPropagation(); window.adminKill('${id}')">💀 MORT</button></div>`;
            }

            listDiv.innerHTML += `
                <div class="${cardClass}" style="position:relative;">
                    ${draftBadge}
                    <img src="${cardImage}" alt="Role">
                    <strong>${p.name}</strong>
                    <div style="font-size:0.8em; color:#aaa; margin-bottom:5px;">${roleTitle}</div>
                    ${buttonsHtml}
                </div>
            `;
        });
    }
    updateAdminButtons(count);
}

function updateAdminButtons(playerCount) {
    const btnDistribute = document.getElementById('btn-distribute');
    const btnReveal = document.getElementById('btn-reveal');
    const selectedCount = document.querySelectorAll('.role-checkbox:checked').length;

    if(!btnDistribute || !btnReveal) return; 

    // 1. Bouton "PRÉPARER" (Gauche)
    if (playerCount > 0 && selectedCount === playerCount) {
        btnDistribute.disabled = false;
        btnDistribute.style.background = "linear-gradient(135deg, #d4af37, #b8941f)";
        btnDistribute.style.cursor = "pointer";
        btnDistribute.innerHTML = isDraftMode ? "🃏 REMÉLANGER" : "🃏 PRÉPARER";
    } else {
        btnDistribute.disabled = true;
        btnDistribute.style.background = "grey";
        btnDistribute.style.cursor = "not-allowed";
        btnDistribute.innerHTML = `Attente (${playerCount}J / ${selectedCount}R)`;
    }

    // 2. Bouton "RÉVÉLER" (Droite)
    if (isDraftMode) {
        btnReveal.style.display = "block"; 
    } else {
        btnReveal.style.display = "none";
    }
}

// Actions Admin
window.adminKill = function(playerId) {
    if(confirm("Confirmer la mort ?")) {
        update(ref(db, `games/${currentGameCode}/players/${playerId}`), { status: 'dead' });
    }
};

window.adminDraw = function(playerId, category) {
    const cards = detectedEvents[category];
    if(cards && cards.length > 0) {
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        update(ref(db, `games/${currentGameCode}/players/${playerId}`), { 
            drawnCard: { image: randomCard, category: category.toUpperCase() }
        });
        alert(`Carte ${category} envoyée !`);
    } else {
        alert("Aucune carte trouvée dans cette catégorie !");
    }
};

// ============================================
// C. LOGIQUE DE CHANGEMENT DE RÔLE (ET RESURRECTION)
// ============================================

function generateResurrectionGrid() {
    const grid = document.getElementById('admin-role-grid');
    if(!grid || detectedRoles.length === 0) return;
    
    grid.innerHTML = "";
    detectedRoles.forEach(role => {
        grid.innerHTML += `
            <div class="role-select-item" onclick="window.assignRoleToPlayer('${role.id}')">
                <img src="${role.image}" loading="lazy">
                <span>${role.title}</span>
            </div>
        `;
    });
}

window.openResurrectModal = function(playerId) {
    targetResurrectId = playerId;
    window.openModal('modal-role-selector');
};

window.assignRoleToPlayer = function(roleId) {
    if(!targetResurrectId) return;

    if (isDraftMode) {
        // Mode Brouillon
        update(ref(db, `games/${currentGameCode}/players/${targetResurrectId}`), { 
            draftRole: roleId 
        });
        window.closeModal('modal-role-selector');
    } else {
        // Mode Jeu
        if(confirm("Cela va changer le rôle du joueur immédiatement. Continuer ?")) {
            update(ref(db, `games/${currentGameCode}/players/${targetResurrectId}`), { 
                status: 'alive', role: roleId, drawnCard: null 
            });
            window.closeModal('modal-role-selector');
            internalShowNotification("Succès", "Rôle mis à jour !");
        }
    }
};

// ============================================
// D. DISTRIBUTION & VALIDATION
// ============================================

function generateRoleChecklist() {
    const container = document.getElementById('roles-selection-list');
    if(!container) return;
    container.innerHTML = "";
    
    if(detectedRoles.length > 0) {
        detectedRoles.forEach((role, index) => {
            container.innerHTML += `
                <div style="margin-bottom:8px; display:flex; align-items:center;">
                    <input type="checkbox" class="role-checkbox" id="role-${index}" value="${role.id}" onchange="window.updateRoleCount()" style="width:20px; height:20px; margin-right:10px;">
                    <label for="role-${index}" style="color:#ddd; cursor:pointer;">${role.title}</label>
                </div>
            `;
        });
    }
}

window.updateRoleCount = function() {
    const selected = document.querySelectorAll('.role-checkbox:checked').length;
    const countSpan = document.getElementById('role-count');
    if(countSpan) countSpan.innerText = selected;
    
    get(child(ref(db), `games/${currentGameCode}/players`)).then((snapshot) => {
        const playerCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
        updateAdminButtons(playerCount);
    });
};

function distributeRoles() {
    const checkboxes = document.querySelectorAll('.role-checkbox:checked');
    let selectedRoles = [];
    checkboxes.forEach(box => selectedRoles.push(box.value));
    
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
            }
        });
        update(ref(db), updates);
    });
}

function revealRolesToEveryone() {
    if(!confirm("Es-tu sûr de la distribution ? Les rôles vont être envoyés aux joueurs.")) return;

    const playersRef = ref(db, 'games/' + currentGameCode + '/players');
    get(playersRef).then((snapshot) => {
        const players = snapshot.val();
        if(!players) return;
        
        const updates = {};
        Object.entries(players).forEach(([id, p]) => {
            if (p.draftRole) {
                updates[`games/${currentGameCode}/players/${id}/role`] = p.draftRole;
                updates[`games/${currentGameCode}/players/${id}/draftRole`] = null; 
                updates[`games/${currentGameCode}/players/${id}/status`] = 'alive';
            }
        });
        
        update(ref(db), updates).then(() => {
            alert("🚀 Rôles envoyés ! La partie commence.");
        });
    });
}

// ============================================
// E. CÔTÉ JOUEUR
// ============================================

function joinGame() {
    const pseudo = document.getElementById('join-pseudo').value.trim();
    const code = document.getElementById('join-code').value.toUpperCase().trim();

    if(!pseudo || !code) { alert("Merci de tout remplir !"); return; }
    currentGameCode = code;
    
    get(child(ref(db), `games/${code}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const newPlayerRef = push(ref(db, `games/${code}/players`));
            myPlayerId = newPlayerRef.key;
            set(newPlayerRef, { name: pseudo, role: null, status: 'alive' }).then(() => {
                document.getElementById('btn-join-action').style.display = 'none';
                document.getElementById('player-lobby-status').style.display = 'block';
                listenForPlayerUpdates();
            });
        } else { alert("Code partie introuvable !"); }
    });
}

function listenForPlayerUpdates() {
    const myPlayerRef = ref(db, `games/${currentGameCode}/players/${myPlayerId}`);
    let lastRole = null;
    let lastCardImg = null;

    onValue(myPlayerRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        if (data.role) {
            myCurrentRoleId = data.role; 
            
            if (data.role !== lastRole) {
                lastRole = data.role;
                revealRole(data.role);
            }

            const lobbyStatus = document.getElementById('player-lobby-status');
            if(lobbyStatus) {
                lobbyStatus.innerHTML = `
                    <h3 style="color:var(--gold);">Tu es en jeu !</h3>
                    <div style="margin:20px 0;">
                        <button class="btn-menu" style="background:var(--gold); color:black; font-weight:bold; padding:15px; width:100%; border:2px solid #fff;" onclick="window.showMyRoleAgain()">🃏 VOIR MA CARTE</button>
                    </div>
                    <p style="opacity:0.7;">Attend les instructions du MJ...</p>
                `;
            }
        }

        if (data.status === 'dead') {
            internalShowNotification("💀 TU ES MORT", "Attends de voir si le destin t'offre une carte...");
            document.getElementById('player-lobby-status').innerHTML = `<h3 style="color:#c0392b;">TU ES MORT 💀</h3>`;
        }

        if (data.drawnCard && data.drawnCard.image !== lastCardImg) {
            lastCardImg = data.drawnCard.image;
            internalShowCard({
                title: `CARTE ${data.drawnCard.category}`,
                image: data.drawnCard.image,
                description: `<span style="color:gold;">Carte Événement</span>`
            });
        }
    });
}

window.showMyRoleAgain = function() {
    if(!myCurrentRoleId) return;
    revealRole(myCurrentRoleId);
};

// ============================================
// F. FONCTIONS D'AFFICHAGE
// ============================================

function revealRole(roleId) {
    window.closeModal('modal-join-game');
    window.closeModal('modal-online-menu');
    
    const roleData = detectedRoles.find(r => r.id === roleId);
    if(roleData) {
        if(navigator.vibrate) navigator.vibrate([200, 100, 200]);
        internalShowCard(roleData);
    }
}

function internalShowCard(data) {
    const panel = document.querySelector('.details-panel');
    const overlay = document.querySelector('.details-overlay');
    
    if(!panel || !overlay) return;

    panel.innerHTML = `
        <div id="online-content-wrapper">
            <div class="details-header" style="text-align:center;">
                <button class="close-details" onclick="window.internalCloseDetails()">✕</button>
                <h2 class="details-title">${data.title}</h2>
            </div>
            
            <div class="scene-flip" onclick="
                this.classList.toggle('is-flipped'); 
                document.getElementById('online-content-wrapper').classList.add('revealed');
            ">
                <div class="card-object">
                    <div class="card-face face-front">
                        <img src="back.png" class="card-back-img" alt="Dos">
                        <div class="tap-hint">👆 Taper pour révéler (Cliquer pour retourner)</div>
                    </div>
                    <div class="card-face face-back">
                        <img src="${data.image}" alt="Rôle">
                    </div>
                </div>
            </div>
            
            <div class="details-section" style="text-align:center;">
                ${data.description}
            </div>
        </div>
    `;
    
    panel.classList.add('active');
    overlay.classList.add('active');
}

window.internalCloseDetails = function() {
    document.querySelector('.details-panel').classList.remove('active');
    document.querySelector('.details-overlay').classList.remove('active');
};

function internalShowNotification(title, message) {
    const overlay = document.querySelector('.notification-overlay');
    const box = document.querySelector('.notification-box');
    if(overlay && box) {
        box.innerHTML = `<h3 style="color:gold;">${title}</h3><p>${message}</p><button onclick="document.querySelector('.notification-overlay').classList.remove('active')">OK</button>`;
        overlay.classList.add('active');
    } else {
        alert(title + "\n" + message);
    }
}
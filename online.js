// ============================================
// SYSTEME EN LIGNE - LE VILLAGE MAUDIT (V8 - DISTRIBUTION AVEC VALIDATION)
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
let targetResurrectId = null;
let detectedRoles = [];
let detectedEvents = { gold: [], silver: [], bronze: [] };
let isDraftMode = false; // Pour savoir si on est en train de distribuer

// ============================================
// A. GESTION DU MENU & SCAN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    scanContentFromHTML();

    const btnJoin = document.getElementById('btn-join-action');
    if(btnJoin) btnJoin.addEventListener('click', joinGame);

    const btnDistribute = document.getElementById('btn-distribute');
    if(btnDistribute) btnDistribute.addEventListener('click', handleDistributionClick);
});

function scanContentFromHTML() {
    detectedRoles = [];
    detectedEvents = { gold: [], silver: [], bronze: [] };

    // Scanner les Rôles
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

    // Scanner les Cartes VM
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
        document.getElementById('admin-dashboard').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        window.closeModal('modal-online-menu');
    } else if (password !== null) {
        alert("⛔ Accès refusé !");
    }
};

window.closeAdminPanel = function() {
    if(confirm("Quitter le mode Admin ? La partie continuera en fond.")) {
        document.getElementById('admin-dashboard').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// ============================================
// B. ADMIN (MJ)
// ============================================

window.initCreateGame = function() {
    currentGameCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    myPlayerId = "MJ_ADMIN";
    
    document.getElementById('game-code-display').innerText = currentGameCode;
    
    set(ref(db, 'games/' + currentGameCode), {
        status: 'waiting',
        created_at: Date.now()
    });

    onValue(ref(db, 'games/' + currentGameCode + '/players'), (snapshot) => {
        const players = snapshot.val() || {};
        // On vérifie si on est en mode brouillon (si au moins un joueur a un draftRole)
        isDraftMode = Object.values(players).some(p => p.draftRole);
        updateAdminUI(players);
    });

    generateRoleChecklist();
    generateResurrectionGrid(); 
};

function updateAdminUI(players) {
    const listDiv = document.getElementById('player-list-admin');
    if(!listDiv) return;
    
    listDiv.innerHTML = "";
    const count = Object.keys(players).length;
    
    if(count === 0) {
        listDiv.innerHTML = '<div style="color:#aaa; font-style:italic; grid-column:1/-1;">En attente de joueurs...</div>';
    } else {
        Object.entries(players).forEach(([id, p]) => {
            
            // 1. DÉTERMINER LE RÔLE À AFFICHER (Draft ou Validé)
            let currentRoleId = p.role; // Rôle validé
            let isDraft = false;

            if (p.draftRole) {
                currentRoleId = p.draftRole; // Si brouillon existe, on montre le brouillon
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

            // 2. BOUTONS & STYLE
            const isDead = p.status === 'dead';
            const cardClass = isDead ? "admin-player-card dead" : "admin-player-card";
            let buttonsHtml = "";
            let draftBadge = "";

            if (isDraft) {
                // MODE BROUILLON : On peut changer le rôle
                draftBadge = `<div class="draft-mode-badge">PROVISOIRE</div>`;
                buttonsHtml = `
                    <button class="btn-admin-mini" style="background:#3498db; color:white; width:100%;" onclick="window.openResurrectModal('${id}')">🔄 CHANGER</button>
                `;
            } 
            else if (!currentRoleId) {
                buttonsHtml = `<span style="font-size:0.8em; opacity:0.5;">...</span>`;
            } 
            else if (isDead) {
                // MORT VALIDÉ
                buttonsHtml = `<div class="admin-actions">`;
                if(detectedEvents.gold.length > 0) buttonsHtml += `<button class="btn-admin-mini" style="background:gold; color:black;" onclick="window.adminDraw('${id}', 'gold')">OR</button>`;
                if(detectedEvents.silver.length > 0) buttonsHtml += `<button class="btn-admin-mini" style="background:silver; color:black;" onclick="window.adminDraw('${id}', 'silver')">ARG</button>`;
                if(detectedEvents.bronze.length > 0) buttonsHtml += `<button class="btn-admin-mini" style="background:#cd7f32; color:black;" onclick="window.adminDraw('${id}', 'bronze')">BRZ</button>`;
                buttonsHtml += `</div>
                    <button class="btn-admin-mini" style="background:#2ecc71; color:white; width:100%; margin-top:5px;" onclick="window.openResurrectModal('${id}')">♻️ REVIENT</button>
                `;
            } else {
                // VIVANT VALIDÉ
                buttonsHtml = `<div class="admin-actions"><button class="btn-admin-mini" style="background:#c0392b; color:white; width:100%;" onclick="window.adminKill('${id}')">💀 MORT</button></div>`;
            }

            listDiv.innerHTML += `
                <div class="${cardClass}" onclick="${isDraft ? `window.openResurrectModal('${id}')` : ''}">
                    ${draftBadge}
                    <img src="${cardImage}" alt="Role">
                    <strong>${p.name}</strong>
                    <div style="font-size:0.8em; color:#aaa; margin-bottom:5px;">${roleTitle}</div>
                    ${buttonsHtml}
                </div>
            `;
        });
    }
    
    updateMainButton(count);
}

// GESTION DU BOUTON PRINCIPAL (DISTRIBUER vs RÉVÉLER)
function updateMainButton(playerCount) {
    const btn = document.getElementById('btn-distribute');
    const selectedCount = document.querySelectorAll('.role-checkbox:checked').length;

    if (isDraftMode) {
        // Si on est en mode brouillon, le bouton sert à valider
        btn.disabled = false;
        btn.className = "btn-validate btn-distribute-big btn-reveal"; // Classe verte
        btn.innerText = "📢 RÉVÉLER AUX JOUEURS";
        btn.onclick = revealRolesToEveryone; // Nouvelle action
    } else {
        // Sinon, c'est le bouton distribuer classique
        btn.className = "btn-validate btn-distribute-big"; // Classe dorée
        btn.onclick = distributeRoles; // Action distribution
        
        if (playerCount > 0 && selectedCount === playerCount) {
            btn.disabled = false;
            btn.style.background = "linear-gradient(135deg, #d4af37, #b8941f)";
            btn.style.cursor = "pointer";
            btn.innerText = "🃏 PRÉPARER LA DISTRIBUTION";
        } else {
            btn.disabled = true;
            btn.style.background = "grey";
            btn.style.cursor = "not-allowed";
            btn.innerText = `Attente (${playerCount} Joueurs / ${selectedCount} Rôles)`;
        }
    }
}

// Fonction intermédiaire pour gérer le clic
function handleDistributionClick() {
    if(isDraftMode) {
        revealRolesToEveryone();
    } else {
        distributeRoles();
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

// Cette fonction gère TOUS les changements de rôle (Brouillon ou Jeu)
window.assignRoleToPlayer = function(roleId) {
    if(!targetResurrectId) return;

    if (isDraftMode) {
        // Mode Brouillon : on change juste le draftRole
        update(ref(db, `games/${currentGameCode}/players/${targetResurrectId}`), { 
            draftRole: roleId 
        });
        window.closeModal('modal-role-selector');
    } else {
        // Mode Jeu : Résurrection ou Changement forcé
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
        // On force la mise à jour du bouton
        updateMainButton(playerCount);
    });
};

// ETAPE 1 : DISTRIBUTION BROUILLON (INVISIBLE AUX JOUEURS)
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
                // ON UTILISE draftRole AU LIEU DE role
                updates[`games/${currentGameCode}/players/${id}/draftRole`] = selectedRoles[index];
            }
        });
        update(ref(db), updates);
        isDraftMode = true; // Active le mode brouillon localement
    });
}

// ETAPE 2 : VALIDATION FINALE (RÉVÉLATION)
function revealRolesToEveryone() {
    if(!confirm("Es-tu sûr de la distribution ? Les rôles vont être envoyés aux joueurs.")) return;

    const playersRef = ref(db, 'games/' + currentGameCode + '/players');
    get(playersRef).then((snapshot) => {
        const players = snapshot.val();
        if(!players) return;
        
        const updates = {};
        Object.entries(players).forEach(([id, p]) => {
            if (p.draftRole) {
                // On transfère draftRole vers role
                updates[`games/${currentGameCode}/players/${id}/role`] = p.draftRole;
                updates[`games/${currentGameCode}/players/${id}/draftRole`] = null; // On vide le brouillon
                updates[`games/${currentGameCode}/players/${id}/status`] = 'alive';
            }
        });
        
        update(ref(db), updates).then(() => {
            isDraftMode = false;
            alert("🚀 Rôles envoyés ! La partie commence.");
        });
    });
}

// ============================================
// E. CÔTÉ JOUEUR (Reste identique)
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

        // On écoute UNIQUEMENT 'role', on ignore 'draftRole'
        if (data.role && data.role !== lastRole) {
            lastRole = data.role;
            revealRole(data.role);
        }

        if (data.status === 'dead') {
            internalShowNotification("💀 TU ES MORT", "Attends de voir si le destin t'offre une carte...");
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

    // On injecte le HTML avec un conteneur spécial pour gérer l'apparition du texte
    panel.innerHTML = `
        <div id="online-content-wrapper">
            
            <div class="details-header" style="text-align:center;">
                <button class="close-details" onclick="window.internalCloseDetails()">✕</button>
                <h2 class="details-title">${data.title}</h2>
            </div>

            <div class="scene-flip" onclick="
                this.classList.add('is-flipped'); 
                document.getElementById('online-content-wrapper').classList.add('revealed');
            ">
                <div class="card-object">
                    
                    <div class="card-face face-front">
                        <img src="back.png" class="card-back-img" alt="Dos">
                        <div class="tap-hint">👆 Taper pour révéler</div>
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
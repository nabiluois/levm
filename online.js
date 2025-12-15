// ============================================
// SYSTEME EN LIGNE - LE VILLAGE MAUDIT (V3 - VISUEL TOTAL)
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, update, get, child } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 1. CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyDbOZGB_e-v82n3eZaXq3_Eq8GHW0OLkXo",
  authDomain: "le-village-maudit.firebaseapp.com",
  projectId: "le-village-maudit",
  storageBucket: "le-village-maudit.firebasestorage.app",
  messagingSenderId: "383628308052",
  appId: "1:383628308052:web:133e1c7c63b6c4aa94c7c1",
  measurementId: "G-SKED9ZP8SN"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentGameCode = null;
let myPlayerId = null;
let targetResurrectId = null; // Stocke l'ID du joueur qu'on veut ressusciter

const VM_CARDS = {
    gold: ['or1.png', 'or2.png', 'or3.png', 'or4.png', 'or5.png', 'or6.png', 'or7.png', 'or8.png', 'or9.png', 'or10.png'],
    silver: ['ar1.png', 'ar2.png', 'ar3.png', 'ar4.png', 'ar5.png', 'ar6.png', 'ar7.png', 'ar8.png', 'ar9.png', 'ar10.png'],
    bronze: ['br1.png', 'br2.png', 'br3.png', 'br4.png', 'br5.png', 'br6.png', 'br7.png']
};

// ============================================
// A. GESTION DOM
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const btnOnline = document.getElementById('btn-online-mode');
    if(btnOnline) btnOnline.addEventListener('click', () => window.openModal('modal-online-menu'));

    const btnJoin = document.getElementById('btn-join-action');
    if(btnJoin) btnJoin.addEventListener('click', joinGame);

    const btnDistribute = document.getElementById('btn-distribute');
    if(btnDistribute) btnDistribute.addEventListener('click', distributeRoles);
});

// ============================================
// B. ADMIN (MJ) - LOGIQUE VISUELLE
// ============================================

window.initCreateGame = function() {
    currentGameCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    myPlayerId = "MJ_ADMIN";
    
    const display = document.getElementById('game-code-display');
    if(display) display.innerText = currentGameCode;
    
    set(ref(db, 'games/' + currentGameCode), {
        status: 'waiting',
        created_at: Date.now()
    });

    const playersRef = ref(db, 'games/' + currentGameCode + '/players');
    onValue(playersRef, (snapshot) => {
        const players = snapshot.val() || {};
        updateAdminUI(players);
    });

    generateRoleChecklist();
    generateResurrectionGrid(); // Prépare la grille des images
};

// NOUVELLE FONCTION D'AFFICHAGE (VISUEL)
function updateAdminUI(players) {
    const listDiv = document.getElementById('player-list-admin');
    if(!listDiv) return;
    
    listDiv.innerHTML = "";
    const count = Object.keys(players).length;
    
    if(count === 0) {
        listDiv.innerHTML = '<div style="color:#aaa; font-style:italic; grid-column:1/-1;">En attente de joueurs...</div>';
    } else {
        Object.entries(players).forEach(([id, p]) => {
            
            // 1. Déterminer l'image à afficher
            let cardImage = "icon.png"; // Image par défaut (dos de carte ou logo)
            let roleTitle = "En attente...";
            
            if(p.role && window.paniniRoles) {
                const r = window.paniniRoles.find(x => x.id === p.role);
                if(r) {
                    cardImage = r.image;
                    roleTitle = r.title;
                }
            }

            // 2. Gestion Mort / Vivant
            const isDead = p.status === 'dead';
            const cardClass = isDead ? "admin-player-card dead" : "admin-player-card";
            
            // 3. Construction des boutons
            let buttonsHtml = "";

            if (!p.role) {
                // Pas encore distribué
                buttonsHtml = `<span style="font-size:0.8em; opacity:0.5;">...</span>`;
            } 
            else if (isDead) {
                // MORT : Options VM + Résurrection
                buttonsHtml = `
                    <div class="admin-actions">
                        <button class="btn-admin-mini" style="background:gold; color:black;" onclick="window.adminDraw('${id}', 'gold')">OR</button>
                        <button class="btn-admin-mini" style="background:silver; color:black;" onclick="window.adminDraw('${id}', 'silver')">ARG</button>
                        <button class="btn-admin-mini" style="background:#cd7f32; color:black;" onclick="window.adminDraw('${id}', 'bronze')">BRZ</button>
                    </div>
                    <button class="btn-admin-mini" style="background:#2ecc71; color:white; width:100%; margin-top:5px;" onclick="window.openResurrectModal('${id}')">♻️ REVIENT</button>
                `;
            } else {
                // VIVANT : Option Tuer
                buttonsHtml = `
                    <div class="admin-actions">
                        <button class="btn-admin-mini" style="background:#c0392b; color:white; width:100%;" onclick="window.adminKill('${id}')">💀 MORT</button>
                    </div>
                `;
            }

            // 4. Injection HTML
            listDiv.innerHTML += `
                <div class="${cardClass}">
                    <img src="${cardImage}" alt="Role">
                    <strong>${p.name}</strong>
                    <div style="font-size:0.8em; color:#aaa; margin-bottom:5px;">${roleTitle}</div>
                    ${buttonsHtml}
                </div>
            `;
        });
    }
    checkDistributionReady(count);
}

// Actions directes
window.adminKill = function(playerId) {
    if(confirm("Valider la mort ?")) {
        update(ref(db, `games/${currentGameCode}/players/${playerId}`), { status: 'dead' });
    }
};

window.adminDraw = function(playerId, category) {
    const cards = VM_CARDS[category];
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    
    update(ref(db, `games/${currentGameCode}/players/${playerId}`), { 
        drawnCard: { image: randomCard, category: category.toUpperCase() }
    });
    alert(`Carte ${category} envoyée !`);
};

// ============================================
// C. LOGIQUE DE RESSURECTION VISUELLE
// ============================================

// 1. Prépare la grille d'images dans la modale (une seule fois au début)
function generateResurrectionGrid() {
    const grid = document.getElementById('admin-role-grid');
    if(!grid || !window.paniniRoles) return;
    
    grid.innerHTML = "";
    window.paniniRoles.forEach(role => {
        grid.innerHTML += `
            <div class="role-select-item" onclick="window.confirmResurrection('${role.id}')">
                <img src="${role.image}" loading="lazy">
                <span>${role.title}</span>
            </div>
        `;
    });
}

// 2. Ouvre la modale et stocke l'ID du joueur
window.openResurrectModal = function(playerId) {
    targetResurrectId = playerId;
    window.openModal('modal-role-selector');
};

// 3. Quand on clique sur une image
window.confirmResurrection = function(roleId) {
    if(!targetResurrectId) return;

    update(ref(db, `games/${currentGameCode}/players/${targetResurrectId}`), { 
        status: 'alive',
        role: roleId,
        drawnCard: null 
    });
    
    window.closeModal('modal-role-selector');
    window.showNotification("Succès", "Le joueur est revenu dans la partie !");
};

// ============================================
// D. DISTRIBUTION & LISTE (Reste identique mais nécessaire)
// ============================================

function generateRoleChecklist() {
    const container = document.getElementById('roles-selection-list');
    if(!container) return;
    container.innerHTML = "";
    if(window.paniniRoles) {
        window.paniniRoles.forEach((role, index) => {
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
        checkDistributionReady(playerCount);
    });
};

function checkDistributionReady(playerCount) {
    const selectedCount = document.querySelectorAll('.role-checkbox:checked').length;
    const btn = document.getElementById('btn-distribute');
    if(!btn) return;
    
    if (playerCount > 0 && selectedCount === playerCount) {
        btn.disabled = false;
        btn.style.background = "linear-gradient(135deg, #d4af37, #b8941f)";
        btn.style.cursor = "pointer";
        btn.innerText = "🃏 DISTRIBUER";
        btn.style.opacity = "1";
    } else {
        btn.disabled = true;
        btn.style.background = "grey";
        btn.style.cursor = "not-allowed";
        btn.innerText = `Attente (${playerCount} Joueurs / ${selectedCount} Rôles)`;
    }
}

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
                updates[`games/${currentGameCode}/players/${id}/role`] = selectedRoles[index];
                updates[`games/${currentGameCode}/players/${id}/status`] = 'alive';
            }
        });
        update(ref(db), updates);
    });
}

// ============================================
// E. CÔTÉ JOUEUR
// ============================================

function joinGame() {
    const pseudo = document.getElementById('join-pseudo').value.trim();
    const code = document.getElementById('join-code').value.toUpperCase().trim();

    if(!pseudo || !code) { alert("Remplis tout !"); return; }
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
        } else { alert("Code faux !"); }
    });
}

function listenForPlayerUpdates() {
    const myPlayerRef = ref(db, `games/${currentGameCode}/players/${myPlayerId}`);
    let lastRole = null;
    let lastCardImg = null;

    onValue(myPlayerRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        // Rôle changé ? (Nouveau ou Résurrection)
        if (data.role && data.role !== lastRole) {
            lastRole = data.role;
            revealRole(data.role);
        }

        // Mort ?
        if (data.status === 'dead') {
            window.showNotification("💀 TU ES MORT", "Le village a parlé (ou les loups...).");
        }

        // Carte VM ?
        if (data.drawnCard && data.drawnCard.image !== lastCardImg) {
            lastCardImg = data.drawnCard.image;
            const vmObject = {
                title: `CARTE ${data.drawnCard.category}`,
                image: data.drawnCard.image,
                description: `<span style="color:gold;">Carte Événement</span>`
            };
            if(window.openDetails) window.openDetails(vmObject);
        }
    });
}

function revealRole(roleId) {
    window.closeModal('modal-join-game');
    window.closeModal('modal-online-menu');
    if(window.paniniRoles) {
        const roleData = window.paniniRoles.find(r => r.id === roleId);
        if(roleData) {
            setTimeout(() => {
                if(navigator.vibrate) navigator.vibrate([200, 100, 200]);
                if(window.openDetails) window.openDetails(roleData);
            }, 500);
        }
    }
}
// ============================================
// SYSTEME EN LIGNE - LE VILLAGE MAUDIT (V6 - SCAN COMPLET)
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

// Listes dynamiques remplies par le scan HTML
let detectedRoles = []; 
let detectedEvents = {
    gold: [],
    silver: [],
    bronze: []
};

// ============================================
// A. GESTION DU MENU & SCAN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    scanContentFromHTML(); // Scan automatique au lancement

    const btnJoin = document.getElementById('btn-join-action');
    if(btnJoin) btnJoin.addEventListener('click', joinGame);

    const btnDistribute = document.getElementById('btn-distribute');
    if(btnDistribute) btnDistribute.addEventListener('click', distributeRoles);
});

// FONCTION DE SCAN INTELLIGENT
function scanContentFromHTML() {
    detectedRoles = [];
    detectedEvents = { gold: [], silver: [], bronze: [] };

    // 1. Scanner les Rôles (.carte-jeu) pour la distribution
    document.querySelectorAll('.carte-jeu').forEach((card) => {
        const imgTag = card.querySelector('.carte-front img');
        const titleTag = card.querySelector('.carte-back h3');
        
        if (imgTag && titleTag) {
            const imgSrc = imgTag.getAttribute('src');
            const id = imgSrc.split('/').pop().replace(/\.[^/.]+$/, ""); // ID basé sur le nom de fichier
            
            detectedRoles.push({
                id: id,
                title: titleTag.innerText,
                image: imgSrc,
                description: card.querySelector('.carte-back p') ? card.querySelector('.carte-back p').innerHTML : ""
            });
        }
    });

    // 2. Scanner les Événements (.carte-vm) pour la mort
    document.querySelectorAll('.carte-vm').forEach((card) => {
        const imgTag = card.querySelector('img');
        if (imgTag) {
            const imgSrc = imgTag.getAttribute('src'); // ex: or1.png
            
            // On classe selon la classe HTML (gold, silver, bronze)
            if (card.classList.contains('gold')) detectedEvents.gold.push(imgSrc);
            else if (card.classList.contains('silver')) detectedEvents.silver.push(imgSrc);
            else if (card.classList.contains('bronze')) detectedEvents.bronze.push(imgSrc);
        }
    });

    console.log(`Scan terminé : ${detectedRoles.length} Rôles, ${detectedEvents.gold.length} Or, ${detectedEvents.silver.length} Argent.`);
}

// Sécurité MJ
window.checkAdminPassword = function() {
    const password = prompt("🔐 Mot de passe MJ :");
    if(password === "1234") {
        window.initCreateGame();
        window.openModal('modal-create-game');
        window.closeModal('modal-online-menu');
    } else if (password !== null) {
        alert("⛔ Accès refusé !");
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
        updateAdminUI(snapshot.val() || {});
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
            let cardImage = "icon.png"; 
            let roleTitle = "En attente...";
            
            if(p.role && detectedRoles.length > 0) {
                const r = detectedRoles.find(x => x.id === p.role);
                if(r) {
                    cardImage = r.image;
                    roleTitle = r.title;
                }
            }

            const isDead = p.status === 'dead';
            const cardClass = isDead ? "admin-player-card dead" : "admin-player-card";
            
            let buttonsHtml = "";
            if (!p.role) {
                buttonsHtml = `<span style="font-size:0.8em; opacity:0.5;">...</span>`;
            } 
            else if (isDead) {
                // Boutons basés sur les catégories détectées
                buttonsHtml = `<div class="admin-actions">`;
                
                if(detectedEvents.gold.length > 0) buttonsHtml += `<button class="btn-admin-mini" style="background:gold; color:black;" onclick="window.adminDraw('${id}', 'gold')">OR</button>`;
                if(detectedEvents.silver.length > 0) buttonsHtml += `<button class="btn-admin-mini" style="background:silver; color:black;" onclick="window.adminDraw('${id}', 'silver')">ARG</button>`;
                if(detectedEvents.bronze.length > 0) buttonsHtml += `<button class="btn-admin-mini" style="background:#cd7f32; color:black;" onclick="window.adminDraw('${id}', 'bronze')">BRZ</button>`;
                
                buttonsHtml += `</div>
                    <button class="btn-admin-mini" style="background:#2ecc71; color:white; width:100%; margin-top:5px;" onclick="window.openResurrectModal('${id}')">♻️ REVIENT</button>
                `;
            } else {
                buttonsHtml = `<div class="admin-actions"><button class="btn-admin-mini" style="background:#c0392b; color:white; width:100%;" onclick="window.adminKill('${id}')">💀 MORT</button></div>`;
            }

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
// C. LOGIQUE DE RESSURECTION
// ============================================

function generateResurrectionGrid() {
    const grid = document.getElementById('admin-role-grid');
    if(!grid || detectedRoles.length === 0) return;
    
    grid.innerHTML = "";
    detectedRoles.forEach(role => {
        grid.innerHTML += `
            <div class="role-select-item" onclick="window.confirmResurrection('${role.id}')">
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

window.confirmResurrection = function(roleId) {
    if(!targetResurrectId) return;
    update(ref(db, `games/${currentGameCode}/players/${targetResurrectId}`), { 
        status: 'alive', role: roleId, drawnCard: null 
    });
    window.closeModal('modal-role-selector');
    window.showNotification("Succès", "Le joueur est ressuscité !");
};

// ============================================
// D. DISTRIBUTION DES RÔLES
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
    } else {
        container.innerHTML = "<p style='color:red;'>Aucun rôle trouvé. Vérifie le HTML.</p>";
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
    
    // Mélange (Shuffle)
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

        // Rôle changé ? (Nouveau ou Résurrection)
        if (data.role && data.role !== lastRole) {
            lastRole = data.role;
            revealRole(data.role);
        }

        // Mort ?
        if (data.status === 'dead') {
            window.showNotification("💀 TU ES MORT", "Attends de voir si le destin t'offre une carte...");
        }

        // Carte VM ? (Gold/Silver/Bronze)
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
    
    const roleData = detectedRoles.find(r => r.id === roleId);
    if(roleData) {
        setTimeout(() => {
            if(navigator.vibrate) navigator.vibrate([200, 100, 200]);
            if(window.openDetails) window.openDetails(roleData);
        }, 500);
    }
}
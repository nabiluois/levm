// ============================================
// SYSTEME EN LIGNE - LE VILLAGE MAUDIT (V21 - COMPLET & CATÉGORISÉ)
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
    setTimeout(() => {
        scanContentFromHTML();
    }, 500);
    
    ensureAdminButtonsExist(); 

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

// SCAN AMÉLIORÉ (SÉCURITÉ + CATÉGORIE)
function scanContentFromHTML() {
    detectedRoles = [];
    detectedEvents = { gold: [], silver: [], bronze: [] };

    document.querySelectorAll('.carte-jeu').forEach((card) => {
        const imgTag = card.querySelector('.carte-front img');
        const titleTag = card.querySelector('.carte-back h3'); 
        
        // On détecte la section parente (Category)
        const section = card.closest('section');
        const categoryId = section ? section.id : 'autre'; // village, loups, solo, vampires
        
        if (imgTag && titleTag) {
            const imgSrc = imgTag.getAttribute('src');
            const id = imgSrc.split('/').pop().replace(/\.[^/.]+$/, "");
            
            detectedRoles.push({
                id: id,
                title: titleTag.innerText.trim(),
                image: imgSrc,
                category: categoryId, // On stocke la catégorie
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
    
    console.log("Rôles détectés :", detectedRoles.length);
}

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
    
    if(window.generateResurrectionGrid) window.generateResurrectionGrid(); 
}

function setupAdminListeners() {
    onValue(ref(db, 'games/' + currentGameCode + '/players'), (snapshot) => {
        const players = snapshot.val() || {};
        isDraftMode = Object.values(players).some(p => p.draftRole);
        updateAdminUI(players);
    });
}

// ============================================
// C. LOGIQUE DE CHANGEMENT DE RÔLE (V20 - TRI & 2 COLONNES)
// ============================================

// 1. Génération de la grille ORGANISÉE
window.generateResurrectionGrid = function() {
    const grid = document.getElementById('admin-role-grid');
    if(!grid) return;
    
    if (detectedRoles.length === 0) {
        scanContentFromHTML();
    }

    // Réinitialisation complète du style de la grille pour supprimer le grid par défaut
    // On va gérer le grid à l'intérieur des catégories
    grid.style.display = "block"; 
    grid.innerHTML = "";
    
    // Définition de l'ordre d'affichage
    const categoriesOrder = {
        'village': '🏡 VILLAGE',
        'loups': '🐺 LOUPS',
        'solo': '🎭 SOLOS',
        'vampires': '🧛 VAMPIRES',
        'autre': '❓ AUTRES'
    };

    // Pour chaque catégorie, on crée une section
    for (const [catKey, catTitle] of Object.entries(categoriesOrder)) {
        // Filtrer les rôles de cette catégorie
        const rolesInCat = detectedRoles.filter(r => r.category === catKey);
        
        // S'il y a des rôles, on affiche
        if (rolesInCat.length > 0) {
            // Titre de séparation
            const titleDiv = document.createElement('div');
            titleDiv.innerHTML = `<h3 style="color:var(--gold); border-bottom:1px solid #555; padding-bottom:5px; margin-top:20px; margin-bottom:10px; font-family:'Pirata One'; font-size:1.4em;">${catTitle}</h3>`;
            grid.appendChild(titleDiv);

            // Conteneur Grille 2 Colonnes
            const catGrid = document.createElement('div');
            catGrid.style.display = "grid";
            catGrid.style.gridTemplateColumns = "repeat(2, 1fr)"; // FORCE 2 COLONNES
            catGrid.style.gap = "10px";
            
            // Tri alphabétique interne
            rolesInCat.sort((a, b) => a.title.localeCompare(b.title));

            rolesInCat.forEach(role => {
                const div = document.createElement('div');
                div.className = "role-select-item";
                div.style.cursor = "pointer";
                div.style.textAlign = "center";
                div.style.background = "rgba(255,255,255,0.05)";
                div.style.padding = "5px";
                div.style.borderRadius = "8px";
                
                div.innerHTML = `
                    <img src="${role.image}" loading="lazy" style="width:100%; height:auto; border-radius:6px;">
                    <span style="display:block; font-size:0.85em; color:#ddd; margin-top:4px; line-height:1.1;">${role.title}</span>
                `;
                
                div.onclick = function() { 
                    window.assignRoleToPlayer(role.id); 
                };
                
                catGrid.appendChild(div);
            });

            grid.appendChild(catGrid);
        }
    }
};

// 2. Fonction d'ouverture
window.openResurrectModal = function(playerId) {
    targetResurrectId = playerId;
    
    window.generateResurrectionGrid();

    const modalTitle = document.querySelector('#modal-role-selector h2');
    if(modalTitle) {
        modalTitle.innerText = isDraftMode ? "CHANGER CARTE" : "RESSUSCITER";
        modalTitle.style.fontSize = "1.5em"; // Réduire la taille du titre
    }

    // FIX Z-INDEX
    const modal = document.getElementById('modal-role-selector');
    if(modal) {
        modal.style.zIndex = "20000"; 
    }

    window.openModal('modal-role-selector');
};

// 3. Assignation du rôle
window.assignRoleToPlayer = function(roleId) {
    if(!targetResurrectId) return;

    if (isDraftMode) {
        update(ref(db, `games/${currentGameCode}/players/${targetResurrectId}`), { 
            draftRole: roleId 
        }).then(() => {
            window.closeModal('modal-role-selector');
        });
    } else {
        if(confirm("Confirmer le changement de rôle ?")) {
            update(ref(db, `games/${currentGameCode}/players/${targetResurrectId}`), { 
                status: 'alive', 
                role: roleId, 
                drawnCard: null 
            });
            window.closeModal('modal-role-selector');
            internalShowNotification("Succès", "Rôle modifié !");
        }
    }
};

// ============================================
// D. MISE À JOUR DE L'INTERFACE ADMIN (DOM) - V21
// ============================================
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

            const cardDiv = document.createElement('div');
            cardDiv.className = cardClass;
            cardDiv.style.position = 'relative';

            // HTML de base
            let innerHTML = `
                <img src="${cardImage}" alt="Role">
                <strong>${p.name}</strong>
                <div style="font-size:0.75em; color:#aaa; margin-bottom:5px; line-height:1.1;">${roleTitle}</div>
            `;

            // BADGE RACCOURCI ("PROV.")
            if(isDraft) {
                innerHTML = `<div style="background:#e67e22; color:white; font-size:0.6em; padding:2px 5px; border-radius:4px; position:absolute; top:3px; right:3px; z-index:10; font-family:sans-serif; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.5);">PROV.</div>` + innerHTML;
            }

            cardDiv.innerHTML = innerHTML;

            const forceClickStyle = "pointer-events: auto; opacity: 1; filter: none; cursor: pointer; position:relative; z-index:100;";

            if (isDraft) {
                const btnChange = document.createElement('button');
                btnChange.className = "btn-admin-mini";
                btnChange.style.cssText = `background:#3498db; color:white; width:100%; border:none; padding:8px; border-radius:5px; font-family:'Pirata One'; font-size:1em; margin-top:3px; ${forceClickStyle}`;
                btnChange.innerText = "🔄 CHANGER";
                
                btnChange.onclick = function(e) {
                    e.stopPropagation();
                    window.openResurrectModal(id);
                };
                cardDiv.appendChild(btnChange);
            } 
            else if (!currentRoleId) {
                const waiting = document.createElement('span');
                waiting.style.cssText = "font-size:0.8em; opacity:0.5;";
                waiting.innerText = "...";
                cardDiv.appendChild(waiting);
            } 
            else if (isDead) {
                const actionsDiv = document.createElement('div');
                actionsDiv.className = "admin-actions";

                const types = [
                    { type: 'gold', color: 'gold', label: 'OR' },
                    { type: 'silver', color: 'silver', label: 'ARG' },
                    { type: 'bronze', color: '#cd7f32', label: 'BRZ' }
                ];

                types.forEach(t => {
                    if(detectedEvents[t.type].length > 0) {
                        const btn = document.createElement('button');
                        btn.className = "btn-admin-mini";
                        btn.style.cssText = `background:${t.color}; color:black; ${forceClickStyle}`;
                        btn.innerText = t.label;
                        btn.onclick = function(e) { e.stopPropagation(); window.adminDraw(id, t.type); };
                        actionsDiv.appendChild(btn);
                    }
                });
                cardDiv.appendChild(actionsDiv);

                const btnRevive = document.createElement('button');
                btnRevive.className = "btn-admin-mini";
                btnRevive.style.cssText = `background:#2ecc71; color:white; width:100%; margin-top:5px; ${forceClickStyle}`;
                btnRevive.innerText = "♻️ REVIENT";
                btnRevive.onclick = function(e) { e.stopPropagation(); window.openResurrectModal(id); };
                cardDiv.appendChild(btnRevive);

            } else {
                const actionsDiv = document.createElement('div');
                actionsDiv.className = "admin-actions";
                
                const btnKill = document.createElement('button');
                btnKill.className = "btn-admin-mini";
                btnKill.style.cssText = `background:#c0392b; color:white; width:100%;`;
                btnKill.innerText = "💀 MORT";
                btnKill.onclick = function(e) { e.stopPropagation(); window.adminKill(id); };
                
                actionsDiv.appendChild(btnKill);
                cardDiv.appendChild(actionsDiv);
            }

            listDiv.appendChild(cardDiv);
        });
    }
    updateAdminButtons(count);
}

function updateAdminButtons(playerCount) {
    const btnDistribute = document.getElementById('btn-distribute');
    const btnReveal = document.getElementById('btn-reveal');
    const selectedCount = document.querySelectorAll('.role-checkbox:checked').length;

    if(!btnDistribute || !btnReveal) return; 

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

    if (isDraftMode) {
        btnReveal.style.display = "block"; 
    } else {
        btnReveal.style.display = "none";
    }
}

// DISTRIBUTION
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
                description: `` 
            });
        }
    });
}

window.showMyRoleAgain = function() {
    if(!myCurrentRoleId) return;
    revealRole(myCurrentRoleId);
};

// ============================================
// F. FONCTIONS D'AFFICHAGE (CENTRAGE & SANS TEXTE)
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

// AFFICHAGE CARTE ÉPURÉ
function internalShowCard(data) {
    const panel = document.querySelector('.details-panel');
    const overlay = document.querySelector('.details-overlay');
    
    if(!panel || !overlay) return;

    panel.innerHTML = `
        <div id="online-content-wrapper" style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; box-sizing:border-box;">
            
            <button class="close-details" onclick="window.internalCloseDetails()" 
                style="position:absolute; top:20px; right:20px; z-index:100; background:rgba(0,0,0,0.6); color:white; border:1px solid gold; border-radius:50%; width:40px; height:40px; font-size:20px; cursor:pointer;">
                ✕
            </button>

            <div class="scene-flip" onclick="this.classList.toggle('is-flipped')" style="margin: 0;">
                <div class="card-object">
                    
                    <div class="card-face face-front">
                        <img src="back.png" class="card-back-img" alt="Dos" style="width:100%; height:100%; object-fit:cover; border-radius:15px;">
                    </div>

                    <div class="card-face face-back">
                        <img src="${data.image}" alt="Rôle" style="width:100%; height:100%; object-fit:cover; border-radius:15px;">
                    </div>

                </div>
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
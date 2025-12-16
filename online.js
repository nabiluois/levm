// ============================================
// SYSTEME EN LIGNE - V33 (PROFIL PHOTO & FICHE JOUEUR)
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
let playerPhotoData = null; // Stocke la photo en base64 temporairement

// Stockage de la sélection
let distributionSelection = [];

// ============================================
// A. INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { scanContentFromHTML(); }, 500);
    ensureAdminButtonsExist(); 

    const btnJoin = document.getElementById('btn-join-action');
    if(btnJoin) btnJoin.addEventListener('click', joinGame);

    const btnDistribute = document.getElementById('btn-distribute');
    if(btnDistribute) btnDistribute.addEventListener('click', distributeRoles);

    const btnReveal = document.getElementById('btn-reveal');
    if(btnReveal) btnReveal.addEventListener('click', revealRolesToEveryone);

    const savedAdminCode = localStorage.getItem('adminGameCode');
    if (savedAdminCode) { showResumeButton(savedAdminCode); }
    
    checkPlayerSession();
});

// --- GESTION PHOTO DE PROFIL ---
window.previewPlayerPhoto = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Affichage preview
            const previewDiv = document.getElementById('photo-preview');
            previewDiv.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
            
            // Compression de l'image (Max 300x300px pour éviter de surcharger la DB)
            compressImage(e.target.result, 300, 0.7).then(compressedBase64 => {
                playerPhotoData = compressedBase64;
            });
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

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxWidth) {
                    width *= maxWidth / height;
                    height = maxWidth;
                }
            }
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
        const menuContainer = document.querySelector('.modal-content');
        if (document.getElementById('btn-resume-player')) return;

        const resumeBtn = document.createElement('button');
        resumeBtn.id = "btn-resume-player";
        resumeBtn.className = "btn-menu";
        resumeBtn.style.background = "linear-gradient(135deg, #27ae60, #2ecc71)";
        resumeBtn.style.border = "2px solid white";
        resumeBtn.style.marginBottom = "15px";
        resumeBtn.innerHTML = `🔄 REJOINDRE (${savedPName || 'Partie'})`;
        resumeBtn.onclick = function() { restorePlayerSession(savedPCode, savedPId); };

        const title = menuContainer.querySelector('h2');
        if(title) title.insertAdjacentElement('afterend', resumeBtn);
    }
}

function restorePlayerSession(code, id) {
    currentGameCode = code;
    myPlayerId = id;
    get(child(ref(db), `games/${code}/players/${id}`)).then((snapshot) => {
        if(snapshot.exists()) {
            document.getElementById('btn-join-action').style.display = 'none';
            document.getElementById('player-lobby-status').style.display = 'block';
            window.closeModal('modal-online-menu'); 
            window.openModal('modal-join-game');     
            listenForPlayerUpdates();
        } else {
            alert("Partie terminée.");
            localStorage.removeItem('vm_player_code');
            localStorage.removeItem('vm_player_id');
            localStorage.removeItem('vm_player_name');
            location.reload();
        }
    });
}

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
        resumeBtn.innerHTML = `👑 GÉRER MA PARTIE (${code})`;
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
        const section = card.closest('section');
        const categoryId = section ? section.id : 'autre'; 
        
        if (imgTag && titleTag) {
            const imgSrc = imgTag.getAttribute('src');
            const id = imgSrc.split('/').pop().replace(/\.[^/.]+$/, "");
            detectedRoles.push({
                id: id,
                title: titleTag.innerText.trim(),
                image: imgSrc,
                category: categoryId,
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
    console.log("Scan terminé. Rôles:", detectedRoles.length);
}

window.checkAdminPassword = function() {
    const password = prompt("🔐 Mot de passe MJ :");
    if(password === "1234") { window.initCreateGame(); } 
    else if (password !== null) { alert("⛔ Accès refusé !"); }
};

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
    const adminDash = document.getElementById('admin-dashboard');
    adminDash.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('no-scroll'); 
    
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
// C. LOGIQUE DE SÉLECTION (DASHBOARD & SVG)
// ============================================

function updateDistributionDashboard() {
    const countVillage = distributionSelection.filter(id => {
        const r = detectedRoles.find(role => role.id === id);
        return r && r.category === 'village';
    }).length;

    const countLoup = distributionSelection.filter(id => {
        const r = detectedRoles.find(role => role.id === id);
        return r && r.category === 'loups';
    }).length;

    const countSolo = distributionSelection.filter(id => {
        const r = detectedRoles.find(role => role.id === id);
        return r && r.category === 'solo';
    }).length;

    if(document.getElementById('pop-count-village')) document.getElementById('pop-count-village').innerText = countVillage;
    if(document.getElementById('pop-count-loup')) document.getElementById('pop-count-loup').innerText = countLoup;
    if(document.getElementById('pop-count-solo')) document.getElementById('pop-count-solo').innerText = countSolo;
    if(document.getElementById('pop-total')) document.getElementById('pop-total').innerText = distributionSelection.length;

    generateRoleChecklist(); 
}

window.generateResurrectionGrid = function(mode = 'single') {
    const grid = document.getElementById('admin-role-grid');
    if(!grid) return;
    if (detectedRoles.length === 0) scanContentFromHTML();

    grid.style.display = "block"; 
    grid.innerHTML = "";
    
    if (mode === 'multi') {
        const dashboard = document.createElement('div');
        dashboard.className = "selection-dashboard";
        dashboard.innerHTML = `
            <div class="dashboard-stats" style="margin-bottom:5px;">
                <div class="stat-item stat-village"><img src="Village.svg" class="stat-icon"><span id="pop-count-village">0</span></div>
                <div class="stat-item stat-loup"><img src="Loup.svg" class="stat-icon"><span id="pop-count-loup">0</span></div>
                <div class="stat-item stat-solo"><img src="Solo.svg" class="stat-icon"><span id="pop-count-solo">0</span></div>
            </div>
            <button class="btn-validate btn-validate-small" style="background:#2ecc71;" onclick="window.validateDistribution()">
                ✅ VALIDER (<span id="pop-total">0</span>)
            </button>
        `;
        grid.appendChild(dashboard);
        setTimeout(updateDistributionDashboard, 50); 
    }

    const categoriesOrder = { 'village': '🏡 VILLAGE', 'loups': '🐺 LOUPS', 'solo': '🎭 SOLOS', 'vampires': '🧛 VAMPIRES' };

    for (const [catKey, catTitle] of Object.entries(categoriesOrder)) {
        const rolesInCat = detectedRoles.filter(r => r.category === catKey);
        if (rolesInCat.length > 0) {
            const titleDiv = document.createElement('div');
            titleDiv.innerHTML = `<h3 style="color:var(--gold); border-bottom:1px solid #555; padding-bottom:5px; margin-top:20px; font-family:'Pirata One'; font-size:1.2em;">${catTitle}</h3>`;
            grid.appendChild(titleDiv);

            const catGrid = document.createElement('div');
            catGrid.className = "admin-grid-container"; 
            
            rolesInCat.sort((a, b) => a.title.localeCompare(b.title));

            rolesInCat.forEach(role => {
                const div = document.createElement('div');
                div.className = "role-select-item";
                
                if (mode === 'multi') {
                    div.classList.add('multi-mode');
                    const count = distributionSelection.filter(id => id === role.id).length;
                    
                    if (count > 0) {
                        div.classList.add('selected');
                        const badgeCards = ['le_paysan', 'le_loup_garou', 'olaf_et_pilaf', 'les_jumeaux_explosifs'];
                        if (badgeCards.some(id => role.id.includes(id))) {
                            div.innerHTML += `<div class="qty-badge">x${count}</div>`;
                        }
                    }
                }

                div.style.cssText += "cursor:pointer; text-align:center; padding:0; border-radius:8px; position:relative; background:transparent;";
                div.innerHTML += `<img src="${role.image}" loading="lazy" style="width:100%; height:auto; border-radius:6px; display:block;">`;
                
                div.onclick = function() { 
                    if (mode === 'multi') {
                        handleMultiSelection(role.id, div);
                    } else {
                        window.assignRoleToPlayer(role.id); 
                    }
                };
                catGrid.appendChild(div);
            });
            grid.appendChild(catGrid);
        }
    }
};

function handleMultiSelection(roleId, divElement) {
    let currentCount = distributionSelection.filter(id => id === roleId).length;
    let newCount = 0;

    if (roleId === 'le_paysan' || roleId === 'le_loup_garou') {
        let input = prompt(`Nombre ? (0 - 10)`, currentCount || 0);
        if (input === null) return; 
        newCount = parseInt(input);
        if (isNaN(newCount) || newCount < 0) newCount = 0;
        if (newCount > 10) newCount = 10;
    } 
    else if (roleId === 'olaf_et_pilaf' || roleId === 'les_jumeaux_explosifs') {
        let input = prompt(`Nombre ? (0, 1, 2)`, currentCount || 0);
        if (input === null) return;
        newCount = parseInt(input);
        if (isNaN(newCount) || newCount < 0) newCount = 0;
        if (newCount > 2) newCount = 2;
    } 
    else {
        newCount = currentCount > 0 ? 0 : 1;
    }

    distributionSelection = distributionSelection.filter(id => id !== roleId);
    for(let i=0; i<newCount; i++) {
        distributionSelection.push(roleId);
    }

    if (newCount > 0) {
        divElement.classList.add('selected');
        const badgeCards = ['le_paysan', 'le_loup_garou', 'olaf_et_pilaf', 'les_jumeaux_explosifs'];
        if (badgeCards.some(id => roleId === id)) { 
            let badge = divElement.querySelector('.qty-badge');
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'qty-badge';
                divElement.appendChild(badge);
            }
            badge.innerText = `x${newCount}`;
        }
    } else {
        divElement.classList.remove('selected');
        const badge = divElement.querySelector('.qty-badge');
        if (badge) badge.remove();
    }

    updateDistributionDashboard();
}

window.validateDistribution = function() {
    window.closeModal('modal-role-selector');
    generateRoleChecklist(); 
};

// 4. OUVERTURES DES MODALES
window.openDistributionSelector = function() {
    window.generateResurrectionGrid('multi');
    const modalTitle = document.querySelector('#modal-role-selector h2');
    if(modalTitle) modalTitle.style.display = 'none'; 
    const modal = document.getElementById('modal-role-selector');
    if(modal) modal.style.zIndex = "20000"; 
    window.openModal('modal-role-selector');
};

window.openResurrectModal = function(playerId) {
    targetResurrectId = playerId;
    window.generateResurrectionGrid('single'); 
    const modalTitle = document.querySelector('#modal-role-selector h2');
    if(modalTitle) {
        modalTitle.style.display = 'block';
        modalTitle.innerText = isDraftMode ? "CHANGER CARTE" : "RESSUSCITER";
    }
    const modal = document.getElementById('modal-role-selector');
    if(modal) modal.style.zIndex = "20000"; 
    window.openModal('modal-role-selector');
};

window.openEventSelector = function(playerId, category) {
    targetResurrectId = playerId;
    targetEventCategory = category;

    const grid = document.getElementById('admin-role-grid');
    if(!grid) return;
    grid.style.display = "block"; 
    grid.innerHTML = "";

    const modalTitle = document.querySelector('#modal-role-selector h2');
    if(modalTitle) {
        modalTitle.style.display = 'block';
        modalTitle.innerText = `CARTE ${category.toUpperCase()}`;
    }

    const randomBtn = document.createElement('button');
    randomBtn.className = "btn-validate btn-validate-small";
    randomBtn.style.cssText = "margin-bottom:20px; background:linear-gradient(135deg, #2980b9, #3498db); border-color:#2980b9;";
    randomBtn.innerText = "🎲 DONNER UNE ALÉATOIRE";
    randomBtn.onclick = function() { window.adminDraw(playerId, category, true); };
    grid.appendChild(randomBtn);

    const catGrid = document.createElement('div');
    catGrid.className = "admin-grid-container"; 
    
    const cards = detectedEvents[category] || [];
    cards.forEach(imgSrc => {
        const div = document.createElement('div');
        div.className = "role-select-item";
        div.style.cssText = "cursor:pointer; text-align:center; padding:0;";
        div.innerHTML = `<img src="${imgSrc}" loading="lazy" style="width:100%; height:auto; border-radius:6px; display:block;">`;
        div.onclick = function() { window.adminDraw(playerId, category, false, imgSrc); };
        catGrid.appendChild(div);
    });
    grid.appendChild(catGrid);

    const modal = document.getElementById('modal-role-selector');
    if(modal) modal.style.zIndex = "20000"; 
    window.openModal('modal-role-selector');
};

window.adminDraw = function(playerId, category, isRandom, manualImg) {
    let finalCard = manualImg;
    if (isRandom) {
        const cards = detectedEvents[category];
        if(cards && cards.length > 0) {
            finalCard = cards[Math.floor(Math.random() * cards.length)];
        }
    }
    if (finalCard) {
        update(ref(db, `games/${currentGameCode}/players/${playerId}`), { 
            drawnCard: { image: finalCard, category: category.toUpperCase() }
        });
        window.closeModal('modal-role-selector');
        internalShowNotification("Envoyé", `Carte ${category.toUpperCase()} donnée !`);
    } else { alert("Erreur : Aucune carte trouvée."); }
};

window.assignRoleToPlayer = function(roleId) {
    if(!targetResurrectId) return;
    if (isDraftMode) {
        update(ref(db, `games/${currentGameCode}/players/${targetResurrectId}`), { draftRole: roleId })
        .then(() => {
            window.closeModal('modal-role-selector');
            distributionSelection.push(roleId);
            generateRoleChecklist(); 
        });
    } else {
        if(confirm("Confirmer le changement de rôle ?")) {
            update(ref(db, `games/${currentGameCode}/players/${targetResurrectId}`), { 
                status: 'alive', role: roleId, drawnCard: null 
            });
            window.closeModal('modal-role-selector');
            window.closeModal('modal-player-detail'); // Ferme la fiche si ouverte
            internalShowNotification("Succès", "Rôle modifié !");
        }
    }
};

// ============================================
// D. DASHBOARD PRINCIPAL (TABLEAU RÉCAPITULATIF)
// ============================================

function generateRoleChecklist() {
    const container = document.getElementById('roles-selection-list');
    if(!container) return;
    
    const countSpan = document.getElementById('role-count');
    if(countSpan) {
        countSpan.innerText = distributionSelection.length;
    }

    const rolesVillage = [];
    const rolesLoup = [];
    const rolesSolo = [];

    const groupedSelection = {};
    distributionSelection.forEach(id => { groupedSelection[id] = (groupedSelection[id] || 0) + 1; });

    Object.entries(groupedSelection).forEach(([id, qty]) => {
        const role = detectedRoles.find(r => r.id === id);
        if(role) {
            const txt = qty > 1 ? `${role.title} (x${qty})` : role.title;
            if(role.category === 'village') rolesVillage.push(txt);
            else if(role.category === 'loups') rolesLoup.push(txt);
            else rolesSolo.push(txt);
        }
    });

    let summaryHTML = '';
    if (distributionSelection.length > 0) {
        summaryHTML = `
            <div class="summary-container">
                <div class="summary-col">
                    <img src="Village.svg" alt="V">
                    <strong>${rolesVillage.length}</strong>
                    ${rolesVillage.map(t => `<div class="summary-list-item">${t}</div>`).join('')}
                </div>
                <div class="summary-col">
                    <img src="Loup.svg" alt="L">
                    <strong>${rolesLoup.length}</strong>
                    ${rolesLoup.map(t => `<div class="summary-list-item">${t}</div>`).join('')}
                </div>
                <div class="summary-col">
                    <img src="Solo.svg" alt="S">
                    <strong>${rolesSolo.length}</strong>
                    ${rolesSolo.map(t => `<div class="summary-list-item">${t}</div>`).join('')}
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        ${summaryHTML}
        <button class="btn-validate" onclick="window.openDistributionSelector()" style="background:#2c3e50; border-color:#34495e; margin-top:0;">
            📂 ${distributionSelection.length > 0 ? 'MODIFIER LA SÉLECTION' : 'CHOISIR LES RÔLES'}
        </button>
    `;
    
    get(child(ref(db), `games/${currentGameCode}/players`)).then((snapshot) => {
        const playerCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
        updateAdminButtons(playerCount);
    });
}

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
            }
        });
        update(ref(db), updates);
    });
}

// --- NOUVELLE FONCTION OUVERTURE FICHE JOUEUR ---
window.openAdminPlayerDetail = function(playerId, playerPseudo, roleId, isDead, avatarBase64) {
    const modal = document.getElementById('modal-player-detail');
    const nameEl = document.getElementById('detail-pseudo');
    const avatarEl = document.getElementById('detail-avatar');
    const cardEl = document.getElementById('detail-card');
    const roleNameEl = document.getElementById('detail-role-name');
    const statusEl = document.getElementById('detail-status');
    const actionsEl = document.getElementById('detail-actions');

    // Reset
    nameEl.innerText = playerPseudo;
    avatarEl.src = avatarBase64 || "icon.png";
    
    // Role Image
    let roleImg = "back.png";
    let roleTitle = "En attente...";
    if(roleId && detectedRoles.length > 0) {
        const r = detectedRoles.find(x => x.id === roleId);
        if(r) { roleImg = r.image; roleTitle = r.title; }
    }
    cardEl.src = roleImg;
    roleNameEl.innerText = roleTitle;

    // Status
    if(isDead) {
        statusEl.innerText = "MORT 💀";
        statusEl.style.color = "#c0392b";
        cardEl.style.filter = "grayscale(100%)";
    } else {
        statusEl.innerText = "VIVANT ❤️";
        statusEl.style.color = "#2ecc71";
        cardEl.style.filter = "none";
    }

    // Actions dynamiques
    actionsEl.innerHTML = "";
    
    // Bouton Tuer / Ressusciter
    const btnState = document.createElement('button');
    btnState.className = "btn-submit";
    if(isDead) {
        btnState.style.background = "#2ecc71";
        btnState.innerText = "♻️ RESSUSCITER";
        btnState.onclick = function() { update(ref(db, `games/${currentGameCode}/players/${playerId}`), { status: 'alive' }); window.closeModal('modal-player-detail'); };
    } else {
        btnState.style.background = "#c0392b";
        btnState.innerText = "💀 TUER";
        btnState.onclick = function() { if(confirm("Tuer ce joueur ?")) update(ref(db, `games/${currentGameCode}/players/${playerId}`), { status: 'dead' }); window.closeModal('modal-player-detail'); };
    }
    actionsEl.appendChild(btnState);

    // Bouton Changer Rôle
    const btnChange = document.createElement('button');
    btnChange.className = "btn-submit";
    btnChange.style.background = "#3498db";
    btnChange.innerText = "🔄 CHANGER RÔLE";
    btnChange.onclick = function() { window.openResurrectModal(playerId); };
    actionsEl.appendChild(btnChange);

    // Si Mort : Boutons Cartes Événements
    if(isDead) {
        const eventTypes = [
            {id:'gold', label:'OR', col:'gold'}, 
            {id:'silver', label:'ARGENT', col:'silver'}, 
            {id:'bronze', label:'BRONZE', col:'#cd7f32'}
        ];
        
        const eventsContainer = document.createElement('div');
        eventsContainer.style.gridColumn = "1 / -1";
        eventsContainer.style.display = "flex";
        eventsContainer.style.gap = "5px";
        eventsContainer.style.marginTop = "10px";

        eventTypes.forEach(t => {
            if(detectedEvents[t.id].length > 0) {
                const btn = document.createElement('button');
                btn.className = "btn-admin-mini";
                btn.style.flex = "1";
                btn.style.padding = "10px";
                btn.style.background = t.col;
                btn.style.color = "black";
                btn.innerText = t.label;
                btn.onclick = function() { window.openEventSelector(playerId, t.id); };
                eventsContainer.appendChild(btn);
            }
        });
        actionsEl.appendChild(eventsContainer);
    }

    window.openModal('modal-player-detail');
};

function updateAdminUI(players) {
    const listDiv = document.getElementById('player-list-admin');
    if(!listDiv) return;
    listDiv.innerHTML = "";
    
    // *** SYNC IMPORTANTE ***
    const isDraft = Object.values(players).some(p => p.draftRole);
    if(isDraft) {
        distributionSelection = []; 
        Object.values(players).forEach(p => {
            if(p.draftRole) distributionSelection.push(p.draftRole);
        });
        generateRoleChecklist(); 
    }
    // ************************

    const count = Object.keys(players).length;
    if(count === 0) {
        listDiv.innerHTML = '<div style="color:#aaa; font-style:italic; grid-column:1/-1;">En attente de joueurs...</div>';
    } else {
        Object.entries(players).forEach(([id, p]) => {
            let currentRoleId = p.role;
            let isDraft = p.draftRole ? true : false;
            if (p.draftRole) currentRoleId = p.draftRole;

            let cardImage = "back.png"; 
            let roleTitle = "...";
            if(currentRoleId && detectedRoles.length > 0) {
                const r = detectedRoles.find(x => x.id === currentRoleId);
                if(r) { cardImage = r.image; roleTitle = r.title; }
            }

            const isDead = p.status === 'dead';
            const cardClass = isDead ? "admin-player-card dead" : "admin-player-card";
            const cardDiv = document.createElement('div');
            cardDiv.className = cardClass;
            cardDiv.style.position = 'relative';
            
            // Photo de profil ou icône par défaut
            const avatarSrc = p.avatar || "icon.png";

            let innerHTML = `
                <div class="admin-avatar-container">
                    <img src="${avatarSrc}" alt="Avatar">
                </div>
                <strong>${p.name}</strong>
            `;

            // Si le rôle est distribué, on affiche la mini carte en coin
            if(currentRoleId) {
                innerHTML += `<img src="${cardImage}" class="mini-role-indicator">`;
            } else {
                innerHTML += `<div style="font-size:0.7em; color:#aaa; line-height:1.1;">En attente...</div>`;
            }

            if(isDraft) innerHTML = `<div style="background:#e67e22; color:white; font-size:0.6em; padding:2px 5px; border-radius:4px; position:absolute; top:3px; left:3px; z-index:10; font-weight:bold;">PROV.</div>` + innerHTML;
            
            cardDiv.innerHTML = innerHTML;

            // CLIC SUR LA CARTE = OUVRIR FICHE JOUEUR (Si pas draft)
            if(!isDraft) {
                cardDiv.onclick = function() {
                    window.openAdminPlayerDetail(id, p.name, currentRoleId, isDead, avatarSrc);
                };
            } else {
                // En mode draft, on garde le changement rapide
                const btnChange = document.createElement('button');
                btnChange.className = "btn-admin-mini";
                btnChange.style.cssText = `background:#3498db; color:white; width:100%; border:none; padding:8px; font-family:'Pirata One'; font-size:1em; margin-top:3px;`;
                btnChange.innerText = "🔄 CHANGER";
                btnChange.onclick = function(e) { e.stopPropagation(); window.openResurrectModal(id); };
                cardDiv.appendChild(btnChange);
            }

            listDiv.appendChild(cardDiv);
        });
    }
    updateAdminButtons(count);
}

function updateAdminButtons(playerCount) {
    const btnDistribute = document.getElementById('btn-distribute');
    const btnReveal = document.getElementById('btn-reveal');
    const selectedCount = distributionSelection.length; 

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
    btnReveal.style.display = isDraftMode ? "block" : "none";
}

function revealRolesToEveryone() {
    if(!confirm("Envoyer les rôles aux joueurs ?")) return;
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
        update(ref(db), updates).then(() => { alert("🚀 Rôles envoyés !"); });
    });
}

// CÔTÉ JOUEUR
function joinGame() {
    const pseudo = document.getElementById('join-pseudo').value.trim();
    const code = document.getElementById('join-code').value.toUpperCase().trim();
    
    // Récupération de la photo compressée (si présente)
    const avatar = playerPhotoData || null; 

    if(!pseudo || !code) { alert("Remplis ton pseudo et le code !"); return; }
    
    currentGameCode = code;
    
    get(child(ref(db), `games/${code}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const newPlayerRef = push(ref(db, `games/${code}/players`));
            myPlayerId = newPlayerRef.key;
            
            // Sauvegarde de session
            localStorage.setItem('vm_player_code', currentGameCode);
            localStorage.setItem('vm_player_id', myPlayerId);
            localStorage.setItem('vm_player_name', pseudo);

            set(newPlayerRef, { 
                name: pseudo, 
                role: null, 
                status: 'alive',
                avatar: avatar // On envoie l'image en base64
            }).then(() => {
                document.getElementById('btn-join-action').style.display = 'none';
                document.getElementById('player-lobby-status').style.display = 'block';
                listenForPlayerUpdates();
            });
        } else { alert("Code introuvable !"); }
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
            
            let statusHTML = `
                <h3 style="color:${data.status === 'dead' ? '#c0392b' : 'var(--gold)'};">
                    ${data.status === 'dead' ? 'TU ES MORT 💀' : 'Tu es en jeu !'}
                </h3>
                <div style="margin:20px 0;">
                    <button class="btn-menu" style="background:var(--gold); color:black; font-weight:bold; padding:15px; width:100%; border:2px solid #fff;" onclick="window.showMyRoleAgain()">🃏 VOIR MA CARTE</button>
                </div>
                <p style="opacity:0.7;">Attend le MJ...</p>
            `;
            
            if(lobbyStatus) lobbyStatus.innerHTML = statusHTML;
        }
        
        if (data.status === 'dead') {
            internalShowNotification("💀 TU ES MORT", "Patience... Tu peux toujours voir ta carte.");
        }

        if (data.drawnCard && data.drawnCard.image !== lastCardImg) {
            lastCardImg = data.drawnCard.image;
            let backImage = "back.png"; 
            if (data.drawnCard.category) {
                const cat = data.drawnCard.category.toUpperCase();
                if (cat === 'GOLD') backImage = "back_or.png";
                else if (cat === 'SILVER') backImage = "back_argant.png";
                else if (cat === 'BRONZE') backImage = "back_bronze.png";
            }
            
            const panel = document.querySelector('.details-panel');
            const overlay = document.querySelector('.details-overlay');
            if(panel && overlay) {
                panel.innerHTML = `
                    <div id="online-content-wrapper" style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                        <button class="close-details" onclick="window.internalCloseDetails()" style="position:absolute; top:20px; right:20px; z-index:100; background:rgba(0,0,0,0.6); color:white; border:1px solid gold; border-radius:50%; width:40px; height:40px; font-size:20px;">✕</button>
                        <div class="scene-flip" onclick="this.classList.toggle('is-flipped')" style="margin:0;">
                            <div class="card-object">
                                <div class="card-face face-front"><img src="${backImage}" class="card-back-img" alt="Dos" style="width:100%; height:100%; object-fit:cover; border-radius:15px;"></div>
                                <div class="card-face face-back"><img src="${data.drawnCard.image}" alt="Rôle" style="width:100%; height:100%; object-fit:cover; border-radius:15px;"></div>
                            </div>
                        </div>
                    </div>`;
                panel.classList.add('active');
                overlay.classList.add('active');
            }
        }
    });
}

window.showMyRoleAgain = function() {
    if(!myCurrentRoleId) return;
    revealRole(myCurrentRoleId);
};

function revealRole(roleId) {
    window.closeModal('modal-join-game');
    window.closeModal('modal-online-menu');
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
                        <div class="card-face face-front"><img src="back.png" class="card-back-img" alt="Dos" style="width:100%; height:100%; object-fit:cover; border-radius:15px;"></div>
                        <div class="card-face face-back"><img src="${roleData.image}" alt="Rôle" style="width:100%; height:100%; object-fit:cover; border-radius:15px;"></div>
                    </div>
                </div>
            </div>`;
        panel.classList.add('active');
        overlay.classList.add('active');
    }
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
    } else { alert(title + "\n" + message); }
}

window.adminKill = function(playerId) {
    if(confirm("Confirmer la mort ?")) {
        update(ref(db, `games/${currentGameCode}/players/${playerId}`), { status: 'dead' });
    }
};
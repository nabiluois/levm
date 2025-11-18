// Gestion menu latéral
const menu = document.querySelector('.side-menu');
const toggle = document.querySelector('.menu-toggle');
const closeBtn = document.querySelector('.close-menu');
if (toggle && menu && closeBtn) {
  toggle.addEventListener('click', () => menu.classList.add('open'));
  closeBtn.addEventListener('click', () => menu.classList.remove('open'));
}

// Flip cartes
document.querySelectorAll('.carte-jeu .inner').forEach(inner => {
  inner.addEventListener('click', () => {
    inner.classList.toggle('flipped');
  });
});

// Zoom cartes VM
document.querySelectorAll('.carte-vm').forEach(vm => {
  vm.addEventListener('click', () => {
    document.querySelectorAll('.carte-vm').forEach(v => v.classList.remove('zoomed'));
    vm.classList.add('zoomed');
  });
});

// --- Fonctionnalité barre de recherche ---
const searchInput = document.getElementById('searchInput');
const suggestionsBox = document.getElementById('searchSuggestions');

// Construire une liste de cartes avec leurs titres (sans toucher au HTML)
const cards = Array.from(document.querySelectorAll('.carte-jeu, .carte-vm')).map(card => {
  const title = (card.querySelector('strong')?.innerText || card.querySelector('img')?.alt || '').toLowerCase();
  return { element: card, title };
});

function showSuggestions(matches) {
  suggestionsBox.innerHTML = '';
  if (matches.length === 0) {
    suggestionsBox.style.display = 'none';
    return;
  }
  matches.forEach(m => {
    const div = document.createElement('div');
    div.textContent = m.title;
    div.addEventListener('click', () => focusCard(m.element));
    suggestionsBox.appendChild(div);
  });
  suggestionsBox.style.display = 'block';
}

function focusCard(card) {
  suggestionsBox.style.display = 'none';
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  card.classList.add('highlight');
  setTimeout(() => card.classList.remove('highlight'), 2000);
}

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      suggestionsBox.style.display = 'none';
      return;
    }
    const matches = cards.filter(c => c.title.includes(query));
    showSuggestions(matches);
  });

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const query = searchInput.value.toLowerCase().trim();
      const match = cards.find(c => c.title.includes(query));
      if (match) focusCard(match.element);
    }
  });
}

// Fermer le menu si on clique à l'extérieur
document.addEventListener('click', (e) => {
  if (menu.classList.contains('open') && !menu.contains(e.target) && e.target !== toggle) {
    menu.classList.remove('open');
  }
});


// Gestion du flip des cartes : une seule carte reste ouverte à la fois
document.querySelectorAll('.carte-jeu .inner').forEach(inner => {
  inner.addEventListener('click', () => {
    document.querySelectorAll('.carte-jeu .inner.flipped').forEach(flipped => {
      if (flipped !== inner) {
        flipped.classList.remove('flipped');
      }
    });
    inner.classList.toggle('flipped');
  });
});



// --- LOGIQUE DE FLIP DES CARTES ---
// Une seule carte peut rester ouverte
document.querySelectorAll('.carte-jeu .inner').forEach(inner => {
  inner.addEventListener('click', (e) => {
    e.stopPropagation(); // Empêche d'autres clics d'interférer

    // Fermer toutes les autres cartes déjà ouvertes
    document.querySelectorAll('.carte-jeu .inner.flipped').forEach(flipped => {
      if (flipped !== inner) {
        flipped.classList.remove('flipped');
      }
    });

    // Retourner ou refermer la carte cliquée
    inner.classList.toggle('flipped');
  });
});


// --- Zoom functionality for VM cards (robust version) ---
window.addEventListener('load', () => {
  let overlay = document.createElement('div');
  overlay.id = 'vm-overlay';
  document.body.appendChild(overlay);

  function attachZoomHandlers() {
    document.querySelectorAll('.carte-vm').forEach(card => {
      card.addEventListener('click', () => {
        if (card.classList.contains('zoomed')) {
          card.classList.remove('zoomed');
          overlay.classList.remove('active');
        } else {
          document.querySelectorAll('.carte-vm.zoomed').forEach(c => c.classList.remove('zoomed'));
          card.classList.add('zoomed');
          overlay.classList.add('active');
        }
      });
    });
  }

  attachZoomHandlers();

  overlay.addEventListener('click', () => {
    document.querySelectorAll('.carte-vm.zoomed').forEach(c => c.classList.remove('zoomed'));
    overlay.classList.remove('active');
  });
});

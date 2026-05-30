// ============================================
//  SALTO DE FÉ – Player & UI
//  main.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- NAVBAR ----
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger?.addEventListener('click', () => navLinks.classList.toggle('open'));

  // Highlight nav on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.getAttribute('id');
    });
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  });

  // ---- TABS ----
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab)?.classList.add('active');
    });
  });

  // ---- CONTACT FORM ----
  document.getElementById('contatoForm')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Mensagem enviada! Entraremos em contato em breve. 🥋');
    e.target.reset();
  });

  // ---- PLAYER ----
  initPlayer();
});

// ============ PLAYER ============

let musicas       = [];
let currentIdx    = -1;
let isPlaying     = false;
let isShuffled    = false;
let isRepeat      = false;
let currentFilter = 'all';
let shuffledOrder = [];

const audio = document.getElementById('audioPlayer');

function initPlayer() {
  musicas = getMusicasData();
  renderTrackList(musicas);
  setupPlayerControls();
  setupSearch();
  setupPlaylistMenu();
}

function renderTrackList(list) {
  const body = document.getElementById('trackListBody');
  const noTracks = document.getElementById('noTracks');
  if (!body) return;

  body.innerHTML = '';

  if (!list || list.length === 0) {
    noTracks.style.display = 'block';
    return;
  }
  noTracks.style.display = 'none';

  list.forEach((m, idx) => {
    const fav = isFav(m.id);
    const tr = document.createElement('tr');
    tr.className = 'track-row' + (currentIdx !== -1 && musicas[currentIdx]?.id === m.id ? ' playing' : '');
    tr.dataset.id = m.id;

    const coverHTML = m.capa
      ? `<img src="${m.capa}" alt="${m.titulo}" onerror="this.parentElement.innerHTML='<span class=cover-placeholder-sm><i class=fas\\ fa-music></i></span>'">`
      : `<span class="cover-placeholder-sm"><i class="fas fa-music"></i></span>`;

    tr.innerHTML = `
      <td><span class="track-num">${idx + 1}</span></td>
      <td>
        <div class="track-title-col">
          <div class="track-cover-thumb">${coverHTML}</div>
          <div class="track-title-text">
            <strong>${m.titulo}</strong>
            <span>${m.artista}</span>
          </div>
        </div>
      </td>
      <td></td>
      <td>${m.artista}</td>
      <td>${m.duracao || '—'}</td>
      <td>
        <button class="fav-btn ${fav ? 'active' : ''}" data-id="${m.id}">
          <i class="${fav ? 'fas' : 'far'} fa-heart"></i>
        </button>
      </td>
    `;

    tr.addEventListener('click', e => {
      if (e.target.closest('.fav-btn')) return;
      const globalIdx = musicas.findIndex(x => x.id === m.id);
      loadAndPlay(globalIdx);
    });

    tr.querySelector('.fav-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      toggleFavUI(m.id, tr.querySelector('.fav-btn'));
    });

    body.appendChild(tr);
  });
}

function toggleFavUI(id, btn) {
  const favs = toggleFav(id);
  const isF  = favs.includes(id);
  btn.classList.toggle('active', isF);
  btn.innerHTML = `<i class="${isF ? 'fas' : 'far'} fa-heart"></i>`;
  if (musicas[currentIdx]?.id === id) updateFavButtons(isF);
  showToast(isF ? '♥ Adicionado aos favoritos' : '♡ Removido dos favoritos');
}

function updateFavButtons(state) {
  const npBtn  = document.getElementById('npFavBtn');
  const barBtn = document.getElementById('barFavBtn');
  [npBtn, barBtn].forEach(btn => {
    if (!btn) return;
    btn.classList.toggle('active', state);
    btn.innerHTML = `<i class="${state ? 'fas' : 'far'} fa-heart"></i>`;
  });
}

function loadAndPlay(idx) {
  if (idx < 0 || idx >= musicas.length) return;
  currentIdx = idx;
  const m = musicas[idx];

  // Update now-playing header
  document.getElementById('npTitle').textContent  = m.titulo;
  document.getElementById('npArtist').textContent = m.artista;
  document.getElementById('npDuration').textContent = m.duracao || '—';

  // Cover big
  const bigCover = document.getElementById('bigCover');
  bigCover.innerHTML = m.capa
    ? `<img src="${m.capa}" alt="${m.titulo}">`
    : `<div class="cover-placeholder"><i class="fas fa-music"></i></div>`;

  // Bar info
  document.getElementById('barTitle').textContent  = m.titulo;
  document.getElementById('barArtist').textContent = m.artista;
  const barCover = document.getElementById('barCover');
  barCover.innerHTML = m.capa
    ? `<img src="${m.capa}" alt="${m.titulo}">`
    : `<div class="cover-placeholder-sm"><i class="fas fa-music"></i></div>`;

  // Fav state
  updateFavButtons(isFav(m.id));

  // Highlight row
  document.querySelectorAll('.track-row').forEach(r => {
    r.classList.toggle('playing', r.dataset.id == m.id);
    r.querySelector('.track-num') && (r.querySelector('.track-num').textContent = r.dataset.id == m.id ? '▶' : '');
  });

  // Renumber visible rows
  document.querySelectorAll('.track-row').forEach((r, i) => {
    const numEl = r.querySelector('.track-num');
    if (numEl && r.dataset.id != m.id) numEl.textContent = i + 1;
  });

  // Load audio
  audio.src = m.arquivo;
  audio.load();
  audio.play().then(() => {
    isPlaying = true;
    updatePlayBtn();
  }).catch(() => {
    // File may not exist – show feedback
    showToast(`⚠ Arquivo não encontrado: ${m.arquivo}`);
    isPlaying = false;
    updatePlayBtn();
  });
}

function updatePlayBtn() {
  const btn = document.getElementById('playPauseBtn');
  if (!btn) return;
  btn.innerHTML = isPlaying
    ? '<i class="fas fa-pause"></i>'
    : '<i class="fas fa-play"></i>';
}

function setupPlayerControls() {
  const playPauseBtn = document.getElementById('playPauseBtn');
  const prevBtn      = document.getElementById('prevBtn');
  const nextBtn      = document.getElementById('nextBtn');
  const shuffleBtn   = document.getElementById('shuffleBtn');
  const repeatBtn    = document.getElementById('repeatBtn');
  const progressRange = document.getElementById('progressRange');
  const volumeRange   = document.getElementById('volumeRange');
  const npFavBtn     = document.getElementById('npFavBtn');
  const barFavBtn    = document.getElementById('barFavBtn');

  playPauseBtn?.addEventListener('click', () => {
    if (currentIdx === -1 && musicas.length > 0) { loadAndPlay(0); return; }
    if (isPlaying) { audio.pause(); isPlaying = false; }
    else           { audio.play(); isPlaying = true; }
    updatePlayBtn();
  });

  prevBtn?.addEventListener('click', () => {
    if (currentIdx <= 0) loadAndPlay(musicas.length - 1);
    else loadAndPlay(currentIdx - 1);
  });

  nextBtn?.addEventListener('click', playNext);

  shuffleBtn?.addEventListener('click', () => {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active', isShuffled);
  });

  repeatBtn?.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
  });

  // Progress
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressRange').value      = pct;
    document.getElementById('timeCurrent').textContent  = fmtTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    document.getElementById('timeTotal').textContent = fmtTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    if (isRepeat) { audio.play(); return; }
    playNext();
  });

  progressRange?.addEventListener('input', e => {
    if (!audio.duration) return;
    audio.currentTime = (e.target.value / 100) * audio.duration;
  });

  volumeRange?.addEventListener('input', e => {
    audio.volume = e.target.value / 100;
    document.getElementById('volumeFill').style.width = e.target.value + '%';
  });

  // Fav buttons
  npFavBtn?.addEventListener('click', () => {
    if (currentIdx === -1) return;
    toggleFavUI(musicas[currentIdx].id, npFavBtn);
  });
  barFavBtn?.addEventListener('click', () => {
    if (currentIdx === -1) return;
    toggleFavUI(musicas[currentIdx].id, barFavBtn);
  });

  // Initial volume display
  document.getElementById('volumeFill').style.width = '80%';
  audio.volume = 0.8;
}

function playNext() {
  if (musicas.length === 0) return;
  let next;
  if (isShuffled) {
    next = Math.floor(Math.random() * musicas.length);
  } else {
    next = (currentIdx + 1) % musicas.length;
  }
  loadAndPlay(next);
}

function setupSearch() {
  const input = document.getElementById('searchInput');
  input?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const filtered = musicas.filter(m =>
      m.titulo.toLowerCase().includes(q) ||
      m.artista.toLowerCase().includes(q)
    );
    renderTrackList(filtered);
  });
}

function setupPlaylistMenu() {
  document.querySelectorAll('.pl-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.pl-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      currentFilter = item.dataset.playlist;

      // also update sidebar links for favs
      const sideLinks = document.querySelectorAll('.sidebar-link');
      sideLinks.forEach(l => l.classList.remove('active'));

      if (currentFilter === 'all') {
        renderTrackList(musicas);
      } else if (currentFilter === 'favs') {
        const favs = getFavs();
        renderTrackList(musicas.filter(m => favs.includes(m.id)));
      } else {
        renderTrackList(musicas.filter(m => m.playlist === currentFilter));
      }
    });
  });

  // Sidebar nav links
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const text = link.textContent.trim().toLowerCase();
      if (text.includes('início') || text.includes('todas')) {
        renderTrackList(musicas);
      } else if (text.includes('favor')) {
        const favs = getFavs();
        renderTrackList(musicas.filter(m => favs.includes(m.id)));
      }
    });
  });
}

function fmtTime(s) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + String(sec).padStart(2, '0');
}

// ---- TOAST ----
function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

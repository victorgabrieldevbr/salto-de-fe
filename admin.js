// ============================================
//  SALTO DE FÉ – Admin Panel JS
//  admin.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  let musicas = getMusicasData();
  let filterPl = 'all';
  let deleteTargetId = null;

  // ---- SECTION NAV ----
  document.querySelectorAll('.admin-nav-link[data-section]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
      link.classList.add('active');
      document.getElementById(link.dataset.section)?.classList.add('active');
    });
  });

  // ---- TOGGLE FORM ----
  const toggleBtn = document.getElementById('toggleFormBtn');
  const formWrap  = document.getElementById('addFormWrap');
  toggleBtn?.addEventListener('click', () => {
    formWrap.classList.toggle('hidden');
    toggleBtn.classList.toggle('collapsed');
  });

  // ---- RENDER LIST ----
  function renderList(list) {
    const container = document.getElementById('adminMusicList');
    const count = document.getElementById('adminCount');
    if (!container) return;

    count.textContent = list.length + ' música' + (list.length !== 1 ? 's' : '');
    container.innerHTML = '';

    if (list.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:3rem;color:var(--texto-dim)">
          <i class="fas fa-music" style="font-size:2.5rem;margin-bottom:1rem;display:block;color:rgba(200,168,75,.2)"></i>
          Nenhuma música encontrada.
        </div>`;
      return;
    }

    list.forEach((m, idx) => {
      const item = document.createElement('div');
      item.className = 'admin-music-item';
      const coverHTML = m.capa
        ? `<img src="${m.capa}" alt="${m.titulo}" onerror="this.style.display='none'">`
        : `<i class="fas fa-music ami-cover-ph"></i>`;

      item.innerHTML = `
        <span class="ami-order">${idx + 1}</span>
        <div class="ami-cover">${coverHTML}</div>
        <div class="ami-info">
          <div class="ami-title">${m.titulo}</div>
          <div class="ami-meta">
            <span><i class="fas fa-user" style="color:var(--bege);margin-right:.3rem"></i>${m.artista}</span>
            <span><i class="fas fa-clock" style="color:var(--bege);margin-right:.3rem"></i>${m.duracao || '—'}</span>
            <span><i class="fas fa-file-audio" style="color:var(--bege);margin-right:.3rem"></i>${m.arquivo || '—'}</span>
          </div>
        </div>
        <span class="ami-playlist-badge">${playlistLabel(m.playlist)}</span>
        <div class="ami-actions">
          <button class="ami-btn edit-btn" data-id="${m.id}" title="Editar"><i class="fas fa-edit"></i></button>
          <button class="ami-btn delete ami-delete-btn" data-id="${m.id}" title="Remover"><i class="fas fa-trash"></i></button>
        </div>
      `;
      container.appendChild(item);
    });

    // Edit listeners
    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.id)));
    });

    // Delete listeners
    container.querySelectorAll('.ami-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => openDeleteModal(parseInt(btn.dataset.id)));
    });
  }

  function playlistLabel(pl) {
    const map = {
      all: 'Geral',
      toques: 'Toques',
      ladainhas: 'Ladainhas',
      corridos: 'Corridos',
      chulas: 'Chulas'
    };
    return map[pl] || pl || 'Geral';
  }

  function getFiltered() {
    const q = (document.getElementById('adminSearch')?.value || '').toLowerCase();
    return musicas.filter(m => {
      const matchPl  = filterPl === 'all' || m.playlist === filterPl;
      const matchQ   = !q || m.titulo.toLowerCase().includes(q) || m.artista.toLowerCase().includes(q);
      return matchPl && matchQ;
    });
  }

  function refresh() {
    musicas = getMusicasData();
    renderList(getFiltered());
    renderPlaylistAdmin();
  }

  // ---- SEARCH ----
  document.getElementById('adminSearch')?.addEventListener('input', () => renderList(getFiltered()));

  // ---- FILTER BUTTONS ----
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterPl = btn.dataset.pl;
      renderList(getFiltered());
    });
  });

  // ---- ADD FORM ----
  document.getElementById('addMusicForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const all = getMusicasData();
    const newId = all.length > 0 ? Math.max(...all.map(m => m.id)) + 1 : 1;
    const newM = {
      id: newId,
      titulo:   document.getElementById('fTitulo').value.trim(),
      artista:  document.getElementById('fArtista').value.trim(),
      arquivo:  document.getElementById('fArquivo').value.trim(),
      capa:     document.getElementById('fCapa').value.trim(),
      playlist: document.getElementById('fPlaylist').value,
      duracao:  document.getElementById('fDuracao').value.trim()
    };
    all.push(newM);
    saveMusicasData(all);
    e.target.reset();
    refresh();
    showAdminToast('✅ Música adicionada com sucesso!');
  });

  // ---- EDIT MODAL ----
  function openEditModal(id) {
    const m = musicas.find(x => x.id === id);
    if (!m) return;
    document.getElementById('eId').value      = m.id;
    document.getElementById('eTitulo').value  = m.titulo;
    document.getElementById('eArtista').value = m.artista;
    document.getElementById('eArquivo').value = m.arquivo || '';
    document.getElementById('eCapa').value    = m.capa    || '';
    document.getElementById('ePlaylist').value = m.playlist || 'all';
    document.getElementById('eDuracao').value  = m.duracao || '';
    document.getElementById('editModal').classList.add('open');
  }

  document.getElementById('editForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const id  = parseInt(document.getElementById('eId').value);
    const all = getMusicasData();
    const idx = all.findIndex(x => x.id === id);
    if (idx === -1) return;
    all[idx] = {
      ...all[idx],
      titulo:   document.getElementById('eTitulo').value.trim(),
      artista:  document.getElementById('eArtista').value.trim(),
      arquivo:  document.getElementById('eArquivo').value.trim(),
      capa:     document.getElementById('eCapa').value.trim(),
      playlist: document.getElementById('ePlaylist').value,
      duracao:  document.getElementById('eDuracao').value.trim()
    };
    saveMusicasData(all);
    closeEditModal();
    refresh();
    showAdminToast('✅ Música atualizada!');
  });

  function closeEditModal() { document.getElementById('editModal').classList.remove('open'); }
  document.getElementById('modalClose')?.addEventListener('click', closeEditModal);
  document.getElementById('cancelEdit')?.addEventListener('click', closeEditModal);
  document.getElementById('editModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('editModal')) closeEditModal();
  });

  // ---- DELETE MODAL ----
  function openDeleteModal(id) {
    deleteTargetId = id;
    document.getElementById('deleteModal').classList.add('open');
  }

  function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('open');
    deleteTargetId = null;
  }

  document.getElementById('confirmDelete')?.addEventListener('click', () => {
    if (deleteTargetId === null) return;
    const all = getMusicasData().filter(m => m.id !== deleteTargetId);
    saveMusicasData(all);
    closeDeleteModal();
    refresh();
    showAdminToast('🗑 Música removida.');
  });

  document.getElementById('deleteClose')?.addEventListener('click', closeDeleteModal);
  document.getElementById('cancelDelete')?.addEventListener('click', closeDeleteModal);
  document.getElementById('deleteModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('deleteModal')) closeDeleteModal();
  });

  // ---- PLAYLISTS ADMIN ----
  function renderPlaylistAdmin() {
    const container = document.getElementById('playlistList');
    if (!container) return;
    const all = getMusicasData();
    const playlists = [
      { key: 'all',      label: 'Geral (todas)' },
      { key: 'toques',   label: 'Toques Tradicionais' },
      { key: 'ladainhas',label: 'Ladainhas' },
      { key: 'corridos', label: 'Corridos' },
      { key: 'chulas',   label: 'Chulas' }
    ];
    container.innerHTML = playlists.map(pl => {
      const count = pl.key === 'all' ? all.length : all.filter(m => m.playlist === pl.key).length;
      return `
        <div class="pl-admin-item">
          <span><i class="fas fa-list" style="color:var(--vermelho);margin-right:.6rem"></i>${pl.label}</span>
          <span class="pl-admin-count">${count} música${count !== 1 ? 's' : ''}</span>
        </div>`;
    }).join('');
  }

  // ---- TOAST ----
  function showAdminToast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  // ---- INIT ----
  refresh();
});

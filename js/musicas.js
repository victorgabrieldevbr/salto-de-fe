// ============================================
//  SALTO DE FÉ – Gerenciador de Músicas
//  musicas.js
// ============================================

const STORAGE_KEY = 'saltodefe_musicas';
const FAVS_KEY    = 'saltodefe_favs';

// Músicas de exemplo – substitua pelos seus MP3 reais
const DEFAULT_MUSICAS = [
  {
    id: 1,
    titulo: "Salto de fé na roda",
    artista: "Mestre Chitão",
    playlist: "Geral",
    arquivo: "musicas/AUD-20260125-WA0085.mp3",
    capa: "",
    duracao: "2:51"
  }
  
 {
    id: 2,
    titulo: "Ctat foco e missão",
    artista: "Mestre Chitão",
    playlist: "Geral",
    arquivo: "musicas/AUD-20260124-WA0035.mp3",
    capa: "",
    duracao: "2:23"
  }
];
function getMusicasData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch(e) {}
  }
  // First time: save defaults
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MUSICAS));
  return DEFAULT_MUSICAS;
}

function saveMusicasData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getFavs() {
  const saved = localStorage.getItem(FAVS_KEY);
  if (saved) { try { return JSON.parse(saved); } catch(e) {} }
  return [];
}

function saveFavs(favs) {
  localStorage.setItem(FAVS_KEY, JSON.stringify(favs));
}

function toggleFav(id) {
  let favs = getFavs();
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }
  saveFavs(favs);
  return favs;
}

function isFav(id) {
  return getFavs().includes(id);
}

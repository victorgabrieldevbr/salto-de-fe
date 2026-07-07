// ============================================
//  SALTO DE FÉ – Gerenciador de Músicas
//  musicas.js
// ============================================
const STORAGE_KEY = 'saltodefe_musicas';
const FAVS_KEY    = 'saltodefe_favs';
const MUSICAS_VERSION = 2; // aumente esse número toda vez que editar DEFAULT_MUSICAS
const VERSION_KEY = 'saltodefe_musicas_version';

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
  },
  {
    id: 2,
    titulo: "Ctat foco e missão",
    artista: "Mestre Chitão",
    playlist: "Geral",
    arquivo: "musicas/AUD-20260124-WA0035.mp3",
    capa: "",
    duracao: "2:23"
  },
  {
    id: 3,
    titulo: "Fazendeiro - Do sonho a luta",
    artista: "Mestre Chitão",
    playlist: "Geral",
    arquivo: "musicas/AUD-20260307-WA0097.mp3",
    capa: "",
    duracao: "2:44"
  },
  {
    id: 4,
    titulo: "Irmão na ginga",
    artista: "Mestre Chitão",
    playlist: "Geral",
    arquivo: "musicas/AUD-20260411-WA0033.mp3",
    capa: "",
    duracao: "4:47"
  },
  {
    id: 5,
    titulo: "Laços de ginga",
    artista: "Mestre Chitão",
    playlist: "Geral",
    arquivo: "musicas/AUD-20260411-WA0031.mp3",
    capa: "",
    duracao: "3:38"
  },
  {
    id: 6,
    titulo: "Projetar é Missão",
    artista: "Mestre Chitão",
    playlist: "Geral",
    arquivo: "musicas/AUD-20260411-WA0028.mp3",
    capa: "",
    duracao: "2:40"
  },
  {
    id: 7,
    titulo: "Queda Nova - Na roda me encontrei",
    artista: "Mestre Chitão",
    playlist: "Geral",
    arquivo: "musicas/AUD-20260309-WA0010.mp3",
    capa: "",
    duracao: "2:04"
  },
  {
    id: 8,
    titulo: "Dobby na roda",
    artista: "Mestre Chitão",
    playlist: "Geral",
    arquivo: "musicas/AUD-20260619-WA0029.mp3",
    capa: "",
    duracao: "2:41"
  },
  {
    id: 9,
    titulo: "Ursinho do Salto de Fé",
    artista: "Mestre Chitão",
    playlist: "Geral",
    arquivo: "musicas/AUD-20260619-WA0030.mp3",
    capa: "",
    duracao: "3:04"
  },
  {
    id: 10,
    titulo: "Salto de fé (Historia do Mestre Chitão)",
    artista: "Mestre Chitão",
    playlist: "Geral",
    arquivo: "musicas/AUD-20260619-WA0034.mp3",
    capa: "",
    duracao: "4:08"
  },
   {
    id: 11,
    titulo: "Forjados no Chão",
    artista: "Mestre Chitão",
    playlist: "Geral",
    arquivo: "musicas/AUD-20260619-WA0032.mp3",
    capa: "",
    duracao: "1:54"
  },
  {
    id: 12,
    titulo: "Minha Historia na Capoeira",
    artista: "Mestre Chitão",
    playlist: "Geral",
    arquivo: "musicas/AUD-20260619-WA0036.mp3",
    capa: "",
    duracao: "3:28"
];

function getMusicasData() {
  const savedVersion = localStorage.getItem(VERSION_KEY);
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved && savedVersion === String(MUSICAS_VERSION)) {
    try { return JSON.parse(saved); } catch(e) {}
  }

  // Versão nova ou primeira visita: usa a lista atualizada e reseta o cache
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MUSICAS));
  localStorage.setItem(VERSION_KEY, String(MUSICAS_VERSION));
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

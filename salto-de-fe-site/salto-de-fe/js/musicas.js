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
    titulo: "Paranauê",
    artista: "Mestre Bimba",
    playlist: "ladainhas",
    arquivo: "musicas/musica1.mp3",
    capa: "",
    duracao: "3:45"
  },
  {
    id: 2,
    titulo: "Zum Zum Zum",
    artista: "Grupo Senzala",
    playlist: "corridos",
    arquivo: "musicas/musica2.mp3",
    capa: "",
    duracao: "2:58"
  },
  {
    id: 3,
    titulo: "Marinheiro Só",
    artista: "Mestre Pastinha",
    playlist: "corridos",
    arquivo: "musicas/musica3.mp3",
    capa: "",
    duracao: "3:10"
  },
  {
    id: 4,
    titulo: "Angola é Angola",
    artista: "Mestre João Grande",
    playlist: "toques",
    arquivo: "musicas/musica4.mp3",
    capa: "",
    duracao: "4:20"
  },
  {
    id: 5,
    titulo: "Iúna",
    artista: "Grupo Muzenza",
    playlist: "toques",
    arquivo: "musicas/musica5.mp3",
    capa: "",
    duracao: "3:15"
  },
  {
    id: 6,
    titulo: "É de Lei",
    artista: "Mestre Suassuna",
    playlist: "chulas",
    arquivo: "musicas/musica6.mp3",
    capa: "",
    duracao: "2:40"
  },
  {
    id: 7,
    titulo: "Cativeiro",
    artista: "Grupo Cordão de Ouro",
    playlist: "corridos",
    arquivo: "musicas/musica7.mp3",
    capa: "",
    duracao: "3:50"
  },
  {
    id: 8,
    titulo: "Oi, Como Vai Você?",
    artista: "Mestre Morcego",
    playlist: "chulas",
    arquivo: "musicas/musica8.mp3",
    capa: "",
    duracao: "2:30"
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

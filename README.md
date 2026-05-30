# Grupo de Capoeira Salto de Fé — Site Completo

## Estrutura do Projeto

```
/
├── index.html          ← Página principal do site
├── admin.html          ← Painel administrativo
├── css/
│   ├── style.css       ← Estilos gerais
│   └── admin.css       ← Estilos do painel admin
├── js/
│   ├── musicas.js      ← Dados e gerenciamento de músicas
│   ├── main.js         ← Player e interações do site
│   └── admin.js        ← Lógica do painel admin
├── imagens/            ← Fotos do grupo, galeria
├── musicas/            ← Arquivos MP3
│   ├── musica1.mp3
│   ├── musica2.mp3
│   └── ...
└── capas/              ← Capas das músicas (JPG/PNG)
```

## Como Adicionar Músicas

### Método 1 — Pelo Painel Admin (recomendado)
1. Copie o arquivo `.mp3` para a pasta `/musicas/`
2. Acesse `admin.html` no navegador
3. Clique em "Adicionar Música"
4. Preencha: título, artista, caminho do arquivo (`musicas/nome.mp3`), capa, playlist, duração
5. Clique em "Adicionar Música" — pronto!

### Método 2 — Editar musicas.js
Edite o array `DEFAULT_MUSICAS` no arquivo `js/musicas.js`
(só funciona na primeira vez; depois use o painel admin)

## Como Adicionar Fotos na Galeria
Substitua os elementos `.gallery-placeholder` no `index.html` por tags `<img>`:
```html
<img src="imagens/foto1.jpg" alt="Roda de Capoeira" style="width:100%;height:100%;object-fit:cover;border-radius:8px">
```

## Redes Sociais
Substitua os `href="#"` nos botões de redes sociais pelos seus links reais.

## Eventos
Edite os cards de evento diretamente no HTML (`index.html`, seção `#eventos`).

## Observações
- As músicas são armazenadas no `localStorage` do navegador
- Para hospedar online (GitHub Pages, Netlify, etc.), os arquivos MP3 devem estar na pasta `/musicas/`
- Recomendado: use Chrome, Firefox ou Edge para melhor compatibilidade do player de áudio

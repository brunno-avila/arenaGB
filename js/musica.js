/* Controle de músicas da Roleta */
const audio_roleta = document.getElementById('musica-roleta');
const botao_musica = document.getElementById('botao-musica');
const musicas = [
  'som/WhatsApp%20Video%202026-11-12%20at%2020.40.32%20(1).mp3',
  'som/WhatsApp%20Video%202026-11-12%20at%2020.40.32.mp3',
  'som/WhatsApp%20Video%202026-11-12%20at%2020.40.35.mp3',
  'som/WhatsApp%20Video%202026-11-12%20at%2020.40.42.mp3',
  'som/WhatsApp%20Video%202026-11-12%20at%2020.40.46.mp3'
];
let ultima_musica = -1;

botao_musica.addEventListener('click', function () {
  if (!audio_roleta.paused) {
    audio_roleta.pause();
    botao_musica.classList.remove('tocando');
    botao_musica.setAttribute('aria-label', 'Tocar música');
    botao_musica.setAttribute('aria-pressed', 'false');
    botao_musica.title = 'Tocar música aleatória';
    return;
  }

  let indice = Math.floor(Math.random() * musicas.length);
  if (musicas.length > 1) {
    while (indice === ultima_musica) {
      indice = Math.floor(Math.random() * musicas.length);
    }
  }
  ultima_musica = indice;
  audio_roleta.src = musicas[indice];
  audio_roleta.load();
  audio_roleta.play().then(function () {
    botao_musica.classList.add('tocando');
    botao_musica.setAttribute('aria-label', 'Pausar música');
    botao_musica.setAttribute('aria-pressed', 'true');
    botao_musica.title = 'Pausar música';
  }).catch(function () {
    botao_musica.title = 'Não foi possível tocar esta música';
  });
});

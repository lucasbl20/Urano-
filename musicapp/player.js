const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const musicTitle = document.getElementById('music-title');
const currentTimeLabel = document.getElementById('current-time');
const durationLabel = document.getElementById('duration');

// Lista de músicas
const musicList = [
  { title: '333 - Matue', file: '333.mp3' },
  { title: 'Mais um voo - Teto', file: 'Teto.mp3' },
  { title: 'Major Rd - Major', file: 'Major.mp3' }
];

let currentSongIndex = 0;

// Atualiza a música no player
function updateMusic() {
  const currentSong = musicList[currentSongIndex];
  audio.src = currentSong.file;
  musicTitle.textContent = `Música: ${currentSong.title}`;
  audio.play();
}

// Atualiza a barra de progresso e o tempo
audio.addEventListener('timeupdate', () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress;

  // Atualiza o tempo atual e a duração
  const currentMinutes = Math.floor(audio.currentTime / 60);
  const currentSeconds = Math.floor(audio.currentTime % 60);
  currentTimeLabel.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`;

  const durationMinutes = Math.floor(audio.duration / 60);
  const durationSeconds = Math.floor(audio.duration % 60);
  durationLabel.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' + durationSeconds : durationSeconds}`;
});

// Atualiza o volume
volumeBar.addEventListener('input', () => {
  audio.volume = volumeBar.value / 100;
});

// Play button
playBtn.addEventListener('click', () => {
  audio.play();
});

// Pause button
pauseBtn.addEventListener('click', () => {
  audio.pause();
});

// Next button
nextBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex + 1) % musicList.length; // Avança para a próxima música
  updateMusic();
});

// Prev button
prevBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex - 1 + musicList.length) % musicList.length; // Volta para a música anterior
  updateMusic();
});

// Progresso da música
progressBar.addEventListener('input', () => {
  const value = progressBar.value;
  audio.currentTime = (value / 100) * audio.duration;
});

// Inicializa o player com a primeira música
updateMusic();

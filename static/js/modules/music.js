// ═══════════════════════════════════════════
// МУЗЫКАЛЬНЫЙ ПЛЕЕР
// ═══════════════════════════════════════════
let audioCtx, analyser, audioSource;
let musicPlaylist = [];
let currentTrack = 0;
let isMusicPlaying = false;

window.symphonyBass = 0.3;
window.symphonyBeat = 0;

const musicAudio = document.getElementById('musicAudio');
const musicToggle = document.getElementById('musicToggle');
const musicTitle = document.getElementById('musicTitle');
const musicVolume = document.getElementById('musicVolume');
const musicNext = document.getElementById('musicNext');

function loadMusicPlaylist() {
    fetch('/api/music')
        .then(r => r.json())
        .then(tracks => {
            musicPlaylist = tracks;
            if (tracks.length > 0) loadTrack(0);
        });
}

function loadTrack(index) {
    if (musicPlaylist.length === 0) return;
    currentTrack = index;
    const t = musicPlaylist[currentTrack];
    musicAudio.src = '/' + t.file_path;
    musicTitle.textContent = t.title;
    if (isMusicPlaying) musicAudio.play();
}

function toggleMusic() {
    if (musicPlaylist.length === 0) return;
    if (isMusicPlaying) {
        musicAudio.pause();
        isMusicPlaying = false;
        musicToggle.textContent = '🔇';
    } else {
        if (!audioCtx) initAudio();
        musicAudio.play();
        isMusicPlaying = true;
        musicToggle.textContent = '🔊';
    }
}

function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.85;
    audioSource = audioCtx.createMediaElementSource(musicAudio);
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
}

function updateBass() {
    if (!analyser || !isMusicPlaying) {
        window.symphonyBass = window.symphonyBass * 0.9 + 0.3 * 0.1;
        window.symphonyBeat = 0;
        return;
    }
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    let b = 0;
    for (let i = 0; i < 8; i++) b += data[i];
    b = b / 8 / 255;
    window.symphonyBass = window.symphonyBass * 0.65 + b * 0.35;
    window.symphonyBeat = b > 0.45 ? 1 : 0;
}

setInterval(updateBass, 33);

// Синхронизация галереи с музыкой
setInterval(() => {
    const items = document.querySelectorAll('.gallery-item.music-reactive');
    if (items.length === 0) return;

    const bass = window.symphonyBass || 0.3;
    const beat = window.symphonyBeat || 0;

    items.forEach((item, i) => {
        const delay = i * 0.05;
        const pulse = bass * 0.02;
        const scale = 1 + pulse;
        const glow = beat * 0.4 + bass * 0.1;

        item.style.transform = `scale(${scale})`;
        item.style.boxShadow = `0 ${8 + bass * 15}px ${20 + bass * 30}px rgba(0, 163, 54, ${0.1 + glow})`;
        item.style.borderColor = `rgba(0, 200, 150, ${glow})`;

        if (beat) {
            setTimeout(() => {
                item.classList.add('beat-active');
                setTimeout(() => item.classList.remove('beat-active'), 300);
            }, delay * 1000);
        }
    });
}, 50);

if (musicToggle) musicToggle.addEventListener('click', toggleMusic);
if (musicNext) musicNext.addEventListener('click', () => {
    if (musicPlaylist.length === 0) return;
    loadTrack((currentTrack + 1) % musicPlaylist.length);
    if (isMusicPlaying) musicAudio.play();
});
if (musicVolume) musicVolume.addEventListener('input', () => {
    musicAudio.volume = musicVolume.value / 100;
});
musicAudio.addEventListener('ended', () => {
    if (musicPlaylist.length > 0) {
        loadTrack((currentTrack + 1) % musicPlaylist.length);
        musicAudio.play();
    }
});
musicAudio.volume = 0.3;
if (musicVolume) musicVolume.value = 30;

// ═══════════════════════════════════════════
// ПИАНИНО + НЕОНОВЫЙ ШАР
// ═══════════════════════════════════════════
function createPiano() {
    const container = document.getElementById('pianoContainer');
    if (!container) return;

    const keys = [
        'white', 'black', 'white', 'black', 'white',
        'white', 'black', 'white', 'black', 'white', 'black', 'white'
    ];

    keys.forEach((type, i) => {
        const key = document.createElement('div');
        key.className = `piano-key ${type}`;
        key.dataset.index = i;
        container.appendChild(key);
    });
}

// Активация клавиш под музыку
function animatePiano() {
    const keys = document.querySelectorAll('.piano-key');
    if (keys.length === 0) return;

    const bass = window.symphonyBass || 0.3;
    const beat = window.symphonyBeat || 0;

    // Случайная клавиша активируется на басах
    if (bass > 0.25 && Math.random() < bass) {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        randomKey.classList.add('active');
        setTimeout(() => randomKey.classList.remove('active'), 200 + Math.random() * 300);
    }

    // При ударе — волна клавиш
    if (beat) {
        keys.forEach((key, i) => {
            setTimeout(() => {
                key.classList.add('active');
                setTimeout(() => key.classList.remove('active'), 250);
            }, i * 30);
        });
    }
}

// Анимация неонового шара
function animateOrb() {
    const orb = document.getElementById('neonOrb');
    const core = orb?.querySelector('.orb-core');
    if (!orb || !core) return;

    const bass = window.symphonyBass || 0.3;
    const beat = window.symphonyBeat || 0;

    // Пульсация
    const scale = 1 + bass * 0.8 + beat * 0.5;
    orb.style.transform = `translate(-50%, -50%) scale(${scale})`;

    // Цвет меняется от баса
    const hue = 160 + bass * 40;
    core.style.background = `radial-gradient(circle, hsla(${hue}, 80%, 60%, 0.9), hsla(${hue}, 70%, 40%, 0.4))`;
    core.style.boxShadow = `0 0 ${30 + bass * 50}px hsla(${hue}, 80%, 55%, 0.7)`;

    // Частицы при ударе
    if (beat) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'orb-particle';
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 60;
            particle.style.cssText = `
                left: 50%; top: 50%;
                width: 6px; height: 6px;
                background: hsla(${hue}, 80%, 60%, 0.8);
                border-radius: 50%;
                --px: ${Math.cos(angle) * distance}px;
                --py: ${Math.sin(angle) * distance}px;
                box-shadow: 0 0 10px hsla(${hue}, 80%, 60%, 0.6);
            `;
            orb.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }
}

// Запуск пианино
window.addEventListener('load', () => {
    setTimeout(createPiano, 500);
});

// Анимация пианино и шара каждые 50мс
setInterval(() => {
    animatePiano();
    animateOrb();
}, 50);
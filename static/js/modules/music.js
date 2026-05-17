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
// ПИАНИНО + ШАР + ТЕКСТ ПЕСНИ
// ═══════════════════════════════════════════
const pianoNotes = [
    'C', 'C#', 'D', 'D#', 'E', 'F',
    'F#', 'G', 'G#', 'A', 'A#', 'B'
];

function createPiano() {
    const container = document.getElementById('pianoContainer');
    if (!container) return;

    const keys = [
        'white', 'black', 'white', 'black', 'white',
        'white', 'black', 'white', 'black', 'white', 'black', 'white'
    ];

    container.innerHTML = '';
    keys.forEach((type, i) => {
        const key = document.createElement('div');
        key.className = `piano-key ${type}`;
        key.dataset.note = pianoNotes[i];
        key.dataset.index = i;
        key.title = pianoNotes[i];
        container.appendChild(key);
    });
}

let lastActiveKeys = [];

function animatePiano(bass, beat, mid, high) {
    const keys = document.querySelectorAll('.piano-key');
    if (keys.length === 0) return;

    // Сбрасываем старые
    keys.forEach(k => k.classList.remove('active'));
    lastActiveKeys = [];

    if (beat) {
        // Волна ВСЕХ клавиш на удар
        keys.forEach((key, i) => {
            setTimeout(() => {
                key.classList.add('active');
                setTimeout(() => key.classList.remove('active'), 200);
            }, i * 25);
        });
        return;
    }

    // Выбираем клавиши на основе частот
    const activeCount = Math.floor(bass * 6 + mid * 3 + 1);
    const usedIndexes = new Set();

    for (let i = 0; i < activeCount; i++) {
        let idx;
        if (i < bass * 4) {
            // Басы — левые клавиши
            idx = Math.floor(Math.random() * 4);
        } else if (i < bass * 4 + mid * 3) {
            // Середина
            idx = 4 + Math.floor(Math.random() * 4);
        } else {
            // Высокие — правые
            idx = 8 + Math.floor(Math.random() * 4);
        }
        if (!usedIndexes.has(idx) && keys[idx]) {
            usedIndexes.add(idx);
            keys[idx].classList.add('active');
            lastActiveKeys.push(idx);
            setTimeout(() => {
                if (keys[idx]) keys[idx].classList.remove('active');
            }, 150 + Math.random() * 200);
        }
    }
}

function animateOrb(bass, beat) {
    const orb = document.getElementById('neonOrb');
    const core = orb?.querySelector('.orb-core');
    if (!orb || !core) return;

    const scale = 1 + bass * 0.7 + beat * 0.6;
    orb.style.transform = `translate(-50%, -50%) scale(${scale})`;

    const hue = 160 + bass * 50;
    core.style.background = `radial-gradient(circle, hsla(${hue}, 80%, 60%, 0.9), hsla(${hue}, 70%, 40%, 0.4))`;
    core.style.boxShadow = `0 0 ${30 + bass * 60}px hsla(${hue}, 80%, 55%, 0.7)`;

    if (beat) {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'orb-particle';
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 80;
            particle.style.cssText = `
                left: 50%; top: 50%;
                width: 8px; height: 8px;
                background: hsla(${hue}, 80%, 65%, 0.9);
                border-radius: 50%;
                --px: ${Math.cos(angle) * distance}px;
                --py: ${Math.sin(angle) * distance}px;
                box-shadow: 0 0 15px hsla(${hue}, 80%, 60%, 0.7);
            `;
            orb.appendChild(particle);
            setTimeout(() => particle.remove(), 1200);
        }
    }
}

// Текст песни
function updateLyrics() {
    const lyricsEl = document.getElementById('songLyrics');
    if (!lyricsEl) return;

    const title = document.getElementById('musicTitle')?.textContent || '';
    const beat = window.symphonyBeat || 0;

    if (title && title !== 'Нет трека') {
        lyricsEl.textContent = '🎵 ' + title + ' 🎵';
        lyricsEl.classList.add('show');
        if (beat) {
            lyricsEl.style.transform = 'translateX(-50%) scale(1.1)';
            setTimeout(() => lyricsEl.style.transform = 'translateX(-50%) scale(1)', 200);
        }
    } else {
        lyricsEl.classList.remove('show');
    }
}

// Создаём пианино
window.addEventListener('load', () => {
    setTimeout(createPiano, 500);
});

// Главный цикл анимации — 30 раз в секунду (плавно)
setInterval(() => {
    const bass = window.symphonyBass || 0.3;
    const mid = window.symphonyMid || 0.2;
    const high = window.symphonyHigh || 0.1;
    const beat = window.symphonyBeat || 0;

    animatePiano(bass, beat, mid, high);
    animateOrb(bass, beat);
    updateLyrics();
}, 33);
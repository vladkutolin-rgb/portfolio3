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
// ДЛИННОЕ ПИАНИНО (36 КЛАВИШ) + ШАР
// ═══════════════════════════════════════════
const TOTAL_KEYS = 36;

function createPiano() {
    const container = document.getElementById('pianoContainer');
    if (!container) return;

    const keys = [];
    for (let i = 0; i < TOTAL_KEYS; i++) {
        const pos = i % 12;
        const isBlack = [1, 3, 6, 8, 10].includes(pos);
        keys.push(isBlack ? 'black' : 'white');
    }

    container.innerHTML = '';
    keys.forEach((type, i) => {
        const key = document.createElement('div');
        key.className = `piano-key ${type}`;
        key.dataset.index = i;
        container.appendChild(key);
    });
}

let wavePos = TOTAL_KEYS / 2;
let waveSpeed = 0.3;

function animatePiano(bass, beat, mid) {
    const keys = document.querySelectorAll('.piano-key');
    if (keys.length === 0) return;

    // Сброс всех клавиш
    keys.forEach(k => {
        k.classList.remove('active');
        k.style.transform = '';
        k.style.boxShadow = '';
    });

    if (beat) {
        // Волна от центра при ударе
        const center = Math.floor(TOTAL_KEYS / 2);
        for (let i = 0; i < TOTAL_KEYS; i++) {
            const dist = Math.abs(i - center);
            setTimeout(() => {
                if (keys[i]) {
                    keys[i].classList.add('active');
                    setTimeout(() => {
                        if (keys[i]) keys[i].classList.remove('active');
                    }, 150);
                }
            }, dist * 15);
        }
        return;
    }

    // Плавная волна
    waveSpeed = 0.4 + bass * 2.5 + mid * 1.5;
    wavePos += waveSpeed;
    if (wavePos >= TOTAL_KEYS) wavePos -= TOTAL_KEYS;
    if (wavePos < 0) wavePos += TOTAL_KEYS;

    const waveWidth = 4 + Math.floor(bass * 4 + mid * 2);
    const center = Math.floor(wavePos);

    for (let i = -waveWidth; i <= waveWidth; i++) {
        const idx = ((center + i) % TOTAL_KEYS + TOTAL_KEYS) % TOTAL_KEYS;
        const dist = Math.abs(i);
        const brightness = 1 - dist / (waveWidth + 1);

        if (brightness > 0.05 && keys[idx]) {
            keys[idx].classList.add('active');
            keys[idx].style.transform = `translateY(${3 + brightness * 5}px)`;
            keys[idx].style.boxShadow = `0 0 ${8 + brightness * 20}px rgba(0, 255, 150, ${0.2 + brightness * 0.5})`;
        }
    }
}

function animateOrb(bass, beat) {
    const orb = document.getElementById('neonOrb');
    const core = orb?.querySelector('.orb-core');
    if (!orb || !core) return;

    const scale = 1 + bass * 0.6 + beat * 0.5;
    orb.style.transform = `translate(-50%, -50%) scale(${scale})`;

    const hue = 155 + bass * 55;
    core.style.background = `radial-gradient(circle, hsla(${hue}, 85%, 65%, 0.9), hsla(${hue}, 70%, 40%, 0.4))`;
    core.style.boxShadow = `0 0 ${35 + bass * 70}px hsla(${hue}, 85%, 55%, 0.7)`;

    if (beat) {
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'orb-particle';
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 90;
            particle.style.cssText = `
                left: 50%; top: 50%;
                width: 8px; height: 8px;
                background: hsla(${hue}, 85%, 65%, 0.9);
                border-radius: 50%;
                --px: ${Math.cos(angle) * distance}px;
                --py: ${Math.sin(angle) * distance}px;
                box-shadow: 0 0 15px hsla(${hue}, 85%, 60%, 0.7);
            `;
            orb.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }
}

window.addEventListener('load', () => {
    setTimeout(createPiano, 500);
});

// Плавный цикл
setInterval(() => {
    const bass = window.symphonyBass || 0.3;
    const mid = window.symphonyMid || 0.2;
    const beat = window.symphonyBeat || 0;

    animatePiano(bass, beat, mid);
    animateOrb(bass, beat);
}, 33);
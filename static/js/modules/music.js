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
// ПИАНИНО (ПЛАВНАЯ ВОЛНА) + ЭФФЕКТЫ ПОД МУЗЫКУ + ШАР
// ═══════════════════════════════════════════
const TOTAL_KEYS = 36;
let wavePosition = TOTAL_KEYS / 2;
const WAVE_BASE_SPEED = 0.6; // Постоянная скорость волны

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

// Эффект от клавиши (как в ритм-играх)
function spawnKeyEffect(x, y, intensity) {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    const effect = document.createElement('div');
    effect.className = 'key-effect';
    const size = 3 + intensity * 10;
    const hue = 150 + intensity * 50;
    effect.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: hsla(${hue}, 90%, 60%, 0.9);
        border-radius: 50%;
        box-shadow: 0 0 ${8 + intensity * 20}px hsla(${hue}, 90%, 55%, 0.7);
    `;
    gallery.appendChild(effect);
    setTimeout(() => effect.remove(), 1400);
}

function animatePiano(bass, beat, mid) {
    const keys = document.querySelectorAll('.piano-key');
    if (keys.length === 0) return;

    // Сброс всех клавиш
    keys.forEach(k => {
        k.classList.remove('active');
        k.style.transform = '';
        k.style.boxShadow = '';
    });

    // === ПЛАВНАЯ ВОЛНА (постоянная скорость, не зависит от музыки) ===
    wavePosition += WAVE_BASE_SPEED;
    if (wavePosition >= TOTAL_KEYS) wavePosition -= TOTAL_KEYS;

    const waveWidth = 6;
    const center = Math.floor(wavePosition);

    for (let i = -waveWidth; i <= waveWidth; i++) {
        const idx = ((center + i) % TOTAL_KEYS + TOTAL_KEYS) % TOTAL_KEYS;
        const dist = Math.abs(i);
        const brightness = Math.max(0, 1 - dist / (waveWidth + 1));

        if (brightness > 0.02 && keys[idx]) {
            keys[idx].classList.add('active');
            keys[idx].style.transform = `translateY(${2 + brightness * 5}px)`;
            keys[idx].style.boxShadow = `0 0 ${6 + brightness * 20}px rgba(0, 255, 150, ${0.15 + brightness * 0.4})`;
        }
    }

    // === ЭФФЕКТЫ ПОД МУЗЫКУ (ритм-игра) ===
    // На каждый удар — залп эффектов
    if (beat) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const randomKey = keys[Math.floor(Math.random() * TOTAL_KEYS)];
                if (randomKey) {
                    const rect = randomKey.getBoundingClientRect();
                    const galleryRect = document.querySelector('.gallery').getBoundingClientRect();
                    spawnKeyEffect(
                        rect.left - galleryRect.left + rect.width / 2,
                        rect.top - galleryRect.top,
                        0.8
                    );
                }
            }, i * 40);
        }
    }

    // На басы — левые клавиши дают эффекты
    if (bass > 0.3 && Math.random() < bass * 0.8) {
        const leftKey = keys[Math.floor(Math.random() * 10)];
        if (leftKey) {
            const rect = leftKey.getBoundingClientRect();
            const galleryRect = document.querySelector('.gallery').getBoundingClientRect();
            spawnKeyEffect(
                rect.left - galleryRect.left + rect.width / 2,
                rect.top - galleryRect.top,
                bass
            );
        }
    }

    // На высокие — правые клавиши
    const high = window.symphonyHigh || 0;
    if (high > 0.25 && Math.random() < high * 0.7) {
        const rightKey = keys[26 + Math.floor(Math.random() * 10)];
        if (rightKey) {
            const rect = rightKey.getBoundingClientRect();
            const galleryRect = document.querySelector('.gallery').getBoundingClientRect();
            spawnKeyEffect(
                rect.left - galleryRect.left + rect.width / 2,
                rect.top - galleryRect.top,
                high
            );
        }
    }
}

function animateOrb(bass, beat) {
    const orb = document.getElementById('neonOrb');
    const core = orb?.querySelector('.orb-core');
    if (!orb || !core) return;

    const scale = 1 + bass * 0.4 + beat * 0.3;
    orb.style.transform = `translate(-50%, -50%) scale(${scale})`;

    const borderAlpha = 0.4 + bass * 0.4 + beat * 0.5;
    core.style.borderColor = `rgba(0, 255, 180, ${Math.min(1, borderAlpha)})`;
    core.style.boxShadow = `
        inset 0 0 ${20 + bass * 40}px rgba(0, 255, 180, ${0.1 + bass * 0.2}),
        0 0 ${30 + bass * 60}px rgba(0, 255, 180, ${0.2 + bass * 0.4}),
        0 0 ${60 + bass * 100}px rgba(0, 200, 150, ${0.1 + bass * 0.2})
    `;

    if (beat) {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'orb-particle';
            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 60;
            particle.style.cssText = `
                left: 50%; top: 50%;
                width: 3px; height: 3px;
                background: rgba(0, 255, 180, 0.8);
                --px: ${Math.cos(angle) * distance}px;
                --py: ${Math.sin(angle) * distance}px;
                box-shadow: 0 0 8px rgba(0, 255, 180, 0.5);
            `;
            orb.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        }
    }
}

window.addEventListener('load', () => {
    setTimeout(createPiano, 500);
});

setInterval(() => {
    const bass = window.symphonyBass || 0.3;
    const mid = window.symphonyMid || 0.2;
    const beat = window.symphonyBeat || 0;

    animatePiano(bass, beat, mid);
    animateOrb(bass, beat);
}, 33);
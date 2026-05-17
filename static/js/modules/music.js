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
// ПИАНИНО + ДЫШАЩИЙ ШАР + ЭФФЕКТЫ В РИТМ
// ═══════════════════════════════════════════
const TOTAL_KEYS = 36;
let wavePosition = TOTAL_KEYS / 2;
const WAVE_BASE_SPEED = 0.6;

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

// Эффект — вылетает вверх под ритм
function spawnKeyEffect(x, y, intensity) {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    const effect = document.createElement('div');
    effect.className = 'key-effect';
    const size = 4 + intensity * 14;
    const hue = 150 + intensity * 50;
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
    const distance = 100 + intensity * 200;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const duration = 1 + Math.random() * 1.8;

    effect.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: hsla(${hue}, 90%, 60%, 0.9);
        border-radius: 50%;
        box-shadow: 0 0 ${10 + intensity * 25}px hsla(${hue}, 90%, 55%, 0.8);
        animation: keyFly ${duration}s ease-out forwards;
        --dx: ${dx}px;
        --dy: ${dy}px;
    `;
    gallery.appendChild(effect);
    setTimeout(() => effect.remove(), duration * 1000 + 100);
}

function animatePiano(bass, beat, mid) {
    const keys = document.querySelectorAll('.piano-key');
    if (keys.length === 0) return;

    keys.forEach(k => {
        k.classList.remove('active');
        k.style.transform = '';
        k.style.boxShadow = '';
    });

    // Плавная волна
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

    const galleryRect = document.querySelector('.gallery').getBoundingClientRect();

    // Эффекты ТОЛЬКО под ритм
    const high = window.symphonyHigh || 0;

    // Удар — мощный залп
    if (beat) {
        const count = 10 + Math.floor(Math.random() * 10);
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const idx = Math.floor(Math.random() * TOTAL_KEYS);
                const key = keys[idx];
                if (key) {
                    const rect = key.getBoundingClientRect();
                    spawnKeyEffect(rect.left - galleryRect.left + rect.width / 2, rect.top - galleryRect.top, 0.7 + Math.random() * 0.3);
                }
            }, i * 22);
        }
    }

    // Басы + высокие вместе — красивый дуэт
    if (bass > 0.2 && high > 0.2 && Math.random() < bass * high * 2) {
        // Левая + правая клавиша одновременно
        const lIdx = Math.floor(Math.random() * 10);
        const rIdx = 26 + Math.floor(Math.random() * 10);
        [lIdx, rIdx].forEach(idx => {
            const key = keys[idx];
            if (key) {
                const rect = key.getBoundingClientRect();
                spawnKeyEffect(rect.left - galleryRect.left + rect.width / 2, rect.top - galleryRect.top, 0.6);
            }
        });
    } else {
        // Басы — левая часть
        if (bass > 0.25 && Math.random() < bass * 0.5) {
            const idx = Math.floor(Math.random() * 12);
            const key = keys[idx];
            if (key) {
                const rect = key.getBoundingClientRect();
                spawnKeyEffect(rect.left - galleryRect.left + rect.width / 2, rect.top - galleryRect.top, bass);
            }
        }
        // Высокие — правая часть
        if (high > 0.2 && Math.random() < high * 0.5) {
            const idx = 24 + Math.floor(Math.random() * 12);
            const key = keys[idx];
            if (key) {
                const rect = key.getBoundingClientRect();
                spawnKeyEffect(rect.left - galleryRect.left + rect.width / 2, rect.top - galleryRect.top, high);
            }
        }
    }

    // Середина
    if (mid > 0.2 && Math.random() < mid * 0.4) {
        const idx = 12 + Math.floor(Math.random() * 12);
        const key = keys[idx];
        if (key) {
            const rect = key.getBoundingClientRect();
            spawnKeyEffect(rect.left - galleryRect.left + rect.width / 2, rect.top - galleryRect.top, mid);
        }
    }
}

// Шар дышит под ритм
let orbBreathPhase = 0;
function animateOrb(bass, beat) {
    const orb = document.getElementById('neonOrb');
    const core = orb?.querySelector('.orb-core');
    if (!orb || !core) return;

    // Дыхание: вдох на басах, выдох плавно
    orbBreathPhase += 0.02 + bass * 0.08;
    const breath = 1 + Math.sin(orbBreathPhase) * 0.35;
    const scale = breath + beat * 0.4;
    orb.style.transform = `translate(-50%, -50%) scale(${scale})`;

    const borderAlpha = 0.3 + bass * 0.5 + Math.abs(Math.sin(orbBreathPhase)) * 0.3 + beat * 0.4;
    core.style.borderColor = `rgba(0, 255, 180, ${Math.min(1, borderAlpha)})`;
    core.style.boxShadow = `
        inset 0 0 ${25 + bass * 50}px rgba(0, 255, 180, ${0.08 + bass * 0.2}),
        0 0 ${35 + bass * 70}px rgba(0, 255, 180, ${0.15 + bass * 0.35}),
        0 0 ${70 + bass * 120}px rgba(0, 200, 150, ${0.08 + bass * 0.18})
    `;

    if (beat) {
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'orb-particle';
            const angle = Math.random() * Math.PI * 2;
            const distance = 35 + Math.random() * 70;
            particle.style.cssText = `
                left: 50%; top: 50%;
                width: ${2 + Math.random() * 5}px;
                height: ${2 + Math.random() * 5}px;
                background: rgba(0, 255, 180, 0.8);
                --px: ${Math.cos(angle) * distance}px;
                --py: ${Math.sin(angle) * distance}px;
                box-shadow: 0 0 ${6 + Math.random() * 10}px rgba(0, 255, 180, 0.6);
                animation: particleFly 0.8s ease-out forwards;
            `;
            orb.appendChild(particle);
            setTimeout(() => particle.remove(), 900);
        }
    }
}

// Стили для анимаций
const effectStyle = document.createElement('style');
effectStyle.textContent = `
    @keyframes keyFly {
        0% { opacity: 0.9; transform: translateY(0) translateX(0) scale(1); }
        100% { opacity: 0; transform: translateY(var(--dy)) translateX(var(--dx)) scale(0.15); }
    }
    @keyframes particleFly {
        0% { opacity: 0.8; transform: translate(0, 0) scale(1); }
        100% { opacity: 0; transform: translate(var(--px), var(--py)) scale(0); }
    }
`;
document.head.appendChild(effectStyle);

window.addEventListener('load', () => setTimeout(createPiano, 500));

setInterval(() => {
    const bass = window.symphonyBass || 0.3;
    const mid = window.symphonyMid || 0.2;
    const beat = window.symphonyBeat || 0;
    animatePiano(bass, beat, mid);
    animateOrb(bass, beat);
}, 33);
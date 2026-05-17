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
// ПИАНИНО С ЭФФЕКТАМИ + МИНИМАЛИСТИЧНЫЙ ШАР
// ═══════════════════════════════════════════
const TOTAL_KEYS = 36;
let wavePosition = TOTAL_KEYS / 2;

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

// Эффекты от клавиш
function spawnKeyEffect(x, y, bass) {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    const effect = document.createElement('div');
    effect.className = 'key-effect';
    const size = 4 + bass * 8;
    const hue = 150 + bass * 50;
    effect.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: hsla(${hue}, 80%, 60%, 0.8);
        border-radius: 50%;
        box-shadow: 0 0 ${10 + bass * 15}px hsla(${hue}, 80%, 55%, 0.6);
    `;
    gallery.appendChild(effect);
    setTimeout(() => effect.remove(), 1500);
}

function animatePiano(bass, beat, mid) {
    const keys = document.querySelectorAll('.piano-key');
    if (keys.length === 0) return;

    // Сброс
    keys.forEach(k => {
        k.classList.remove('active');
        k.style.transform = '';
        k.style.boxShadow = '';
    });

    if (beat) {
        // Волна от центра + эффекты
        const center = Math.floor(TOTAL_KEYS / 2);
        for (let i = 0; i < TOTAL_KEYS; i++) {
            const dist = Math.abs(i - center);
            setTimeout(() => {
                if (keys[i]) {
                    keys[i].classList.add('active');
                    const rect = keys[i].getBoundingClientRect();
                    const galleryRect = document.querySelector('.gallery').getBoundingClientRect();
                    spawnKeyEffect(
                        rect.left - galleryRect.left + rect.width / 2,
                        rect.top - galleryRect.top,
                        bass
                    );
                    setTimeout(() => {
                        if (keys[i]) {
                            keys[i].classList.remove('active');
                            keys[i].style.transform = '';
                            keys[i].style.boxShadow = '';
                        }
                    }, 180);
                }
            }, dist * 18);
        }
        return;
    }

    // Плавная волна
    const speed = 0.3 + bass * 3 + mid * 1.8;
    wavePosition += speed;
    if (wavePosition >= TOTAL_KEYS) wavePosition -= TOTAL_KEYS;

    const waveWidth = 5 + Math.floor(bass * 4 + mid * 2);
    const center = Math.floor(wavePosition);

    for (let i = -waveWidth; i <= waveWidth; i++) {
        const idx = ((center + i) % TOTAL_KEYS + TOTAL_KEYS) % TOTAL_KEYS;
        const dist = Math.abs(i);
        const brightness = Math.max(0, 1 - dist / (waveWidth + 1));

        if (brightness > 0.03 && keys[idx]) {
            keys[idx].classList.add('active');
            keys[idx].style.transform = `translateY(${2 + brightness * 5}px)`;
            keys[idx].style.boxShadow = `0 0 ${6 + brightness * 22}px rgba(0, 255, 150, ${0.15 + brightness * 0.45})`;

            // Эффекты от пиков волны
            if (brightness > 0.7 && Math.random() < 0.3) {
                const rect = keys[idx].getBoundingClientRect();
                const galleryRect = document.querySelector('.gallery').getBoundingClientRect();
                spawnKeyEffect(
                    rect.left - galleryRect.left + rect.width / 2,
                    rect.top - galleryRect.top,
                    bass
                );
            }
        }
    }
}

function animateOrb(bass, beat) {
    const orb = document.getElementById('neonOrb');
    const core = orb?.querySelector('.orb-core');
    if (!orb || !core) return;

    const scale = 1 + bass * 0.4 + beat * 0.3;
    orb.style.transform = `translate(-50%, -50%) scale(${scale})`;

    const hue = 150 + bass * 50;
    const borderColor = beat ? `rgba(0, 255, 180, 0.9)` : `rgba(0, 255, 180, ${0.4 + bass * 0.4})`;
    core.style.borderColor = borderColor;
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
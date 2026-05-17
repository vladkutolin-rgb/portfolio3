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
// ТРИ ВОЛНЫ — ИДЕАЛЬНОЕ ТЕЧЕНИЕ
// ═══════════════════════════════════════════
function initWaves() {
    const canvas = document.getElementById('waveCanvas');
    const gallery = document.querySelector('.gallery');
    if (!canvas || !gallery) return;

    const ctx = canvas.getContext('2d');
    let W, H, time = 0;

    function resize() {
        W = gallery.offsetWidth;
        H = gallery.offsetHeight;
        canvas.width = W;
        canvas.height = H;
    }
    resize();
    window.addEventListener('resize', resize);

    // Плавные значения (сглаживание)
    let smoothBass = 0.3, smoothMid = 0.2, smoothHigh = 0.1, smoothBeat = 0;

    function draw(ts) {
        time = ts * 0.001;

        // Сглаживаем частоты (инерция)
        const targetBass = window.symphonyBass || 0.3;
        const targetMid = window.symphonyMid || 0.2;
        const targetHigh = window.symphonyHigh || 0.1;
        const targetBeat = window.symphonyBeat || 0;

        smoothBass += (targetBass - smoothBass) * 0.08;
        smoothMid += (targetMid - smoothMid) * 0.08;
        smoothHigh += (targetHigh - smoothHigh) * 0.08;
        smoothBeat += (targetBeat - smoothBeat) * 0.15;

        ctx.clearRect(0, 0, W, H);

        // Три волны — разные высота, цвет, чувствительность
        const waves = [
            {
                y: H * 0.62,
                amp: 8 + smoothBass * 35 + smoothBeat * 20,
                speed: 1.2 + smoothBass * 3,
                color: `rgba(0, 255, 180, ${0.2 + smoothBass * 0.5 + smoothBeat * 0.3})`,
                width: 2 + smoothBass * 2 + smoothBeat,
                phase: 0
            },
            {
                y: H * 0.72,
                amp: 5 + smoothMid * 28 + smoothBeat * 14,
                speed: 1.5 + smoothMid * 2.5,
                color: `rgba(80, 200, 255, ${0.18 + smoothMid * 0.45 + smoothBeat * 0.2})`,
                width: 1.8 + smoothMid * 1.5 + smoothBeat * 0.5,
                phase: 1.5
            },
            {
                y: H * 0.82,
                amp: 3 + smoothHigh * 20 + smoothBeat * 10,
                speed: 1.8 + smoothHigh * 2,
                color: `rgba(220, 240, 255, ${0.15 + smoothHigh * 0.4 + smoothBeat * 0.15})`,
                width: 1.5 + smoothHigh * 1.2 + smoothBeat * 0.3,
                phase: 3
            }
        ];

        waves.forEach(w => {
            ctx.strokeStyle = w.color;
            ctx.lineWidth = w.width;
            ctx.shadowColor = w.color.replace(/[^,]+(?=\))/, String(Math.min(1, parseFloat(w.color.match(/[\d.]+(?=\))/)?.[0] || 0.3) + 0.3)));
            ctx.shadowBlur = 8 + w.amp * 0.6;
            ctx.beginPath();

            for (let x = 0; x <= W; x += 2) {
                const y = w.y +
                    Math.sin(x * 0.006 + time * w.speed + w.phase) * w.amp +
                    Math.cos(x * 0.012 + time * w.speed * 0.6) * w.amp * 0.5 +
                    Math.sin(x * 0.025 + time * 0.4) * w.amp * 0.2;
                x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
        });

        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
}

window.addEventListener('load', () => {
    setTimeout(initWaves, 500);
});
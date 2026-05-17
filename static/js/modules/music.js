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

    // Три независимых "потока" с инерцией
    const streams = [
        { smooth: 0.3, amp: 0, speed: 0, color: [0, 255, 180], y: 0.62, baseAmp: 8, ampScale: 40, speedScale: 3 },
        { smooth: 0.2, amp: 0, speed: 0, color: [80, 200, 255], y: 0.72, baseAmp: 5, ampScale: 30, speedScale: 2.5 },
        { smooth: 0.1, amp: 0, speed: 0, color: [220, 240, 255], y: 0.82, baseAmp: 3, ampScale: 22, speedScale: 2 }
    ];

    let smoothBeat = 0;

    function draw(ts) {
        time = ts * 0.001;
        const beat = window.symphonyBeat || 0;

        // Плавный бит (быстрое нарастание, медленный спад)
        smoothBeat += (beat - smoothBeat) * (beat > smoothBeat ? 0.4 : 0.05);

        // Обновляем потоки
        streams.forEach((s, i) => {
            const target = i === 0 ? (window.symphonyBass || 0.3) :
                          i === 1 ? (window.symphonyMid || 0.2) :
                                    (window.symphonyHigh || 0.1);
            s.smooth += (target - s.smooth) * 0.06;
            s.amp = s.baseAmp + s.smooth * s.ampScale + smoothBeat * 25;
            s.speed = 1 + s.smooth * s.speedScale;
        });

        ctx.clearRect(0, 0, W, H);

        streams.forEach(s => {
            const [r, g, b] = s.color;
            const alpha = 0.15 + s.smooth * 0.5 + smoothBeat * 0.3;
            const lineWidth = 1.5 + s.smooth * 2 + smoothBeat;

            ctx.strokeStyle = `rgba(${r},${g},${b},${Math.min(1, alpha)})`;
            ctx.lineWidth = lineWidth;
            ctx.shadowColor = `rgba(${r},${g},${b},${Math.min(1, alpha + 0.2)})`;
            ctx.shadowBlur = 10 + s.amp * 0.5;

            ctx.beginPath();
            for (let x = 0; x <= W; x += 2) {
                const baseY = H * s.y;
                const y = baseY +
                    Math.sin(x * 0.005 + time * s.speed) * s.amp +
                    Math.cos(x * 0.013 + time * s.speed * 0.55) * s.amp * 0.45 +
                    Math.sin(x * 0.022 + time * 0.35) * s.amp * 0.2;
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
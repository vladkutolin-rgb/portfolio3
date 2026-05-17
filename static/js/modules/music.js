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
// ИДЕАЛЬНЫЕ ВОЛНЫ — ТЕЧЕНИЕ ВПРАВО
// ═══════════════════════════════════════════
function initWaves() {
    const canvas = document.getElementById('waveCanvas');
    const gallery = document.querySelector('.gallery');
    if (!canvas || !gallery) return;

    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
        W = gallery.offsetWidth;
        H = gallery.offsetHeight;
        canvas.width = W;
        canvas.height = H;
    }
    resize();
    window.addEventListener('resize', resize);

    let time = 0;

    // Три независимых потока с сильной инерцией
    const streams = [
        { // Басы — нижняя волна, зелёная
            smooth: 0.3,
            y: 0.60,
            baseAmp: 15,
            ampScale: 55,
            beatAmp: 35,
            baseSpeed: 1.5,
            speedScale: 4,
            r: 0, g: 255, b: 180,
            baseAlpha: 0.25,
            alphaScale: 0.5,
            width: 2.5,
            widthScale: 2,
            phase: 0,
            particles: []
        },
        { // Миды — средняя волна, голубая
            smooth: 0.2,
            y: 0.70,
            baseAmp: 10,
            ampScale: 40,
            beatAmp: 22,
            baseSpeed: 1.8,
            speedScale: 3.5,
            r: 60, g: 200, b: 255,
            baseAlpha: 0.2,
            alphaScale: 0.45,
            width: 2,
            widthScale: 1.5,
            phase: 2,
            particles: []
        },
        { // Высокие — верхняя волна, белая
            smooth: 0.1,
            y: 0.80,
            baseAmp: 6,
            ampScale: 28,
            beatAmp: 14,
            baseSpeed: 2,
            speedScale: 2.5,
            r: 220, g: 240, b: 255,
            baseAlpha: 0.15,
            alphaScale: 0.4,
            width: 1.5,
            widthScale: 1,
            phase: 4,
            particles: []
        }
    ];

    let smoothBeat = 0;

    function draw(ts) {
        time = ts * 0.001;

        // Плавный бит: быстрый подъём, медленный спад
        const rawBeat = window.symphonyBeat || 0;
        smoothBeat += (rawBeat - smoothBeat) * (rawBeat > smoothBeat ? 0.35 : 0.04);

        // Обновляем потоки с инерцией
        const rawValues = [
            window.symphonyBass || 0.3,
            window.symphonyMid || 0.2,
            window.symphonyHigh || 0.1
        ];

        streams.forEach((s, i) => {
            s.smooth += (rawValues[i] - s.smooth) * 0.05;
        });

        ctx.clearRect(0, 0, W, H);

        // Для каждой волны
        streams.forEach(s => {
            const freq = s.smooth;
            const amp = s.baseAmp + freq * s.ampScale + smoothBeat * s.beatAmp;
            const speed = s.baseSpeed + freq * s.speedScale;
            const alpha = Math.min(1, s.baseAlpha + freq * s.alphaScale + smoothBeat * 0.3);
            const lineW = s.width + freq * s.widthScale + smoothBeat * 1.5;
            const baseY = H * s.y;

            // Основная волна с градиентом
            const gradient = ctx.createLinearGradient(0, baseY - amp, 0, baseY + amp);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(0.2, `rgba(${s.r},${s.g},${s.b},${alpha * 0.4})`);
            gradient.addColorStop(0.45, `rgba(${s.r},${s.g},${s.b},${alpha})`);
            gradient.addColorStop(0.5, `rgba(255,255,255,${alpha * 0.6})`);
            gradient.addColorStop(0.55, `rgba(${s.r},${s.g},${s.b},${alpha})`);
            gradient.addColorStop(0.8, `rgba(${s.r},${s.g},${s.b},${alpha * 0.4})`);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = lineW;
            ctx.shadowColor = `rgba(${s.r},${s.g},${s.b},${alpha * 0.6})`;
            ctx.shadowBlur = 12 + amp * 0.4;
            ctx.beginPath();

            // Трёхслойная синусоида для естественности
            for (let x = 0; x <= W; x += 2) {
                const y = baseY +
                    Math.sin(x * 0.004 + time * speed + s.phase) * amp +
                    Math.cos(x * 0.011 + time * speed * 0.55) * amp * 0.4 +
                    Math.sin(x * 0.018 + time * 0.3) * amp * 0.15 +
                    Math.cos(x * 0.025 + time * speed * 0.35) * amp * 0.1;
                x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Пена на гребнях (при бите)
            if (smoothBeat > 0.3 || freq > 0.4) {
                const foamAlpha = (smoothBeat * 0.5 + freq * 0.3) * 0.6;
                ctx.fillStyle = `rgba(255,255,255,${Math.min(0.7, foamAlpha)})`;
                
                for (let x = 0; x < W; x += 40 + Math.random() * 30) {
                    const y = baseY +
                        Math.sin(x * 0.004 + time * speed + s.phase) * amp +
                        Math.cos(x * 0.011 + time * speed * 0.55) * amp * 0.4;
                    
                    // Только на пиках
                    const localPeak = Math.sin(x * 0.004 + time * speed + s.phase);
                    if (localPeak > 0.8) {
                        const fx = x + (Math.random() - 0.5) * 25;
                        const fy = y - 3 - Math.random() * 8;
                        const fr = 2 + Math.random() * 5 * (smoothBeat + freq);
                        ctx.beginPath();
                        ctx.arc(fx, fy, fr, 0, Math.PI);
                        ctx.fill();
                    }
                }
            }

            // Блики на воде
            const sparkCount = Math.floor(5 + freq * 15 + smoothBeat * 15);
            for (let i = 0; i < sparkCount; i++) {
                const sx = (time * speed * 40 + i * (W / sparkCount)) % W;
                const sy = baseY +
                    Math.sin(sx * 0.004 + time * speed + s.phase) * amp * 0.5 +
                    Math.cos(sx * 0.011 + time * speed * 0.55) * amp * 0.2;
                
                const sparkAlpha = 0.2 + Math.abs(Math.sin(time * 2 + i)) * 0.4 * (freq + smoothBeat);
                ctx.fillStyle = `rgba(255,255,255,${Math.min(0.8, sparkAlpha)})`;
                ctx.shadowColor = `rgba(255,255,255,${sparkAlpha})`;
                ctx.shadowBlur = 4;
                ctx.fillRect(sx, sy - 1, 2, 1);
                ctx.shadowBlur = 0;
            }

            // Частицы от бита
            if (smoothBeat > 0.5) {
                s.particles.push({
                    x: Math.random() * W,
                    y: baseY,
                    life: 1,
                    size: 1 + Math.random() * 3,
                    vx: 0.5 + Math.random() * 2,
                    vy: -1 - Math.random() * 3
                });
            }

            s.particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.03;
                if (p.life > 0) {
                    ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${p.life * 0.7})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            s.particles = s.particles.filter(p => p.life > 0);
            if (s.particles.length > 25) s.particles.splice(0, s.particles.length - 25);
        });

        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
}

window.addEventListener('load', () => {
    setTimeout(initWaves, 500);
});
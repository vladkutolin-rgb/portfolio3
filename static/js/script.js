// ═══════════════════════════════════════════
// ТЕМНАЯ ТЕМА
// ═══════════════════════════════════════════
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
const savedTheme = localStorage.getItem('theme') || 'light';

if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}

// ═══════════════════════════════════════════
// ПЕЧАТАЮЩИЙСЯ ТЕКСТ
// ═══════════════════════════════════════════
function initTypingEffect() {
    const el = document.getElementById('typingText');
    if (!el) return;
    const texts = [
        "стать Full-Stack разработчиком",
        "создать инновационные продукты",
        "работать в IT-компании мечты",
        "участвовать в крупных проектах",
        "непрерывно развиваться в IT"
    ];
    let ti = 0, ci = 0, del = false, sp = 100;

    function type() {
        const t = texts[ti];
        el.textContent = del ? t.substring(0, ci - 1) : t.substring(0, ci + 1);
        if (del) { ci--; sp = 50; }
        else { ci++; sp = 100; }
        if (!del && ci === t.length) { del = true; sp = 1500; }
        else if (del && ci === 0) { del = false; ti = (ti + 1) % texts.length; sp = 500; }
        setTimeout(type, sp);
    }
    setTimeout(type, 1000);
}

// ═══════════════════════════════════════════
// АНИМАЦИИ ПРИ ПРОКРУТКЕ
// ═══════════════════════════════════════════
function animateOnScroll() {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 150) {
            el.classList.add('animated');
            if (el.id === 'about') {
                setTimeout(() => {
                    animateTechBars();
                    animateCounters();
                }, 300);
            }
        }
    });
}
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// ═══════════════════════════════════════════
// МОБИЛЬНОЕ МЕНЮ
// ═══════════════════════════════════════════
const mobileBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileBtn.innerHTML = navMenu.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });
}

document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (mobileBtn) mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
});

// ═══════════════════════════════════════════
// КНОПКА ВВЕРХ
// ═══════════════════════════════════════════
const scrollBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', () => {
    if (scrollBtn) scrollBtn.classList.toggle('visible', window.pageYOffset > 300);
});
if (scrollBtn) scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ═══════════════════════════════════════════
// АНИМАЦИЯ ТЕХ-СТЕКА И СЧЁТЧИКОВ
// ═══════════════════════════════════════════
function animateTechBars() {
    document.querySelectorAll('.percentage-fill[data-width]').forEach(el => {
        el.style.width = el.getAttribute('data-width') + '%';
    });
}

function animateCounters() {
    document.querySelectorAll('.counter').forEach(c => {
        const target = +c.getAttribute('data-target');
        const current = +c.innerText;
        const increment = target / 200;
        if (current < target) {
            const update = () => {
                const now = +c.innerText;
                if (now < target) {
                    c.innerText = Math.ceil(now + increment);
                    setTimeout(update, 10);
                } else {
                    c.innerText = target;
                }
            };
            update();
        }
    });
}

// ═══════════════════════════════════════════
// ЧАСТИЦЫ
// ═══════════════════════════════════════════
function initParticles() {
    const section = document.getElementById('about');
    if (!section || document.getElementById('particles-canvas')) return;
    const container = document.getElementById('particles-js');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const digits = ['0', '1'];
    const particles = [];
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 12 + 8,
            speed: Math.random() * 0.4 + 0.1,
            digit: digits[Math.floor(Math.random() * 2)],
            opacity: Math.random() * 0.25 + 0.05,
            dir: Math.random() * Math.PI * 2
        });
    }

    function draw() {
        if (!canvas.isConnected) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += Math.cos(p.dir) * p.speed;
            p.y += Math.sin(p.dir) * p.speed;
            if (p.x < -20) p.x = canvas.width + 20;
            if (p.x > canvas.width + 20) p.x = -20;
            if (p.y < -20) p.y = canvas.height + 20;
            if (p.y > canvas.height + 20) p.y = -20;
            ctx.fillStyle = `rgba(0, 163, 54, ${p.opacity})`;
            ctx.font = `${p.size}px 'Courier New', monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.digit, p.x, p.y);
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// ═══════════════════════════════════════════
// КРУГОВАЯ ДИАГРАММА
// ═══════════════════════════════════════════
function drawSkillsChart() {
    const canvas = document.getElementById('skillsChart');
    if (!canvas) return;

    const container = canvas.parentElement;
    const size = Math.min(container.offsetWidth - 40, 280);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    const cx = size / 2, cy = size / 2, r = size * 0.38;

    const catData = {};
    document.querySelectorAll('.tech-category').forEach(cat => {
        const name = cat.querySelector('h4').textContent;
        const percents = [];
        cat.querySelectorAll('.skill-percentage').forEach(sp => percents.push(parseInt(sp.textContent)));
        if (percents.length > 0) {
            catData[name] = Math.round(percents.reduce((a, b) => a + b, 0) / percents.length);
        }
    });

    const items = Object.entries(catData);
    if (items.length === 0) return;

    const colors = ['#00a336', '#00d44c', '#4dabf7', '#ffd700', '#ff6b6b', '#a29bfe', '#fd79a8', '#00cec9'];
    const total = items.reduce((s, [, v]) => s + v, 0);
    let angle = -Math.PI / 2;
    let legend = '';

    ctx.clearRect(0, 0, size, size);

    items.forEach(([name, value], i) => {
        const slice = (value / total) * 2 * Math.PI;
        const color = colors[i % colors.length];

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, angle, angle + slice);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        const mid = angle + slice / 2;
        if (slice > 0.5) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 11px "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(value + '%', cx + Math.cos(mid) * r * 0.6, cy + Math.sin(mid) * r * 0.6);
        }

        legend += `<div style="display:flex;align-items:flex-start;margin-bottom:8px;gap:8px;">
            <span style="background:${color};min-width:14px;width:14px;height:14px;border-radius:3px;display:inline-block;margin-top:2px;flex-shrink:0;"></span>
            <span style="font-size:13px;line-height:1.4;color:var(--text-color);">${name} — <strong>${value}%</strong></span>
        </div>`;

        angle += slice;
    });

    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.45, 0, 2 * Math.PI);
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--card-bg').trim() || '#fff';
    ctx.fill();

    const legendEl = document.getElementById('chartLegend');
    if (legendEl) legendEl.innerHTML = legend;
}

let chartDrawn = false;
window.addEventListener('load', () => setTimeout(drawSkillsChart, 1000));
window.addEventListener('scroll', () => {
    const about = document.getElementById('about');
    if (about && about.classList.contains('animated') && !chartDrawn) {
        drawSkillsChart();
        chartDrawn = true;
    }
});

// ═══════════════════════════════════════════
// МУЗЫКАЛЬНЫЙ ПЛЕЕР + БАС ДЛЯ ВСЕЛЕННОЙ
// ═══════════════════════════════════════════
let audioCtx, analyser, audioSource;
let musicPlaylist = [];
let currentTrack = 0;
let isMusicPlaying = false;
window.symphonyBass = 0;

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
    const track = musicPlaylist[currentTrack];
    musicAudio.src = '/' + track.file_path;
    musicTitle.textContent = track.title;
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
        window.symphonyBass *= 0.9;
        return;
    }
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    let rawBass = 0;
    for (let i = 0; i < 10; i++) rawBass += data[i];
    rawBass = rawBass / 10 / 255;
    window.symphonyBass = window.symphonyBass * 0.7 + rawBass * 0.3;
}

setInterval(updateBass, 33);

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
// ЗВЁЗДНОЕ НЕБО
// ═══════════════════════════════════════════
function initStarfield() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    const stars = [];

    function resize() {
        W = gallery.offsetWidth;
        H = gallery.offsetHeight;
        canvas.width = W;
        canvas.height = H;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * W,
            y: Math.random() * H * 0.55,
            size: 0.5 + Math.random() * 3,
            brightness: Math.random(),
            twinkle: Math.random() * Math.PI * 2,
            speed: 0.005 + Math.random() * 0.03
        });
    }

    function draw(ts) {
        if (!canvas.isConnected) return;
        ctx.clearRect(0, 0, W, H);
        const bass = window.symphonyBass || 0;

        stars.forEach(star => {
            star.twinkle += star.speed * (1 + bass);
            const alpha = 0.3 + Math.abs(Math.sin(star.twinkle)) * 0.7 * (1 + bass);

            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * (1 + bass * 0.5), 0, Math.PI * 2);
            ctx.fill();

            if (star.size > 2 && alpha > 0.8) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(star.x - star.size * 3, star.y);
                ctx.lineTo(star.x + star.size * 3, star.y);
                ctx.moveTo(star.x, star.y - star.size * 3);
                ctx.lineTo(star.x, star.y + star.size * 3);
                ctx.stroke();
            }
        });

        // Падающие звёзды
        if (bass > 0.4 && Math.random() < 0.08) {
            const sx = Math.random() * W;
            const sy = Math.random() * H * 0.3;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx - 60, sy + 35);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
}

// ═══════════════════════════════════════════
// ВОДОПАДЫ + РЕКА
// ═══════════════════════════════════════════
function initWaterfallGame() {
    const canvas = document.getElementById('waterfallCanvas');
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

    const leftWF = [], rightWF = [], splashes = [];

    function createDrop(side) {
        const bx = side === 'left' ? W * 0.07 : W * 0.93;
        return {
            x: bx + (Math.random() - 0.5) * 25,
            y: Math.random() * H * 0.4,
            speed: 1.5 + Math.random() * 3,
            size: 1.5 + Math.random() * 3,
            opacity: 0.2 + Math.random() * 0.4,
            hue: 190 + Math.random() * 20,
            splashed: false
        };
    }

    for (let i = 0; i < 50; i++) {
        leftWF.push(createDrop('left'));
        rightWF.push(createDrop('right'));
    }

    window.tsunamiHeight = 0;

    function drawRocks() {
        const lg = ctx.createLinearGradient(0, 0, W * 0.13, 0);
        lg.addColorStop(0, 'rgba(40, 45, 50, 0.5)');
        lg.addColorStop(1, 'rgba(55, 60, 65, 0)');
        ctx.fillStyle = lg;
        ctx.beginPath();
        ctx.moveTo(0, H * 0.05);
        ctx.quadraticCurveTo(W * 0.06, H * 0.18, W * 0.1, H * 0.5);
        ctx.lineTo(W * 0.07, H * 0.85);
        ctx.lineTo(0, H);
        ctx.closePath();
        ctx.fill();

        const rg = ctx.createLinearGradient(W, 0, W * 0.87, 0);
        rg.addColorStop(0, 'rgba(40, 45, 50, 0.5)');
        rg.addColorStop(1, 'rgba(55, 60, 65, 0)');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.moveTo(W, H * 0.05);
        ctx.quadraticCurveTo(W * 0.94, H * 0.18, W * 0.9, H * 0.5);
        ctx.lineTo(W * 0.93, H * 0.85);
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fill();
    }

    function drawWaterfall(particles, x, width) {
        const mist = ctx.createLinearGradient(x, H * 0.05, x, H * 0.7);
        mist.addColorStop(0, 'rgba(220, 240, 255, 0.15)');
        mist.addColorStop(1, 'rgba(100, 180, 220, 0.02)');
        ctx.fillStyle = mist;
        ctx.fillRect(x - width / 2, H * 0.02, width, H * 0.72);

        particles.forEach(p => {
            p.y += p.speed;
            if (p.y > H * 0.72 && !p.splashed) {
                p.splashed = true;
                for (let s = 0; s < 6; s++) {
                    splashes.push({
                        x: x + (Math.random() - 0.5) * width,
                        y: H * 0.72,
                        vx: (Math.random() - 0.5) * 5,
                        vy: -Math.random() * 8 - 2,
                        life: 1,
                        size: 1 + Math.random() * 3
                    });
                }
                p.y = Math.random() * H * 0.2;
                p.splashed = false;
            }
            ctx.fillStyle = `hsla(${p.hue}, 60%, 80%, ${p.opacity})`;
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.size, p.size * 1.8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.7})`;
            ctx.beginPath();
            ctx.arc(p.x - p.size * 0.2, p.y - p.size * 0.3, p.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawSplashes() {
        splashes.forEach(d => {
            d.x += d.vx;
            d.y += d.vy;
            d.vy += 0.06;
            d.life -= 0.014;
            if (d.life > 0) {
                ctx.fillStyle = `rgba(220, 245, 255, ${d.life * 0.8})`;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.size * d.life, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        for (let i = splashes.length - 1; i >= 0; i--) {
            if (splashes[i].life <= 0) splashes.splice(i, 1);
        }
    }

    function drawRiver() {
        const bass = window.symphonyBass || 0;
        const baseY = H * 0.72;

        // Зеркало воды
        const mirror = ctx.createLinearGradient(0, baseY - 20, 0, H);
        mirror.addColorStop(0, 'rgba(100, 190, 240, 0.08)');
        mirror.addColorStop(1, 'rgba(5, 30, 80, 0.4)');
        ctx.fillStyle = mirror;
        ctx.fillRect(0, baseY, W, H - baseY);

        // Неоновое свечение при басах
        if (bass > 0.15) {
            const glow = ctx.createRadialGradient(W * 0.3, baseY + 30, 5, W * 0.3, baseY + 25, W * 0.5);
            glow.addColorStop(0, `rgba(0, 255, 180, ${bass * 0.5})`);
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, baseY - 30, W, H - baseY + 30);
        }

        // Три слоя волн
        const layers = [
            { h: 6 + bass * 35, s: 0.6 + bass * 2, a: 0.13, c: `hsla(${190 + Math.sin(time * 0.01) * 15}, 50%, 55%,` },
            { h: 8 + bass * 25, s: 0.8 + bass * 1.5, a: 0.17, c: `hsla(${185 + Math.cos(time * 0.012) * 12}, 60%, 60%,` },
            { h: 4 + bass * 18, s: 1 + bass * 3, a: 0.09, c: `hsla(${195 + Math.sin(time * 0.015) * 10}, 45%, 65%,` }
        ];

        layers.forEach(layer => {
            ctx.fillStyle = layer.c + layer.a + ')';
            for (let x = 0; x < W; x += 4) {
                const y = baseY + Math.sin((x + time * layer.s) / 100) * layer.h +
                          Math.cos((x - time * layer.s * 0.6) / 65) * layer.h * 0.5;
                ctx.fillRect(x, y, 5, 4);
            }
        });

        // Пена
        if (bass > 0.05) {
            const fa = Math.min(bass * 3, 0.8);
            for (let i = 0; i < 14; i++) {
                const fx = (time * 1.5 + i * W / 14) % W;
                const fy = baseY + Math.sin((fx + time * 0.8) / 90) * (8 + bass * 30) - 6;
                ctx.fillStyle = `rgba(255, 255, 255, ${fa * 0.7})`;
                ctx.beginPath();
                ctx.arc(fx, fy, 3 + Math.random() * 6 * bass, 0, Math.PI);
                ctx.fill();
            }
        }

        // Блики
        const sc = Math.floor(8 + bass * 20);
        for (let i = 0; i < sc; i++) {
            const sx = (time * (0.4 + bass) + i * W / sc) % W;
            const sy = baseY + 8 + Math.sin(sx / 35 + time * 0.5) * (5 + bass * 10);
            const sh = 0.05 + Math.abs(Math.sin(time * 0.07 + i * 0.7)) * (0.12 + bass * 0.35);
            ctx.fillStyle = `rgba(255, 255, 255, ${sh})`;
            ctx.fillRect(sx - 2, sy, 5, 1);
            ctx.fillRect(sx, sy - 2, 1, 5);
        }
    }

    function animate(ts) {
        if (!canvas.isConnected) return;
        time = ts * 0.001;
        ctx.clearRect(0, 0, W, H);
        drawRocks();
        drawWaterfall(leftWF, W * 0.07, 35);
        drawWaterfall(rightWF, W * 0.93, 35);
        drawRiver();
        drawSplashes();

        if (window.tsunamiHeight > 0) window.tsunamiHeight *= 0.92;
        if (window.tsunamiHeight < 0.2) window.tsunamiHeight = 0;

        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    window.triggerTsunami = function() {
        window.tsunamiHeight = 60;
        const wave = document.getElementById('tsunamiWave');
        if (wave) {
            wave.style.height = '130px';
            wave.style.background = 'linear-gradient(0deg, rgba(0,230,255,0.9), rgba(0,180,240,0.6), transparent)';
            setTimeout(() => wave.style.height = '0', 1500);
        }
    };
}

// ═══════════════════════════════════════════
// СОБАЧКА В ЛОДКЕ
// ═══════════════════════════════════════════
function initDogBoat() {
    const dog = document.getElementById('dogBoat');
    const gallery = document.querySelector('.gallery');
    if (!dog || !gallery) return;

    let isDragging = false, prevX, prevY, velocityX = 0, velocityY = 0;
    let animId, startLeft, startTop, petCount = 0;

    function setPos(x, y) {
        const rect = gallery.getBoundingClientRect();
        x = Math.max(30, Math.min(x, rect.width - 80));
        y = Math.max(50, Math.min(y, rect.height - 80));
        dog.style.left = x + 'px';
        dog.style.top = y + 'px';
        dog.style.bottom = 'auto';
        dog.style.transform = 'none';
    }

    function physics() {
        const rect = gallery.getBoundingClientRect();
        let x = parseFloat(dog.style.left) || rect.width / 2;
        let y = parseFloat(dog.style.top) || rect.height * 0.7;
        x += velocityX;
        y += velocityY;
        velocityX *= 0.93;
        velocityY *= 0.93;
        if (x <= 30) { x = 30; velocityX = Math.abs(velocityX) * 0.3; }
        if (x >= rect.width - 80) { x = rect.width - 80; velocityX = -Math.abs(velocityX) * 0.3; }
        if (y <= 50) { y = 50; velocityY = Math.abs(velocityY) * 0.3; }
        if (y >= rect.height - 80) { y = rect.height - 80; velocityY = -Math.abs(velocityY) * 0.3; }
        dog.style.left = x + 'px';
        dog.style.top = y + 'px';
        dog.style.transform = 'none';
        if (Math.abs(velocityX) > 0.08 || Math.abs(velocityY) > 0.08) {
            animId = requestAnimationFrame(physics);
        }
    }

    dog.addEventListener('mousedown', function(e) {
        isDragging = true;
        cancelAnimationFrame(animId);
        prevX = e.clientX;
        prevY = e.clientY;
        const rect = dog.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        dog.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const gr = gallery.getBoundingClientRect();
        setPos(e.clientX - gr.left - 40, e.clientY - gr.top - 30);
        prevX = e.clientX;
        prevY = e.clientY;
    });

    document.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        isDragging = false;
        dog.style.cursor = 'grab';
        velocityX = (e.clientX - prevX) * 6;
        velocityY = (e.clientY - prevY) * 6;
        physics();
    });

    dog.addEventListener('dblclick', function(e) {
        e.preventDefault();
        petCount++;
        dog.classList.add('petted');
        setTimeout(() => dog.classList.remove('petted'), 600);
        const rect = dog.getBoundingClientRect();
        for (let i = 0; i < 6; i++) {
            const heart = document.createElement('div');
            heart.className = 'dog-heart';
            heart.textContent = ['❤️','💕','💖','🦴','✨','🐾'][i];
            heart.style.cssText = `position:fixed;left:${rect.left+rect.width/2-15+(Math.random()-0.5)*50}px;top:${rect.top+(Math.random()-0.5)*30}px;font-size:20px;pointer-events:none;z-index:9999;animation:heartFly 1s forwards;animation-delay:${i*0.1}s;`;
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 1200);
        }
        if (petCount % 3 === 0) {
            const bark = document.createElement('div');
            bark.textContent = 'Гав! 🐕';
            const br = dog.getBoundingClientRect();
            bark.style.cssText = `position:fixed;left:${br.left+br.width/2-30}px;top:${br.top-30}px;font-size:16px;z-index:9999;pointer-events:none;animation:barkUp 1.2s forwards;`;
            document.body.appendChild(bark);
            setTimeout(() => bark.remove(), 1300);
        }
    });

    let autoAngle = 0;
    setInterval(() => {
        if (!isDragging && (!animId || Math.abs(velocityX) < 0.08)) {
            autoAngle += 0.012;
            const rect = gallery.getBoundingClientRect();
            setPos(rect.width / 2 + Math.sin(autoAngle) * 70, rect.height * 0.7 + Math.cos(autoAngle * 0.6) * 15);
        }
    }, 50);

    setTimeout(() => {
        const rect = gallery.getBoundingClientRect();
        setPos(rect.width / 2, rect.height * 0.7);
    }, 500);
}

// ═══════════════════════════════════════════
// ГЛУБИНА: ЭНЕРГО-СФЕРЫ + КРИСТАЛЛЫ
// ═══════════════════════════════════════════
function initDeepRealm() {
    const canvas = document.getElementById('deepCanvas');
    if (!canvas) return;
    const section = document.getElementById('certificates');
    if (!section) return;
    const ctx = canvas.getContext('2d');
    let W, H, time = 0;

    function resize() {
        W = section.offsetWidth;
        H = section.offsetHeight;
        canvas.width = W;
        canvas.height = H;
    }
    resize();
    window.addEventListener('resize', resize);

    let spheres = [];
    let crystals = [];
    let energyCount = 0;
    const MAX_CRYSTALS = 6;

    // Создаём сферы
    for (let i = 0; i < 18; i++) {
        spheres.push({
            x: Math.random() * W,
            y: Math.random() * H,
            size: 8 + Math.random() * 20,
            speed: 0.2 + Math.random() * 0.8,
            hue: 180 + Math.random() * 50,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.005 + Math.random() * 0.015,
            popped: false,
            popTime: 0,
            particles: []
        });
    }

    function createCrystal(x, hue, size) {
        return {
            x: x || Math.random() * W,
            y: H + 50,
            targetY: H * 0.15 + Math.random() * H * 0.5,
            size: Math.max(20, (size || 15) * 2),
            hue: hue || 200 + Math.random() * 40,
            life: 1,
            born: performance.now(),
            maxLife: 30 + Math.random() * 50,
            phase: Math.random() * Math.PI * 2,
            bassMemory: 0,
            rings: [],
            sparkles: [],
            trail: []
        };
    }

    function spawnCrystal(x, hue, size) {
        if (crystals.length >= MAX_CRYSTALS) crystals.shift();
        const c = createCrystal(x, hue, size);
        for (let i = 0; i < 3; i++) {
            c.rings.push({
                radius: c.size * (0.3 + i * 0.25),
                speed: 0.01 + i * 0.005,
                angle: i * Math.PI / 3,
                tilt: 0.2 + i * 0.1
            });
        }
        crystals.push(c);
    }

    // Клик по сферам
    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        for (let i = spheres.length - 1; i >= 0; i--) {
            const s = spheres[i];
            if (!s.popped && Math.hypot(mx - s.x, my - s.y) < s.size + 10) {
                s.popped = true;
                s.popTime = performance.now();
                s.particles = [];
                for (let j = 0; j < 15; j++) {
                    const angle = (Math.PI * 2 / 15) * j;
                    s.particles.push({
                        x: s.x, y: s.y,
                        vx: Math.cos(angle) * (2 + Math.random() * 5),
                        vy: Math.sin(angle) * (2 + Math.random() * 5),
                        life: 1, size: 2 + Math.random() * 3,
                        hue: s.hue
                    });
                }
                energyCount++;
                document.getElementById('bubbleCount').textContent = energyCount;
                if (energyCount % 15 === 0 && window.triggerTsunami) {
                    window.triggerTsunami();
                    const alert = document.getElementById('tsunamiAlert');
                    if (alert) {
                        alert.classList.add('show');
                        setTimeout(() => alert.classList.remove('show'), 2000);
                    }
                }
                spawnCrystal(s.x, s.hue, s.size);
                break;
            }
        }
    });

    function draw(ts) {
        time = ts * 0.001;
        const bass = window.symphonyBass || 0;
        ctx.clearRect(0, 0, W, H);

        // Фон глубины
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, 'rgba(5, 20, 50, 0.3)');
        bg.addColorStop(0.5, 'rgba(2, 10, 30, 0.6)');
        bg.addColorStop(1, 'rgba(0, 2, 10, 0.9)');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Энерго-сферы
        spheres.forEach(s => {
            if (s.popped) {
                const elapsed = (ts - s.popTime) / 1000;
                if (elapsed > 1.5) {
                    Object.assign(s, {
                        x: Math.random() * W,
                        y: H + 50,
                        popped: false,
                        particles: []
                    });
                    return;
                }
                s.particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.04;
                    p.life -= 0.025;
                    if (p.life > 0) {
                        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.life})`;
                        ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, ${p.life * 0.8})`;
                        ctx.shadowBlur = 8;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                });
                const ringR = elapsed * 80;
                const ringA = Math.max(0, 1 - elapsed / 1.5);
                ctx.strokeStyle = `rgba(255, 255, 255, ${ringA})`;
                ctx.lineWidth = 2;
                ctx.shadowColor = `rgba(200, 240, 255, ${ringA})`;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(s.x, s.y, ringR, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
                return;
            }

            s.y -= s.speed * (1 + bass * 2);
            s.x += Math.sin(s.wobble) * 0.5;
            s.wobble += s.wobbleSpeed * (1 + bass);
            if (s.y < -50) { s.y = H + 50; s.x = Math.random() * W; }

            const glow = ctx.createRadialGradient(s.x, s.y, s.size * 0.3, s.x, s.y, s.size * 1.8);
            glow.addColorStop(0, `hsla(${s.hue}, 60%, 65%, ${0.15 + bass * 0.3})`);
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * 1.8, 0, Math.PI * 2);
            ctx.fill();

            const grad = ctx.createRadialGradient(s.x - s.size * 0.2, s.y - s.size * 0.2, s.size * 0.05, s.x, s.y, s.size);
            grad.addColorStop(0, `hsla(${s.hue}, 55%, 88%, 0.85)`);
            grad.addColorStop(0.5, `hsla(${s.hue}, 50%, 62%, 0.55)`);
            grad.addColorStop(1, `hsla(${s.hue}, 40%, 30%, 0.2)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = `hsla(${s.hue}, 60%, 75%, ${0.4 + bass * 0.4})`;
            ctx.lineWidth = 1.5 + bass;
            ctx.shadowColor = `hsla(${s.hue}, 70%, 65%, ${0.3 + bass * 0.4})`;
            ctx.shadowBlur = 4 + bass * 6;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            ctx.arc(s.x - s.size * 0.2, s.y - s.size * 0.2, s.size * 0.2, 0, Math.PI * 2);
            ctx.fill();
        });

        // Кристаллы
        crystals.forEach(c => {
            const elapsed = (ts - c.born) / 1000;
            c.life = Math.max(0, 1 - elapsed / c.maxLife);
            if (c.life <= 0) return;

            c.y += (c.targetY - c.y) * 0.02;
            c.bassMemory = c.bassMemory * 0.85 + bass * 0.15;
            c.phase += 0.02 + c.bassMemory * 0.05;
            c.x += Math.sin(time * 0.3 + c.phase) * (0.5 + bass * 2);

            const alpha = c.life * (0.6 + c.bassMemory * 0.4);

            // Свечение
            for (let l = 3; l >= 0; l--) {
                const lr = c.size * (0.3 + l * 0.35);
                const la = alpha * (0.12 - l * 0.025) * (1 + c.bassMemory);
                const gl = ctx.createRadialGradient(c.x, c.y, lr * 0.1, c.x, c.y, lr);
                gl.addColorStop(0, `rgba(100, 220, 255, ${la * 2})`);
                gl.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = gl;
                ctx.beginPath();
                ctx.arc(c.x, c.y, lr, 0, Math.PI * 2);
                ctx.fill();
            }

            // Кольца-обручи
            c.rings.forEach(ring => {
                ring.angle += ring.speed * (1 + c.bassMemory * 3);
                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.rotate(ring.tilt * Math.sin(ring.angle));
                ctx.strokeStyle = `rgba(150, 230, 255, ${alpha * 0.6})`;
                ctx.lineWidth = 1.5;
                ctx.shadowColor = `rgba(100, 200, 255, ${alpha * 0.5})`;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.restore();
            });

            // Ядро
            const core = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.size * 0.3);
            core.addColorStop(0, 'rgba(255, 255, 255, 1)');
            core.addColorStop(0.3, 'rgba(150, 220, 255, 0.8)');
            core.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = core;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.size * 0.3, 0, Math.PI * 2);
            ctx.fill();

            // Шлейф
            c.trail.push({ x: c.x, y: c.y, life: 1 });
            if (c.trail.length > 8) c.trail.shift();
            c.trail.forEach((t, i) => {
                t.life -= 0.04;
                if (t.life > 0) {
                    ctx.fillStyle = `rgba(100, 200, 255, ${t.life * 0.1})`;
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, c.size * 0.15 * (i / 8) * t.life, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Искры
            if (Math.random() < 0.3 + c.bassMemory * 0.5) {
                c.sparkles.push({
                    x: c.x + (Math.random() - 0.5) * c.size * 0.5,
                    y: c.y + (Math.random() - 0.5) * c.size * 0.3,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: -0.5 - Math.random() * 2,
                    life: 1,
                    size: 0.5 + Math.random() * 2
                });
            }
            c.sparkles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;
                if (p.life > 0) {
                    ctx.fillStyle = `rgba(200, 240, 255, ${p.life * 0.8})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            c.sparkles = c.sparkles.filter(p => p.life > 0);
        });
        crystals = crystals.filter(c => c.life > 0);

        // Молнии между кристаллами
        for (let i = 0; i < crystals.length; i++) {
            for (let j = i + 1; j < crystals.length; j++) {
                const dx = crystals[j].x - crystals[i].x;
                const dy = crystals[j].y - crystals[i].y;
                const dist = Math.hypot(dx, dy);
                if (dist < 250 + bass * 200) {
                    const alpha = (1 - dist / (250 + bass * 200)) * 0.15;
                    ctx.strokeStyle = `rgba(150, 230, 255, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.shadowColor = `rgba(100, 200, 255, ${alpha * 2})`;
                    ctx.shadowBlur = 6;
                    ctx.beginPath();
                    ctx.moveTo(crystals[i].x, crystals[i].y);
                    const midX = (crystals[i].x + crystals[j].x) / 2 + (Math.random() - 0.5) * 30;
                    const midY = (crystals[i].y + crystals[j].y) / 2 + (Math.random() - 0.5) * 30;
                    ctx.quadraticCurveTo(midX, midY, crystals[j].x, crystals[j].y);
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            }
        }

        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
}

// ═══════════════════════════════════════════
// ПРОСМОТРЩИК ФОТО
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    const viewer = document.getElementById('imageViewer');
    const vImg = document.getElementById('viewerImage');
    const vCap = document.getElementById('viewerCaption');
    if (!viewer || !vImg) return;

    let allItems = [], curIdx = 0, zoomLevel = 1;

    function getVisible() {
        return Array.from(document.querySelectorAll('#galleryGrid .gallery-item'))
            .filter(i => window.getComputedStyle(i).display !== 'none');
    }

    function resetZoom() { zoomLevel = 1; vImg.style.transform = 'translate(-50%, -50%) scale(1)'; }

    function openViewer(imgEl, idx) {
        allItems = getVisible();
        curIdx = idx;
        const img = imgEl.querySelector('img') || imgEl;
        vImg.src = img.getAttribute('data-full') || img.src;
        vCap.textContent = img.alt || '';
        viewer.style.display = 'block';
        document.body.style.overflow = 'hidden';
        resetZoom();
    }

    function closeViewer() { viewer.style.display = 'none'; document.body.style.overflow = 'auto'; }

    function navigate(dir) {
        allItems = getVisible();
        if (allItems.length === 0) return;
        curIdx = (curIdx + dir + allItems.length) % allItems.length;
        const item = allItems[curIdx];
        const img = item.querySelector('img');
        vImg.src = img.getAttribute('data-full') || img.src;
        vCap.textContent = img.alt || '';
        resetZoom();
    }

    document.getElementById('zoomInBtn')?.addEventListener('click', e => {
        e.stopPropagation();
        if (zoomLevel < 3) { zoomLevel += 0.2; vImg.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`; }
    });
    document.getElementById('zoomOutBtn')?.addEventListener('click', e => {
        e.stopPropagation();
        if (zoomLevel > 0.5) { zoomLevel -= 0.2; vImg.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`; }
    });
    document.getElementById('resetZoomBtn')?.addEventListener('click', e => {
        e.stopPropagation();
        resetZoom();
    });

    document.getElementById('galleryGrid')?.addEventListener('click', function(e) {
        const item = e.target.closest('.gallery-item');
        if (item) openViewer(item, Array.from(this.querySelectorAll('.gallery-item')).indexOf(item));
    });

    document.getElementById('certificatesGrid')?.addEventListener('click', function(e) {
        const item = e.target.closest('.certificate-item');
        if (!item) return;
        const img = item.querySelector('img');
        if (!img) return;
        vImg.src = img.getAttribute('data-full') || img.src;
        vCap.textContent = img.alt || '';
        viewer.style.display = 'block';
        document.body.style.overflow = 'hidden';
        resetZoom();
    });

    document.getElementById('closeViewer')?.addEventListener('click', closeViewer);
    viewer.addEventListener('click', e => { if (e.target === viewer) closeViewer(); });
    document.getElementById('prevBtn')?.addEventListener('click', e => { e.stopPropagation(); navigate(-1); });
    document.getElementById('nextBtn')?.addEventListener('click', e => { e.stopPropagation(); navigate(1); });

    document.addEventListener('keydown', e => {
        if (viewer.style.display === 'block') {
            if (e.key === 'Escape') closeViewer();
            if (e.key === 'ArrowRight') navigate(1);
            if (e.key === 'ArrowLeft') navigate(-1);
        }
    });
});

// Фильтр сертификатов
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const course = this.getAttribute('data-course');
            document.querySelectorAll('.certificate-item').forEach(item => {
                item.style.display = (course === 'all' || item.getAttribute('data-course') === course) ? 'block' : 'none';
            });
        });
    });
});

// Дополнительные стили анимаций
const extraStyles = document.createElement('style');
extraStyles.textContent = `
    @keyframes heartFly { 0% { opacity:1; transform:translateY(0) scale(1); } 100% { opacity:0; transform:translateY(-70px) scale(1.6); } }
    @keyframes barkUp { 0% { opacity:1; transform:translateY(0); } 100% { opacity:0; transform:translateY(-50px); } }
`;
document.head.appendChild(extraStyles);

// ═══════════════════════════════════════════
// ЗАПУСК ВСЕГО
// ═══════════════════════════════════════════
window.addEventListener('load', () => {
    initTypingEffect();
    initParticles();
    initStarfield();
    initWaterfallGame();
    initDogBoat();
    initDeepRealm();
    setTimeout(loadMusicPlaylist, 1000);
});
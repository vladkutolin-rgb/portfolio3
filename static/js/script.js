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
            if (el.id === 'about') setTimeout(() => { animateTechBars(); animateCounters(); }, 300);
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
            ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
}
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (mobileBtn) mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});
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
        const t = +c.getAttribute('data-target'), cur = +c.innerText, inc = t / 200;
        if (cur < t) {
            const upd = () => { const n = +c.innerText; if (n < t) { c.innerText = Math.ceil(n + inc); setTimeout(upd, 10); } else c.innerText = t; };
            upd();
        }
    });
}

// ═══════════════════════════════════════════
// ЧАСТИЦЫ
// ═══════════════════════════════════════════
function initParticles() {
    const sec = document.getElementById('about'); if (!sec || document.getElementById('particles-canvas')) return;
    const cont = document.getElementById('particles-js'); if (!cont) return;
    const canvas = document.createElement('canvas'); canvas.id = 'particles-canvas'; cont.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = cont.offsetWidth; canvas.height = cont.offsetHeight; }
    resize(); window.addEventListener('resize', resize);
    const digits = ['0', '1'], particles = [];
    for (let i = 0; i < 60; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 12 + 8, speed: Math.random() * 0.4 + 0.1, digit: digits[Math.floor(Math.random() * 2)], opacity: Math.random() * 0.25 + 0.05, dir: Math.random() * Math.PI * 2 });
    function draw() { if (!canvas.isConnected) return; ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.x += Math.cos(p.dir) * p.speed; p.y += Math.sin(p.dir) * p.speed; if (p.x < -20) p.x = canvas.width + 20; if (p.x > canvas.width + 20) p.x = -20; if (p.y < -20) p.y = canvas.height + 20; if (p.y > canvas.height + 20) p.y = -20; ctx.fillStyle = `rgba(0, 163, 54, ${p.opacity})`; ctx.font = `${p.size}px 'Courier New', monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(p.digit, p.x, p.y); }); requestAnimationFrame(draw); }
    draw();
}

// ═══════════════════════════════════════════
// КРУГОВАЯ ДИАГРАММА
// ═══════════════════════════════════════════
function drawSkillsChart() {
    const canvas = document.getElementById('skillsChart'); if (!canvas) return;
    const container = canvas.parentElement, size = Math.min(container.offsetWidth - 40, 280);
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d'), cx = size / 2, cy = size / 2, r = size * 0.38;
    const catData = {};
    document.querySelectorAll('.tech-category').forEach(cat => { const name = cat.querySelector('h4').textContent, percents = []; cat.querySelectorAll('.skill-percentage').forEach(sp => percents.push(parseInt(sp.textContent))); if (percents.length > 0) catData[name] = Math.round(percents.reduce((a, b) => a + b, 0) / percents.length); });
    const items = Object.entries(catData); if (items.length === 0) return;
    const colors = ['#00a336', '#00d44c', '#4dabf7', '#ffd700', '#ff6b6b', '#a29bfe', '#fd79a8', '#00cec9'], total = items.reduce((s, [, v]) => s + v, 0);
    let angle = -Math.PI / 2, legend = ''; ctx.clearRect(0, 0, size, size);
    items.forEach(([name, value], i) => { const slice = (value / total) * 2 * Math.PI, color = colors[i % colors.length]; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, angle, angle + slice); ctx.closePath(); ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke(); const mid = angle + slice / 2; if (slice > 0.5) { ctx.fillStyle = '#fff'; ctx.font = 'bold 11px "Segoe UI"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(value + '%', cx + Math.cos(mid) * r * 0.6, cy + Math.sin(mid) * r * 0.6); } legend += `<div style="display:flex;align-items:flex-start;margin-bottom:8px;gap:8px;"><span style="background:${color};min-width:14px;width:14px;height:14px;border-radius:3px;display:inline-block;margin-top:2px;flex-shrink:0;"></span><span style="font-size:13px;line-height:1.4;">${name} — <strong>${value}%</strong></span></div>`; angle += slice; });
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.45, 0, 2 * Math.PI); ctx.fillStyle = '#fff'; ctx.fill();
    document.getElementById('chartLegend').innerHTML = legend;
}
let chartDrawn = false;
window.addEventListener('load', () => setTimeout(drawSkillsChart, 1000));
window.addEventListener('scroll', () => { if (document.getElementById('about')?.classList.contains('animated') && !chartDrawn) { drawSkillsChart(); chartDrawn = true; } });

// ═══════════════════════════════════════════
// МУЗЫКА
// ═══════════════════════════════════════════
let audioCtx, analyser, audioSource, musicPlaylist = [], currentTrack = 0, isMusicPlaying = false;
window.symphonyBass = 0.2;
const musicAudio = document.getElementById('musicAudio'), musicToggle = document.getElementById('musicToggle'), musicTitle = document.getElementById('musicTitle'), musicVolume = document.getElementById('musicVolume'), musicNext = document.getElementById('musicNext');

function loadMusicPlaylist() { fetch('/api/music').then(r => r.json()).then(tracks => { musicPlaylist = tracks; if (tracks.length > 0) loadTrack(0); }); }
function loadTrack(i) { if (!musicPlaylist.length) return; currentTrack = i; const t = musicPlaylist[currentTrack]; musicAudio.src = '/' + t.file_path; musicTitle.textContent = t.title; if (isMusicPlaying) musicAudio.play(); }
function toggleMusic() { if (!musicPlaylist.length) return; if (isMusicPlaying) { musicAudio.pause(); isMusicPlaying = false; musicToggle.textContent = '🔇'; } else { if (!audioCtx) initAudio(); musicAudio.play(); isMusicPlaying = true; musicToggle.textContent = '🔊'; } }
function initAudio() { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); analyser = audioCtx.createAnalyser(); analyser.fftSize = 128; analyser.smoothingTimeConstant = 0.85; audioSource = audioCtx.createMediaElementSource(musicAudio); audioSource.connect(analyser); analyser.connect(audioCtx.destination); }
function updateBass() { if (!analyser || !isMusicPlaying) { window.symphonyBass = window.symphonyBass * 0.9 + 0.2 * 0.1; return; } const d = new Uint8Array(analyser.frequencyBinCount); analyser.getByteFrequencyData(d); let b = 0; for (let i = 0; i < 10; i++) b += d[i]; const raw = b / 10 / 255; window.symphonyBass = window.symphonyBass * 0.7 + raw * 0.3; }
setInterval(updateBass, 33);
if (musicToggle) musicToggle.addEventListener('click', toggleMusic);
if (musicNext) musicNext.addEventListener('click', () => { if (!musicPlaylist.length) return; loadTrack((currentTrack + 1) % musicPlaylist.length); if (isMusicPlaying) musicAudio.play(); });
if (musicVolume) musicVolume.addEventListener('input', () => { musicAudio.volume = musicVolume.value / 100; });
musicAudio.addEventListener('ended', () => { if (musicPlaylist.length) { loadTrack((currentTrack + 1) % musicPlaylist.length); musicAudio.play(); } });
musicAudio.volume = 0.3; if (musicVolume) musicVolume.value = 30;

// ═══════════════════════════════════════════
// КРИСТАЛЬНЫЙ ГРОТ — ГАЛЕРЕЯ
// ═══════════════════════════════════════════
function initGrotto() {
    const canvas = document.getElementById('grottoCanvas');
    const gallery = document.querySelector('.gallery');
    if (!canvas || !gallery) return;

    const ctx = canvas.getContext('2d');
    let W, H, time = 0;

    function resize() { W = gallery.offsetWidth; H = gallery.offsetHeight; canvas.width = W; canvas.height = H; }
    resize(); window.addEventListener('resize', resize);

    const crystals = [], spores = [], waterDrops = [];
    
    // Кристаллы-сталактиты
    for (let i = 0; i < 12; i++) {
        crystals.push({
            x: Math.random() * W,
            y: -10,
            length: 60 + Math.random() * 120,
            width: 6 + Math.random() * 14,
            hue: [180, 280, 140][Math.floor(Math.random() * 3)],
            phase: Math.random() * Math.PI * 2,
            speed: 0.01 + Math.random() * 0.03,
            sparkle: 0
        });
    }

    // Споры
    for (let i = 0; i < 50; i++) {
        spores.push({
            x: Math.random() * W,
            y: Math.random() * H,
            size: 1 + Math.random() * 3,
            speed: 0.2 + Math.random() * 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -0.2 - Math.random() * 0.5,
            hue: 180 + Math.random() * 100,
            phase: Math.random() * Math.PI * 2
        });
    }

    // Капли воды
    for (let i = 0; i < 30; i++) {
        waterDrops.push({
            x: Math.random() * W,
            y: Math.random() * H,
            size: 1 + Math.random() * 3,
            speed: 1 + Math.random() * 2,
            opacity: 0.3 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2
        });
    }

    function drawCrystals(bass) {
        crystals.forEach(c => {
            c.phase += c.speed * (1 + bass);
            c.sparkle = Math.abs(Math.sin(c.phase)) * (0.3 + bass * 0.7);

            // Основной кристалл
            const grad = ctx.createLinearGradient(c.x, c.y, c.x, c.y + c.length);
            grad.addColorStop(0, `hsla(${c.hue}, 80%, 70%, 0.9)`);
            grad.addColorStop(0.5, `hsla(${c.hue}, 70%, 50%, 0.6)`);
            grad.addColorStop(1, `hsla(${c.hue}, 60%, 30%, 0.1)`);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(c.x - c.width / 2, c.y);
            ctx.lineTo(c.x - c.width * 0.3, c.y + c.length);
            ctx.lineTo(c.x + c.width * 0.3, c.y + c.length);
            ctx.lineTo(c.x + c.width / 2, c.y);
            ctx.closePath();
            ctx.fill();

            // Свечение
            const glow = ctx.createRadialGradient(c.x, c.y + c.length * 0.3, c.width * 0.2, c.x, c.y + c.length * 0.3, c.width * 1.5);
            glow.addColorStop(0, `hsla(${c.hue}, 80%, 70%, ${c.sparkle})`);
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(c.x, c.y + c.length * 0.3, c.width * 1.5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawSpores(bass) {
        spores.forEach(s => {
            s.x += s.vx * (1 + bass * 2);
            s.y += s.vy * (1 + bass * 2);
            s.phase += 0.02;

            if (s.y < -20) { s.y = H + 20; s.x = Math.random() * W; }
            if (s.y > H + 20) { s.y = -20; s.x = Math.random() * W; }
            if (s.x < -20) s.x = W + 20;
            if (s.x > W + 20) s.x = -20;

            const alpha = 0.3 + Math.abs(Math.sin(s.phase)) * 0.5 * (1 + bass);
            ctx.fillStyle = `hsla(${s.hue}, 70%, 70%, ${alpha})`;
            ctx.shadowColor = `hsla(${s.hue}, 80%, 65%, ${alpha})`;
            ctx.shadowBlur = 4 + bass * 6;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }

    function drawWaterDrops(bass) {
        waterDrops.forEach(d => {
            d.y += d.speed * (1 + bass * 0.5);
            d.phase += 0.03;
            if (d.y > H) { d.y = -10; d.x = Math.random() * W; }

            const alpha = d.opacity * (0.5 + bass * 0.5);
            ctx.fillStyle = `rgba(0, 200, 220, ${alpha})`;
            ctx.beginPath();
            ctx.ellipse(d.x, d.y, d.size, d.size * 1.8, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
            ctx.beginPath();
            ctx.arc(d.x - d.size * 0.2, d.y - d.size * 0.3, d.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

       function drawCavernWalls() {
        const bass = window.symphonyBass || 0.15;
        const energy = bass;

        // Свод пещеры
        const ceiling = ctx.createLinearGradient(0, 0, 0, H * 0.4);
        ceiling.addColorStop(0, 'rgba(10, 10, 20, 0.95)');
        ceiling.addColorStop(0.5, 'rgba(15, 15, 30, 0.6)');
        ceiling.addColorStop(1, 'rgba(20, 20, 40, 0)');
        ctx.fillStyle = ceiling;
        ctx.fillRect(0, 0, W, H * 0.4);

        // Боковые стены
        const leftWall = ctx.createLinearGradient(0, 0, W * 0.1, 0);
        leftWall.addColorStop(0, 'rgba(15, 15, 25, 0.8)');
        leftWall.addColorStop(1, 'rgba(15, 15, 25, 0)');
        ctx.fillStyle = leftWall;
        ctx.fillRect(0, 0, W * 0.1, H);

        const rightWall = ctx.createLinearGradient(W, 0, W * 0.9, 0);
        rightWall.addColorStop(0, 'rgba(15, 15, 25, 0.8)');
        rightWall.addColorStop(1, 'rgba(15, 15, 25, 0)');
        ctx.fillStyle = rightWall;
        ctx.fillRect(W * 0.9, 0, W * 0.1, H);

        // ═══════════════════════════════════
        // ЭНЕРГЕТИЧЕСКАЯ РЕКА БЕЗДНЫ
        // ═══════════════════════════════════
        const riverY = H * 0.68;

        // Глубинное свечение
        const depthGlow = ctx.createLinearGradient(0, riverY - 30, 0, H);
        depthGlow.addColorStop(0, `rgba(100, 20, 200, ${0.1 + energy * 0.15})`);
        depthGlow.addColorStop(0.3, `rgba(60, 10, 150, ${0.2 + energy * 0.2})`);
        depthGlow.addColorStop(0.6, `rgba(0, 180, 220, ${0.15 + energy * 0.1})`);
        depthGlow.addColorStop(1, `rgba(0, 40, 100, ${0.4 + energy * 0.3})`);
        ctx.fillStyle = depthGlow;
        ctx.fillRect(0, riverY - 10, W, H - riverY + 10);

        // Неоновое свечение под поверхностью
        for (let i = 0; i < 3; i++) {
            const glowX = W * 0.2 + i * W * 0.3;
            const glowY = riverY + 20 + i * 15;
            const glowR = W * 0.2 + Math.sin(time * 0.5 + i) * 30;
            const glowAlpha = (0.08 + energy * 0.15) * (0.6 + Math.sin(time * 0.7 + i * 2) * 0.4);
            
            const glow = ctx.createRadialGradient(glowX, glowY, 10, glowX, glowY, glowR);
            glow.addColorStop(0, `rgba(160, 80, 255, ${glowAlpha})`);
            glow.addColorStop(0.5, `rgba(0, 200, 220, ${glowAlpha * 0.5})`);
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, riverY - 30, W, H - riverY + 30);
        }

        // ═══════════════════════════════════
        // НЕОНОВЫЕ ВОЛНЫ
        // ═══════════════════════════════════
        const waveLayers = [
            { h: 5 + energy * 30, s: 0.8 + energy * 2.5, a: 0.25, hue: 270 },
            { h: 7 + energy * 22, s: 0.6 + energy * 1.8, a: 0.35, hue: 180 },
            { h: 3 + energy * 16, s: 1.2 + energy * 3.5, a: 0.18, hue: 200 }
        ];

        waveLayers.forEach((layer, li) => {
            for (let x = 0; x < W; x += 4) {
                const y = riverY + 
                    Math.sin((x + time * layer.s) / 100 + li * 2) * layer.h +
                    Math.cos((x - time * layer.s * 0.6) / 70 + li) * layer.h * 0.5 +
                    Math.sin((x * 0.03 + time * 0.3)) * 3;
                
                // Неоновая волна
                ctx.fillStyle = `hsla(${layer.hue}, 80%, 60%, ${layer.a})`;
                ctx.fillRect(x, y, 4, 3);
                
                // Свечение гребня
                if (Math.sin((x + time * layer.s) / 100 + li * 2) > 0.7) {
                    ctx.fillStyle = `rgba(200, 180, 255, ${layer.a * 0.8})`;
                    ctx.fillRect(x, y - 1, 4, 1);
                }
            }
        });

        // ═══════════════════════════════════
        // ЭЛЕКТРИЧЕСКИЕ РАЗРЯДЫ НА ВОДЕ
        // ═══════════════════════════════════
        if (energy > 0.25) {
            const boltCount = Math.floor(energy * 8);
            for (let i = 0; i < boltCount; i++) {
                const bx = Math.random() * W;
                const by = riverY + Math.random() * 20;
                const bLen = 10 + Math.random() * 30;
                
                ctx.strokeStyle = `rgba(200, 160, 255, ${energy * 0.7})`;
                ctx.lineWidth = 1;
                ctx.shadowColor = `rgba(180, 120, 255, ${energy})`;
                ctx.shadowBlur = 8 + energy * 12;
                ctx.beginPath();
                ctx.moveTo(bx, by);
                for (let s = 0; s < 3; s++) {
                    ctx.lineTo(bx + (Math.random() - 0.5) * bLen, by + s * bLen / 3 + (Math.random() - 0.5) * 10);
                }
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }

        // ═══════════════════════════════════
        // ЗВЁЗДНАЯ ПЫЛЬ НА ПОВЕРХНОСТИ
        // ═══════════════════════════════════
        const dustCount = Math.floor(15 + energy * 30);
        for (let i = 0; i < dustCount; i++) {
            const dx = (time * 0.3 + i * W / dustCount) % W;
            const dy = riverY + 5 + Math.sin(dx / 40 + time * 0.5) * (3 + energy * 8);
            const da = 0.3 + Math.abs(Math.sin(time * 0.06 + i * 0.5)) * (0.4 + energy * 0.5);
            const dh = 250 + Math.sin(i * 0.7 + time * 0.1) * 30;
            
            ctx.fillStyle = `hsla(${dh}, 70%, 70%, ${da})`;
            ctx.shadowColor = `hsla(${dh}, 80%, 65%, ${da * 0.8})`;
            ctx.shadowBlur = 3 + energy * 5;
            ctx.fillRect(dx, dy, 2, 2);
            ctx.shadowBlur = 0;
        }

        // ═══════════════════════════════════
        // ВСПЛЕСКИ ПРИ БАСАХ
        // ═══════════════════════════════════
        if (energy > 0.4) {
            const splashCount = Math.floor(energy * 5);
            for (let i = 0; i < splashCount; i++) {
                const sx = W * 0.15 + Math.random() * W * 0.7;
                const sy = riverY - 10 - Math.random() * 20;
                const ss = 2 + Math.random() * 4 * energy;
                
                ctx.fillStyle = `rgba(200, 180, 255, ${energy * 0.6})`;
                ctx.shadowColor = 'rgba(180, 140, 255, 0.8)';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(sx, sy, ss, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        // ═══════════════════════════════════
        // БИТ-КРУГИ НА ВОДЕ
        // ═══════════════════════════════════
        if (energy > 0.3) {
            const circleAlpha = (energy - 0.3) * 2;
            for (let i = 0; i < 3; i++) {
                const cx = W * 0.2 + i * W * 0.3;
                const cr = energy * 50 * (0.5 + i * 0.3);
                
                ctx.strokeStyle = `rgba(180, 150, 255, ${circleAlpha * 0.4})`;
                ctx.lineWidth = 1.5;
                ctx.shadowColor = `rgba(160, 120, 255, ${circleAlpha * 0.5})`;
                ctx.shadowBlur = 12 + energy * 15;
                ctx.beginPath();
                ctx.arc(cx, riverY + 8, cr, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }
    }

    function animate(ts) {
        if (!canvas.isConnected) return;
        time = ts * 0.001;
        const bass = window.symphonyBass || 0.15;
        ctx.clearRect(0, 0, W, H);

        // Фон пещеры
        const bg = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.8);
        bg.addColorStop(0, 'rgba(10, 20, 35, 0.5)');
        bg.addColorStop(1, 'rgba(5, 8, 15, 0.95)');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        drawCavernWalls();
        drawCrystals(bass);
        drawWaterDrops(bass);
        drawSpores(bass);

        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

// ═══════════════════════════════════════════
// БЕЗДНА — СЕРТИФИКАТЫ
// ═══════════════════════════════════════════
function initAbyss() {
    const canvas = document.getElementById('abyssCanvas');
    const section = document.getElementById('certificates');
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    let W, H, time = 0;

    function resize() { W = section.offsetWidth; H = section.offsetHeight; canvas.width = W; canvas.height = H; }
    resize(); window.addEventListener('resize', resize);

    let shards = [], abyssCrystals = [], energyLines = [], stardust = [];
    let collectedCount = 0;
    const MAX_CRYSTALS = 5;

    // Парящие осколки
    for (let i = 0; i < 20; i++) {
        shards.push({
            x: Math.random() * W, y: Math.random() * H,
            size: 6 + Math.random() * 16,
            hue: [280, 180, 140][Math.floor(Math.random() * 3)],
            speed: 0.3 + Math.random() * 0.7,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            phase: Math.random() * Math.PI * 2,
            rotation: Math.random() * Math.PI * 2,
            popped: false, popTime: 0, particles: []
        });
    }

    // Звёздная пыль
    for (let i = 0; i < 60; i++) {
        stardust.push({
            x: Math.random() * W, y: Math.random() * H,
            size: 0.5 + Math.random() * 1.5,
            hue: 40 + Math.random() * 40,
            phase: Math.random() * Math.PI * 2,
            speed: 0.005 + Math.random() * 0.02
        });
    }

    function createAbyssCrystal(x, hue, size) {
        return {
            x: x || Math.random() * W,
            y: H + 60,
            targetY: H * 0.2 + Math.random() * H * 0.5,
            size: Math.max(18, (size || 15) * 1.8),
            hue: hue || [280, 180, 140][Math.floor(Math.random() * 3)],
            life: 1, born: performance.now(),
            maxLife: 25 + Math.random() * 45,
            phase: Math.random() * Math.PI * 2,
            bassMemory: 0,
            rings: [],
            sparkles: [],
            trail: []
        };
    }

    function spawnAbyssCrystal(x, hue, size) {
        if (abyssCrystals.length >= MAX_CRYSTALS) abyssCrystals.shift();
        const c = createAbyssCrystal(x, hue, size);
        for (let i = 0; i < 3; i++) {
            c.rings.push({ radius: c.size * (0.3 + i * 0.3), speed: 0.01 + i * 0.006, angle: i * Math.PI / 3, tilt: 0.2 + i * 0.12 });
        }
        abyssCrystals.push(c);
    }

    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        for (let i = shards.length - 1; i >= 0; i--) {
            const s = shards[i];
            if (!s.popped && Math.hypot(mx - s.x, my - s.y) < s.size + 8) {
                s.popped = true; s.popTime = performance.now();
                s.particles = [];
                for (let j = 0; j < 12; j++) {
                    const a = (Math.PI * 2 / 12) * j;
                    s.particles.push({ x: s.x, y: s.y, vx: Math.cos(a) * (2 + Math.random() * 4), vy: Math.sin(a) * (2 + Math.random() * 4), life: 1, size: 1 + Math.random() * 2, hue: s.hue });
                }
                collectedCount++;
                document.getElementById('bubbleCount').textContent = collectedCount;
                if (collectedCount % 15 === 0) {
                    // Открытие Бездны
                    window.symphonyBass = 1;
                    setTimeout(() => { if (!isMusicPlaying) window.symphonyBass = 0.2; }, 1500);
                }
                spawnAbyssCrystal(s.x, s.hue, s.size);
                break;
            }
        }
    });

    function drawShards(bass) {
        shards.forEach(s => {
            if (s.popped) {
                const elapsed = (performance.now() - s.popTime) / 1000;
                if (elapsed > 1.2) { Object.assign(s, { x: Math.random() * W, y: H + 40, popped: false, particles: [] }); return; }
                s.particles.forEach(p => {
                    p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life -= 0.03;
                    if (p.life > 0) { ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.life})`; ctx.shadowColor = `hsla(${p.hue}, 90%, 60%, ${p.life * 0.7})`; ctx.shadowBlur = 6; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; }
                });
                return;
            }
            s.x += s.vx * (1 + bass); s.y += s.vy * (1 + bass);
            s.phase += 0.02; s.rotation += 0.01;
            if (s.y < -30) s.y = H + 30; if (s.y > H + 30) s.y = -30;
            if (s.x < -30) s.x = W + 30; if (s.x > W + 30) s.x = -30;

            const alpha = 0.5 + Math.abs(Math.sin(s.phase)) * 0.3 * (1 + bass);
            const glow = ctx.createRadialGradient(s.x, s.y, s.size * 0.2, s.x, s.y, s.size * 1.5);
            glow.addColorStop(0, `hsla(${s.hue}, 70%, 65%, ${alpha * 0.6})`);
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 1.5, 0, Math.PI * 2); ctx.fill();

            ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.rotation);
            const grad = ctx.createLinearGradient(0, -s.size / 2, 0, s.size / 2);
            grad.addColorStop(0, `hsla(${s.hue}, 60%, 80%, 0.85)`);
            grad.addColorStop(0.5, `hsla(${s.hue}, 50%, 55%, 0.6)`);
            grad.addColorStop(1, `hsla(${s.hue}, 40%, 30%, 0.2)`);
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.moveTo(0, -s.size / 2); ctx.lineTo(s.size / 2, s.size / 2); ctx.lineTo(-s.size / 2, s.size * 0.3); ctx.closePath(); ctx.fill();
            ctx.restore();

            ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(s.x - s.size * 0.15, s.y - s.size * 0.2, s.size * 0.15, 0, Math.PI * 2); ctx.fill();
        });
    }

    function drawAbyssCrystals(bass) {
        abyssCrystals.forEach(c => {
            const elapsed = (performance.now() - c.born) / 1000;
            c.life = Math.max(0, 1 - elapsed / c.maxLife);
            if (c.life <= 0) return;
            c.y += (c.targetY - c.y) * 0.02;
            c.bassMemory = c.bassMemory * 0.85 + bass * 0.15;
            c.phase += 0.02 + c.bassMemory * 0.05;
            c.x += Math.sin(time * 0.3 + c.phase) * (0.4 + bass * 1.5);
            const alpha = c.life * (0.5 + c.bassMemory * 0.5);

            for (let l = 3; l >= 0; l--) {
                const lr = c.size * (0.3 + l * 0.3);
                const la = alpha * (0.1 - l * 0.02) * (1 + c.bassMemory);
                const gl = ctx.createRadialGradient(c.x, c.y, lr * 0.1, c.x, c.y, lr);
                gl.addColorStop(0, `hsla(${c.hue}, 60%, 60%, ${la * 2})`); gl.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(c.x, c.y, lr, 0, Math.PI * 2); ctx.fill();
            }

            c.rings.forEach(ring => {
                ring.angle += ring.speed * (1 + c.bassMemory * 2);
                ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(ring.tilt * Math.sin(ring.angle));
                ctx.strokeStyle = `hsla(${c.hue}, 60%, 65%, ${alpha * 0.5})`; ctx.lineWidth = 1.2;
                ctx.shadowColor = `hsla(${c.hue}, 70%, 55%, ${alpha * 0.4})`; ctx.shadowBlur = 6;
                ctx.beginPath(); ctx.arc(0, 0, ring.radius, 0, Math.PI * 2); ctx.stroke();
                ctx.shadowBlur = 0; ctx.restore();
            });

            const core = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.size * 0.25);
            core.addColorStop(0, 'rgba(255,255,255,1)'); core.addColorStop(0.5, `hsla(${c.hue}, 50%, 65%, 0.7)`); core.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = core; ctx.beginPath(); ctx.arc(c.x, c.y, c.size * 0.25, 0, Math.PI * 2); ctx.fill();

            c.trail.push({ x: c.x, y: c.y, life: 1 });
            if (c.trail.length > 6) c.trail.shift();
            c.trail.forEach((t, i) => { t.life -= 0.05; if (t.life > 0) { ctx.fillStyle = `hsla(${c.hue}, 50%, 55%, ${t.life * 0.08})`; ctx.beginPath(); ctx.arc(t.x, t.y, c.size * 0.1 * (i / 6) * t.life, 0, Math.PI * 2); ctx.fill(); } });

            if (Math.random() < 0.25 + c.bassMemory * 0.4) {
                c.sparkles.push({ x: c.x + (Math.random() - 0.5) * c.size * 0.4, y: c.y + (Math.random() - 0.5) * c.size * 0.2, vx: (Math.random() - 0.5) * 0.4, vy: -0.3 - Math.random(), life: 1, size: 0.3 + Math.random() * 1.5 });
            }
            c.sparkles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.025; if (p.life > 0) { ctx.fillStyle = `rgba(200, 220, 255, ${p.life * 0.7})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill(); } });
            c.sparkles = c.sparkles.filter(p => p.life > 0);
        });
        abyssCrystals = abyssCrystals.filter(c => c.life > 0);
    }

    function drawEnergyLines(bass) {
        for (let i = 0; i < abyssCrystals.length; i++) {
            for (let j = i + 1; j < abyssCrystals.length; j++) {
                const dx = abyssCrystals[j].x - abyssCrystals[i].x, dy = abyssCrystals[j].y - abyssCrystals[i].y;
                const dist = Math.hypot(dx, dy);
                if (dist < 200 + bass * 150) {
                    const alpha = (1 - dist / (200 + bass * 150)) * 0.12;
                    ctx.strokeStyle = `rgba(180, 200, 255, ${alpha})`;
                    ctx.lineWidth = 0.4; ctx.shadowColor = `rgba(150, 180, 255, ${alpha * 2})`; ctx.shadowBlur = 5;
                    ctx.beginPath(); ctx.moveTo(abyssCrystals[i].x, abyssCrystals[i].y);
                    const mx = (abyssCrystals[i].x + abyssCrystals[j].x) / 2 + (Math.random() - 0.5) * 20;
                    const my = (abyssCrystals[i].y + abyssCrystals[j].y) / 2 + (Math.random() - 0.5) * 20;
                    ctx.quadraticCurveTo(mx, my, abyssCrystals[j].x, abyssCrystals[j].y);
                    ctx.stroke(); ctx.shadowBlur = 0;
                }
            }
        }
    }

    function drawStardust(bass) {
        stardust.forEach(s => {
            s.phase += s.speed * (1 + bass);
            const alpha = 0.2 + Math.abs(Math.sin(s.phase)) * 0.5 * (1 + bass);
            ctx.fillStyle = `hsla(${s.hue}, 80%, 70%, ${alpha})`;
            ctx.beginPath(); ctx.arc(s.x, s.y, s.size * (1 + bass * 0.5), 0, Math.PI * 2); ctx.fill();
        });
    }

    function animate(ts) {
        if (!canvas.isConnected) return;
        time = ts * 0.001;
        const bass = window.symphonyBass || 0.15;
        ctx.clearRect(0, 0, W, H);

        // Фон Бездны
        const bg = ctx.createRadialGradient(W / 2, H * 0.6, W * 0.1, W / 2, H * 0.5, W * 0.8);
        bg.addColorStop(0, 'rgba(20, 5, 40, 0.5)');
        bg.addColorStop(1, 'rgba(2, 1, 8, 0.95)');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        // Кристальное дно
        for (let i = 0; i < 8; i++) {
            const cx = W * 0.1 + i * W * 0.1;
            const cy = H * 0.85 + Math.sin(i * 1.5) * 20;
            const grad = ctx.createLinearGradient(cx, cy, cx, H);
            grad.addColorStop(0, `hsla(${260 + i * 15}, 60%, 50%, 0.4)`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(cx - 15, cy); ctx.lineTo(cx + 5, H); ctx.lineTo(cx + 25, H); ctx.lineTo(cx + 15, cy - 10);
            ctx.closePath(); ctx.fill();
        }

        drawStardust(bass);
        drawShards(bass);
        drawAbyssCrystals(bass);
        drawEnergyLines(bass);

        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

// ═══════════════════════════════════════════
// СОБАЧКА
// ═══════════════════════════════════════════
function initDogBoat() {
    const dog = document.getElementById('dogBoat'), gallery = document.querySelector('.gallery');
    if (!dog || !gallery) return;
    let dragging = false, px, py, vx = 0, vy = 0, animId;
    
    function setPos(x, y) {
        const r = gallery.getBoundingClientRect();
        x = Math.max(30, Math.min(x, r.width - 80)); y = Math.max(50, Math.min(y, r.height - 80));
        dog.style.left = x + 'px'; dog.style.top = y + 'px'; dog.style.bottom = 'auto'; dog.style.transform = 'none';
    }
    function physics() {
        const r = gallery.getBoundingClientRect();
        let x = parseFloat(dog.style.left) || r.width / 2, y = parseFloat(dog.style.top) || r.height * 0.65;
        x += vx; y += vy; vx *= 0.93; vy *= 0.93;
        if (x <= 30) { x = 30; vx = Math.abs(vx) * 0.3; }
        if (x >= r.width - 80) { x = r.width - 80; vx = -Math.abs(vx) * 0.3; }
        if (y <= 50) { y = 50; vy = Math.abs(vy) * 0.3; }
        if (y >= r.height - 80) { y = r.height - 80; vy = -Math.abs(vy) * 0.3; }
        dog.style.left = x + 'px'; dog.style.top = y + 'px'; dog.style.transform = 'none';
        if (Math.abs(vx) > 0.08 || Math.abs(vy) > 0.08) animId = requestAnimationFrame(physics);
    }
    dog.addEventListener('mousedown', e => { dragging = true; cancelAnimationFrame(animId); px = e.clientX; py = e.clientY; dog.style.cursor = 'grabbing'; e.preventDefault(); });
    document.addEventListener('mousemove', e => { if (!dragging) return; const gr = gallery.getBoundingClientRect(); setPos(e.clientX - gr.left - 40, e.clientY - gr.top - 30); px = e.clientX; py = e.clientY; });
    document.addEventListener('mouseup', e => { if (!dragging) return; dragging = false; dog.style.cursor = 'grab'; vx = (e.clientX - px) * 6; vy = (e.clientY - py) * 6; physics(); });
    let autoAngle = 0;
    setInterval(() => { if (!dragging && (!animId || Math.abs(vx) < 0.08)) { autoAngle += 0.01; const r = gallery.getBoundingClientRect(); setPos(r.width / 2 + Math.sin(autoAngle) * 60, r.height * 0.65 + Math.cos(autoAngle * 0.6) * 10); } }, 50);
    setTimeout(() => { const r = gallery.getBoundingClientRect(); setPos(r.width / 2, r.height * 0.65); }, 500);
}

// ═══════════════════════════════════════════
// ПРОСМОТРЩИК ФОТО
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    const viewer = document.getElementById('imageViewer'), vImg = document.getElementById('viewerImage'), vCap = document.getElementById('viewerCaption');
    if (!viewer || !vImg) return;
    let allItems = [], curIdx = 0, zoomLevel = 1;
    function getVisible() { return Array.from(document.querySelectorAll('#galleryGrid .gallery-item')).filter(i => window.getComputedStyle(i).display !== 'none'); }
    function resetZoom() { zoomLevel = 1; vImg.style.transform = 'translate(-50%, -50%) scale(1)'; }
    function openViewer(imgEl, idx) { allItems = getVisible(); curIdx = idx; const img = imgEl.querySelector('img') || imgEl; vImg.src = img.getAttribute('data-full') || img.src; vCap.textContent = img.alt || ''; viewer.style.display = 'block'; document.body.style.overflow = 'hidden'; resetZoom(); }
    function closeViewer() { viewer.style.display = 'none'; document.body.style.overflow = 'auto'; }
    function navigate(dir) { allItems = getVisible(); if (allItems.length === 0) return; curIdx = (curIdx + dir + allItems.length) % allItems.length; const item = allItems[curIdx], img = item.querySelector('img'); vImg.src = img.getAttribute('data-full') || img.src; vCap.textContent = img.alt || ''; resetZoom(); }
    document.getElementById('zoomInBtn')?.addEventListener('click', e => { e.stopPropagation(); if (zoomLevel < 3) { zoomLevel += 0.2; vImg.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`; } });
    document.getElementById('zoomOutBtn')?.addEventListener('click', e => { e.stopPropagation(); if (zoomLevel > 0.5) { zoomLevel -= 0.2; vImg.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`; } });
    document.getElementById('resetZoomBtn')?.addEventListener('click', e => { e.stopPropagation(); resetZoom(); });
    document.getElementById('galleryGrid')?.addEventListener('click', function(e) { const item = e.target.closest('.gallery-item'); if (item) openViewer(item, Array.from(this.querySelectorAll('.gallery-item')).indexOf(item)); });
    document.getElementById('certificatesGrid')?.addEventListener('click', function(e) { const item = e.target.closest('.certificate-item'); if (!item) return; const img = item.querySelector('img'); if (!img) return; vImg.src = img.getAttribute('data-full') || img.src; vCap.textContent = img.alt || ''; viewer.style.display = 'block'; document.body.style.overflow = 'hidden'; resetZoom(); });
    document.getElementById('closeViewer')?.addEventListener('click', closeViewer);
    viewer.addEventListener('click', e => { if (e.target === viewer) closeViewer(); });
    document.getElementById('prevBtn')?.addEventListener('click', e => { e.stopPropagation(); navigate(-1); });
    document.getElementById('nextBtn')?.addEventListener('click', e => { e.stopPropagation(); navigate(1); });
    document.addEventListener('keydown', e => { if (viewer.style.display === 'block') { if (e.key === 'Escape') closeViewer(); if (e.key === 'ArrowRight') navigate(1); if (e.key === 'ArrowLeft') navigate(-1); } });
});

// ═══════════════════════════════════════════
// ФИЛЬТР СЕРТИФИКАТОВ
// ═══════════════════════════════════════════
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

// ═══════════════════════════════════════════
// ЗАПУСК
// ═══════════════════════════════════════════
window.addEventListener('load', () => {
    initTypingEffect();
    initParticles();
    initGrotto();
    initAbyss();
    initDogBoat();
    setTimeout(loadMusicPlaylist, 1000);
});
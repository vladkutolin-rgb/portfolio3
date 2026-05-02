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
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.innerHTML = navMenu.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });
}

document.querySelectorAll('nav ul li a').forEach(l => {
    l.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// ═══════════════════════════════════════════
// ПЛАВНАЯ ПРОКРУТКА
// ═══════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
    });
});

// ═══════════════════════════════════════════
// КНОПКА ВВЕРХ
// ═══════════════════════════════════════════
const scrollBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', () => {
    if (scrollBtn) scrollBtn.classList.toggle('visible', window.pageYOffset > 300);
});
if (scrollBtn) {
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ═══════════════════════════════════════════
// АНИМАЦИЯ ТЕХ-СТЕКА
// ═══════════════════════════════════════════
function animateTechBars() {
    document.querySelectorAll('.percentage-fill[data-width]').forEach(el => {
        el.style.width = el.getAttribute('data-width') + '%';
    });
}

// ═══════════════════════════════════════════
// АНИМАЦИЯ СЧЁТЧИКОВ
// ═══════════════════════════════════════════
function animateCounters() {
    document.querySelectorAll('.counter').forEach(c => {
        const t = +c.getAttribute('data-target');
        const cur = +c.innerText;
        const inc = t / 200;
        if (cur < t) {
            const upd = () => {
                const n = +c.innerText;
                if (n < t) { c.innerText = Math.ceil(n + inc); setTimeout(upd, 10); }
                else c.innerText = t;
            };
            upd();
        }
    });
}

// ═══════════════════════════════════════════
// ЧАСТИЦЫ
// ═══════════════════════════════════════════
function initParticles() {
    const sec = document.getElementById('about');
    if (!sec || document.getElementById('particles-canvas')) return;
    const cont = document.getElementById('particles-js');
    if (!cont) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    cont.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = cont.offsetWidth;
        canvas.height = cont.offsetHeight;
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
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.38;

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
            const tx = cx + Math.cos(mid) * r * 0.6;
            const ty = cy + Math.sin(mid) * r * 0.6;
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 11px "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(value + '%', tx, ty);
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
// ВОДОПАДЫ + РЕКА
// ═══════════════════════════════════════════
function initWaterfallGame() {
    const canvas = document.getElementById('waterfallCanvas');
    const gallery = document.querySelector('.gallery');
    if (!canvas || !gallery) return;

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = gallery.offsetWidth;
        canvas.height = gallery.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const leftWaterfall = [];
    const rightWaterfall = [];
    const riverDrops = [];
    const maxDrops = 60;

    function createDrop(side) {
        return {
            x: side === 'left' ? canvas.width * 0.08 + (Math.random() - 0.5) * 35 :
                canvas.width * 0.92 + (Math.random() - 0.5) * 35,
            y: Math.random() * canvas.height * 0.4,
            speed: 1.5 + Math.random() * 3,
            size: 2 + Math.random() * 3,
            opacity: 0.2 + Math.random() * 0.4,
            splashed: false
        };
    }

    for (let i = 0; i < maxDrops; i++) {
        leftWaterfall.push(createDrop('left'));
        rightWaterfall.push(createDrop('right'));
    }

    let waveOffset = 0;
    window.tsunamiHeight = 0;

    function drawRiverWaves() {
        const riverY = canvas.height * 0.75 + (window.tsunamiHeight || 0) * 0.3;
        const waveHeight = 10 + (window.tsunamiHeight || 0) * 0.4;

        for (let x = 0; x < canvas.width; x += 2) {
            const y = riverY + Math.sin((x + waveOffset) / 140) * waveHeight +
                      Math.cos((x - waveOffset * 0.7) / 90) * waveHeight * 0.5;
            const alpha = 0.1 + Math.abs(Math.sin((x + waveOffset) / 140)) * 0.1;
            ctx.fillStyle = `rgba(0, 180, 220, ${alpha})`;
            ctx.fillRect(x, y, 3, 3);
        }
    }

    function drawWaterfall(particles, x, width) {
        particles.forEach((p) => {
            p.y += p.speed;
            if (p.y > canvas.height * 0.75 && !p.splashed) {
                p.splashed = true;
                for (let s = 0; s < 3; s++) {
                    riverDrops.push({
                        x: x + (Math.random() - 0.5) * width,
                        y: canvas.height * 0.75,
                        vx: (Math.random() - 0.5) * 3,
                        vy: -Math.random() * 5,
                        life: 1,
                        size: 2 + Math.random() * 3
                    });
                }
                p.y = Math.random() * canvas.height * 0.3;
                p.splashed = false;
            }
            ctx.fillStyle = `rgba(0, 180, 230, ${p.opacity})`;
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.size, p.size * 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawRiverSplashes() {
        riverDrops.forEach((d) => {
            d.x += d.vx;
            d.y += d.vy;
            d.vy += 0.1;
            d.life -= 0.02;
            if (d.life > 0) {
                ctx.fillStyle = `rgba(255, 255, 255, ${d.life * 0.5})`;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.size * d.life, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        for (let i = riverDrops.length - 1; i >= 0; i--) {
            if (riverDrops[i].life <= 0) riverDrops.splice(i, 1);
        }
    }

    function drawRocks() {
        ctx.fillStyle = 'rgba(60, 65, 70, 0.2)';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.05);
        ctx.lineTo(canvas.width * 0.1, canvas.height * 0.15);
        ctx.lineTo(canvas.width * 0.08, canvas.height * 0.85);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(canvas.width, canvas.height * 0.05);
        ctx.lineTo(canvas.width * 0.9, canvas.height * 0.15);
        ctx.lineTo(canvas.width * 0.92, canvas.height * 0.85);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
    }

    function animate() {
        if (!canvas.isConnected) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRocks();
        drawWaterfall(leftWaterfall, canvas.width * 0.07, 35);
        drawWaterfall(rightWaterfall, canvas.width * 0.93, 35);
        drawRiverWaves();
        drawRiverSplashes();

        if (window.tsunamiHeight > 0) window.tsunamiHeight *= 0.94;
        if (window.tsunamiHeight < 0.3) window.tsunamiHeight = 0;

        waveOffset += 1;
        requestAnimationFrame(animate);
    }

    animate();

    window.triggerTsunami = function() {
        window.tsunamiHeight = 60;
        const wave = document.getElementById('tsunamiWave');
        if (wave) {
            wave.style.height = '120px';
            setTimeout(() => wave.style.height = '0', 1200);
        }
    };
}

// ═══════════════════════════════════════════
// СОБАЧКА — ПЛАВАЕТ, КИДАЕТСЯ, ГЛАДИТСЯ
// ═══════════════════════════════════════════
function initDogBoat() {
    const dogBoat = document.getElementById('dogBoat');
    const gallery = document.querySelector('.gallery');
    if (!dogBoat || !gallery) return;

    let isDragging = false, startX, startY, prevX, prevY, velocityX = 0, velocityY = 0;
    let animId, startLeft, startTop;
    let petCount = 0;

    function setPos(x, y) {
        const rect = gallery.getBoundingClientRect();
        x = Math.max(30, Math.min(x, rect.width - 80));
        y = Math.max(50, Math.min(y, rect.height - 80));
        dogBoat.style.left = x + 'px';
        dogBoat.style.top = y + 'px';
        dogBoat.style.bottom = 'auto';
        dogBoat.style.transform = 'none';
    }

    function physics() {
        const rect = gallery.getBoundingClientRect();
        let x = parseFloat(dogBoat.style.left) || rect.width / 2;
        let y = parseFloat(dogBoat.style.top) || rect.height * 0.7;

        x += velocityX;
        y += velocityY;
        velocityX *= 0.93;
        velocityY *= 0.93;

        if (x <= 30) { x = 30; velocityX = Math.abs(velocityX) * 0.3; }
        if (x >= rect.width - 80) { x = rect.width - 80; velocityX = -Math.abs(velocityX) * 0.3; }
        if (y <= 50) { y = 50; velocityY = Math.abs(velocityY) * 0.3; }
        if (y >= rect.height - 80) { y = rect.height - 80; velocityY = -Math.abs(velocityY) * 0.3; }

        dogBoat.style.left = x + 'px';
        dogBoat.style.top = y + 'px';
        dogBoat.style.transform = 'none';

        if (Math.abs(velocityX) > 0.08 || Math.abs(velocityY) > 0.08) {
            animId = requestAnimationFrame(physics);
        }
    }

    dogBoat.addEventListener('mousedown', function(e) {
        isDragging = true;
        cancelAnimationFrame(animId);
        prevX = e.clientX; prevY = e.clientY;
        startX = e.clientX; startY = e.clientY;
        const rect = dogBoat.getBoundingClientRect();
        startLeft = rect.left; startTop = rect.top;
        dogBoat.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const gr = gallery.getBoundingClientRect();
        setPos(e.clientX - gr.left - 40, e.clientY - gr.top - 30);
        prevX = e.clientX; prevY = e.clientY;
    });

    document.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        isDragging = false;
        dogBoat.style.cursor = 'grab';
        velocityX = (e.clientX - prevX) * 6;
        velocityY = (e.clientY - prevY) * 6;
        physics();
    });

    // Тач
    dogBoat.addEventListener('touchstart', function(e) {
        isDragging = true;
        cancelAnimationFrame(animId);
        const t = e.touches[0];
        prevX = t.clientX; prevY = t.clientY;
        startX = t.clientX; startY = t.clientY;
        const rect = dogBoat.getBoundingClientRect();
        startLeft = rect.left; startTop = rect.top;
    }, { passive: false });

    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        const t = e.touches[0];
        const gr = gallery.getBoundingClientRect();
        setPos(t.clientX - gr.left - 40, t.clientY - gr.top - 30);
        prevX = t.clientX; prevY = t.clientY;
    }, { passive: false });

    document.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        isDragging = false;
        const t = e.changedTouches[0];
        velocityX = (t.clientX - prevX) * 4;
        velocityY = (t.clientY - prevY) * 4;
        physics();
    });

    // Двойной клик — погладить
    dogBoat.addEventListener('dblclick', function(e) {
        e.preventDefault();
        e.stopPropagation();
        petCount++;
        dogBoat.classList.add('petted');
        setTimeout(() => dogBoat.classList.remove('petted'), 600);

        const rect = dogBoat.getBoundingClientRect();
        for (let i = 0; i < 6; i++) {
            const heart = document.createElement('div');
            heart.className = 'dog-heart';
            heart.textContent = ['❤️', '💕', '💖', '🦴', '✨', '🐾'][i];
            heart.style.position = 'fixed';
            heart.style.left = (rect.left + rect.width / 2 - 15 + (Math.random() - 0.5) * 50) + 'px';
            heart.style.top = (rect.top + (Math.random() - 0.5) * 30) + 'px';
            heart.style.fontSize = '20px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '9999';
            heart.style.animation = 'heartFly 1s forwards';
            heart.style.animationDelay = i * 0.1 + 's';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 1200);
        }

        if (petCount % 3 === 0) {
            const bark = document.createElement('div');
            bark.textContent = 'Гав! 🐕';
            const br = dogBoat.getBoundingClientRect();
            bark.style.cssText = `
                position:fixed; left:${br.left + br.width/2 - 30}px; top:${br.top - 30}px;
                font-size:16px; z-index:9999; pointer-events:none;
                animation: barkUp 1.2s forwards;
            `;
            document.body.appendChild(bark);
            setTimeout(() => bark.remove(), 1300);
        }
    });

    // Авто-плавание
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
// ПУЗЫРИ (просто красивые)
// ═══════════════════════════════════════════
function initBubbleGame() {
    const canvas = document.getElementById('bubbleCanvas');
    const section = document.getElementById('certificates');
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const bubbles = [];
    let popCount = 0;
    const maxBubbles = 22;

    function createBubble(fromBottom = false) {
        return {
            x: Math.random() * canvas.width,
            y: fromBottom ? canvas.height + 40 : Math.random() * canvas.height,
            size: 8 + Math.random() * 22,
            speed: 0.3 + Math.random() * 0.9,
            opacity: 0.18 + Math.random() * 0.2,
            hue: 185 + Math.random() * 30,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.006 + Math.random() * 0.02,
            popped: false,
            popAnim: 0,
            pieces: [],
            popStartTime: 0
        };
    }

    for (let i = 0; i < maxBubbles; i++) bubbles.push(createBubble());

    function popBubble(b) {
        if (b.popped) return;
        b.popped = true;
        b.popAnim = 0;
        b.popStartTime = performance.now();
        b.pieces = [];
        const pieceCount = 8;
        for (let i = 0; i < pieceCount; i++) {
            const angle = (Math.PI * 2 / pieceCount) * i;
            b.pieces.push({
                x: b.x, y: b.y,
                vx: Math.cos(angle) * (2 + Math.random() * 4),
                vy: Math.sin(angle) * (2 + Math.random() * 4),
                size: b.size * (0.1 + Math.random() * 0.2),
                life: 1
            });
        }
        popCount++;
        const el = document.getElementById('bubbleCount');
        if (el) el.textContent = popCount;

        if (popCount % 20 === 0 && window.triggerTsunami) {
            window.triggerTsunami();
            const a = document.getElementById('tsunamiAlert');
            if (a) { a.classList.add('show'); setTimeout(() => a.classList.remove('show'), 2000); }
        }
    }

    function drawBubbles() {
        const now = performance.now();

        bubbles.forEach(b => {
            if (b.popped) {
                const elapsed = (now - b.popStartTime) / 1000;
                if (elapsed > 1.5) {
                    Object.assign(b, createBubble(true));
                    return;
                }
                b.pieces.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.1;
                    p.life = Math.max(0, 1 - elapsed / 1.5);
                    if (p.life > 0) {
                        ctx.fillStyle = `rgba(120,200,255,${p.life * 0.7})`;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
                return;
            }

            b.y -= b.speed;
            b.x += Math.sin(b.wobble) * 0.5;
            b.wobble += b.wobbleSpeed;
            if (b.y < -50) Object.assign(b, createBubble(true));

            const gradient = ctx.createRadialGradient(
                b.x - b.size * 0.25, b.y - b.size * 0.3, b.size * 0.05,
                b.x, b.y, b.size
            );
            gradient.addColorStop(0, `hsla(${b.hue}, 50%, 85%, ${b.opacity + 0.2})`);
            gradient.addColorStop(0.6, `hsla(${b.hue}, 50%, 60%, ${b.opacity + 0.1})`);
            gradient.addColorStop(1, `hsla(${b.hue}, 45%, 40%, ${b.opacity * 0.5})`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = `rgba(255,255,255,${b.opacity * 0.35})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = `rgba(255,255,255,${b.opacity * 0.5})`;
            ctx.beginPath();
            ctx.arc(b.x - b.size * 0.2, b.y - b.size * 0.25, b.size * 0.18, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        for (let i = 0; i < bubbles.length; i++) {
            if (!bubbles[i].popped && Math.hypot(mx - bubbles[i].x, my - bubbles[i].y) < bubbles[i].size) {
                popBubble(bubbles[i]);
            }
        }
    });

    function animate() {
        if (!canvas.isConnected) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBubbles();
        requestAnimationFrame(animate);
    }
    animate();
}

// Дополнительные стили
const extraStyles = document.createElement('style');
extraStyles.textContent = `
    @keyframes heartFly { 0% { opacity:1; transform:translateY(0) scale(1); } 100% { opacity:0; transform:translateY(-70px) scale(1.6); } }
    @keyframes barkUp { 0% { opacity:1; transform:translateY(0); } 100% { opacity:0; transform:translateY(-50px); } }
    @keyframes popIn { from { transform:translate(-50%,-50%) scale(0.8); opacity:0; } to { transform:translate(-50%,-50%) scale(1); opacity:1; } }
    .cert-popup-close { position:absolute; top:8px; right:12px; font-size:22px; cursor:pointer; color:#999; }
    .cert-popup-close:hover { color:red; }
`;
document.head.appendChild(extraStyles);

// ═══════════════════════════════════════════
// ФИЛЬТР СЕРТИФИКАТОВ (для пузырей)
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active'));
        this.classList.add('active');
    }));
});

// ═══════════════════════════════════════════
// КЛИК ПО СЕРТИФИКАТАМ — ОТКРЫТЬ В ПРОСМОТРЩИКЕ
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    const certGrid = document.getElementById('certificatesGrid');
    if (!certGrid) return;

    certGrid.addEventListener('click', function(e) {
        const item = e.target.closest('.certificate-item');
        if (!item) return;

        const img = item.querySelector('img');
        if (!img) return;

        const viewer = document.getElementById('imageViewer');
        const vImg = document.getElementById('viewerImage');
        const vCap = document.getElementById('viewerCaption');
        if (!viewer || !vImg) return;

        vImg.src = img.getAttribute('data-full') || img.src;
        vCap.textContent = img.alt || '';
        viewer.style.display = 'block';
        document.body.style.overflow = 'hidden';
        vImg.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

// ═══════════════════════════════════════════
// ПРОСМОТРЩИК ФОТО ГАЛЕРЕИ
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    const viewer = document.getElementById('imageViewer');
    const vImg = document.getElementById('viewerImage');
    const vCap = document.getElementById('viewerCaption');
    const closeBtn = document.getElementById('closeViewer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (!viewer || !vImg) return;

    let allItems = [], curIdx = 0, zoomLevel = 1;

    function getVisibleItems() {
        return Array.from(document.querySelectorAll('#galleryGrid .gallery-item'))
            .filter(i => window.getComputedStyle(i).display !== 'none');
    }

    function resetZoom() { zoomLevel = 1; vImg.style.transform = 'translate(-50%, -50%) scale(1)'; }

    function openViewer(imgEl, idx) {
        allItems = getVisibleItems(); curIdx = idx;
        const img = imgEl.querySelector('img') || imgEl;
        vImg.src = img.getAttribute('data-full') || img.src;
        vCap.textContent = img.alt || '';
        viewer.style.display = 'block'; document.body.style.overflow = 'hidden';
        resetZoom();
    }

    function closeViewer() { viewer.style.display = 'none'; document.body.style.overflow = 'auto'; }

    function navigate(dir) {
        allItems = getVisibleItems();
        if (allItems.length === 0) return;
        curIdx = (curIdx + dir + allItems.length) % allItems.length;
        const item = allItems[curIdx], img = item.querySelector('img');
        vImg.src = img.getAttribute('data-full') || img.src;
        vCap.textContent = img.alt || '';
        resetZoom();
    }

    document.getElementById('zoomInBtn')?.addEventListener('click', e => {
        e.stopPropagation(); if (zoomLevel < 3) { zoomLevel += 0.2; vImg.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`; }
    });
    document.getElementById('zoomOutBtn')?.addEventListener('click', e => {
        e.stopPropagation(); if (zoomLevel > 0.5) { zoomLevel -= 0.2; vImg.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`; }
    });
    document.getElementById('resetZoomBtn')?.addEventListener('click', e => {
        e.stopPropagation(); resetZoom();
    });

    document.getElementById('galleryGrid')?.addEventListener('click', function(e) {
        const item = e.target.closest('.gallery-item');
        if (item) openViewer(item, Array.from(this.querySelectorAll('.gallery-item')).indexOf(item));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeViewer);
    viewer.addEventListener('click', e => { if (e.target === viewer) closeViewer(); });
    if (prevBtn) prevBtn.addEventListener('click', e => { e.stopPropagation(); navigate(-1); });
    if (nextBtn) nextBtn.addEventListener('click', e => { e.stopPropagation(); navigate(1); });

    document.addEventListener('keydown', e => {
        if (viewer.style.display === 'block') {
            if (e.key === 'Escape') closeViewer();
            if (e.key === 'ArrowRight') navigate(1);
            if (e.key === 'ArrowLeft') navigate(-1);
        }
    });
});


// ═══════════════════════════════════════════
// МУЗЫКАЛЬНЫЙ ПЛЕЕР + АУДИО-АНАЛИЗ
// ═══════════════════════════════════════════
let audioCtx, analyser, audioSource, bassLevel = 0;
let musicPlaylist = [];
let currentTrack = 0;
let isMusicPlaying = false;

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
        if (!audioCtx) initAudioContext();
        musicAudio.play();
        isMusicPlaying = true;
        musicToggle.textContent = '🔊';
    }
}

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        audioSource = audioCtx.createMediaElementSource(musicAudio);
        audioSource.connect(analyser);
        analyser.connect(audioCtx.destination);
    }
}

function getBassLevel() {
    if (!analyser) return 0;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    let bass = 0;
    for (let i = 0; i < 8; i++) bass += data[i];
    return bass / 8 / 255;
}

// Обновляем воду под музыку
setInterval(() => {
    if (isMusicPlaying && analyser) {
        bassLevel = getBassLevel();
        // Вода реагирует на бас
        if (window.tsunamiHeight !== undefined) {
            window.tsunamiHeight = Math.max(window.tsunamiHeight || 0, bassLevel * 40);
        }
    }
}, 50);

// Собачка качается под музыку
setInterval(() => {
    const dog = document.getElementById('dogBoat');
    if (dog && isMusicPlaying && bassLevel > 0) {
        const bounce = bassLevel * 15;
        const currentTop = parseFloat(dog.style.top) || 0;
        dog.style.transition = 'top 0.1s ease';
        dog.style.top = (currentTop - bounce * 0.3) + 'px';
        setTimeout(() => {
            dog.style.top = (currentTop + bounce * 0.3) + 'px';
        }, 50);
    }
}, 100);

// События плеера
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

// Загружаем плейлист при старте
window.addEventListener('load', () => {
    setTimeout(loadMusicPlaylist, 1000);
});

// ═══════════════════════════════════════════
// ЗАПУСК
// ═══════════════════════════════════════════
window.addEventListener('load', () => {
    initTypingEffect();
    initParticles();
    initWaterfallGame();
    initDogBoat();
    initBubbleGame();
});
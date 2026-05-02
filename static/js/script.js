// ТЕМНАЯ ТЕМА
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') { document.body.classList.add('dark-theme'); if (themeIcon) themeIcon.classList.replace('fa-moon','fa-sun'); }
if (themeToggle) themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) { if (themeIcon) themeIcon.classList.replace('fa-moon','fa-sun'); localStorage.setItem('theme','dark'); }
    else { if (themeIcon) themeIcon.classList.replace('fa-sun','fa-moon'); localStorage.setItem('theme','light'); }
});

// ПЕЧАТАЮЩИЙСЯ ТЕКСТ
function initTypingEffect() {
    const el = document.getElementById('typingText'); if (!el) return;
    const texts = ["стать Full-Stack разработчиком","создать инновационные продукты","работать в IT-компании мечты","участвовать в крупных проектах","непрерывно развиваться в IT"];
    let ti=0, ci=0, del=false, sp=100;
    function type() {
        const t = texts[ti];
        el.textContent = del ? t.substring(0,ci-1) : t.substring(0,ci+1);
        if (del) { ci--; sp=50; } else { ci++; sp=100; }
        if (!del && ci===t.length) { del=true; sp=1500; }
        else if (del && ci===0) { del=false; ti=(ti+1)%texts.length; sp=500; }
        setTimeout(type,sp);
    }
    setTimeout(type,1000);
}

// АНИМАЦИИ ПРИ ПРОКРУТКЕ
function animateOnScroll() {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight-150) {
            el.classList.add('animated');
            if (el.id === 'about') setTimeout(() => { animateProgressBars(); animateCounters(); animateTechBars(); }, 300);
        }
    });
}
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// Мобильное меню
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
if (mobileMenuBtn && navMenu) mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuBtn.innerHTML = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});
document.querySelectorAll('nav ul li a').forEach(l => l.addEventListener('click', () => { if(navMenu) navMenu.classList.remove('active'); if(mobileMenuBtn) mobileMenuBtn.innerHTML='<i class="fas fa-bars"></i>'; }));

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', function(e) {
    e.preventDefault(); const t=document.querySelector(this.getAttribute('href')); if(t) window.scrollTo({top:t.offsetTop-80,behavior:'smooth'});
}));

// Кнопка Вверх
const scrollBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', () => { if(scrollBtn) scrollBtn.classList.toggle('visible', window.pageYOffset>300); });
if(scrollBtn) scrollBtn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

// Анимация прогресс-баров навыков
function animateProgressBars() {
    const bars = {officeProgress:80,photoshopProgress:75,inkscapeProgress:65,pythonProgress:20,gimpProgress:35,englishProgress:50,aiProgress:70};
    for (const [id,w] of Object.entries(bars)) { const el=document.getElementById(id); if(el) el.style.width=w+'%'; }
}

// Анимация тех-стека
function animateTechBars() {
    document.querySelectorAll('.percentage-fill[data-width]').forEach(el => {
        el.style.width = el.getAttribute('data-width') + '%';
    });
}

// Анимация счетчиков
function animateCounters() {
    document.querySelectorAll('.counter').forEach(c => {
        const t=+c.getAttribute('data-target'), cur=+c.innerText, inc=t/200;
        if(cur<t) { const upd=()=>{ const n=+c.innerText; if(n<t){ c.innerText=Math.ceil(n+inc); setTimeout(upd,10); } else c.innerText=t; }; upd(); }
    });
}

// ЧАСТИЦЫ
function initParticles() {
    const sec=document.getElementById('about'); if(!sec||document.getElementById('particles-canvas')) return;
    const cont=document.getElementById('particles-js'); if(!cont) return;
    const canvas=document.createElement('canvas'); canvas.id='particles-canvas'; cont.appendChild(canvas);
    const ctx=canvas.getContext('2d');
    function resize() { canvas.width=cont.offsetWidth; canvas.height=cont.offsetHeight; }
    resize(); window.addEventListener('resize',resize);
    const digits=['0','1'], particles=[];
    for(let i=0;i<60;i++) particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,size:Math.random()*12+8,speed:Math.random()*0.4+0.1,digit:digits[Math.floor(Math.random()*2)],opacity:Math.random()*0.25+0.05,dir:Math.random()*Math.PI*2});
    function draw() {
        if(!canvas.isConnected) return;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        particles.forEach(p=>{
            p.x+=Math.cos(p.dir)*p.speed; p.y+=Math.sin(p.dir)*p.speed;
            if(p.x<-20)p.x=canvas.width+20; if(p.x>canvas.width+20)p.x=-20;
            if(p.y<-20)p.y=canvas.height+20; if(p.y>canvas.height+20)p.y=-20;
            ctx.fillStyle=`rgba(0,163,54,${p.opacity})`; ctx.font=`${p.size}px 'Courier New',monospace`;
            ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(p.digit,p.x,p.y);
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// ФИЛЬТР СЕРТИФИКАТОВ
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));
        this.classList.add('active');
        const c=this.getAttribute('data-course');
        document.querySelectorAll('.certificate-item').forEach(i => i.style.display=(c==='all'||i.getAttribute('data-course')===c)?'block':'none');
    }));
});

// ПРОСМОТРЩИК ФОТО С ЛИСТАНИЕМ И ЗУМОМ
document.addEventListener('DOMContentLoaded', () => {
    const viewer=document.getElementById('imageViewer');
    const vImg=document.getElementById('viewerImage');
    const vCap=document.getElementById('viewerCaption');
    const closeBtn=document.getElementById('closeViewer');
    const prevBtn=document.getElementById('prevBtn');
    const nextBtn=document.getElementById('nextBtn');
    if(!viewer||!vImg) return;

    let allItems=[], curIdx=0, zoomLevel=1;

    function getVisibleItems() {
        const gallery = document.querySelectorAll('#galleryGrid .gallery-item');
        const certs = document.querySelectorAll('#certificatesGrid .certificate-item');
        const g = Array.from(gallery).filter(i => window.getComputedStyle(i).display !== 'none');
        const c = Array.from(certs).filter(i => window.getComputedStyle(i).display !== 'none');
        return [...g, ...c];
    }

    function resetZoom() { zoomLevel=1; vImg.style.transform='translate(-50%, -50%) scale(1)'; }

    function openViewer(imgEl, idx) {
        allItems=getVisibleItems(); curIdx=idx;
        const img=imgEl.querySelector('img')||imgEl;
        vImg.src=img.getAttribute('data-full')||img.src;
        vCap.textContent=img.alt||'';
        viewer.style.display='block'; document.body.style.overflow='hidden';
        resetZoom();
    }

    function closeViewer() { viewer.style.display='none'; document.body.style.overflow='auto'; }
    function navigate(dir) {
        allItems=getVisibleItems(); if(allItems.length===0) return;
        curIdx=(curIdx+dir+allItems.length)%allItems.length;
        const item=allItems[curIdx], img=item.querySelector('img');
        vImg.src=img.getAttribute('data-full')||img.src;
        vCap.textContent=img.alt||'';
        resetZoom();
    }

    // Зум
    document.getElementById('zoomInBtn')?.addEventListener('click', e => {
        e.stopPropagation(); if(zoomLevel<3){ zoomLevel+=0.2; vImg.style.transform=`translate(-50%, -50%) scale(${zoomLevel})`; }
    });
    document.getElementById('zoomOutBtn')?.addEventListener('click', e => {
        e.stopPropagation(); if(zoomLevel>0.5){ zoomLevel-=0.2; vImg.style.transform=`translate(-50%, -50%) scale(${zoomLevel})`; }
    });
    document.getElementById('resetZoomBtn')?.addEventListener('click', e => {
        e.stopPropagation(); resetZoom();
    });

    // Клик по галерее
    document.getElementById('galleryGrid')?.addEventListener('click', function(e) {
        const item=e.target.closest('.gallery-item'); if(item) openViewer(item, Array.from(this.querySelectorAll('.gallery-item')).indexOf(item));
    });
    // Клик по сертификатам
    document.getElementById('certificatesGrid')?.addEventListener('click', function(e) {
        const item=e.target.closest('.certificate-item'); if(item) openViewer(item, getVisibleItems().indexOf(item));
    });

    if(closeBtn) closeBtn.addEventListener('click', closeViewer);
    viewer.addEventListener('click', e => { if(e.target===viewer) closeViewer(); });
    if(prevBtn) prevBtn.addEventListener('click', e => { e.stopPropagation(); navigate(-1); });
    if(nextBtn) nextBtn.addEventListener('click', e => { e.stopPropagation(); navigate(1); });
    document.addEventListener('keydown', e => {
        if(viewer.style.display==='block') {
            if(e.key==='Escape') closeViewer();
            if(e.key==='ArrowRight') navigate(1);
            if(e.key==='ArrowLeft') navigate(-1);
        }
    });
});

// Запуск
window.addEventListener('load', () => {
    setTimeout(initTypingEffect,500);
    setTimeout(initParticles,800);
    animateOnScroll();
});
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
    
    // Собираем данные из тех-стека
    const catData = {};
    document.querySelectorAll('.tech-category').forEach(cat => {
        const name = cat.querySelector('h4').textContent;
        const percents = [];
        cat.querySelectorAll('.skill-percentage').forEach(sp => {
            percents.push(parseInt(sp.textContent));
        });
        if (percents.length > 0) {
            catData[name] = Math.round(percents.reduce((a,b) => a+b, 0) / percents.length);
        }
    });
    
    const items = Object.entries(catData);
    if (items.length === 0) return;
    
    const colors = ['#00a336', '#00d44c', '#4dabf7', '#ffd700', '#ff6b6b', '#a29bfe', '#fd79a8', '#00cec9'];
    const total = items.reduce((s, [,v]) => s + v, 0);
    let angle = -Math.PI / 2;
    
    // Легенда
    let legend = '';
    
    ctx.clearRect(0, 0, size, size);
    
    items.forEach(([name, value], i) => {
        const slice = (value / total) * 2 * Math.PI;
        const color = colors[i % colors.length];
        
        // Сектор
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, angle, angle + slice);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Процент внутри сектора (только если сектор достаточно большой)
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
        
        // Легенда
       legend += `<div style="display:flex;align-items:flex-start;margin-bottom:8px;gap:8px;">
    <span style="background:${color};min-width:14px;width:14px;height:14px;border-radius:3px;display:inline-block;margin-top:2px;flex-shrink:0;"></span>
    <span style="font-size:13px;line-height:1.4;color:var(--text-color);">${name} — <strong>${value}%</strong></span>
</div>`;
        
        angle += slice;
    });
    
    // Круг в центре (пончик)
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.45, 0, 2 * Math.PI);
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--card-bg').trim() || '#fff';
    ctx.fill();
    
    const legendEl = document.getElementById('chartLegend');
    if (legendEl) legendEl.innerHTML = legend;
}

// Запускаем при загрузке
window.addEventListener('load', () => {
    setTimeout(drawSkillsChart, 1000);
});

// Обновляем при скролле
let chartDrawn = false;
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
    const maxDrops = 70;
    
    function createDrop(side) {
        return {
            x: side === 'left' ? canvas.width * 0.08 + (Math.random() - 0.5) * 40 :
                canvas.width * 0.92 + (Math.random() - 0.5) * 40,
            y: Math.random() * canvas.height * 0.4,
            speed: 1.5 + Math.random() * 3,
            size: 2 + Math.random() * 4,
            opacity: 0.25 + Math.random() * 0.45,
            splashed: false
        };
    }
    
    for (let i = 0; i < maxDrops; i++) {
        leftWaterfall.push(createDrop('left'));
        rightWaterfall.push(createDrop('right'));
    }
    
    let waveOffset = 0;
    let tsunamiHeight = 0;
    window.currentTsunami = 0;
    
    function drawRiverWaves() {
        const riverY = canvas.height * 0.78 + tsunamiHeight * 0.3;
        const waveHeight = 12 + tsunamiHeight * 0.5;
        
        for (let x = 0; x < canvas.width; x += 2) {
            const y = riverY + Math.sin((x + waveOffset) / 150) * waveHeight +
                      Math.cos((x - waveOffset * 0.7) / 100) * waveHeight * 0.6;
            const alpha = 0.12 + Math.abs(Math.sin((x + waveOffset) / 150)) * 0.12;
            ctx.fillStyle = `rgba(0, 180, 220, ${alpha})`;
            ctx.fillRect(x, y, 4, 3);
        }
    }
    
    function drawWaterfall(particles, x, width) {
        particles.forEach((p) => {
            p.y += p.speed;
            if (p.y > canvas.height * 0.78 && !p.splashed) {
                p.splashed = true;
                for (let s = 0; s < 4; s++) {
                    riverDrops.push({
                        x: x + (Math.random() - 0.5) * width,
                        y: canvas.height * 0.78,
                        vx: (Math.random() - 0.5) * 4,
                        vy: -Math.random() * 6,
                        life: 1,
                        size: 2 + Math.random() * 3
                    });
                }
                p.y = Math.random() * canvas.height * 0.3;
                p.splashed = false;
            }
            ctx.fillStyle = `rgba(0, 180, 230, ${p.opacity})`;
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.size, p.size * 1.6, 0, 0, Math.PI * 2);
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
                ctx.fillStyle = `rgba(255, 255, 255, ${d.life * 0.6})`;
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
        ctx.fillStyle = 'rgba(60, 65, 70, 0.25)';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.05);
        ctx.lineTo(canvas.width * 0.12, canvas.height * 0.15);
        ctx.lineTo(canvas.width * 0.1, canvas.height * 0.85);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(canvas.width, canvas.height * 0.05);
        ctx.lineTo(canvas.width * 0.88, canvas.height * 0.15);
        ctx.lineTo(canvas.width * 0.9, canvas.height * 0.85);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
    }
    
    function animate() {
        if (!canvas.isConnected) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRocks();
        drawWaterfall(leftWaterfall, canvas.width * 0.08, 40);
        drawWaterfall(rightWaterfall, canvas.width * 0.92, 40);
        drawRiverWaves();
        drawRiverSplashes();
        
        if (tsunamiHeight > 0) tsunamiHeight *= 0.95;
        if (tsunamiHeight < 0.5) tsunamiHeight = 0;
        
        waveOffset += 1.2;
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Цунами!
    window.triggerTsunami = function() {
        tsunamiHeight = 80;
        setTimeout(() => {
            const wave = document.getElementById('tsunamiWave');
            if (wave) {
                wave.style.height = '150px';
                setTimeout(() => wave.style.height = '0', 1000);
            }
        }, 300);
    };
}

// ═══════════════════════════════════════════
// СОБАЧКА — КИДАЕТСЯ С ФИЗИКОЙ
// ═══════════════════════════════════════════

function initDogBoat() {
    const dogBoat = document.getElementById('dogBoat');
    const gallery = document.querySelector('.gallery');
    if (!dogBoat || !gallery) return;
    
    let isDragging = false, startX, startY, prevX, prevY, velocityX = 0, velocityY = 0;
    let animId, startLeft, startTop;
    
    function setPos(x, y) {
        const rect = gallery.getBoundingClientRect();
        x = Math.max(40, Math.min(x, rect.width - 90));
        y = Math.max(40, Math.min(y, rect.height - 100));
        dogBoat.style.left = x + 'px';
        dogBoat.style.top = y + 'px';
        dogBoat.style.bottom = 'auto';
        dogBoat.style.transform = 'none';
    }
    
    function physics() {
        const rect = gallery.getBoundingClientRect();
        let x = parseFloat(dogBoat.style.left) || rect.width / 2;
        let y = parseFloat(dogBoat.style.top) || rect.height - 100;
        
        x += velocityX;
        y += velocityY;
        velocityX *= 0.92;
        velocityY *= 0.92;
        
        if (x <= 40) { x = 40; velocityX = Math.abs(velocityX) * 0.4; }
        if (x >= rect.width - 90) { x = rect.width - 90; velocityX = -Math.abs(velocityX) * 0.4; }
        if (y <= 40) { y = 40; velocityY = Math.abs(velocityY) * 0.4; }
        if (y >= rect.height - 100) { y = rect.height - 100; velocityY = -Math.abs(velocityY) * 0.4; }
        
        dogBoat.style.left = x + 'px';
        dogBoat.style.top = y + 'px';
        dogBoat.style.transform = 'none';
        
        if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
            animId = requestAnimationFrame(physics);
        } else {
            dogBoat.classList.remove('thrown');
        }
    }
    
    dogBoat.addEventListener('mousedown', function(e) {
        isDragging = true;
        dogBoat.classList.add('thrown');
        cancelAnimationFrame(animId);
        prevX = e.clientX;
        prevY = e.clientY;
        startX = e.clientX;
        startY = e.clientY;
        const rect = dogBoat.getBoundingClientRect();
        startLeft = parseFloat(dogBoat.style.left) || rect.left;
        startTop = parseFloat(dogBoat.style.top) || rect.top;
        dogBoat.style.cursor = 'grabbing';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        setPos(startLeft + e.clientX - startX, startTop + e.clientY - startY);
        prevX = e.clientX;
        prevY = e.clientY;
    });
    
    document.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        isDragging = false;
        dogBoat.style.cursor = 'grab';
        velocityX = (e.clientX - prevX) * 5;
        velocityY = (e.clientY - prevY) * 5;
        physics();
    });
    
    // Двойной клик — погладить с сердечками
    dogBoat.addEventListener('dblclick', function(e) {
        e.preventDefault();
        dogBoat.classList.add('petted');
        setTimeout(() => dogBoat.classList.remove('petted'), 600);
        const rect = dogBoat.getBoundingClientRect();
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('div');
            heart.className = 'dog-heart';
            heart.textContent = ['❤️','💕','💖','🦴','✨'][i];
            heart.style.left = (rect.left + rect.width/2 - 15 + (Math.random()-0.5)*40) + 'px';
            heart.style.top = (rect.top + (Math.random()-0.5)*20) + 'px';
            heart.style.animationDelay = i * 0.1 + 's';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 1200);
        }
    });
    
    // Авто-плавание
    let autoAngle = 0;
    setInterval(() => {
        if (!isDragging && (!animId || Math.abs(velocityX) < 0.1)) {
            autoAngle += 0.015;
            const rect = gallery.getBoundingClientRect();
            setPos(rect.width/2 + Math.sin(autoAngle)*60, rect.height - 95 + Math.cos(autoAngle*0.7)*20);
        }
    }, 50);
    
    const rect = gallery.getBoundingClientRect();
    setPos(rect.width/2, rect.height - 95);
}

// ═══════════════════════════════════════════
// ПУЗЫРИ — МЕДЛЕННЕЕ, МЕНЬШЕ, КРАСИВЕЕ
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
    const maxBubbles = 22;
    let popCount = 0;
    
    function createBubble(fromBottom = false) {
        return {
            x: Math.random() * canvas.width,
            y: fromBottom ? canvas.height + 30 : Math.random() * canvas.height,
            size: 6 + Math.random() * 18,
            speed: 0.4 + Math.random() * 1.2,
            opacity: 0.2 + Math.random() * 0.25,
            hue: 185 + Math.random() * 35,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.01 + Math.random() * 0.03,
            popped: false,
            popAnim: 0
        };
    }
    
    for (let i = 0; i < maxBubbles; i++) {
        bubbles.push(createBubble());
    }
    
    function drawBubbles() {
        bubbles.forEach(b => {
            if (b.popped) {
                b.popAnim += 0.06;
                if (b.popAnim > 1) {
                    Object.assign(b, createBubble(true));
                    b.popped = false;
                    b.popAnim = 0;
                }
                // Анимация лопанья
                ctx.strokeStyle = `rgba(120,200,255,${1-b.popAnim})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.size * (1 + b.popAnim * 2), 0, Math.PI * 2);
                ctx.stroke();
                return;
            }
            
            b.y -= b.speed;
            b.x += Math.sin(b.wobble) * 0.5;
            b.wobble += b.wobbleSpeed;
            
            if (b.y < -40) Object.assign(b, createBubble(true));
            
            const gradient = ctx.createRadialGradient(
                b.x - b.size*0.3, b.y - b.size*0.3, b.size*0.1,
                b.x, b.y, b.size
            );
            gradient.addColorStop(0, `hsla(${b.hue}, 60%, 80%, ${b.opacity+0.15})`);
            gradient.addColorStop(1, `hsla(${b.hue}, 60%, 55%, ${b.opacity})`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = `rgba(255,255,255,${b.opacity*0.5})`;
            ctx.beginPath();
            ctx.arc(b.x - b.size*0.3, b.y - b.size*0.3, b.size*0.25, 0, Math.PI*2);
            ctx.fill();
        });
    }
    
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        bubbles.forEach(b => {
            if (!b.popped && Math.hypot(mx - b.x, my - b.y) < b.size + 6) {
                b.popped = true;
                popCount++;
                document.getElementById('bubbleCount').textContent = popCount;
                if (popCount % 20 === 0 && window.triggerTsunami) {
                    window.triggerTsunami();
                    const alert = document.getElementById('tsunamiAlert');
                    if (alert) { alert.classList.add('show'); setTimeout(() => alert.classList.remove('show'), 2000); }
                }
            }
        });
    });
    
    function animate() {
        if (!canvas.isConnected) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBubbles();
        requestAnimationFrame(animate);
    }
    animate();
}

// Запуск
window.addEventListener('load', () => {
    initWaterfallGame();
    initDogBoat();
    initBubbleGame();
});
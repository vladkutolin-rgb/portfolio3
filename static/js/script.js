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
// ВОДОПАДЫ + РЕКА + СОБАЧКА В ЛОДКЕ
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
    
    // Частицы водопада
    const leftWaterfall = [];
    const rightWaterfall = [];
    const riverDrops = [];
    const maxDrops = 80;
    
    function createDrop(side) {
        return {
            x: side === 'left' ? canvas.width * 0.08 + (Math.random() - 0.5) * 40 :
                canvas.width * 0.92 + (Math.random() - 0.5) * 40,
            y: Math.random() * canvas.height * 0.4,
            speed: 2 + Math.random() * 4,
            size: 2 + Math.random() * 4,
            opacity: 0.3 + Math.random() * 0.5,
            splashed: false
        };
    }
    
    // Инициализация капель
    for (let i = 0; i < maxDrops; i++) {
        leftWaterfall.push(createDrop('left'));
        rightWaterfall.push(createDrop('right'));
    }
    
    // Волны реки
    let waveOffset = 0;
    
    function drawRiverWaves() {
        const riverY = canvas.height * 0.75;
        const waveHeight = 12;
        const waveLength = 150;
        
        for (let x = 0; x < canvas.width; x += 2) {
            const y = riverY + Math.sin((x + waveOffset) / waveLength) * waveHeight +
                      Math.cos((x - waveOffset * 0.7) / 100) * waveHeight * 0.6;
            
            const alpha = 0.15 + Math.abs(Math.sin((x + waveOffset) / waveLength)) * 0.15;
            
            ctx.fillStyle = `rgba(0, 180, 220, ${alpha})`;
            ctx.fillRect(x, y, 4, 2);
        }
        
        // Отражения на реке
        for (let i = 0; i < 5; i++) {
            const rx = (waveOffset * 2 + i * canvas.width / 5) % canvas.width;
            const ry = riverY + 20 + Math.sin(rx / 80 + waveOffset / 50) * 8;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.beginPath();
            ctx.arc(rx, ry, 4 + Math.random() * 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function drawWaterfall(particles, x, width) {
        particles.forEach((p, i) => {
            p.y += p.speed;
            
            // Когда достигает реки — разбрызгивается
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
            
            // Рисуем каплю
            ctx.fillStyle = `rgba(0, 180, 230, ${p.opacity})`;
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.size, p.size * 1.6, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Блик
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.6})`;
            ctx.beginPath();
            ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.5, p.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Верхний туман водопада
        const gradient = ctx.createLinearGradient(x - width/2, canvas.height * 0.1, x + width/2, canvas.height * 0.5);
        gradient.addColorStop(0, 'rgba(200, 230, 255, 0.15)');
        gradient.addColorStop(1, 'rgba(0, 180, 230, 0.05)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - width/2, canvas.height * 0.05, width, canvas.height * 0.5);
    }
    
    // Брызги реки
    function drawRiverSplashes() {
        riverDrops.forEach((d, i) => {
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
        
        // Удаляем мёртвые брызги
        for (let i = riverDrops.length - 1; i >= 0; i--) {
            if (riverDrops[i].life <= 0) riverDrops.splice(i, 1);
        }
    }
    
    // Скалы по бокам
    function drawRocks() {
        // Левая скала
        ctx.fillStyle = 'rgba(60, 65, 70, 0.3)';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.05);
        ctx.lineTo(canvas.width * 0.12, canvas.height * 0.15);
        ctx.lineTo(canvas.width * 0.1, canvas.height * 0.8);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
        
        // Правая скала
        ctx.beginPath();
        ctx.moveTo(canvas.width, canvas.height * 0.05);
        ctx.lineTo(canvas.width * 0.88, canvas.height * 0.15);
        ctx.lineTo(canvas.width * 0.9, canvas.height * 0.8);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
    }
    
    function animate() {
        if (!canvas.isConnected) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Скалы
        drawRocks();
        
        // Водопады
        drawWaterfall(leftWaterfall, canvas.width * 0.08, 40);
        drawWaterfall(rightWaterfall, canvas.width * 0.92, 40);
        
        // Река
        drawRiverWaves();
        drawRiverSplashes();
        
        waveOffset += 1.5;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ═══════════════════════════════════════════
// СОБАЧКА В ЛОДКЕ — ИНТЕРАКТИВ
// ═══════════════════════════════════════════

function initDogBoat() {
    const dogBoat = document.getElementById('dogBoat');
    const gallery = document.querySelector('.gallery');
    const heartBubble = document.getElementById('heartBubble');
    const petCount = document.getElementById('petCount');
    if (!dogBoat || !gallery) return;
    
    let isDragging = false;
    let offsetX, offsetY;
    let petClicks = 0;
    
    // Двойной клик — погладить
    dogBoat.addEventListener('dblclick', function(e) {
        e.preventDefault();
        petClicks++;
        petCount.textContent = petClicks;
        
        dogBoat.classList.add('petted');
        heartBubble.classList.add('show');
        
        setTimeout(() => {
            dogBoat.classList.remove('petted');
            heartBubble.classList.remove('show');
        }, 600);
        
        // Лабрадор лает!
        if (petClicks % 5 === 0) {
            const bark = document.createElement('div');
            bark.textContent = 'Гав! 🐕';
            bark.style.cssText = `
                position: absolute;
                top: -40px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 16px;
                z-index: 10;
                animation: barkUp 1s forwards;
                pointer-events: none;
            `;
            dogBoat.appendChild(bark);
            setTimeout(() => bark.remove(), 1000);
        }
    });
    
    // Перетаскивание
    dogBoat.addEventListener('mousedown', function(e) {
        isDragging = true;
        const rect = dogBoat.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        dogBoat.style.cursor = 'grabbing';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const galleryRect = gallery.getBoundingClientRect();
        let newX = e.clientX - galleryRect.left - offsetX;
        let newY = e.clientY - galleryRect.top - offsetY;
        
        // Ограничиваем рекой (нижняя часть)
        newX = Math.max(50, Math.min(newX, galleryRect.width - 100));
        newY = Math.max(galleryRect.height * 0.7, Math.min(newY, galleryRect.height - 100));
        
        dogBoat.style.left = newX + 'px';
        dogBoat.style.top = newY + 'px';
        dogBoat.style.bottom = 'auto';
        dogBoat.style.transform = 'none';
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
        dogBoat.style.cursor = 'grab';
    });
    
    // Тач для телефонов
    dogBoat.addEventListener('touchstart', function(e) {
        isDragging = true;
        const touch = e.touches[0];
        const rect = dogBoat.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        const touch = e.touches[0];
        const galleryRect = gallery.getBoundingClientRect();
        let newX = touch.clientX - galleryRect.left - offsetX;
        let newY = touch.clientY - galleryRect.top - offsetY;
        
        newX = Math.max(50, Math.min(newX, galleryRect.width - 100));
        newY = Math.max(galleryRect.height * 0.7, Math.min(newY, galleryRect.height - 100));
        
        dogBoat.style.left = newX + 'px';
        dogBoat.style.top = newY + 'px';
        dogBoat.style.bottom = 'auto';
        dogBoat.style.transform = 'none';
    });
    
    document.addEventListener('touchend', function() {
        isDragging = false;
    });
    
    // Авто-плавание
    let autoFloatAngle = 0;
    setInterval(() => {
        if (!isDragging) {
            autoFloatAngle += 0.02;
            const floatX = Math.sin(autoFloatAngle) * 40;
            const floatY = Math.cos(autoFloatAngle * 0.7) * 15;
            dogBoat.style.transform = `translate(${floatX}px, ${floatY}px)`;
        }
    }, 50);
}

// Добавляем стиль для лая
const barkStyle = document.createElement('style');
barkStyle.textContent = `
    @keyframes barkUp {
        0% { opacity: 1; top: -40px; }
        100% { opacity: 0; top: -80px; }
    }
`;
document.head.appendChild(barkStyle);

// Запуск при загрузке
window.addEventListener('load', () => {
    initWaterfallGame();
    initDogBoat();
});
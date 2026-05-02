// ═══════════════════════════════════════════
// ТЕМНАЯ ТЕМА
// ═══════════════════════════════════════════
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') { document.body.classList.add('dark-theme'); if (themeIcon) themeIcon.classList.replace('fa-moon','fa-sun'); }
if (themeToggle) themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) { if (themeIcon) themeIcon.classList.replace('fa-moon','fa-sun'); localStorage.setItem('theme','dark'); }
    else { if (themeIcon) themeIcon.classList.replace('fa-sun','fa-moon'); localStorage.setItem('theme','light'); }
});

// ═══════════════════════════════════════════
// ПЕЧАТАЮЩИЙСЯ ТЕКСТ
// ═══════════════════════════════════════════
function initTypingEffect() {
    const el = document.getElementById('typingText'); if (!el) return;
    const texts = ["стать Full-Stack разработчиком","создать инновационные продукты","работать в IT-компании мечты","участвовать в крупных проектах","непрерывно развиваться в IT"];
    let ti=0, ci=0, del=false, sp=100;
    function type() {
        const t=texts[ti]; el.textContent = del ? t.substring(0,ci-1) : t.substring(0,ci+1);
        if(del){ci--;sp=50;}else{ci++;sp=100;}
        if(!del&&ci===t.length){del=true;sp=1500;}else if(del&&ci===0){del=false;ti=(ti+1)%texts.length;sp=500;}
        setTimeout(type,sp);
    }
    setTimeout(type,1000);
}

// ═══════════════════════════════════════════
// АНИМАЦИИ ПРИ ПРОКРУТКЕ
// ═══════════════════════════════════════════
function animateOnScroll() {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        if(el.getBoundingClientRect().top < window.innerHeight-150) {
            el.classList.add('animated');
            if(el.id==='about') setTimeout(() => { animateTechBars(); animateCounters(); }, 300);
        }
    });
}
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// ═══════════════════════════════════════════
// МОБИЛЬНОЕ МЕНЮ
// ═══════════════════════════════════════════
const mobileMenuBtn=document.getElementById('mobileMenuBtn'), navMenu=document.getElementById('navMenu');
if(mobileMenuBtn&&navMenu) mobileMenuBtn.addEventListener('click',()=>{navMenu.classList.toggle('active');mobileMenuBtn.innerHTML=navMenu.classList.contains('active')?'<i class="fas fa-times"></i>':'<i class="fas fa-bars"></i>';});
document.querySelectorAll('nav ul li a').forEach(l=>l.addEventListener('click',()=>{if(navMenu)navMenu.classList.remove('active');if(mobileMenuBtn)mobileMenuBtn.innerHTML='<i class="fas fa-bars"></i>';}));

// ═══════════════════════════════════════════
// ПЛАВНАЯ ПРОКРУТКА
// ═══════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',function(e){e.preventDefault();const t=document.querySelector(this.getAttribute('href'));if(t)window.scrollTo({top:t.offsetTop-80,behavior:'smooth'});}));

// ═══════════════════════════════════════════
// КНОПКА ВВЕРХ
// ═══════════════════════════════════════════
const scrollBtn=document.getElementById('scrollToTop');
window.addEventListener('scroll',()=>{if(scrollBtn)scrollBtn.classList.toggle('visible',window.pageYOffset>300);});
if(scrollBtn)scrollBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// ═══════════════════════════════════════════
// АНИМАЦИЯ ТЕХ-СТЕКА
// ═══════════════════════════════════════════
function animateTechBars(){document.querySelectorAll('.percentage-fill[data-width]').forEach(el=>el.style.width=el.getAttribute('data-width')+'%');}

// ═══════════════════════════════════════════
// АНИМАЦИЯ СЧЁТЧИКОВ
// ═══════════════════════════════════════════
function animateCounters(){document.querySelectorAll('.counter').forEach(c=>{const t=+c.getAttribute('data-target'),cur=+c.innerText,inc=t/200;if(cur<t){const upd=()=>{const n=+c.innerText;if(n<t){c.innerText=Math.ceil(n+inc);setTimeout(upd,10);}else c.innerText=t;};upd();}});}

// ═══════════════════════════════════════════
// ЧАСТИЦЫ
// ═══════════════════════════════════════════
function initParticles(){
    const sec=document.getElementById('about');if(!sec||document.getElementById('particles-canvas'))return;
    const cont=document.getElementById('particles-js');if(!cont)return;
    const canvas=document.createElement('canvas');canvas.id='particles-canvas';cont.appendChild(canvas);
    const ctx=canvas.getContext('2d');
    function resize(){canvas.width=cont.offsetWidth;canvas.height=cont.offsetHeight;}
    resize();window.addEventListener('resize',resize);
    const digits=['0','1'],particles=[];
    for(let i=0;i<60;i++)particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,size:Math.random()*12+8,speed:Math.random()*0.4+0.1,digit:digits[Math.floor(Math.random()*2)],opacity:Math.random()*0.25+0.05,dir:Math.random()*Math.PI*2});
    function draw(){if(!canvas.isConnected)return;ctx.clearRect(0,0,canvas.width,canvas.height);particles.forEach(p=>{p.x+=Math.cos(p.dir)*p.speed;p.y+=Math.sin(p.dir)*p.speed;if(p.x<-20)p.x=canvas.width+20;if(p.x>canvas.width+20)p.x=-20;if(p.y<-20)p.y=canvas.height+20;if(p.y>canvas.height+20)p.y=-20;ctx.fillStyle=`rgba(0,163,54,${p.opacity})`;ctx.font=`${p.size}px 'Courier New',monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(p.digit,p.x,p.y);});requestAnimationFrame(draw);}
    draw();
}

// ═══════════════════════════════════════════
// КРУГОВАЯ ДИАГРАММА
// ═══════════════════════════════════════════
function drawSkillsChart(){
    const canvas=document.getElementById('skillsChart');if(!canvas)return;
    const container=canvas.parentElement,size=Math.min(container.offsetWidth-40,280);
    canvas.width=size;canvas.height=size;
    const ctx=canvas.getContext('2d'),cx=size/2,cy=size/2,r=size*0.38;
    const catData={};
    document.querySelectorAll('.tech-category').forEach(cat=>{const name=cat.querySelector('h4').textContent,percents=[];cat.querySelectorAll('.skill-percentage').forEach(sp=>percents.push(parseInt(sp.textContent)));if(percents.length>0)catData[name]=Math.round(percents.reduce((a,b)=>a+b,0)/percents.length);});
    const items=Object.entries(catData);if(items.length===0)return;
    const colors=['#00a336','#00d44c','#4dabf7','#ffd700','#ff6b6b','#a29bfe','#fd79a8','#00cec9'],total=items.reduce((s,[,v])=>s+v,0);
    let angle=-Math.PI/2,legend='';ctx.clearRect(0,0,size,size);
    items.forEach(([name,value],i)=>{const slice=(value/total)*2*Math.PI,color=colors[i%colors.length];ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,angle,angle+slice);ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.strokeStyle='white';ctx.lineWidth=2;ctx.stroke();const mid=angle+slice/2;if(slice>0.5){ctx.fillStyle='#fff';ctx.font='bold 11px "Segoe UI",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(value+'%',cx+Math.cos(mid)*r*0.6,cy+Math.sin(mid)*r*0.6);}legend+=`<div style="display:flex;align-items:flex-start;margin-bottom:8px;gap:8px;"><span style="background:${color};min-width:14px;width:14px;height:14px;border-radius:3px;display:inline-block;margin-top:2px;flex-shrink:0;"></span><span style="font-size:13px;line-height:1.4;color:var(--text-color);">${name} — <strong>${value}%</strong></span></div>`;angle+=slice;});
    ctx.beginPath();ctx.arc(cx,cy,r*0.45,0,2*Math.PI);ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--card-bg').trim()||'#fff';ctx.fill();
    const legendEl=document.getElementById('chartLegend');if(legendEl)legendEl.innerHTML=legend;
}
let chartDrawn=false;
window.addEventListener('load',()=>setTimeout(drawSkillsChart,1000));
window.addEventListener('scroll',()=>{if(document.getElementById('about')?.classList.contains('animated')&&!chartDrawn){drawSkillsChart();chartDrawn=true;}});

// ═══════════════════════════════════════════
// ВОДОПАДЫ + РЕКА — LEGENDARY EDITION
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

    const leftWF = [], rightWF = [], splashes = [], fireworks = [], stars = [];
    let dogTrail = [];

    // Звёзды
    for (let i = 0; i < 40; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.6,
            size: 0.5 + Math.random() * 2,
            twinkle: Math.random() * Math.PI * 2,
            speed: 0.01 + Math.random() * 0.03
        });
    }

    function createDrop(side) {
        const bx = side === 'left' ? canvas.width * 0.07 : canvas.width * 0.93;
        return {
            x: bx + (Math.random() - 0.5) * 25,
            y: Math.random() * canvas.height * 0.4,
            speed: 1.5 + Math.random() * 3,
            size: 1.5 + Math.random() * 3,
            opacity: 0.2 + Math.random() * 0.4,
            hue: 190 + Math.random() * 25,
            splashed: false
        };
    }

    for (let i = 0; i < 60; i++) {
        leftWF.push(createDrop('left'));
        rightWF.push(createDrop('right'));
    }

    let time = 0;
    window.tsunamiHeight = 0;
    let tsunamiFlash = 0;
    window.dogPos = { x: canvas.width / 2, y: canvas.height * 0.7 };

    // ═══════════════════
    // ЗВЁЗДНОЕ НЕБО
    // ═══════════════════
    function drawStars() {
        stars.forEach(s => {
            s.twinkle += s.speed;
            const alpha = 0.3 + Math.abs(Math.sin(s.twinkle)) * 0.7;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
            // Крестик у ярких звёзд
            if (s.size > 1.5 && alpha > 0.7) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(s.x - s.size * 2, s.y);
                ctx.lineTo(s.x + s.size * 2, s.y);
                ctx.moveTo(s.x, s.y - s.size * 2);
                ctx.lineTo(s.x, s.y + s.size * 2);
                ctx.stroke();
            }
        });
    }

    // ═══════════════════
    // РАДУГА
    // ═══════════════════
    function drawRainbow() {
        const rx = canvas.width / 2;
        const ry = canvas.height * 0.15;
        const rr = canvas.width * 0.5;
        const colors = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff'];
        colors.forEach((color, i) => {
            ctx.strokeStyle = color;
            ctx.globalAlpha = 0.08;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(rx, ry, rr - i * 5, Math.PI, 0);
            ctx.stroke();
        });
        ctx.globalAlpha = 1;
    }

    // ═══════════════════
    // СКАЛЫ
    // ═══════════════════
    function drawRocks() {
        const lg = ctx.createLinearGradient(0, 0, canvas.width * 0.13, 0);
        lg.addColorStop(0, 'rgba(40, 45, 50, 0.5)');
        lg.addColorStop(0.5, 'rgba(50, 55, 60, 0.25)');
        lg.addColorStop(1, 'rgba(55, 60, 65, 0)');
        ctx.fillStyle = lg;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.05);
        ctx.quadraticCurveTo(canvas.width * 0.06, canvas.height * 0.18, canvas.width * 0.1, canvas.height * 0.5);
        ctx.lineTo(canvas.width * 0.07, canvas.height * 0.85);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();

        const rg = ctx.createLinearGradient(canvas.width, 0, canvas.width * 0.87, 0);
        rg.addColorStop(0, 'rgba(40, 45, 50, 0.5)');
        rg.addColorStop(0.5, 'rgba(50, 55, 60, 0.25)');
        rg.addColorStop(1, 'rgba(55, 60, 65, 0)');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.moveTo(canvas.width, canvas.height * 0.05);
        ctx.quadraticCurveTo(canvas.width * 0.94, canvas.height * 0.18, canvas.width * 0.9, canvas.height * 0.5);
        ctx.lineTo(canvas.width * 0.93, canvas.height * 0.85);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
    }

    // ═══════════════════
    // ВОДОПАД
    // ═══════════════════
    function drawWaterfall(particles, x, width) {
        const mist = ctx.createLinearGradient(x, canvas.height * 0.05, x, canvas.height * 0.7);
        mist.addColorStop(0, 'rgba(220, 240, 255, 0.15)');
        mist.addColorStop(0.4, 'rgba(170, 215, 250, 0.18)');
        mist.addColorStop(1, 'rgba(100, 180, 220, 0.03)');
        ctx.fillStyle = mist;
        ctx.fillRect(x - width/2, canvas.height * 0.02, width, canvas.height * 0.72);

        particles.forEach(p => {
            p.y += p.speed;
            if (p.y > canvas.height * 0.72 && !p.splashed) {
                p.splashed = true;
                // ВЗРЫВНЫЕ БРЫЗГИ
                for (let s = 0; s < 10; s++) {
                    splashes.push({
                        x: x + (Math.random() - 0.5) * width,
                        y: canvas.height * 0.72,
                        vx: (Math.random() - 0.5) * 8,
                        vy: -Math.random() * 10 - 3,
                        life: 1,
                        size: 1.5 + Math.random() * 4
                    });
                }
                p.y = Math.random() * canvas.height * 0.2;
                p.splashed = false;
            }

            ctx.fillStyle = `hsla(${p.hue}, 60%, 80%, ${p.opacity})`;
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.size, p.size * 1.8, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.8})`;
            ctx.beginPath();
            ctx.arc(p.x - p.size * 0.2, p.y - p.size * 0.3, p.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // ═══════════════════
    // БРЫЗГИ
    // ═══════════════════
    function drawSplashes() {
        splashes.forEach(d => {
            d.x += d.vx;
            d.y += d.vy;
            d.vy += 0.06;
            d.life -= 0.012;
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

    // ═══════════════════
    // РЕКА
    // ═══════════════════
    function drawRiver() {
        const bass = smoothBass || 0;
        const baseY = canvas.height * 0.73;
        const e = bass;
        const r = Math.sin(time * 0.035) * bass;

        // Зеркало
        const mirror = ctx.createLinearGradient(0, baseY - 20, 0, canvas.height);
        mirror.addColorStop(0, 'rgba(100, 190, 240, 0.08)');
        mirror.addColorStop(0.3, 'rgba(40, 140, 210, 0.16)');
        mirror.addColorStop(1, 'rgba(5, 30, 80, 0.4)');
        ctx.fillStyle = mirror;
        ctx.fillRect(0, baseY, canvas.width, canvas.height - baseY);

        // Свечение
        if (e > 0.1) {
            const g1 = ctx.createRadialGradient(canvas.width * 0.3, baseY + 30, 5, canvas.width * 0.3, baseY + 25, canvas.width * 0.5);
            g1.addColorStop(0, `rgba(0, 255, 180, ${e * 0.4})`);
            g1.addColorStop(1, 'rgba(0, 255, 180, 0)');
            ctx.fillStyle = g1;
            ctx.fillRect(0, baseY - 30, canvas.width, canvas.height - baseY + 30);
        }

        // Волны (БОЛЬШИЕ)
        const layers = [
            { h: 6 + e * 40, s: 0.6 + e * 2.5, a: 0.14, c: `hsla(${190 + Math.sin(time*0.01)*15}, 50%, 55%,` },
            { h: 8 + r * 30, s: 0.8 + e * 1.6, a: 0.18, c: `hsla(${185 + Math.cos(time*0.012)*12}, 60%, 60%,` },
            { h: 4 + e * 22, s: 1 + e * 3.5, a: 0.1, c: `hsla(${195 + Math.sin(time*0.015)*10}, 45%, 65%,` },
        ];
        layers.forEach(l => {
            ctx.fillStyle = l.c + l.a + ')';
            for (let x = 0; x < canvas.width; x += 4) {
                const y = baseY + Math.sin((x + time * l.s) / 100) * l.h + Math.cos((x - time * l.s * 0.6) / 65) * l.h * 0.5;
                ctx.fillRect(x, y, 5, 4);
            }
        });

        // Пена
        if (e > 0.04) {
            const fa = Math.min(e * 3, 0.8);
            for (let i = 0; i < 16; i++) {
                const fx = (time * 1.5 + i * canvas.width / 16) % canvas.width;
                const fy = baseY + Math.sin((fx + time * 0.8) / 90) * (8 + e * 30) - 6;
                ctx.fillStyle = `rgba(255, 255, 255, ${fa * 0.7})`;
                ctx.beginPath();
                ctx.arc(fx, fy, 3 + Math.random() * 6 * e, 0, Math.PI);
                ctx.fill();
            }
        }

        // Блики
        const sc = Math.floor(10 + e * 20);
        for (let i = 0; i < sc; i++) {
            const sx = (time * (0.4 + e) + i * canvas.width / sc) % canvas.width;
            const sy = baseY + 8 + Math.sin(sx / 35 + time * 0.5) * (5 + e * 10);
            const sh = 0.05 + Math.abs(Math.sin(time * 0.07 + i * 0.7)) * (0.12 + e * 0.35);
            ctx.fillStyle = `rgba(255, 255, 255, ${sh})`;
            ctx.fillRect(sx - 2, sy, 5, 1);
            ctx.fillRect(sx, sy - 2, 1, 5);
        }

        // След собачки
        if (window.dogPos) {
            dogTrail.push({ x: window.dogPos.x, y: baseY + 10, life: 1 });
            if (dogTrail.length > 30) dogTrail.shift();
        }
        dogTrail.forEach((t, i) => {
            t.life -= 0.03;
            if (t.life > 0) {
                ctx.fillStyle = `rgba(255, 255, 255, ${t.life * 0.3})`;
                ctx.beginPath();
                ctx.arc(t.x, t.y, (1 - t.life) * 8, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Гигантские круги бита
        if (e > 0.2) {
            const pa = (e - 0.2) * 3;
            for (let i = 0; i < 4; i++) {
                const px = canvas.width * 0.1 + i * canvas.width * 0.27;
                ctx.strokeStyle = `rgba(255, 255, 255, ${pa * 0.35})`;
                ctx.lineWidth = 2;
                ctx.shadowColor = `rgba(0, 255, 200, ${pa * 0.5})`;
                ctx.shadowBlur = 15 + e * 15;
                ctx.beginPath();
                ctx.arc(px, baseY + 10, e * 80 * (0.5 + i * 0.2), 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }
    }

    // ═══════════════════
    // ФЕЙЕРВЕРКИ
    // ═══════════════════
    function drawFireworks() {
        if (tsunamiFlash > 0) {
            for (let i = 0; i < 20; i++) {
                fireworks.push({
                    x: canvas.width * 0.3 + Math.random() * canvas.width * 0.4,
                    y: canvas.height * 0.2 + Math.random() * canvas.height * 0.3,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    life: 1,
                    hue: 120 + Math.random() * 200
                });
            }
            tsunamiFlash = 0;
        }

        fireworks.forEach(f => {
            f.x += f.vx;
            f.y += f.vy;
            f.vy += 0.05;
            f.life -= 0.02;
            if (f.life > 0) {
                ctx.fillStyle = `hsla(${f.hue}, 90%, 60%, ${f.life})`;
                ctx.shadowColor = `hsla(${f.hue}, 100%, 60%, ${f.life})`;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(f.x, f.y, 3 * f.life, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });
        for (let i = fireworks.length - 1; i >= 0; i--) {
            if (fireworks[i].life <= 0) fireworks.splice(i, 1);
        }
    }

    // ═══════════════════
    // АНИМАЦИЯ
    // ═══════════════════
    function animate() {
        if (!canvas.isConnected) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 1;

        drawStars();
        drawRainbow();
        drawRocks();
        drawWaterfall(leftWF, canvas.width * 0.07, 35);
        drawWaterfall(rightWF, canvas.width * 0.93, 35);
        drawRiver();
        drawSplashes();
        drawFireworks();

        if (window.tsunamiHeight > 0) window.tsunamiHeight *= 0.9;
        if (window.tsunamiHeight < 0.3) window.tsunamiHeight = 0;

        requestAnimationFrame(animate);
    }

    animate();

       window.triggerTsunami = function() {
        // ДРОЖАНИЕ ЭКРАНА
        const galleryEl = document.querySelector('.gallery');
        if (galleryEl) {
            galleryEl.style.animation = 'screenShake 0.8s ease-out';
            setTimeout(() => galleryEl.style.animation = '', 800);
        }

        // ГИГАНТСКАЯ ВОЛНА
        window.tsunamiHeight = 90;

        // Волна-дракон
        const wave = document.getElementById('tsunamiWave');
        if (wave) {
            wave.style.height = '200px';
            wave.style.background = `
                linear-gradient(0deg, 
                    rgba(0, 255, 200, 0.95) 0%,
                    rgba(0, 200, 255, 0.8) 20%,
                    rgba(0, 150, 255, 0.6) 40%,
                    rgba(100, 200, 255, 0.4) 60%,
                    rgba(255, 255, 255, 0.7) 80%,
                    rgba(255, 255, 255, 0) 100%
                )
            `;
            wave.style.boxShadow = '0 -20px 60px rgba(0, 255, 200, 0.8), 0 -40px 120px rgba(0, 200, 255, 0.5)';
            wave.style.transition = 'height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            setTimeout(() => {
                wave.style.height = '0';
                wave.style.boxShadow = 'none';
            }, 1800);
        }

        // МОЛНИИ ПО ВСЕМУ ЭКРАНУ
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const lightning = document.createElement('div');
                const lx = Math.random() * 80 + 10;
                lightning.style.cssText = `
                    position: absolute;
                    left: ${lx}%;
                    top: 0;
                    width: 3px;
                    height: ${40 + Math.random() * 40}%;
                    background: linear-gradient(180deg, rgba(255,255,255,1), rgba(0,255,200,0.8), transparent);
                    z-index: 9;
                    pointer-events: none;
                    animation: lightningFlash ${0.1 + Math.random() * 0.3}s ease-out forwards;
                    transform: rotate(${(Math.random() - 0.5) * 20}deg);
                `;
                document.querySelector('.gallery').appendChild(lightning);
                setTimeout(() => lightning.remove(), 400);
            }, i * 80);
        }

                // ЧАСТИЦЫ ВОДЫ ПО ВСЕМУ ЭКРАНУ
        for (let i = 0; i < 50; i++) {
            const drop = document.createElement('div');
            const wx = (Math.random() - 0.5) * 200;
            const wy = -100 - Math.random() * 200;
            drop.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${50 + Math.random() * 30}%;
                width: ${3 + Math.random() * 8}px;
                height: ${3 + Math.random() * 8}px;
                background: rgba(0, 255, 200, ${0.6 + Math.random() * 0.4});
                border-radius: 50%;
                z-index: 9;
                pointer-events: none;
                --wx: ${wx}px;
                --wy: ${wy}px;
                animation: waterExplosion ${0.8 + Math.random() * 1.2}s ease-out forwards;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            document.querySelector('.gallery').appendChild(drop);
            setTimeout(() => drop.remove(), 2000);
        }

        // ВСПЫШКА
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(255, 255, 255, 0.8);
            z-index: 7;
            pointer-events: none;
            animation: flashBang 0.6s ease-out forwards;
        `;
        document.querySelector('.gallery').appendChild(flash);
        setTimeout(() => flash.remove(), 700);

        // Фейерверки
        tsunamiFlash = 1;
    };
}
// ═══════════════════════════════════════════
// СОБАЧКА
// ═══════════════════════════════════════════
function initDogBoat(){
    const dog=document.getElementById('dogBoat'),gallery=document.querySelector('.gallery');
    if(!dog||!gallery)return;
    let dragging=false,sx,sy,px,py,vx=0,vy=0,animId,sl,st,petCount=0;
    function setPos(x,y){const r=gallery.getBoundingClientRect();x=Math.max(30,Math.min(x,r.width-80));y=Math.max(50,Math.min(y,r.height-80));dog.style.left=x+'px';dog.style.top=y+'px';dog.style.bottom='auto';dog.style.transform='none';}
    function physics(){const r=gallery.getBoundingClientRect();let x=parseFloat(dog.style.left)||r.width/2,y=parseFloat(dog.style.top)||r.height*0.7;x+=vx;y+=vy;vx*=0.93;vy*=0.93;if(x<=30){x=30;vx=Math.abs(vx)*0.3;}if(x>=r.width-80){x=r.width-80;vx=-Math.abs(vx)*0.3;}if(y<=50){y=50;vy=Math.abs(vy)*0.3;}if(y>=r.height-80){y=r.height-80;vy=-Math.abs(vy)*0.3;}dog.style.left=x+'px';dog.style.top=y+'px';dog.style.transform='none';if(Math.abs(vx)>0.08||Math.abs(vy)>0.08)animId=requestAnimationFrame(physics);}
    dog.addEventListener('mousedown',function(e){dragging=true;cancelAnimationFrame(animId);px=e.clientX;py=e.clientY;sx=e.clientX;sy=e.clientY;const r=dog.getBoundingClientRect();sl=r.left;st=r.top;dog.style.cursor='grabbing';e.preventDefault();});
    document.addEventListener('mousemove',function(e){if(!dragging)return;const gr=gallery.getBoundingClientRect();setPos(e.clientX-gr.left-40,e.clientY-gr.top-30);px=e.clientX;py=e.clientY;});
    document.addEventListener('mouseup',function(e){if(!dragging)return;dragging=false;dog.style.cursor='grab';vx=(e.clientX-px)*6;vy=(e.clientY-py)*6;physics();});
    dog.addEventListener('dblclick',function(e){e.preventDefault();e.stopPropagation();petCount++;dog.classList.add('petted');setTimeout(()=>dog.classList.remove('petted'),600);const r=dog.getBoundingClientRect();for(let i=0;i<6;i++){const heart=document.createElement('div');heart.className='dog-heart';heart.textContent=['❤️','💕','💖','🦴','✨','🐾'][i];heart.style.cssText=`position:fixed;left:${r.left+r.width/2-15+(Math.random()-0.5)*50}px;top:${r.top+(Math.random()-0.5)*30}px;font-size:20px;pointer-events:none;z-index:9999;animation:heartFly 1s forwards;animation-delay:${i*0.1}s;`;document.body.appendChild(heart);setTimeout(()=>heart.remove(),1200);}if(petCount%3===0){const bark=document.createElement('div');bark.textContent='Гав! 🐕';const br=dog.getBoundingClientRect();bark.style.cssText=`position:fixed;left:${br.left+br.width/2-30}px;top:${br.top-30}px;font-size:16px;z-index:9999;pointer-events:none;animation:barkUp 1.2s forwards;`;document.body.appendChild(bark);setTimeout(()=>bark.remove(),1300);}});
    let autoAngle=0;setInterval(()=>{if(!dragging&&(!animId||Math.abs(vx)<0.08)){autoAngle+=0.012;const r=gallery.getBoundingClientRect();setPos(r.width/2+Math.sin(autoAngle)*70,r.height*0.7+Math.cos(autoAngle*0.6)*15);}},50);
    setTimeout(()=>{const r=gallery.getBoundingClientRect();setPos(r.width/2,r.height*0.7);},500);
}

// ═══════════════════════════════════════════
// ПРОСТЫЕ ПУЗЫРИ + ПЕРЕХОД В МЕДУЗЫ
// ═══════════════════════════════════════════
function initBubbleGame() {
    const canvas = document.getElementById('bubbleCanvas');
    const section = document.getElementById('certificates');
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    let W, H, time = 0;
    let popCount = 0;
    let fallingSouls = []; // Души, падающие в медузы

    function resize() {
        W = section.offsetWidth;
        H = section.offsetHeight;
        canvas.width = W;
        canvas.height = H;
    }
    resize();
    window.addEventListener('resize', resize);

    const bubbles = [];
    for (let i = 0; i < 20; i++) {
        bubbles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            size: 8 + Math.random() * 20,
            speed: 0.3 + Math.random() * 0.8,
            opacity: 0.2 + Math.random() * 0.25,
            hue: 180 + Math.random() * 40,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.005 + Math.random() * 0.015,
            popped: false,
            popTime: 0,
            popParticles: []
        });
    }

    function popBubble(b) {
        if (b.popped) return;
        b.popped = true;
        b.popTime = performance.now();
        b.popParticles = [];
        
        // Частицы разлета
        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 / 10) * i;
            b.popParticles.push({
                x: b.x, y: b.y,
                vx: Math.cos(angle) * (1 + Math.random() * 3),
                vy: Math.sin(angle) * (1 + Math.random() * 3),
                life: 1,
                size: b.size * 0.1
            });
        }

        // Душа падает вниз → станет медузой
        fallingSouls.push({
            x: b.x,
            y: b.y,
            targetY: H,
            life: 1,
            hue: b.hue,
            size: b.size
        });

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
        const bass = smoothBass || 0;

        bubbles.forEach(b => {
            if (b.popped) {
                const elapsed = (now - b.popTime) / 1000;
                if (elapsed > 1.2) {
                    Object.assign(b, {
                        x: Math.random() * W,
                        y: H + 40,
                        size: 8 + Math.random() * 20,
                        speed: 0.3 + Math.random() * 0.8,
                        opacity: 0.2 + Math.random() * 0.25,
                        hue: 180 + Math.random() * 40,
                        popped: false,
                        popParticles: []
                    });
                    return;
                }
                b.popParticles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.05;
                    p.life -= 0.03;
                    if (p.life > 0) {
                        ctx.fillStyle = `rgba(180, 220, 255, ${p.life * 0.6})`;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
                return;
            }

            b.y -= b.speed * (1 + bass);
            b.x += Math.sin(b.wobble) * 0.3;
            b.wobble += b.wobbleSpeed;
            if (b.y < -40) { b.y = H + 40; b.x = Math.random() * W; }

            const grad = ctx.createRadialGradient(b.x - b.size*0.2, b.y - b.size*0.2, b.size*0.05, b.x, b.y, b.size);
            grad.addColorStop(0, `hsla(${b.hue}, 55%, 85%, ${b.opacity + 0.2})`);
            grad.addColorStop(0.6, `hsla(${b.hue}, 50%, 60%, ${b.opacity + 0.1})`);
            grad.addColorStop(1, `hsla(${b.hue}, 40%, 35%, ${b.opacity * 0.5})`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255,255,255,${b.opacity * 0.5})`;
            ctx.beginPath();
            ctx.arc(b.x - b.size*0.2, b.y - b.size*0.2, b.size*0.18, 0, Math.PI * 2);
            ctx.fill();
        });

        // Падающие души
        fallingSouls.forEach((s, i) => {
            s.y += (s.targetY - s.y) * 0.05;
            s.life -= 0.01;
            const alpha = s.life * 0.6;
            ctx.fillStyle = `hsla(${s.hue}, 60%, 70%, ${alpha})`;
            ctx.shadowColor = `hsla(${s.hue}, 70%, 60%, ${alpha})`;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Когда душа достигла дна → создаём медузу
        for (let i = fallingSouls.length - 1; i >= 0; i--) {
            if (fallingSouls[i].y >= H - 20 || fallingSouls[i].life <= 0) {
                if (window.spawnJellyfish) {
                    window.spawnJellyfish(fallingSouls[i].x, fallingSouls[i].hue, fallingSouls[i].size);
                }
                fallingSouls.splice(i, 1);
            }
        }
    }

    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        for (let i = 0; i < bubbles.length; i++) {
            if (!bubbles[i].popped && Math.hypot(mx - bubbles[i].x, my - bubbles[i].y) < bubbles[i].size + 4) {
                popBubble(bubbles[i]);
            }
        }
    });

    function animate() {
        if (!canvas.isConnected) return;
        ctx.clearRect(0, 0, W, H);
        drawBubbles();
        requestAnimationFrame(animate);
    }
    animate();
}

// ═══════════════════════════════════════════
// МЕДУЗЫ — ОТДЕЛЬНЫЙ CANVAS
// ═══════════════════════════════════════════
function initJellyfish() {
    const canvas = document.getElementById('jellyfishCanvas');
    if (!canvas) return;
    
    const section = document.getElementById('certificates');
    if (!section) return;
    
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
        W = section.offsetWidth;
        H = section.offsetHeight;
        canvas.width = W;
        canvas.height = H;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '1';
        canvas.style.pointerEvents = 'none';
    }
    resize();
    window.addEventListener('resize', resize);

    let jellyfishes = [];
    const MAX = 7;
    let time = 0;

    function createJellyfish(x, hue, size) {
        const j = {
            x: x || Math.random() * W,
            y: H + 40,
            targetY: H * 0.15 + Math.random() * H * 0.55,
            size: Math.max(15, (size || 20) * 1.6),
            hue: hue || 180 + Math.random() * 30,
            opacity: 0.7 + Math.random() * 0.3,
            bellPhase: Math.random() * Math.PI * 2,
            bellSpeed: 0.03 + Math.random() * 0.04,
            bellContract: 0,
            tentacles: [],
            tentacleCount: 5 + Math.floor(Math.random() * 4),
            vx: (Math.random() - 0.5) * 0.3,
            vy: -0.3,
            phase: Math.random() * Math.PI * 2,
            life: 1,
            born: performance.now(),
            maxLife: 25 + Math.random() * 40,
            particles: []
        };

        // Щупальца
        for (let i = 0; i < j.tentacleCount; i++) {
            j.tentacles.push({
                angle: (Math.PI * 2 / j.tentacleCount) * i + (Math.random() - 0.5) * 0.4,
                length: j.size * (0.5 + Math.random() * 1.3),
                segments: 6 + Math.floor(Math.random() * 6),
                phase: Math.random() * Math.PI * 2,
                speed: 0.02 + Math.random() * 0.04,
                amplitude: 2 + Math.random() * 7
            });
        }
        return j;
    }

    window.spawnJellyfish = function(x, hue, size) {
        if (jellyfishes.length >= MAX) {
            jellyfishes.sort((a, b) => a.born - b.born);
            jellyfishes[0].life = 0;
        }
        const j = createJellyfish(x, hue, size);
        jellyfishes.push(j);
    };

    function drawJellyfish(j, bass) {
        const now = performance.now();
        const elapsed = (now - j.born) / 1000;
        j.life = Math.max(0, 1 - elapsed / j.maxLife);
        if (j.life <= 0) return false;

        // Всплытие
        j.y += (j.targetY - j.y) * 0.015;
        
        // Пульсация
        j.bellSpeed = 0.03 + bass * 0.08;
        j.bellPhase += j.bellSpeed;
        j.bellContract = Math.abs(Math.sin(j.bellPhase)) * (0.25 + bass * 0.6);

        // Плавание
        j.x += Math.sin(time * 0.4 + j.phase) * 0.4;
        j.x += j.vx;
        if (j.x < 60) j.vx += 0.05;
        if (j.x > W - 60) j.vx -= 0.05;
        j.vx *= 0.995;

        const bellW = j.size;
        const bellH = j.size * 0.65;
        const cY = -j.bellContract * bellH * 0.5;

        // Свечение
        const glow = ctx.createRadialGradient(j.x, j.y, bellW * 0.15, j.x, j.y, bellW * 0.7);
        glow.addColorStop(0, `hsla(${j.hue}, 55%, 70%, ${j.opacity * 0.25 * (1 + bass)})`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(j.x, j.y, bellW * 0.7, 0, Math.PI * 2);
        ctx.fill();

        // Купол
        const bell = ctx.createRadialGradient(j.x, j.y + cY, bellW * 0.05, j.x, j.y, bellW * 0.45);
        bell.addColorStop(0, `hsla(${j.hue}, 35%, 85%, ${j.opacity * 0.85})`);
        bell.addColorStop(0.4, `hsla(${j.hue}, 45%, 62%, ${j.opacity * 0.5})`);
        bell.addColorStop(1, `hsla(${j.hue}, 50%, 35%, ${j.opacity * 0.15})`);
        ctx.fillStyle = bell;
        ctx.beginPath();
        ctx.ellipse(j.x, j.y + cY, bellW * 0.45, bellH * 0.45, 0, Math.PI, 0);
        ctx.fill();

        // Щупальца
        j.tentacles.forEach(t => {
            t.phase += t.speed * (1 + bass * 3);
            const bx = j.x + Math.cos(t.angle) * bellW * 0.25;
            const by = j.y + bellH * 0.25;
            ctx.strokeStyle = `hsla(${j.hue}, 45%, 50%, ${j.opacity * 0.6})`;
            ctx.lineWidth = 1.2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(bx, by);
            for (let s = 1; s <= t.segments; s++) {
                const prog = s / t.segments;
                const wx = Math.sin(t.phase + prog * 4) * t.amplitude * prog;
                const wy = prog * t.length;
                ctx.lineTo(bx + wx, by + wy);
            }
            ctx.stroke();

            // Кончик
            const tipX = bx + Math.sin(t.phase + 4) * t.amplitude;
            const tipY = by + t.length;
            ctx.fillStyle = `rgba(160, 230, 255, ${j.opacity * 0.5})`;
            ctx.shadowColor = `rgba(140, 210, 255, ${j.opacity * 0.6})`;
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.arc(tipX, tipY, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Частицы
        if (Math.random() < 0.25 + bass * 0.4) {
            j.particles.push({
                x: j.x + (Math.random() - 0.5) * j.size,
                y: j.y + Math.random() * j.size * 0.5,
                life: 1,
                size: 1 + Math.random() * 1.5
            });
        }
        j.particles.forEach((p, i) => {
            p.y += 0.2;
            p.life -= 0.04;
            if (p.life > 0) {
                ctx.fillStyle = `rgba(140, 230, 255, ${p.life * 0.6})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        for (let i = j.particles.length - 1; i >= 0; i--) {
            if (j.particles[i].life <= 0) j.particles.splice(i, 1);
        }

        return true;
    }

    function animate(ts) {
        if (!canvas.isConnected) return;
        const bass = smoothBass || 0;
        time = ts * 0.001;
        ctx.clearRect(0, 0, W, H);
        jellyfishes = jellyfishes.filter(j => j.life > 0);
        jellyfishes.forEach(j => drawJellyfish(j, bass));
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

// Запуск
window.addEventListener('load', () => {
    setTimeout(initJellyfish, 1000);
});

// ═══════════════════════════════════════════
// ДОП СТИЛИ
// ═══════════════════════════════════════════
const es=document.createElement('style');es.textContent='@keyframes heartFly{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-70px) scale(1.6)}}@keyframes barkUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-50px)}}';document.head.appendChild(es);

// ═══════════════════════════════════════════
// ФИЛЬТР СЕРТИФИКАТОВ
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('.filter-btn').forEach(b=>b.addEventListener('click',function(){document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));this.classList.add('active');const c=this.getAttribute('data-course');document.querySelectorAll('.certificate-item').forEach(i=>i.style.display=(c==='all'||i.getAttribute('data-course')===c)?'block':'none');}));});

// ═══════════════════════════════════════════
// КЛИК ПО СЕРТИФИКАТАМ
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded',()=>{const g=document.getElementById('certificatesGrid');if(!g)return;g.addEventListener('click',function(e){const item=e.target.closest('.certificate-item');if(!item)return;const img=item.querySelector('img');if(!img)return;const v=document.getElementById('imageViewer'),vi=document.getElementById('viewerImage'),vc=document.getElementById('viewerCaption');if(!v||!vi)return;vi.src=img.getAttribute('data-full')||img.src;vc.textContent=img.alt||'';v.style.display='block';document.body.style.overflow='hidden';vi.style.transform='translate(-50%,-50%) scale(1)';});});

// ═══════════════════════════════════════════
// ПРОСМОТРЩИК ФОТО ГАЛЕРЕИ
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded',()=>{
    const viewer=document.getElementById('imageViewer'),vImg=document.getElementById('viewerImage'),vCap=document.getElementById('viewerCaption');
    if(!viewer||!vImg)return;
    let allItems=[],curIdx=0,zoomLevel=1;
    function getVisible(){return Array.from(document.querySelectorAll('#galleryGrid .gallery-item')).filter(i=>window.getComputedStyle(i).display!=='none');}
    function resetZoom(){zoomLevel=1;vImg.style.transform='translate(-50%,-50%) scale(1)';}
    function openViewer(imgEl,idx){allItems=getVisible();curIdx=idx;const img=imgEl.querySelector('img')||imgEl;vImg.src=img.getAttribute('data-full')||img.src;vCap.textContent=img.alt||'';viewer.style.display='block';document.body.style.overflow='hidden';resetZoom();}
    function closeViewer(){viewer.style.display='none';document.body.style.overflow='auto';}
    function navigate(dir){allItems=getVisible();if(allItems.length===0)return;curIdx=(curIdx+dir+allItems.length)%allItems.length;const item=allItems[curIdx],img=item.querySelector('img');vImg.src=img.getAttribute('data-full')||img.src;vCap.textContent=img.alt||'';resetZoom();}
    document.getElementById('zoomInBtn')?.addEventListener('click',e=>{e.stopPropagation();if(zoomLevel<3){zoomLevel+=0.2;vImg.style.transform=`translate(-50%,-50%) scale(${zoomLevel})`;}});
    document.getElementById('zoomOutBtn')?.addEventListener('click',e=>{e.stopPropagation();if(zoomLevel>0.5){zoomLevel-=0.2;vImg.style.transform=`translate(-50%,-50%) scale(${zoomLevel})`;}});
    document.getElementById('resetZoomBtn')?.addEventListener('click',e=>{e.stopPropagation();resetZoom();});
    document.getElementById('galleryGrid')?.addEventListener('click',function(e){const item=e.target.closest('.gallery-item');if(item)openViewer(item,Array.from(this.querySelectorAll('.gallery-item')).indexOf(item));});
    document.getElementById('closeViewer')?.addEventListener('click',closeViewer);
    viewer.addEventListener('click',e=>{if(e.target===viewer)closeViewer();});
    document.getElementById('prevBtn')?.addEventListener('click',e=>{e.stopPropagation();navigate(-1);});
    document.getElementById('nextBtn')?.addEventListener('click',e=>{e.stopPropagation();navigate(1);});
    document.addEventListener('keydown',e=>{if(viewer.style.display==='block'){if(e.key==='Escape')closeViewer();if(e.key==='ArrowRight')navigate(1);if(e.key==='ArrowLeft')navigate(-1);}});
});

// ═══════════════════════════════════════════
// МУЗЫКА + ПЛАВНЫЕ ВОЛНЫ
// ═══════════════════════════════════════════
let audioCtx, analyser, audioSource;
let musicPlaylist = [], currentTrack = 0, isMusicPlaying = false;
let smoothBass = 0; // Плавный бас

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
    analyser.smoothingTimeConstant = 0.85; // Плавное сглаживание
    audioSource = audioCtx.createMediaElementSource(musicAudio);
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
}

// Плавное обновление баса
function updateBass() {
    if (!analyser || !isMusicPlaying) {
        smoothBass *= 0.9; // Затухание когда нет музыки
        return;
    }
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    
    // Берём низкие частоты (бас)
    let rawBass = 0;
    for (let i = 0; i < 10; i++) rawBass += data[i];
    rawBass = rawBass / 10 / 255;
    
    // Плавное сглаживание
    smoothBass = smoothBass * 0.7 + rawBass * 0.3;
}

// Обновляем 30 раз в секунду (плавно)
setInterval(updateBass, 33);

// Вода реагирует на плавный бас
setInterval(() => {
    if (smoothBass > 0.01 && window.tsunamiHeight !== undefined) {
        window.tsunamiHeight = smoothBass * 50;
    }
}, 100);

// Собачка плавно качается
setInterval(() => {
    const dog = document.getElementById('dogBoat');
    if (!dog || smoothBass < 0.02) return;
    const bounce = Math.sin(Date.now() / 200) * smoothBass * 20;
    const baseTop = parseFloat(dog.style.top) || dog.getBoundingClientRect().top;
    dog.style.transition = 'top 0.15s ease-out';
    dog.style.top = (baseTop + bounce) + 'px';
}, 50);

// Кнопки
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

// Загрузка плейлиста
window.addEventListener('load', () => {
    setTimeout(loadMusicPlaylist, 1000);
});

// ═══════════════════════════════════════════
// ЗАПУСК
// ═══════════════════════════════════════════
window.addEventListener('load',()=>{
    initTypingEffect();
    initParticles();
    initWaterfallGame();
    initDogBoat();
    initBubbleGame();
    setTimeout(loadMusicPlaylist,1000);
});
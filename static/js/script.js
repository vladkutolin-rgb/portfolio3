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
// ЖИВАЯ ЭКОСИСТЕМА ПУЗЫРЕЙ — BECOME GOD
// ═══════════════════════════════════════════
function initBubbleGame() {
    const canvas = document.getElementById('bubbleCanvas');
    const section = document.getElementById('certificates');
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    let W, H, popCount = 0, globalTime = 0;
    let mouseX = -100, mouseY = -100;
    let mouseActive = false;

    function resize() {
        W = section.offsetWidth;
        H = section.offsetHeight;
        canvas.width = W;
        canvas.height = H;
    }
    resize();
    window.addEventListener('resize', resize);

    // Отслеживаем мышь
    canvas.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mouseX = e.clientX - r.left;
        mouseY = e.clientY - r.top;
        mouseActive = true;
    });
    canvas.addEventListener('mouseleave', () => { mouseActive = false; });

    let creatures = [];
    const INITIAL_COUNT = 35;

    function createCreature(x, y, parentHue) {
        return {
            x: x || Math.random() * W,
            y: y || Math.random() * H,
            size: 3 + Math.random() * 10,
            hue: parentHue || Math.random() * 360,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            life: 1, // 0-1, умирает при 0
            age: 0,
            maxAge: 300 + Math.random() * 700,
            energy: 0.5 + Math.random() * 0.5,
            state: 'wander', // wander, flock, hunt, flee, mate, die
            stateTimer: 0,
            flockMate: null,
            pulsePhase: Math.random() * Math.PI * 2,
            trail: [],
            children: 0
        };
    }

    // Создаём начальную популяцию
    for (let i = 0; i < INITIAL_COUNT; i++) {
        creatures.push(createCreature());
    }

    function popCreature(c) {
        popCount++;
        const el = document.getElementById('bubbleCount');
        if (el) el.textContent = popCount;
        if (popCount % 20 === 0 && window.triggerTsunami) {
            window.triggerTsunami();
            const a = document.getElementById('tsunamiAlert');
            if (a) { a.classList.add('show'); setTimeout(() => a.classList.remove('show'), 2000); }
        }
    }

    function drawEcosystem() {
        globalTime += 0.016;
        const bass = smoothBass || 0;
        const energy = bass;
        const now = performance.now();

        // Фон — дыхание вселенной
        const bgAlpha = 0.03 + energy * 0.05;
        ctx.fillStyle = `rgba(0, 180, 255, ${bgAlpha})`;
        ctx.fillRect(0, 0, W, H);

        // ═══════════════════════════════
        // ОБНОВЛЕНИЕ СОСТОЯНИЙ
        // ═══════════════════════════════
        creatures.forEach(c => {
            c.age++;
            c.pulsePhase += 0.03;
            
            // Энергия тратится
            c.energy -= 0.0002;
            if (c.energy < 0.2) c.state = 'hunt';
            if (c.energy > 0.7) c.state = 'mate';
            
            // Старение
            c.life = 1 - (c.age / c.maxAge);
            if (c.life <= 0) c.state = 'die';
            
            // Музыка влияет
            if (energy > 0.4) {
                c.energy = Math.min(1, c.energy + energy * 0.01);
                c.vx += (Math.random() - 0.5) * energy * 0.3;
                c.vy += (Math.random() - 0.5) * energy * 0.3;
            }
        });

        // ═══════════════════════════════
        // ВЗАИМОДЕЙСТВИЯ
        // ═══════════════════════════════
        for (let i = 0; i < creatures.length; i++) {
            for (let j = i + 1; j < creatures.length; j++) {
                const a = creatures[i], b = creatures[j];
                const dx = b.x - a.x, dy = b.y - a.y;
                const dist = Math.hypot(dx, dy) || 1;
                const interactionRange = 70 + energy * 150;

                if (dist < interactionRange) {
                    const strength = (1 - dist / interactionRange) * 0.015 * (1 + energy * 2);
                    const angle = Math.atan2(dy, dx);

                    // ХИЩНИК-ЖЕРТВА: голодный охотится на сытого
                    if (a.energy < 0.3 && b.energy > 0.5) {
                        a.vx += Math.cos(angle) * strength * 3;
                        a.vy += Math.sin(angle) * strength * 3;
                        b.vx -= Math.cos(angle) * strength * 2;
                        b.vy -= Math.sin(angle) * strength * 2;
                        if (dist < 15) {
                            a.energy += 0.3;
                            b.energy -= 0.3;
                            popCreature(b);
                            a.size += 1;
                            b.size = Math.max(1, b.size - 1);
                        }
                    } else if (b.energy < 0.3 && a.energy > 0.5) {
                        b.vx += Math.cos(angle + Math.PI) * strength * 3;
                        b.vy += Math.sin(angle + Math.PI) * strength * 3;
                        a.vx -= Math.cos(angle + Math.PI) * strength * 2;
                        a.vy -= Math.sin(angle + Math.PI) * strength * 2;
                        if (dist < 15) {
                            b.energy += 0.3;
                            a.energy -= 0.3;
                            popCreature(a);
                            b.size += 1;
                            a.size = Math.max(1, a.size - 1);
                        }
                    }
                    // СТАЯ: держатся вместе
                    else if (Math.abs(a.energy - b.energy) < 0.3) {
                        const eq = 25 + energy * 50;
                        const dir = dist < eq ? -1 : 1;
                        a.vx += Math.cos(angle) * strength * dir;
                        a.vy += Math.sin(angle) * strength * dir;
                        b.vx -= Math.cos(angle) * strength * dir;
                        b.vy -= Math.sin(angle) * strength * dir;
                    }
                    // РАЗМНОЖЕНИЕ
                    else if (a.energy > 0.7 && b.energy > 0.7 && dist < 20 && creatures.length < 60) {
                        if (a.children < 3 && b.children < 3) {
                            const child = createCreature(
                                (a.x + b.x) / 2 + (Math.random() - 0.5) * 30,
                                (a.y + b.y) / 2 + (Math.random() - 0.5) * 30,
                                (a.hue + b.hue) / 2
                            );
                            child.size = 2;
                            child.energy = 0.4;
                            creatures.push(child);
                            a.energy -= 0.2;
                            b.energy -= 0.2;
                            a.children++;
                            b.children++;
                        }
                    }
                }
            }
        }

        // ═══════════════════════════════
        // РЕАКЦИЯ НА КУРСОР (ХИЩНИК)
        // ═══════════════════════════════
        if (mouseActive) {
            creatures.forEach(c => {
                const dx = mouseX - c.x;
                const dy = mouseY - c.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 120) {
                    const fleeForce = (1 - dist / 120) * 0.8;
                    c.vx -= (dx / dist) * fleeForce;
                    c.vy -= (dy / dist) * fleeForce;
                }
            });
        }

        // ═══════════════════════════════
        // ДВИЖЕНИЕ И ГРАНИЦЫ
        // ═══════════════════════════════
        creatures.forEach(c => {
            // Случайное блуждание
            c.vx += (Math.random() - 0.5) * 0.05;
            c.vy += (Math.random() - 0.5) * 0.05;
            
            // Трение
            c.vx *= 0.99;
            c.vy *= 0.99;
            
            c.x += c.vx;
            c.y += c.vy;
            
            // Границы — отскок
            if (c.x < 20) { c.x = 20; c.vx *= -0.5; }
            if (c.x > W - 20) { c.x = W - 20; c.vx *= -0.5; }
            if (c.y < 20) { c.y = 20; c.vy *= -0.5; }
            if (c.y > H - 20) { c.y = H - 20; c.vy *= -0.5; }
            
            // Пульсация размера
            const sizePulse = c.size * (0.9 + 0.2 * Math.sin(c.pulsePhase + c.energy * 5));
            
            // След
            c.trail.push({ x: c.x, y: c.y, size: sizePulse, life: 1 });
            if (c.trail.length > 5) c.trail.shift();
            c.trail.forEach(t => t.life -= 0.04);
        });

        // ═══════════════════════════════
        // СМЕРТЬ И ВОЗРОЖДЕНИЕ
        // ═══════════════════════════════
        for (let i = creatures.length - 1; i >= 0; i--) {
            if (creatures[i].life <= 0) {
                // Взрыв при смерти
                const dead = creatures[i];
                for (let s = 0; s < 12; s++) {
                    const angle = Math.random() * Math.PI * 2;
                    const spark = createCreature(
                        dead.x + Math.cos(angle) * 10,
                        dead.y + Math.sin(angle) * 10,
                        dead.hue
                    );
                    spark.size = 1;
                    spark.energy = 0.3;
                    spark.vx = Math.cos(angle) * 3;
                    spark.vy = Math.sin(angle) * 3;
                    spark.maxAge = 100;
                    creatures.push(spark);
                }
                creatures.splice(i, 1);
                popCreature(dead);
            }
        }

        // Поддержание популяции
        if (creatures.length < 20 && Math.random() < 0.1) {
            creatures.push(createCreature());
        }

        // ═══════════════════════════════
        // ОТРИСОВКА
        // ═══════════════════════════════

        // Следы
        creatures.forEach(c => {
            c.trail.forEach((t, idx) => {
                if (t.life > 0) {
                    ctx.fillStyle = `hsla(${c.hue}, 60%, 60%, ${t.life * 0.2})`;
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, t.size * (idx / 5) * 0.7, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        });

        // Связи стаи
        for (let i = 0; i < creatures.length; i++) {
            for (let j = i + 1; j < creatures.length; j++) {
                const a = creatures[i], b = creatures[j];
                const dist = Math.hypot(b.x - a.x, b.y - a.y);
                if (dist < 60 + energy * 100) {
                    const alpha = (1 - dist / (60 + energy * 100)) * 0.08;
                    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                    ctx.lineWidth = 0.3;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        // Сами существа
        creatures.forEach(c => {
            const sizePulse = c.size * (0.9 + 0.2 * Math.sin(c.pulsePhase + c.energy * 5));
            
            // Свечение энергии
            const glowAlpha = c.energy * 0.5;
            const glow = ctx.createRadialGradient(c.x, c.y, sizePulse * 0.3, c.x, c.y, sizePulse * 2);
            glow.addColorStop(0, `hsla(${c.hue}, 70%, 60%, ${glowAlpha})`);
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(c.x, c.y, sizePulse * 2, 0, Math.PI * 2);
            ctx.fill();

            // Тело
            const grad = ctx.createRadialGradient(
                c.x - sizePulse * 0.2, c.y - sizePulse * 0.2, sizePulse * 0.05,
                c.x, c.y, sizePulse
            );
            grad.addColorStop(0, `hsla(${c.hue}, 60%, 85%, 0.85)`);
            grad.addColorStop(0.5, `hsla(${c.hue}, 55%, 60%, 0.55)`);
            grad.addColorStop(1, `hsla(${c.hue}, 45%, 32%, 0.2)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(c.x, c.y, sizePulse, 0, Math.PI * 2);
            ctx.fill();

            // Обводка
            ctx.strokeStyle = `hsla(${c.hue}, 80%, 70%, ${0.4 + c.energy * 0.4})`;
            ctx.lineWidth = 1 + c.energy;
            ctx.shadowColor = `hsla(${c.hue}, 90%, 60%, ${0.5 + c.energy * 0.3})`;
            ctx.shadowBlur = 3 + c.energy * 8;
            ctx.beginPath();
            ctx.arc(c.x, c.y, sizePulse, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Глаз (блик)
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(c.x - sizePulse * 0.2, c.y - sizePulse * 0.2, sizePulse * 0.22, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function animate() {
        if (!canvas.isConnected) return;
        ctx.clearRect(0, 0, W, H);
        drawEcosystem();
        requestAnimationFrame(animate);
    }
    animate();
}

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
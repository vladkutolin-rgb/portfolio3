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
// ВОДОПАДЫ + РЕКА (КРАСИВЫЙ ДИЗАЙН)
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
    const leftWF = [], rightWF = [], splashes = [];
    
    function createDrop(side) {
        const baseX = side === 'left' ? canvas.width * 0.07 : canvas.width * 0.93;
        return {
            x: baseX + (Math.random() - 0.5) * 30,
            y: Math.random() * canvas.height * 0.35,
            speed: 1.2 + Math.random() * 2.5,
            size: 1.5 + Math.random() * 2.5,
            opacity: 0.15 + Math.random() * 0.35,
            hue: 190 + Math.random() * 20,
            splashed: false
        };
    }

    for (let i = 0; i < 50; i++) {
        leftWF.push(createDrop('left'));
        rightWF.push(createDrop('right'));
    }

    let time = 0;
    window.tsunamiHeight = 0;

    // Рисуем скалы
    function drawRocks() {
        // Левая скала
        const leftGrad = ctx.createLinearGradient(0, 0, canvas.width * 0.12, 0);
        leftGrad.addColorStop(0, 'rgba(50, 55, 60, 0.35)');
        leftGrad.addColorStop(1, 'rgba(50, 55, 60, 0.05)');
        ctx.fillStyle = leftGrad;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.05);
        ctx.quadraticCurveTo(canvas.width * 0.06, canvas.height * 0.2, canvas.width * 0.1, canvas.height * 0.5);
        ctx.lineTo(canvas.width * 0.07, canvas.height * 0.85);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();

        // Правая скала
        const rightGrad = ctx.createLinearGradient(canvas.width, 0, canvas.width * 0.88, 0);
        rightGrad.addColorStop(0, 'rgba(50, 55, 60, 0.35)');
        rightGrad.addColorStop(1, 'rgba(50, 55, 60, 0.05)');
        ctx.fillStyle = rightGrad;
        ctx.beginPath();
        ctx.moveTo(canvas.width, canvas.height * 0.05);
        ctx.quadraticCurveTo(canvas.width * 0.94, canvas.height * 0.2, canvas.width * 0.9, canvas.height * 0.5);
        ctx.lineTo(canvas.width * 0.93, canvas.height * 0.85);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
    }

    // Водопад
    function drawWaterfall(particles, x, width) {
        // Туман водопада
        const mistGrad = ctx.createLinearGradient(x, canvas.height * 0.1, x, canvas.height * 0.7);
        mistGrad.addColorStop(0, 'rgba(180, 220, 255, 0.08)');
        mistGrad.addColorStop(0.5, 'rgba(140, 200, 240, 0.12)');
        mistGrad.addColorStop(1, 'rgba(100, 180, 220, 0.04)');
        ctx.fillStyle = mistGrad;
        ctx.fillRect(x - width / 2, canvas.height * 0.05, width, canvas.height * 0.7);

        // Капли
        particles.forEach(p => {
            p.y += p.speed;
            if (p.y > canvas.height * 0.73 && !p.splashed) {
                p.splashed = true;
                for (let s = 0; s < 5; s++) {
                    splashes.push({
                        x: x + (Math.random() - 0.5) * width,
                        y: canvas.height * 0.73,
                        vx: (Math.random() - 0.5) * 4,
                        vy: -Math.random() * 6 - 2,
                        life: 1,
                        size: 1 + Math.random() * 2.5
                    });
                }
                p.y = Math.random() * canvas.height * 0.25;
                p.splashed = false;
            }

            // Капля
            const alpha = p.opacity;
            ctx.fillStyle = `hsla(${p.hue}, 60%, 75%, ${alpha})`;
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.size, p.size * 1.8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Блик на капле
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
            ctx.beginPath();
            ctx.arc(p.x - p.size * 0.2, p.y - p.size * 0.4, p.size * 0.35, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Брызги
    function drawSplashes() {
        splashes.forEach(d => {
            d.x += d.vx;
            d.y += d.vy;
            d.vy += 0.08;
            d.life -= 0.015;
            if (d.life > 0) {
                ctx.fillStyle = `rgba(200, 230, 255, ${d.life * 0.7})`;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.size * d.life, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        for (let i = splashes.length - 1; i >= 0; i--) {
            if (splashes[i].life <= 0) splashes.splice(i, 1);
        }
    }

           // Красивые волны реки — FULL POWER EDITION
    function drawRiver() {
        const bass = smoothBass || 0;
        const baseY = canvas.height * 0.73;
        const tsunamiEffect = (window.tsunamiHeight || 0) * 0.3;
        const beat = bass;
        const rhythm = Math.sin(time * 0.03) * bass;
        const melody = Math.sin(time * 0.015) * 0.5 + 0.5; // Мелодия (0-1)
        const energy = beat * 0.7 + melody * 0.3; // Общая энергия трека

        // ══════════════════════════════════════
        // ГЛУБИНА — тёмная вода снизу
        // ══════════════════════════════════════
        const depthGrad = ctx.createLinearGradient(0, baseY - 20, 0, canvas.height);
        depthGrad.addColorStop(0, 'rgba(0, 160, 210, 0.15)');
        depthGrad.addColorStop(0.3, 'rgba(0, 120, 180, 0.2)');
        depthGrad.addColorStop(1, 'rgba(0, 60, 120, 0.35)');
        ctx.fillStyle = depthGrad;
        ctx.fillRect(0, baseY, canvas.width, canvas.height - baseY);

        // ══════════════════════════════════════
        // СВЕЧЕНИЕ ПОД ВОДОЙ (неон)
        // ══════════════════════════════════════
        const glowGrad = ctx.createRadialGradient(canvas.width * 0.3, baseY + 30, 10, canvas.width * 0.3, baseY + 20, canvas.width * 0.5);
        glowGrad.addColorStop(0, `rgba(0, 255, 150, ${0.1 + energy * 0.2})`);
        glowGrad.addColorStop(1, 'rgba(0, 255, 150, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, baseY - 40, canvas.width, canvas.height - baseY);

        const glowGrad2 = ctx.createRadialGradient(canvas.width * 0.7, baseY + 40, 10, canvas.width * 0.7, baseY + 25, canvas.width * 0.45);
        glowGrad2.addColorStop(0, `rgba(0, 200, 255, ${0.08 + energy * 0.15})`);
        glowGrad2.addColorStop(1, 'rgba(0, 200, 255, 0)');
        ctx.fillStyle = glowGrad2;
        ctx.fillRect(0, baseY - 40, canvas.width, canvas.height - baseY);

        // ══════════════════════════════════════
        // СЛОЙ 1: ГЛУБИННАЯ ВОЛНА
        // ══════════════════════════════════════
        const l1h = 5 + beat * 35 + tsunamiEffect * 0.5;
        const l1s = 1 + beat * 3;
        const hue1 = 190 + melody * 20; // Цвет меняется с мелодией
        ctx.fillStyle = `hsla(${hue1}, 60%, 55%, 0.12)`;
        for (let x = 0; x < canvas.width; x += 6) {
            const y = baseY + Math.sin((x + time * l1s) / 100) * l1h +
                      Math.cos((x - time * l1s * 0.5) / 70) * l1h * 0.4 +
                      Math.sin((x * 0.02 + time * 0.3)) * 3;
            ctx.fillRect(x, y, 6, 5);
        }

        // ══════════════════════════════════════
        // СЛОЙ 2: СРЕДНЯЯ ВОЛНА
        // ══════════════════════════════════════
        const l2h = 6 + rhythm * 25 + tsunamiEffect * 0.4;
        const l2s = 0.9 + beat * 2;
        const hue2 = 180 + melody * 25;
        ctx.fillStyle = `hsla(${hue2}, 70%, 60%, 0.16)`;
        for (let x = 0; x < canvas.width; x += 4) {
            const y = baseY + Math.cos((x + time * l2s) / 90) * l2h +
                      Math.sin((x - time * l2s * 0.7) / 60) * l2h * 0.6 +
                      Math.cos((x * 0.03 + time * 0.25)) * 4;
            ctx.fillRect(x, y, 4, 3);
        }

        // ══════════════════════════════════════
        // СЛОЙ 3: ПОВЕРХНОСТНАЯ РЯБЬ
        // ══════════════════════════════════════
        const l3h = 2.5 + beat * 18;
        const l3s = 1.5 + beat * 4;
        const hue3 = 200 + melody * 15;
        ctx.fillStyle = `hsla(${hue3}, 60%, 70%, 0.1)`;
        for (let x = 0; x < canvas.width; x += 3) {
            const y = baseY + Math.sin((x + time * l3s) / 60) * l3h +
                      Math.cos((x - time * l3s * 0.8) / 40) * l3h * 0.4;
            ctx.fillRect(x, y, 3, 2);
        }

        // ══════════════════════════════════════
        // РАДУЖНАЯ ПЕНА
        // ══════════════════════════════════════
        if (beat > 0.08) {
            const fa = Math.min(beat * 2.5, 0.7);
            for (let i = 0; i < 15; i++) {
                const fx = (time * 2 + i * canvas.width / 15 + Math.sin(i * 3.3) * 60) % canvas.width;
                const fy = baseY + Math.sin((fx + time * l1s) / 100) * l1h - 6;
                const hue = 180 + i * 20 + time * 2;
                ctx.fillStyle = `hsla(${hue % 360}, 80%, 80%, ${fa * 0.6})`;
                ctx.beginPath();
                ctx.arc(fx, fy, 2 + Math.random() * 6 * beat, 0, Math.PI);
                ctx.fill();
                // Второй слой пены
                ctx.fillStyle = `rgba(255, 255, 255, ${fa * 0.4})`;
                ctx.beginPath();
                ctx.arc(fx + 3, fy - 1, 1 + Math.random() * 3 * beat, 0, Math.PI);
                ctx.fill();
            }
        }

        // ══════════════════════════════════════
        // СВЕТЛЯЧКИ-БЛИКИ
        // ══════════════════════════════════════
        const sc = Math.floor(15 + energy * 25);
        for (let i = 0; i < sc; i++) {
            const sx = (time * (0.4 + beat) + i * canvas.width / sc + Math.sin(i * 5.1) * 30) % canvas.width;
            const sy = baseY + 8 + Math.sin(sx / 35 + time * 0.6) * (5 + beat * 12) + Math.cos(i * 3.7 + time * 0.2) * 4;
            const shimmer = 0.04 + Math.abs(Math.sin(time * 0.07 + i * 0.9)) * (0.12 + energy * 0.25);
            const shimmerHue = 180 + Math.sin(i * 0.5 + time * 0.1) * 40;
            ctx.fillStyle = `hsla(${shimmerHue}, 70%, 80%, ${shimmer})`;
            ctx.shadowColor = `hsla(${shimmerHue}, 80%, 70%, ${shimmer * 2})`;
            ctx.shadowBlur = 3 + beat * 6;
            ctx.fillRect(sx, sy, 2, 2);
            ctx.shadowBlur = 0;
        }

        // ══════════════════════════════════════
        // БИТ-КРУГИ
        // ══════════════════════════════════════
        if (beat > 0.2) {
            const pa = (beat - 0.2) * 3;
            for (let i = 0; i < 4; i++) {
                const px = canvas.width * 0.1 + i * canvas.width * 0.27;
                const pr = beat * 70 * (0.4 + i * 0.2);
                const hue = 170 + i * 30 + time;
                ctx.strokeStyle = `hsla(${hue % 360}, 80%, 65%, ${pa * 0.25})`;
                ctx.lineWidth = 1.5;
                ctx.shadowColor = `hsla(${hue % 360}, 80%, 65%, ${pa * 0.4})`;
                ctx.shadowBlur = 8 + beat * 10;
                ctx.beginPath();
                ctx.arc(px, baseY + 10, pr, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }

        // ══════════════════════════════════════
        // ОТРАЖЕНИЯ ОТ ВОДОПАДОВ
        // ══════════════════════════════════════
        const reflAlpha = 0.04 + energy * 0.06;
        // Левое отражение
        const leftRefl = ctx.createLinearGradient(canvas.width * 0.05, baseY, canvas.width * 0.2, baseY);
        leftRefl.addColorStop(0, `rgba(180, 220, 255, ${reflAlpha})`);
        leftRefl.addColorStop(1, 'rgba(180, 220, 255, 0)');
        ctx.fillStyle = leftRefl;
        ctx.fillRect(canvas.width * 0.02, baseY, canvas.width * 0.2, 15);
        // Правое отражение
        const rightRefl = ctx.createLinearGradient(canvas.width * 0.95, baseY, canvas.width * 0.8, baseY);
        rightRefl.addColorStop(0, `rgba(180, 220, 255, ${reflAlpha})`);
        rightRefl.addColorStop(1, 'rgba(180, 220, 255, 0)');
        ctx.fillStyle = rightRefl;
        ctx.fillRect(canvas.width * 0.78, baseY, canvas.width * 0.2, 15);
    }

    function animate() {
        if (!canvas.isConnected) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        time += 1;

        drawRocks();
        drawWaterfall(leftWF, canvas.width * 0.07, 35);
        drawWaterfall(rightWF, canvas.width * 0.93, 35);
        drawRiver();
        drawSplashes();

        // Затухание цунами
        if (window.tsunamiHeight > 0) window.tsunamiHeight *= 0.93;
        if (window.tsunamiHeight < 0.2) window.tsunamiHeight = 0;

        requestAnimationFrame(animate);
    }

    animate();

    window.triggerTsunami = function() {
        window.tsunamiHeight = 50;
        const wave = document.getElementById('tsunamiWave');
        if (wave) {
            wave.style.height = '100px';
            wave.style.background = 'linear-gradient(0deg, rgba(0,200,240,0.7), rgba(0,160,220,0.4), rgba(255,255,255,0.2), transparent)';
            setTimeout(() => wave.style.height = '0', 1500);
        }
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
// ПУЗЫРИ
// ═══════════════════════════════════════════
function initBubbleGame(){
    const canvas=document.getElementById('bubbleCanvas'),section=document.getElementById('certificates');
    if(!canvas||!section)return;
    const ctx=canvas.getContext('2d');
    function resize(){canvas.width=section.offsetWidth;canvas.height=section.offsetHeight;}
    resize();window.addEventListener('resize',resize);
    const bubbles=[];let popCount=0;
    function createBubble(fb=false){return{x:Math.random()*canvas.width,y:fb?canvas.height+40:Math.random()*canvas.height,size:8+Math.random()*22,speed:0.3+Math.random()*0.9,opacity:0.18+Math.random()*0.2,hue:185+Math.random()*30,wobble:Math.random()*Math.PI*2,wobbleSpeed:0.006+Math.random()*0.02,popped:false,popAnim:0,pieces:[],popStart:0};}
    for(let i=0;i<22;i++)bubbles.push(createBubble());
    function popBubble(b){if(b.popped)return;b.popped=true;b.popAnim=0;b.popStart=performance.now();b.pieces=[];for(let i=0;i<8;i++){const a=(Math.PI*2/8)*i;b.pieces.push({x:b.x,y:b.y,vx:Math.cos(a)*(2+Math.random()*4),vy:Math.sin(a)*(2+Math.random()*4),size:b.size*(0.1+Math.random()*0.2),life:1});}popCount++;const el=document.getElementById('bubbleCount');if(el)el.textContent=popCount;if(popCount%20===0&&window.triggerTsunami){window.triggerTsunami();const a=document.getElementById('tsunamiAlert');if(a){a.classList.add('show');setTimeout(()=>a.classList.remove('show'),2000);}}}
    function drawBubbles(){const now=performance.now();bubbles.forEach(b=>{if(b.popped){const e=(now-b.popStart)/1000;if(e>1.5){Object.assign(b,createBubble(true));return;}b.pieces.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.1;p.life=Math.max(0,1-e/1.5);if(p.life>0){ctx.fillStyle=`rgba(120,200,255,${p.life*0.7})`;ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fill();}});return;}b.y-=b.speed;b.x+=Math.sin(b.wobble)*0.5;b.wobble+=b.wobbleSpeed;if(b.y<-50)Object.assign(b,createBubble(true));const g=ctx.createRadialGradient(b.x-b.size*0.25,b.y-b.size*0.3,b.size*0.05,b.x,b.y,b.size);g.addColorStop(0,`hsla(${b.hue},50%,85%,${b.opacity+0.2})`);g.addColorStop(0.6,`hsla(${b.hue},50%,60%,${b.opacity+0.1})`);g.addColorStop(1,`hsla(${b.hue},45%,40%,${b.opacity*0.5})`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,b.y,b.size,0,Math.PI*2);ctx.fill();ctx.strokeStyle=`rgba(255,255,255,${b.opacity*0.35})`;ctx.lineWidth=1;ctx.stroke();ctx.fillStyle=`rgba(255,255,255,${b.opacity*0.5})`;ctx.beginPath();ctx.arc(b.x-b.size*0.2,b.y-b.size*0.25,b.size*0.18,0,Math.PI*2);ctx.fill();});}
    canvas.addEventListener('mousemove',function(e){const r=canvas.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;for(let i=0;i<bubbles.length;i++)if(!bubbles[i].popped&&Math.hypot(mx-bubbles[i].x,my-bubbles[i].y)<bubbles[i].size)popBubble(bubbles[i]);});
    function animate(){if(!canvas.isConnected)return;ctx.clearRect(0,0,canvas.width,canvas.height);drawBubbles();requestAnimationFrame(animate);}
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
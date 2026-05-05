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
    let ti=0,ci=0,del=false,sp=100;
    function type(){const t=texts[ti];el.textContent=del?t.substring(0,ci-1):t.substring(0,ci+1);if(del){ci--;sp=50;}else{ci++;sp=100;}if(!del&&ci===t.length){del=true;sp=1500;}else if(del&&ci===0){del=false;ti=(ti+1)%texts.length;sp=500;}setTimeout(type,sp);}
    setTimeout(type,1000);
}

// ═══════════════════════════════════════════
// АНИМАЦИИ ПРИ ПРОКРУТКЕ
// ═══════════════════════════════════════════
function animateOnScroll(){document.querySelectorAll('.animate-on-scroll').forEach(el=>{if(el.getBoundingClientRect().top<window.innerHeight-150){el.classList.add('animated');if(el.id==='about')setTimeout(()=>{animateTechBars();animateCounters();},300);}});}
window.addEventListener('load',animateOnScroll);window.addEventListener('scroll',animateOnScroll);

// Мобильное меню
const mb=document.getElementById('mobileMenuBtn'),nm=document.getElementById('navMenu');
if(mb&&nm)mb.addEventListener('click',()=>{nm.classList.toggle('active');mb.innerHTML=nm.classList.contains('active')?'<i class="fas fa-times"></i>':'<i class="fas fa-bars"></i>';});
document.querySelectorAll('nav ul li a').forEach(l=>l.addEventListener('click',()=>{if(nm)nm.classList.remove('active');if(mb)mb.innerHTML='<i class="fas fa-bars"></i>';}));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',function(e){e.preventDefault();const t=document.querySelector(this.getAttribute('href'));if(t)window.scrollTo({top:t.offsetTop-80,behavior:'smooth'});}));

// Кнопка вверх
const sb=document.getElementById('scrollToTop');window.addEventListener('scroll',()=>{if(sb)sb.classList.toggle('visible',window.pageYOffset>300);});if(sb)sb.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// Анимации тех-стека
function animateTechBars(){document.querySelectorAll('.percentage-fill[data-width]').forEach(el=>el.style.width=el.getAttribute('data-width')+'%');}
function animateCounters(){document.querySelectorAll('.counter').forEach(c=>{const t=+c.getAttribute('data-target'),cur=+c.innerText,inc=t/200;if(cur<t){const upd=()=>{const n=+c.innerText;if(n<t){c.innerText=Math.ceil(n+inc);setTimeout(upd,10);}else c.innerText=t;};upd();}});}

// Частицы
function initParticles(){const sec=document.getElementById('about');if(!sec||document.getElementById('particles-canvas'))return;const cont=document.getElementById('particles-js');if(!cont)return;const canvas=document.createElement('canvas');canvas.id='particles-canvas';cont.appendChild(canvas);const ctx=canvas.getContext('2d');function resize(){canvas.width=cont.offsetWidth;canvas.height=cont.offsetHeight;}resize();window.addEventListener('resize',resize);const digits=['0','1'],particles=[];for(let i=0;i<60;i++)particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,size:Math.random()*12+8,speed:Math.random()*0.4+0.1,digit:digits[Math.floor(Math.random()*2)],opacity:Math.random()*0.25+0.05,dir:Math.random()*Math.PI*2});function draw(){if(!canvas.isConnected)return;ctx.clearRect(0,0,canvas.width,canvas.height);particles.forEach(p=>{p.x+=Math.cos(p.dir)*p.speed;p.y+=Math.sin(p.dir)*p.speed;if(p.x<-20)p.x=canvas.width+20;if(p.x>canvas.width+20)p.x=-20;if(p.y<-20)p.y=canvas.height+20;if(p.y>canvas.height+20)p.y=-20;ctx.fillStyle=`rgba(0,163,54,${p.opacity})`;ctx.font=`${p.size}px 'Courier New',monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(p.digit,p.x,p.y);});requestAnimationFrame(draw);}draw();}

// Круговая диаграмма
function drawSkillsChart(){const canvas=document.getElementById('skillsChart');if(!canvas)return;const container=canvas.parentElement,size=Math.min(container.offsetWidth-40,280);canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d'),cx=size/2,cy=size/2,r=size*0.38;const catData={};document.querySelectorAll('.tech-category').forEach(cat=>{const n=cat.querySelector('h4').textContent,ps=[];cat.querySelectorAll('.skill-percentage').forEach(sp=>ps.push(parseInt(sp.textContent)));if(ps.length)catData[n]=Math.round(ps.reduce((a,b)=>a+b,0)/ps.length);});const items=Object.entries(catData);if(!items.length)return;const colors=['#00a336','#00d44c','#4dabf7','#ffd700','#ff6b6b','#a29bfe','#fd79a8','#00cec9'],total=items.reduce((s,[,v])=>s+v,0);let angle=-Math.PI/2,legend='';ctx.clearRect(0,0,size,size);items.forEach(([name,value],i)=>{const slice=(value/total)*2*Math.PI,color=colors[i%colors.length];ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,angle,angle+slice);ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.strokeStyle='white';ctx.lineWidth=2;ctx.stroke();const mid=angle+slice/2;if(slice>0.5){ctx.fillStyle='#fff';ctx.font='bold 11px "Segoe UI"';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(value+'%',cx+Math.cos(mid)*r*0.6,cy+Math.sin(mid)*r*0.6);}legend+=`<div style="display:flex;align-items:flex-start;margin-bottom:8px;gap:8px;"><span style="background:${color};min-width:14px;width:14px;height:14px;border-radius:3px;display:inline-block;margin-top:2px;"></span><span style="font-size:13px;line-height:1.4;">${name} — <strong>${value}%</strong></span></div>`;angle+=slice;});ctx.beginPath();ctx.arc(cx,cy,r*0.45,0,2*Math.PI);ctx.fillStyle='#fff';ctx.fill();document.getElementById('chartLegend').innerHTML=legend;}
let chartDrawn=false;window.addEventListener('load',()=>setTimeout(drawSkillsChart,1000));window.addEventListener('scroll',()=>{if(document.getElementById('about')?.classList.contains('animated')&&!chartDrawn){drawSkillsChart();chartDrawn=true;}});

// ═══════════════════════════════════════════
// МУЗЫКА
// ═══════════════════════════════════════════
let audioCtx,analyser,audioSource,musicPlaylist=[],currentTrack=0,isMusicPlaying=false;
window.symphonyBass=0.3;window.symphonyBeat=0;
const musicAudio=document.getElementById('musicAudio'),musicToggle=document.getElementById('musicToggle'),musicTitle=document.getElementById('musicTitle'),musicVolume=document.getElementById('musicVolume'),musicNext=document.getElementById('musicNext');
function loadMusicPlaylist(){fetch('/api/music').then(r=>r.json()).then(tracks=>{musicPlaylist=tracks;if(tracks.length)loadTrack(0);});}
function loadTrack(i){if(!musicPlaylist.length)return;currentTrack=i;const t=musicPlaylist[currentTrack];musicAudio.src='/'+t.file_path;musicTitle.textContent=t.title;if(isMusicPlaying)musicAudio.play();}
function toggleMusic(){if(!musicPlaylist.length)return;if(isMusicPlaying){musicAudio.pause();isMusicPlaying=false;musicToggle.textContent='🔇';}else{if(!audioCtx)initAudio();musicAudio.play();isMusicPlaying=true;musicToggle.textContent='🔊';}}
function initAudio(){audioCtx=new(window.AudioContext||window.webkitAudioContext)();analyser=audioCtx.createAnalyser();analyser.fftSize=128;analyser.smoothingTimeConstant=0.85;audioSource=audioCtx.createMediaElementSource(musicAudio);audioSource.connect(analyser);analyser.connect(audioCtx.destination);}
function updateBass(){if(!analyser||!isMusicPlaying){window.symphonyBass=window.symphonyBass*0.9+0.3*0.1;window.symphonyBeat=0;return;}const d=new Uint8Array(analyser.frequencyBinCount);analyser.getByteFrequencyData(d);let b=0;for(let i=0;i<8;i++)b+=d[i];b=b/8/255;window.symphonyBass=window.symphonyBass*0.65+b*0.35;window.symphonyBeat=b>0.45?1:0;}
setInterval(updateBass,33);
if(musicToggle)musicToggle.addEventListener('click',toggleMusic);
if(musicNext)musicNext.addEventListener('click',()=>{if(!musicPlaylist.length)return;loadTrack((currentTrack+1)%musicPlaylist.length);if(isMusicPlaying)musicAudio.play();});
if(musicVolume)musicVolume.addEventListener('input',()=>{musicAudio.volume=musicVolume.value/100;});
musicAudio.addEventListener('ended',()=>{if(musicPlaylist.length){loadTrack((currentTrack+1)%musicPlaylist.length);musicAudio.play();}});
musicAudio.volume=0.3;if(musicVolume)musicVolume.value=30;

// ═══════════════════════════════════════════
// ВОДОПАДЫ + РЕКА (РАБОЧАЯ ВЕРСИЯ)
// ═══════════════════════════════════════════
function initWaterfallGame(){
    const canvas=document.getElementById('waterfallCanvas'),gallery=document.querySelector('.gallery');
    if(!canvas||!gallery)return;
    const ctx=canvas.getContext('2d');let W,H,time=0,splashes=[];
    function resize(){W=gallery.offsetWidth;H=gallery.offsetHeight;canvas.width=W;canvas.height=H;}
    resize();window.addEventListener('resize',resize);
    const leftWF=[],rightWF=[];
    function createDrop(side){const bx=side==='left'?W*0.07:W*0.93;return{x:bx+(Math.random()-0.5)*25,y:Math.random()*H*0.4,speed:1.5+Math.random()*3,size:1.5+Math.random()*3,opacity:0.2+Math.random()*0.4,hue:190+Math.random()*25,splashed:false};}
    for(let i=0;i<50;i++){leftWF.push(createDrop('left'));rightWF.push(createDrop('right'));}
    window.tsunamiHeight=0;

    function drawRocks(){
        const lg=ctx.createLinearGradient(0,0,W*0.13,0);lg.addColorStop(0,'rgba(40,45,50,0.5)');lg.addColorStop(1,'rgba(55,60,65,0)');ctx.fillStyle=lg;ctx.beginPath();ctx.moveTo(0,H*0.05);ctx.quadraticCurveTo(W*0.06,H*0.18,W*0.1,H*0.5);ctx.lineTo(W*0.07,H*0.85);ctx.lineTo(0,H);ctx.closePath();ctx.fill();
        const rg=ctx.createLinearGradient(W,0,W*0.87,0);rg.addColorStop(0,'rgba(40,45,50,0.5)');rg.addColorStop(1,'rgba(55,60,65,0)');ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(W,H*0.05);ctx.quadraticCurveTo(W*0.94,H*0.18,W*0.9,H*0.5);ctx.lineTo(W*0.93,H*0.85);ctx.lineTo(W,H);ctx.closePath();ctx.fill();
    }

    function drawWaterfall(particles,x,w){
        const mist=ctx.createLinearGradient(x,H*0.05,x,H*0.7);mist.addColorStop(0,'rgba(220,240,255,0.15)');mist.addColorStop(1,'rgba(100,180,220,0.02)');ctx.fillStyle=mist;ctx.fillRect(x-w/2,H*0.02,w,H*0.72);
        particles.forEach(p=>{p.y+=p.speed;if(p.y>H*0.72&&!p.splashed){p.splashed=true;for(let s=0;s<6;s++)splashes.push({x:x+(Math.random()-0.5)*w,y:H*0.72,vx:(Math.random()-0.5)*5,vy:-Math.random()*8-2,life:1,size:1+Math.random()*3});p.y=Math.random()*H*0.2;p.splashed=false;}ctx.fillStyle=`hsla(${p.hue},60%,80%,${p.opacity})`;ctx.beginPath();ctx.ellipse(p.x,p.y,p.size,p.size*1.8,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=`rgba(255,255,255,${p.opacity*0.7})`;ctx.beginPath();ctx.arc(p.x-p.size*0.2,p.y-p.size*0.3,p.size*0.4,0,Math.PI*2);ctx.fill();});
    }

    function drawRiver(){
        const bass=window.symphonyBass||0.3;const beat=window.symphonyBeat||0;
        const baseY=H*0.72;const riverSpeed=1.5+bass*4+beat*2;

        // Зеркало воды
        const mirror=ctx.createLinearGradient(0,baseY-20,0,H);mirror.addColorStop(0,'rgba(100,190,240,0.08)');mirror.addColorStop(1,'rgba(5,30,80,0.4)');ctx.fillStyle=mirror;ctx.fillRect(0,baseY,W,H-baseY);

        // Свечение при басах
        if(bass>0.2){const glow=ctx.createRadialGradient(W*0.3,baseY+30,5,W*0.3,baseY+25,W*0.5);glow.addColorStop(0,`rgba(0,255,180,${bass*0.5})`);glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,baseY-30,W,H-baseY+30);}

        // ТЕЧЕНИЕ — горизонтальные полосы
        for(let y=baseY;y<H;y+=6){
            const df=(y-baseY)/(H-baseY);const alpha=0.06-df*0.04;const hue=240-df*60;
            for(let x=0;x<W;x+=2){
                const offset=time*riverSpeed*(1-df*0.5);
                const wy=y+Math.sin((x+offset)/80+y*0.02)*(2+bass*6);
                const br=0.4+Math.abs(Math.sin((x+offset)/60+y*0.01))*0.6;
                ctx.fillStyle=`hsla(${hue},50%,${50+br*20}%,${alpha*br})`;ctx.fillRect(x,wy,3,2);
            }
        }

        // Поверхностные волны
        for(let x=0;x<W;x+=2){
            const offset=time*riverSpeed;
            const y1=baseY+Math.sin((x+offset)/70)*(4+bass*15+beat*10)+Math.cos((x-offset*0.4)/45)*(3+bass*8)+Math.sin((x+offset*0.7)/120)*(2+bass*5);
            const foam=Math.sin((x+offset)/70)>0.75?0.5+beat*0.5:0;
            ctx.fillStyle=`rgba(100,180,255,${0.3+bass*0.4})`;ctx.fillRect(x,y1,3,3);
            if(foam>0.3){ctx.fillStyle=`rgba(200,220,255,${foam})`;ctx.fillRect(x,y1-1,3,1);}
        }

        // Блики
        const bc=Math.floor(20+bass*25);for(let i=0;i<bc;i++){const bx=(time*riverSpeed*0.5+i*W/bc)%W;const by=baseY+2+Math.sin(bx/30+time)*(3+bass*5);const ba=0.15+Math.abs(Math.sin(time*0.05+i*0.3))*(0.2+bass*0.4+beat*0.3);ctx.fillStyle=`rgba(200,200,255,${ba})`;ctx.fillRect(bx,by,2,1);}

        // Вспышка на удар
        if(beat){const flash=ctx.createRadialGradient(W/2,baseY,W*0.05,W/2,baseY,W*0.7);flash.addColorStop(0,'rgba(180,130,255,0.5)');flash.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=flash;ctx.fillRect(0,baseY-30,W,H-baseY+30);for(let i=0;i<5;i++){const sx=W*0.1+Math.random()*W*0.8;const sy=baseY-Math.random()*15;ctx.fillStyle='rgba(220,200,255,0.8)';ctx.shadowColor='rgba(200,150,255,0.9)';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(sx,sy,2+Math.random()*4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}}
    }

    function animate(ts){if(!canvas.isConnected)return;time=ts*0.001;ctx.clearRect(0,0,W,H);drawRocks();drawWaterfall(leftWF,W*0.07,35);drawWaterfall(rightWF,W*0.93,35);drawRiver();splashes.forEach(d=>{d.x+=d.vx;d.y+=d.vy;d.vy+=0.06;d.life-=0.014;if(d.life>0){ctx.fillStyle=`rgba(220,245,255,${d.life*0.8})`;ctx.beginPath();ctx.arc(d.x,d.y,d.size*d.life,0,Math.PI*2);ctx.fill();}});for(let i=splashes.length-1;i>=0;i--){if(splashes[i].life<=0)splashes.splice(i,1);}if(window.tsunamiHeight>0)window.tsunamiHeight*=0.92;if(window.tsunamiHeight<0.2)window.tsunamiHeight=0;requestAnimationFrame(animate);}
    requestAnimationFrame(animate);

    window.triggerTsunami=function(){window.tsunamiHeight=60;const wave=document.getElementById('tsunamiWave');if(wave){wave.style.height='130px';wave.style.background='linear-gradient(0deg, rgba(0,230,255,0.9), rgba(0,180,240,0.6), transparent)';setTimeout(()=>wave.style.height='0',1500);}};
}

// ═══════════════════════════════════════════
// СОБАЧКА
// ═══════════════════════════════════════════
function initDogBoat(){const dog=document.getElementById('dogBoat'),gallery=document.querySelector('.gallery');if(!dog||!gallery)return;let dragging=false,px,py,vx=0,vy=0,animId;function setPos(x,y){const r=gallery.getBoundingClientRect();x=Math.max(30,Math.min(x,r.width-80));y=Math.max(50,Math.min(y,r.height-80));dog.style.left=x+'px';dog.style.top=y+'px';dog.style.bottom='auto';dog.style.transform='none';}function physics(){const r=gallery.getBoundingClientRect();let x=parseFloat(dog.style.left)||r.width/2,y=parseFloat(dog.style.top)||r.height*0.7;x+=vx;y+=vy;vx*=0.93;vy*=0.93;if(x<=30){x=30;vx=Math.abs(vx)*0.3;}if(x>=r.width-80){x=r.width-80;vx=-Math.abs(vx)*0.3;}if(y<=50){y=50;vy=Math.abs(vy)*0.3;}if(y>=r.height-80){y=r.height-80;vy=-Math.abs(vy)*0.3;}dog.style.left=x+'px';dog.style.top=y+'px';dog.style.transform='none';if(Math.abs(vx)>0.08||Math.abs(vy)>0.08)animId=requestAnimationFrame(physics);}dog.addEventListener('mousedown',e=>{dragging=true;cancelAnimationFrame(animId);px=e.clientX;py=e.clientY;dog.style.cursor='grabbing';e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const gr=gallery.getBoundingClientRect();setPos(e.clientX-gr.left-40,e.clientY-gr.top-30);px=e.clientX;py=e.clientY;});document.addEventListener('mouseup',e=>{if(!dragging)return;dragging=false;dog.style.cursor='grab';vx=(e.clientX-px)*6;vy=(e.clientY-py)*6;physics();});let autoAngle=0;setInterval(()=>{if(!dragging&&(!animId||Math.abs(vx)<0.08)){autoAngle+=0.012;const r=gallery.getBoundingClientRect();setPos(r.width/2+Math.sin(autoAngle)*70,r.height*0.7+Math.cos(autoAngle*0.6)*15);}},50);setTimeout(()=>{const r=gallery.getBoundingClientRect();setPos(r.width/2,r.height*0.7);},500);}

// ═══════════════════════════════════════════
// ПУЗЫРИ
// ═══════════════════════════════════════════
function initBubbleGame(){const canvas=document.getElementById('bubbleCanvas'),section=document.getElementById('certificates');if(!canvas||!section)return;const ctx=canvas.getContext('2d');let W,H,popCount=0;function resize(){W=section.offsetWidth;H=section.offsetHeight;canvas.width=W;canvas.height=H;}resize();window.addEventListener('resize',resize);const bubbles=[];for(let i=0;i<20;i++)bubbles.push({x:Math.random()*W,y:Math.random()*H,size:8+Math.random()*20,speed:0.3+Math.random()*0.8,opacity:0.2+Math.random()*0.3,hue:180+Math.random()*50,wobble:Math.random()*Math.PI*2,wobbleSpeed:0.005+Math.random()*0.015,popped:false,popTime:0,particles:[]});function popBubble(b){if(b.popped)return;b.popped=true;b.popTime=performance.now();b.particles=[];for(let i=0;i<12;i++){const a=(Math.PI*2/12)*i;b.particles.push({x:b.x,y:b.y,vx:Math.cos(a)*(2+Math.random()*4),vy:Math.sin(a)*(2+Math.random()*4),life:1,size:2+Math.random()*3,hue:b.hue});}popCount++;const el=document.getElementById('bubbleCount');if(el)el.textContent=popCount;if(popCount%20===0&&window.triggerTsunami){window.triggerTsunami();const a=document.getElementById('tsunamiAlert');if(a){a.classList.add('show');setTimeout(()=>a.classList.remove('show'),2000);}}}
    function drawBubbles(){const now=performance.now();const bass=window.symphonyBass||0.3;bubbles.forEach(b=>{if(b.popped){const e=(now-b.popTime)/1000;if(e>1.5){Object.assign(b,{x:Math.random()*W,y:H+50,popped:false,particles:[]});return;}b.particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.04;p.life-=0.025;if(p.life>0){ctx.fillStyle=`hsla(${p.hue},80%,70%,${p.life})`;ctx.shadowColor=`hsla(${p.hue},90%,65%,${p.life*0.8})`;ctx.shadowBlur=8;ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}});const rR=e*80,rA=Math.max(0,1-e/1.5);ctx.strokeStyle=`rgba(255,255,255,${rA})`;ctx.lineWidth=2;ctx.shadowColor=`rgba(200,240,255,${rA})`;ctx.shadowBlur=15;ctx.beginPath();ctx.arc(b.x,b.y,rR,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;return;}b.y-=b.speed*(1+bass);b.x+=Math.sin(b.wobble)*0.5;b.wobble+=b.wobbleSpeed*(1+bass);if(b.y<-50){b.y=H+50;b.x=Math.random()*W;}const glow=ctx.createRadialGradient(b.x,b.y,b.size*0.3,b.x,b.y,b.size*1.8);glow.addColorStop(0,`hsla(${b.hue},60%,65%,${0.15+bass*0.3})`);glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(b.x,b.y,b.size*1.8,0,Math.PI*2);ctx.fill();const grad=ctx.createRadialGradient(b.x-b.size*0.2,b.y-b.size*0.2,b.size*0.05,b.x,b.y,b.size);grad.addColorStop(0,`hsla(${b.hue},55%,88%,0.85)`);grad.addColorStop(0.5,`hsla(${b.hue},50%,62%,0.55)`);grad.addColorStop(1,`hsla(${b.hue},40%,30%,0.2)`);ctx.fillStyle=grad;ctx.beginPath();ctx.arc(b.x,b.y,b.size,0,Math.PI*2);ctx.fill();ctx.strokeStyle=`hsla(${b.hue},60%,75%,${0.4+bass*0.4})`;ctx.lineWidth=1.5+bass;ctx.shadowColor=`hsla(${b.hue},70%,65%,${0.3+bass*0.4})`;ctx.shadowBlur=4+bass*6;ctx.beginPath();ctx.arc(b.x,b.y,b.size,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='rgba(255,255,255,0.7)';ctx.beginPath();ctx.arc(b.x-b.size*0.2,b.y-b.size*0.2,b.size*0.2,0,Math.PI*2);ctx.fill();});}
    canvas.addEventListener('mousemove',function(e){const r=canvas.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;for(let i=0;i<bubbles.length;i++){if(!bubbles[i].popped&&Math.hypot(mx-bubbles[i].x,my-bubbles[i].y)<bubbles[i].size+4)popBubble(bubbles[i]);}});
    canvas.addEventListener('click',function(e){const r=canvas.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;for(let i=0;i<bubbles.length;i++){if(!bubbles[i].popped&&Math.hypot(mx-bubbles[i].x,my-bubbles[i].y)<bubbles[i].size+10){popBubble(bubbles[i]);break;}}});
    function animate(){if(!canvas.isConnected)return;ctx.clearRect(0,0,W,H);drawBubbles();requestAnimationFrame(animate);}animate();}

// ═══════════════════════════════════════════
// ПРОСМОТРЩИК ФОТО
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded',()=>{const viewer=document.getElementById('imageViewer'),vImg=document.getElementById('viewerImage'),vCap=document.getElementById('viewerCaption');if(!viewer||!vImg)return;let allItems=[],curIdx=0,zoomLevel=1;function getVisible(){return Array.from(document.querySelectorAll('#galleryGrid .gallery-item')).filter(i=>window.getComputedStyle(i).display!=='none');}function resetZoom(){zoomLevel=1;vImg.style.transform='translate(-50%,-50%) scale(1)';}function openViewer(imgEl,idx){allItems=getVisible();curIdx=idx;const img=imgEl.querySelector('img')||imgEl;vImg.src=img.getAttribute('data-full')||img.src;vCap.textContent=img.alt||'';viewer.style.display='block';document.body.style.overflow='hidden';resetZoom();}function closeViewer(){viewer.style.display='none';document.body.style.overflow='auto';}function navigate(dir){allItems=getVisible();if(!allItems.length)return;curIdx=(curIdx+dir+allItems.length)%allItems.length;const item=allItems[curIdx],img=item.querySelector('img');vImg.src=img.getAttribute('data-full')||img.src;vCap.textContent=img.alt||'';resetZoom();}document.getElementById('zoomInBtn')?.addEventListener('click',e=>{e.stopPropagation();if(zoomLevel<3){zoomLevel+=0.2;vImg.style.transform=`translate(-50%,-50%) scale(${zoomLevel})`;}});document.getElementById('zoomOutBtn')?.addEventListener('click',e=>{e.stopPropagation();if(zoomLevel>0.5){zoomLevel-=0.2;vImg.style.transform=`translate(-50%,-50%) scale(${zoomLevel})`;}});document.getElementById('resetZoomBtn')?.addEventListener('click',e=>{e.stopPropagation();resetZoom();});document.getElementById('galleryGrid')?.addEventListener('click',function(e){const item=e.target.closest('.gallery-item');if(item)openViewer(item,Array.from(this.querySelectorAll('.gallery-item')).indexOf(item));});document.getElementById('certificatesGrid')?.addEventListener('click',function(e){const item=e.target.closest('.certificate-item');if(!item)return;const img=item.querySelector('img');if(!img)return;vImg.src=img.getAttribute('data-full')||img.src;vCap.textContent=img.alt||'';viewer.style.display='block';document.body.style.overflow='hidden';resetZoom();});document.getElementById('closeViewer')?.addEventListener('click',closeViewer);viewer.addEventListener('click',e=>{if(e.target===viewer)closeViewer();});document.getElementById('prevBtn')?.addEventListener('click',e=>{e.stopPropagation();navigate(-1);});document.getElementById('nextBtn')?.addEventListener('click',e=>{e.stopPropagation();navigate(1);});document.addEventListener('keydown',e=>{if(viewer.style.display==='block'){if(e.key==='Escape')closeViewer();if(e.key==='ArrowRight')navigate(1);if(e.key==='ArrowLeft')navigate(-1);}});});

// Фильтр сертификатов
document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('.filter-btn').forEach(b=>b.addEventListener('click',function(){document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));this.classList.add('active');const c=this.getAttribute('data-course');document.querySelectorAll('.certificate-item').forEach(i=>i.style.display=(c==='all'||i.getAttribute('data-course')===c)?'block':'none');}));});

// ═══════════════════════════════════════════
// ЗАПУСК
// ═══════════════════════════════════════════
window.addEventListener('load',()=>{initTypingEffect();initParticles();initWaterfallGame();initDogBoat();initBubbleGame();setTimeout(loadMusicPlaylist,1000);});
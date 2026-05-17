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
// СИМФОНИЯ — ПОЛИФОНИЯ + ТРОЙНОЙ ШАР
// ═══════════════════════════════════════════
const TOTAL_KEYS = 36;
let wavePosition = TOTAL_KEYS / 2;
let waveSpeed = 0.6;

function createPiano() {
    const container = document.getElementById('pianoContainer');
    if (!container) return;
    const keys = [];
    for (let i = 0; i < TOTAL_KEYS; i++) {
        const pos = i % 12;
        keys.push([1,3,6,8,10].includes(pos) ? 'black' : 'white');
    }
    container.innerHTML = '';
    keys.forEach((type, i) => {
        const key = document.createElement('div');
        key.className = `piano-key ${type}`;
        key.dataset.index = i;
        container.appendChild(key);
    });
}

// Создаём кольца шара
function createOrbRings() {
    const orb = document.getElementById('neonOrb');
    if (!orb || document.querySelector('.orb-ring')) return;
    ['bass', 'mid', 'high'].forEach(type => {
        const ring = document.createElement('div');
        ring.className = `orb-ring ${type}`;
        orb.appendChild(ring);
    });
}

// 3 типа эффектов
function spawnEffect(x, y, intensity, type) {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;
    const effect = document.createElement('div');
    effect.className = `key-effect ${type}`;
    const hue = type === 'circle' ? 150 : type === 'line' ? 200 : 280;
    const angle = -Math.PI/2 + (Math.random()-0.5)*1.6;
    const distance = 80 + intensity * 220;
    const duration = 0.8 + Math.random() * 1.5;

    let style = `
        left: ${x}px; top: ${y}px;
        animation: keyFly ${duration}s ease-out forwards;
        --dx: ${Math.cos(angle)*distance}px;
        --dy: ${Math.sin(angle)*distance}px;
    `;

    if (type === 'circle') {
        const size = 5 + intensity * 16;
        style += `width:${size}px;height:${size}px;background:hsla(${hue},90%,60%,0.85);box-shadow:0 0 ${10+intensity*30}px hsla(${hue},90%,55%,0.7);`;
    } else if (type === 'line') {
        style += `width:${3+intensity*12}px;height:${2+intensity*4}px;background:hsla(${hue},80%,65%,0.8);box-shadow:0 0 ${8+intensity*20}px hsla(${hue},80%,60%,0.6);`;
    } else {
        const size = 3 + intensity * 10;
        style += `width:${size}px;height:${size}px;background:white;box-shadow:0 0 ${12+intensity*25}px white,0 0 ${25+intensity*40}px hsla(${hue},80%,70%,0.6);clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);`;
    }
    effect.style.cssText = style;
    gallery.appendChild(effect);
    setTimeout(() => effect.remove(), duration*1000+100);
}

function animatePiano(bass, beat, mid, high) {
    const keys = document.querySelectorAll('.piano-key');
    if (keys.length === 0) return;

    // Сброс
    keys.forEach(k => { k.classList.remove('active'); k.style.transform=''; k.style.boxShadow=''; });

    // Скорость волны зависит от mid
    waveSpeed = 0.4 + mid * 3;
    wavePosition += waveSpeed;
    if (wavePosition >= TOTAL_KEYS) wavePosition -= TOTAL_KEYS;

    // Полифония — 2 волны
    const waveWidth = 5 + Math.floor(bass * 2);
    const center1 = Math.floor(wavePosition);
    const center2 = Math.floor((wavePosition + TOTAL_KEYS/3) % TOTAL_KEYS);
    const center3 = Math.floor((wavePosition + TOTAL_KEYS*2/3) % TOTAL_KEYS);

    [center1, center2, center3].forEach(center => {
        for (let i = -waveWidth; i <= waveWidth; i++) {
            const idx = ((center+i)%TOTAL_KEYS+TOTAL_KEYS)%TOTAL_KEYS;
            const dist = Math.abs(i);
            const brightness = Math.max(0, 1-dist/(waveWidth+1));
            if (brightness>0.02 && keys[idx]) {
                keys[idx].classList.add('active');
                keys[idx].style.transform = `translateY(${2+brightness*5}px)`;
                keys[idx].style.boxShadow = `0 0 ${6+brightness*20}px rgba(0,255,150,${0.15+brightness*0.4})`;
            }
        }
    });

    const gr = document.querySelector('.gallery').getBoundingClientRect();

    // Удар — залп звёзд
    if (beat) {
        for (let i=0;i<14;i++) setTimeout(()=>{
            const k=keys[Math.floor(Math.random()*TOTAL_KEYS)];
            if(k){const r=k.getBoundingClientRect();spawnEffect(r.left-gr.left+r.width/2,r.top-gr.top,0.8,'star');}
        },i*20);
    }

    // Басы — круги
    if (bass>0.25 && Math.random()<bass*0.6) {
        const k=keys[Math.floor(Math.random()*12)];
        if(k){const r=k.getBoundingClientRect();spawnEffect(r.left-gr.left+r.width/2,r.top-gr.top,bass,'circle');}
    }

    // Миды — линии
    if (mid>0.2 && Math.random()<mid*0.5) {
        const k=keys[12+Math.floor(Math.random()*12)];
        if(k){const r=k.getBoundingClientRect();spawnEffect(r.left-gr.left+r.width/2,r.top-gr.top,mid,'line');}
    }

    // Хаи — звёзды
    if (high>0.2 && Math.random()<high*0.6) {
        const k=keys[24+Math.floor(Math.random()*12)];
        if(k){const r=k.getBoundingClientRect();spawnEffect(r.left-gr.left+r.width/2,r.top-gr.top,high,'star');}
    }
}

// Тройной шар
let orbPhase = 0;
function animateOrb(bass, beat, mid, high) {
    const orb = document.getElementById('neonOrb');
    if (!orb) return;
    const core = orb.querySelector('.orb-core');
    const rings = orb.querySelectorAll('.orb-ring');

    orbPhase += 0.02 + bass*0.08;
    const breath = 1 + Math.sin(orbPhase)*0.3;
    orb.style.transform = `translate(-50%,-50%) scale(${breath+beat*0.4})`;

    // Кольца
    if (rings[0]) {
        rings[0].style.borderColor = `rgba(0,255,180,${0.3+bass*0.6})`;
        rings[0].style.boxShadow = `0 0 ${20+bass*60}px rgba(0,255,180,${0.2+bass*0.4})`;
        rings[0].style.transform = `translate(-50%,-50%) scale(${1+bass*0.3})`;
    }
    if (rings[1]) {
        rings[1].style.borderColor = `rgba(100,200,255,${0.3+mid*0.6})`;
        rings[1].style.boxShadow = `0 0 ${15+mid*50}px rgba(100,200,255,${0.2+mid*0.4})`;
        rings[1].style.transform = `translate(-50%,-50%) scale(${1+mid*0.25})`;
    }
    if (rings[2]) {
        rings[2].style.borderColor = `rgba(255,255,255,${0.3+high*0.6})`;
        rings[2].style.boxShadow = `0 0 ${10+high*40}px rgba(255,255,255,${0.2+high*0.4})`;
        rings[2].style.transform = `translate(-50%,-50%) scale(${1+high*0.2})`;
    }

    // Ядро
    if (core) {
        core.style.boxShadow = `0 0 ${15+bass*40}px rgba(0,255,180,${0.6+bass*0.4})`;
        core.style.transform = `translate(-50%,-50%) scale(${1+beat*0.5})`;
    }

    // Частицы
    if (beat) {
        for (let i=0;i<10;i++) {
            const p=document.createElement('div');
            p.className='orb-particle';
            const a=Math.random()*Math.PI*2,d=35+Math.random()*70;
            p.style.cssText=`left:50%;top:50%;width:${2+Math.random()*4}px;height:${2+Math.random()*4}px;background:rgba(0,255,180,0.8);--px:${Math.cos(a)*d}px;--py:${Math.sin(a)*d}px;box-shadow:0 0 ${6+Math.random()*10}px rgba(0,255,180,0.6);animation:particleFly 0.8s ease-out forwards;`;
            orb.appendChild(p);
            setTimeout(()=>p.remove(),900);
        }
    }

    // Звёзды ярче под музыку
    const stars = document.querySelector('.gallery');
    if (stars) stars.style.setProperty('--star-opacity', 0.7 + bass * 0.3);
}

const s = document.createElement('style');
s.textContent = `
    @keyframes keyFly{0%{opacity:.9;transform:translateY(0)translateX(0)scale(1)}100%{opacity:0;transform:translateY(var(--dy))translateX(var(--dx))scale(.1)}}
    @keyframes particleFly{0%{opacity:.8;transform:translate(0,0)scale(1)}100%{opacity:0;transform:translate(var(--px),var(--py))scale(0)}}
`;
document.head.appendChild(s);

window.addEventListener('load',()=>{setTimeout(createPiano,500);setTimeout(createOrbRings,600);});
setInterval(()=>{
    const bass=window.symphonyBass||.3,mid=window.symphonyMid||.2,high=window.symphonyHigh||.1,beat=window.symphonyBeat||0;
    animatePiano(bass,beat,mid,high);
    animateOrb(bass,beat,mid,high);
},33);
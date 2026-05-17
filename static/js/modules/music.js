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
// ГАРМОНИЯ — ПИАНИНО ВОЛНОЙ + КОЛЬЦА ДЫШАТ
// ═══════════════════════════════════════════
const TOTAL_KEYS = 36;
let wavePos = TOTAL_KEYS / 2;
let activeEffects = 0;
const MAX_EFFECTS = 12;

function createPiano() {
    const container = document.getElementById('pianoContainer');
    if (!container) return;
    const keys = [];
    for (let i = 0; i < TOTAL_KEYS; i++) {
        keys.push([1,3,6,8,10].includes(i%12) ? 'black' : 'white');
    }
    container.innerHTML = '';
    keys.forEach((type, i) => {
        const key = document.createElement('div');
        key.className = `piano-key ${type}`;
        key.dataset.index = i;
        container.appendChild(key);
    });
}

function createOrbRings() {
    const orb = document.getElementById('neonOrb');
    if (!orb || document.querySelector('.orb-ring')) return;
    ['bass','mid','high'].forEach(type => {
        const ring = document.createElement('div');
        ring.className = `orb-ring ${type}`;
        orb.appendChild(ring);
    });
}

function spawnEffect(x, y, intensity, type) {
    if (activeEffects >= MAX_EFFECTS) {
        const oldest = document.querySelector('.key-effect');
        if (oldest) { oldest.remove(); activeEffects--; }
    }
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    const effect = document.createElement('div');
    effect.className = 'key-effect';
    const angle = -Math.PI/2 + (Math.random()-0.5)*1.6;
    const distance = 80 + intensity * 220;
    const duration = 0.8 + Math.random() * 1.2;
    const size = 3 + intensity * 10;
    const hue = type === 'circle' ? 150 : type === 'line' ? 200 : 60;
    
    effect.style.cssText = `
        left: ${x}px; top: ${y}px;
        width: ${type==='line'?size:size}px;
        height: ${type==='line'?2+intensity*3:size}px;
        background: ${type==='spark'?'rgba(255,255,255,0.9)':`hsla(${hue},90%,60%,0.85)`};
        border-radius: ${type==='line'?'2px':'50%'};
        box-shadow: 0 0 ${10+intensity*20}px ${type==='spark'?'rgba(255,255,200,0.7)':`hsla(${hue},90%,55%,0.6)`};
        animation: keyFly ${duration}s ease-out forwards;
        --dx: ${Math.cos(angle)*distance}px;
        --dy: ${Math.sin(angle)*distance}px;
    `;
    gallery.appendChild(effect);
    activeEffects++;
    setTimeout(() => { effect.remove(); activeEffects--; }, duration*1000+100);
}

function animatePiano(bass, beat, mid, high) {
    const keys = document.querySelectorAll('.piano-key');
    if (keys.length === 0) return;

    // Плавный сброс
    keys.forEach(k => {
        if (k.classList.contains('active')) {
            k.classList.remove('active');
            k.style.transform = 'translateY(0px)';
            k.style.boxShadow = '';
        }
    });

    // Скорость волны от басов + мидов
    const speed = 0.3 + bass * 2.5 + mid * 1.5;
    wavePos += speed;
    if (wavePos >= TOTAL_KEYS) wavePos -= TOTAL_KEYS;

    // ОДНА плавная волна
    const width = 5 + Math.floor(bass * 2);
    const center = Math.floor(wavePos);

    for (let i = -width; i <= width; i++) {
        const idx = ((center+i)%TOTAL_KEYS+TOTAL_KEYS)%TOTAL_KEYS;
        const dist = Math.abs(i);
        const brightness = Math.max(0, 1-dist/(width+1));
        if (brightness>0.02 && keys[idx]) {
            const pushDown = 2 + brightness * 5;
            keys[idx].classList.add('active');
            keys[idx].style.transform = `translateY(${pushDown}px)`;
            keys[idx].style.boxShadow = `0 0 ${6+brightness*20}px rgba(0,255,150,${0.15+brightness*0.4})`;
        }
    }

    const gr = document.querySelector('.gallery').getBoundingClientRect();

    // Удар — залп искр
    if (beat) {
        for (let i=0;i<8;i++) setTimeout(()=>{
            const k=keys[Math.floor(Math.random()*TOTAL_KEYS)];
            if(k){const r=k.getBoundingClientRect();spawnEffect(r.left-gr.left+r.width/2,r.top-gr.top,0.8,'spark');}
        },i*30);
    }

    // Басы — круги (левая часть)
    if (bass>0.2 && Math.random()<bass*0.45) {
        const k=keys[Math.floor(Math.random()*10)];
        if(k){const r=k.getBoundingClientRect();spawnEffect(r.left-gr.left+r.width/2,r.top-gr.top,bass,'circle');}
    }

    // Миды — линии (центр)
    if (mid>0.18 && Math.random()<mid*0.4) {
        const k=keys[12+Math.floor(Math.random()*12)];
        if(k){const r=k.getBoundingClientRect();spawnEffect(r.left-gr.left+r.width/2,r.top-gr.top,mid,'line');}
    }

    // Хаи — искры (правая часть)
    if (high>0.18 && Math.random()<high*0.45) {
        const k=keys[24+Math.floor(Math.random()*12)];
        if(k){const r=k.getBoundingClientRect();spawnEffect(r.left-gr.left+r.width/2,r.top-gr.top,high,'spark');}
    }
}

// Кольца дышат
let orbPhase = 0;
function animateOrb(bass, beat, mid, high) {
    const orb = document.getElementById('neonOrb');
    if (!orb) return;
    const core = orb.querySelector('.orb-core');
    const rings = orb.querySelectorAll('.orb-ring');

    orbPhase += 0.015 + bass*0.06;
    const breath = 1 + Math.sin(orbPhase)*0.35;
    orb.style.transform = `translate(-50%,-50%) scale(${breath+beat*0.3})`;

    // Каждое кольцо дышит в своём ритме
    if (rings[0]) {
        const s = 1 + Math.sin(orbPhase)*0.25 + bass*0.35;
        rings[0].style.transform = `translate(-50%,-50%) scale(${s})`;
        rings[0].style.borderColor = `rgba(0,255,180,${0.25+bass*0.65})`;
        rings[0].style.boxShadow = `0 0 ${15+bass*50}px rgba(0,255,180,${0.15+bass*0.4})`;
    }
    if (rings[1]) {
        const s = 1 + Math.cos(orbPhase*1.3)*0.2 + mid*0.3;
        rings[1].style.transform = `translate(-50%,-50%) scale(${s})`;
        rings[1].style.borderColor = `rgba(100,200,255,${0.25+mid*0.65})`;
        rings[1].style.boxShadow = `0 0 ${12+mid*40}px rgba(100,200,255,${0.15+mid*0.4})`;
    }
    if (rings[2]) {
        const s = 1 + Math.sin(orbPhase*1.7)*0.15 + high*0.25;
        rings[2].style.transform = `translate(-50%,-50%) scale(${s})`;
        rings[2].style.borderColor = `rgba(255,255,255,${0.25+high*0.65})`;
        rings[2].style.boxShadow = `0 0 ${8+high*35}px rgba(255,255,255,${0.15+high*0.4})`;
    }

    // Ядро
    if (core) {
        core.style.transform = `translate(-50%,-50%) scale(${1+beat*0.5})`;
        core.style.boxShadow = `0 0 ${12+bass*35}px rgba(0,255,180,${0.5+bass*0.5})`;
    }

    // Частицы при ударе
    if (beat) {
        for (let i=0;i<6;i++) {
            const p=document.createElement('div');
            p.className='orb-particle';
            const a=Math.random()*Math.PI*2,d=25+Math.random()*50;
            p.style.cssText=`left:50%;top:50%;width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;background:rgba(0,255,180,0.8);--px:${Math.cos(a)*d}px;--py:${Math.sin(a)*d}px;box-shadow:0 0 ${5+Math.random()*6}px rgba(0,255,180,0.5);animation:particleFly 0.6s ease-out forwards;`;
            orb.appendChild(p);
            setTimeout(()=>p.remove(),700);
        }
    }
}

const styles = document.createElement('style');
styles.textContent = `
    @keyframes keyFly{0%{opacity:.9;transform:translateY(0)translateX(0)scale(1)}100%{opacity:0;transform:translateY(var(--dy))translateX(var(--dx))scale(.06)}}
    @keyframes particleFly{0%{opacity:.8;transform:translate(0,0)scale(1)}100%{opacity:0;transform:translate(var(--px),var(--py))scale(0)}}
`;
document.head.appendChild(styles);

window.addEventListener('load',()=>{setTimeout(createPiano,500);setTimeout(createOrbRings,600);});
setInterval(()=>{
    const bass=window.symphonyBass||.3,mid=window.symphonyMid||.2,high=window.symphonyHigh||.1,beat=window.symphonyBeat||0;
    animatePiano(bass,beat,mid,high);
    animateOrb(bass,beat,mid,high);
},33);
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
// ТРИ ВОЛНЫ + ЧУВСТВИТЕЛЬНЫЕ КОЛЬЦА
// ═══════════════════════════════════════════
function createOrbRings() {
    const orb = document.getElementById('neonOrb');
    if (!orb || document.querySelector('.orb-ring')) return;
    ['bass','mid','high'].forEach(type => {
        const ring = document.createElement('div');
        ring.className = `orb-ring ${type}`;
        orb.appendChild(ring);
    });
}

// Ударная волна кольца
function ringShockwave(ring, intensity, hue) {
    if (!ring) return;
    ring.style.transition = 'none';
    ring.style.transform = 'translate(-50%,-50%) scale(1.6)';
    ring.style.borderWidth = '3px';
    ring.style.borderColor = `hsla(${hue}, 90%, 70%, 0.9)`;
    ring.style.boxShadow = `0 0 ${30+intensity*60}px hsla(${hue}, 90%, 60%, 0.7)`;
    
    requestAnimationFrame(() => {
        ring.style.transition = 'transform 1s ease-out, border-color 1s ease-out, box-shadow 1s ease-out, border-width 0.3s ease-out';
        ring.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.borderWidth = '2px';
    });
}

// ТРИ ВОЛНЫ — бас, мид, хай
let bassWavePos = 0, midWavePos = 0, highWavePos = 0;

function drawWaves(bass, mid, high, beat) {
    const orb = document.getElementById('neonOrb');
    if (!orb) return;
    
    // Удаляем старые волны
    document.querySelectorAll('.sound-wave').forEach(w => w.remove());

    const cx = orb.offsetLeft + orb.offsetWidth/2;
    const cy = orb.offsetTop + orb.offsetHeight/2;

    const waves = [
        { freq: bass, pos: bassWavePos, color: 'rgba(0,255,180,__A__)', radius: 120, speed: 0.5 + bass*3, width: 3 },
        { freq: mid, pos: midWavePos, color: 'rgba(100,200,255,__A__)', radius: 90, speed: 0.7 + mid*3, width: 2 },
        { freq: high, pos: highWavePos, color: 'rgba(255,255,255,__A__)', radius: 60, speed: 1 + high*3, width: 1.5 }
    ];

    waves.forEach((w, i) => {
        w.pos += w.speed;
        if (w.pos >= Math.PI*2) w.pos -= Math.PI*2;
        
        const canvas = document.createElement('canvas');
        canvas.className = 'sound-wave';
        canvas.width = w.radius*2;
        canvas.height = w.radius*2;
        canvas.style.cssText = `
            position: absolute;
            left: ${cx - w.radius}px;
            top: ${cy - w.radius}px;
            width: ${w.radius*2}px;
            height: ${w.radius*2}px;
            pointer-events: none;
            z-index: 0;
        `;
        
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = w.color.replace('__A__', String(0.3 + w.freq*0.5));
        ctx.lineWidth = w.width + beat*2;
        ctx.shadowColor = w.color.replace('__A__', String(0.4 + beat*0.4));
        ctx.shadowBlur = 10 + w.freq*20 + beat*15;
        
        ctx.beginPath();
        const points = 120;
        for (let p = 0; p <= points; p++) {
            const angle = (p/points) * Math.PI*2;
            const amplitude = 8 + w.freq*25 + beat*15;
            const r = w.radius + Math.sin(angle*5 + w.pos)*amplitude + Math.cos(angle*3 - w.pos*0.7)*amplitude*0.5;
            const x = w.radius + Math.cos(angle)*r;
            const y = w.radius + Math.sin(angle)*r;
            p === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        }
        ctx.closePath();
        ctx.stroke();
        
        orb.appendChild(canvas);
        setTimeout(() => canvas.remove(), 50);
    });

    bassWavePos = waves[0].pos;
    midWavePos = waves[1].pos;
    highWavePos = waves[2].pos;
}

// Кольца
let orbPhase = 0;
let prevBass = 0, prevMid = 0, prevHigh = 0;

function animateOrb(bass, beat, mid, high) {
    const orb = document.getElementById('neonOrb');
    if (!orb) return;
    const core = orb.querySelector('.orb-core');
    const rings = orb.querySelectorAll('.orb-ring');

    orbPhase += 0.015 + bass*0.06;
    const breath = 1 + Math.sin(orbPhase)*0.35;
    orb.style.transform = `translate(-50%,-50%) scale(${breath+beat*0.3})`;

    // Бас-кольцо
    if (rings[0]) {
        const s = 1 + bass*0.5 + beat*0.3;
        rings[0].style.transform = `translate(-50%,-50%) scale(${s})`;
        rings[0].style.borderColor = `rgba(0,255,180,${0.3+bass*0.7})`;
        rings[0].style.boxShadow = `0 0 ${15+bass*60}px rgba(0,255,180,${0.15+bass*0.5})`;
        if (bass - prevBass > 0.15) ringShockwave(rings[0], bass, 150);
    }

    // Мид-кольцо
    if (rings[1]) {
        const s = 1 + mid*0.45 + beat*0.25;
        rings[1].style.transform = `translate(-50%,-50%) scale(${s})`;
        rings[1].style.borderColor = `rgba(100,200,255,${0.3+mid*0.7})`;
        rings[1].style.boxShadow = `0 0 ${12+mid*50}px rgba(100,200,255,${0.15+mid*0.5})`;
        if (mid - prevMid > 0.12) ringShockwave(rings[1], mid, 200);
    }

    // Хай-кольцо
    if (rings[2]) {
        const s = 1 + high*0.4 + beat*0.2;
        rings[2].style.transform = `translate(-50%,-50%) scale(${s})`;
        rings[2].style.borderColor = `rgba(255,255,255,${0.3+high*0.7})`;
        rings[2].style.boxShadow = `0 0 ${8+high*40}px rgba(255,255,255,${0.15+high*0.5})`;
        if (high - prevHigh > 0.1) ringShockwave(rings[2], high, 280);
    }

    prevBass = bass; prevMid = mid; prevHigh = high;

    // Ядро
    if (core) {
        core.style.transform = `translate(-50%,-50%) scale(${1+beat*0.6})`;
        core.style.boxShadow = `0 0 ${12+bass*40}px rgba(0,255,180,${0.5+bass*0.5})`;
    }

    // Частицы
    if (beat) {
        for (let i=0;i<8;i++) {
            const p=document.createElement('div');
            p.className='orb-particle';
            const a=Math.random()*Math.PI*2,d=30+Math.random()*60;
            p.style.cssText=`left:50%;top:50%;width:${2+Math.random()*4}px;height:${2+Math.random()*4}px;background:rgba(0,255,180,0.8);--px:${Math.cos(a)*d}px;--py:${Math.sin(a)*d}px;box-shadow:0 0 ${6+Math.random()*8}px rgba(0,255,180,0.5);animation:particleFly 0.6s ease-out forwards;`;
            orb.appendChild(p);
            setTimeout(()=>p.remove(),700);
        }
    }
}

const styles = document.createElement('style');
styles.textContent = `@keyframes particleFly{0%{opacity:.8;transform:translate(0,0)scale(1)}100%{opacity:0;transform:translate(var(--px),var(--py))scale(0)}}`;
document.head.appendChild(styles);

window.addEventListener('load',()=>{setTimeout(createOrbRings,600);});
setInterval(()=>{
    const bass=window.symphonyBass||.3,mid=window.symphonyMid||.2,high=window.symphonyHigh||.1,beat=window.symphonyBeat||0;
    drawWaves(bass,mid,high,beat);
    animateOrb(bass,beat,mid,high);
},33);
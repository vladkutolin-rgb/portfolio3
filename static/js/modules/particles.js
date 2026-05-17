// ═══════════════════════════════════════════
// ЧАСТИЦЫ
// ═══════════════════════════════════════════
function initParticles() {
    const section = document.getElementById('about');
    if (!section || document.getElementById('particles-canvas')) return;
    const container = document.getElementById('particles-js');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
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
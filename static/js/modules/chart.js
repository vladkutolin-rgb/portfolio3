// ═══════════════════════════════════════════
// КРУГОВАЯ ДИАГРАММА
// ═══════════════════════════════════════════
let chartDrawn = false;

function drawSkillsChart() {
    const canvas = document.getElementById('skillsChart');
    if (!canvas) return;

    const container = canvas.parentElement;
    const size = Math.min(container.offsetWidth - 40, 280);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    const cx = size / 2, cy = size / 2, r = size * 0.38;

    const catData = {};
    document.querySelectorAll('.tech-category').forEach(cat => {
        const name = cat.querySelector('h4').textContent;
        const percents = [];
        cat.querySelectorAll('.skill-percentage').forEach(sp => percents.push(parseInt(sp.textContent)));
        if (percents.length > 0) {
            catData[name] = Math.round(percents.reduce((a, b) => a + b, 0) / percents.length);
        }
    });

    const items = Object.entries(catData);
    if (items.length === 0) return;

    const colors = ['#00a336', '#00d44c', '#4dabf7', '#ffd700', '#ff6b6b', '#a29bfe', '#fd79a8', '#00cec9'];
    const total = items.reduce((s, [, v]) => s + v, 0);
    let angle = -Math.PI / 2;
    let legend = '';

    ctx.clearRect(0, 0, size, size);

    items.forEach(([name, value], i) => {
        const slice = (value / total) * 2 * Math.PI;
        const color = colors[i % colors.length];

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, angle, angle + slice);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        const mid = angle + slice / 2;
        if (slice > 0.5) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 11px "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(value + '%', cx + Math.cos(mid) * r * 0.6, cy + Math.sin(mid) * r * 0.6);
        }

        legend += `<div style="display:flex;align-items:flex-start;margin-bottom:8px;gap:8px;">
            <span style="background:${color};min-width:14px;width:14px;height:14px;border-radius:3px;display:inline-block;margin-top:2px;flex-shrink:0;"></span>
            <span style="font-size:13px;line-height:1.4;color:var(--text-color);">${name} — <strong>${value}%</strong></span>
        </div>`;

        angle += slice;
    });

    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.45, 0, 2 * Math.PI);
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--card-bg').trim() || '#fff';
    ctx.fill();

    const legendEl = document.getElementById('chartLegend');
    if (legendEl) legendEl.innerHTML = legend;
}

window.addEventListener('load', () => setTimeout(drawSkillsChart, 1000));
window.addEventListener('scroll', () => {
    const about = document.getElementById('about');
    if (about && about.classList.contains('animated') && !chartDrawn) {
        drawSkillsChart();
        chartDrawn = true;
    }
});
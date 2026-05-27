// ═══════════════════════════════════════════
// АНИМАЦИИ ПРИ ПРОКРУТКЕ + КНОПКА ВВЕРХ + МЕНЮ
// ═══════════════════════════════════════════
function initScrollAnimations() {
    // Анимация появления
    function animate() {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 150) {
                el.classList.add('animated');
                if (el.id === 'about') {
                    setTimeout(() => {
                        document.querySelectorAll('.percentage-fill[data-width]').forEach(p => {
                            p.style.width = p.getAttribute('data-width') + '%';
                        });
                        document.querySelectorAll('.counter').forEach(c => {
                            const t = +c.getAttribute('data-target');
                            const cur = +c.innerText;
                            const inc = t / 200;
                            if (cur < t) {
                                const upd = () => {
                                    const n = +c.innerText;
                                    if (n < t) { c.innerText = Math.ceil(n + inc); setTimeout(upd, 10); }
                                    else c.innerText = t;
                                };
                                upd();
                            }
                        });
                    }, 300);
                }
            }
        });
    }

    window.addEventListener('scroll', animate);
    animate();

    // Мобильное меню
    const mb = document.getElementById('mobileMenuBtn');
    const nm = document.getElementById('navMenu');
    if (mb && nm) {
        mb.addEventListener('click', () => {
            nm.classList.toggle('active');
            mb.innerHTML = nm.classList.contains('active')
                ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
    document.querySelectorAll('nav ul li a').forEach(l => {
        l.addEventListener('click', () => {
            if (nm) nm.classList.remove('active');
            if (mb) mb.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const t = document.querySelector(this.getAttribute('href'));
            if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
        });
    });

    // Кнопка вверх
    const sb = document.getElementById('scrollToTop');
    window.addEventListener('scroll', () => {
        if (sb) sb.classList.toggle('visible', window.pageYOffset > 300);
    });
    if (sb) sb.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ═══════════════════════════════════════════
// ЭФФЕКТ ЖИДКОГО СТЕКЛА
// ═══════════════════════════════════════════
function initGlassEffect() {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    // Создаём курсор
    const cursor = document.createElement('div');
    cursor.className = 'glass-cursor';
    document.body.appendChild(cursor);

    let mouseX = -200, mouseY = -200;
    let targetX = -200, targetY = -200;

    gallery.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        cursor.classList.add('active');
    });

    gallery.addEventListener('mouseleave', () => {
        targetX = -200;
        targetY = -200;
        cursor.classList.remove('active');
    });

    // Плавное следование
    function animate() {
        mouseX += (targetX - mouseX) * 0.15;
        mouseY += (targetY - mouseY) * 0.15;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        requestAnimationFrame(animate);
    }
    animate();
}

window.addEventListener('load', () => {
    setTimeout(initGlassEffect, 500);
});
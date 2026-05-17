// ═══════════════════════════════════════════
// ТЁМНАЯ ТЕМА
// ═══════════════════════════════════════════
(function() {
    const toggle = document.getElementById('themeToggle');
    const icon = toggle ? toggle.querySelector('i') : null;
    const saved = localStorage.getItem('theme') || 'light';

    if (saved === 'dark') {
        document.body.classList.add('dark-theme');
        if (icon) icon.classList.replace('fa-moon', 'fa-sun');
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            if (document.body.classList.contains('dark-theme')) {
                if (icon) icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                if (icon) icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }
})();
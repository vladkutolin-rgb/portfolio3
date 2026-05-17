// ═══════════════════════════════════════════
// ФИЛЬТР СЕРТИФИКАТОВ
// ═══════════════════════════════════════════
function initFilter() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const course = this.getAttribute('data-course');
            document.querySelectorAll('.certificate-item').forEach(item => {
                item.style.display = (course === 'all' || item.getAttribute('data-course') === course) ? 'block' : 'none';
            });
        });
    });
}
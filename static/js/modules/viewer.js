// ═══════════════════════════════════════════
// ПРОСМОТРЩИК ФОТО
// ═══════════════════════════════════════════
function initViewer() {
    const viewer = document.getElementById('imageViewer');
    const vImg = document.getElementById('viewerImage');
    const vCap = document.getElementById('viewerCaption');
    if (!viewer || !vImg) return;

    let allItems = [], curIdx = 0, zoomLevel = 1;

    function getVisible(selector) {
        return Array.from(document.querySelectorAll(selector))
            .filter(i => window.getComputedStyle(i).display !== 'none');
    }

    function resetZoom() {
        zoomLevel = 1;
        vImg.style.transform = 'translate(-50%, -50%) scale(1)';
    }

    function openViewer(imgEl, idx, selector) {
        allItems = getVisible(selector);
        curIdx = idx;
        const img = imgEl.querySelector('img') || imgEl;
        vImg.src = img.getAttribute('data-full') || img.src;
        vCap.textContent = img.alt || '';
        viewer.style.display = 'block';
        document.body.style.overflow = 'hidden';
        resetZoom();
    }

    function closeViewer() {
        viewer.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function navigate(dir) {
        if (allItems.length === 0) return;
        curIdx = (curIdx + dir + allItems.length) % allItems.length;
        const item = allItems[curIdx];
        const img = item.querySelector('img');
        vImg.src = img.getAttribute('data-full') || img.src;
        vCap.textContent = img.alt || '';
        resetZoom();
    }

    document.getElementById('zoomInBtn')?.addEventListener('click', e => {
        e.stopPropagation();
        if (zoomLevel < 3) { zoomLevel += 0.2; vImg.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`; }
    });
    document.getElementById('zoomOutBtn')?.addEventListener('click', e => {
        e.stopPropagation();
        if (zoomLevel > 0.5) { zoomLevel -= 0.2; vImg.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`; }
    });
    document.getElementById('resetZoomBtn')?.addEventListener('click', e => {
        e.stopPropagation();
        resetZoom();
    });

    document.getElementById('galleryGrid')?.addEventListener('click', function(e) {
        const item = e.target.closest('.gallery-item');
        if (item) openViewer(item, Array.from(this.querySelectorAll('.gallery-item')).indexOf(item), '#galleryGrid .gallery-item');
    });

    document.getElementById('certificatesGrid')?.addEventListener('click', function(e) {
        const item = e.target.closest('.certificate-item');
        if (!item) return;
        const img = item.querySelector('img');
        if (!img) return;
        vImg.src = img.getAttribute('data-full') || img.src;
        vCap.textContent = img.alt || '';
        viewer.style.display = 'block';
        document.body.style.overflow = 'hidden';
        resetZoom();
    });

    document.getElementById('closeViewer')?.addEventListener('click', closeViewer);
    viewer.addEventListener('click', e => { if (e.target === viewer) closeViewer(); });
    document.getElementById('prevBtn')?.addEventListener('click', e => { e.stopPropagation(); navigate(-1); });
    document.getElementById('nextBtn')?.addEventListener('click', e => { e.stopPropagation(); navigate(1); });

    document.addEventListener('keydown', e => {
        if (viewer.style.display === 'block') {
            if (e.key === 'Escape') closeViewer();
            if (e.key === 'ArrowRight') navigate(1);
            if (e.key === 'ArrowLeft') navigate(-1);
        }
    });
}
// ═══════════════════════════════════════════
// ПЕЧАТАЮЩИЙСЯ ТЕКСТ
// ═══════════════════════════════════════════
function initTypingEffect() {
    const el = document.getElementById('typingText');
    if (!el) return;

    const texts = [
        "стать Full-Stack разработчиком",
        "создать инновационные продукты",
        "работать в IT-компании мечты",
        "участвовать в крупных проектах",
        "непрерывно развиваться в IT"
    ];

    let ti = 0, ci = 0, del = false, sp = 100;

    function type() {
        const t = texts[ti];
        el.textContent = del ? t.substring(0, ci - 1) : t.substring(0, ci + 1);
        if (del) { ci--; sp = 50; }
        else { ci++; sp = 100; }
        if (!del && ci === t.length) { del = true; sp = 1500; }
        else if (del && ci === 0) { del = false; ti = (ti + 1) % texts.length; sp = 500; }
        setTimeout(type, sp);
    }

    setTimeout(type, 1000);
}
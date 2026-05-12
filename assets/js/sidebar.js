(() => {
    let observer = null;

    function init() {
        observer?.disconnect();
        observer = null;

        const navLinks = [...document.querySelectorAll('.sidebar nav a[href^="#"]')];
        if (!navLinks.length) return;

        const sections = navLinks
            .map(a => document.getElementById(a.getAttribute('href').slice(1)))
            .filter(Boolean);

        const intersecting = new Set();

        observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                e.isIntersecting ? intersecting.add(e.target) : intersecting.delete(e.target);
            });

            const active = sections.find(s => intersecting.has(s)) ?? null;
            navLinks.forEach(a => {
                const id = a.getAttribute('href').slice(1);
                a.classList.toggle('is-active', active?.id === id);
            });
        }, { rootMargin: '-80px 0px -50% 0px' });

        sections.forEach(s => observer.observe(s));
    }

    window.__sidebarCleanup = () => { observer?.disconnect(); observer = null; };
    window.__sidebarReinit  = init;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();

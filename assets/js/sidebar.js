(() => {
    let ac = null;

    function getActiveSection(sections) {
        const threshold = 96;
        let active = sections[0] ?? null;
        for (const section of sections) {
            if (section.getBoundingClientRect().top <= threshold) {
                active = section;
            }
        }
        return active;
    }

    function update(sections, navLinks) {
        const active = getActiveSection(sections);
        navLinks.forEach(a => {
            const id = a.getAttribute('href').slice(1);
            a.classList.toggle('is-active', active?.id === id);
        });
    }

    function init() {
        ac?.abort();
        ac = new AbortController();

        const navLinks = [...document.querySelectorAll('.sidebar nav a[href^="#"]')];
        if (!navLinks.length) return;

        const sections = navLinks
            .map(a => document.getElementById(a.getAttribute('href').slice(1)))
            .filter(Boolean);
        if (!sections.length) return;

        update(sections, navLinks);

        window.addEventListener('scroll', () => update(sections, navLinks), {
            passive: true,
            signal: ac.signal
        });
    }

    window.__sidebarCleanup = () => { ac?.abort(); ac = null; };
    window.__sidebarReinit  = init;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();

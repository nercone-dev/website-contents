(function () {
    var sidebar = document.getElementById('sidebar');

    var CHEVRON_RIGHT = '9 18 15 12 9 6';
    var CHEVRON_DOWN = '6 9 12 15 18 9';

    function createChevron() {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.classList.add('sidebar-chevron');
        var poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        poly.setAttribute('points', CHEVRON_RIGHT);
        svg.appendChild(poly);
        return svg;
    }

    function init() {
        if (!sidebar) return;
        sidebar.querySelectorAll('li').forEach(function (li) {
            if (li.dataset.sidebarInit) return;
            li.dataset.sidebarInit = '1';
            if (li.classList.contains('section')) return;
            var nested = li.querySelector(':scope > ul');
            if (!nested) return;
            var title = li.querySelector(':scope > span');
            if (!title) return;
            var btn = document.createElement('button');
            btn.className = 'sidebar-folder-toggle';
            btn.textContent = title.textContent;
            btn.appendChild(createChevron());
            li.replaceChild(btn, title);
            li.classList.add('sidebar-folder');
            nested.hidden = true;
        });
    }

    function attachClickListener(el) {
        el.addEventListener('click', function (e) {
            var btn = e.target.closest('.sidebar-folder-toggle');
            if (!btn) return;
            var li = btn.parentElement;
            var nested = li.querySelector(':scope > ul');
            if (!nested) return;
            li.classList.toggle('sidebar-folder-open');
            var isOpen = li.classList.contains('sidebar-folder-open');
            nested.hidden = !isOpen;
            var poly = btn.querySelector('.sidebar-chevron polyline');
            if (poly) poly.setAttribute('points', isOpen ? CHEVRON_DOWN : CHEVRON_RIGHT);
        });
    }

    if (sidebar) {
        attachClickListener(sidebar);
    }

    window.__sidebarCleanup = function () {};

    window.__sidebarReinit = function (doc) {
        if (doc) {
            var newLayout = doc.querySelector('#sidebar-layout');
            var curLayout = document.querySelector('#sidebar-layout');
            var main, footer, newSidebarEl, newContentEl, curSidebarEl, layout, sidebarEl, contentEl;

            if (curLayout && !newLayout) {
                main = document.querySelector('main');
                footer = document.querySelector('footer');
                document.querySelector('header').after(main);
                main.after(footer);
                curLayout.remove();
            } else if (!curLayout && newLayout) {
                main = document.querySelector('main');
                footer = document.querySelector('footer');
                newSidebarEl = newLayout.querySelector('#sidebar');
                newContentEl = newLayout.querySelector('#sidebar-content');
                layout = document.createElement('div');
                Array.from(newLayout.attributes).forEach(function (a) { layout.setAttribute(a.name, a.value); });
                sidebarEl = document.createElement('div');
                if (newSidebarEl) {
                    Array.from(newSidebarEl.attributes).forEach(function (a) { sidebarEl.setAttribute(a.name, a.value); });
                    sidebarEl.innerHTML = newSidebarEl.innerHTML;
                }
                contentEl = document.createElement('div');
                if (newContentEl) {
                    Array.from(newContentEl.attributes).forEach(function (a) { contentEl.setAttribute(a.name, a.value); });
                }
                contentEl.appendChild(main);
                contentEl.appendChild(footer);
                layout.appendChild(sidebarEl);
                layout.appendChild(contentEl);
                document.querySelector('header').after(layout);
            } else if (curLayout && newLayout) {
                newSidebarEl = newLayout.querySelector('#sidebar');
                curSidebarEl = curLayout.querySelector('#sidebar');
                if (newSidebarEl && curSidebarEl) {
                    Array.from(curSidebarEl.attributes).forEach(function (a) { curSidebarEl.removeAttribute(a.name); });
                    Array.from(newSidebarEl.attributes).forEach(function (a) { curSidebarEl.setAttribute(a.name, a.value); });
                    curSidebarEl.innerHTML = newSidebarEl.innerHTML;
                }
            }

            var newSidebar = document.getElementById('sidebar');
            if (newSidebar !== sidebar) {
                sidebar = newSidebar;
                if (sidebar) attachClickListener(sidebar);
            }
        }

        init();
    };

    init();
})();

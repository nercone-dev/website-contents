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
            if (li.classList.contains('sidebar-section') || li.classList.contains('sidebar-item-end')) return;
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

    if (sidebar) {
        sidebar.addEventListener('click', function (e) {
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

    window.__sidebarCleanup = function () {};
    window.__sidebarReinit = init;
    init();
})();

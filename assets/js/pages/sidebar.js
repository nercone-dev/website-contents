(function () {
    var sidebar = document.getElementById('sidebar');

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
            nested.hidden = !li.classList.contains('sidebar-folder-open');
        });
    }

    window.__sidebarCleanup = function () {};
    window.__sidebarReinit = init;
    init();
})();

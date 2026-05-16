document.addEventListener('click', function(e) {
    var toggle = e.target.closest('.dropdown > button');
    if (toggle) {
        toggle.closest('.dropdown').classList.toggle('is-open');
        return;
    }
    document.querySelectorAll('.dropdown.is-open').forEach(function(d) {
        if (!d.contains(e.target)) d.classList.remove('is-open');
    });
});

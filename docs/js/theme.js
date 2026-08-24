/* Theme toggle. The page follows the system preference until someone picks a
   side; that choice is then remembered. The blocking snippet in <head> applies
   the stored choice before first paint, so there is no flash. */
(function () {
    var root = document.documentElement;
    var KEY = 'opspresso-theme';

    function current() {
        return root.getAttribute('data-theme')
            || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }

    function sync(theme) {
        var buttons = document.querySelectorAll('.theme-toggle');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute('aria-pressed', String(theme === 'dark'));
            buttons[i].setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        }
    }

    function apply(theme) {
        root.setAttribute('data-theme', theme);
        try {
            localStorage.setItem(KEY, theme);
        } catch (e) {
            /* private mode: the choice just does not persist */
        }
        sync(theme);
    }

    document.addEventListener('click', function (event) {
        var button = event.target.closest('.theme-toggle');
        if (button) {
            apply(current() === 'dark' ? 'light' : 'dark');
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        sync(current());
    });
})();

const menuDrawer = document.getElementById('mySidebar');
const menuButton = document.querySelector('.hamburger-menu');
const menuOverlay = document.getElementById('overlay');

function setMenuOpen(open, restoreFocus = false) {
    menuDrawer.classList.toggle('is-open', open);
    menuDrawer.inert = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuOverlay.classList.toggle('active', open);
    if (!open && restoreFocus) menuButton.focus();
}

function toggleSidebar() {
    setMenuOpen(!menuDrawer.classList.contains('is-open'));
}

if (menuDrawer && menuButton && menuOverlay) {
    menuButton.setAttribute('aria-controls', menuDrawer.id);
    menuDrawer.setAttribute('aria-label', 'Menu');
    menuDrawer.setAttribute('role', 'navigation');
    setMenuOpen(false);
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    menuDrawer.querySelectorAll('a').forEach(link => {
        if (link.getAttribute('href') === currentPage) link.setAttribute('aria-current', 'page');
        link.addEventListener('click', () => setMenuOpen(false));
    });
    document.addEventListener('click', event => {
        if (menuDrawer.classList.contains('is-open') && !menuDrawer.contains(event.target) && !menuButton.contains(event.target)) {
            setMenuOpen(false, true);
        }
    });
    document.addEventListener('keydown', event => {
        if (!menuDrawer.classList.contains('is-open')) return;
        if (event.key === 'Escape') setMenuOpen(false, true);
        if (event.key === 'Tab') {
            const controls = [menuButton, ...menuDrawer.querySelectorAll('a[href]')];
            const index = controls.indexOf(document.activeElement);
            event.preventDefault();
            controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
        }
    });
}

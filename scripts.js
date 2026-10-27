/* K.M. Tousif Bin Parves — academic portfolio (minimal JS) */

// ---------- Theme (light / dark) ----------
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });
}

// ---------- Updates: contained scrollable feed ----------
const updatesScroll = document.getElementById('updatesScroll');

if (updatesScroll) {
    const items = updatesScroll.querySelectorAll('.updates li');

    // Fixed height = exactly the first 3 items (re-measured on resize),
    // so the page length never grows as updates scroll inside.
    function sizeUpdatesFeed() {
        if (items.length < 3) {
            updatesScroll.style.maxHeight = '';
            return;
        }
        const third = items[2];
        const height = third.offsetTop + third.offsetHeight - items[0].offsetTop + 2;
        updatesScroll.style.maxHeight = height + 'px';
    }

    sizeUpdatesFeed();
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(sizeUpdatesFeed, 150);
    });

    // Subtle fade-in as items enter the container's viewport
    updatesScroll.classList.add('fade');
    const feedObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.add('in-view');
            });
        },
        { root: updatesScroll, rootMargin: '0px 0px -4% 0px' }
    );
    items.forEach((li) => feedObserver.observe(li));
}

// ---------- Achievements: contained scrollable panel ----------
const achvScroll = document.getElementById('achvScroll');

if (achvScroll) {
    // Panel height fits the Awards & Competitions group; Leadership scrolls in
    function sizeAchv() {
        const grid = achvScroll.querySelector('.achv-grid');
        if (!grid) return;
        const height = grid.getBoundingClientRect().bottom - achvScroll.getBoundingClientRect().top + 16;
        achvScroll.style.maxHeight = Math.min(Math.max(height, 220), 520) + 'px';
    }
    sizeAchv();
    window.addEventListener('load', sizeAchv);
    let achvTimer;
    window.addEventListener('resize', () => {
        clearTimeout(achvTimer);
        achvTimer = setTimeout(sizeAchv, 150);
    });

    // Subtle fade-in as cards enter the panel's viewport
    achvScroll.classList.add('fade');
    const achvObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.add('in-view');
            });
        },
        { root: achvScroll, rootMargin: '0px 0px -4% 0px' }
    );
    achvScroll.querySelectorAll('.achv-card').forEach((card) => achvObserver.observe(card));
}

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Highlight the nav link of the section currently in view ----------
const links = document.querySelectorAll('.topnav-links a');

if (links.length) {
    const byId = {};
    links.forEach((link) => {
        const id = (link.getAttribute('href') || '').slice(1);
        const target = document.getElementById(id);
        if (target) byId[id] = link;
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                links.forEach((l) => (l.style.color = ''));
                const active = byId[entry.target.id];
                if (active) active.style.color = 'var(--accent)';
            });
        },
        { rootMargin: '-20% 0px -70% 0px' }
    );

    Object.keys(byId).forEach((id) => observer.observe(document.getElementById(id)));
}

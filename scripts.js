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

// ---------- Selected Projects: horizontal carousel ----------
const projectsScroll = document.getElementById('projectsScroll');

if (projectsScroll) {
    const cards = Array.from(projectsScroll.querySelectorAll('.project-card'));
    const dotsBox = document.getElementById('projectDots');
    const prevBtn = document.getElementById('projectsPrev');
    const nextBtn = document.getElementById('projectsNext');

    const dots = cards.map((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'carousel-dot';
        b.setAttribute('aria-label', 'Go to project ' + (i + 1));
        b.addEventListener('click', () => {
            cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        });
        dotsBox.appendChild(b);
        return b;
    });

    function cardStep() {
        return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : projectsScroll.clientWidth;
    }

    function updateCarousel() {
        if (!cards.length) return;
        const idx = Math.min(cards.length - 1, Math.max(0, Math.round(projectsScroll.scrollLeft / cardStep())));
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        prevBtn.disabled = projectsScroll.scrollLeft <= 4;
        nextBtn.disabled = projectsScroll.scrollLeft >= projectsScroll.scrollWidth - projectsScroll.clientWidth - 4;
    }

    projectsScroll.addEventListener('scroll', () => window.requestAnimationFrame(updateCarousel), { passive: true });
    window.addEventListener('resize', updateCarousel);
    prevBtn.addEventListener('click', () => projectsScroll.scrollBy({ left: -cardStep(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => projectsScroll.scrollBy({ left: cardStep(), behavior: 'smooth' }));
    updateCarousel();
}

// ---------- Back to top ----------
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---------- Section scroll-reveal (subtle; content visible without JS) ----------
const revealTargets = document.querySelectorAll('main > section');

if ('IntersectionObserver' in window && revealTargets.length) {
    revealTargets.forEach((sec) => sec.classList.add('reveal-section'));
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { rootMargin: '0px 0px -6% 0px' }
    );
    revealTargets.forEach((sec) => revealObserver.observe(sec));
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

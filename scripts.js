/* K.M. Tousif Bin Parves — academic portfolio (minimal JS) */

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Highlight the nav link of the section currently in view
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

/* K.M. Tousif Bin Parves — academic portfolio (v25) */

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

// ---------- Page scroll lock while any modal dialog is open ----------
function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
}

function unlockScrollIfIdle() {
    if (!document.querySelector('dialog[open]')) {
        document.documentElement.style.overflow = '';
    }
}

// ---------- Updates: first 5 items visible, "View all" expands the feed ----------
const updatesFeed = document.getElementById('updatesScroll');
const updatesToggle = document.getElementById('updatesToggle');

if (updatesToggle && updatesFeed) {
    updatesToggle.addEventListener('click', () => {
        const expanded = updatesToggle.getAttribute('aria-expanded') === 'true';
        updatesToggle.setAttribute('aria-expanded', String(!expanded));
        updatesFeed.classList.toggle('expanded', !expanded);
        const label = updatesToggle.querySelector('.disclosure-label');
        if (label) label.textContent = !expanded ? 'Show less' : 'View all';
    });
}

// ---------- Disclosures (Show more / details) ----------
document.querySelectorAll('.disclosure-btn[data-disclosure]').forEach((btn) => {
    btn.addEventListener('click', () => {
        const target = document.getElementById(btn.getAttribute('aria-controls'));
        if (!target) return;
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        target.hidden = expanded;
        const label = btn.querySelector('.disclosure-label');
        if (label && btn.dataset.showText && btn.dataset.hideText) {
            label.textContent = expanded ? btn.dataset.showText : btn.dataset.hideText;
        }
    });
});

// ---------- Mobile "More profiles" toggle ----------
const profilesToggle = document.getElementById('profilesToggle');
const contactSecondary = document.getElementById('contactSecondary');

if (profilesToggle && contactSecondary) {
    profilesToggle.addEventListener('click', () => {
        const open = contactSecondary.classList.toggle('open');
        profilesToggle.setAttribute('aria-expanded', String(open));
        const label = profilesToggle.querySelector('.disclosure-label');
        if (label) label.textContent = open ? 'Fewer profiles' : 'More profiles';
    });

    // Reset the disclosure when crossing back to desktop widths
    const desktopMQ = window.matchMedia('(min-width: 768px)');
    const syncProfiles = () => {
        if (desktopMQ.matches) {
            contactSecondary.classList.remove('open');
            profilesToggle.setAttribute('aria-expanded', 'false');
            const label = profilesToggle.querySelector('.disclosure-label');
            if (label) label.textContent = 'More profiles';
        }
    };
    if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', syncProfiles);
    syncProfiles();
}

// ---------- Horizontal carousels (Event Highlights, Op-eds) ----------
document.querySelectorAll('.h-scroll').forEach((scroller) => {
    const section = scroller.closest('.sec');
    if (!section) return;
    const prev = section.querySelector('.carousel-btn[data-dir="prev"]');
    const next = section.querySelector('.carousel-btn[data-dir="next"]');
    if (!prev && !next) return;

    function step() {
        const card = scroller.firstElementChild;
        if (!card) return scroller.clientWidth * 0.8;
        const gap = parseFloat(getComputedStyle(scroller).columnGap) || 20;
        return card.getBoundingClientRect().width + gap;
    }

    function updateArrows() {
        const max = scroller.scrollWidth - scroller.clientWidth - 1;
        // small tolerance: mandatory scroll-snap can rest the scroller a few px in
        if (prev) prev.disabled = scroller.scrollLeft <= 4;
        if (next) next.disabled = scroller.scrollLeft >= max;
    }

    if (prev) prev.addEventListener('click', () => scroller.scrollBy({ left: -step(), behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => scroller.scrollBy({ left: step(), behavior: 'smooth' }));
    scroller.addEventListener('scroll', () => requestAnimationFrame(updateArrows), { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();
});

// ---------- "View all" toggles: carousel <-> grid ----------
document.querySelectorAll('[data-view-toggle]').forEach((btn) => {
    const scroller = document.getElementById(btn.getAttribute('aria-controls'));
    if (!scroller) return;
    btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        scroller.classList.toggle('as-grid', !expanded);
        scroller.scrollTo({ left: 0 });
        const label = btn.querySelector('.disclosure-label');
        if (label && btn.dataset.showText && btn.dataset.hideText) {
            label.textContent = expanded ? btn.dataset.showText : btn.dataset.hideText;
        }
        scroller.dispatchEvent(new Event('scroll'));
    });
});

// ---------- Publications category tabs ----------
(function () {
    const tabs = Array.from(document.querySelectorAll('.pub-tab'));
    if (!tabs.length) return;
    const panels = Array.from(document.querySelectorAll('.pub-panel'));

    function select(tab, moveFocus) {
        tabs.forEach((t) => {
            const selected = t === tab;
            t.setAttribute('aria-selected', String(selected));
            t.tabIndex = selected ? 0 : -1;
        });
        panels.forEach((p) => { p.hidden = true; });
        (tab.dataset.panels || '').split(/\s+/).filter(Boolean).forEach((id) => {
            const panel = document.getElementById(id);
            if (panel) panel.hidden = false;
        });
        if (moveFocus) tab.focus();
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => select(tab, false));
        tab.addEventListener('keydown', (e) => {
            const i = tabs.indexOf(tab);
            if (e.key === 'ArrowRight') { e.preventDefault(); select(tabs[(i + 1) % tabs.length], true); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); select(tabs[(i - 1 + tabs.length) % tabs.length], true); }
            else if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
            else if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
        });
    });
})();

// ---------- Detail dialog (event galleries + NiKO build story) ----------
const detailDialog = document.getElementById('detailDialog');

if (detailDialog) {
    const dTitle = document.getElementById('detailDialogTitle');
    const dBody = document.getElementById('detailDialogBody');
    let opener = null;

    function openDetail(sourceId, trigger) {
        const source = document.getElementById(sourceId);
        if (!source || typeof detailDialog.showModal !== 'function') return;
        const titleEl = source.querySelector('h3');
        if (dTitle && titleEl) dTitle.textContent = titleEl.textContent;
        if (dBody) {
            dBody.innerHTML = source.innerHTML;
            // The title already sits in the dialog header — don't repeat it in the body
            const innerTitle = dBody.querySelector('h3');
            if (innerTitle) innerTitle.remove();
        }
        opener = trigger || null;
        detailDialog.showModal();
        lockScroll();
        if (dBody) dBody.scrollTop = 0;
    }

    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-detail]');
        if (trigger) openDetail(trigger.getAttribute('data-detail'), trigger);
    });

    const closeBtn = document.getElementById('detailDialogClose');
    if (closeBtn) closeBtn.addEventListener('click', () => detailDialog.close());

    // Click on the backdrop closes the dialog
    detailDialog.addEventListener('click', (e) => {
        if (e.target === detailDialog) detailDialog.close();
    });

    detailDialog.addEventListener('close', () => {
        unlockScrollIfIdle();
        if (opener) opener.focus();
        opener = null;
    });
}

// ---------- Event photo lightbox (delegated; works inside dialogs too) ----------
(function () {
    const lightbox = document.createElement('dialog');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightboxDialog';
    lightbox.setAttribute('aria-label', 'Photo viewer');
    lightbox.innerHTML =
        '<button class="lightbox-close" type="button" aria-label="Close photo viewer">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>' +
        '<button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous photo">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>' +
        '<figure><img id="lightboxImg" src="" alt=""><figcaption id="lightboxCaption"></figcaption></figure>' +
        '<button class="lightbox-nav lightbox-next" type="button" aria-label="Next photo">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>';
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('#lightboxImg');
    const lbCaption = lightbox.querySelector('#lightboxCaption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    let group = [];
    let current = 0;
    let opener = null;

    function showPhoto(i) {
        if (!group.length) return;
        current = (i + group.length) % group.length;
        const img = group[current].querySelector('img');
        if (!img) return;
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt;
        lbCaption.textContent = img.alt;
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.event-photo');
        if (!btn) return;
        const container = btn.closest('.event-gallery') || btn.parentElement;
        group = Array.from(container.querySelectorAll('.event-photo'));
        opener = btn;
        showPhoto(group.indexOf(btn));
        if (typeof lightbox.showModal === 'function') lightbox.showModal();
        else lightbox.setAttribute('open', '');
        lockScroll();
        closeBtn.focus();
    });

    closeBtn.addEventListener('click', () => lightbox.close());
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(current - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(current + 1));

    // Click on the dark backdrop closes the viewer
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.close();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.open) return;
        if (e.key === 'ArrowLeft') showPhoto(current - 1);
        else if (e.key === 'ArrowRight') showPhoto(current + 1);
    });

    lightbox.addEventListener('close', () => {
        unlockScrollIfIdle();
        if (opener) opener.focus();
        opener = null;
    });
})();

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

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Mobile nav menu (the pill collapses into a dropdown panel) ----------
const navMenuBtn = document.getElementById('navMenuBtn');
const topnavLinks = document.getElementById('topnavLinks');

if (navMenuBtn && topnavLinks) {
    const setMenu = (open) => {
        topnavLinks.classList.toggle('open', open);
        navMenuBtn.setAttribute('aria-expanded', String(open));
    };

    navMenuBtn.addEventListener('click', () => setMenu(!topnavLinks.classList.contains('open')));
    topnavLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenu(false);
    });

    // Reset the disclosure when crossing back to desktop widths
    const desktopNavMQ = window.matchMedia('(min-width: 981px)');
    const syncMenu = () => {
        if (desktopNavMQ.matches) setMenu(false);
    };
    if (desktopNavMQ.addEventListener) desktopNavMQ.addEventListener('change', syncMenu);
    syncMenu();
}

// ---------- Pointer-following glow on cards ----------
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.glow').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });
}

// ---------- Highlight the nav link of the section currently in view ----------
const navLinks = document.querySelectorAll('.topnav-links a');

if (navLinks.length && 'IntersectionObserver' in window) {
    const byId = {};
    navLinks.forEach((link) => {
        const id = (link.getAttribute('href') || '').slice(1);
        const target = document.getElementById(id);
        if (target) byId[id] = link;
    });

    let currentId = null;
    const spy = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) currentId = entry.target.id;
                else if (currentId === entry.target.id) currentId = null;
            });
            navLinks.forEach((l) => l.classList.toggle('on', !!currentId && l === byId[currentId]));
        },
        { rootMargin: '-45% 0px -50% 0px' }
    );

    Object.keys(byId).forEach((id) => spy.observe(document.getElementById(id)));
}

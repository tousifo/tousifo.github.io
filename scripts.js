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

// ---------- Event photo lightbox ----------
const galleryButtons = Array.from(document.querySelectorAll('.event-photo'));

if (galleryButtons.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Photo viewer');
    lightbox.hidden = true;
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
    let current = 0;
    let opener = null;

    function showPhoto(i) {
        current = (i + galleryButtons.length) % galleryButtons.length;
        const img = galleryButtons[current].querySelector('img');
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbCaption.textContent = img.alt;
    }

    function openLightbox(i, trigger) {
        opener = trigger || null;
        showPhoto(i);
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        document.body.style.overflow = '';
        if (opener) opener.focus();
    }

    galleryButtons.forEach((btn, i) => {
        btn.addEventListener('click', () => openLightbox(i, btn));
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(current - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(current + 1));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') showPhoto(current - 1);
        else if (e.key === 'ArrowRight') showPhoto(current + 1);
    });
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

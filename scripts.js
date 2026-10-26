/* K.M. Tousif Bin Parves — portfolio interactions */

// ---------- Theme (dark / light) ----------
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

// ---------- Mobile menu ----------
const hamburgerMenu = document.getElementById('hamburgerMenu');
const navLinks = document.getElementById('navLinks');

if (hamburgerMenu && navLinks) {
    hamburgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!hamburgerMenu.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });

    // Close the mobile menu after choosing a section
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
}

// ---------- Navbar shadow + scroll progress + back to top ----------
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('progressBar');
const backToTop = document.getElementById('backToTop');

function onScroll() {
    const scrollY = window.scrollY;

    if (navbar) navbar.classList.toggle('scrolled', scrollY > 10);

    if (progressBar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = max > 0 ? `${(scrollY / max) * 100}%` : '0%';
    }

    if (backToTop) backToTop.classList.toggle('visible', scrollY > 500);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---------- Active nav link ----------
const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute('id');
            navLinks?.querySelectorAll('a').forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        });
    },
    { rootMargin: '-40% 0px -55% 0px' }
);

document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

// ---------- Libraries (Typed.js + AOS) ----------
window.addEventListener('DOMContentLoaded', () => {
    if (window.AOS) {
        AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });
    }

    const typingEl = document.getElementById('typingText');
    if (window.Typed && typingEl) {
        new Typed('#typingText', {
            strings: ['AI Researcher', 'LLM Enthusiast', 'Robotics Developer'],
            typeSpeed: 55,
            backSpeed: 30,
            backDelay: 1600,
            loop: true
        });
    } else if (typingEl) {
        // Fallback if the CDN is unreachable
        typingEl.textContent = 'AI & Robotics Researcher';
    }

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

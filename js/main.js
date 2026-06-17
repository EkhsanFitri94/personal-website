/**
 * Ekhsan Fitri — Personal Website JavaScript
 * Typing animation, theme toggle, smooth scroll, mobile menu, form handler
 */

// ── Typing Animation ────────────────────────────────────
const phrases = [
    'AI-powered tools 🤖',
    'procurement solutions 📊',
    'data dashboards 📈',
    'full-stack apps 💻',
    'practical automations ⚡',
];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
let isWaiting = false;
const typingEl = document.getElementById('typing-text');

function type() {
    if (!typingEl) return;
    const current = phrases[phraseIdx];

    if (isWaiting) {
        setTimeout(() => { isWaiting = false; type(); }, 2000);
        return;
    }

    if (isDeleting) {
        typingEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
    } else {
        typingEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === current.length) {
        isWaiting = true;
        isDeleting = true;
        speed = 2000;
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        isWaiting = true;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed = 500;
    }

    setTimeout(type, speed);
}

// ── Theme Toggle ────────────────────────────────────────
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function getStoredTheme() {
    try { return localStorage.getItem('ef-theme'); } catch { return null; }
}

function applyTheme(theme) {
    html.dataset.theme = theme;
    try { localStorage.setItem('ef-theme', theme); } catch {}
}

const stored = getStoredTheme();
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(stored || (prefersDark ? 'dark' : 'light'));

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });
}

// ── Mobile Menu ─────────────────────────────────────────
const mobileBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        mobileBtn.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            mobileBtn.textContent = '☰';
        });
    });
}

// ── Active Nav Link on Scroll ───────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });
    navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) {
            a.classList.add('active');
        }
    });
}

// ── Navbar Shadow on Scroll ─────────────────────────────
const navbar = document.getElementById('navbar');
function updateNavbar() {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }
}

window.addEventListener('scroll', () => {
    updateActiveLink();
    updateNavbar();
});

// ── Animate Skill Bars on Scroll ────────────────────────
const skillBars = document.querySelectorAll('.skill-fill');
let skillsAnimated = false;

function animateSkills() {
    if (skillsAnimated) return;
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => { bar.style.width = width; }, 100);
        });
        skillsAnimated = true;
    }
}

window.addEventListener('scroll', animateSkills);

// ── Contact Form ────────────────────────────────────────
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = '✅ Message Sent!';
        btn.style.background = 'var(--green)';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = 'var(--primary)';
            form.reset();
        }, 3000);
    });
}

// ── Smooth Reveal on Scroll ─────────────────────────────
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .timeline-item, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// ── Start ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 500);
});

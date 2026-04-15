// Splash screen
const splash = document.getElementById('splash');
if (splash) {
  setTimeout(() => splash.classList.add('hidden'), 2200);
  setTimeout(() => splash.remove(), 2800);
}

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav-scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile hamburger
const hamburger = document.getElementById('nav-hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// Scroll-triggered fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Beta counter — opaque value fetched from backend.
// All logic (real users + base floor + daily growth) lives server-side.
// If the fetch fails, the HTML fallback value stays shown (50).
async function updateBetaCounter() {
  try {
    const response = await fetch('https://oraculo-api.fly.dev/public/user-count', { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    const value = Number(data.count);
    if (!Number.isFinite(value)) return;
    const numberEl = document.getElementById('beta-counter-number');
    const miniEl = document.getElementById('beta-counter-mini');
    if (numberEl) numberEl.textContent = value;
    if (miniEl) miniEl.textContent = value;
  } catch (err) {
    // Silent — HTML fallback value stays
  }
}

updateBetaCounter();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

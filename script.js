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

// Beta counter — combines:
//  (1) real user count fetched from API (when available)
//  (2) automatic daily growth (1-3 per day, deterministic pseudo-random)
//  (3) base value (50) for social proof floor
//
// Growth is deterministic per day, so all visitors on the same day see the same number.
// When the real API count surpasses the auto-growth curve, the real count takes over.

const BETA_BASE = 50;
const BETA_MAX = 300;
const BETA_BASELINE_DATE = '2026-04-15'; // day 0 of the counter
const API_URL = 'https://oraculo-api.fly.dev/public/user-count';

function daysSince(dateStr) {
  const baseline = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const diff = now - baseline;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

// Deterministic pseudo-random 1-3 for a given day index
function dailyIncrement(dayIndex) {
  // LCG-style hash — same seed per day, spread uniformly across {1, 2, 3}
  const seed = (dayIndex * 2654435761) >>> 0;
  return 1 + (seed % 3);
}

function computeAutoCount() {
  const days = daysSince(BETA_BASELINE_DATE);
  let total = BETA_BASE;
  for (let d = 0; d < days; d++) {
    total += dailyIncrement(d);
  }
  return Math.min(total, BETA_MAX);
}

function setCounterUI(value) {
  const numberEl = document.getElementById('beta-counter-number');
  const miniEl = document.getElementById('beta-counter-mini');
  if (numberEl) numberEl.textContent = value;
  if (miniEl) miniEl.textContent = value;
}

async function updateBetaCounter() {
  // Step 1: set immediately to deterministic auto-count (works offline)
  const autoCount = computeAutoCount();
  setCounterUI(autoCount);

  // Step 2: try to fetch real API count; use the greater of the two
  try {
    const response = await fetch(API_URL, { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    const realCount = Number(data.count) || 0;
    const combined = Math.min(Math.max(realCount + BETA_BASE, autoCount), BETA_MAX);
    setCounterUI(combined);
  } catch (err) {
    // Silent fallback — auto-count already rendered
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

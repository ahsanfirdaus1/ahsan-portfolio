/* ============================================================
   AHSAN FIRDAUS PORTFOLIO — script.js
   ============================================================ */

// ── NAV: scroll state + mobile toggle ──
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ── ACTIVE NAV LINK on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4, rootMargin: '-60px 0px -40% 0px' });

sections.forEach(section => activeSectionObserver.observe(section));

// ── REVEAL ANIMATIONS ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── SKILL BAR ANIMATION ──
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('animated'), i * 80);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-group').forEach(group => skillObserver.observe(group));

// ── STAGGER timeline cards ──
const timelineItems = document.querySelectorAll('.timeline-item.reveal');
timelineItems.forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.08}s`;
});

const projectCards = document.querySelectorAll('.project-card.reveal');
projectCards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.07}s`;
});

const skillGroups = document.querySelectorAll('.skill-group.reveal');
skillGroups.forEach((group, i) => {
  group.style.transitionDelay = `${i * 0.1}s`;
});

// ── SMOOTH cursor highlight on cards (optional desktop touch) ──
document.querySelectorAll('.timeline-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
});

// ── COUNTER ANIMATION for hero stats ──
// Each stat: { target number, suffix string shown after the number }
const STAT_CONFIG = [
  { target: 50,   suffix: '+' },
  { target: 7870, suffix: ''  },
  { target: 100,  suffix: '%' },
];

function animateCount(numEl, suffixEl, target, suffix, duration = 1400) {
  const start = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current  = Math.round(target * eased);

    numEl.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      numEl.textContent = target.toLocaleString();
    }
  }

  // Suffix stays static — set it once
  suffixEl.textContent = suffix;
  requestAnimationFrame(update);
}

const heroStatsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const statNums = entry.target.querySelectorAll('.stat-num');

    statNums.forEach((statNum, i) => {
      const cfg = STAT_CONFIG[i];
      if (!cfg) return;

      // Clear whatever HTML was rendered (removes text nodes + old .stat-plus spans)
      statNum.innerHTML = '';

      // Rebuild: <span class="count-num">0</span><span class="stat-plus">+</span>
      const numEl    = document.createElement('span');
      numEl.className = 'count-num';
      numEl.textContent = '0';

      const suffixEl    = document.createElement('span');
      suffixEl.className = 'stat-plus'; // reuse existing CSS styling
      suffixEl.textContent = cfg.suffix;

      statNum.appendChild(numEl);
      statNum.appendChild(suffixEl);

      animateCount(numEl, suffixEl, cfg.target, cfg.suffix);
    });

    heroStatsObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroStatsObserver.observe(heroStats);

// ── INIT: trigger hero reveals immediately ──
// Small delay to let fonts load
setTimeout(() => {
  document.querySelectorAll('.hero-content .reveal').forEach(el => {
    el.classList.add('visible');
  });
}, 100);
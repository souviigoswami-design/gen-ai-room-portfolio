/* Gen AI Room — script.js */

// ── Navbar: add background when user scrolls down ──────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── Mobile hamburger menu ───────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when any nav link is clicked
document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Reveal-on-scroll animation ──────────────────────────────────────────────
// Adds 'reveal' class to elements so they fade-in when scrolled into view
const revealTargets = [
  '.svc-card',
  '.why-card',
  '.about-grid',
  '.contact-info',
  '.contact-form',
  '.sec-header',
  '.cta-strip h2',
  '.cta-strip p',
  '.founder-card',
];

revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('reveal');
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80 * i);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Smooth active nav link highlight on scroll ──────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.classList.remove('active-link');
    if (a.getAttribute('href') === `#${current}`) a.classList.add('active-link');
  });
});

// ── Contact form: friendly submit handler ───────────────────────────────────
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();  // Stop the page from refreshing

  const submitBtn = document.getElementById('cf-submit');

  // Show a "sending" message on the button
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';

  // Simulate a brief pause (in a real website this would send the email)
  setTimeout(() => {
    // Show a success message
    contactForm.innerHTML = `
      <div style="text-align:center; padding:48px 24px;">
        <div style="font-size:3rem; margin-bottom:16px;">🎉</div>
        <h3 style="font-size:1.4rem; font-weight:800; margin-bottom:12px;">Message Sent!</h3>
        <p style="color:var(--txt2); line-height:1.8;">
          Thank you for reaching out! Souvik will personally get back to you at
          <strong style="color:var(--p2);">${document.getElementById('cf-email').value}</strong>
          within 24 hours.
        </p>
        <p style="color:var(--txt2); margin-top:12px; font-size:.9rem;">
          In the meantime, feel free to look through our services again. 😊
        </p>
      </div>
    `;
  }, 1500);
});

// ── Typing animation on hero title ─────────────────────────────────────────
// Adds a subtle cursor blink to the gradient text in the hero
const gradientText = document.querySelector('.hero-title .gradient-text');
if (gradientText) {
  gradientText.style.borderRight = '3px solid transparent';
  setTimeout(() => {
    gradientText.style.borderRight = 'none';
  }, 3000);
}

// ── Button ripple effect ────────────────────────────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:4px; height:4px;
      background:rgba(255,255,255,0.4);
      top:${e.clientY - rect.top}px; left:${e.clientX - rect.left}px;
      transform:scale(0);
      animation:rippleAnim 0.5s linear;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// Inject ripple keyframes dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(60); opacity: 0; }
  }
  .active-link { color: #fff !important; }
`;
document.head.appendChild(style);

// ── Floating particles in hero background ──────────────────────────────────
function createParticles() {
  const hero = document.querySelector('.hero-orbs');
  if (!hero) return;

  for (let i = 0; i < 20; i++) {
    const dot = document.createElement('div');
    const size = Math.random() * 3 + 1;
    dot.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      background:rgba(124,111,255,${Math.random() * 0.5 + 0.1});
      border-radius:50%;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation: floatParticle ${5 + Math.random() * 8}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    hero.appendChild(dot);
  }

  const pStyle = document.createElement('style');
  pStyle.textContent = `
    @keyframes floatParticle {
      0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
      33%       { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
      66%       { transform: translateY(10px) translateX(-10px); opacity: 0.5; }
    }
  `;
  document.head.appendChild(pStyle);
}
createParticles();

// ── Count-up animation on stats ─────────────────────────────────────────────
function animateCount(el, target, suffix) {
  let current = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + suffix;
  }, 35);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const val = el.dataset.count;
      const suf = el.dataset.suffix || '';
      if (val) animateCount(el, parseInt(val), suf);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => statsObserver.observe(el));

console.log('%c Gen AI Room 🚀 ', 'background:#7c6fff;color:#fff;font-size:14px;padding:6px 12px;border-radius:6px;font-weight:bold;');
console.log('%c Powering Small Businesses with AI | West Bengal ', 'color:#00d4ff;font-size:11px;');

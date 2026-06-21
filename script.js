/* ── FLOATING PARTICLES ── */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const SYMBOLS = ['❤️', '💛', '✨', '💙', '🌟'];

function createParticle() {
  return {
    x: Math.random() * W,
    y: H + 20,
    sym: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    size: Math.random() * 15 + 7,
    speed: Math.random() * 0.55 + 0.25,
    drift: (Math.random() - 0.5) * 0.35,
    alpha: Math.random() * 0.45 + 0.12,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.018 + 0.004,
  };
}

for (let i = 0; i < 28; i++) {
  const p = createParticle();
  p.y = Math.random() * H;
  particles.push(p);
}

function animParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p, i) => {
    p.wobble += p.wobbleSpeed;
    p.x += p.drift + Math.sin(p.wobble) * 0.45;
    p.y -= p.speed;
    ctx.globalAlpha = p.alpha;
    ctx.font = `${p.size}px serif`;
    ctx.fillText(p.sym, p.x, p.y);
    if (p.y < -30) particles[i] = createParticle();
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(animParticles);
}
animParticles();

/* ── NAV: SCROLL + MOBILE TOGGLE ── */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── SCROLL ANIMATIONS ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => el.classList.add('visible'), delay);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach((el, i) => {
  // Stagger cards
  if (el.classList.contains('love-card') || el.classList.contains('spotlight-card')) {
    el.dataset.delay = (i % 6) * 100;
  }
  observer.observe(el);
});

/* ── LIGHTBOX ── */
function openLightbox(src, caption) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-caption').textContent = caption || '';
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ── GREETING CARD ── */
function updateCard() {
  const name = document.getElementById('input-name').value.trim();
  const msg  = document.getElementById('input-msg').value.trim();
  const from = document.getElementById('input-from').value.trim();

  document.getElementById('preview-name').textContent =
    name || 'Dad';
  document.getElementById('preview-msg').textContent =
    msg || 'Your message will appear here, written with all the love your heart holds…';
  document.getElementById('preview-from').textContent =
    from ? `— With love, ${from}` : '— With love, Your Child';
}

function shareCard() {
  const name = document.getElementById('input-name').value.trim() || 'Dad';
  const msg  = document.getElementById('input-msg').value.trim() || "Happy Father's Day!";
  const from = document.getElementById('input-from').value.trim();
  const text = `To ${name}: ${msg}${from ? ' — ' + from : ''}`;

  if (navigator.share) {
    navigator.share({ title: "Happy Father's Day ❤️", text });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showToast('💛 Card message copied! Share it with your dad.');
    });
  }
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '2rem', left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg,#c9933a,#e8b96a)',
    color: '#0d1b2a', padding: '0.85rem 2rem',
    borderRadius: '50px', fontWeight: '600',
    fontSize: '0.9rem', zIndex: '9999',
    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
    animation: 'fadeUp 0.4s ease',
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

/* ── COUNTDOWN ── */
function getNextFathersDay() {
  const now  = new Date();
  const year = now.getFullYear();

  function fathersDayOf(y) {
    // 3rd Sunday of June
    const june1 = new Date(y, 5, 1);
    const day   = june1.getDay(); // 0=Sun
    const first = day === 0 ? june1 : new Date(y, 5, 1 + (7 - day));
    return new Date(y, 5, first.getDate() + 14);
  }

  let fd = fathersDayOf(year);
  if (now > fd) fd = fathersDayOf(year + 1);
  return fd;
}

function updateCountdown() {
  const diff = getNextFathersDay() - new Date();
  const el   = document.getElementById('countdown');

  if (diff <= 0) {
    el.innerHTML = `<div class="countdown-box"><span class="countdown-num">🎉</span><div class="countdown-label">Today!</div></div>`;
    return;
  }

  const days  = Math.floor(diff / 864e5);
  const hours = Math.floor((diff % 864e5) / 36e5);
  const mins  = Math.floor((diff % 36e5) / 6e4);
  const secs  = Math.floor((diff % 6e4) / 1e3);

  el.innerHTML = [['Days', days], ['Hours', hours], ['Minutes', mins], ['Seconds', secs]]
    .map(([l, v]) => `
      <div class="countdown-box">
        <span class="countdown-num">${String(v).padStart(2, '0')}</span>
        <div class="countdown-label">${l}</div>
      </div>`).join('');
}

updateCountdown();
setInterval(updateCountdown, 1000);

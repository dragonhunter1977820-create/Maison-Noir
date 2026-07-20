/* ============================================================
   MAISON NOIR — script.js
   Complete Interactive JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ── LOADER ────────────────────────────────────────────────
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        // Trigger hero animations
        document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 120 + 200);
        });
      }
    }, 2400);
  });

  document.body.style.overflow = 'hidden';

  // ── CUSTOM CURSOR ─────────────────────────────────────────
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateCursor() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .faq-question, .gallery-item, .dish-card, .exp-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      cursorFollower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      cursorFollower.classList.remove('active');
    });
  });

  // ── MOUSE SPOTLIGHT ──────────────────────────────────────
  const spotlight = document.createElement('div');
  spotlight.classList.add('spotlight');
  document.body.appendChild(spotlight);
  document.addEventListener('mousemove', (e) => {
    spotlight.style.left = e.clientX + 'px';
    spotlight.style.top = e.clientY + 'px';
  });

  // ── FLOATING PARTICLES ──────────────────────────────────
  function createParticles(container, count = 25) {
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 3 + 1;
      p.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        background: rgba(212,175,55,${Math.random() * 0.4 + 0.05});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: particleFloat ${Math.random() * 8 + 6}s ease-in-out infinite;
        animation-delay: -${Math.random() * 8}s;
        pointer-events: none;
      `;
      container.appendChild(p);
    }
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
      25% { transform: translateY(-${Math.random() * 40 + 20}px) translateX(${Math.random() * 20 - 10}px) scale(1.1); opacity: 1; }
      75% { transform: translateY(${Math.random() * 30 + 10}px) translateX(-${Math.random() * 20 - 10}px) scale(0.9); opacity: 0.4; }
    }
  `;
  document.head.appendChild(style);

  createParticles(document.getElementById('heroParticles'), 30);

  // ── NAVIGATION ──────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
    toggleBackToTop();
    handleScrollAnimations();
    handleParallax();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        navLinks.forEach(l => l.classList.remove('active'));
        const target = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (target) target.classList.add('active');
      }
    });
  }

  // ── SCROLL ANIMATIONS ────────────────────────────────────
  function handleScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    reveals.forEach(el => {
      if (!el.classList.contains('visible')) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
          el.classList.add('visible');
        }
      }
    });
  }

  // IntersectionObserver for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    // Don't observe hero elements (they animate on load)
    if (!el.closest('.hero')) {
      observer.observe(el);
    }
  });

  // ── PARALLAX ─────────────────────────────────────────────
  function handleParallax() {
    const scrollY = window.scrollY;
    const heroImage = document.getElementById('heroImage');
    if (heroImage) {
      heroImage.style.transform = `scale(1.08) translateY(${scrollY * 0.25}px)`;
    }
  }

  // ── COUNTER ANIMATION ────────────────────────────────────
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        if (target) animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    counterObserver.observe(el);
  });

  // ── TESTIMONIALS SLIDER ──────────────────────────────────
  const track = document.getElementById('testimonialsTrack');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  const dotsContainer = document.getElementById('testiDots');
  let currentSlide = 0;
  let autoSlide;
  let slidesPerView = getSlidesPerView();

  function getSlidesPerView() {
    return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const totalSlides = Math.max(1, cards.length - slidesPerView + 1);
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('testi-dot');
      if (i === currentSlide) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goToSlide(index) {
    const totalSlides = Math.max(1, cards.length - slidesPerView + 1);
    currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
    const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 0;
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    document.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    const totalSlides = Math.max(1, cards.length - slidesPerView + 1);
    goToSlide(currentSlide >= totalSlides - 1 ? 0 : currentSlide + 1);
  }
  function prevSlide() {
    const totalSlides = Math.max(1, cards.length - slidesPerView + 1);
    goToSlide(currentSlide <= 0 ? totalSlides - 1 : currentSlide - 1);
  }

  document.getElementById('testiNext')?.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });
  document.getElementById('testiPrev')?.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 4500);
  }
  function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
  }

  if (track && cards.length) {
    buildDots();
    startAutoSlide();
  }

  window.addEventListener('resize', () => {
    slidesPerView = getSlidesPerView();
    buildDots();
    goToSlide(0);
  });

  // ── MENU TABS ─────────────────────────────────────────────
  const tabs = document.querySelectorAll('.menu-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(`panel-${tab.dataset.tab}`);
      if (panel) panel.classList.add('active');
    });
  });

  // ── FAQ ACCORDION ─────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ── RESERVATION FORM ─────────────────────────────────────
  const reservationForm = document.getElementById('reservationForm');
  const heroResForm = document.getElementById('heroResForm');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');

  function showModal() {
    if (modalOverlay) {
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  modalClose?.addEventListener('click', () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  });

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  reservationForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = reservationForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-concierge-bell"></i> <span>Reserve My Table</span>';
      reservationForm.reset();
      showModal();
    }, 1800);
  });

  heroResForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = heroResForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-concierge-bell"></i> Confirm Reservation';
      heroResForm.reset();
      showModal();
    }, 1800);
  });

  // Newsletter form
  document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.style.background = 'linear-gradient(135deg, #2d6a4f, #40916c)';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
      btn.style.background = '';
      e.target.reset();
    }, 3000);
  });

  // ── BACK TO TOP ──────────────────────────────────────────
  const backToTop = document.getElementById('backToTop');
  function toggleBackToTop() {
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    }
  }
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── SMOOTH ANCHOR SCROLLING ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  // ── INPUT DATE MIN ───────────────────────────────────────
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(input => { input.min = today; });

  // ── INITIAL SCROLL CHECK ─────────────────────────────────
  handleScrollAnimations();
  toggleBackToTop();

  // ── GOLD BORDER GRADIENT ANIMATION ──────────────────────
  const goldStyle = document.createElement('style');
  goldStyle.textContent = `
    @keyframes borderGlow {
      0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.1); }
      50% { box-shadow: 0 0 40px rgba(212,175,55,0.25), 0 0 80px rgba(212,175,55,0.08); }
    }
    .reservation-card { animation: floatCard 6s ease-in-out infinite, borderGlow 3s ease-in-out infinite; }
  `;
  document.head.appendChild(goldStyle);

  // ── 3D CARD TILT ─────────────────────────────────────────
  document.querySelectorAll('.dish-card, .award-card, .exp-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  console.log('%cMaison Noir', 'font-size:32px;font-family:serif;color:#D4AF37;font-weight:bold;');
  console.log('%cLuxury Fine Dining — Designed with Excellence', 'font-size:12px;color:#A7A7A7;');
})();

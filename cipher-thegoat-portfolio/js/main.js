/* ═══════════════════════════════════════════════════════════════
   CIPHER THEGOAT — Interaction System
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Utilities ──────────────────────────────────────────────── */

  const lerp = (a, b, n) => a + (b - a) * n;
  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* ─── Page Transition ────────────────────────────────────────── */

  const transition = document.querySelector('.page-transition');

  function initPageTransition() {
    if (!transition) return;

    // Reveal page on load
    requestAnimationFrame(() => {
      setTimeout(() => transition.classList.add('is-loaded'), 80);
    });

    // Intercept internal links
    document.querySelectorAll('a[href]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');

        // Skip external links, anchors, mailto, tel
        if (!href ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('http') ||
            link.target === '_blank') return;

        e.preventDefault();
        transition.classList.remove('is-loaded');
        transition.classList.add('is-exiting');

        setTimeout(() => {
          window.location.href = href;
        }, 700);
      });
    });
  }


  /* ─── Custom Cursor ──────────────────────────────────────────── */

  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorText = document.querySelector('.cursor-text');

  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  function initCursor() {
    if (!cursor || isTouchDevice()) return;

    document.addEventListener('mousemove', e => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    });

    // Cursor hover states
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
        cursorText.textContent = el.dataset.cursor || '';
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
        cursorText.textContent = '';
      });
    });

    // Generic link hover (smaller effect)
    document.querySelectorAll('a:not([data-cursor]), button:not([data-cursor])').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1.8)';
        cursorDot.style.opacity = '0.5';
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorDot.style.opacity = '1';
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });

    animateCursor();
  }

  function animateCursor() {
    dotX = lerp(dotX, cursorX, 0.15);
    dotY = lerp(dotY, cursorY, 0.15);
    cursor.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
    requestAnimationFrame(animateCursor);
  }


  /* ─── Navigation ─────────────────────────────────────────────── */

  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  function initNavigation() {
    if (!nav) return;

    // Scroll state
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 60);
      lastScroll = y;
    }, { passive: true });

    // Mobile toggle
    if (navToggle && mobileMenu) {
      navToggle.addEventListener('click', () => {
        const isOpen = navToggle.classList.toggle('is-open');
        mobileMenu.classList.toggle('is-open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
    }

    // Set active link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage) {
        link.classList.add('is-active');
      }
    });
  }


  /* ─── Scroll Reveals ─────────────────────────────────────────── */

  function initScrollReveals() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(el => observer.observe(el));
  }


  /* ─── Image Reveals ──────────────────────────────────────────── */

  function initImageReveals() {
    const images = document.querySelectorAll('.img-reveal');
    if (!images.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    images.forEach(el => observer.observe(el));
  }


  /* ─── Hero Title Animation ──────────────────────────────────── */

  function initHeroAnimation() {
    const heroLines = document.querySelectorAll('.hero-title-line span');
    if (!heroLines.length) return;

    setTimeout(() => {
      heroLines.forEach((span, i) => {
        setTimeout(() => span.classList.add('is-visible'), i * 150);
      });
    }, 600);
  }


  /* ─── Magnetic Elements ──────────────────────────────────────── */

  function initMagnetic() {
    if (isTouchDevice()) return;

    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = parseFloat(el.dataset.magnetic) || 0.3;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.transform = 'translate(0, 0)';
        setTimeout(() => { el.style.transition = ''; }, 500);
      });
    });
  }


  /* ─── Service Hover Visuals ──────────────────────────────────── */

  function initServiceVisuals() {
    const visual = document.querySelector('.service-visual');
    const visualImg = visual?.querySelector('img');
    if (!visual || !visualImg) return;

    document.querySelectorAll('.service-item[data-image]').forEach(item => {
      item.addEventListener('mouseenter', () => {
        visualImg.src = item.dataset.image;
        visual.classList.add('is-visible');
      });
      item.addEventListener('mouseleave', () => {
        visual.classList.remove('is-visible');
      });
    });
  }


  /* ─── Parallax (subtle) ─────────────────────────────────────── */

  function initParallax() {
    if (isTouchDevice()) return;

    const elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      elements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }, { passive: true });
  }


  /* ─── Smooth Counter (for about page facts) ─────────────────── */

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            const prefix = el.dataset.prefix || '';
            let current = 0;
            const step = Math.ceil(target / 60);
            const interval = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(interval);
              }
              el.textContent = prefix + current + suffix;
            }, 25);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => observer.observe(el));
  }


  /* ─── Initialize ─────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', () => {
    initPageTransition();
    initCursor();
    initNavigation();
    initScrollReveals();
    initImageReveals();
    initHeroAnimation();
    initMagnetic();
    initServiceVisuals();
    initParallax();
    initCounters();
  });

})();

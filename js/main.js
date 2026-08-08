(function() {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var header = document.getElementById('header');
  var menuToggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      var open = nav.classList.toggle('open');
      this.classList.toggle('active', open);
      this.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  document.addEventListener('click', function(e) {
    if (nav && nav.classList.contains('open') && !header.contains(e.target)) {
      nav.classList.remove('open');
      if (menuToggle) menuToggle.classList.remove('active');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('open')) {
      nav.classList.remove('open');
      if (menuToggle) {
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
      if (menuToggle) menuToggle.focus();
    }
  });

  window.addEventListener('scroll', function() {
    if (header) {
      if (window.pageYOffset > 24) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  if (header && window.pageYOffset > 24) {
    header.classList.add('scrolled');
  }

  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(function(el) {
    revealObserver.observe(el);
  });

  function animateCounters() {
    var counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    var runCounter = function(el) {
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      if (prefersReducedMotion) {
        el.textContent = target.toLocaleString();
        return;
      }
      var current = 0;
      var increment = Math.ceil(target / 60);
      var timer = setInterval(function() {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current.toLocaleString();
      }, 25);
    };

    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function(c) { counterObserver.observe(c); });
  }
  animateCounters();

  var heroSlides = document.querySelectorAll('.hero-slider .slide');
  if (heroSlides.length > 1 && !prefersReducedMotion) {
    var currentSlide = 0;
    setInterval(function() {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 5000);
  }

  function initMap() {
    var mapEl = document.getElementById('map');
    if (!mapEl || typeof L === 'undefined') return;
    var lat = 24.013995, lng = 90.3185405;
    var map = L.map('map').setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.marker([lat, lng]).addTo(map)
      .bindPopup('M.M. Group<br>Konabari, Gazipur, Bangladesh')
      .openPopup();
  }

  if (document.getElementById('map')) {
    var script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = initMap;
    document.head.appendChild(script);
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }
      var btn = this.querySelector('button[type="submit"]');
      var orig = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(function() {
        btn.textContent = 'Message Sent!';
        btn.style.background = 'linear-gradient(120deg,#0f766e,#0d9488)';
        setTimeout(function() {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
          contactForm.reset();
        }, 3000);
      }, 1500);
    });
  }
})();

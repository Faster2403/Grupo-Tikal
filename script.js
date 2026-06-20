/* ================================================================
   GRUPO TIKAL — script.js
   Módulos:
   1. Navbar — scroll y menú mobile
   2. Hero Slider — cambio automático de imágenes
   3. Galería Lightbox — ver fotos en grande
   4. Formulario de contacto — validación básica
   5. Scroll Reveal — animaciones de entrada
================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. NAVBAR
  ============================================================ */
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });


  /* ============================================================
     2. HERO SLIDER
  ============================================================ */
  const slides   = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('sliderDots');
  let currentSlide = 0;
  let sliderTimer  = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    dot.setAttribute('aria-label', `Foto ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slider-dot');

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function startSlider() {
    clearInterval(sliderTimer);
    sliderTimer = setInterval(nextSlide, 4000);
  }

  function stopSlider() {
    clearInterval(sliderTimer);
  }

  startSlider();

  const heroSection = document.querySelector('.hero');
  heroSection.addEventListener('mouseenter', stopSlider);
  heroSection.addEventListener('mouseleave', startSlider);


  /* ============================================================
     3. GALERÍA LIGHTBOX
  ============================================================ */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');

  const galeriaItems = document.querySelectorAll('.galeria-item');
  const galeriaImgs  = Array.from(galeriaItems).map(item => item.querySelector('img').src);
  let currentPhoto   = 0;

  galeriaItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      currentPhoto = i;
      openLightbox(i);
    });
  });

  function openLightbox(index) {
    lightboxImg.src = galeriaImgs[index];
    lightboxImg.alt = `Foto de concierto ${index + 1}`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  function showPrev() {
    currentPhoto = (currentPhoto - 1 + galeriaImgs.length) % galeriaImgs.length;
    lightboxImg.src = galeriaImgs[currentPhoto];
  }

  function showNext() {
    currentPhoto = (currentPhoto + 1) % galeriaImgs.length;
    lightboxImg.src = galeriaImgs[currentPhoto];
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });


  /* ============================================================
     4. FORMULARIO DE CONTACTO
  ============================================================ */
  const contactoForm = document.getElementById('contactoForm');
  const formSuccess  = document.getElementById('formSuccess');

  if (contactoForm) {
    contactoForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre  = contactoForm.querySelector('#nombre').value.trim();
      const email   = contactoForm.querySelector('#email').value.trim();
      const mensaje = contactoForm.querySelector('#mensaje').value.trim();

      if (!nombre || !email || !mensaje) {
        contactoForm.querySelectorAll('[required]').forEach(field => {
          if (!field.value.trim()) {
            field.style.borderColor = 'var(--naranja)';
            field.style.boxShadow   = '0 0 8px rgba(232, 77, 14, 0.3)';
            field.addEventListener('input', () => {
              field.style.borderColor = '';
              field.style.boxShadow   = '';
            }, { once: true });
          }
        });
        return;
      }

      const btnEnviar = contactoForm.querySelector('.btn-enviar');
      btnEnviar.textContent = 'Enviando...';
      btnEnviar.disabled    = true;

      setTimeout(() => {
        contactoForm.reset();
        btnEnviar.innerHTML = '<span>Enviar mensaje</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
        btnEnviar.disabled  = false;
        formSuccess.classList.add('visible');
        setTimeout(() => formSuccess.classList.remove('visible'), 5000);
      }, 1000);
    });
  }


  /* ============================================================
     5. SCROLL REVEAL
  ============================================================ */
  const revealTargets = [
    '.artista-bio',
    '.artista-spotify',
    '.galeria-item',
    '.dato-item',
    '.contacto-form',
    '.section-header',
  ];

  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

}); // fin DOMContentLoaded
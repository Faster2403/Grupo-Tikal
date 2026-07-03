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
/* ============================================================
     2. HERO SLIDER
  ============================================================ */
  const slides   = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('sliderDots');
  let currentSlide = 0;

  if(slides.length > 0 && dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if(i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Foto ${i + 1}`);
      dot.addEventListener('click', () => changeSlide(i));
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('.slider-dot');

    // Carga la imagen de fondo de un slide solo si aún no se ha cargado
    function loadSlide(index) {
      const slide = slides[index];
      if (slide.dataset.bg && !slide.style.backgroundImage) {
        slide.style.backgroundImage = `url('${slide.dataset.bg}')`;
      }
    }

    function changeSlide(index) {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      currentSlide = index;
      loadSlide(currentSlide);
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');

      // Precarga la siguiente foto mientras se ve la actual,
      // para que el cambio sea instantáneo cuando le toque
      const nextIndex = (currentSlide + 1) % slides.length;
      loadSlide(nextIndex);
    }

    // Precarga la segunda foto desde el inicio para la primera transición
    loadSlide(1);

    setInterval(() => {
      let next = (currentSlide + 1) % slides.length;
      changeSlide(next);
    }, 5000);
  }

  /* ============================================================
     3. GALERÍA LIGHTBOX
  ============================================================ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galeriaItems = document.querySelectorAll('.galeria-item img');
  
  let currentPhoto = 0;
  const galeriaImgs = Array.from(galeriaItems).map(img => img.src);

  document.querySelectorAll('.galeria-item').forEach(item => {
    item.addEventListener('click', () => {
      currentPhoto = parseInt(item.getAttribute('data-index')) || 0;
      lightboxImg.src = galeriaImgs[currentPhoto];
      lightbox.classList.add('open');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
  }

  function showPrev() {
    currentPhoto = (currentPhoto - 1 + galeriaImgs.length) % galeriaImgs.length;
    lightboxImg.src = galeriaImgs[currentPhoto];
  }

  function showNext() {
    currentPhoto = (currentPhoto + 1) % galeriaImgs.length;
    lightboxImg.src = galeriaImgs[currentPhoto];
  }

  if(lightboxClose && lightboxPrev && lightboxNext) {
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
  }


  /* ============================================================
     4. FORMULARIO DE CONTACTO
  ============================================================ */
  const form = document.getElementById('contactoForm');
  if(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo muy pronto.');
      form.reset();
    });
  }


  /* ============================================================
     5. SCROLL REVEAL
  ============================================================ */
  const revealTargets = [
    '.artista-bio',
    '.artista-spotify',
    '.galeria-item',
    '.contacto-form',
    '.section-header',
  ];

  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.05}s`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.getElementById('footerYear').textContent = new Date().getFullYear();

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
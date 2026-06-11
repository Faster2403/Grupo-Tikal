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
     — Se oscurece al hacer scroll
     — Toggle del menú hamburguesa en mobile
  ============================================================ */
  const navbar   = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  // Oscurecer navbar al bajar 50px
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Abrir/cerrar menú mobile
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Cerrar menú al hacer clic en un link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });


  /* ============================================================
     2. HERO SLIDER
     — Cambia de foto automáticamente cada 5 segundos
     — Genera los puntos indicadores dinámicamente
     — Pausa en hover para mejor UX
  ============================================================ */
  const slides    = document.querySelectorAll('.hero-slide');
  const dotsWrap  = document.getElementById('sliderDots');
  let currentSlide = 0;
  let sliderTimer  = null;

  // Crear puntos indicadores según el número de slides
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    dot.setAttribute('aria-label', `Foto ${i + 1}`);
    if (i === 0) dot.classList.add('active');

    // Al hacer clic en un punto, ir a ese slide
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slider-dot');

  // Función para ir a un slide específico
  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  // Función para avanzar al siguiente slide
  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  // Iniciar rotación automática cada 5 segundos
  function startSlider() {
    sliderTimer = setInterval(nextSlide, 5000);
  }

  function stopSlider() {
    clearInterval(sliderTimer);
  }

  startSlider();

  // Pausar en hover (mejor UX)
  const heroSection = document.querySelector('.hero');
  heroSection.addEventListener('mouseenter', stopSlider);
  heroSection.addEventListener('mouseleave', startSlider);


  /* ============================================================
     3. GALERÍA LIGHTBOX
     — Abre foto en grande al hacer clic
     — Navegación entre fotos con flechas y teclado
     — Cierra con X, fondo o tecla Escape
  ============================================================ */
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  // Lista de imágenes de la galería en orden
  const galeriaItems = document.querySelectorAll('.galeria-item');
  const galeriaImgs  = Array.from(galeriaItems).map(item => item.querySelector('img').src);
  let currentPhoto   = 0;

  // Abrir lightbox al hacer clic en una foto
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
    document.body.style.overflow = 'hidden'; // bloquear scroll del body
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

  // Botones del lightbox
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  // Cerrar al hacer clic en el fondo (no en la imagen)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });


  /* ============================================================
     4. FORMULARIO DE CONTACTO
     — Validación básica de campos requeridos
     — Muestra mensaje de éxito al enviar
     — (Conectar con backend o servicio de email al hostear)
  ============================================================ */
  const contactoForm  = document.getElementById('contactoForm');
  const formSuccess   = document.getElementById('formSuccess');

  contactoForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenir envío real por ahora

    // Validar que los campos requeridos no estén vacíos
    const nombre  = contactoForm.querySelector('#nombre').value.trim();
    const email   = contactoForm.querySelector('#email').value.trim();
    const mensaje = contactoForm.querySelector('#mensaje').value.trim();

    if (!nombre || !email || !mensaje) {
      // Resaltar campos vacíos
      contactoForm.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = 'var(--naranja)';
          field.style.boxShadow   = '0 0 8px rgba(232, 77, 14, 0.3)';
          // Quitar el resaltado al escribir
          field.addEventListener('input', () => {
            field.style.borderColor = '';
            field.style.boxShadow   = '';
          }, { once: true });
        }
      });
      return;
    }

    // Simular envío exitoso
    // TODO al hostear: reemplazar con fetch() a tu endpoint de correo
    const btnEnviar = contactoForm.querySelector('.btn-enviar');
    btnEnviar.textContent = 'Enviando...';
    btnEnviar.disabled    = true;

    setTimeout(() => {
      contactoForm.reset();
      btnEnviar.innerHTML = '<span>Enviar mensaje</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      btnEnviar.disabled  = false;
      formSuccess.classList.add('visible');

      // Ocultar el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        formSuccess.classList.remove('visible');
      }, 5000);
    }, 1000);
  });


  /* ============================================================
     5. SCROLL REVEAL
     — Anima elementos al entrar en el viewport
     — Usa IntersectionObserver para performance
  ============================================================ */

  // Agregar clase .reveal a los elementos que queremos animar
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
      // Retraso escalonado para listas de elementos (galería, datos, etc.)
      el.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  // Observer que detecta cuando el elemento entra al viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // dejar de observar una vez visible
      }
    });
  }, {
    threshold: 0.12,   // el elemento debe estar 12% visible
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

}); // fin DOMContentLoaded

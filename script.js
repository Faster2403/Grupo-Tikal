/* =============================================
   GRUPO TIKAL — CUMBIA ANDINA
   script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── LIGHTBOX ── */
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lb-img');
  const lbClose   = document.getElementById('lb-close');

  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      lbImg.src = img.src;
      lightbox.classList.add('active');
    });
  });

  lbClose.addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });

  // Cerrar lightbox con tecla Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') lightbox.classList.remove('active');
  });


  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll(
    '.testi-card, .paquete-card, .gallery-item, .video-card, .about-img, .stat'
  );

  revealEls.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(30px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target); // sólo una vez
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));


  /* ── FORMULARIO DE CONTACTO ── */
  const btnSend = document.getElementById('btn-send');
  if (btnSend) {
    btnSend.addEventListener('click', () => {
      const nombre = document.getElementById('f-nombre').value.trim();
      const tel    = document.getElementById('f-tel').value.trim();
      const email  = document.getElementById('f-email').value.trim();

      if (!nombre || !tel || !email) {
        alert('Por favor completa al menos tu nombre, teléfono y correo. 😊');
        return;
      }
      // Aquí puedes conectar un servicio como Formspree, EmailJS, etc.
      alert(`¡Gracias ${nombre}! Pronto nos pondremos en contacto contigo. 🎶`);
    });
  }


  /* ── NAV: SCROLL ACTIVO ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}`
        ? 'var(--oro-cl)' : '';
    });
  });

});
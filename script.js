// Alexis Socías · Abogado Penalista — interacciones del sitio

document.addEventListener('DOMContentLoaded', () => {

  // --- Grano de textura (overlay global, sutil) ---
  const grain = document.createElement('div');
  grain.className = 'grain';
  document.body.appendChild(grain);

  // --- Barra de progreso de scroll ---
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);
  const updateProgress = () => {
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = (isFinite(pct) ? pct : 0) + '%';
  };
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // --- Nav: fondo más opaco al hacer scroll ---
  const navEl = document.querySelector('.nav');
  const onScrollNav = () => {
    if (!navEl) return;
    navEl.classList.toggle('scrolled', window.scrollY > 12);
  };
  document.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  // --- Titular partido en palabras con animación escalonada ---
  document.querySelectorAll('h1').forEach(h1 => {
    if (h1.dataset.split === 'done') return;
    const html = h1.innerHTML;
    const lines = html.split('<br>');
    h1.innerHTML = lines.map(line => {
      return line.trim().split(' ').map((word, i) => {
        return `<span class="split-word" style="--i:${i}"><span>${word}</span></span>`;
      }).join(' ');
    }).join('<br>');
    h1.dataset.split = 'done';
    requestAnimationFrame(() => {
      setTimeout(() => {
        h1.querySelectorAll('.split-word').forEach(w => w.classList.add('in'));
      }, 60);
    });
  });

  // --- Tilt 3D suave en la foto del hero, según la posición del ratón ---
  const heroPhoto = document.querySelector('.hero-photo');
  if (heroPhoto) {
    heroPhoto.addEventListener('mousemove', (e) => {
      const r = heroPhoto.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      heroPhoto.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
    });
    heroPhoto.addEventListener('mouseleave', () => {
      heroPhoto.style.transform = 'rotateY(0) rotateX(0) scale(1)';
    });
  }

  // --- Contadores animados (data-count) ---
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1200;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => counterObs.observe(el));
  }

  // --- Menú móvil ---
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // --- Nav activo según la página actual ---
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // --- Animaciones al hacer scroll ---
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // --- Envío del formulario de contacto (Formspree) ---
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      const action = form.getAttribute('action') || '';
      if (action.includes('TU_ID_DE_FORMSPREE')) {
        // Formspree todavía no está configurado: evita un envío roto
        e.preventDefault();
        alert('Formulario en configuración. Sigue el paso 4 de la guía de publicación (Formspree) para activarlo.');
        return;
      }
      // Deja que Formspree gestione el envío normalmente (POST estándar).
    });
  }
});

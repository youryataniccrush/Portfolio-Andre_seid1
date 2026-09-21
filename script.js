/* ============================================================
   J. ANDRÉ — THE HOLLOW ROAD · SCRIPT
   ============================================================ */

(function () {
  'use strict';

  function initClock() {
    const el = document.getElementById('topbarClock');
    if (!el) return;
    function update() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      el.textContent = `${h}:${m}`;
    }
    update();
    setInterval(update, 60000);
  }

  function initCursor() {
    const cursor = document.getElementById('cursor');
    const label = document.getElementById('cursorLabel');
    if (!cursor || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      if (cursor) cursor.style.display = 'none';
      return;
    }
    let mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animate() {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    }
    animate();
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hover');
        if (label) label.textContent = el.dataset.cursor;
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hover');
        if (label) label.textContent = '';
      });
    });
    document.querySelectorAll('a, button, .evidencia').forEach(el => {
      if (el.hasAttribute('data-cursor')) return;
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  function initTopbar() {
    const topbar = document.getElementById('topbar');
    const toggle = document.getElementById('topbarToggle');
    const nav = document.getElementById('topbarNav');
    const links = document.querySelectorAll('.topbar__link');
    const sections = document.querySelectorAll('.cover, .section');

    window.addEventListener('scroll', () => {
      topbar.classList.toggle('is-scrolled', window.scrollY > 40);
    }, { passive: true });

    toggle?.addEventListener('click', () => {
      toggle.classList.toggle('is-open');
      nav.classList.toggle('is-open');
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        toggle?.classList.remove('is-open');
        nav?.classList.remove('is-open');
      });
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.35, rootMargin: '-15% 0px -40% 0px' });

    sections.forEach(s => { if (s.id) observer.observe(s); });

    const progress = document.getElementById('progress');
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = ((window.scrollY / max) * 100) + '%';
    }, { passive: true });
  }

  function initReveal() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  function initCV() {
    const toggle = document.getElementById('cvToggle');
    const block = document.getElementById('cvBlock');
    const toggleText = toggle?.querySelector('.btn__text');
    const toggleArrow = toggle?.querySelector('.btn__arrow');
    if (!toggle || !block) return;

    toggle.addEventListener('click', () => {
      const isOpen = block.classList.contains('is-open');
      block.classList.toggle('is-open', !isOpen);
      if (toggleText) toggleText.textContent = !isOpen ? 'Fechar currículo' : 'Abrir currículo';
      if (toggleArrow) toggleArrow.textContent = !isOpen ? '↑' : '↓';
      if (!isOpen) {
        setTimeout(() => {
          block.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    });
  }

  function initForm() {
    const form = document.getElementById('cform');
    const feedback = document.getElementById('cformFeedback');
    const stamp = document.getElementById('cstamp');
    const stampClose = document.getElementById('cstampClose');
    const btnText = document.getElementById('cformSubmitText');
    const caseEl = document.getElementById('cformCase');

    if (!form) return;
    if (caseEl) caseEl.textContent = String(Math.floor(Math.random() * 9000) + 1000);

    form.addEventListener('submit', async e => {
      e.preventDefault();

      const nome = document.getElementById('nome').value.trim();
      const email = document.getElementById('email').value.trim();

      if (!nome || !email) {
        feedback.textContent = 'PREENCHA NOME E E-MAIL PARA CONTINUAR.';
        feedback.classList.add('is-error');
        return;
      }
      feedback.textContent = '';
      feedback.classList.remove('is-error');

      form.classList.add('is-sending');
      if (btnText) btnText.textContent = 'Transmitindo...';

      const formData = new FormData(form);

      try {
        await fetch('https://formsubmit.co/ajax/joaoandre0330@gmail.com', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });

        form.classList.remove('is-sending');
        form.classList.add('is-sent');

        setTimeout(() => {
          stamp.classList.add('is-open');
          stamp.setAttribute('aria-hidden', 'false');
        }, 300);

        form.reset();
        if (btnText) btnText.textContent = 'Transmitir mensagem';
      } catch (err) {
        form.classList.remove('is-sending');
        if (btnText) btnText.textContent = 'Transmitir mensagem';
        feedback.textContent = 'FALHA NA TRANSMISSÃO. TENTE VIA INSTAGRAM.';
        feedback.classList.add('is-error');
      }
    });

    stampClose?.addEventListener('click', () => {
      stamp.classList.remove('is-open');
      stamp.setAttribute('aria-hidden', 'true');
      form.classList.remove('is-sent');
    });
  }

  function initFooter() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initCursor();
    initTopbar();
    initReveal();
    initCV();
    initForm();
    initFooter();
  });

})();
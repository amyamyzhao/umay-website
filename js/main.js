/**
 * UMAY GARMENT �?Main JavaScript
 * LuxoPack-style single-page B2B site
 */

document.addEventListener('DOMContentLoaded', function() {

  // ===== Header scroll =====
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ===== Mobile nav =====
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function() {
      mobileNav.classList.toggle('active');
      const s = navToggle.querySelectorAll('span');
      if (mobileNav.classList.contains('active')) {
        s[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        s[1].style.opacity = '0';
        s[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        s[0].style.transform = s[1].style.opacity = s[2].style.transform = '';
      }
    });
    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('active');
        const s = navToggle.querySelectorAll('span');
        s[0].style.transform = s[1].style.opacity = s[2].style.transform = '';
      });
    });
  }

  // ===== Active nav link on scroll =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  function updateActiveLink() {
    let current = '';
    sections.forEach(function(section) {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }
  window.addEventListener('scroll', updateActiveLink);

  // ===== FAQ accordion =====
  window.toggleFaq = function(btn) {
    var item = btn.parentElement;
    var isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach(function(el) {
      el.classList.remove('open');
    });
    // Open clicked (unless it was already open)
    if (!isOpen) item.classList.add('open');
  };

  // ===== Inquiry form �� Web3Forms email + WhatsApp =====
  window.handleInquirySubmit = function(event) {
    event.preventDefault();
    var form = document.getElementById('inquiryForm');
    if (!form) return;

    var siteLanguage = (document.documentElement.lang || 'en').toLowerCase().split('-')[0];
    var localizedCopy = {
      es: { required: 'Complete todos los campos obligatorios.', invalidEmail: 'Introduzca un correo electrónico válido.', sending: 'Enviando...', sent: '&#10003; Consulta enviada. Abriendo WhatsApp...', reset: 'Enviar consulta', failed: 'No se pudo confirmar el envío. Inténtelo de nuevo o utilice WhatsApp.', restored: 'Privado y seguro. Cathy responderá por correo o WhatsApp.', whatsappIntro: 'Hola UMAY Garment, deseo comentar un proyecto de prendas exteriores personalizadas.' },
      ru: { required: 'Заполните все обязательные поля.', invalidEmail: 'Укажите корректный адрес электронной почты.', sending: 'Отправка...', sent: '&#10003; Запрос отправлен. Открываем WhatsApp...', reset: 'Отправить запрос', failed: 'Не удалось подтвердить отправку. Повторите попытку или используйте WhatsApp.', restored: 'Безопасно и конфиденциально. Cathy ответит по электронной почте или в WhatsApp.', whatsappIntro: 'Здравствуйте, UMAY Garment. Я хочу обсудить проект женской верхней одежды на заказ.' },
      en: { required: 'Please fill in all required fields (marked with *).', invalidEmail: 'Please enter a valid email address.', sending: 'Sending...', sent: '&#10003; Inquiry sent. Opening WhatsApp...', reset: 'Send My Inquiry', failed: 'We could not confirm the email submission. Please try again or use WhatsApp.', restored: 'Safe & private. Cathy will reply by email or WhatsApp.', whatsappIntro: 'Hello UMAY Garment, I would like to discuss a custom outerwear project.' }
    };
    var pageCopy = localizedCopy[siteLanguage] || localizedCopy.en;

    var name        = ((form.querySelector('#name')        || {}).value || '').trim();
    var email       = ((form.querySelector('#email')       || {}).value || '').trim();
    var company     = ((form.querySelector('#company')     || {}).value || '').trim();
    var whatsapp    = ((form.querySelector('#whatsapp')    || {}).value || '').trim();
    var productType = ((form.querySelector('#productType') || {}).value || '');
    var quantity    = ((form.querySelector('#quantity')    || {}).value || '');
    var message     = ((form.querySelector('#message')     || {}).value || '').trim();

    if (!name || !email || !productType || !quantity) {
      alert(pageCopy.required);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert(pageCopy.invalidEmail);
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = pageCopy.sending; }

    var emailBody = [
      'Name: ' + name,
      'Company: ' + (company || 'N/A'),
      'Email: ' + email,
      'WhatsApp/Phone: ' + (whatsapp || 'N/A'),
      'Product Type: ' + productType,
      'Quantity: ' + quantity,
      'Requirements: ' + (message || 'N/A')
    ].join('\n');

    // Send email via Web3Forms
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '9019729d-8d65-4cd8-9c61-f22331136d54',
        subject: '[' + siteLanguage.toUpperCase() + '] New Inquiry from ' + name + ' — ' + productType,
        from_name: 'Umay Garment Website',
        replyto: email,
        message: emailBody
      })
    })
    .then(function(r) {
      if (!r.ok) throw new Error('Web3Forms request failed');
      return r.json();
    })
    .then(function(data) {
      if (!data || data.success !== true) {
        throw new Error('Web3Forms did not confirm success');
      }
      if (typeof window.umayTrack === 'function') {
        window.umayTrack('generate_lead', {
          lead_source: 'web3forms',
          form_id: 'inquiryForm',
          site_language: siteLanguage
        });
      }

      var waMsg = encodeURIComponent([
        pageCopy.whatsappIntro,
        '',
        'Name: ' + name,
        'Company: ' + (company || 'N/A'),
        'Email: ' + email,
        'Product: ' + productType,
        'Quantity: ' + quantity,
        'Message: ' + (message || 'N/A')
      ].join('\n'));

      form.reset();
      var note = form.querySelector('.form-note');
      if (note) {
        note.style.color = '#16a34a';
        note.style.fontWeight = '700';
        note.innerHTML = pageCopy.sent;
      }
      if (btn) { btn.disabled = false; btn.textContent = pageCopy.reset; }

      setTimeout(function() {
        window.open('https://wa.me/8618857337355?text=' + waMsg, '_blank');
        if (note) {
          note.style.color = '';
          note.style.fontWeight = '';
          note.textContent = pageCopy.restored;
        }
      }, 1200);
    })
    .catch(function() {
      if (btn) { btn.disabled = false; btn.textContent = pageCopy.reset; }
      var note = form.querySelector('.form-note');
      if (note) {
        note.style.color = '#b91c1c';
        note.style.fontWeight = '700';
        note.textContent = pageCopy.failed;
      }
    });
  };

  // ===== Scroll animations =====
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    var animTargets = document.querySelectorAll(
      '.product-card, .material-card, .market-card, .review-card, .resource-card, .process-step, .stat-cell, .featured-product'
    );
    animTargets.forEach(function(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  // ===== Update copyright year =====
  var footers = document.querySelectorAll('.footer-bottom p');
  footers.forEach(function(p) {
    p.innerHTML = p.innerHTML.replace('2026', new Date().getFullYear());
  });

});

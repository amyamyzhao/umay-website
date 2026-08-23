/**
 * UMAY GARMENT â€?Main JavaScript
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

  // ===== Inquiry form ¡ª Web3Forms email + WhatsApp =====
  window.handleInquirySubmit = function(event) {
    event.preventDefault();
    var form = document.getElementById('inquiryForm');
    if (!form) return;

    var name        = ((form.querySelector('#name')        || {}).value || '').trim();
    var email       = ((form.querySelector('#email')       || {}).value || '').trim();
    var company     = ((form.querySelector('#company')     || {}).value || '').trim();
    var whatsapp    = ((form.querySelector('#whatsapp')    || {}).value || '').trim();
    var productType = ((form.querySelector('#productType') || {}).value || '');
    var quantity    = ((form.querySelector('#quantity')    || {}).value || '');
    var message     = ((form.querySelector('#message')     || {}).value || '').trim();

    if (!name || !email || !productType || !quantity) {
      alert('Please fill in all required fields (marked with *).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

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
        subject: 'New Inquiry from ' + name + ' ¡ª ' + productType,
        from_name: 'Umay Garment Website',
        replyto: email,
        message: emailBody
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var waMsg = 'Hello+Umay+Garment%21%0A%0A'
        + 'Name%3A+' + encodeURIComponent(name) + '%0A'
        + 'Company%3A+' + encodeURIComponent(company || 'N/A') + '%0A'
        + 'Email%3A+' + encodeURIComponent(email) + '%0A'
        + 'Product%3A+' + encodeURIComponent(productType) + '%0A'
        + 'Quantity%3A+' + encodeURIComponent(quantity) + '%0A'
        + 'Message%3A+' + encodeURIComponent(message || 'N/A');

      form.reset();
      var note = form.querySelector('.form-note');
      if (note) {
        note.style.color = '#16a34a';
        note.style.fontWeight = '700';
        note.innerHTML = data.success
          ? '&#10003; Inquiry sent to cathy@umaygarment.com! Opening WhatsApp...'
          : '&#10003; Redirecting to WhatsApp...';
      }
      if (btn) { btn.disabled = false; btn.textContent = 'Send My Inquiry'; }

      setTimeout(function() {
        window.open('https://wa.me/8618857337355?text=' + waMsg, '_blank');
        if (note) {
          note.style.color = '';
          note.style.fontWeight = '';
          note.innerHTML = 'Safe & private. Reply within 24h. <strong>cathy@umaygarment.com</strong> | WhatsApp: <strong>+86 188 5733 7355</strong>';
        }
      }, 1200);
    })
    .catch(function() {
      // Fallback: still open WhatsApp even if email fails
      if (btn) { btn.disabled = false; btn.textContent = 'Send My Inquiry'; }
      window.open('https://wa.me/8618857337355?text=Hello+Umay+Garment%2C+I+just+viewed+your+premium+fur+collection+and+would+like+to+discuss+a+custom+project.+Can+we+chat%3F', '_blank');
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

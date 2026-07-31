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

  // ===== Inquiry form submission =====
  window.handleInquirySubmit = function(event) {
    event.preventDefault();
    var form = document.getElementById('inquiryForm');
    if (!form) return;

    var name = form.querySelector('#name').value.trim();
    var email = form.querySelector('#email').value.trim();
    var productType = form.querySelector('#productType').value;
    var quantity = form.querySelector('#quantity').value;

    if (!name || !email || !productType || !quantity) {
      alert('Please fill in all required fields (marked with *).');
      return;
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // In production: replace with your form endpoint
    // For now, redirect to WhatsApp with inquiry summary
    var whatsapp = form.querySelector('#whatsapp').value.trim();
    var messageText = form.querySelector('#message').value.trim();
    var company = form.querySelector('#company').value.trim();

    var waText = 'Hello+Umay+Garment!%0A%0A' +
      'Name:+' + encodeURIComponent(name) + '%0A' +
      'Company:+' + encodeURIComponent(company || 'N/A') + '%0A' +
      'Email:+' + encodeURIComponent(email) + '%0A' +
      'Product:+' + encodeURIComponent(productType) + '%0A' +
      'Quantity:+' + encodeURIComponent(quantity) + '%0A' +
      'Message:+' + encodeURIComponent(messageText || 'N/A');

    alert('Thank you, ' + name + '! Redirecting you to WhatsApp for faster response...');

    // Replace YOURNUMBER with actual WhatsApp number
    var waUrl = 'https://wa.me/8618857337355?text=' + waText;
    window.open(waUrl, '_blank');

    form.reset();
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

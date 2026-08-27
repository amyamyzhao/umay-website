/**
 * UMAY GA4 event collection.
 * Website Measurement ID only. Do not add GA4 Property IDs or personal data here.
 */
(function (window, document) {
  'use strict';

  if (window.__umayGa4Initialized) return;
  window.__umayGa4Initialized = true;

  var measurementId = 'G-48E03JP8PV';
  var productionHost = window.location.hostname === 'www.umaygarment.com';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  function canonicalUrl() {
    var canonical = document.querySelector('link[rel="canonical"]');
    return canonical ? canonical.href : 'https://www.umaygarment.com' + window.location.pathname;
  }

  if (productionHost) {
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { page_location: canonicalUrl() });
  }

  if (productionHost && !document.querySelector('script[data-umay-ga4-loader]')) {
    var loader = document.createElement('script');
    loader.async = true;
    loader.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    loader.setAttribute('data-umay-ga4-loader', '');
    document.head.appendChild(loader);
  }

  function sendEvent(name, parameters) {
    window.gtag('event', name, parameters || {});
  }

  var categorySlugs = [
    'cashmere-sheep',
    'faux-fur',
    'fox-fur',
    'leather-jacket',
    'raccoon-fur'
  ];

  function trackProductView() {
    var path = window.location.pathname.replace(/\/+$/, '') || '/';
    if (path.indexOf('/products/') !== 0) return;

    var slug = path.slice('/products/'.length).replace(/\.html$/i, '');
    if (!slug || categorySlugs.indexOf(slug) !== -1) return;

    var heading = document.querySelector('h1');
    var pageName = heading ? heading.textContent.trim() : slug.replace(/-/g, ' ');
    var skuMeta = document.querySelector('meta[name="umay:sku"]');

    sendEvent('view_item', {
      items: [{
        item_id: skuMeta ? skuMeta.content : slug,
        item_name: pageName,
        item_brand: 'UMAY'
      }]
    });
  }

  document.addEventListener('click', function (event) {
    if (!event.isTrusted) return;
    var link = event.target.closest && event.target.closest(
      'a[href*="wa.me/"],a[href*="api.whatsapp.com/"],a[href*="whatsapp.com/"]'
    );
    if (!link) return;
    sendEvent('whatsapp_click', {
      page_type: window.location.pathname.indexOf('/products/') === 0 ? 'product' : 'content',
      link_location: link.className ? String(link.className).slice(0, 80) : 'text_link',
      page_path: window.location.pathname.replace(/\.html$/i, '')
    });
  }, true);

  window.umayTrack = sendEvent;

  trackProductView();
})(window, document);

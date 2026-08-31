document.querySelectorAll('[data-gallery]').forEach(function(gallery){
  var main=gallery.querySelector('.main-photo img');
  var source=gallery.querySelector('.main-photo source[type="image/webp"]');
  var caption=gallery.querySelector('.caption');
  var originalLink=gallery.querySelector('[data-original-link]');
  gallery.querySelectorAll('.thumb').forEach(function(btn){
    btn.addEventListener('click',function(){
      if(source&&btn.dataset.srcset)source.srcset=btn.dataset.srcset;
      main.src=btn.dataset.src;
      main.alt=btn.dataset.alt;
      if(btn.dataset.width)main.width=Number(btn.dataset.width);
      if(btn.dataset.height)main.height=Number(btn.dataset.height);
      if(originalLink)originalLink.href=btn.dataset.src;
      caption.textContent=btn.dataset.caption+' · Supplier photograph';
      gallery.querySelectorAll('.thumb').forEach(function(other){other.setAttribute('aria-pressed',String(other===btn))});
    });
  });
});
var toggle=document.querySelector('.nav-toggle');
if(toggle)toggle.addEventListener('click',function(){
  var nav=document.querySelector('#navLinks');
  var open=nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded',String(open));
});

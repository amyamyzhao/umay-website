
document.querySelectorAll('[data-gallery]').forEach(function(gallery){
  var main=gallery.querySelector('.main-photo img');
  var caption=gallery.querySelector('.caption');
  gallery.querySelectorAll('.thumb').forEach(function(btn){
    btn.addEventListener('click',function(){
      main.src=btn.dataset.src;
      main.alt=btn.dataset.alt;
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

document.querySelector('.nav-toggle')?.addEventListener('click',function(){
  const nav=document.getElementById('detailNavigation');
  const open=nav.classList.toggle('open');
  this.setAttribute('aria-expanded',String(open));
});
document.querySelectorAll('.gallery').forEach(gallery=>{
  const image=gallery.querySelector('.hero-image img');
  const buttons=[...gallery.querySelectorAll('.thumb')];
  buttons.forEach(button=>button.addEventListener('click',()=>{
    if(!image||!button.dataset.src)return;
    image.src=button.dataset.src;
    image.alt=button.dataset.alt||'';
    buttons.forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
    const caption=gallery.querySelector('.caption');
    if(caption&&button.dataset.caption)caption.textContent=button.dataset.caption+' · Supplier photograph';
  }));
});

(()=>{'use strict';
 const container=document.getElementById('variantData');if(!container)return;
 const data=JSON.parse(container.textContent),main=document.getElementById('productMainImage'),thumbs=document.querySelector('.thumbs');let previous=null;
 function select(){let hash='';try{hash=decodeURIComponent(location.hash.replace('#color-','')).toUpperCase()}catch{}
  const p=data.find(v=>v.sku===hash)||data[0];
  document.querySelectorAll('.variant-option').forEach(a=>a.setAttribute('aria-current',String(a.dataset.sku===p.sku)));
  const selected=document.querySelector('.selected-style');if(selected)selected.textContent=p.sku+' · '+p.color;
  document.querySelector('meta[name="umay:sku"]').content=p.sku;
  document.querySelectorAll('[data-style-whatsapp],header nav a[href*="wa.me"]').forEach(a=>a.href=p.whatsapp);
  const buttons=p.images.map((src,i)=>{const b=document.createElement('button');b.type='button';b.className='thumb';b.dataset.src=src;b.dataset.alt=p.title+' — '+p.captions[i];b.setAttribute('aria-label','View '+p.captions[i]);const img=document.createElement('img');img.src=src;img.alt=p.captions[i];b.append(img);b.addEventListener('click',()=>choose(i));return b;});
  function choose(i){main.src=p.images[i];main.alt=p.title+' — '+p.captions[i];buttons.forEach((b,j)=>{b.classList.toggle('active',i===j);b.setAttribute('aria-pressed',String(i===j));});}
  thumbs.replaceChildren(...buttons);choose(0);
  const photos=document.querySelector('.photo-grid');if(photos)photos.replaceChildren(...p.images.map((src,i)=>{const fig=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption');img.src=src;img.alt=p.title+' — '+p.captions[i];img.loading='lazy';caption.textContent=p.captions[i];fig.append(img,caption);return fig;}));
  if(previous&&previous!==p.sku&&typeof window.umayTrack==='function')window.umayTrack('view_item',{site_language:(document.documentElement.lang||'en').split('-')[0],items:[{item_id:p.sku,item_name:p.title,item_brand:'UMAY'}]});previous=p.sku;
 }
 window.addEventListener('hashchange',select);select();
 document.querySelector('.nav-toggle')?.addEventListener('click',e=>{const nav=document.querySelector('.site-header nav');const open=nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open));});
})();

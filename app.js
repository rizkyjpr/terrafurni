(() => {
  'use strict';
  const data=window.TERRA;
  const {esc,money,wa,finish,swatches}=window.TERRA_VIEW;
  const $=s=>document.querySelector(s);
  const root=document.body.dataset.root||'./';
  const selected=new Map(data.products.map(p=>[p.id,p.defaultFinish||'natural']));
  let currentProduct=null;
  function openDialog(dialog){dialog.showModal();document.body.classList.add('dialog-open');}
  function renderDetail(p){
    $('#product-detail').innerHTML=`<div class="detail-layout"><img class="detail-image" src="${root}${esc(p.image)}" alt="${esc(p.name)}${p.sampleImage?' — sample illustration':''}" width="1100" height="1100"><div class="detail-content"><p class="product-category">${esc(data.categories.find(c=>c[0]===p.category)[1])}</p><h2 id="detail-name">${esc(p.name)}</h2><div class="detail-price">${money(p.price)}${p.demo?' *':''}</div><p class="detail-description">${esc(p.description)}</p><dl class="detail-specs"><div><dt>Approx. size</dt><dd>${esc(p.size)} (W × D × H)</dd></div><div><dt>Material</dt><dd>${esc(p.material)}</dd></div></dl><p class="detail-finish-label">Preferred finish: <strong data-detail-finish>${esc(finish(data,p,selected.get(p.id)).name)}</strong></p>${swatches(data,p,selected.get(p.id),'detail')}<p class="detail-note">Your finish selection is included in the WhatsApp message. Photos do not change with the selected finish. Please confirm the final appearance and availability with Terra.</p><a class="primary-button" data-wa="${p.id}" href="${esc(wa(data,p,selected.get(p.id)))}" target="_blank" rel="noopener noreferrer">Enquire on WhatsApp <span aria-hidden="true">↗</span></a>${p.demo?`<p class="demo-disclaimer">* Prices, dimensions, materials and model names are sample catalogue information, not a final quotation.${p.sampleImage?' This is an AI-generated product illustration.':' Original product photo supplied by Terra.'} Please confirm final prices and delivery costs on WhatsApp.</p>`:''}</div></div>`;
  }
  document.addEventListener('click',e=>{
    const open=e.target.closest('[data-open]');if(open){currentProduct=data.products.find(p=>p.id===open.dataset.open);if(currentProduct){renderDetail(currentProduct);openDialog($('#product-dialog'));}return;}
    const swatch=e.target.closest('[data-finish]');if(swatch){const p=data.products.find(p=>p.id===swatch.dataset.product);selected.set(p.id,swatch.dataset.finish);document.querySelectorAll(`[data-product="${p.id}"][data-finish]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.finish===selected.get(p.id))));document.querySelectorAll(`[data-wa="${p.id}"]`).forEach(a=>a.href=wa(data,p,selected.get(p.id)));document.querySelectorAll(`[data-selection="${p.id}"]`).forEach(el=>el.textContent='Preferred finish: '+finish(data,p,selected.get(p.id)).name);if(currentProduct?.id===p.id&&$('[data-detail-finish]'))$('[data-detail-finish]').textContent=finish(data,p,selected.get(p.id)).name;$('#announcer').textContent=`${p.name} finish: ${finish(data,p,selected.get(p.id)).name}`;return;}
    const close=e.target.closest('.dialog-close');if(close)close.closest('dialog').close();
  });
  document.querySelectorAll('dialog').forEach(dialog=>{dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});});
  $('#open-finishes').addEventListener('click',()=>openDialog($('#finish-dialog')));
  $('#year').textContent=new Date().getFullYear();
  const active=$('.category-button[aria-current="page"]');
  if(active)active.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
})();

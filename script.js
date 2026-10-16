const b = document.querySelector('.burger'),
  m = document.getElementById('menu');
function toggle(f) {
  const o = f === undefined ? !m.classList.contains('aperto') : f;
  m.classList.toggle('aperto', o); b.classList.toggle('aperto', o);
  b.setAttribute('aria-expanded', o);
  b.setAttribute('aria-label', o ? 'Chiudi il menu' : 'Apri il menu');
  document.body.style.overflow = o ? 'hidden' : '';
}
b.addEventListener('click', () => toggle());
m.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false) });

// Freccia "scorri": va alla sezione #stanza (o scende di una schermata) e si nasconde dopo lo scroll
const freccia = document.querySelector('.scorri');
freccia.addEventListener('click', e => {
  if (!document.querySelector('#stanza')) {
    e.preventDefault();
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  }
});
function aggiornaFreccia() { freccia.classList.toggle('nascosto', window.scrollY > 80) }
window.addEventListener('scroll', aggiornaFreccia, { passive: true });
aggiornaFreccia();

// Sezione Dove siamo: costruisce mappa, testo e link dall'indirizzo in data-indirizzo
(function () {
  const sez = document.querySelector('.dove');
  if (!sez) return;

  const indirizzo = sez.dataset.indirizzo.trim();
  const q = encodeURIComponent(indirizzo);

  // Mappa reale (Google Maps, nessuna chiave API necessaria)
  sez.querySelector('iframe').src = 'https://www.google.com/maps?q=' + q + '&hl=it&z=16&output=embed';

  // Testo dell'indirizzo
  sez.querySelectorAll('[data-indirizzo-testo]').forEach(el => el.textContent = indirizzo);

  // Pulsante "Indica percorso": apre Google Maps con la navigazione verso la struttura
  sez.querySelector('[data-percorso]').href = 'https://www.google.com/maps/dir/?api=1&destination=' + q;

  // Pulsante "Copia indirizzo"
  const btn = sez.querySelector('[data-copia]');
  const etichetta = btn.textContent;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(indirizzo);
      btn.textContent = 'Copiato ✓';
    } catch (e) {
      const t = document.createElement('textarea');
      t.value = indirizzo; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); btn.textContent = 'Copiato ✓' } catch (_) { btn.textContent = 'Copia non riuscita' }
      t.remove();
    }
    setTimeout(() => btn.textContent = etichetta, 2000);
  });

  // Comparsa allo scroll
  if ('IntersectionObserver' in window) {
    sez.classList.add('pronto');
    const obs = new IntersectionObserver(v => v.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visibile'); obs.unobserve(e.target) }
    }), { threshold: .15 });
    sez.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }
})();

// Sezione Contatti: link WhatsApp con messaggio precompilato + comparsa allo scroll
(function(){
  const sez=document.querySelector('.contatti');
  if(!sez) return;

  // WhatsApp: numero e messaggio si cambiano negli attributi data- della sezione
  const numero=(sez.dataset.whatsapp||'').replace(/\D/g,'');
  const messaggio=sez.dataset.messaggio||'';
  const wa=sez.querySelector('[data-whatsapp-link]');
  if(wa&&numero){
    wa.href='https://wa.me/'+numero+(messaggio?'?text='+encodeURIComponent(messaggio):'');
  }

  // Comparsa a cascata mentre si scorre
  if('IntersectionObserver' in window){
    sez.classList.add('pronto');
    const obs=new IntersectionObserver(voci=>voci.forEach(v=>{
      if(v.isIntersecting){
        const el=v.target,i=[...el.parentNode.children].indexOf(el);
        el.style.transitionDelay=(el.classList.contains('contatto')?i*80:0)+'ms';
        el.classList.add('visibile');
        // tolgo il ritardo a fine animazione, così l'effetto hover resta immediato
        setTimeout(()=>{el.style.transitionDelay=''},1200);
        obs.unobserve(el);
      }
    }),{threshold:.15});
    sez.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
  }
})();

// Footer: anno automatico nel copyright + pulsante "torna in alto"
(function(){
  const footer=document.querySelector('.footer');
  if(!footer) return;

  footer.querySelectorAll('[data-anno]').forEach(el=>el.textContent=new Date().getFullYear());

  const su=footer.querySelector('[data-su]');
  if(su){
    su.addEventListener('click',()=>{
      const ridotto=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({top:0,behavior:ridotto?'auto':'smooth'});
    });
  }
})();
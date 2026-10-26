/* Shared behaviour: island nav, scroll reveal, tagline words, previews, copy email.
   No scroll listeners: everything runs through IntersectionObserver or ResizeObserver. */
(function(){
  var d=document, reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO='IntersectionObserver' in window;

  /* ---------- island nav ---------- */
  var btn=d.querySelector('.menu-btn'), menu=d.getElementById('menu');
  if(btn&&menu){
    var links=menu.querySelectorAll('a');
    var setMenu=function(open,returnFocus){
      btn.setAttribute('aria-expanded',String(open));
      menu.classList.toggle('open',open);
      d.body.classList.toggle('menu-open',open);
      if(open){setTimeout(function(){if(links[0])links[0].focus()},60)}
      else if(returnFocus){btn.focus()}
    };
    btn.addEventListener('click',function(){setMenu(btn.getAttribute('aria-expanded')!=='true',true)});
    links.forEach(function(a){a.addEventListener('click',function(){setMenu(false,false)})});
    d.addEventListener('keydown',function(e){
      var open=btn.getAttribute('aria-expanded')==='true';
      if(!open) return;
      if(e.key==='Escape'){setMenu(false,true);return}
      if(e.key==='Tab'){
        var ring=[btn].concat([].slice.call(links).filter(function(a){return a.offsetParent!==null}));
        var i=ring.indexOf(d.activeElement);
        if(e.shiftKey&&(i<=0)){e.preventDefault();ring[ring.length-1].focus()}
        else if(!e.shiftKey&&(i===ring.length-1)){e.preventDefault();ring[0].focus()}
      }
    });
  }

  /* ---------- scroll reveal (fade up, blur out) ---------- */
  var rv=[].slice.call(d.querySelectorAll('.rv'));
  function show(el){
    el.classList.add('in');
    setTimeout(function(){el.classList.add('done')},1200+(parseInt(el.dataset.d,10)||0));
  }
  rv.forEach(function(el){if(el.dataset.d) el.style.transitionDelay=el.dataset.d+'ms'});
  if(!hasIO||reduce){rv.forEach(function(el){el.classList.add('in','done')})}
  else{
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target)}});
    },{threshold:.12,rootMargin:'0px 0px -5% 0px'});
    rv.forEach(function(el){io.observe(el)});
  }

  /* ---------- staircase draw ---------- */
  var st=d.querySelector('.stairs');
  if(st){
    if(!hasIO||reduce) st.classList.add('go');
    else{
      var so=new IntersectionObserver(function(es){
        if(es[0].isIntersecting){st.classList.add('go');so.disconnect()}
      },{threshold:.3});
      so.observe(st);
    }
  }

  /* ---------- tagline: words light up one at a time ---------- */
  var words=[];
  d.querySelectorAll('[data-words]').forEach(function(p){
    (function walk(node){
      [].slice.call(node.childNodes).forEach(function(n){
        if(n.nodeType===3){
          var parts=n.textContent.split(/(\s+)/), frag=d.createDocumentFragment();
          parts.forEach(function(s){
            if(!s) return;
            if(/^\s+$/.test(s)){frag.appendChild(d.createTextNode(' '));return}
            var w=d.createElement('span'); w.className='w'; w.textContent=s;
            w.dataset.i=words.length; words.push(w); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag,n);
        }else if(n.nodeType===1){walk(n)}
      });
    })(p);
  });
  if(words.length){
    if(!hasIO||reduce){words.forEach(function(w){w.classList.add('on')})}
    else{
      var wo=new IntersectionObserver(function(es){
        var batch=0;
        es.sort(function(a,b){return a.target.dataset.i-b.target.dataset.i});
        es.forEach(function(e){
          var w=e.target;
          if(e.isIntersecting){w.style.transitionDelay=(batch++*60)+'ms';w.classList.add('on')}
          else if(e.boundingClientRect.top>0){w.style.transitionDelay='0ms';w.classList.remove('on')}
        });
      },{threshold:0,rootMargin:'0px 0px -45% 0px'});
      words.forEach(function(w){wo.observe(w)});
    }
  }

  /* ---------- scaled live previews ---------- */
  var frames=[].slice.call(d.querySelectorAll('.media[data-fit]'));
  function fit(m){var f=m.querySelector('iframe'); if(f) f.style.transform='scale('+(m.clientWidth/1280)+')'}
  if(frames.length){
    if('ResizeObserver' in window){var ro=new ResizeObserver(function(es){es.forEach(function(e){fit(e.target)})});frames.forEach(function(m){ro.observe(m)})}
    else frames.forEach(fit);
  }

  /* ---------- copy email ---------- */
  d.querySelectorAll('[data-copy]').forEach(function(b){
    var out=d.getElementById(b.dataset.status), label=b.querySelector('.lbl'), orig=label?label.textContent:'';
    function say(msg,err){if(out){out.textContent=msg;out.classList.toggle('err',!!err)}}
    b.addEventListener('click',function(){
      var v=b.dataset.copy;
      if(!navigator.clipboard){say('Copy is not available here. The address is '+v+'.',true);return}
      navigator.clipboard.writeText(v).then(function(){
        if(label) label.textContent='Copied';
        say('Address copied to your clipboard.',false);
        setTimeout(function(){if(label) label.textContent=orig;say('',false)},3000);
      }).catch(function(){say('Copy failed. Select the address instead: '+v+'.',true)});
    });
  });
  /* ---------- mailto with webmail fallback ---------- */
  /* Many desktops have no mail app, so a plain mailto does nothing. Try it, and if the page keeps focus, open Gmail instead. */
  d.querySelectorAll('a[href^="mailto:"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var u=a.getAttribute('href').replace(/^mailto:/,''), q=u.split('?'), to=q[0], su='';
      (q[1]||'').split('&').forEach(function(kv){if(kv.indexOf('subject=')===0) su=kv.slice(8)});
      e.preventDefault();
      var left=false;
      function mark(){left=true}
      window.addEventListener('blur',mark,{once:true});
      d.addEventListener('visibilitychange',mark,{once:true});
      window.location.href=a.getAttribute('href');
      setTimeout(function(){
        if(left) return;
        window.open('https://mail.google.com/mail/?view=cm&fs=1&to='+to+(su?'&su='+su:''),'_blank','noopener');
      },900);
    });
  });
})();

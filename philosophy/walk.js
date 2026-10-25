(function(){
  var cv=document.getElementById('walk'); if(!cv) return;
  var ctx=cv.getContext('2d');
  var W=560,H=340,CX=280,CY=246,RX=188,RY=48;
  var OMEGA=0.2, STEP=4.6, SLOT=3.8;
  var ROBE=['#5F86B3','#C2A262','#8F76B8','#6FA08A','#B1685A','#CFC8B2','#7A8AA3','#B98A52'];
  var SKIN='#E2C6A2';
  var GLYPH_SAY=['τί ἐστιν;','λόγος','ἀρετή','πόλις','εὐδαιμονία','οὐσία','Σ','?'];
  var GLYPH_THINK=['∞','?','…','∴','ὄν','Δ'];
  // a: starting angle on the path, c: robe colour, p: partner index, staff, beard colour
  var F=[
    {a:0.00,c:0,p:1,staff:1,hair:'#D8D4C8'},
    {a:0.36,c:1,p:0,hair:'#5B4A3A'},
    {a:1.30,c:2,p:3,hair:'#D8D4C8'},
    {a:1.66,c:3,p:2,staff:1,hair:'#7A6048'},
    {a:2.55,c:4,p:-1,hair:'#4A3C30'},
    {a:3.55,c:5,p:6,staff:1,hair:'#D8D4C8'},
    {a:3.92,c:6,p:5,hair:'#6B5440'},
    {a:5.10,c:7,p:-1,hair:'#CFCBBE'}
  ];
  var dpr=1,k=1,running=false,raf=0,t0=0,still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fit(){
    var r=cv.getBoundingClientRect(); dpr=Math.min(window.devicePixelRatio||1,2);
    cv.width=Math.round(r.width*dpr); cv.height=Math.round(r.width*dpr*H/W); k=cv.width/W;
  }
  function pos(f,t){
    var th=f.a+OMEGA*t, s=Math.sin(th);
    return {x:CX+RX*Math.cos(th), y:CY+RY*s, s:0.72+0.5*((s+1)/2), face:-Math.tanh(s*5)};
  }
  function shade(hex,amt){
    var n=parseInt(hex.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255;
    function m(v){return Math.max(0,Math.min(255,Math.round(v*(1+amt))))}
    return 'rgb('+m(r)+','+m(g)+','+m(b)+')';
  }
  function limb(x0,y0,a,len){return {x:x0+len*Math.sin(a), y:y0+len*Math.cos(a)}}
  function stroke(p,q,w,col){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}

  function state(i,t){
    var f=F[i],slot=Math.floor(t/SLOT),frac=(t/SLOT)-slot;
    if(f.p>=0){
      var lead=Math.min(i,f.p), speaker=(slot%2===0)?lead:Math.max(i,f.p);
      if(i===speaker) return {m:'say',frac:frac,slot:slot};
      return {m:((slot+lead)%3===0)?'think':'listen',frac:frac,slot:slot};
    }
    return {m:((slot+i)%2===0)?'think':'walk',frac:frac,slot:slot};
  }

  function figure(i,t,P,S,look){
    var f=F[i],sg=P.face>=0?1:-1,wx=0.45+0.55*Math.abs(P.face);
    var ph=STEP*t+i*1.7, bob=-Math.abs(Math.sin(ph))*1.7, sw=Math.sin(ph);
    var col=ROBE[f.c], dark=shade(col,-0.35), mid=shade(col,-0.12), lite=shade(col,0.22);
    ctx.save(); ctx.translate(P.x,P.y); ctx.scale(sg*wx*P.s,P.s);

    // shadow
    ctx.fillStyle='rgba(0,0,0,.38)'; ctx.beginPath(); ctx.ellipse(0,0,15,4.2,0,0,6.3); ctx.fill();

    // staff held by the far hand
    var fa=0.35, fe=limb(0,-44,fa,10), fh=limb(fe.x,fe.y,0.75,11);
    if(f.staff){
      stroke({x:fh.x+1.5,y:-66},{x:fh.x+2.5+sw*3,y:-1},2.2,'#8C6B45');
    }
    // far arm
    if(f.staff){ stroke({x:-1,y:-44+bob},fe,4,dark); stroke(fe,fh,4,dark); }
    else{
      var sa=-sw*0.55, e2=limb(-1,-44+bob,sa,9), h2=limb(e2.x,e2.y,sa*0.7+0.1,9);
      stroke({x:-1,y:-44+bob},e2,4,dark); stroke(e2,h2,4,dark);
      ctx.fillStyle=shade(SKIN,-0.18); ctx.beginPath(); ctx.arc(h2.x,h2.y,2.2,0,6.3); ctx.fill();
    }

    // feet
    ctx.fillStyle='#4A3A2C';
    var f1=sw*6.5, f2=-sw*6.5, l1=Math.max(0,Math.cos(ph))*2.4, l2=Math.max(0,-Math.cos(ph))*2.4;
    ctx.beginPath(); ctx.ellipse(f1+1.5,-1-l1,4.2,1.9,0,0,6.3); ctx.fill();
    ctx.beginPath(); ctx.ellipse(f2+1.5,-1-l2,4.2,1.9,0,0,6.3); ctx.fill();

    // robe
    ctx.fillStyle=mid; ctx.beginPath();
    ctx.moveTo(-7,-46+bob); ctx.quadraticCurveTo(0,-50+bob,8,-46+bob);
    ctx.lineTo(12+sw*1.5,-8); ctx.quadraticCurveTo(2,-5,-12+sw*1.5,-8); ctx.closePath(); ctx.fill();
    // himation across the chest
    ctx.fillStyle='rgba(255,255,255,.2)'; ctx.beginPath();
    ctx.moveTo(-7,-46+bob); ctx.lineTo(1,-47+bob); ctx.lineTo(11,-22); ctx.lineTo(3,-10); ctx.closePath(); ctx.fill();
    ctx.strokeStyle=dark; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(1,-47+bob); ctx.lineTo(11,-22); ctx.stroke();

    // near arm
    var s0={x:3,y:-44+bob}, e,h;
    if(S.m==='say'){
      var e1=limb(s0.x,s0.y,1.15,10); h=limb(e1.x,e1.y,2.2+0.55*Math.sin(t*6.5+i),11); e=e1;
    }else if(S.m==='think'){
      e=limb(s0.x,s0.y,0.65,10); h=limb(e.x,e.y,3.15,11);
    }else{
      var a=sw*0.55; e=limb(s0.x,s0.y,a,9); h=limb(e.x,e.y,a*0.7+0.1,9);
    }
    stroke(s0,e,4.4,lite); stroke(e,h,4.2,lite);
    ctx.fillStyle=SKIN; ctx.beginPath(); ctx.arc(h.x,h.y,2.4,0,6.3); ctx.fill();

    // head
    var hx=1.5, hy=-56+bob, lk=look;
    ctx.fillStyle=f.hair; ctx.beginPath(); ctx.arc(hx-1.2*lk,hy-0.5,7.6,0,6.3); ctx.fill();
    ctx.fillStyle=SKIN; ctx.beginPath(); ctx.arc(hx+0.8*lk,hy+0.6,6.4,0,6.3); ctx.fill();
    // beard on the face side
    ctx.fillStyle=f.hair; ctx.beginPath();
    ctx.moveTo(hx+0.8*lk-5.5,hy+2); ctx.quadraticCurveTo(hx+0.8*lk,hy+13,hx+0.8*lk+5.5,hy+2);
    ctx.quadraticCurveTo(hx+0.8*lk,hy+5,hx+0.8*lk-5.5,hy+2); ctx.fill();
    // nose + eye follow the look direction
    ctx.fillStyle=SKIN; ctx.beginPath(); ctx.moveTo(hx+0.8*lk+5.4*lk,hy+0.6); ctx.lineTo(hx+0.8*lk+7.6*lk,hy+2.8); ctx.lineTo(hx+0.8*lk+4.8*lk,hy+3.4); ctx.fill();
    ctx.fillStyle='#2A2118'; ctx.beginPath(); ctx.arc(hx+0.8*lk+3*lk,hy-0.4,0.95,0,6.3); ctx.fill();
    ctx.restore();
  }

  function bubble(x,y,w,s,kind,txt,al){
    var bw=Math.max(26,w+14),bh=22,bx=Math.max(bw/2+3,Math.min(W-bw/2-3,x)),by=y;
    ctx.save(); ctx.globalAlpha=al;
    ctx.fillStyle=kind==='say'?'rgba(244,241,232,.95)':'rgba(143,199,255,.16)';
    ctx.strokeStyle=kind==='say'?'rgba(244,241,232,.95)':'rgba(143,199,255,.7)'; ctx.lineWidth=1.2;
    var rx=bx-bw/2, ry=by-bh;
    ctx.beginPath();
    if(kind==='say'){
      ctx.moveTo(rx+9,ry); ctx.arcTo(rx+bw,ry,rx+bw,ry+bh,9); ctx.arcTo(rx+bw,ry+bh,rx,ry+bh,9);
      ctx.lineTo(x+4,ry+bh); ctx.lineTo(x,ry+bh+6); ctx.lineTo(x-3,ry+bh);
      ctx.arcTo(rx,ry+bh,rx,ry,9); ctx.arcTo(rx,ry,rx+bw,ry,9); ctx.closePath(); ctx.fill();
    }else{
      ctx.ellipse(bx,ry+bh/2,bw/2,bh/2,0,0,6.3); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(x,by+5,2.6,0,6.3); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(x-1,by+11,1.5,0,6.3); ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle=kind==='say'?'#12161e':'#DCEBFA'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(txt,bx,ry+bh/2+0.5);
    ctx.restore();
  }

  function scene(t){
    ctx.setTransform(k,0,0,k,0,0); ctx.clearRect(0,0,W,H);
    // dusk sky glow
    ctx.fillStyle='rgba(232,199,122,.05)'; ctx.fillRect(0,0,W,158);
    // colonnade (the peripatos)
    ctx.fillStyle='rgba(169,176,189,.13)'; ctx.fillRect(26,56,508,12);
    ctx.fillStyle='rgba(169,176,189,.2)'; ctx.fillRect(20,50,520,7);
    for(var c=0;c<8;c++){
      var cx=58+c*63;
      ctx.fillStyle='rgba(169,176,189,.17)'; ctx.fillRect(cx-7,68,14,86);
      ctx.fillStyle='rgba(169,176,189,.26)'; ctx.fillRect(cx-10,64,20,5); ctx.fillRect(cx-10,152,20,5);
      ctx.fillStyle='rgba(11,13,17,.28)'; ctx.fillRect(cx+2,68,5,86);
    }
    // ground and the path they pace
    ctx.fillStyle='rgba(39,39,39,.55)'; ctx.fillRect(0,158,W,H-158);
    ctx.strokeStyle='rgba(143,199,255,.22)'; ctx.lineWidth=1.5; ctx.setLineDash([5,7]);
    ctx.beginPath(); ctx.ellipse(CX,CY,RX,RY,0,0,6.3); ctx.stroke(); ctx.setLineDash([]);

    ctx.font='600 14px Geist,ui-sans-serif,system-ui,sans-serif';
    var list=[];
    for(var i=0;i<F.length;i++){
      var P=pos(F[i],t), S=state(i,t), look=1;
      var p=F[i].p;
      if(p>=0&&(S.m==='say'||S.m==='listen'||S.m==='think')){
        var Q=pos(F[p],t), d=(Q.x-P.x)*(P.face>=0?1:-1);
        look=Math.max(-1,Math.min(1,d/16));
      }
      list.push({i:i,P:P,S:S,look:look});
    }
    list.sort(function(a,b){return a.P.y-b.P.y});
    list.forEach(function(o){figure(o.i,t,o.P,o.S,o.look)});
    // speech / thought on top
    list.forEach(function(o){
      if(o.S.m!=='say'&&!(o.S.m==='think'&&o.S.frac>0.12&&o.S.frac<0.9)) return;
      var env=Math.sin(Math.PI*Math.min(1,o.S.frac*1.05)); env=Math.pow(Math.max(0,env),0.45);
      var kind=o.S.m==='say'?'say':'think', pool=kind==='say'?GLYPH_SAY:GLYPH_THINK;
      var txt=pool[(o.S.slot*3+o.i)%pool.length], w=ctx.measureText(txt).width;
      bubble(o.P.x,o.P.y-70*o.P.s-6-o.S.frac*5,w,o.P.s,kind,txt,env);
    });
  }

  function loop(ts){
    if(!t0) t0=ts;
    scene((ts-t0)/1000+2);
    raf=requestAnimationFrame(loop);
  }
  function start(){ if(running||still) return; running=true; t0=0; raf=requestAnimationFrame(loop); }
  function stop(){ running=false; cancelAnimationFrame(raf); }

  fit(); scene(7);
  window.addEventListener('resize',function(){fit(); if(!running) scene(7);});
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ es[0].isIntersecting?start():stop(); },{threshold:0.05}).observe(cv);
  }else start();
})();

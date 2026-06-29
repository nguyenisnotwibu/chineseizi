/* =========================================================
   CHINESEIZI · handwriting.js
   Nhập chữ Hán bằng VIẾT TAY (chuột/cảm ứng) — nhận diện qua
   Google Input Tools (handwriting). Chèn chữ vào ô input.
   ========================================================= */
(function(){
"use strict";
var CZ=window.CZ; if(!CZ) return;
var pad=null, ctx=null, cv=null, strokes=[], cur=null, t0=0, targetId=null, recTimer=null, drawing=false;

function ensurePad(){
  if(pad) return;
  pad=document.createElement('div'); pad.id='hwPad'; pad.className='hw-overlay hide';
  pad.innerHTML=
   '<div class="hw-box">'+
     '<div class="hw-head"><b>✍️ Viết tay chữ Hán</b><button class="hw-x" title="Đóng" onclick="CZ.hwClose()">✕</button></div>'+
     '<canvas id="hwCanvas" width="300" height="300" class="hw-canvas"></canvas>'+
     '<div class="hw-cands" id="hwCands"><span class="hw-hint">Viết một chữ vào ô trên rồi chọn kết quả…</span></div>'+
     '<div class="hw-actions">'+
       '<button class="btn btn-ghost" onclick="CZ.hwUndo()">↩ Xóa nét cuối</button>'+
       '<button class="btn btn-ghost" onclick="CZ.hwClear()">🗑 Xóa hết</button>'+
       '<button class="btn btn-primary" onclick="CZ.hwClose()">Xong</button>'+
     '</div>'+
   '</div>';
  document.body.appendChild(pad);
  cv=pad.querySelector('#hwCanvas'); ctx=cv.getContext('2d');
  ctx.lineWidth=9; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.strokeStyle='#7c5cce';
  function pos(e){
    var r=cv.getBoundingClientRect();
    var px=(e.touches&&e.touches[0]?e.touches[0].clientX:e.clientX)-r.left;
    var py=(e.touches&&e.touches[0]?e.touches[0].clientY:e.clientY)-r.top;
    return [px*(cv.width/r.width), py*(cv.height/r.height)];
  }
  function down(e){ e.preventDefault(); drawing=true; if(!strokes.length&&!cur)t0=Date.now(); var p=pos(e); cur=[[p[0]],[p[1]],[Date.now()-t0]]; ctx.beginPath(); ctx.moveTo(p[0],p[1]); }
  function move(e){ if(!drawing||!cur)return; e.preventDefault(); var p=pos(e); cur[0].push(p[0]); cur[1].push(p[1]); cur[2].push(Date.now()-t0); ctx.lineTo(p[0],p[1]); ctx.stroke(); }
  function up(){ if(!cur)return; drawing=false; strokes.push(cur); cur=null; scheduleRec(); }
  cv.addEventListener('mousedown',down); cv.addEventListener('mousemove',move); window.addEventListener('mouseup',up);
  cv.addEventListener('touchstart',down,{passive:false}); cv.addEventListener('touchmove',move,{passive:false}); cv.addEventListener('touchend',up);
}
function redraw(){ ctx.clearRect(0,0,cv.width,cv.height); strokes.forEach(function(s){ ctx.beginPath(); ctx.moveTo(s[0][0],s[1][0]); for(var i=1;i<s[0].length;i++) ctx.lineTo(s[0][i],s[1][i]); ctx.stroke(); }); }
function scheduleRec(){ clearTimeout(recTimer); recTimer=setTimeout(recognize,350); }
function setCands(arr){
  var box=pad.querySelector('#hwCands');
  if(!arr||!arr.length){ box.innerHTML='<span class="hw-hint">Chưa nhận ra — viết rõ/nắn nét hơn nhé.</span>'; return; }
  box.innerHTML=arr.map(function(c){ return '<button class="hw-cand zh" onclick="CZ.hwPick(\''+c+'\')">'+c+'</button>'; }).join('');
}
function recognize(){
  if(!strokes.length){ setCands([]); return; }
  pad.querySelector('#hwCands').innerHTML='<span class="hw-hint">Đang nhận diện…</span>';
  var body={"options":"enable_pre_space","requests":[{"writing_guide":{"writing_area_width":cv.width,"writing_area_height":cv.height},"ink":strokes,"language":"zh"}]};
  fetch("https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8",
    {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})
   .then(function(r){return r.json();})
   .then(function(d){ var c=[]; try{ if(d[0]==="SUCCESS") c=d[1][0][1]; }catch(e){} setCands((c||[]).slice(0,10)); })
   .catch(function(){ pad.querySelector('#hwCands').innerHTML='<span class="hw-hint">⚠ Cần kết nối mạng để nhận diện. Thử lại nhé.</span>'; });
}

CZ.hwOpen=function(tid){ ensurePad(); targetId=tid; strokes=[]; cur=null; drawing=false; ctx.clearRect(0,0,cv.width,cv.height); setCands([]); pad.classList.remove('hide'); };
CZ.hwClose=function(){ if(pad) pad.classList.add('hide'); };
CZ.hwClear=function(){ strokes=[]; cur=null; if(ctx)redraw(); setCands([]); };
CZ.hwUndo=function(){ strokes.pop(); redraw(); strokes.length?recognize():setCands([]); };
CZ.hwPick=function(c){
  var el=targetId&&document.getElementById(targetId);
  if(el){ el.value=(el.value||'')+c; try{ el.dispatchEvent(new Event('input',{bubbles:true})); }catch(e){} el.focus(); }
  CZ.hwClear();
};

/* CSS bơm thẳng */
var css=
'.hw-overlay{position:fixed;inset:0;background:rgba(40,30,70,.45);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px}'+
'.hw-overlay.hide{display:none}'+
'.hw-box{background:#fff;border-radius:22px;padding:18px;box-shadow:0 24px 60px -18px rgba(0,0,0,.5);width:344px;max-width:94vw}'+
'.hw-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;font-size:17px;font-weight:900;color:var(--ink,#231d36)}'+
'.hw-x{border:none;background:#f3eaff;width:32px;height:32px;border-radius:10px;cursor:pointer;font-size:15px;font-weight:800}'+
'.hw-canvas{width:300px;max-width:100%;height:300px;border:2px dashed #c9b8f0;border-radius:16px;touch-action:none;cursor:crosshair;display:block;margin:0 auto;'+
'background:linear-gradient(#efe7fb,#efe7fb) center/100% 1px no-repeat,linear-gradient(#efe7fb,#efe7fb) center/1px 100% no-repeat,#fff}'+
'.hw-cands{min-height:50px;display:flex;flex-wrap:wrap;gap:8px;margin:12px 0;justify-content:center;align-items:center}'+
'.hw-cand{font-size:24px;font-weight:800;min-width:46px;height:46px;padding:0 6px;border-radius:12px;border:1px solid #e8def8;background:#faf7ff;cursor:pointer;transition:.14s;color:var(--ink,#231d36)}'+
'.hw-cand:hover{background:linear-gradient(135deg,#7c5cce,#d4569a);color:#fff;transform:translateY(-2px)}'+
'.hw-hint{color:#8a82a0;font-size:14px;text-align:center}'+
'.hw-actions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}';
var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

})();

/* =========================================================
   CHINESEIZI · cloud.js
   Đăng nhập Google (Firebase) + đồng bộ XP/streak/hoạt động
   + trang Tiến độ kiểu Duolingo (heatmap, biểu đồ, xếp hạng thật)
   ========================================================= */
(function(){
"use strict";
var CZ=window.CZ||{};
var lsGet=CZ._lsGet||function(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v;}catch(e){return d;}};
var lsSet=CZ._lsSet||function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
var esc=CZ._esc||function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
var go=CZ.go||function(p){location.hash='#'+p;};
var toast=CZ._toast||function(m){console.log(m);};
var getXp=CZ._getXp||function(){return lsGet('cz_xp',0);};

/* ---------- Cấu hình Firebase (project maths-grade45, dùng lại) ---------- */
var FIREBASE_CONFIG={
  apiKey:"AIzaSyCoKAaeDIucAW19_79uP_PLH8OmvQAl9I8",
  authDomain:"maths-grade45.firebaseapp.com",
  databaseURL:"https://maths-grade45-default-rtdb.firebaseio.com",
  projectId:"maths-grade45",
  storageBucket:"maths-grade45.firebasestorage.app",
  messagingSenderId:"189762022645",
  appId:"1:189762022645:web:039b295943062a5fdb69bc"
};
var DB_ROOT="chineseizi/users";   // tách riêng dữ liệu Chineseizi trong project

/* ---------- Tiện ích ngày ---------- */
function pad(n){ return (n<10?'0':'')+n; }
function fmt(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
function today(){ return fmt(new Date()); }
function computeStreak(days){
  days=days||{}; var d=new Date(); var s=0;
  if(!days[fmt(d)]) d.setDate(d.getDate()-1);     // chưa học hôm nay → tính từ hôm qua
  while(days[fmt(d)]>0){ s++; d.setDate(d.getDate()-1); }
  return s;
}

/* ---------- Trạng thái ---------- */
var fb=null, auth=null, db=null, USER=null, cfgOk=false;
var pushTimer=null;

/* ---------- Ghi nhận hoạt động (gọi khi nhận XP) ---------- */
function recordXp(total, delta){
  if(!delta) return;
  var days=lsGet('cz_days',{}); var t=today();
  days[t]=(days[t]||0)+delta; lsSet('cz_days',days);
  var st=computeStreak(days); lsSet('cz_streak',{date:t,count:st});
  var el=document.getElementById('streakNum'); if(el) el.textContent=st;
  schedulePush();
}
window.CZ_onXp=recordXp;   // hook được app.js gọi trong addXp

/* ---------- Firebase ---------- */
function initFirebase(){
  if(typeof firebase==='undefined'){ return; }
  try{
    firebase.initializeApp(FIREBASE_CONFIG);
    auth=firebase.auth(); db=firebase.database(); fb=firebase; cfgOk=true;
    auth.onAuthStateChanged(onAuthChange);
    // xử lý kết quả redirect (nếu popup bị chặn)
    auth.getRedirectResult().catch(function(){});
  }catch(e){ cfgOk=false; }
  renderAuth();
}
function login(){
  if(!cfgOk){ toast('Cần kết nối mạng để đăng nhập'); return; }
  var provider=new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(function(err){
    // popup bị chặn → thử redirect
    if(err && (err.code==='auth/popup-blocked'||err.code==='auth/cancelled-popup-request')){
      auth.signInWithRedirect(provider);
    } else if(err && err.code==='auth/unauthorized-domain'){
      toast('Tên miền chưa được cấp phép trong Firebase');
    } else {
      toast('Đăng nhập lỗi: '+(err&&err.code||''));
    }
  });
}
function logout(){ if(auth) auth.signOut(); }

function onAuthChange(u){
  USER=u||null;
  renderAuth();
  if(u){ mergeOnLogin(u); }
  if(location.hash.indexOf('#progress')===0 && CZ._render) CZ._render();
}

/* Hợp nhất dữ liệu local ↔ cloud khi đăng nhập */
function mergeOnLogin(u){
  if(!cfgOk) return;
  var ref=db.ref(DB_ROOT+'/'+u.uid);
  ref.once('value').then(function(snap){
    var cloud=snap.val()||{};
    var localDays=lsGet('cz_days',{}), localXp=getXp();
    var days=Object.assign({}, cloud.days||{});
    Object.keys(localDays).forEach(function(d){ days[d]=Math.max(days[d]||0, localDays[d]); });
    var xp=Math.max(localXp, cloud.xp||0);
    var streak=computeStreak(days);
    lsSet('cz_days',days); lsSet('cz_xp',xp); lsSet('cz_streak',{date:today(),count:streak});
    var data={ name:u.displayName||'Học viên', photo:u.photoURL||'', xp:xp, streak:streak,
               days:days, updated:Date.now() };
    ref.update(data);
    var el=document.getElementById('streakNum'); if(el) el.textContent=streak;
    if(location.hash.indexOf('#progress')===0 && CZ._render) CZ._render();
  }).catch(function(){});
}
function schedulePush(){
  if(!USER||!cfgOk) return;
  clearTimeout(pushTimer);
  pushTimer=setTimeout(function(){
    var days=lsGet('cz_days',{});
    db.ref(DB_ROOT+'/'+USER.uid).update({
      name:USER.displayName||'Học viên', photo:USER.photoURL||'',
      xp:getXp(), streak:computeStreak(days), days:days, updated:Date.now()
    }).catch(function(){});
  }, 1500);
}

/* ---------- Giao diện đăng nhập ở header ---------- */
function renderAuth(){
  var slot=document.getElementById('authSlot'); if(!slot) return;
  if(USER){
    slot.innerHTML='<span class="auth-user" onclick="CZ.go(\'progress\')" title="Xem tiến độ">'+
      (USER.photoURL?'<img src="'+esc(USER.photoURL)+'" class="auth-ava" referrerpolicy="no-referrer">':'<span class="auth-ava">👤</span>')+
      '<span class="auth-name">'+esc((USER.displayName||'Bạn').split(' ').slice(-1)[0])+'</span></span>';
  } else {
    slot.innerHTML='<button class="btn-login" onclick="CZAuth.login()">'+
      '<svg width="16" height="16" viewBox="0 0 48 48" style="vertical-align:-3px"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5 17.4 35.5 12 30.1 12 23.5S17.4 11.5 24 11.5c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 5.5 29.5 3.5 24 3.5 12.9 3.5 4 12.4 4 23.5s8.9 20 20 20c11 0 19.5-8 19.5-20 0-1.3-.1-2.3-.4-3z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13.5 24 13.5c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 7.5 29.5 5.5 24 5.5 16.3 5.5 9.7 9.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-1.8 13.6-4.9l-6.3-5.2c-2 1.4-4.6 2.3-7.3 2.3-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C9.6 39.6 16.2 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.4l6.3 5.2C39.6 41.4 43.5 35 43.5 27c0-1.3-.1-2.3-.4-3z"/></svg> Đăng nhập</button>';
  }
}
window.CZAuth={ login:login, logout:logout, isReady:function(){return cfgOk;}, user:function(){return USER;} };

/* ---------- CSS bơm thẳng (khỏi sửa style.css) ---------- */
var css=
'.btn-login{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1px solid var(--line);'+
'color:var(--ink);font-weight:800;padding:8px 14px;border-radius:999px;font-size:14px;transition:.16s}'+
'.btn-login:hover{border-color:var(--violet);color:var(--violet);box-shadow:var(--shadow)}'+
'.auth-user{display:inline-flex;align-items:center;gap:8px;cursor:pointer;padding:4px 10px 4px 4px;'+
'border-radius:999px;border:1px solid var(--line);background:#fff;font-weight:800;transition:.16s}'+
'.auth-user:hover{border-color:var(--violet);box-shadow:var(--shadow)}'+
'.auth-ava{width:30px;height:30px;border-radius:50%;object-fit:cover;display:inline-grid;place-items:center;'+
'background:var(--grad);color:#fff;font-size:16px}'+
'.auth-name{font-size:14px;color:var(--violet-700)}'+
'.heat{display:flex;gap:4px;overflow-x:auto;padding:6px 0}'+
'.heat-col{display:flex;flex-direction:column;gap:4px}'+
'.heat-cell{width:15px;height:15px;border-radius:4px;background:#ece8f7}'+
'.heat-cell.l-1{background:transparent}'+
'.heat-cell.l0{background:#efeaf9}'+
'.heat-cell.l1{background:#d8b4fe}'+
'.heat-cell.l2{background:#a855f7}'+
'.heat-cell.l3{background:#7c3aed}'+
'.heat-cell.l4{background:#5b21b6}'+
'.heat-legend{display:flex;align-items:center;gap:5px;justify-content:flex-end;color:var(--muted);font-size:12px;margin-top:6px}'+
'.heat-legend i{width:13px;height:13px;border-radius:3px;display:inline-block}'+
'.bars{display:flex;align-items:flex-end;gap:10px;height:140px;padding-top:10px}'+
'.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%}'+
'.bar-fill{width:100%;max-width:42px;background:var(--grad);border-radius:8px 8px 0 0;min-height:4px;transition:.4s;margin-top:auto}'+
'.bar-lab{font-size:12px;color:var(--muted);font-weight:700}'+
'.bar-val{font-size:12px;font-weight:800;color:var(--violet)}'+
'.prog-hero{display:flex;align-items:center;gap:16px;flex-wrap:wrap}'+
'.prog-ava{width:64px;height:64px;border-radius:50%;object-fit:cover;display:grid;place-items:center;background:var(--grad);color:#fff;font-size:30px}';
var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

/* ---------- Heatmap ---------- */
function heatmap(days){
  var todayD=new Date(); var end=new Date(todayD); end.setDate(end.getDate()+(6-end.getDay()));
  var weeks=17; var start=new Date(end); start.setDate(start.getDate()-7*weeks+1);
  var d=new Date(start), html='<div class="heat">';
  for(var c=0;c<weeks;c++){
    html+='<div class="heat-col">';
    for(var r=0;r<7;r++){
      var key=fmt(d); var v=days[key]||0; var future=d>todayD;
      var lvl=future?-1:(v===0?0:v<10?1:v<30?2:v<60?3:4);
      html+='<div class="heat-cell l'+lvl+'" title="'+key+' · '+v+' XP"></div>';
      d.setDate(d.getDate()+1);
    }
    html+='</div>';
  }
  html+='</div>';
  html+='<div class="heat-legend">Ít <i class="heat-cell l0"></i><i class="heat-cell l1"></i><i class="heat-cell l2"></i><i class="heat-cell l3"></i><i class="heat-cell l4"></i> Nhiều</div>';
  return html;
}
function last7(days){
  var out=[], d=new Date(); d.setDate(d.getDate()-6);
  var names=['CN','T2','T3','T4','T5','T6','T7'];
  for(var i=0;i<7;i++){ var key=fmt(d); out.push({lab:names[d.getDay()], v:days[key]||0}); d.setDate(d.getDate()+1); }
  return out;
}

/* ---------- Trang Tiến độ ---------- */
function viewProgress(){
  var app=document.getElementById('app'); if(!app) return;
  var days=lsGet('cz_days',{}); var xp=getXp(); var streak=computeStreak(days);
  var daysStudied=Object.keys(days).filter(function(k){return days[k]>0;}).length;
  var nb=(CZ._notebook?CZ._notebook():lsGet('cz_notebook',[])).length;
  var l7=last7(days); var maxv=Math.max(1,Math.max.apply(null,l7.map(function(x){return x.v;})));

  var heroHtml = USER
    ? '<div class="prog-hero">'+
        (USER.photoURL?'<img src="'+esc(USER.photoURL)+'" class="prog-ava" referrerpolicy="no-referrer">':'<span class="prog-ava">👤</span>')+
        '<div><div style="font-size:22px;font-weight:900">'+esc(USER.displayName||'Học viên')+'</div>'+
        '<div style="color:var(--muted);font-weight:700">'+esc(USER.email||'')+'</div></div>'+
        '<button class="btn btn-ghost" style="margin-left:auto" onclick="CZAuth.logout()">Đăng xuất</button>'+
      '</div>'
    : '<div class="prog-hero"><span class="prog-ava">👤</span>'+
        '<div><div style="font-size:20px;font-weight:900">Khách</div>'+
        '<div style="color:var(--muted);font-weight:700">Đăng nhập để lưu tiến độ & lên bảng xếp hạng</div></div>'+
        '<button class="btn btn-primary" style="margin-left:auto" onclick="CZAuth.login()">Đăng nhập Google</button>'+
      '</div>';

  var barsHtml=l7.map(function(x){
    var h=Math.round(x.v/maxv*100);
    return '<div class="bar-col"><div class="bar-val">'+(x.v||'')+'</div>'+
      '<div class="bar-fill" style="height:'+h+'%"></div><div class="bar-lab">'+x.lab+'</div></div>';
  }).join('');

  app.innerHTML=
  '<div class="view">'+
    '<div class="card pad-lg" style="margin-bottom:18px">'+heroHtml+'</div>'+
    '<div class="stat-row" style="margin-bottom:18px">'+
      '<div class="stat"><div class="n">'+streak+'</div><div class="l">🔥 Streak (ngày)</div></div>'+
      '<div class="stat"><div class="n">'+xp+'</div><div class="l">⭐ Tổng XP</div></div>'+
      '<div class="stat"><div class="n">'+daysStudied+'</div><div class="l">📅 Ngày đã học</div></div>'+
      '<div class="stat"><div class="n">'+nb+'</div><div class="l">★ Từ đã lưu</div></div>'+
    '</div>'+
    '<div class="grid cols-2" style="margin-bottom:18px">'+
      '<div class="card pad-lg"><div class="section-title" style="font-size:17px">📊 XP 7 ngày qua</div>'+
        '<div class="bars">'+barsHtml+'</div></div>'+
      '<div class="card pad-lg"><div class="section-title" style="font-size:17px">🏆 Bảng xếp hạng</div>'+
        '<div id="lbBox"><div class="empty" style="padding:16px">Đang tải…</div></div></div>'+
    '</div>'+
    '<div class="card pad-lg">'+
      '<div class="section-title" style="font-size:17px">🗓️ Tần suất học (17 tuần gần đây)</div>'+
      heatmap(days)+
      '<div style="color:var(--muted);font-size:13px;margin-top:8px">Mỗi ô là một ngày — càng đậm tím nghĩa là hôm đó học được càng nhiều XP.</div>'+
    '</div>'+
  '</div>';

  loadLeaderboard();
}

/* ---------- Bảng xếp hạng thật từ cloud ---------- */
function loadLeaderboard(){
  var box=document.getElementById('lbBox'); if(!box) return;
  if(!cfgOk){ box.innerHTML=fallbackLB(); return; }
  db.ref(DB_ROOT).orderByChild('xp').limitToLast(10).once('value').then(function(snap){
    var arr=[]; snap.forEach(function(c){ var v=c.val()||{}; arr.push({name:v.name||'Học viên',photo:v.photo||'',xp:v.xp||0,streak:v.streak||0}); });
    arr.sort(function(a,b){return b.xp-a.xp;});
    if(!arr.length){ box.innerHTML='<div class="empty" style="padding:16px">Chưa có ai trên bảng xếp hạng. Hãy là người đầu tiên!</div>'; return; }
    box.innerHTML=arr.map(function(p,i){
      return '<div class="lb-row"><div class="lb-rank">'+(i+1)+'</div>'+
        (p.photo?'<img src="'+esc(p.photo)+'" class="auth-ava" referrerpolicy="no-referrer">':'')+
        '<div class="lb-name">'+esc(p.name)+'</div>'+
        '<div class="lb-xp">'+p.xp+' XP · 🔥'+p.streak+'</div></div>';
    }).join('');
  }).catch(function(){ box.innerHTML=fallbackLB(); });
}
function fallbackLB(){
  var lb=window.CZ_LEADERBOARD||[];
  return (lb.length?lb.map(function(p,i){
    return '<div class="lb-row"><div class="lb-rank">'+(i+1)+'</div><div class="lb-name">'+esc(p.name)+'</div><div class="lb-xp">'+p.xp+' XP</div></div>';
  }).join(''):'<div class="empty" style="padding:16px">Đăng nhập để xem xếp hạng online.</div>')+
  '<div style="color:var(--muted);font-size:12px;margin-top:8px">Đăng nhập để lên bảng xếp hạng thật.</div>';
}

/* ---------- Đăng ký view + khởi động ---------- */
if(CZ._setViews) CZ._setViews({ progress:viewProgress });
// cập nhật streak hiển thị theo cz_days ngay khi tải
(function(){ var st=computeStreak(lsGet('cz_days',{})); var el=document.getElementById('streakNum'); if(el&&st) el.textContent=st; })();
initFirebase();
if(location.hash.indexOf('#progress')===0 && CZ._render) CZ._render();

})();

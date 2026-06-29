/* =========================================================
   CHINESEIZI · app.js  (SPA, không cần server — chạy file://)
   ========================================================= */
(function(){
"use strict";

/* ---------------- Dữ liệu ---------------- */
var WORDS = window.CZ_WORDS || [];
// Áp dụng nghĩa tiếng Việt cho HSK4-6 từ file riêng
if(window.CZ_WORDS_VI){WORDS.forEach(function(w){if(CZ_WORDS_VI[w.s])w.mv=CZ_WORDS_VI[w.s];});}
var TOPICS = window.CZ_TOPICS || [];
var HOT = window.CZ_HOT || [];
var TIPS = window.CZ_TIPS || [];
var LB = window.CZ_LEADERBOARD || [];
var BY_S = {};
WORDS.forEach(function(w){ BY_S[w.s] = w; });

/* Từ điển lớn CC-CEDICT (nướng sẵn) + map Hán-Việt theo chữ */
var CED = window.CZ_CEDICT || {};
var HVMAP = window.CZ_HV || {};
var CED_KEYS = null;     // mảng key giản thể (lười tạo)
var PY_INDEX = null;     // index pinyin chuẩn hóa (lười tạo)
function cedKeys(){ if(!CED_KEYS) CED_KEYS=Object.keys(CED); return CED_KEYS; }
function hvOf(s){ return s.split('').map(function(c){ return HVMAP[c]||''; }).filter(Boolean).join(' '); }

/* Trả về 1 mục từ chuẩn hóa: ưu tiên bộ Việt (có nghĩa Việt + ví dụ), fallback CC-CEDICT (nghĩa Anh) */
function getEntry(s){
  if(BY_S[s]) return BY_S[s];
  var c=CED[s]; if(!c) return null;
  return { s:s, t:'', p:c[0][0], hv:hvOf(s), m:'', en:c.map(function(x){return x[1];}),
           pos:'', source:'en' };
}
function enOf(s){ var c=CED[s]; return c?c.map(function(x){return x[1];}):null; }
/* index pinyin cho CC-CEDICT (lười tạo lần đầu tìm bằng latin) */
function pyIndex(){
  if(PY_INDEX) return PY_INDEX;
  PY_INDEX=[]; var keys=cedKeys();
  for(var i=0;i<keys.length;i++){
    var s=keys[i], senses=CED[s];
    for(var j=0;j<senses.length;j++){
      PY_INDEX.push({ s:s, np:deburr(senses[j][0]).replace(/\s+/g,'') });
    }
  }
  return PY_INDEX;
}

/* ---------------- Tiện ích ---------------- */
var $ = function(s,el){ return (el||document).querySelector(s); };
var app = function(){ return document.getElementById('app'); };

function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

function deburr(s){
  return String(s||'').toLowerCase()
    .replace(/đ/g,'d')
    .normalize('NFD').replace(/[̀-ͯ]/g,'');
}
function hasHan(s){ return /[一-鿿]/.test(s); }

/* localStorage an toàn */
function lsGet(k,def){ try{ var v=localStorage.getItem(k); return v==null?def:JSON.parse(v); }catch(e){ return def; } }
function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

/* Toast */
var toastT;
function toast(msg){
  var t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(toastT); toastT=setTimeout(function(){ t.classList.remove('show'); },1900);
}

/* ---------------- Phát âm (TTS) ---------------- */
var zhVoice=null;
function pickVoice(){
  if(!('speechSynthesis' in window)) return;
  var vs=speechSynthesis.getVoices();
  zhVoice = vs.find(function(v){return /zh[-_]?CN/i.test(v.lang)||/Chinese.*China/i.test(v.name);})
         || vs.find(function(v){return /^zh/i.test(v.lang);}) || null;
}
if('speechSynthesis' in window){ pickVoice(); speechSynthesis.onvoiceschanged=pickVoice; }
function speak(text,btn){
  if(!('speechSynthesis' in window)){ toast('Trình duyệt không hỗ trợ phát âm'); return; }
  speechSynthesis.cancel();
  var u=new SpeechSynthesisUtterance(text);
  u.lang='zh-CN'; u.rate=0.85; if(zhVoice) u.voice=zhVoice;
  if(btn){ btn.classList.add('playing'); u.onend=u.onerror=function(){ btn.classList.remove('playing'); }; }
  speechSynthesis.speak(u);
}

/* ---------------- Gamification ---------------- */
function todayStr(){ var d=new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
function dayDiff(a,b){ return Math.round((new Date(b)-new Date(a))/86400000); }
function updateStreak(){
  var s=lsGet('cz_streak',{date:null,count:0});
  var t=todayStr();
  if(s.date===t){ /* đã tính hôm nay */ }
  else if(s.date && dayDiff(s.date,t)===1){ s.count++; s.date=t; }
  else { s.count=1; s.date=t; }
  lsSet('cz_streak',s);
  var el=document.getElementById('streakNum'); if(el) el.textContent=s.count;
}
function getXp(){ return lsGet('cz_xp',0); }
function addXp(n){ var x=getXp()+n; lsSet('cz_xp',x); try{ if(window.CZ_onXp) window.CZ_onXp(x,n); }catch(e){} return x; }

/* Sổ tay */
function notebook(){ return lsGet('cz_notebook',[]); }
function isSaved(s){ return notebook().indexOf(s)>=0; }
function toggleSave(s){
  var nb=notebook(), i=nb.indexOf(s);
  if(i>=0){ nb.splice(i,1); toast('Đã bỏ khỏi sổ tay'); }
  else { nb.push(s); toast('★ Đã lưu vào sổ tay'); }
  lsSet('cz_notebook',nb); return i<0;
}
/* Lịch sử tra cứu */
function pushHistory(s){
  var h=lsGet('cz_history',[]); h=h.filter(function(x){return x!==s;}); h.unshift(s);
  if(h.length>12) h=h.slice(0,12); lsSet('cz_history',h);
}

/* ---------------- Tìm kiếm ---------------- */
function search(q){
  q=(q||'').trim(); if(!q) return [];
  var seen={}, out=[];
  function push(s,rank){ if(seen[s]) return; seen[s]=1; out.push([rank,s]); }
  if(hasHan(q)){
    WORDS.forEach(function(w){
      var hay=w.s+(w.t||'');
      if(w.s===q||w.t===q) push(w.s,0);
      else if(w.s.indexOf(q)===0||((w.t||'').indexOf(q)===0)) push(w.s,1);
      else if(hay.indexOf(q)>=0) push(w.s,2);
      else if(q.length>1 && q.indexOf(w.s)>=0) push(w.s,4);
    });
    if(CED[q]) push(q,0);
    var keys=cedKeys(), i;
    for(i=0;i<keys.length && out.length<200;i++){ var k=keys[i]; if(k.length>q.length && k.indexOf(q)===0) push(k,1); }
    if(out.length<40){ for(i=0;i<keys.length && out.length<60;i++){ var k2=keys[i]; if(k2.indexOf(q)>0) push(k2,3); } }
  } else {
    var nq=deburr(q).replace(/\s+/g,''), dq=deburr(q);
    WORDS.forEach(function(w){
      var py=deburr(w.p).replace(/\s+/g,''), hv=deburr(w.hv).replace(/\s+/g,''), mn=deburr(w.mv||w.m);
      if(py===nq||hv===nq) push(w.s,0);
      else if(py.indexOf(nq)===0||hv.indexOf(nq)===0) push(w.s,1);
      else if(py.indexOf(nq)>=0||hv.indexOf(nq)>=0) push(w.s,2);
      else if(mn.indexOf(dq)>=0) push(w.s,3);
    });
    if(nq.length>=1){
      var idx=pyIndex(), j;
      for(j=0;j<idx.length && out.length<200;j++){
        var it=idx[j];
        if(it.np===nq) push(it.s,1);
        else if(it.np.indexOf(nq)===0) push(it.s,2);
      }
      if(out.length<30){ for(j=0;j<idx.length && out.length<50;j++){ if(idx[j].np.indexOf(nq)>0) push(idx[j].s,5); } }
    }
  }
  out.sort(function(a,b){ return a[0]-b[0] || ((BY_S[b[1]]?1:0)-(BY_S[a[1]]?1:0)) || a[1].length-b[1].length; });
  return out.slice(0,120).map(function(r){ return getEntry(r[1]); }).filter(Boolean);
}

/* ---------------- Mảnh HTML dùng lại ---------------- */
function hskBadge(n){ return '<span class="hsk-badge hsk-'+n+'">HSK '+n+'</span>'; }

function wItem(w){
  var saved=isSaved(w.s);
  var mean=w.mv||w.m || (w.en?w.en.join('; '):'');
  var badge=w.hsk?hskBadge(w.hsk):'<span class="hsk-badge" style="background:#94a3b8">A·V</span>';
  var hv=w.hv?' · <span class="hv">'+esc(w.hv)+'</span>':'';
  return '<div class="witem" onclick="CZ.go(\'word/'+encodeURIComponent(w.s)+'\')">'+
    '<div class="han zh">'+esc(w.s)+'</div>'+
    '<div class="body">'+
      '<div class="py">'+esc(w.p)+hv+'</div>'+
      '<div class="mn">'+esc(mean)+'</div>'+
    '</div>'+
    '<div class="meta">'+badge+
      '<button class="icon-btn '+(saved?'on':'')+'" title="Lưu sổ tay" '+
      'onclick="event.stopPropagation();CZ.toggleSaveBtn(this,\''+esc(w.s)+'\')">'+(saved?'★':'☆')+'</button>'+
    '</div>'+
  '</div>';
}

/* ================= ROUTER ================= */
var SEARCH_TAB='Từ vựng';
function go(path){ location.hash='#'+path; }
function currentRoute(){
  var h=location.hash.replace(/^#/,'')||'home';
  var parts=h.split('/');
  return { name:parts[0], arg: parts[1]?decodeURIComponent(parts.slice(1).join('/')):'' };
}
function setActiveNav(name){
  document.querySelectorAll('#nav a').forEach(function(a){
    a.classList.toggle('active', a.getAttribute('data-route')===name);
  });
}
function render(){
  var r=currentRoute();
  window.scrollTo(0,0);
  $('#nav').classList.remove('open');
  setActiveNav(r.name);
  var fn=VIEWS[r.name]||VIEWS.home;
  fn(r.arg);
}

/* ================= VIEW: HOME ================= */
function viewHome(){
  var tip=TIPS[Math.floor(Math.random()*TIPS.length)];
  var hist=lsGet('cz_history',[]);
  var xp=getXp(), streak=lsGet('cz_streak',{count:0}).count, nbCount=notebook().length;
  var dictCount=Object.keys(CED).length||WORDS.length;
  var dictLabel=dictCount>9999?(Math.floor(dictCount/1000))+'K+':String(dictCount);

  var topicsHtml=TOPICS.slice(0,12).map(function(t){
    var c=WORDS.filter(function(w){return w.topic===t.name;}).length;
    return '<div class="topic" onclick="CZ.go(\'browse/topic:'+encodeURIComponent(t.name)+'\')">'+
      '<span class="ic">'+t.icon+'</span><div><div>'+esc(t.name)+'</div>'+
      '<div class="ct">'+c+' từ</div></div></div>';
  }).join('');

  var hotHtml=HOT.map(function(k){
    return '<span class="chip" onclick="CZ.go(\'search/'+encodeURIComponent(k)+'\')"><span class="zh">'+esc(k)+'</span></span>';
  }).join('');

  var histHtml = hist.length
    ? hist.map(function(s){ var w=BY_S[s]; if(!w) return '';
        return '<span class="chip" onclick="CZ.go(\'word/'+encodeURIComponent(s)+'\')"><span class="zh">'+esc(s)+'</span></span>'; }).join('')
    : '<div class="empty" style="padding:18px"><div class="big">🦫</div>Chưa có lịch sử. Tra một từ để bắt đầu nhé!</div>';

  var lbHtml=LB.map(function(p,i){
    return '<div class="lb-row"><div class="lb-rank">'+(i+1)+'</div>'+
      '<div class="lb-name">'+esc(p.name)+'</div><div class="lb-xp">'+p.xp+' XP</div></div>';
  }).join('');

  app().innerHTML =
  '<div class="view">'+
    '<section class="hero">'+
      '<h1>Học tiếng Trung, chất Gen Z ✨</h1>'+
      '<p>Tra từ điển Trung–Việt · Hán–Việt · luyện viết chữ · flashcard · thi thử HSK</p>'+
      '<div class="suggest">'+
        '<div class="searchbox">'+
          '<span class="ico">🔍</span>'+
          '<input id="q" autocomplete="off" placeholder="Nhập chữ Hán, pinyin, Hán–Việt hoặc nghĩa tiếng Việt…">'+
          '<button class="tool" style="background:#f3eaff" title="Nhập chữ viết tay" onclick="CZ.hwOpen(\'q\')">✍️</button>'+
          '<button class="btn-search" onclick="CZ.doSearch()">Tra cứu</button>'+
        '</div>'+
        '<div id="sg"></div>'+
      '</div>'+
      '<div class="tabs">'+
        ['Từ vựng','Hán tự','Ví dụ','Ngữ pháp'].map(function(t){
          return '<span class="tab '+(t===SEARCH_TAB?'active':'')+'" onclick="CZ.setTab(this,\''+t+'\')">'+t+'</span>';
        }).join('')+
      '</div>'+
    '</section>'+

    '<div class="stat-row" style="margin-bottom:22px">'+
      '<div class="stat"><div class="n">'+streak+'</div><div class="l">🔥 Ngày streak</div></div>'+
      '<div class="stat"><div class="n">'+xp+'</div><div class="l">⭐ Điểm XP</div></div>'+
      '<div class="stat"><div class="n">'+nbCount+'</div><div class="l">★ Từ đã lưu</div></div>'+
      '<div class="stat"><div class="n">'+dictLabel+'</div><div class="l">📖 Từ trong từ điển</div></div>'+
    '</div>'+

    '<div class="home-grid">'+
      '<div>'+
        '<div class="card pad-lg" style="margin-bottom:18px">'+
          '<div class="section-title">🔥 Từ khóa hot</div>'+
          '<div class="chips">'+hotHtml+'</div>'+
        '</div>'+
        '<div class="card pad-lg">'+
          '<div class="section-title">🗂️ Từ vựng theo chủ đề <a class="more" onclick="CZ.go(\'learn\')">Xem tất cả →</a></div>'+
          '<div class="topic-grid">'+topicsHtml+'</div>'+
        '</div>'+
      '</div>'+
      '<aside class="side">'+
        '<div class="card tip-card"><div class="lab">💡 Mẹo học</div><p style="margin:8px 0 0">'+esc(tip)+'</p></div>'+
        '<div class="card"><div class="section-title">🕘 Lịch sử</div><div class="chips">'+histHtml+'</div></div>'+
        '<div class="card"><div class="section-title">🏆 Bảng xếp hạng</div>'+lbHtml+'</div>'+
        '<div class="card" style="background:var(--grad);color:#fff">'+
          '<div style="font-weight:900;font-size:18px">Bắt đầu học ngay</div>'+
          '<p style="opacity:.92;margin:6px 0 12px">Flashcard, quiz và thi thử đang chờ bạn!</p>'+
          '<button class="btn" style="background:#fff;color:var(--violet-700)" onclick="CZ.go(\'learn\')">Vào khu vực Học →</button>'+
        '</div>'+
      '</aside>'+
    '</div>'+
  '</div>';

  var q=$('#q');
  q.addEventListener('input',function(){ liveSuggest(q.value); });
  q.addEventListener('keydown',function(e){
    if(e.key==='Enter') doSearch();
  });
  q.focus();
}

/* gợi ý trực tiếp */
function liveSuggest(v){
  var box=$('#sg'); if(!box) return;
  v=(v||'').trim();
  if(!v){ box.innerHTML=''; return; }
  var res=search(v).slice(0,7);
  if(!res.length){ box.innerHTML='<div class="suggest-list"><div class="suggest-item">Không tìm thấy — thử pinyin hoặc nghĩa tiếng Việt</div></div>'; return; }
  box.innerHTML='<div class="suggest-list">'+res.map(function(w){
    return '<div class="suggest-item" onclick="CZ.go(\'word/'+encodeURIComponent(w.s)+'\')">'+
      '<span class="s zh">'+esc(w.s)+'</span><span class="p">'+esc(w.p)+'</span>'+
      '<span class="m">'+esc(w.mv||w.m)+'</span></div>';
  }).join('')+'</div>';
}
function doSearch(){ var q=$('#q'); if(q&&q.value.trim()) go('search/'+encodeURIComponent(q.value.trim())); }
function setTab(el,t){ SEARCH_TAB=t; document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('active');}); el.classList.add('active'); }

/* ================= VIEW: SEARCH RESULTS ================= */
function viewSearch(q){
  var res=search(q);
  var html='<div class="view">'+
    '<div class="section-title">🔍 Kết quả cho “'+esc(q)+'” <span style="color:var(--muted);font-weight:700;font-size:15px">('+res.length+' từ)</span></div>'+
    '<div class="searchbox" style="max-width:640px;margin-bottom:18px;box-shadow:var(--shadow)">'+
      '<span class="ico">🔍</span><input id="q2" value="'+esc(q)+'" placeholder="Tra từ khác…">'+
      '<button class="tool" style="background:#f3eaff" title="Nhập chữ viết tay" onclick="CZ.hwOpen(\'q2\')">✍️</button>'+
      '<button class="btn-search" onclick="CZ.doSearch2()">Tra</button></div>';
  if(res.length){ html+='<div class="wlist">'+res.map(wItem).join('')+'</div>'; }
  else { html+='<div class="empty"><div class="big">🐼</div>Không tìm thấy từ nào.<br>Thử nhập chữ Hán, pinyin (vd: <b>nihao</b>), Hán–Việt (vd: <b>hoc sinh</b>) hoặc nghĩa tiếng Việt.</div>'; }
  html+='</div>';
  app().innerHTML=html;
  var q2=$('#q2');
  q2.addEventListener('keydown',function(e){ if(e.key==='Enter') doSearch2(); });
}
function doSearch2(){ var q=$('#q2'); if(q&&q.value.trim()) go('search/'+encodeURIComponent(q.value.trim())); }

/* các view khác được gắn ở phần 2 */
var VIEWS={ home:viewHome, search:viewSearch };

/* ================= API toàn cục ================= */
window.CZ={
  go:go, doSearch:doSearch, doSearch2:doSearch2, setTab:setTab, speak:speak,
  toggleSaveBtn:function(btn,s){ var on=toggleSave(s); btn.classList.toggle('on',on); btn.textContent=on?'★':'☆'; },
  _words:WORDS, _byS:BY_S, _topics:TOPICS, _search:search, _esc:esc, _wItem:wItem,
  _getEntry:getEntry, _enOf:enOf, _hvOf:hvOf, _ced:CED,
  _hsk:hskBadge, _speak:speak, _addXp:addXp, _getXp:getXp, _notebook:notebook,
  _isSaved:isSaved, _toggleSave:toggleSave, _toast:toast, _pushHistory:pushHistory, _lsGet:lsGet, _lsSet:lsSet,
  _setViews:function(v){ for(var k in v) VIEWS[k]=v[k]; }, _render:render
};

/* ================= KHỞI ĐỘNG ================= */
window.addEventListener('hashchange',render);
document.getElementById('menuBtn').addEventListener('click',function(){ $('#nav').classList.toggle('open'); });
updateStreak();
render();

})();

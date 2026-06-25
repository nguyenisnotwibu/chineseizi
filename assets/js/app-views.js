/* =========================================================
   CHINESEIZI · app-views.js
   Các view: chi tiết từ · Học · Duyệt · Flashcard · Quiz · Thi thử · Sổ tay · Dịch
   (dùng API window.CZ do app.js cung cấp)
   ========================================================= */
(function(){
"use strict";
var CZ=window.CZ;
var WORDS=CZ._words, BY_S=CZ._byS, TOPICS=CZ._topics, TIPS=window.CZ_TIPS||[];
var esc=CZ._esc, wItem=CZ._wItem, hskBadge=CZ._hsk, speak=CZ._speak, go=CZ.go, search=CZ._search;
var getEntry=CZ._getEntry, enOf=CZ._enOf, hvOf=CZ._hvOf;
var addXp=CZ._addXp, getXp=CZ._getXp, notebook=CZ._notebook, isSaved=CZ._isSaved,
    toggleSave=CZ._toggleSave, toast=CZ._toast, pushHistory=CZ._pushHistory, lsGet=CZ._lsGet, lsSet=CZ._lsSet;
function app(){ return document.getElementById('app'); }
function rand(n){ return Math.floor(Math.random()*n); }
function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=rand(i+1); var t=a[i];a[i]=a[j];a[j]=t; } return a; }
function poolBy(sel){ // sel: 'all' | 'hsk:N' | 'topic:X' | 'notebook'
  if(sel==='notebook'){ var nb=notebook(); return WORDS.filter(function(w){return nb.indexOf(w.s)>=0;}); }
  if(sel&&sel.indexOf('hsk:')===0){ var n=+sel.slice(4); return WORDS.filter(function(w){return w.hsk===n;}); }
  if(sel&&sel.indexOf('topic:')===0){ var t=sel.slice(6); return WORDS.filter(function(w){return w.topic===t;}); }
  return WORDS.slice();
}

/* ============================================================
   VIEW: CHI TIẾT TỪ  (#word/<s>)
   ============================================================ */
var writer=null, writerChars=[], writerIdx=0;
function viewWord(s){
  var w=getEntry(s);
  if(!w){
    var rs=search(s);
    app().innerHTML='<div class="view"><div class="section-title">Không có mục từ “'+esc(s)+'”</div>'+
      (rs.length?'<div class="wlist">'+rs.map(wItem).join('')+'</div>'
       :'<div class="empty"><div class="big">🐼</div>Chưa có trong từ điển.</div>')+'</div>';
    return;
  }
  pushHistory(s);
  writerChars=w.s.split('').filter(function(c){return /[一-鿿]/.test(c);});
  writerIdx=0;
  var saved=isSaved(s);
  var hv=w.hv||hvOf(s);
  var en=w.en||enOf(s);
  var isVi=!!w.m;

  var defs='<div class="def-block">';
  if(isVi){
    defs+='<div class="def-item"><span class="def-num">1</span><span class="def-mean">'+esc(w.m)+'</span>'+
      (w.pos?'<span class="pos-tag">'+esc(w.pos)+'</span>':'');
    if(w.ex&&w.ex.length){
      defs+=w.ex.map(function(e){
        return '<div class="ex"><span class="ex-speak" title="Nghe câu" onclick="CZ.say(\''+esc(e.s)+'\',this)">🔊</span>'+
          '<div class="exs zh" onclick="CZ.say(\''+esc(e.s)+'\',this)">'+esc(e.s)+'</div>'+
          '<div class="exp">'+esc(e.p)+'</div><div class="exv">'+esc(e.v)+'</div></div>';
      }).join('');
    }
    defs+='</div>';
    if(en&&en.length) defs+='<div class="def-item"><span class="pos-tag" style="color:#475569;background:#f1f5f9">EN</span> '+en.map(esc).join('<br>')+'</div>';
  } else if(en&&en.length){
    defs+=en.map(function(e,i){ return '<div class="def-item"><span class="def-num">'+(i+1)+'</span><span class="def-mean" style="font-weight:700">'+esc(e)+'</span></div>'; }).join('');
    defs+='<div style="margin-top:10px;color:var(--muted);font-size:13px">ℹ️ Mục mở rộng (CC-CEDICT) — nghĩa tiếng Anh. Từ trong bộ HSK có nghĩa tiếng Việt + ví dụ.</div>';
  } else {
    defs+='<div class="def-item">Chưa có nghĩa.</div>';
  }
  defs+='</div>';

  var charTabs = writerChars.length>1
    ? '<div class="char-tabs">'+writerChars.map(function(c,i){
        return '<button class="char-tab zh '+(i===0?'active':'')+'" onclick="CZ.writerSetChar('+i+',this)">'+esc(c)+'</button>';
      }).join('')+'</div>'
    : '';
  var badge = w.hsk?hskBadge(w.hsk):'<span class="hsk-badge" style="background:#94a3b8">Mở rộng</span>';
  var topicChip = w.topic?' <span class="chip" style="cursor:pointer" onclick="CZ.go(\'browse/topic:'+encodeURIComponent(w.topic)+'\')">#'+esc(w.topic)+'</span>':'';
  var learnBtn = w.topic?'<button class="tool" onclick="CZ.go(\'flashcard/topic:'+encodeURIComponent(w.topic)+'\')">🎴 Học chủ đề này</button>':'';

  app().innerHTML=
  '<div class="view"><div class="detail">'+
    '<div>'+
      '<div class="card pad-lg">'+
        '<div class="dt-head">'+
          '<div class="dt-han zh">'+esc(w.s)+'</div>'+
          '<div class="dt-info">'+
            '<div class="dt-py">'+esc(w.p)+'</div>'+
            (hv?'<span class="dt-hv">⎈ '+esc(hv)+'</span>':'')+
            (w.t?'<div style="color:var(--muted);margin-top:4px">Phồn thể: <b class="zh">'+esc(w.t)+'</b></div>':'')+
            '<div style="margin-top:8px">'+badge+topicChip+'</div>'+
          '</div>'+
        '</div>'+
        '<div class="dt-tools">'+
          '<button class="tool speak" onclick="CZ.say(\''+esc(w.s)+'\',this)">🔊 Phát âm</button>'+
          '<button class="tool" onclick="CZ.sayslow(\''+esc(w.s)+'\',this)">🐢 Chậm</button>'+
          '<button class="tool" id="saveBtn" onclick="CZ.toggleSaveDetail(\''+esc(w.s)+'\')">'+(saved?'★ Đã lưu':'☆ Lưu sổ tay')+'</button>'+
          learnBtn+
        '</div>'+
        '<div class="section-title" style="font-size:16px">📖 Nghĩa</div>'+
        defs+
        '<div class="cz-img-wrap" id="wordImg"></div>'+
      '</div>'+
    '</div>'+

    '<aside class="card writer-card">'+
      '<div class="section-title" style="font-size:16px">✍️ Tập viết</div>'+
      charTabs+
      '<div class="writer-box">'+
        '<div id="writer-target"></div>'+
        '<div id="writer-hint" style="font-size:12px;color:var(--muted);min-height:16px"></div>'+
        '<div class="writer-controls">'+
          '<button class="btn btn-ghost" onclick="CZ.writerAnimate()">▶ Viết mẫu</button>'+
          '<button class="btn btn-ghost" onclick="CZ.writerQuiz()">✏️ Luyện viết</button>'+
          '<button class="btn btn-ghost" onclick="CZ.writerReset()">↺ Lại</button>'+
        '</div>'+
      '</div>'+
      '<div style="margin-top:14px">'+
        '<div class="info-row"><b>Pinyin</b><span>'+esc(w.p)+'</span></div>'+
        '<div class="info-row"><b>Hán–Việt</b><span style="color:var(--magenta);font-weight:800">'+esc(hv||'—')+'</span></div>'+
        '<div class="info-row"><b>Loại từ</b><span>'+esc(w.pos||'—')+'</span></div>'+
        '<div class="info-row"><b>Số chữ</b><span>'+writerChars.length+'</span></div>'+
      '</div>'+
    '</aside>'+
  '</div></div>';

  initWriter(writerChars[0]);
  if(CZ.wordImage) CZ.wordImage(document.getElementById('wordImg'), w.s, w);
}
function initWriter(ch){
  if(!ch||typeof HanziWriter==='undefined') return;
  var el=document.getElementById('writer-target'); if(!el) return; el.innerHTML='';
  var hint=document.getElementById('writer-hint'); if(hint) hint.textContent='';
  try{
    writer=HanziWriter.create('writer-target',ch,{
      width:230,height:230,padding:14,showOutline:true,
      strokeColor:'#7c3aed',radicalColor:'#ec4899',outlineColor:'#e7defb',
      drawingColor:'#d946ef',strokeAnimationSpeed:1.1,delayBetweenStrokes:130,
      onLoadCharDataError:function(){ if(hint) hint.textContent='⚠ Cần mạng để tải nét chữ này.'; }
    });
    writer.animateCharacter();
  }catch(e){ if(hint) hint.textContent='Không khởi tạo được phần viết chữ.'; }
}

/* ============================================================
   VIEW: HỌC (hub)  (#learn)
   ============================================================ */
function viewLearn(){
  var topicChips=TOPICS.map(function(t){
    var c=WORDS.filter(function(w){return w.topic===t.name;}).length;
    return '<span class="chip" onclick="CZ.go(\'browse/topic:'+encodeURIComponent(t.name)+'\')">'+t.icon+' '+esc(t.name)+' <b style="opacity:.6">'+c+'</b></span>';
  }).join('');
  app().innerHTML=
  '<div class="view">'+
    '<div class="section-title">🎓 Khu vực học tập</div>'+
    '<div class="hub-grid">'+
      hub('hc-flash','🎴','Flashcard','Lật thẻ, ghi nhớ nhanh','flashcard')+
      hub('hc-quiz','🧠','Quiz trắc nghiệm','Kiểm tra nghĩa & pinyin','quiz')+
      hub('hc-browse','📚','Duyệt từ vựng','Theo cấp HSK & chủ đề','browse/hsk:1')+
      hub('hc-test','📝','Thi thử HSK','Đề chấm điểm có hẹn giờ','test')+
      hub('hc-note','★','Sổ tay của tôi','Ôn lại từ đã lưu','notebook')+
      hub('hc-translate','🌐','Dịch nhanh','Trung ↔ Việt, tách từ','translate')+
    '</div>'+
    '<div class="card pad-lg" style="margin-top:22px">'+
      '<div class="section-title" style="font-size:17px">📈 Học theo cấp độ</div>'+
      '<div class="seg" style="margin-bottom:8px">'+
        seg('hsk:1','HSK 1')+seg('hsk:2','HSK 2')+seg('hsk:3','HSK 3')+seg('hsk:4','HSK 4')+seg('hsk:5','HSK 5')+seg('hsk:6','HSK 6')+seg('all','Tất cả')+
      '</div>'+
      '<div class="section-title" style="font-size:17px;margin-top:18px">🗂️ Học theo chủ đề</div>'+
      '<div class="chips">'+topicChips+'</div>'+
    '</div>'+
  '</div>';
}
function hub(cls,ic,title,desc,route){
  return '<div class="hub-card '+cls+'" onclick="CZ.go(\''+route+'\')">'+
    '<span class="hi">'+ic+'</span><h3>'+title+'</h3><p>'+desc+'</p></div>';
}
function seg(sel,label){ return '<button onclick="CZ.go(\'browse/'+sel+'\')">'+label+'</button>'; }

/* ============================================================
   VIEW: DUYỆT TỪ VỰNG  (#browse/<sel>)
   ============================================================ */
var browseSel='hsk:1';
function viewBrowse(arg){
  browseSel = arg || 'hsk:1';
  renderBrowse();
}
function renderBrowse(){
  var list=poolBy(browseSel);
  var levels=[['hsk:1','HSK 1'],['hsk:2','HSK 2'],['hsk:3','HSK 3'],['hsk:4','HSK 4'],['hsk:5','HSK 5'],['hsk:6','HSK 6'],['all','Tất cả'],['notebook','★ Sổ tay']];
  var segHtml=levels.map(function(l){
    return '<button class="'+(browseSel===l[0]?'active':'')+'" onclick="CZ.browseSet(\''+l[0]+'\')">'+l[1]+'</button>';
  }).join('');
  var title = browseSel.indexOf('topic:')===0 ? '🗂️ Chủ đề: '+esc(browseSel.slice(6))
            : browseSel==='notebook' ? '★ Sổ tay của tôi'
            : browseSel==='all' ? '📚 Toàn bộ từ vựng' : '📚 '+browseSel.replace('hsk:','HSK ');
  var body = list.length
    ? '<div class="wlist">'+list.map(wItem).join('')+'</div>'
    : '<div class="empty"><div class="big">📭</div>Chưa có từ nào ở đây.</div>';
  app().innerHTML=
  '<div class="view">'+
    '<div class="section-title">'+title+' <span style="color:var(--muted);font-weight:700;font-size:15px">('+list.length+' từ)</span></div>'+
    '<div class="seg" style="margin-bottom:16px">'+segHtml+'</div>'+
    '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px">'+
      '<button class="btn btn-primary" onclick="CZ.go(\'flashcard/'+browseSel+'\')">🎴 Flashcard bộ này</button>'+
      '<button class="btn btn-ghost" onclick="CZ.go(\'quiz/'+browseSel+'\')">🧠 Quiz bộ này</button>'+
    '</div>'+
    body+
  '</div>';
}

/* đăng ký phần 1 */
CZ._setViews({ word:viewWord, learn:viewLearn, browse:viewBrowse });

/* handlers phần 1 */
CZ.say=function(t,el){ speak(t,el); };
CZ.sayslow=function(t,el){ // phát âm chậm: dùng lại speak với rate thấp
  if(!('speechSynthesis' in window)) return; speechSynthesis.cancel();
  var u=new SpeechSynthesisUtterance(t); u.lang='zh-CN'; u.rate=0.55; speechSynthesis.speak(u);
};
CZ.toggleSaveDetail=function(s){ var on=toggleSave(s); var b=document.getElementById('saveBtn'); if(b) b.innerHTML=on?'★ Đã lưu':'☆ Lưu sổ tay'; };
CZ.writerAnimate=function(){ if(writer) writer.animateCharacter(); };
CZ.writerQuiz=function(){ if(writer){ var h=document.getElementById('writer-hint'); if(h)h.textContent='Dùng chuột/ngón tay viết theo nét nhé!'; writer.quiz(); } };
CZ.writerReset=function(){ initWriter(writerChars[writerIdx]); };
CZ.writerSetChar=function(i,el){ writerIdx=i; document.querySelectorAll('.char-tab').forEach(function(x){x.classList.remove('active');}); if(el)el.classList.add('active'); initWriter(writerChars[i]); };
CZ.browseSet=function(sel){ go('browse/'+sel); };

window.CZ_VIEWS_PART1=true;
})();

/* ===========================================================
   PHẦN 2: Flashcard · Quiz · Thi thử · Sổ tay · Dịch
   =========================================================== */
(function(){
"use strict";
var CZ=window.CZ;
var WORDS=CZ._words, BY_S=CZ._byS, TOPICS=CZ._topics, getEntry=CZ._getEntry, enOf=CZ._enOf;
var esc=CZ._esc, wItem=CZ._wItem, hskBadge=CZ._hsk, speak=CZ._speak, go=CZ.go, search=CZ._search;
var addXp=CZ._addXp, getXp=CZ._getXp, notebook=CZ._notebook, toggleSave=CZ._toggleSave, toast=CZ._toast, lsGet=CZ._lsGet, lsSet=CZ._lsSet;
function app(){ return document.getElementById('app'); }
function rand(n){ return Math.floor(Math.random()*n); }
function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=rand(i+1),t=a[i];a[i]=a[j];a[j]=t; } return a; }
function poolBy(sel){
  if(sel==='notebook'){ var nb=notebook(); return WORDS.filter(function(w){return nb.indexOf(w.s)>=0;}); }
  if(sel&&sel.indexOf('hsk:')===0){ var n=+sel.slice(4); return WORDS.filter(function(w){return w.hsk===n;}); }
  if(sel&&sel.indexOf('topic:')===0){ var t=sel.slice(6); return WORDS.filter(function(w){return w.topic===t;}); }
  return WORDS.slice();
}
function srcLabel(sel){
  if(sel==='notebook') return 'Sổ tay'; if(sel==='all') return 'Tất cả';
  if(sel.indexOf('hsk:')===0) return 'HSK '+sel.slice(4);
  if(sel.indexOf('topic:')===0) return sel.slice(6); return sel;
}
function sourcePicker(route){
  var opts=[['hsk:1','HSK 1'],['hsk:2','HSK 2'],['hsk:3','HSK 3'],['hsk:4','HSK 4'],['hsk:5','HSK 5'],['hsk:6','HSK 6'],['all','Tất cả'],['notebook','★ Sổ tay']];
  return '<div class="card pad-lg" style="max-width:560px;margin:0 auto;text-align:center">'+
    '<div style="font-size:46px">'+(route==='flashcard'?'🎴':route==='quiz'?'🧠':'📝')+'</div>'+
    '<div class="section-title" style="justify-content:center">Chọn bộ từ để bắt đầu</div>'+
    '<div class="seg" style="justify-content:center;flex-wrap:wrap">'+
      opts.map(function(o){return '<button onclick="CZ.go(\''+route+'/'+o[0]+'\')">'+o[1]+'</button>';}).join('')+
    '</div></div>';
}

/* ---------------- FLASHCARD ---------------- */
var fc={deck:[],i:0,known:0};
function viewFlashcard(arg){
  if(!arg){ app().innerHTML='<div class="view"><div class="section-title">🎴 Flashcard</div>'+sourcePicker('flashcard')+'</div>'; return; }
  fc.deck=shuffle(poolBy(arg)); fc.i=0; fc.known=0; fc.src=arg;
  if(!fc.deck.length){ app().innerHTML='<div class="view"><div class="empty"><div class="big">📭</div>Bộ này chưa có từ. <br><button class="btn btn-primary" style="margin-top:12px" onclick="CZ.go(\'learn\')">← Về khu Học</button></div></div>'; return; }
  renderFlash();
}
function renderFlash(){
  if(fc.i>=fc.deck.length){ return flashDone(); }
  var w=fc.deck[fc.i];
  var pct=Math.round(fc.i/fc.deck.length*100);
  var exHtml=w.ex&&w.ex.length?'<div class="ex" style="margin-top:8px"><div class="exs zh" style="font-size:16px">'+esc(w.ex[0].s)+'</div><div class="exp">'+esc(w.ex[0].p)+'</div><div class="exv">'+esc(w.ex[0].v)+'</div></div>':'';
  app().innerHTML=
  '<div class="view"><div class="flash-wrap">'+
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">'+
      '<button class="btn btn-ghost" onclick="CZ.go(\'learn\')">←</button>'+
      '<div style="font-weight:800;color:var(--muted)">'+srcLabel(fc.src)+' · '+(fc.i+1)+'/'+fc.deck.length+'</div>'+
      '<div style="margin-left:auto;font-weight:800;color:var(--violet)">✅ '+fc.known+'</div>'+
    '</div>'+
    '<div class="flash-progress"><i style="width:'+pct+'%"></i></div>'+
    '<div class="flashcard"><div class="flash-inner" id="fcInner" onclick="CZ.fcFlip()">'+
      '<div class="flash-face flash-front">'+
        '<div class="fh zh">'+esc(w.s)+'</div>'+
        '<button class="tool" style="background:rgba(255,255,255,.25);color:#fff" onclick="event.stopPropagation();CZ.say(\''+esc(w.s)+'\',this)">🔊 Nghe</button>'+
        '<div class="hint">Nhấn để xem nghĩa</div>'+
      '</div>'+
      '<div class="flash-face flash-back">'+
        '<div class="py">'+esc(w.p)+'</div>'+
        '<div class="hv">⎈ '+esc(w.hv)+'</div>'+
        '<div class="mn">'+esc(w.m)+'</div>'+exHtml+
        '<div id="fcImg"></div>'+
      '</div>'+
    '</div></div>'+
    '<div class="flash-actions">'+
      '<button class="btn btn-again btn-lg" onclick="CZ.fcAgain()">↻ Chưa thuộc</button>'+
      '<button class="btn btn-know btn-lg" onclick="CZ.fcKnow()">✓ Đã thuộc</button>'+
    '</div>'+
    '<div style="margin-top:10px;color:var(--muted);font-size:13px"><span class="kbd">Space</span> lật · <span class="kbd">→</span> đã thuộc</div>'+
  '</div></div>';
  if(CZ.wordImage) CZ.wordImage(document.getElementById('fcImg'), w.s, w, true);
}
function flashDone(){
  var xp=fc.known*5; addXp(xp);
  app().innerHTML='<div class="view"><div class="flash-wrap"><div class="card pad-lg result-big">'+
    '<div style="font-size:60px">🎉</div><div class="score">'+fc.known+'/'+fc.deck.length+'</div>'+
    '<p style="font-weight:800">Hoàn thành! +'+xp+' XP</p>'+
    '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:10px">'+
      '<button class="btn btn-primary" onclick="CZ.go(\'flashcard/'+fc.src+'\')">↻ Học lại</button>'+
      '<button class="btn btn-ghost" onclick="CZ.go(\'quiz/'+fc.src+'\')">🧠 Làm quiz</button>'+
      '<button class="btn btn-ghost" onclick="CZ.go(\'learn\')">← Khu Học</button>'+
    '</div></div></div></div>';
}
CZ.fcFlip=function(){ var el=document.getElementById('fcInner'); if(el) el.classList.toggle('flip'); };
CZ.fcKnow=function(){ fc.known++; fc.i++; renderFlash(); };
CZ.fcAgain=function(){ fc.deck.push(fc.deck[fc.i]); fc.i++; renderFlash(); };

/* ---------------- QUIZ ENGINE (dùng cho Quiz & Thi thử) ---------------- */
var qz={qs:[],i:0,score:0,answered:false,timed:false,t0:0,timer:null,title:'',src:'',pass:0,isTest:false};
function distract(pool,w,field){
  var opts=[w[field]],g=0;
  while(opts.length<4&&g++<300){ var c=pool[rand(pool.length)][field]; if(c&&opts.indexOf(c)<0) opts.push(c); }
  return shuffle(opts);
}
function makeQuestions(pool,count){
  pool=pool.filter(function(w){return w.s&&w.m&&w.p;});
  var picked=shuffle(pool).slice(0,Math.min(count,pool.length));
  return picked.map(function(w){
    var type=['h2m','m2h','h2p'][rand(3)], q={word:w,type:type};
    if(type==='h2m'){ q.prompt='<div class="q-prompt">Chọn NGHĨA đúng</div><div class="q-han zh">'+esc(w.s)+'</div><div class="q-py">'+esc(w.p)+'</div>'; q.answer=w.m; q.options=distract(pool,w,'m'); }
    else if(type==='m2h'){ q.prompt='<div class="q-prompt">Chọn CHỮ HÁN đúng</div><div style="font-size:26px;font-weight:800;margin:10px 0">“'+esc(w.m)+'”</div>'; q.answer=w.s; q.options=distract(pool,w,'s'); q.zh=true; }
    else { q.prompt='<div class="q-prompt">Chọn PINYIN đúng</div><div class="q-han zh">'+esc(w.s)+'</div>'; q.answer=w.p; q.options=distract(pool,w,'p'); }
    return q;
  });
}
function startQuiz(opts){
  qz={qs:opts.qs,i:0,score:0,answered:false,timed:!!opts.timed,t0:Date.now(),timer:null,title:opts.title,src:opts.src,pass:opts.pass||0,isTest:!!opts.isTest};
  if(qz.timed){ qz.timer=setInterval(tickTimer,1000); }
  renderQuiz();
}
function tickTimer(){
  var el=document.getElementById('qzTime');
  if(!el){ clearInterval(qz.timer); return; }
  var s=Math.floor((Date.now()-qz.t0)/1000);
  el.textContent=('0'+Math.floor(s/60)).slice(-2)+':'+('0'+(s%60)).slice(-2);
}
function renderQuiz(){
  if(qz.i>=qz.qs.length){ return quizDone(); }
  var q=qz.qs[qz.i], pct=Math.round(qz.i/qz.qs.length*100);
  var optHtml=q.options.map(function(o){
    return '<button class="opt '+(q.zh?'zh':'')+'" onclick="CZ.qPick(this,\''+esc(o).replace(/'/g,"\\'")+'\')">'+esc(o)+'</button>';
  }).join('');
  app().innerHTML=
  '<div class="view"><div class="quiz-wrap">'+
    '<div class="q-top">'+
      '<button class="btn btn-ghost" onclick="CZ.qExit()">←</button>'+
      '<span class="q-counter">'+(qz.i+1)+'/'+qz.qs.length+'</span>'+
      '<div class="q-bar"><i style="width:'+pct+'%"></i></div>'+
      (qz.timed?'<span class="streak-pill" style="font-size:14px">⏱ <b id="qzTime">00:00</b></span>':'')+
      '<span style="font-weight:800;color:var(--violet)">'+qz.score+'✓</span>'+
    '</div>'+
    '<div class="card pad-lg q-card">'+q.prompt+
      '<div class="opts" id="opts">'+optHtml+'</div>'+
      '<div id="qfoot" style="margin-top:16px"></div>'+
    '</div>'+
  '</div></div>';
  if(qz.timed) tickTimer();
}
CZ.qPick=function(btn,val){
  if(qz.answered) return; qz.answered=true;
  var q=qz.qs[qz.i], correct=q.answer;
  document.querySelectorAll('.opt').forEach(function(b){
    b.classList.add('disabled');
    if(b.textContent===correct) b.classList.add('correct');
  });
  var ok=(val===correct);
  if(ok){ btn.classList.add('correct'); qz.score++; addXp(10); }
  else { btn.classList.add('wrong'); }
  var w=q.word;
  document.getElementById('qfoot').innerHTML=
    '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center">'+
      '<span style="font-weight:800;color:'+(ok?'#15803d':'#b91c1c')+'">'+(ok?'✓ Chính xác!':'✗ Đáp án: '+esc(correct))+'</span>'+
      '<button class="tool" onclick="CZ.say(\''+esc(w.s)+'\',this)">🔊 '+esc(w.s)+'</button>'+
      '<button class="btn btn-primary" onclick="CZ.qNext()">'+(qz.i+1>=qz.qs.length?'Xem kết quả →':'Câu tiếp →')+'</button>'+
    '</div>';
};
CZ.qNext=function(){ qz.i++; qz.answered=false; renderQuiz(); };
CZ.qExit=function(){ if(qz.timer) clearInterval(qz.timer); go('learn'); };
function quizDone(){
  if(qz.timer) clearInterval(qz.timer);
  var total=qz.qs.length, pct=total?Math.round(qz.score/total*100):0;
  var secs=Math.floor((Date.now()-qz.t0)/1000);
  var passed=pct>=qz.pass;
  var ring='<svg class="ring" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="#eee" stroke-width="12"/>'+
    '<circle cx="60" cy="60" r="52" fill="none" stroke="url(#g)" stroke-width="12" stroke-linecap="round" '+
    'stroke-dasharray="'+(2*Math.PI*52)+'" stroke-dashoffset="'+(2*Math.PI*52*(1-pct/100))+'" transform="rotate(-90 60 60)"/>'+
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs>'+
    '<text x="60" y="68" text-anchor="middle" font-size="28" font-weight="900" fill="#7c3aed">'+pct+'%</text></svg>';
  var msg = pct>=90?'Xuất sắc! 🏆':pct>=70?'Làm tốt lắm! 👍':pct>=50?'Khá ổn, cố thêm nhé! 💪':'Ôn lại chút nữa nha! 📚';
  app().innerHTML=
  '<div class="view"><div class="quiz-wrap"><div class="card pad-lg result-big">'+
    (qz.isTest?'<div class="hsk-badge '+(passed?'hsk-1':'hsk-4')+'" style="font-size:14px">'+(passed?'ĐẠT':'CHƯA ĐẠT')+'</div>':'')+
    ring+
    '<div class="score">'+qz.score+'/'+total+'</div>'+
    '<p style="font-weight:800;font-size:18px">'+msg+'</p>'+
    '<div class="stat-row" style="margin:14px 0">'+
      '<div class="stat"><div class="n">'+pct+'%</div><div class="l">Chính xác</div></div>'+
      '<div class="stat"><div class="n">'+qz.score*10+'</div><div class="l">XP nhận được</div></div>'+
      (qz.timed?'<div class="stat"><div class="n">'+('0'+Math.floor(secs/60)).slice(-2)+':'+('0'+(secs%60)).slice(-2)+'</div><div class="l">Thời gian</div></div>':'')+
    '</div>'+
    '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">'+
      '<button class="btn btn-primary" onclick="CZ.go(\''+(qz.isTest?'test':'quiz')+'/'+qz.src+'\')">↻ Làm lại</button>'+
      '<button class="btn btn-ghost" onclick="CZ.go(\'learn\')">← Khu Học</button>'+
    '</div></div></div></div>';
}

/* QUIZ view */
function viewQuiz(arg){
  if(!arg){ app().innerHTML='<div class="view"><div class="section-title">🧠 Quiz trắc nghiệm</div>'+sourcePicker('quiz')+'</div>'; return; }
  var pool=poolBy(arg);
  if(pool.length<4){ app().innerHTML='<div class="view"><div class="empty"><div class="big">📭</div>Cần ít nhất 4 từ để làm quiz.<br><button class="btn btn-primary" style="margin-top:12px" onclick="CZ.go(\'learn\')">← Về khu Học</button></div></div>'; return; }
  startQuiz({qs:makeQuestions(pool,Math.min(10,pool.length)),title:'Quiz',src:arg,timed:false,pass:0,isTest:false});
}
/* TEST view (thi thử HSK, có hẹn giờ + chấm đạt/không) */
function viewTest(arg){
  if(!arg){
    app().innerHTML='<div class="view"><div class="section-title">📝 Thi thử HSK</div>'+
      '<div class="card pad-lg" style="max-width:580px;margin:0 auto;text-align:center">'+
      '<div style="font-size:46px">📝</div>'+
      '<p style="font-weight:700;color:var(--muted)">Đề gồm câu hỏi trắc nghiệm (nghĩa · pinyin · chữ Hán), có hẹn giờ. Đạt khi đúng ≥ 60%.</p>'+
      '<div class="seg" style="justify-content:center;flex-wrap:wrap">'+
        [['hsk:1','HSK 1'],['hsk:2','HSK 2'],['hsk:3','HSK 3'],['hsk:4','HSK 4'],['hsk:5','HSK 5'],['hsk:6','HSK 6']].map(function(o){return '<button onclick="CZ.go(\'test/'+o[0]+'\')">'+o[1]+'</button>';}).join('')+
      '</div></div></div>';
    return;
  }
  var pool=poolBy(arg);
  if(pool.length<4){ app().innerHTML='<div class="view"><div class="empty">Không đủ từ cho đề thi.</div></div>'; return; }
  var n=Math.min(20,pool.length);
  startQuiz({qs:makeQuestions(pool,n),title:'Thi thử',src:arg,timed:true,pass:60,isTest:true});
}

/* ---------------- SỔ TAY ---------------- */
function viewNotebook(){
  var nb=notebook(), list=WORDS.filter(function(w){return nb.indexOf(w.s)>=0;});
  var head='<div class="view"><div class="section-title">★ Sổ tay của tôi <span style="color:var(--muted);font-weight:700;font-size:15px">('+list.length+' từ)</span></div>';
  if(!list.length){
    app().innerHTML=head+'<div class="empty"><div class="big">📒</div>Sổ tay đang trống.<br>Bấm ☆ ở mỗi từ để lưu lại học sau.<br><button class="btn btn-primary" style="margin-top:14px" onclick="CZ.go(\'browse/hsk:1\')">Duyệt từ vựng →</button></div></div>';
    return;
  }
  app().innerHTML=head+
    '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px">'+
      '<button class="btn btn-primary" onclick="CZ.go(\'flashcard/notebook\')">🎴 Flashcard sổ tay</button>'+
      '<button class="btn btn-ghost" onclick="CZ.go(\'quiz/notebook\')">🧠 Quiz sổ tay</button>'+
      '<button class="btn btn-ghost" onclick="CZ.nbClear()">🗑️ Xóa tất cả</button>'+
    '</div>'+
    '<div class="wlist">'+list.map(wItem).join('')+'</div></div>';
}
CZ.nbClear=function(){ if(confirm('Xóa toàn bộ từ trong sổ tay?')){ lsSet('cz_notebook',[]); toast('Đã xóa sổ tay'); go('notebook'); CZ._render(); } };

/* ---------------- DỊCH ---------------- */
function deburr(s){ return String(s||'').toLowerCase().replace(/đ/g,'d').normalize('NFD').replace(/[̀-ͯ]/g,''); }
function segment(text){
  var out=[],i=0,MAX=6;
  while(i<text.length){
    var ch=text[i];
    if(!/[一-鿿]/.test(ch)){ out.push({t:ch,raw:true}); i++; continue; }
    var hit=null;
    for(var L=Math.min(MAX,text.length-i);L>=1;L--){ var sub=text.substr(i,L); var e=getEntry(sub); if(e){ hit=e; out.push({t:sub,w:e}); i+=L; break; } }
    if(!hit){ out.push({t:ch,unknown:true}); i++; }
  }
  return out;
}
function glossOf(w){ return w.m || (w.en?w.en[0]:''); }
var trDir='zh2vi';
function viewTranslate(){
  app().innerHTML=
  '<div class="view"><div class="section-title">🌐 Dịch nhanh '+
    '<span style="font-weight:700;font-size:14px;color:var(--muted)">(tách từ + tra nghĩa, dựa trên từ điển HSK)</span></div>'+
  '<div class="tr-grid">'+
    '<div class="tr-pane">'+
      '<div class="tr-head"><span id="srcLab">'+(trDir==='zh2vi'?'Tiếng Trung':'Tiếng Việt')+'</span>'+
        '<button class="tool" onclick="CZ.trSpeak()">🔊 Đọc</button></div>'+
      '<textarea id="trIn" placeholder="'+(trDir==='zh2vi'?'Nhập tiếng Trung, vd: 我喜欢学习汉语':'Nhập tiếng Việt, vd: tôi thích học')+'"></textarea>'+
      '<button class="btn btn-primary" onclick="CZ.trRun()" style="margin-top:6px">Dịch →</button>'+
    '</div>'+
    '<div class="tr-pane">'+
      '<div class="tr-head"><span>'+(trDir==='zh2vi'?'Tiếng Việt':'Tiếng Trung')+'</span>'+
        '<button class="swap-btn" title="Đổi chiều" onclick="CZ.trSwap()">⇄</button></div>'+
      '<div class="tr-out" id="trOut"><div class="empty" style="padding:20px">Kết quả dịch hiện ở đây.</div></div>'+
    '</div>'+
  '</div>'+
  '<div class="card" style="margin-top:16px"><b>Mẹo:</b> Ở chế độ Trung→Việt, mỗi từ tách ra kèm pinyin và nghĩa — bấm vào từ để xem chi tiết. Đây là công cụ học từ, không phải dịch máy hoàn chỉnh.</div>'+
  '</div>';
}
CZ.trSwap=function(){ trDir=(trDir==='zh2vi')?'vi2zh':'zh2vi'; viewTranslate(); };
CZ.trSpeak=function(){ var v=(document.getElementById('trIn')||{}).value||''; if(trDir==='zh2vi'&&v.trim()) speak(v); };
CZ.trRun=function(){
  var v=(document.getElementById('trIn')||{}).value||''; var out=document.getElementById('trOut');
  if(!v.trim()){ out.innerHTML='<div class="empty" style="padding:20px">Hãy nhập nội dung.</div>'; return; }
  if(trDir==='zh2vi'){
    var toks=segment(v), gloss=[];
    var html=toks.map(function(tk){
      if(tk.raw) return /\s/.test(tk.t)?' ':esc(tk.t);
      if(tk.unknown) return '<span class="tok" style="color:#b91c1c">'+esc(tk.t)+'</span>';
      var g=glossOf(tk.w); gloss.push(g);
      return '<span class="tok" onclick="CZ.go(\'word/'+encodeURIComponent(tk.w.s)+'\')"><ruby class="zh" style="font-size:22px">'+esc(tk.t)+'<rt>'+esc(tk.w.p)+'</rt></ruby><span class="tk-v">'+esc(g)+'</span></span>';
    }).join('');
    out.innerHTML='<div style="line-height:2.4">'+html+'</div>'+
      '<div style="margin-top:14px;padding-top:12px;border-top:1px dashed var(--line)"><b>Nghĩa ghép:</b> '+esc(gloss.join(' / '))+'</div>';
  } else {
    // Việt → Trung: tra từng từ theo nghĩa
    var words=v.toLowerCase().split(/[\s,.;!?]+/).filter(Boolean), rows=[];
    words.forEach(function(token){
      var best=null;
      WORDS.forEach(function(w){ var m=deburr(w.m); if(!best&&(m===deburr(token)||m.split(/[,;]\s*/).indexOf(deburr(token))>=0)) best=w; });
      if(!best){ WORDS.forEach(function(w){ if(!best&&deburr(w.m).indexOf(deburr(token))>=0) best=w; }); }
      rows.push({token:token,w:best});
    });
    out.innerHTML=rows.map(function(r){
      if(!r.w) return '<div class="tok" style="display:block;color:#b91c1c">“'+esc(r.token)+'” — không tìm thấy</div>';
      return '<div class="tok" style="display:block" onclick="CZ.go(\'word/'+encodeURIComponent(r.w.s)+'\')">“'+esc(r.token)+'” → <b class="zh" style="font-size:20px">'+esc(r.w.s)+'</b> <span style="color:var(--violet)">'+esc(r.w.p)+'</span> ('+esc(r.w.m)+')</div>';
    }).join('');
  }
};

/* đăng ký phần 2 */
CZ._setViews({ flashcard:viewFlashcard, quiz:viewQuiz, test:viewTest, notebook:viewNotebook, translate:viewTranslate });

/* phím tắt flashcard */
document.addEventListener('keydown',function(e){
  if(location.hash.indexOf('#flashcard/')!==0) return;
  if(e.code==='Space'){ e.preventDefault(); CZ.fcFlip&&CZ.fcFlip(); }
  else if(e.key==='ArrowRight'){ CZ.fcKnow&&CZ.fcKnow(); }
  else if(e.key==='ArrowLeft'){ CZ.fcAgain&&CZ.fcAgain(); }
});

/* render lại đúng route sau khi đã đăng ký đủ view */
CZ._render();
window.CZ_VIEWS_PART2=true;
})();


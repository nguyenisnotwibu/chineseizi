/* =========================================================
   CHINESEIZI · grammar-practice.js
   Luyện tập ngữ pháp HSK — 5 dạng bài chuẩn đề thi
   ========================================================= */
(function(){
"use strict";
var CZ = window.CZ; if(!CZ) return;
var G  = window.CZ_GRAMMAR || [];
var esc = CZ._esc;

function app(){ return document.getElementById('app'); }

/* ── Helpers ─────────────────────────────────────── */
function randItems(arr, n){
  var a = arr.slice(), r = [];
  for(var i=0; i<n && a.length; i++){ var j=Math.floor(Math.random()*a.length); r.push(a.splice(j,1)[0]); }
  return r;
}
function shuffle(arr){
  var a = arr.slice();
  for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i];a[i]=a[j];a[j]=t; }
  return a;
}

/* Extract main Chinese grammar keyword from struct string */
function mainKey(g){
  var m = g.struct.match(/[一-鿿……]+/g);
  return m ? m[0] : null;
}

/* Split sentence into tiles for ordering exercise.
   Strategy: split around grammar keywords found in struct */
function makeTiles(s, p, struct){
  var clean = s.replace(/[。，？！、]/g,'');
  var punct = '。，？！'.indexOf(s.slice(-1)) >= 0 ? s.slice(-1) : '';
  var keys = (struct.match(/[一-鿿]+/g) || []);

  // Try splitting around structural keywords
  var parts = [clean];
  keys.forEach(function(kw){
    var next = [];
    parts.forEach(function(part){
      var pos = part.indexOf(kw);
      if(pos > 0 && pos < part.length - kw.length){
        next.push(part.slice(0, pos));
        next.push(kw);
        next.push(part.slice(pos + kw.length));
      } else { next.push(part); }
    });
    parts = next;
  });
  parts = parts.filter(function(x){ return x.length > 0; });

  // If we didn't get at least 3 tiles, chunk by pinyin words instead
  if(parts.length < 3){
    var pins = (p||'').trim().split(/\s+/);
    var n = Math.min(pins.length, Math.max(3, Math.ceil(clean.length / 2)));
    var chunkSize = Math.ceil(clean.length / n);
    parts = [];
    for(var i=0; i<clean.length; i+=chunkSize){
      parts.push(clean.slice(i, Math.min(i+chunkSize, clean.length)));
    }
  }
  if(parts.length > 0) parts[parts.length-1] += punct;
  return parts.filter(function(x){ return x.length > 0; });
}

/* ── Question generators ─────────────────────────── */

/* Type 1 · 选词填空 — Fill in the blank */
function mkFillBlank(g, idx){
  if(!g.ex || !g.ex.length) return null;
  var key = mainKey(g);
  if(!key) return null;
  var ex = g.ex[0];
  if(ex.s.indexOf(key) < 0) return null;
  var blank = ex.s.replace(key, '___');
  if(blank === ex.s) return null;

  // Distractors: same HSK level first, then others
  var pool = G.filter(function(x,i){ return i!==idx; });
  var sameLevel = pool.filter(function(x){ return x.hsk===g.hsk; });
  var distPool = sameLevel.concat(pool);
  var distractors = [];
  distPool.forEach(function(og){
    var k = mainKey(og);
    if(k && k!==key && distractors.indexOf(k)<0) distractors.push(k);
  });
  distractors = randItems(distractors, 3);
  while(distractors.length < 3) distractors.push(['也','都','很'][distractors.length]||'了');

  return {
    type:'fillblank',
    label:'✏️ Điền từ thích hợp vào chỗ trống',
    q: blank,
    qVi: ex.v,
    options: shuffle([key].concat(distractors)),
    answer: key,
    explain: '【'+key+'】là từ khóa của mẫu câu này.\n' +
             '📐 Cấu trúc: '+g.struct+'\n'+
             '💬 '+g.explain
  };
}

/* Type 2 · 排列顺序 — Sentence ordering */
function mkOrdering(g, idx){
  var ex = g.ex && g.ex.length > 1 ? g.ex[1] : (g.ex && g.ex[0]);
  if(!ex) return null;
  var tiles = makeTiles(ex.s, ex.p, g.struct);
  if(tiles.length < 3) return null;
  return {
    type:'order',
    label:'🔀 Sắp xếp thành câu đúng',
    qVi: ex.v,
    tiles: shuffle(tiles),
    correct: tiles,
    correctStr: tiles.join(''),
    explain: '✅ Câu đúng: 【'+ex.s+'】\n'+ex.p+'\n'+ex.v+'\n\n'+
             '📐 Cấu trúc: '+g.struct+'\n'+
             '💬 '+g.explain
  };
}

/* Type 3 · 判断对错 — True or False */
function mkTrueFalse(g, idx){
  if(!g.ex || !g.ex.length) return null;
  var key = mainKey(g);
  var ex = g.ex[0];
  var isTrue = Math.random() > 0.45;
  var sentence, explainPrefix;

  if(isTrue){
    sentence = ex.s;
    explainPrefix = '✅ Câu này ĐÚNG.\n';
  } else {
    // Swap the keyword with one from a different grammar point at same level
    var wrong = G.filter(function(x,i){ return i!==idx && x.hsk===g.hsk && mainKey(x) && mainKey(x)!==key; });
    if(!wrong.length) wrong = G.filter(function(x,i){ return i!==idx && mainKey(x) && mainKey(x)!==key; });
    var wrongG = wrong[Math.floor(Math.random()*wrong.length)];
    var wrongKey = wrongG ? mainKey(wrongG) : null;
    if(key && wrongKey && ex.s.indexOf(key) >= 0){
      sentence = ex.s.replace(key, wrongKey);
      explainPrefix = '❌ Câu này SAI. Nên dùng【'+key+'】thay vì【'+wrongKey+'】.\n';
    } else {
      // fallback to true
      isTrue = true;
      sentence = ex.s;
      explainPrefix = '✅ Câu này ĐÚNG.\n';
    }
  }

  return {
    type:'truefalse',
    label:'✅ Câu sau đúng hay sai?',
    q: sentence,
    options:['✅ Đúng','❌ Sai'],
    answer: isTrue ? '✅ Đúng' : '❌ Sai',
    explain: explainPrefix+
             '📐 Cấu trúc: '+g.struct+'\n'+
             '💬 '+g.explain+'\n'+
             '📝 Ví dụ đúng: '+ex.s+' ('+ex.v+')'
  };
}

/* Type 4 · 选择正确翻译 — Choose correct Chinese translation */
function mkTranslate(g, idx){
  if(!g.ex || !g.ex.length) return null;
  var ex = g.ex[0];
  var correct = ex.s;
  var others = G.filter(function(x,i){ return i!==idx && x.ex && x.ex[0]; });
  var wrongs = randItems(others, 3).map(function(x){ return x.ex[0].s; });
  while(wrongs.length < 3) wrongs.push(wrongs[0]||'他不是学生。');
  return {
    type:'translate',
    label:'🌐 Chọn bản dịch tiếng Trung đúng',
    q: '🇻🇳  '+ex.v,
    options: shuffle([correct].concat(wrongs.slice(0,3))),
    answer: correct,
    explain: '✅ Bản dịch đúng:\n【'+correct+'】\n'+ex.p+'\n\n'+
             '📐 Cấu trúc: '+g.struct+'\n'+
             '💬 '+g.explain
  };
}

/* Type 5 · 选出正确用法 — Choose correct usage sentence */
function mkChooseCorrect(g, idx){
  if(!g.ex || !g.ex.length) return null;
  var correct = g.ex[0].s;
  var key = mainKey(g);

  // Generate plausible wrong sentences by inserting wrong grammar word
  var pool = G.filter(function(x,i){ return i!==idx && x.ex && x.ex[0]; });
  var wrongGs = randItems(pool.filter(function(x){ return x.hsk===g.hsk; }).concat(pool), 3);
  var wrongs = wrongGs.map(function(wg){
    var wex = wg.ex[0].s;
    var wkey = mainKey(wg);
    // Replace the wrong key with our correct key to make a subtly wrong sentence
    if(wkey && wkey!==key && wex.indexOf(wkey)>=0){
      return wex.replace(wkey, key||'');
    }
    return wex;
  });
  wrongs = wrongs.filter(function(w){ return w !== correct; });
  while(wrongs.length < 3) wrongs.push(wrongs[0]||'我是很好了。');

  return {
    type:'choose',
    label:'☑️ Câu nào dùng đúng cấu trúc【'+g.title+'】?',
    q: 'Chọn câu sử dụng đúng cấu trúc 【'+g.struct+'】:',
    options: shuffle([correct].concat(wrongs.slice(0,3))),
    answer: correct,
    explain: '✅ Câu đúng:\n【'+correct+'】\n'+g.ex[0].p+'\n'+g.ex[0].v+'\n\n'+
             '📐 Cấu trúc: '+g.struct+'\n'+
             '💬 '+g.explain
  };
}

/* ── Build question set ──────────────────────────── */
function buildQuestions(g, idx){
  var fns = [mkFillBlank, mkOrdering, mkTrueFalse, mkTranslate, mkChooseCorrect];
  var qs = [];
  fns.forEach(function(fn){ var q=fn(g,idx); if(q) qs.push(q); });
  // Shuffle and take up to 5
  return shuffle(qs).slice(0,5);
}

/* ── Practice state ──────────────────────────────── */
var PS = null; // practice state

/* ── Render: Grammar detail + practice entry ──────── */
function viewGpractice(arg){
  var idx = parseInt(arg, 10);
  var g = G[idx];
  if(!g){ CZ.go('grammar'); return; }

  var questions = buildQuestions(g, idx);
  PS = { g:g, idx:idx, questions:questions, current:0, score:0, answered:false };

  renderQuestion();
}

/* ── Render current question ─────────────────────── */
function renderQuestion(){
  var s = PS;
  var q = s.questions[s.current];
  var total = s.questions.length;
  var num = s.current + 1;
  var pct = Math.round((s.current / total) * 100);

  var grammarRef =
    '<div class="gp-ref">'+
      '<span class="hsk-badge hsk-'+s.g.hsk+'">HSK '+s.g.hsk+'</span>'+
      '<span class="gp-ref-title">'+esc(s.g.title)+'</span>'+
      '<span class="gp-struct zh">'+esc(s.g.struct)+'</span>'+
    '</div>';

  var progress =
    '<div class="gp-progress">'+
      '<div class="gp-prog-track"><div class="gp-prog-bar" style="width:'+pct+'%"></div></div>'+
      '<div class="gp-prog-meta">'+
        '<span>Câu '+num+' / '+total+'</span>'+
        '<span class="gp-score-pill">⭐ '+s.score+' điểm</span>'+
      '</div>'+
    '</div>';

  var body = '';

  if(q.type === 'fillblank'){
    body =
      '<div class="gp-question zh" style="font-size:22px;font-weight:800;letter-spacing:.5px">'+esc(q.q)+'</div>'+
      '<div class="gp-vi">'+esc(q.qVi)+'</div>'+
      renderMCQ(q.options);

  } else if(q.type === 'order'){
    body =
      '<div class="gp-question">Sắp xếp các phần thành câu hoàn chỉnh:</div>'+
      '<div class="gp-vi">'+esc(q.qVi)+'</div>'+
      '<div id="gp-arranged" class="gp-arranged"><span class="gp-arranged-hint">Nhấn vào từng phần bên dưới...</span></div>'+
      '<div id="gp-tiles" class="gp-tiles">'+
        q.tiles.map(function(tile, i){
          return '<button class="gp-tile" id="gpt-'+i+'" onclick="CZ._gpTile('+i+')">'+
            '<span class="zh">'+esc(tile)+'</span></button>';
        }).join('')+
      '</div>'+
      '<button class="btn btn-primary gp-check-btn" onclick="CZ._gpCheckOrder()">Kiểm tra ✓</button>';
    PS.tileOrder = [];
    PS.tileUsed = {};

  } else if(q.type === 'truefalse'){
    body =
      '<div class="gp-question">Câu sau đúng hay sai về mặt ngữ pháp?</div>'+
      '<div class="gp-sentence-box zh">'+esc(q.q)+'</div>'+
      '<div class="gp-tf-row">'+
        ['✅ Đúng','❌ Sai'].map(function(opt){
          return '<button class="gp-tf-btn" onclick="CZ._gpAnswer('+JSON.stringify(opt)+')">'+opt+'</button>';
        }).join('')+
      '</div>';

  } else {
    // choose / translate
    body =
      '<div class="gp-question">'+esc(q.q)+'</div>'+
      renderMCQ(q.options);
  }

  app().innerHTML =
    '<div class="view">'+
    '<div class="gp-topbar">'+
      '<button class="btn gp-back-btn" onclick="CZ.go(\'grammar/hsk:'+s.g.hsk+'\')">← Ngữ pháp</button>'+
    '</div>'+
    progress+
    '<div class="gp-card">'+
      grammarRef+
      '<div class="gp-type-badge">'+esc(q.label)+'</div>'+
      body+
    '</div>'+
    '</div>';
}

function renderMCQ(options){
  return '<div class="gp-opts">'+
    options.map(function(opt, i){
      return '<button class="gp-opt" onclick="CZ._gpAnswer('+JSON.stringify(opt)+')">'+
        '<span class="gp-opt-key">'+'ABCD'[i]+'</span>'+
        '<span class="gp-opt-txt zh">'+esc(opt)+'</span></button>';
    }).join('')+
  '</div>';
}

/* ── Handlers ─────────────────────────────────────── */
function gpAnswer(chosen){
  if(PS.answered) return;
  PS.answered = true;
  var q = PS.questions[PS.current];
  var ok = (chosen === q.answer);
  if(ok) PS.score++;
  showFeedback(ok, q, chosen);
}

function gpTile(i){
  if(PS.answered) return;
  var q = PS.questions[PS.current];
  if(PS.tileUsed[i]){
    delete PS.tileUsed[i];
    PS.tileOrder = PS.tileOrder.filter(function(x){ return x!==i; });
  } else {
    PS.tileUsed[i] = true;
    PS.tileOrder.push(i);
  }
  // Update tile styles
  document.querySelectorAll('.gp-tile').forEach(function(el, j){
    el.classList.toggle('used', !!PS.tileUsed[j]);
  });
  // Update arranged area
  var arr = document.getElementById('gp-arranged');
  if(arr){
    if(PS.tileOrder.length === 0){
      arr.innerHTML = '<span class="gp-arranged-hint">Nhấn vào từng phần bên dưới...</span>';
    } else {
      arr.innerHTML = PS.tileOrder.map(function(ti){
        return '<span class="gp-arr-seg zh" onclick="CZ._gpTile('+ti+')">'+esc(q.tiles[ti])+'</span>';
      }).join('');
    }
  }
}

function gpCheckOrder(){
  if(PS.answered) return;
  var q = PS.questions[PS.current];
  if(PS.tileOrder.length < q.tiles.length){
    CZ._toast('Hãy sắp xếp tất cả các phần! 🐼');
    return;
  }
  PS.answered = true;
  var arranged = PS.tileOrder.map(function(i){ return q.tiles[i]; }).join('');
  var ok = (arranged === q.correctStr);
  if(ok) PS.score++;
  // Disable check button
  var btn = document.querySelector('.gp-check-btn');
  if(btn) btn.disabled = true;
  showFeedback(ok, q, arranged);
}

function showFeedback(ok, q, chosen){
  // Disable all interaction buttons
  document.querySelectorAll('.gp-opt, .gp-tf-btn, .gp-tile, .gp-check-btn').forEach(function(el){
    el.disabled = true;
    if(el.classList.contains('gp-opt') || el.classList.contains('gp-tf-btn')){
      if(el.textContent.trim() === q.answer || el.querySelector('.gp-opt-txt') && el.querySelector('.gp-opt-txt').textContent === q.answer){
        el.classList.add('gp-opt-correct');
      }
      if((el.textContent.trim() === chosen || el.querySelector('.gp-opt-txt') && el.querySelector('.gp-opt-txt').textContent === chosen) && !ok){
        el.classList.add('gp-opt-wrong');
      }
    }
  });

  var isLast = PS.current >= PS.questions.length - 1;
  var nextBtn = isLast
    ? '<button class="btn btn-primary gp-next-btn" onclick="CZ._gpNext()">🏁 Xem kết quả</button>'
    : '<button class="btn btn-primary gp-next-btn" onclick="CZ._gpNext()">Câu tiếp theo →</button>';

  var feedbackHtml =
    '<div class="gp-feedback '+(ok?'ok':'no')+'">'+
      (ok ? '✅ Chính xác! Xuất sắc!' : '❌ Chưa đúng rồi!')+
    '</div>';

  var answerDetail = (!ok || q.type==='order' || q.type==='translate') ?
    '<div class="gp-answer-box">'+
      '<div class="gp-answer-label">Đáp án đúng:</div>'+
      '<div class="zh gp-answer-text">'+esc(q.answer)+'</div>'+
    '</div>' : '';

  var explainHtml =
    '<div class="gp-explain">'+
      '<div class="gp-explain-title">💡 Giải thích chi tiết</div>'+
      '<div class="gp-explain-body" style="white-space:pre-line">'+esc(q.explain)+'</div>'+
    '</div>';

  var card = document.querySelector('.gp-card');
  if(card){
    card.insertAdjacentHTML('beforeend', feedbackHtml + answerDetail + explainHtml + nextBtn);
    card.querySelector('.gp-next-btn').scrollIntoView({behavior:'smooth', block:'nearest'});
  }
}

function gpNext(){
  PS.current++;
  PS.answered = false;
  if(PS.current >= PS.questions.length){
    renderResult();
  } else {
    renderQuestion();
  }
}

function renderResult(){
  var s = PS;
  var total = s.questions.length;
  var pct = Math.round((s.score / total) * 100);
  var xp = s.score * 15;
  CZ._addXp(xp);

  var grade, emoji, msg;
  if(pct === 100){ grade='S'; emoji='🏆'; msg='Hoàn hảo! Bạn đã thuần thục điểm ngữ pháp này!'; }
  else if(pct >= 80){ grade='A'; emoji='🌟'; msg='Xuất sắc! Nắm vững rồi, thử cấp độ khó hơn nhé!'; }
  else if(pct >= 60){ grade='B'; emoji='😊'; msg='Khá tốt! Ôn thêm một chút là hoàn hảo!'; }
  else if(pct >= 40){ grade='C'; emoji='💪'; msg='Cần luyện thêm! Đọc lại giải thích rồi thử lại nhé.'; }
  else { grade='D'; emoji='📖'; msg='Hãy ôn lại lý thuyết trước rồi luyện tập lại!'; }

  // Star display
  var stars = '';
  for(var i=0;i<5;i++){
    stars += i < Math.ceil(pct/20) ? '⭐' : '☆';
  }

  app().innerHTML =
    '<div class="view">'+
    '<div class="gp-result">'+
      '<div class="gp-result-emoji">'+emoji+'</div>'+
      '<div class="gp-result-grade">Hạng '+grade+'</div>'+
      '<div class="gp-result-score">'+s.score+' / '+total+'</div>'+
      '<div class="gp-result-stars">'+stars+'</div>'+
      '<div class="gp-result-pct">'+pct+'%</div>'+
      '<div class="gp-result-msg">'+msg+'</div>'+
      '<div class="gp-result-xp">+'+xp+' XP 🎉</div>'+

      '<div style="margin-top:8px;padding:14px;background:#faf7ff;border-radius:14px;text-align:left">'+
        '<div style="font-weight:800;margin-bottom:6px;color:var(--violet)">Ôn lại: '+esc(s.g.title)+'</div>'+
        '<div class="zh" style="font-size:17px;font-weight:700">'+esc(s.g.struct)+'</div>'+
        '<div style="color:var(--ink);margin-top:6px;line-height:1.6">'+esc(s.g.explain)+'</div>'+
      '</div>'+

      '<div class="gp-result-actions">'+
        '<button class="btn btn-primary" onclick="CZ.go(\'gpractice/'+s.idx+'\')">🔄 Luyện lại</button>'+
        '<button class="btn gp-back-btn2" onclick="CZ.go(\'grammar/hsk:'+s.g.hsk+'\')">📖 Ngữ pháp HSK '+s.g.hsk+'</button>'+
      '</div>'+
    '</div>'+
    '</div>';
}

/* ── Inject CSS ──────────────────────────────────── */
var css =
/* layout */
'.gp-topbar{margin-bottom:12px}'+
'.gp-back-btn{background:#f3eaff;color:var(--violet);font-weight:700}'+

/* progress */
'.gp-progress{margin-bottom:16px}'+
'.gp-prog-track{background:#e9e0ff;border-radius:99px;height:9px;margin-bottom:6px}'+
'.gp-prog-bar{background:linear-gradient(90deg,var(--violet),#a855f7);border-radius:99px;height:100%;transition:width .5s ease}'+
'.gp-prog-meta{display:flex;justify-content:space-between;font-size:13px;font-weight:700;color:var(--muted)}'+
'.gp-score-pill{background:var(--violet);color:#fff;border-radius:99px;padding:2px 12px}'+

/* card */
'.gp-card{background:#fff;border-radius:22px;box-shadow:var(--shadow);padding:22px 26px;max-width:680px;margin:0 auto}'+
'@media(max-width:600px){.gp-card{padding:14px 12px}}'+

/* grammar reference */
'.gp-ref{display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding-bottom:12px;margin-bottom:12px;border-bottom:2px solid var(--line)}'+
'.gp-ref-title{font-size:15px;font-weight:900;color:var(--ink)}'+
'.gp-struct{font-size:13px;background:var(--grad-soft);color:var(--violet-700,var(--violet));font-weight:700;padding:3px 10px;border-radius:8px}'+

/* type badge */
'.gp-type-badge{display:inline-block;background:#f3eaff;color:var(--violet);font-weight:800;font-size:12px;border-radius:8px;padding:4px 12px;margin-bottom:14px}'+

/* question text */
'.gp-question{font-size:17px;font-weight:700;color:var(--ink);line-height:1.6;margin-bottom:6px}'+
'.gp-vi{font-size:14px;color:var(--muted);margin-bottom:14px}'+
'.gp-sentence-box{font-size:20px;font-weight:700;background:#faf7ff;border:2px solid var(--line);border-radius:14px;padding:14px 18px;margin:12px 0 18px;line-height:1.5}'+

/* MCQ options */
'.gp-opts{display:flex;flex-direction:column;gap:10px}'+
'.gp-opt{display:flex;align-items:center;gap:12px;background:#faf7ff;border:2px solid var(--line);border-radius:14px;padding:11px 16px;cursor:pointer;text-align:left;transition:border-color .15s,background .15s;width:100%}'+
'.gp-opt:hover:not(:disabled){border-color:var(--violet);background:#f0e8ff}'+
'.gp-opt-key{width:30px;height:30px;border-radius:9px;background:var(--violet);color:#fff;font-weight:900;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}'+
'.gp-opt-txt{font-weight:700;font-size:16px;color:var(--ink)}'+
'.gp-opt-correct{border-color:#16a34a!important;background:#dcfce7!important}'+
'.gp-opt-correct .gp-opt-key{background:#16a34a}'+
'.gp-opt-wrong{border-color:#dc2626!important;background:#fee2e2!important}'+
'.gp-opt-wrong .gp-opt-key{background:#dc2626}'+

/* True/False */
'.gp-tf-row{display:flex;gap:12px}'+
'.gp-tf-btn{flex:1;padding:16px;border-radius:14px;font-size:17px;font-weight:800;cursor:pointer;border:2px solid var(--line);background:#faf7ff;transition:all .15s}'+
'.gp-tf-btn:hover:not(:disabled){border-color:var(--violet);background:#f0e8ff}'+

/* Ordering */
'.gp-arranged{min-height:50px;background:#faf7ff;border:2px dashed var(--line);border-radius:14px;padding:10px 14px;display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:12px;cursor:default}'+
'.gp-arranged-hint{color:var(--muted);font-size:14px;font-weight:600}'+
'.gp-arr-seg{background:#fff;border:2px solid var(--violet);border-radius:10px;padding:5px 12px;font-size:16px;font-weight:700;color:var(--violet);cursor:pointer;transition:opacity .15s}'+
'.gp-arr-seg:hover{opacity:.75}'+
'.gp-tiles{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}'+
'.gp-tile{background:#f3eaff;border:2px solid var(--violet);border-radius:10px;padding:8px 14px;cursor:pointer;font-size:16px;font-weight:700;color:var(--violet);transition:all .15s}'+
'.gp-tile:hover:not(:disabled){background:#e9d5ff}'+
'.gp-tile.used{opacity:.35;border-style:dashed;cursor:pointer}'+
'.gp-check-btn{margin-top:4px}'+

/* Feedback */
'.gp-feedback{border-radius:14px;padding:14px 18px;font-weight:800;font-size:17px;margin-top:18px}'+
'.gp-feedback.ok{background:#dcfce7;color:#15803d}'+
'.gp-feedback.no{background:#fee2e2;color:#b91c1c}'+
'.gp-answer-box{background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:12px 16px;margin-top:12px}'+
'.gp-answer-label{font-size:13px;font-weight:800;color:#15803d;margin-bottom:4px}'+
'.gp-answer-text{font-size:18px;font-weight:700}'+
'.gp-explain{background:#faf7ff;border:1px solid var(--line);border-radius:14px;padding:14px 18px;margin-top:12px}'+
'.gp-explain-title{font-weight:800;color:var(--violet);margin-bottom:8px;font-size:15px}'+
'.gp-explain-body{line-height:1.75;font-size:14px;color:var(--ink)}'+
'.gp-next-btn{margin-top:16px;width:100%}'+

/* Result */
'.gp-result{text-align:center;padding:32px 20px;max-width:480px;margin:0 auto}'+
'.gp-result-emoji{font-size:72px;margin-bottom:8px}'+
'.gp-result-grade{font-size:18px;font-weight:900;color:var(--muted)}'+
'.gp-result-score{font-size:52px;font-weight:900;color:var(--violet);line-height:1}'+
'.gp-result-stars{font-size:24px;margin:6px 0}'+
'.gp-result-pct{font-size:16px;font-weight:700;color:var(--muted);margin-bottom:10px}'+
'.gp-result-msg{font-size:16px;font-weight:700;margin-bottom:14px;line-height:1.5}'+
'.gp-result-xp{background:#fef9c3;color:#854d0e;font-weight:800;border-radius:12px;padding:8px 20px;display:inline-block;margin-bottom:20px;font-size:16px}'+
'.gp-result-actions{display:flex;flex-direction:column;gap:10px;margin-top:16px}'+
'.gp-back-btn2{background:#f3eaff;color:var(--violet);font-weight:700}';

var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

/* ── Register view + expose handlers ─────────────── */
if(CZ._setViews) CZ._setViews({ gpractice: viewGpractice });
CZ._gpAnswer    = gpAnswer;
CZ._gpTile      = gpTile;
CZ._gpCheckOrder= gpCheckOrder;
CZ._gpNext      = gpNext;

})();

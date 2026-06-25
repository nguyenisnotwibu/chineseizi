/* =========================================================
   CHINESEIZI · images.js
   Ảnh minh hoạ THẬT (Wikipedia) cho từ vựng — không phải ảnh AI.
   Tự suy ra từ khoá tiếng Anh từ nghĩa của từ, tra ảnh đại diện
   trên Wikipedia. Từ trừu tượng (的, 了, 几…) sẽ tự ẩn.
   ========================================================= */
(function(){
"use strict";
var CZ=window.CZ||{};
var CED=CZ._ced||window.CZ_CEDICT||{};
var esc=CZ._esc||function(s){return String(s==null?'':s);};

var cache=null;
function loadCache(){ if(cache) return cache; try{ cache=JSON.parse(localStorage.getItem('cz_img')||'{}'); }catch(e){ cache={}; } return cache; }
function saveCache(){ try{ localStorage.setItem('cz_img',JSON.stringify(cache)); }catch(e){} }

/* Suy từ khoá tiếng Anh để tìm ảnh (ưu tiên nghĩa Anh CC-CEDICT) */
function keyword(s, entry){
  entry=entry||{};
  var en=(entry.en&&entry.en[0]) || (CED[s]&&CED[s][0]&&CED[s][0][1]) || '';
  if(!en) return null;
  en=String(en).replace(/\([^)]*\)/g,' ');         // bỏ phần ghi chú trong ngoặc
  en=en.split(/[;,\/]/)[0].toLowerCase().trim();
  en=en.replace(/^(used |to be |to |a |an |the |sb |sth )/,'').trim();
  en=en.replace(/["'‘’“”]/g,'').replace(/[^a-z\s-]/g,'').trim();
  if(!en) return null;
  var words=en.split(/\s+/);
  if(words.length>3) return null;          // câu/cụm dài → coi như trừu tượng, bỏ
  // bỏ một số từ ngữ pháp/trừu tượng phổ biến
  if(/^(of|to|in|on|and|or|not|very|this|that|measure|particle|prefix|surname|classifier)\b/.test(en)) return null;
  return words.slice(0,2).join(' ');
}

/* Tra ảnh đại diện trên Wikipedia (CORS origin=*) */
function fetchWiki(term, cb){
  var c=loadCache();
  if(Object.prototype.hasOwnProperty.call(c,term)){ cb(c[term]||null); return; }
  var url='https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*'+
          '&prop=pageimages&piprop=thumbnail&pithumbsize=500&redirects=1&titles='+encodeURIComponent(term);
  fetch(url).then(function(r){ return r.json(); }).then(function(d){
    var img=null;
    try{ var pages=d.query.pages; for(var k in pages){ if(pages[k].thumbnail&&pages[k].thumbnail.source){ img=pages[k].thumbnail.source; break; } } }catch(e){}
    c[term]=img||0; saveCache(); cb(img);
  }).catch(function(){ cb(null); });
}

/* Render ảnh vào phần tử el. small=true cho flashcard (ảnh nhỏ) */
CZ.wordImage=function(el, s, entry, small){
  if(!el) return;
  var kw=keyword(s, entry);
  if(!kw){ el.style.display='none'; el.innerHTML=''; return; }
  el.style.display='';
  el.innerHTML='<div class="cz-img-load">🖼️ Đang tải ảnh minh hoạ…</div>';
  fetchWiki(kw, function(url){
    if(!url){ el.style.display='none'; el.innerHTML=''; return; }
    if(small){
      el.innerHTML='<img class="flash-img" src="'+url+'" alt="'+esc(kw)+'" referrerpolicy="no-referrer" loading="lazy" onerror="this.parentNode.style.display=\'none\'">';
    }else{
      el.innerHTML='<img class="cz-img" src="'+url+'" alt="'+esc(kw)+'" referrerpolicy="no-referrer" loading="lazy" onerror="this.parentNode.style.display=\'none\'">'+
        '<div class="cz-img-cap">📷 Ảnh minh hoạ: '+esc(kw)+' · nguồn Wikipedia</div>';
    }
  });
};

/* CSS bơm thẳng */
var css=
'.cz-img-wrap{margin-top:16px}'+
'.cz-img{width:100%;max-height:260px;object-fit:cover;border-radius:16px;display:block;box-shadow:var(--shadow);border:1px solid var(--line)}'+
'.cz-img-cap{font-size:11px;color:var(--muted);text-align:center;margin-top:6px}'+
'.cz-img-load{color:var(--muted);font-size:13px;padding:14px;text-align:center;background:var(--grad-soft);border-radius:14px}'+
'.flash-img{width:140px;height:104px;object-fit:cover;border-radius:14px;box-shadow:0 8px 20px -8px rgba(0,0,0,.3);border:2px solid #fff}';
var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

})();

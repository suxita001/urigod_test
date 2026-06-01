// URIGOD.GE — Global JS

// ── TRANSLATIONS ─────────────────────────────────
const TR = {
  ka:{
    nav_home:"მთავარი",nav_branches:"ფილიალები",nav_map:"რუკა",nav_about:"ჩვენს შესახებ",
    search_ph:"მოძებნეთ რესტორანი...",
    book_title:"მაგიდის ჯავშანი",book_branch:"ფილიალი",
    book_name:"სახელი / გვარი",book_phone:"ტელეფონი",book_email:"ელ-ფოსტა",
    book_date:"თარიღი",book_time:"დრო",book_guests:"სტუმრები",
    book_notes:"შენიშვნა",book_notes_ph:"სპეც. მოთხოვნა, დაბ. დღე...",
    book_cancel:"გაუქმება",book_submit:"📅 დაჯავშნა",book_sending:"იგზავნება...",
    book_ok:"ჯავშანი გაიგზავნა!",book_err:"შეცდომა. სცადეთ ხელახლა.",
    open:"● ღიაა",closed:"● დახურ.",branch_lbl:"ფილიალი",
    menu_btn:"მენიუ",book_btn:"ჯავშანი",see_more:"ნახე მეტი →",
    // Auth თარგმანები
    auth_title:"ავტორიზაცია", auth_login:"შესვლა", auth_reg:"რეგისტრაცია",
    auth_pass:"პაროლი", auth_pass_ph:"მინიმუმ 6 სიმბოლო",
    auth_verify_msg:"ვერიფიკაციის ლინკი გაიგზავნა თქვენს მეილზე. გთხოვთ დაადასტუროთ!",
    auth_unverified:"გთხოვთ, ჯერ დაადასტუროთ ელ-ფოსტა!",
    auth_success:"წარმატებული ავტორიზაცია!",
  },
  en:{
    nav_home:"Home",nav_branches:"Branches",nav_map:"Map",nav_about:"About",
    search_ph:"Search restaurant...",
    book_title:"Table Reservation",book_branch:"Branch",
    book_name:"Full Name",book_phone:"Phone",book_email:"Email",
    book_date:"Date",book_time:"Time",book_guests:"Guests",
    book_notes:"Notes",book_notes_ph:"Special request, birthday...",
    book_cancel:"Cancel",book_submit:"📅 Reserve",book_sending:"Sending...",
    book_ok:"Reservation sent!",book_err:"Error. Please try again.",
    open:"● Open",closed:"● Closed",branch_lbl:"Branch",
    menu_btn:"Menu",book_btn:"Reserve",see_more:"See more →",
    // Auth Translations
    auth_title:"Authentication", auth_login:"Login", auth_reg:"Register",
    auth_pass:"Password", auth_pass_ph:"Min. 6 characters",
    auth_verify_msg:"Verification link sent to your email. Please verify!",
    auth_unverified:"Please verify your email first!",
    auth_success:"Login successful!",
  }
};

let LANG  = localStorage.getItem('ug_lang')  || 'ka';
let THEME = localStorage.getItem('ug_theme') || 'dark';

function i18n(k){ return (TR[LANG]||TR.ka)[k]||k; }
window.i18n  = i18n;
window.LANG_GET = ()=>LANG;

function applyLang(){
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const v = i18n(el.dataset.i18n);
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA') el.placeholder=v;
    else el.textContent=v;
  });
  document.querySelectorAll('.lang-ka').forEach(b=>b.classList.toggle('active',LANG==='ka'));
  document.querySelectorAll('.lang-en').forEach(b=>b.classList.toggle('active',LANG==='en'));
}
function setLang(l){
  LANG=l; localStorage.setItem('ug_lang',l);
  applyLang();
  if(typeof window.rerender==='function') window.rerender();
}
window.setLang=setLang;

function applyTheme(){
  document.body.classList.toggle('light', THEME==='light');
  document.querySelectorAll('.theme-ico').forEach(el=>el.textContent=THEME==='dark'?'🌙':'☀️');
  if(typeof window.rerenderMap==='function') window.rerenderMap();
}
function toggleTheme(){
  THEME=THEME==='dark'?'light':'dark';
  localStorage.setItem('ug_theme',THEME);
  applyTheme();
}
window.toggleTheme=toggleTheme;

// nav active
function setNavActive(){
  const curr=window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-link').forEach(a=>{
    const h=(a.getAttribute('href')||'').split('/').pop().split('?')[0];
    a.classList.toggle('active',!!h&&curr===h);
  });
}

// search enter
document.addEventListener('keydown',e=>{
  if(e.key!=='Enter'||!e.target.matches('.nav-search input')) return;
  const q=e.target.value.trim(); if(!q) return;
  const depth=window.location.pathname.split('/').filter(Boolean).length;
  const base=depth>=2?'../../branches.html':'branches.html';
  window.location.href=`${base}?q=${encodeURIComponent(q)}`;
});

// ── TOAST ─────────────────────────────────────────
function showToast(icon,msg,type='ok'){
  let el=document.getElementById('_toast');
  if(!el){el=document.createElement('div');el.id='_toast';el.className='toast';el.innerHTML='<span class="t-ico"></span><span class="t-msg"></span>';document.body.appendChild(el);}
  el.className=`toast ${type}`;
  el.querySelector('.t-ico').textContent=icon;
  el.querySelector('.t-msg').textContent=msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t=setTimeout(()=>el.classList.remove('show'),4000);
}
window.showToast=showToast;

// ── FIREBASE AUTH SETUP ───────────────────────────
// ყურადღება: აქ ჩასვი შენი Firebase-ის მონაცემები!
const firebaseConfig = {
    apiKey: "AIzaSyDAWs0zeyyM2EF2Qtew4U-7turEovKr9x4",
    authDomain: "urigod-2e52c.firebaseapp.com",
    projectId: "urigod-2e52c",
    storageBucket: "urigod-2e52c.firebasestorage.app",
    messagingSenderId: "1022309835990",
    appId: "1:1022309835990:web:05e08a7741ed88bbc4d577",
    measurementId: "G-LE3NTT0TLH"
  };

// ვამოწმებთ არის თუ არა Firebase ჩატვირთული HTML-ში
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// გლობალური ცვლადი იუზერისთვის
let currentUser = null;
if (typeof firebase !== 'undefined') {
    firebase.auth().onAuthStateChanged(user => {
        if (user && user.emailVerified) {
            currentUser = user;
            // აქ შეგიძლიათ განაახლოთ UI (მაგ: აჩვენოთ იუზერის პროფილი, დამალოთ "შესვლის" ღილაკი)
            console.log("Logged in as: ", user.email);
        } else {
            currentUser = null;
            console.log("Not logged in or unverified");
        }
    });
}

// ── AUTH MODAL ────────────────────────────────────
function buildAuthModal(){
  if(document.getElementById('_auth_overlay')) return;
  document.body.insertAdjacentHTML('beforeend',`
<div class="modal-overlay" id="_auth_overlay" onclick="if(event.target===this)closeAuth()">
  <div class="modal">
    <div class="modal-head">
      <div>
        <div class="modal-title" data-i18n="auth_title">${i18n('auth_title')}</div>
      </div>
      <button class="modal-x" onclick="closeAuth()">✕</button>
    </div>
    
    <div style="display:flex; gap:10px; margin-bottom:20px; padding: 0 20px;">
        <button id="_auth_tab_login" class="btn btn-primary" style="flex:1;" onclick="toggleAuthMode('login')" data-i18n="auth_login">${i18n('auth_login')}</button>
        <button id="_auth_tab_reg" class="btn btn-ghost" style="flex:1;" onclick="toggleAuthMode('register')" data-i18n="auth_reg">${i18n('auth_reg')}</button>
    </div>

    <form id="_auth_form" class="modal-body" onsubmit="submitAuth(event)" novalidate>
      <input type="hidden" id="_auth_mode" value="login">
      
      <div class="form-group">
        <label class="form-label" data-i18n="book_email">${i18n('book_email')} *</label>
        <input type="email" id="_auth_email" class="form-input" required placeholder="mail@gmail.com">
      </div>
      
      <div class="form-group">
        <label class="form-label" data-i18n="auth_pass">${i18n('auth_pass')} *</label>
        <input type="password" id="_auth_pass" class="form-input" required data-i18n="auth_pass_ph" placeholder="${i18n('auth_pass_ph')}">
      </div>
    </form>
    
    <div class="modal-foot">
      <button class="btn btn-ghost" onclick="closeAuth()" data-i18n="book_cancel">${i18n('book_cancel')}</button>
      <button class="btn btn-primary" id="_auth_sub" type="submit" form="_auth_form" data-i18n="auth_login">${i18n('auth_login')}</button>
    </div>
  </div>
</div>`);
}

function openAuth() {
    buildAuthModal();
    const ov = document.getElementById('_auth_overlay');
    document.getElementById('_auth_form').reset();
    toggleAuthMode('login'); // ლოგინი დეფოლტად
    requestAnimationFrame(() => ov.classList.add('open'));
    document.body.style.overflow = 'hidden';
}

function closeAuth() {
    const el = document.getElementById('_auth_overlay');
    if(el) el.classList.remove('open');
    document.body.style.overflow = '';
}

function toggleAuthMode(mode) {
    document.getElementById('_auth_mode').value = mode;
    const tabLogin = document.getElementById('_auth_tab_login');
    const tabReg = document.getElementById('_auth_tab_reg');
    const subBtn = document.getElementById('_auth_sub');

    if (mode === 'login') {
        tabLogin.className = 'btn btn-primary';
        tabReg.className = 'btn btn-ghost';
        subBtn.textContent = i18n('auth_login');
    } else {
        tabLogin.className = 'btn btn-ghost';
        tabReg.className = 'btn btn-primary';
        subBtn.textContent = i18n('auth_reg');
    }
}

async function submitAuth(e) {
    e.preventDefault();
    if(typeof firebase === 'undefined') {
        showToast('❌', 'Firebase is not initialized!', 'err');
        return;
    }

    const email = document.getElementById('_auth_email').value.trim();
    const pass = document.getElementById('_auth_pass').value;
    const mode = document.getElementById('_auth_mode').value;
    const btn = document.getElementById('_auth_sub');

    if(!email || !pass) {
        showToast('⚠️', LANG==='en'?'Fill required fields':'შეავსეთ სავ. ველები', 'err');
        return;
    }

    btn.disabled = true;
    btn.textContent = '...';

    try {
        if (mode === 'register') {
            // რეგისტრაცია
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, pass);
            
            // ვერიფიკაციის გაგზავნა
            await userCredential.user.sendEmailVerification();
            
            // ვაგდებთ სისტემიდან სანამ არ დაადასტურებს
            await firebase.auth().signOut();
            
            showToast('✉️', i18n('auth_verify_msg'), 'ok');
            toggleAuthMode('login'); // გადავრთავთ ლოგინზე
            document.getElementById('_auth_form').reset();

        } else {
            // შესვლა
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, pass);
            
            // ვამოწმებთ დადასტურებულია თუ არა მეილი
            if (!userCredential.user.emailVerified) {
                await firebase.auth().signOut(); // დაუდასტურებელს ვაგდებთ
                showToast('⚠️', i18n('auth_unverified'), 'err');
            } else {
                showToast('✅', i18n('auth_success'), 'ok');
                closeAuth();
            }
        }
    } catch (err) {
        showToast('❌', err.message, 'err');
    } finally {
        btn.disabled = false;
        btn.textContent = mode === 'login' ? i18n('auth_login') : i18n('auth_reg');
    }
}

window.openAuth = openAuth;


// ── BOOKING MODAL ─────────────────────────────────
function buildModal(){
  if(document.getElementById('_bk_overlay')) return;
  document.body.insertAdjacentHTML('beforeend',`
<div class="modal-overlay" id="_bk_overlay" onclick="if(event.target===this)closeBooking()">
  <div class="modal">
    <div class="modal-head">
      <div>
        <div class="modal-title" data-i18n="book_title">${i18n('book_title')}</div>
        <div class="modal-sub" id="_bk_rname"></div>
      </div>
      <button class="modal-x" onclick="closeBooking()">✕</button>
    </div>
    <form id="_bk_form" class="modal-body" onsubmit="submitBooking(event)" novalidate>
      <div id="_bk_branch_row" class="form-group" style="display:none">
        <label class="form-label" data-i18n="book_branch">${i18n('book_branch')}</label>
        <select id="_bk_branch_sel" name="branch_id" class="form-select form-input"></select>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">${i18n('book_name')} *</label>
          <input type="text" name="name" class="form-input" required placeholder="გიორგი მაისურაძე">
        </div>
        <div class="form-group">
          <label class="form-label">${i18n('book_phone')} *</label>
          <input type="tel" name="phone" class="form-input" required placeholder="+995 5XX XXX XXX">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">${i18n('book_email')}</label>
        <input type="email" name="email" class="form-input" placeholder="mail@gmail.com">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">${i18n('book_date')} *</label>
          <input type="date" name="date" class="form-input" required min="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group">
          <label class="form-label">${i18n('book_time')} *</label>
          <input type="time" name="time" class="form-input" required>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">${i18n('book_guests')} *</label>
        <select name="guests" class="form-select form-input" required>
          <option value="">-- ${LANG==='en'?'Select':'აირჩიეთ'} --</option>
          ${[1,2,3,4,5,6,7,8].map(n=>`<option value="${n}">${n} ${LANG==='en'?'guests':'სტუმარი'}</option>`).join('')}
          <option value="9+">9+ ${LANG==='en'?'guests':'სტუმარი'}</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" data-i18n="book_notes">${i18n('book_notes')}</label>
        <textarea name="notes" class="form-textarea" data-i18n="book_notes_ph" placeholder="${i18n('book_notes_ph')}"></textarea>
      </div>
    </form>
    <div class="modal-foot">
      <button class="btn btn-ghost" onclick="closeBooking()" data-i18n="book_cancel">${i18n('book_cancel')}</button>
      <button class="btn btn-primary" id="_bk_sub" type="submit" form="_bk_form" data-i18n="book_submit">${i18n('book_submit')}</button>
    </div>
  </div>
</div>`);
}

function openBooking(rName, rEmail, branches, preId){
  buildModal();
  const ov=document.getElementById('_bk_overlay');
  ov.dataset.email=rEmail;
  const name=typeof rName==='object'?(LANG==='en'?rName.en:rName.ka):rName;
  ov.dataset.rname=name;
  document.getElementById('_bk_rname').textContent=name;

  const row=document.getElementById('_bk_branch_row');
  const sel=document.getElementById('_bk_branch_sel');
  if(branches && branches.length>1){
    row.style.display='block';
    sel.innerHTML=branches.map(b=>{
      const bn=typeof b.name==='object'?(LANG==='en'?b.name.en:b.name.ka):b.name;
      return `<option value="${b.id}"${preId===b.id?' selected':''}>${bn}</option>`;
    }).join('');
  } else if(branches && branches.length===1){
    row.style.display='none';
    sel.innerHTML=`<option value="${branches[0].id}"></option>`;
  } else { row.style.display='none'; }

  document.getElementById('_bk_form').reset();
  if(preId) sel.value=preId;
  document.querySelector('#_bk_form [name=date]').min=new Date().toISOString().split('T')[0];
  requestAnimationFrame(()=>ov.classList.add('open'));
  document.body.style.overflow='hidden';
}
function closeBooking(){
  const el=document.getElementById('_bk_overlay');
  if(el) el.classList.remove('open');
  document.body.style.overflow='';
}
async function submitBooking(e){
  e.preventDefault();
  const ov=document.getElementById('_bk_overlay');
  const data=Object.fromEntries(new FormData(e.target));
  if(!data.name||!data.phone||!data.date||!data.time||!data.guests){
    showToast('⚠️',LANG==='en'?'Fill required fields':'შეავსეთ სავ. ველები','err'); return;
  }
  const btn=document.getElementById('_bk_sub');
  btn.disabled=true; btn.textContent=i18n('book_sending');

  if(window.emailjs&&window.EMAILJS_SID&&window.EMAILJS_TID){
    try{
      await emailjs.send(window.EMAILJS_SID,window.EMAILJS_TID,{
        to_email:ov.dataset.email, restaurant:ov.dataset.rname,
        branch:data.branch_id||'', guest_name:data.name,
        guest_phone:data.phone, guest_email:data.email||'',
        date:data.date, time:data.time, guests:data.guests, notes:data.notes||'—'
      });
      showToast('✅',i18n('book_ok'),'ok'); closeBooking();
    } catch{ showToast('❌',i18n('book_err'),'err'); }
  } else {
    const subj=encodeURIComponent(`Reservation — ${ov.dataset.rname}`);
    const body=encodeURIComponent(`Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email||'—'}\nDate: ${data.date}\nTime: ${data.time}\nGuests: ${data.guests}\nBranch: ${data.branch_id||'—'}\nNotes: ${data.notes||'—'}`);
    window.open(`mailto:${ov.dataset.email}?subject=${subj}&body=${body}`,'_blank');
    showToast('✅',i18n('book_mailto')||'Mail opened','ok'); closeBooking();
  }
  btn.disabled=false; btn.textContent=i18n('book_submit');
}

// // მარჯვენა ღილაკის აკრძალვა
// document.addEventListener('contextmenu', event => event.preventDefault());

// // კოპირების (Ctrl+C) აკრძალვა
// document.addEventListener('keydown', e => {
//   if (e.ctrlKey && (e.key === 'c' || e.key === 'u')) {
//     e.preventDefault();
//     alert("კოპირება აკრძალულია URIGOD.GE-ს მიერ!");
//   }
// });

// // კლავიატურის კომბინაციების დაბლოკვა (F12, Ctrl+Shift+I, Ctrl+U)
// document.onkeydown = function(e) {
//     if(e.keyCode == 123) return false; // F12
//     if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false;
//     if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) return false;
//     if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) return false;
//     if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false; // View Source
// };

document.addEventListener('keydown',e=>{ 
    if(e.key==='Escape') {
        closeBooking(); 
        closeAuth(); 
    }
});
window.openBooking=openBooking; window.closeBooking=closeBooking; window.submitBooking=submitBooking;

// ── INIT ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{ applyTheme(); applyLang(); setNavActive(); });
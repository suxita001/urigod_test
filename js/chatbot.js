// ════════════════════════════════════════════════
// URIGOD.GE — AI Chatbot powered by Groq
// chatbot.js  v2.0
// ════════════════════════════════════════════════

(function () {
  'use strict';

  const API_URL = 'http://localhost:5000/chat';

  const L   = () => document.documentElement.lang === 'en' ? 'en' : 'ka';
  const t   = (ka, en) => L() === 'ka' ? ka : en;
  const tl  = (o) => { if (!o || typeof o === 'string') return o || ''; return (L()==='en' ? o.en : o.ka) || o.ka || ''; };
  const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  function getRestaurants() {
    return typeof RESTAURANTS !== 'undefined' ? RESTAURANTS : [];
  }

  // ── Build system prompt with full restaurant data ────────
  function buildSystemPrompt() {
    const rs = getRestaurants();
    const lang = L();

    const dbText = rs.map(r => {
      const branches = r.branches.map(b =>
        `    - ${tl(b.name)}: ${tl(b.address)}, ${b.hours}, ${b.status === 'open' ? 'ღიაა' : 'დახურულია'}`
      ).join('\n');
      return `• ${tl(r.name)} (${tl(r.cuisine)}) | რეიტინგი: ${r.rating}★ | საათები: ${r.hours} | ტელ: ${r.phone}
  ფილიალები:\n${branches}`;
    }).join('\n\n');

    if (lang === 'ka') {
      return `შენ ხარ URIGOD.GE-ის AI ასისტენტი — ჭკვიანი, მეგობრული, და ქართული.
შენი მიზანია მომხმარებელს დაეხმარო სწორი რესტორნის, ფილიალის ან კერძის პოვნაში.

ყოველთვის ქართულად პასუხობ. პასუხები მოკლე და ზუსტია.
როდესაც რესტორანს გირჩევ, ახსენი რატომ — კუხნია, რეიტინგი, ადგილმდებარეობა.
თუ მომხმარებელი ბიუჯეტს ახსენებს, გაითვალისწინე.
თუ კონკრეტული რესტორანი ვერ მოიძებნა, გაგვიზიარე ყველაზე ახლოს მდგომი.

=== URIGOD.GE-ის რესტორნების ბაზა ===
${dbText}
=====================================

მნიშვნელოვანი: მხოლოდ ამ ბაზაში არსებული რესტორნები გირჩიე. 
სხვა რამეზე კითხვის შემთხვევაში, ეცადე კონტექსტი კვებასთან/რესტორნებთან დაუკავშირო.`;
    } else {
      return `You are the AI assistant for URIGOD.GE — smart, friendly, and helpful.
Your goal is to help users find the right restaurant, branch, or dish.

Always respond in English. Keep answers concise and accurate.
When recommending a restaurant, explain why — cuisine, rating, location.
If the user mentions a budget, take it into account.
If no exact match, suggest the closest option.

=== URIGOD.GE Restaurant Database ===
${dbText}
======================================

Important: Only recommend restaurants from this database.
For off-topic questions, try to connect back to food/restaurants.`;
    }
  }

  // ── Conversation history ─────────────────────────────────
  let history = [];

  async function askGroq(userText) {
    history.push({ role: 'user', content: userText });

    const body = {
      system: buildSystemPrompt(),
      messages: history,
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const reply = data.reply || '';
      history.push({ role: 'assistant', content: reply });
      return reply;
    } catch (e) {
      return t(
        '❌ სერვერთან კავშირი ვერ მოხერხდა. შეამოწმე Python სერვერი.',
        '❌ Could not connect to server. Please check the Python server.'
      );
    }
  }

  // ── Find restaurant objects mentioned in AI reply ────────
  function findMentionedRestaurants(text) {
    const rs = getRestaurants();
    return rs.filter(r => {
      const name = tl(r.name).toLowerCase();
      return text.toLowerCase().includes(name);
    }).slice(0, 3);
  }

  // ── DOM state ────────────────────────────────────────────
  let winEl, msgsEl, formEl;
  let isOpen = false;
  let hasSubmitted = false;

  // ── UI helpers ───────────────────────────────────────────
  function scrollBot() { if (msgsEl) msgsEl.scrollTop = msgsEl.scrollHeight; }

  function showBadge() { document.getElementById('_cb_badge')?.classList.add('show'); }
  function hideBadge() { document.getElementById('_cb_badge')?.classList.remove('show'); }

  function addUser(text) {
    const div = document.createElement('div');
    div.className = 'cb-msg user';
    div.innerHTML = `<div class="cb-bubble">${esc(text)}</div><div class="cb-avi">👤</div>`;
    msgsEl.appendChild(div);
    scrollBot();
  }

  function addBot(text, cards) {
    const div = document.createElement('div');
    div.className = 'cb-msg bot';
    const html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    div.innerHTML = `<div class="cb-avi">🍽️</div><div class="cb-bubble">${html}</div>`;
    msgsEl.appendChild(div);

    if (cards && cards.length) {
      cards.forEach(r => msgsEl.appendChild(buildCard(r)));
    }
    scrollBot();
    if (!isOpen) showBadge();
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'cb-msg bot'; div.id = '_cb_typing';
    div.innerHTML = `<div class="cb-avi">🍽️</div><div class="cb-bubble"><div class="cb-dots"><span></span><span></span><span></span></div></div>`;
    msgsEl.appendChild(div);
    scrollBot();
  }

  function removeTyping() {
    document.getElementById('_cb_typing')?.remove();
  }

  function addQuickReplies(labels) {
    const div = document.createElement('div');
    div.className = 'cb-msg bot';
    div.innerHTML = `<div class="cb-avi" style="visibility:hidden">🍽️</div><div style="flex:1"><div class="cb-qrs">${
      labels.map(l => `<button class="cb-qr">${esc(l)}</button>`).join('')
    }</div></div>`;
    msgsEl.appendChild(div);
    div.querySelectorAll('.cb-qr').forEach((btn, i) => {
      btn.onclick = () => {
        div.remove();
        const inp = document.getElementById('_cb_free_in');
        if (inp) { inp.value = labels[i]; }
        window._cbFreeSubmit();
      };
    });
    scrollBot();
  }

  function buildCard(r) {
    const ka    = L() === 'ka';
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    const pre   = depth >= 2 ? '../../' : '';
    const name  = tl(r.name);
    const cui   = tl(r.cuisine);

    const card = document.createElement('div');
    card.className = 'cb-msg bot';
    card.style.animation = 'cbIn .35s cubic-bezier(.34,1.3,.64,1) both';

    const imgHtml = r.cover
      ? `<img class="cb-card-img" src="${r.cover}" alt="${name}" loading="lazy" onerror="this.parentNode.innerHTML='<div class=\\'cb-card-no-img\\'>${r.emoji}</div>'">`
      : `<div class="cb-card-no-img">${r.emoji}</div>`;

    card.innerHTML = `
      <div class="cb-avi" style="visibility:hidden">🍽️</div>
      <div class="cb-card" style="flex:1;max-width:86%">
        ${imgHtml}
        <div class="cb-card-body">
          <div class="cb-card-top">
            <div class="cb-card-name">${name}</div>
            <div class="cb-card-rating">★ ${r.rating}</div>
          </div>
          <div class="cb-card-meta">
            ${cui}<br>
            🕐 ${r.hours} · 📍 ${r.branches?.length || 1} ${ka ? 'ფილიალი' : 'branch(es)'}
          </div>
          <div class="cb-card-actions">
            <a href="${pre}restaurants/${r.slug}/index.html" class="cb-card-btn p">
              ${ka ? 'ნახვა' : 'View'} →
            </a>
            <a href="${pre}restaurants/${r.slug}/menu.html" class="cb-card-btn g">
              🍽️ ${ka ? 'მენიუ' : 'Menu'}
            </a>
          </div>
        </div>
      </div>`;
    return card;
  }

  // ── Send message ─────────────────────────────────────────
  async function sendMessage(text) {
    if (!text.trim()) return;

    // Special client-side shortcuts
    if (/map|ruka|რუკა|რუკაზე/i.test(text)) {
      addUser(text);
      addBot(t('კარგი, რუკაზე:','Sure, here\'s the map:'));
      const depth = window.location.pathname.split('/').filter(Boolean).length;
      setTimeout(() => window.location.href = (depth >= 2 ? '../../' : '') + 'map.html', 800);
      return;
    }
    if (/start over|თავიდან|ხელახლა|გასუფთავება/i.test(text)) {
      history = [];
      addUser(text);
      msgsEl.innerHTML = '';
      addBot(t('კარგი, თავიდან დავიწყოთ! 🍽️','Sure, let\'s start over! 🍽️'));
      return;
    }

    addUser(text);
    showTyping();

    const reply = await askGroq(text);
    removeTyping();

    // Find any restaurant cards to show alongside reply
    const cards = findMentionedRestaurants(reply);
    addBot(reply, cards);

    addQuickReplies([
      t('სხვა ვარიანტი', 'Show more options'),
      t('რუკაზე ნახვა', 'View on map'),
      t('დაჯავშნა', 'Make a reservation'),
      t('გასუფთავება', 'Start over'),
    ]);
  }

  // ── Form submit ──────────────────────────────────────────
  window._cbSubmit = () => {
    const food   = document.getElementById('_cb_food')?.value?.trim() || '';
    const budget = document.getElementById('_cb_budget')?.value?.trim() || '';
    const people = document.querySelector('.cb-pnum.sel')?.textContent?.trim() || '';
    const extras = [];
    if (document.querySelector('[onchange*="delivery"]:checked'))   extras.push(t('კურიერი','delivery'));
    if (document.querySelector('[onchange*="wine"]:checked'))       extras.push(t('ღვინო','wine'));
    if (document.querySelector('[onchange*="vegetarian"]:checked')) extras.push(t('ვეგეტარიანული','vegetarian'));
    if (document.querySelector('[onchange*="outdoor"]:checked'))    extras.push(t('ტერასა','outdoor'));
    if (document.querySelector('[onchange*="liveMusic"]:checked'))  extras.push(t('ცოცხალი მუსიკა','live music'));

    const parts = [];
    if (food)           parts.push(`"${food}"`);
    if (budget)         parts.push(t(`ბიუჯეტი ${budget}₾/კაცი`, `budget ${budget}₾/p`));
    if (people)         parts.push(t(`${people} კაცი`, `${people} people`));
    if (extras.length)  parts.push(extras.join(', '));

    const userMsg = parts.join(' · ') || t('ნებისმიერი რესტორანი', 'any restaurant');

    // Build natural query for AI
    let aiQuery = food || t('რესტორანი','restaurant');
    if (budget) aiQuery += t(` ბიუჯეტი ${budget}₾ ერთ კაცზე`, `, budget ${budget}₾ per person`);
    if (people) aiQuery += t(` ${people} კაცისთვის`, ` for ${people} people`);
    if (extras.length) aiQuery += `, ${extras.join(', ')}`;

    if (!hasSubmitted) {
      hasSubmitted = true;
      document.querySelector('.cb-form-panel').style.display = 'none';
      document.getElementById('_cb_free_row').style.display = 'flex';
      setTimeout(() => document.getElementById('_cb_free_in')?.focus(), 100);
    }

    sendMessage(aiQuery);
  };

  window._cbFreeSubmit = () => {
    const inp = document.getElementById('_cb_free_in');
    const txt = inp?.value?.trim() || '';
    if (!txt) return;
    if (inp) inp.value = '';

    if (!hasSubmitted) {
      hasSubmitted = true;
      document.querySelector('.cb-form-panel').style.display = 'none';
      document.getElementById('_cb_free_row').style.display = 'flex';
    }

    sendMessage(txt);
  };

  // ── Input helpers (unchanged) ────────────────────────────
  window._cbFoodInput = v => {};
  window._cbFoodTag   = (btn, val) => {
    document.querySelectorAll('#_cb_food_tags .cb-tag').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    const inp = document.getElementById('_cb_food');
    if (inp) inp.value = val;
  };
  window._cbBudget  = v => {};
  window._cbPeople  = (btn) => {
    document.querySelectorAll('.cb-pnum').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
  };
  window._cbCheck = () => {};

  // ── Open / close ─────────────────────────────────────────
  function toggle() { isOpen ? close() : open(); }
  function open()   {
    isOpen = true;
    winEl.classList.add('open');
    document.getElementById('_cb_t')?.classList.add('open');
    hideBadge();
    setTimeout(scrollBot, 100);
  }
  function close()  {
    isOpen = false;
    winEl.classList.remove('open');
    document.getElementById('_cb_t')?.classList.remove('open');
  }

  // ── Build DOM ────────────────────────────────────────────
  function buildFormHTML() {
    const ka = L() === 'ka';
    return `
    <div class="cb-form-panel">
      <div class="cb-form-inner">
        <div class="cb-fl">
          <div class="cb-fl-lbl">${ka?'🍽️ რა გსურთ მიირთვათ?':'🍽️ What do you want to eat?'}</div>
          <input class="cb-ti" id="_cb_food" type="text"
            placeholder="${ka?'მაგ. სუში, ხინკალი, ბურგერი...':'e.g. sushi, khinkali, burger...'}"
            oninput="window._cbFoodInput(this.value)"
            onkeydown="if(event.key==='Enter')window._cbSubmit()">
          <div class="cb-tags" id="_cb_food_tags">
            ${['🥟 ხინკალი','🍣 სუში','🫕 ქართული','🍕 პიცა','🍔 ბურგერი','🌯 შაურმა'].map((v,i)=>{
              const vals=['ხინკალი','სუში','ქართული','პიცა','ბურგერი','შაურმა'];
              return `<button class="cb-tag" onclick="window._cbFoodTag(this,'${vals[i]}')">${v}</button>`;
            }).join('')}
          </div>
        </div>
        <div class="cb-fl">
          <div class="cb-fl-lbl">${ka?'💰 ბიუჯეტი ერთ კაცზე (₾)?':'💰 Budget per person (₾)?'}</div>
          <div class="cb-budget">
            <input class="cb-ti" id="_cb_budget" type="number" min="0" max="500"
              placeholder="${ka?'მაგ. 30':'e.g. 30'}" oninput="window._cbBudget(this.value)">
            <span class="cb-budget-lari">₾</span>
          </div>
        </div>
        <div class="cb-fl">
          <div class="cb-fl-lbl">${ka?'👥 რამდენი ადამიანი?':'👥 Group size?'}</div>
          <div class="cb-people">
            ${['1','2','3','4','5','6+'].map(v=>
              `<button class="cb-pnum" onclick="window._cbPeople(this)">${v}</button>`
            ).join('')}
          </div>
        </div>
        <div class="cb-fl">
          <div class="cb-fl-lbl">${ka?'✅ დამატებითი მოთხოვნები?':'✅ Extras?'}</div>
          <div class="cb-checks">
            <label class="cb-chk"><input type="checkbox" onchange="window._cbCheck('delivery',this.checked)"> ${ka?'🚀 კურიერი':'🚀 Delivery'}</label>
            <label class="cb-chk"><input type="checkbox" onchange="window._cbCheck('wine',this.checked)"> ${ka?'🍷 ღვინო':'🍷 Wine'}</label>
            <label class="cb-chk"><input type="checkbox" onchange="window._cbCheck('vegetarian',this.checked)"> ${ka?'🌿 ვეგეტარიანული':'🌿 Vegetarian'}</label>
            <label class="cb-chk"><input type="checkbox" onchange="window._cbCheck('outdoor',this.checked)"> ${ka?'🌿 ტერასა':'🌿 Outdoor'}</label>
            <label class="cb-chk"><input type="checkbox" onchange="window._cbCheck('liveMusic',this.checked)"> ${ka?'🎵 ცოცხალი მუსიკა':'🎵 Live music'}</label>
          </div>
        </div>
      </div>
      <div class="cb-form-foot">
        <button class="cb-submit" onclick="window._cbSubmit()">
          🔍 ${ka?'მოძებნა':'Find restaurants'}
        </button>
      </div>
    </div>
    <div class="cb-free" style="display:none" id="_cb_free_row">
      <input class="cb-free-in" id="_cb_free_in" type="text"
        placeholder="${ka?'კიდევ გჭირდებათ რამე?':'Need anything else?'}"
        onkeydown="if(event.key==='Enter')window._cbFreeSubmit()">
      <button class="cb-free-btn" onclick="window._cbFreeSubmit()">➤</button>
    </div>`;
  }

  function build() {
    if (document.getElementById('_cb_t')) return;

    const trig = document.createElement('button');
    trig.id = '_cb_t'; trig.className = 'cb-trigger';
    trig.title = t('რესტორნის ძიება','Find a restaurant');
    trig.innerHTML = `<span>🍽️</span><span class="cb-badge" id="_cb_badge"></span>`;
    trig.onclick = toggle;
    document.body.appendChild(trig);

    const win = document.createElement('div');
    win.id = '_cb_w'; win.className = 'cb-window';
    win.innerHTML = `
      <div class="cb-header">
        <div class="cb-avatar">🍽️</div>
        <div class="cb-hinfo">
          <div class="cb-hname" id="_cb_hn">${t('URIGOD ასისტენტი','URIGOD Assistant')}</div>
          <div class="cb-hstatus" id="_cb_hs">${t('AI · ყოველთვის მზად','AI · Always ready')}</div>
        </div>
        <button class="cb-hclose" onclick="window._cbClose()" title="close">✕</button>
      </div>
      <div class="cb-messages" id="_cb_msgs"></div>
      <div id="_cb_form">${buildFormHTML()}</div>`;
    document.body.appendChild(win);
    winEl  = win;
    msgsEl = win.querySelector('#_cb_msgs');
    formEl = win.querySelector('#_cb_form');
    window._cbClose = close;

    setTimeout(() => {
      addBot(t(
        'გამარჯობა! 👋 შეავსეთ ფორმა ან პირდაპირ მომწერეთ — AI დაგეხმარებათ საუკეთესო რესტორნის პოვნაში! 🍽️',
        'Hello! 👋 Fill the form or just type — AI will help you find the perfect restaurant! 🍽️'
      ));
    }, 350);
  }

  // Lang sync
  const _origSet = window.setLang;
  window.setLang = function(l) {
    if (_origSet) _origSet(l);
    const hn = document.getElementById('_cb_hn');
    const hs = document.getElementById('_cb_hs');
    if (hn) hn.textContent = t('URIGOD ასისტენტი','URIGOD Assistant');
    if (hs) hs.textContent = t('AI · ყოველთვის მზად','AI · Always ready');
    if (!hasSubmitted && formEl) formEl.innerHTML = buildFormHTML();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    setTimeout(build, 0);
  }

})();
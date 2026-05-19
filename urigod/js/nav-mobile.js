/* ════════════════════════════════════════════════
   URIGOD.GE — Mobile Nav Hamburger
   nav-mobile.js  →  js/ ფოლდერში

   ჩართვა ყველა HTML-ში </body>-მდე:
   root:       <script src="js/nav-mobile.js"></script>
   restaurant: <script src="../../js/nav-mobile.js"></script>
   ════════════════════════════════════════════════ */

(function() {
  function initMobileNav() {
    const nav = document.querySelector('.nav-inner');
    if (!nav || document.querySelector('.nav-hamburger')) return;

    // ── 1. Hamburger button ─────────────────────
    const burger = document.createElement('button');
    burger.className = 'nav-hamburger';
    burger.setAttribute('aria-label', 'მენიუ');
    burger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(burger);

    // ── 2. Mobile dropdown menu ─────────────────
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'nav-mobile-menu';

    // collect links from .nav-links
    const desktopLinks = document.querySelector('.nav-links');
    const links = desktopLinks ? desktopLinks.querySelectorAll('a') : [];

    links.forEach(a => {
      const clone = a.cloneNode(true);
      mobileMenu.appendChild(clone);
    });

    // divider + lang/theme
    if (links.length) {
      const div = document.createElement('div');
      div.className = 'nav-mobile-divider';
      mobileMenu.appendChild(div);
    }

    // lang + theme row
    const actionsRow = document.createElement('div');
    actionsRow.style.cssText = 'display:flex;align-items:center;gap:10px;padding:4px 14px';

    const langToggle = document.querySelector('.lang-toggle');
    const themeBtn   = document.querySelector('.theme-btn');
    if (langToggle) actionsRow.appendChild(langToggle.cloneNode(true));
    if (themeBtn)   actionsRow.appendChild(themeBtn.cloneNode(true));
    mobileMenu.appendChild(actionsRow);

    document.body.appendChild(mobileMenu);

    // ── 3. Toggle ───────────────────────────────
    let isOpen = false;

    function toggle() {
      isOpen = !isOpen;
      burger.classList.toggle('open', isOpen);
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', toggle);

    // close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', close);
    });

    // close on outside click
    document.addEventListener('click', e => {
      if (isOpen && !burger.contains(e.target) && !mobileMenu.contains(e.target)) close();
    });

    // close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();




































/* ════════════════════════════════════════════════════════
   URIGOD.GE  —  nav-mobile.js
   ჩართვა ყველა HTML-ში </body>-მდე:
     root:       <script src="js/nav-mobile.js"></script>
     restaurant: <script src="../../js/nav-mobile.js"></script>
   ════════════════════════════════════════════════════════ */

(function () {

  /* ── 1. Hamburger Nav ────────────────────────────── */
  function initHamburger() {
    const navInner = document.querySelector('.nav-inner');
    const navLinks = document.querySelector('.nav-links');
    if (!navInner || !navLinks || document.querySelector('.nav-hamburger')) return;

    /* Hamburger button */
    const burger = document.createElement('button');
    burger.className = 'nav-hamburger';
    burger.setAttribute('aria-label', 'მენიუ');
    burger.innerHTML = '<span></span><span></span><span></span>';
    navInner.appendChild(burger);

    /* Dropdown menu */
    const menu = document.createElement('div');
    menu.className = 'nav-mobile-menu';

    /* Clone nav links */
    navLinks.querySelectorAll('a').forEach(a => {
      menu.appendChild(a.cloneNode(true));
    });

    /* Divider */
    const div = document.createElement('div');
    div.className = 'nav-mobile-divider';
    menu.appendChild(div);

    /* Lang + theme */
    const actRow = document.createElement('div');
    actRow.className = 'nav-mobile-actions';
    const lang  = document.querySelector('.lang-toggle');
    const theme = document.querySelector('.theme-btn');
    if (lang)  actRow.appendChild(lang.cloneNode(true));
    if (theme) actRow.appendChild(theme.cloneNode(true));
    menu.appendChild(actRow);

    document.body.appendChild(menu);

    /* Toggle */
    let open = false;

    function close() {
      open = false;
      burger.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', () => {
      open = !open;
      burger.classList.toggle('open', open);
      menu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('click', e => {
      if (open && !burger.contains(e.target) && !menu.contains(e.target)) close();
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 768) close(); });
  }

  /* ── 2. Branches filter toggle (mobile only) ─────── */
  function initFilterToggle() {
    const panel = document.querySelector('.filter-panel');
    if (!panel || panel.dataset.mobileInit) return;
    panel.dataset.mobileInit = '1';

    const ttl = panel.querySelector('.filter-ttl');
    if (!ttl) return;

    /* Wrap all siblings of .filter-ttl into .filter-body */
    if (!panel.querySelector('.filter-body')) {
      const body = document.createElement('div');
      body.className = 'filter-body';
      let node = ttl.nextElementSibling;
      while (node) {
        const next = node.nextElementSibling;
        body.appendChild(node);
        node = next;
      }
      panel.appendChild(body);
    }

    /* Toggle on title click */
    ttl.addEventListener('click', () => {
      panel.classList.toggle('filter-open');
    });
  }

  /* ── 3. Apply only on mobile ──────────────────────── */
  function init() {
    initHamburger();
    if (window.innerWidth <= 768) {
      initFilterToggle();
    }
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) initFilterToggle();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
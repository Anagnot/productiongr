/* ============================================================
   PRODUCTION.GR — UI EXTRAS
   Cookies consent banner + Back-to-top button
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'production-gr-cookie-consent';
  var COOKIE_VERSION = '1';

  /* ----- Styles ------------------------------------------------ */
  var styles = '' +
    '.ui-back-to-top{' +
      'position:fixed;right:24px;bottom:24px;z-index:998;' +
      'width:48px;height:48px;border-radius:50%;border:0;' +
      'background:var(--color-orange,#E65C00);color:#fff;cursor:pointer;' +
      'display:flex;align-items:center;justify-content:center;' +
      'box-shadow:0 6px 24px rgba(60,60,60,0.18),0 2px 6px rgba(60,60,60,0.10);' +
      'opacity:0;visibility:hidden;transform:translateY(12px);' +
      'transition:opacity 220ms cubic-bezier(0.2,0.8,0.2,1),transform 220ms cubic-bezier(0.2,0.8,0.2,1),background 180ms cubic-bezier(0.2,0.8,0.2,1);' +
      'font-family:inherit;' +
    '}' +
    '.ui-back-to-top.is-visible{opacity:1;visibility:visible;transform:translateY(0);}' +
    '.ui-back-to-top:hover{background:var(--color-gray-4,#3c3c3c);}' +
    '.ui-back-to-top:focus-visible{outline:2px solid var(--color-orange,#E65C00);outline-offset:3px;}' +
    '.ui-back-to-top svg{width:18px;height:18px;display:block;}' +

    '.ui-cookie-banner{' +
      'position:fixed;left:24px;right:24px;bottom:24px;z-index:999;' +
      'max-width:560px;background:var(--color-gray-4,#3c3c3c);color:#fff;' +
      'border-radius:var(--radius-md,12px);padding:24px 28px;' +
      'box-shadow:0 24px 60px -12px rgba(0,0,0,0.35);' +
      'font-family:var(--font-sans,"Manrope",system-ui,sans-serif);' +
      'transform:translateY(140%);opacity:0;' +
      'transition:transform 320ms cubic-bezier(0.2,0.8,0.2,1),opacity 320ms cubic-bezier(0.2,0.8,0.2,1);' +
    '}' +
    '.ui-cookie-banner.is-visible{transform:translateY(0);opacity:1;}' +
    '.ui-cookie-banner h6{' +
      'font-family:var(--font-mono,"Roboto Mono",monospace);font-weight:700;' +
      'font-size:11px;letter-spacing:0.12em;text-transform:uppercase;' +
      'margin:0 0 10px;color:var(--color-yellow,#ffc815);' +
    '}' +
    '.ui-cookie-banner p{' +
      'font-size:14px;line-height:1.55;margin:0 0 18px;' +
      'color:rgba(255,255,255,0.85);' +
    '}' +
    '.ui-cookie-banner p a{color:var(--color-yellow,#ffc815);text-decoration:underline;text-underline-offset:3px;}' +
    '.ui-cookie-banner .ui-cookie-actions{display:flex;gap:10px;flex-wrap:wrap;}' +
    '.ui-cookie-banner button{' +
      'font-family:var(--font-mono,"Roboto Mono",monospace);font-weight:700;' +
      'font-size:11px;letter-spacing:0.12em;text-transform:uppercase;' +
      'padding:11px 18px;border-radius:var(--radius-pill,999px);cursor:pointer;' +
      'border:1px solid transparent;transition:background 180ms cubic-bezier(0.2,0.8,0.2,1),color 180ms cubic-bezier(0.2,0.8,0.2,1),border-color 180ms cubic-bezier(0.2,0.8,0.2,1);' +
    '}' +
    '.ui-cookie-banner .ui-cookie-accept{background:var(--color-orange,#E65C00);color:#fff;}' +
    '.ui-cookie-banner .ui-cookie-accept:hover{background:var(--color-yellow,#ffc815);color:var(--color-gray-4,#3c3c3c);}' +
    '.ui-cookie-banner .ui-cookie-reject{background:transparent;color:#fff;border-color:rgba(255,255,255,0.3);}' +
    '.ui-cookie-banner .ui-cookie-reject:hover{border-color:#fff;background:rgba(255,255,255,0.08);}' +
    '@media (max-width: 600px){' +
      '.ui-cookie-banner{left:12px;right:12px;bottom:12px;padding:20px;}' +
      '.ui-back-to-top{right:14px;bottom:14px;width:44px;height:44px;}' +
    '}' +
    '@media (prefers-reduced-motion: reduce){' +
      '.ui-back-to-top,.ui-cookie-banner{transition:none;}' +
    '}';

  function injectStyles() {
    var style = document.createElement('style');
    style.setAttribute('data-ui-extras', '');
    style.textContent = styles;
    document.head.appendChild(style);
  }

  /* ----- Cookie consent ---------------------------------------- */
  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed && parsed.v === COOKIE_VERSION) return parsed;
      return null;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(status) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        v: COOKIE_VERSION,
        status: status,
        ts: Date.now()
      }));
    } catch (e) { /* storage unavailable — silently degrade */ }
  }

  function buildCookieBanner() {
    var banner = document.createElement('div');
    banner.className = 'ui-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Συγκατάθεση cookies');
    banner.innerHTML =
      '<h6>Cookies &amp; ιδιωτικότητα</h6>' +
      '<p>Χρησιμοποιούμε cookies για τη βελτίωση της εμπειρίας σας και για ανάλυση επισκεψιμότητας. ' +
      'Μπορείτε να αποδεχθείτε ή να απορρίψετε τα προαιρετικά cookies. ' +
      'Δείτε την <a href="#" data-ui-cookie-policy>πολιτική cookies</a>.</p>' +
      '<div class="ui-cookie-actions">' +
        '<button type="button" class="ui-cookie-accept">Αποδοχή</button>' +
        '<button type="button" class="ui-cookie-reject">Απόρριψη</button>' +
      '</div>';

    document.body.appendChild(banner);

    requestAnimationFrame(function () {
      banner.classList.add('is-visible');
    });

    function dismiss(status) {
      writeConsent(status);
      banner.classList.remove('is-visible');
      setTimeout(function () {
        if (banner.parentNode) banner.parentNode.removeChild(banner);
      }, 360);
    }

    banner.querySelector('.ui-cookie-accept').addEventListener('click', function () {
      dismiss('accepted');
    });
    banner.querySelector('.ui-cookie-reject').addEventListener('click', function () {
      dismiss('rejected');
    });
  }

  function initCookies() {
    if (readConsent()) return;
    if (document.body) {
      buildCookieBanner();
    } else {
      document.addEventListener('DOMContentLoaded', buildCookieBanner);
    }
  }

  /* ----- Back to top ------------------------------------------- */
  function buildBackToTop() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ui-back-to-top';
    btn.setAttribute('aria-label', 'Επιστροφή στην κορυφή');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M12 19V5"/>' +
        '<path d="M5 12l7-7 7 7"/>' +
      '</svg>';

    document.body.appendChild(btn);

    var threshold = 480;
    var visible = false;
    var ticking = false;

    function update() {
      var shouldShow = window.pageYOffset > threshold;
      if (shouldShow !== visible) {
        visible = shouldShow;
        btn.classList.toggle('is-visible', visible);
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    btn.addEventListener('click', function () {
      var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  function initBackToTop() {
    if (document.body) {
      buildBackToTop();
    } else {
      document.addEventListener('DOMContentLoaded', buildBackToTop);
    }
  }

  /* ----- Mobile nav (hamburger + fullscreen drawer) ------------- */
  function initMobileNav() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var headerContainer = header.querySelector('.container');
    var nav = header.querySelector('.site-nav');
    if (!headerContainer || !nav) return;
    if (header.querySelector('.menu-btn')) return; // already injected

    // 1) inject burger button (responsive.css shows/hides it ≤920px)
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-btn';
    btn.setAttribute('aria-label', 'Άνοιγμα μενού');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'ui-mobile-drawer');
    btn.innerHTML =
      '<span class="bars" aria-hidden="true">' +
        '<span></span><span></span><span></span>' +
      '</span>';
    headerContainer.appendChild(btn);

    // 2) build drawer
    var drawer = document.createElement('div');
    drawer.id = 'ui-mobile-drawer';
    drawer.className = 'mobile-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Μενού πλοήγησης');
    drawer.setAttribute('aria-hidden', 'true');

    // Head — clone logo
    var logoLink = header.querySelector('.logo');
    var head = document.createElement('div');
    head.className = 'drawer-head';
    if (logoLink) {
      var clonedLogo = logoLink.cloneNode(true);
      clonedLogo.classList.add('logo');
      head.appendChild(clonedLogo);
    }
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'close-btn';
    closeBtn.setAttribute('aria-label', 'Κλείσιμο μενού');
    head.appendChild(closeBtn);
    drawer.appendChild(head);

    // Body — clone primary nav links (skip .lang-switch and .cta)
    var body = document.createElement('div');
    body.className = 'drawer-body';
    var navLinks = nav.querySelectorAll(':scope > a:not(.cta)');
    navLinks.forEach(function (a) {
      var link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      if (a.classList.contains('active')) link.classList.add('active');
      body.appendChild(link);
    });
    drawer.appendChild(body);

    // Foot — CTA + language switch
    var foot = document.createElement('div');
    foot.className = 'drawer-foot';

    var ctaLink = nav.querySelector(':scope > a.cta');
    if (ctaLink) {
      var clonedCta = document.createElement('a');
      clonedCta.href = ctaLink.getAttribute('href');
      clonedCta.className = 'cta primary';
      clonedCta.textContent = ctaLink.textContent.trim();
      foot.appendChild(clonedCta);
    }

    var langSwitch = nav.querySelector('.lang-switch');
    if (langSwitch) {
      var langRow = document.createElement('div');
      langRow.className = 'lang-row';
      langRow.setAttribute('aria-label', 'Γλώσσα');
      var langItems = langSwitch.querySelectorAll('.menu a');
      langItems.forEach(function (item) {
        var copy = document.createElement('a');
        copy.href = item.getAttribute('href') || '#';
        var labelNode = item.querySelector('.label');
        copy.textContent = labelNode ? labelNode.textContent.trim() : item.textContent.trim();
        if (item.classList.contains('active')) copy.classList.add('active');
        langRow.appendChild(copy);
      });
      foot.appendChild(langRow);
    }

    drawer.appendChild(foot);
    document.body.appendChild(drawer);

    // 3) wire open/close behavior
    function close() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Άνοιγμα μενού');
      document.body.classList.remove('no-scroll');
    }
    function open() {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Κλείσιμο μενού');
      document.body.classList.add('no-scroll');
    }
    btn.addEventListener('click', function () {
      if (drawer.classList.contains('open')) close(); else open();
    });
    closeBtn.addEventListener('click', close);
    // close on link click (in case of hash navigation that doesn't unload)
    body.addEventListener('click', function (e) {
      if (e.target && (e.target.tagName === 'A' || (e.target.closest && e.target.closest('a')))) {
        close();
      }
    });
    foot.addEventListener('click', function (e) {
      if (e.target && (e.target.tagName === 'A' || (e.target.closest && e.target.closest('a')))) {
        close();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) close();
    });
    // close drawer if user resizes back up to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 920 && drawer.classList.contains('open')) close();
    });
  }

  /* ----- Boot -------------------------------------------------- */
  function boot() {
    injectStyles();
    initMobileNav();
    initBackToTop();
    initCookies();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

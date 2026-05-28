/* ============================================================
   PRODUCTION.GR — ANIMATION BEHAVIOR
   ============================================================ */
(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Still apply reveal classes so layout is correct; just skip the JS-driven counter & marquee.
    document.querySelectorAll('.p-reveal').forEach(function (el) { el.classList.add('p-in'); });
    return;
  }

  /* ---------- 1. Page-load entrance cascade for hero/page-hero ---------- */
  var heroSelectors = [
    '.hero .eyebrow', '.hero h1', '.hero .lede', '.hero .actions', '.hero .meta-row', '.hero .stage',
    '.page-hero .crumbs', '.page-hero h1', '.page-hero .lede', '.page-hero .stats-line', '.page-hero .right',
    '.case-hero .crumbs', '.case-hero h1', '.case-hero .lede', '.case-meta',
    '.wizard-shell .crumbs', '.wizard-shell h1', '.wizard-shell .lede', '.wizard-shell .save-state', '.progress-strip'
  ].join(',');

  var heroEls = document.querySelectorAll(heroSelectors);
  heroEls.forEach(function (el, i) {
    el.classList.add('p-enter');
    el.style.animationDelay = (i * 70) + 'ms';
  });

  /* ---------- 2. Auto-tag reveal targets, then observe ---------- */
  var revealSelectors = [
    'section .section-head',
    '.services-grid > *',
    '.work-grid > *',
    '.process-step',
    '.reasons-grid > *',
    '.mat',
    '.sub-type',
    '.mvp-grid > *',
    '.values-grid > *',
    '.archetype-grid > *',
    '.ms',
    '.channels-grid > *',
    '.industries-grid > *',
    '.pillar',
    '.stat',
    '.product',
    '.testimonials-grid > *',
    '.personas-grid > *',
    '.about-strip .visual',
    '.about-strip > div:not(.visual)',
    '.facility',
    '.cap-grid .c',
    '.matrix-band .matrix',
    '.svc-cat .left',
    '.svc-cat .sub',
    '.cert',
    '.info-card',
    '.gallery .img',
    '.timeline-grid .step',
    '.specs-table .row',
    '.case-meta .m',
    '.spec-strip .s',
    '.uni-grid .work-card',
    '.featured-row .featured-card',
    '.related-grid .tile',
    '.team-grid .person',
    '.milestones-grid .ms',
    '.clients-wall-grid .c',
    '.results-grid .r',
    '.bigvisual .frame',
    '.cta-block h2',
    '.cta-block .cta',
    '.materials-list .m',
    '.story h2',
    '.story p',
    '.story .pull',
    '.story .sig-block',
    '.page-grid > .page-card'
  ];

  var revealEls = document.querySelectorAll(revealSelectors.join(','));
  revealEls.forEach(function (el) { el.classList.add('p-reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('p-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    revealEls.forEach(function (el) { io.observe(el); });

    /* Stagger groups: parents of multi-child grids */
    var groupSelectors = [
      '.services-grid', '.reasons-grid', '.process-steps', '.industries-grid',
      '.channels-grid', '.work-grid', '.stats-grid', '.product-grid',
      '.values-grid', '.archetype-grid', '.mvp-grid', '.cap-grid',
      '.milestones-grid', '.team-grid', '.related-grid', '.timeline-grid',
      '.uni-grid', '.case-meta', '.spec-strip', '.results-grid',
      '.testimonials-grid', '.personas-grid', '.clients-wall-grid',
      '.facilities-grid', '.matrix-band .head', '.page-grid'
    ];
    document.querySelectorAll(groupSelectors.join(',')).forEach(function (g) {
      g.classList.add('p-stagger');
      var groupIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('p-in');
            groupIo.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -5% 0px', threshold: 0.08 });
      groupIo.observe(g);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('p-in'); });
  }

  /* ---------- 3. Stat counter on intersect ---------- */
  function animateNumber(el) {
    var html = el.innerHTML;
    // Match first numeric run (supports ranges like "40–50" — animate the first number only)
    var match = html.match(/(\d+[.,]?\d*)/);
    if (!match) return;
    var targetStr = match[1];
    var target = parseFloat(targetStr.replace(',', '.'));
    if (isNaN(target) || target === 0) return;

    var hasDecimal = targetStr.indexOf('.') > -1 || targetStr.indexOf(',') > -1;
    var start = performance.now();
    var dur = 1100;

    el.classList.add('p-counting');

    function frame(now) {
      var t = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      var cur = target * eased;
      var display = hasDecimal ? cur.toFixed(1) : Math.round(cur).toString();
      el.innerHTML = html.replace(/(\d+[.,]?\d*)/, display);
      if (t < 1) requestAnimationFrame(frame);
      else {
        el.innerHTML = html; // restore original (preserves <em> etc.)
        el.classList.remove('p-counting');
      }
    }
    requestAnimationFrame(frame);
  }

  var statSelectors = [
    '.stat .num',
    '.reasons-grid .r .metric .v',
    '.page-hero .stats-line .s .v',
    '.results-grid .r .v',
    '.summary .estimate .v'
  ];
  document.querySelectorAll(statSelectors.join(',')).forEach(function (s) {
    if (!('IntersectionObserver' in window)) return;
    var started = false;
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !started) {
          started = true;
          animateNumber(e.target);
          so.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    so.observe(s);
  });

  /* ---------- 4. Clients marquee — duplicate row contents and wrap in track ---------- */
  function setupMarquee(row) {
    if (row.dataset.marqueeReady === '1') return;
    var items = Array.prototype.slice.call(row.children);
    if (items.length === 0) return;

    var track = document.createElement('div');
    track.className = 'p-marquee-track';
    items.forEach(function (item) { track.appendChild(item); });
    // Duplicate for seamless loop
    items.forEach(function (item) { track.appendChild(item.cloneNode(true)); });

    // Convert grid layout to marquee
    row.style.display = 'block';
    row.style.gap = '';
    row.classList.add('p-marquee-wrap');
    row.appendChild(track);
    row.dataset.marqueeReady = '1';
  }

  // Apply to all .clients-row blocks (home + about uses .clients-wall-grid which we leave static — it's a grid, not a row)
  document.querySelectorAll('.clients-row').forEach(setupMarquee);

  /* ---------- 5. Wizard step content — already CSS-animated; ensure clicks feel smooth ---------- */
  // (Handled in inline page script via setStep; CSS keyframes do the visual.)

})();

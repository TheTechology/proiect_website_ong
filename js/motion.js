/* ============================================================
   Grupul Verde — premium motion layer
   Scroll progress · reveals (variants + stagger) · counters ·
   data bars · parallax · custom cursor · magnetic buttons ·
   kinetic hero · page-load fade.
   Loaded AFTER site.js (which injects chrome).
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine   = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  /* ============ PAGE-LOAD FADE ============ */
  var intro = document.createElement("div");
  intro.className = "page-intro";
  intro.innerHTML = '<span class="pi-brand">Grupul Verde<span class="pi-dot"></span></span>';
  document.body.appendChild(intro);
  function dropIntro() { intro.classList.add("gone"); setTimeout(function () { if (intro.parentNode) intro.parentNode.removeChild(intro); }, 700); }
  window.addEventListener("load", function () { setTimeout(dropIntro, reduce ? 0 : 420); });
  setTimeout(dropIntro, 2200); // safety

  /* ============ SCROLL PROGRESS ============ */
  var prog = document.createElement("div");
  prog.className = "scroll-progress";
  document.body.appendChild(prog);
  function setProg() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
    prog.style.transform = "scaleX(" + p + ")";
  }

  /* ============ STAGGER SETUP ============ */
  document.querySelectorAll("[data-stagger]").forEach(function (c) {
    var step = parseInt(c.getAttribute("data-stagger"), 10) || 90;
    var i = 0;
    Array.prototype.forEach.call(c.children, function (ch) {
      if (ch.classList.contains("reveal")) { ch.style.transitionDelay = (i * step) + "ms"; i++; }
    });
  });

  /* ============ REVEAL / COUNTER / BAR ============ */
  function animateCounter(el) {
    if (el._done) return; el._done = true;
    var to = parseFloat(el.getAttribute("data-to"));
    var dec = (to % 1 !== 0) ? 1 : 0;
    var dur = 1700, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      var val = to * eased;
      el.textContent = dec ? val.toFixed(1) : Math.round(val).toLocaleString("ro-RO");
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = dec ? to.toFixed(1) : Math.round(to).toLocaleString("ro-RO");
    }
    requestAnimationFrame(step);
  }

  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var counters  = Array.prototype.slice.call(document.querySelectorAll("[data-to]"));
  var bars      = Array.prototype.slice.call(document.querySelectorAll(".bar-fill[data-w]"));

  function inView(el, m) {
    var r = el.getBoundingClientRect();
    var h = window.innerHeight || document.documentElement.clientHeight;
    return r.top < h - (m || 70) && r.bottom > 0;
  }
  function revealTick() {
    var i;
    for (i = revealEls.length - 1; i >= 0; i--) if (inView(revealEls[i])) { revealEls[i].classList.add("in"); revealEls.splice(i, 1); }
    for (i = counters.length - 1; i >= 0; i--) if (inView(counters[i], 0)) { animateCounter(counters[i]); counters.splice(i, 1); }
    for (i = bars.length - 1; i >= 0; i--) if (inView(bars[i], 0)) { bars[i].style.width = bars[i].getAttribute("data-w"); bars.splice(i, 1); }
  }

  if (reduce) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
    counters.forEach(function (el) { el.textContent = parseFloat(el.getAttribute("data-to")).toLocaleString("ro-RO"); });
    bars.forEach(function (el) { el.style.width = el.getAttribute("data-w"); });
  } else {
    revealTick();
    setTimeout(revealTick, 280);
    setTimeout(function () { revealEls.forEach(function (el) { el.classList.add("in"); }); }, 2600); // safety net
  }

  /* ============ KINETIC HERO ============ */
  var kin = document.querySelector(".kinetic");
  if (kin) {
    var ws = kin.querySelectorAll(".w");
    ws.forEach(function (w, i) { w.style.transitionDelay = reduce ? "0ms" : (i * 75 + 250) + "ms"; });
    requestAnimationFrame(function () { setTimeout(function () { kin.classList.add("in"); }, reduce ? 0 : 120); });
  }

  /* ============ PARALLAX ============ */
  var parEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  function parallaxTick() {
    if (reduce) return;
    var vh = window.innerHeight;
    parEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0.12;
      var center = r.top + r.height / 2;
      var off = center - vh / 2;
      el.style.transform = "translate3d(0," + (-off * speed).toFixed(1) + "px,0)";
    });
  }

  /* ============ SCROLL LOOP ============ */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { setProg(); if (!reduce) revealTick(); parallaxTick(); ticking = false; });
  }
  setProg(); parallaxTick();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { setProg(); revealTick(); parallaxTick(); });
  window.addEventListener("load", function () { setProg(); revealTick(); parallaxTick(); });

  /* ============ CUSTOM CURSOR ============ */
  if (fine && !reduce) {
    var dot = document.createElement("div"); dot.className = "cursor-dot";
    var ring = document.createElement("div"); ring.className = "cursor-ring";
    document.body.appendChild(dot); document.body.appendChild(ring);
    var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my, active = false;
    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px)";
      if (!active) { active = true; document.body.classList.add("has-cursor"); }
    });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      requestAnimationFrame(loop);
    })();
    var hoverSel = "a,button,.pillar,.way,.proj,.amt,.funder,.case-card,.phase,.feat,.info-card,.mega-link,input,textarea";
    document.addEventListener("mouseover", function (e) { if (e.target.closest(hoverSel)) document.body.classList.add("cursor-hover"); });
    document.addEventListener("mouseout", function (e) { if (e.target.closest(hoverSel)) document.body.classList.remove("cursor-hover"); });
    window.addEventListener("mouseleave", function () { document.body.classList.remove("has-cursor"); });
    window.addEventListener("mouseenter", function () { document.body.classList.add("has-cursor"); });
  }

  /* ============ MAGNETIC BUTTONS ============ */
  if (fine && !reduce) {
    document.querySelectorAll(".btn-primary, .btn-xl, .magnetic").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        b.style.transform = "translate(" + (x * 0.22).toFixed(1) + "px," + (y * 0.32).toFixed(1) + "px) scale(1.05)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }
})();

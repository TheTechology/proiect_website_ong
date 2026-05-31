/* ============================================================
   Grupul Verde — shared chrome + bilingual engine (RO/EN)
   Injects topbar + nav + footer, wires interactions, handles
   language switching with persistence.
   ============================================================ */
(function () {
  "use strict";

  var PAGES = {
    home:     { href: "index.html",    ro: "Acasă",        en: "Home" },
    programe: { href: "programe.html",  ro: "Programe",     en: "Programs" },
    impact:   { href: "impact.html",    ro: "Impact",       en: "Impact" },
    parteneri:{ href: "parteneri.html", ro: "Parteneri",    en: "Partners" },
    centrul:  { href: "centrul.html",   ro: "Centrul 2035", en: "2035 Centre" },
    contact:  { href: "contact.html",   ro: "Contact",      en: "Contact" },
    doneaza:  { href: "doneaza.html",   ro: "Donează",      en: "Donate" }
  };

  var PILLARS = [
    { href: "program-digital.html", icon: "cpu",     nRo: "Pilon 01", nEn: "Pillar 01", tRo: "Educație digitală & AI", tEn: "Digital education & AI", dRo: "Cisco NetAcad, Code.org, robotică Marty, AI literacy.", dEn: "Cisco NetAcad, Code.org, Marty robotics, AI literacy." },
    { href: "program-mediu.html",   icon: "leaf",    nRo: "Pilon 02", nEn: "Pillar 02", tRo: "Mediu & biodiversitate", tEn: "Environment & biodiversity", dRo: "BGCI, iNaturalist, Natura 2000, expediții în Subcarpați.", dEn: "BGCI, iNaturalist, Natura 2000, expeditions in the Subcarpathians." },
    { href: "program-gen.html",     icon: "venus",   nRo: "Pilon 03", nEn: "Pillar 03", tRo: "Tineret, gen & activism", tEn: "Youth, gender & activism", dRo: "55% fete în cohorte. WECF. Erasmus+. Justiție climatică.", dEn: "55% girls in cohorts. WECF. Erasmus+. Climate justice." },
    { href: "program-rural.html",   icon: "map-pin", nRo: "Pilon 04", nEn: "Pillar 04", tRo: "Comunități rurale", tEn: "Rural communities", dRo: "38+ școli · 11 localități. Parteneriat ISJ Vrancea.", dEn: "38+ schools · 11 localities. ISJ Vrancea partnership." }
  ];

  var current = document.body.getAttribute("data-page") || "";
  function de(en) { return ' data-en="' + en.replace(/"/g, "&quot;") + '"'; }

  /* ---------- TOP BAR ---------- */
  var topbar = '' +
    '<div class="topbar"><div class="wrap">' +
      '<span class="tb"><span class="pulse"></span><span' + de("Active since <strong>2021</strong>") + '>Activi din <strong>2021</strong></span></span>' +
      '<span class="sep">·</span>' +
      '<span class="tb">Adjud, Vrancea · 46.10°N 27.17°E</span>' +
      '<span class="tb-right">' +
        '<span class="tb"' + de("UNESCO ID <strong>407</strong> · Nominated") + '>UNESCO ID <strong>407</strong> · Nominalizat</span>' +
        '<span class="tb">CIF 44109108</span>' +
      '</span>' +
    '</div></div>';

  /* ---------- NAV ---------- */
  function navLink(key) {
    var p = PAGES[key];
    var active = key === current ? " active" : "";
    return '<a class="nav-link' + active + '"' + de(p.en) + ' href="' + p.href + '">' + p.ro + '</a>';
  }

  var megaHTML = '' +
    '<div class="mega">' +
      '<div class="mega-grid">' +
        PILLARS.map(function (p) {
          return '<a class="mega-link" href="' + p.href + '">' +
            '<span class="mega-ic"><i data-lucide="' + p.icon + '"></i></span>' +
            '<span><span class="n"' + de(p.nEn) + '>' + p.nRo + '</span>' +
            '<span class="t"' + de(p.tEn) + '>' + p.tRo + '</span>' +
            '<span class="d"' + de(p.dEn) + '>' + p.dRo + '</span></span></a>';
        }).join("") +
      '</div>' +
      '<a class="mega-foot" href="programe.html">' +
        '<span><span class="mf-t"' + de("All programs") + '>Toate programele</span>' +
        '<span class="mf-d"' + de("Four interdependent pillars") + '>Patru piloni care depind unul de altul</span></span>' +
        '<i data-lucide="arrow-right"></i>' +
      '</a>' +
    '</div>';

  var programActive = (current === "programe" || current.indexOf("program-") === 0) ? " active" : "";

  var nav = '' +
    '<div class="nav-shell"><nav class="nav">' +
      '<a class="brand" href="index.html" aria-label="Asociația Grupul Verde — acasă"><img class="brand-logo" src="assets/logo.png" alt="Asociația Grupul Verde"></a>' +
      '<div class="nav-links">' +
        navLink("home") +
        '<div class="nav-item">' +
          '<a class="nav-link' + programActive + '"' + de("Programs") + ' href="programe.html">Programe ' +
          '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m6 9 6 6 6-6"/></svg></a>' +
          megaHTML +
        '</div>' +
        navLink("impact") +
        navLink("parteneri") +
        navLink("centrul") +
        navLink("contact") +
      '</div>' +
      '<div class="nav-spacer"></div>' +
      '<div class="lang"><button data-lang="ro">RO</button><button data-lang="en">EN</button></div>' +
      '<a class="btn btn-primary nav-cta"' + de("Donate") + ' href="doneaza.html">Donează</a>' +
      '<button class="nav-burger" aria-label="Meniu"><i data-lucide="menu"></i></button>' +
    '</nav></div>';

  /* ---------- MOBILE MENU ---------- */
  var mobileLinks = ["home", "programe", "impact", "parteneri", "centrul", "contact"].map(function (k) {
    return '<a' + de(PAGES[k].en) + ' href="' + PAGES[k].href + '">' + PAGES[k].ro + '</a>';
  }).join("");
  var mobile = '' +
    '<div class="mobile-menu" id="mobileMenu">' +
      '<div class="mm-top">' +
        '<span class="brand"><img class="brand-mark" src="assets/logo-mark.png" alt="">Grupul Verde</span>' +
        '<button class="mm-close" aria-label="Închide"><i data-lucide="x"></i></button>' +
      '</div>' +
      '<div class="mm-lang lang"><button data-lang="ro">RO</button><button data-lang="en">EN</button></div>' +
      mobileLinks +
      '<a class="btn btn-primary btn-lg mm-cta"' + de("Give a Bit of Oxygen") + ' href="doneaza.html">Oferă un Bit de Oxigen</a>' +
    '</div>';

  /* ---------- FOOTER ---------- */
  var footer = '' +
    '<footer class="site-footer"><div class="wrap">' +
      '<div class="footer-top">' +
        '<div>' +
          '<div class="brand"><img class="brand-mark" src="assets/logo-mark.png" alt="">Grupul Verde</div>' +
          '<p class="footer-desc"' + de("An NGO from Adjud turning pixels into oxygen — digital education and climate action for the youth of Vrancea, since 2021.") + '>Un ONG din Adjud care transformă pixelii în oxigen — educație digitală și acțiune climatică pentru tinerii din Vrancea, din 2021.</p>' +
          '<div class="footer-badges">' +
            '<span class="chip dark">UNESCO ID 407</span>' +
            '<span class="chip dark">Cisco NetAcad</span>' +
            '<span class="chip dark">CIF 44109108</span>' +
          '</div>' +
        '</div>' +
        '<div class="fcol"><h5' + de("Programs") + '>Programe</h5>' +
          '<a href="program-digital.html"' + de("Digital education & AI") + '>Educație digitală & AI</a>' +
          '<a href="program-mediu.html"' + de("Environment & biodiversity") + '>Mediu & biodiversitate</a>' +
          '<a href="program-gen.html"' + de("Youth, gender & activism") + '>Tineret, gen & activism</a>' +
          '<a href="program-rural.html"' + de("Rural communities") + '>Comunități rurale</a>' +
        '</div>' +
        '<div class="fcol"><h5' + de("Organisation") + '>Organizație</h5>' +
          '<a href="impact.html"' + de("Impact & numbers") + '>Impact & cifre</a>' +
          '<a href="parteneri.html"' + de("Partners & UNESCO") + '>Parteneri & UNESCO</a>' +
          '<a href="centrul.html"' + de("2035 Centre") + '>Centrul 2035</a>' +
          '<a href="contact.html">Contact</a>' +
        '</div>' +
        '<div class="fcol"><h5' + de("Action") + '>Acțiune</h5>' +
          '<a href="doneaza.html"' + de("Donate") + '>Donează</a>' +
          '<a href="contact.html"' + de("Volunteer") + '>Voluntariat</a>' +
          '<a href="contact.html"' + de("Partnership") + '>Parteneriat</a>' +
          '<a href="https://grupulverde.ro/" target="_blank" rel="noopener">grupulverde.ro</a>' +
        '</div>' +
      '</div>' +
      '<div class="footer-legal">' +
        '<span>© 2026 Asociația Grupul Verde · Adjud, Vrancea</span>' +
        '<div class="fl-right">' +
          '<a href="#"' + de("Privacy policy") + '>Politica de confidențialitate</a>' +
          '<a href="#"' + de("Transparency") + '>Transparență</a>' +
          '<a href="contact.html">Contact</a>' +
        '</div>' +
      '</div>' +
    '</div></footer>';

  /* ---------- INJECT ---------- */
  var mountTop = document.getElementById("site-top");
  if (mountTop) mountTop.innerHTML = topbar + nav + mobile;
  var mountFoot = document.getElementById("site-footer");
  if (mountFoot) mountFoot.innerHTML = footer;

  /* ---------- MEGA MENU ---------- */
  var navItem = document.querySelector(".nav-item");
  if (navItem) {
    var closeTimer;
    navItem.addEventListener("mouseenter", function () { clearTimeout(closeTimer); navItem.classList.add("open"); });
    navItem.addEventListener("mouseleave", function () { closeTimer = setTimeout(function () { navItem.classList.remove("open"); }, 140); });
  }

  /* ---------- MOBILE MENU ---------- */
  var burger = document.querySelector(".nav-burger");
  var mm = document.getElementById("mobileMenu");
  if (burger && mm) {
    burger.addEventListener("click", function () { mm.classList.add("open"); document.body.style.overflow = "hidden"; });
    mm.querySelector(".mm-close").addEventListener("click", function () { mm.classList.remove("open"); document.body.style.overflow = ""; });
    mm.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { mm.classList.remove("open"); document.body.style.overflow = ""; }); });
  }

  /* ---------- ICONS ---------- */
  function drawIcons() { if (window.lucide && window.lucide.createIcons) window.lucide.createIcons(); }
  drawIcons();

  /* ============================================================
     BILINGUAL ENGINE
     ============================================================ */
  function applyLang(lang) {
    document.documentElement.setAttribute("lang", lang);
    document.body.setAttribute("data-lang", lang);
    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (!("ro" in el.dataset)) el.dataset.ro = el.innerHTML;
      el.innerHTML = (lang === "en") ? el.getAttribute("data-en") : el.dataset.ro;
    });
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
    try { localStorage.setItem("gv-lang", lang); } catch (e) {}
    window.GV_LANG = lang;
    drawIcons();
    document.dispatchEvent(new CustomEvent("gv:lang", { detail: lang }));
  }
  window.gvApplyLang = applyLang;
  window.gvLang = function () { return window.GV_LANG || "ro"; };

  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); });
  });

  var saved = "ro";
  try { saved = localStorage.getItem("gv-lang") || "ro"; } catch (e) {}
  applyLang(saved);

  /* ---------- NAV SHADOW ON SCROLL ---------- */
  var navEl = document.querySelector(".nav");
  if (navEl) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 20) navEl.style.boxShadow = "var(--ring-1), 0 10px 34px rgba(14,15,12,0.10)";
      else navEl.style.boxShadow = "";
    }, { passive: true });
  }

  /* ---------- TOAST ---------- */
  var toastEl;
  window.gvToast = function (msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; document.body.appendChild(toastEl); }
    toastEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>' + msg;
    toastEl.classList.add("show");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 3400);
  };
})();

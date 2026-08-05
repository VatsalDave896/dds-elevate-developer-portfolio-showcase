(function(){
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "elevate-theme";

  /* ---------- THEME ENGINE ---------- */
  function applyTheme(theme, persist){
    root.setAttribute("data-theme", theme);
    if(persist){
      try{ localStorage.setItem(STORAGE_KEY, theme); }catch(e){}
    }
    document.querySelectorAll(".theme-opt").forEach(function(btn){
      var active = btn.getAttribute("data-theme-choice") === theme;
      btn.classList.toggle("is-active", active);
    });
    document.querySelectorAll(".theme-card").forEach(function(card){
      card.classList.toggle("is-active", card.getAttribute("data-preview-theme") === theme);
    });
  }

  function initTheme(){
    var saved = null;
    try{ saved = localStorage.getItem(STORAGE_KEY); }catch(e){}
    applyTheme(saved || "mint", false);
  }
  initTheme();

  var fab = document.getElementById("themeFab");
  var panel = document.getElementById("themePanel");

  function togglePanel(force){
    var open = typeof force === "boolean" ? force : !panel.classList.contains("is-open");
    panel.classList.toggle("is-open", open);
    fab.setAttribute("aria-expanded", String(open));
  }

  fab.addEventListener("click", function(){ togglePanel(); });

  document.addEventListener("click", function(e){
    if(!panel.contains(e.target) && !fab.contains(e.target)){
      togglePanel(false);
    }
  });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape") togglePanel(false);
  });

  document.querySelectorAll(".theme-opt").forEach(function(btn){
    btn.addEventListener("click", function(){
      applyTheme(btn.getAttribute("data-theme-choice"), true);
      togglePanel(false);
    });
  });

  /* theme preview cards: click a theme card to preview it live */
  document.querySelectorAll(".theme-card").forEach(function(card){
    card.addEventListener("click", function(){
      applyTheme(card.getAttribute("data-preview-theme"), true);
    });
  });

  /* ---------- NAV SCROLL STATE ---------- */
  var nav = document.getElementById("siteNav");
  var lastY = window.scrollY;
  function onScroll(){
    var y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 8);
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  /* ---------- SCROLL REVEAL ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.12, rootMargin:"0px 0px -60px 0px" });
    revealEls.forEach(function(el, i){
      el.style.transitionDelay = (Math.min(i % 6, 5) * 0.06) + "s";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function(el){ el.classList.add("is-visible"); });
  }

  /* safety net: never let content stay invisible if something goes wrong */
  window.setTimeout(function(){
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(function(el){
      el.classList.add("is-visible");
    });
  }, 4000);

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll(".faq-item").forEach(function(item){
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function(){
      var isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach(function(openItem){
        if(openItem !== item){
          openItem.classList.remove("is-open");
          openItem.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      item.classList.toggle("is-open", !isOpen);
      a.style.maxHeight = !isOpen ? (a.scrollHeight + "px") : null;
    });
  });

  /* ---------- PERFORMANCE RINGS ---------- */
  var rings = document.querySelectorAll(".perf-ring .fg");
  var ringsAnimated = false;
  function animateRings(){
    if(ringsAnimated) return;
    ringsAnimated = true;
    rings.forEach(function(circle){
      var r = circle.r.baseVal.value;
      var c = 2 * Math.PI * r;
      var score = parseFloat(circle.getAttribute("data-score")) || 100;
      circle.style.strokeDasharray = c;
      circle.style.strokeDashoffset = c;
      requestAnimationFrame(function(){
        circle.style.strokeDashoffset = c - (score/100) * c;
      });
    });
  }
  var perfSection = document.getElementById("performance");
  if(perfSection && "IntersectionObserver" in window){
    var perfIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ animateRings(); perfIo.disconnect(); }
      });
    }, { threshold:0.3 });
    perfIo.observe(perfSection);
  } else {
    animateRings();
  }

  /* ---------- CUSTOM CURSOR ---------- */
  var cursor = document.getElementById("cursorDot");
  if(cursor && window.matchMedia("(hover:hover) and (pointer:fine)").matches){
    window.addEventListener("mousemove", function(e){
      cursor.style.opacity = "1";
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    }, { passive:true });
    document.querySelectorAll("a, button").forEach(function(el){
      el.addEventListener("mouseenter", function(){
        cursor.style.width = "26px"; cursor.style.height = "26px";
      });
      el.addEventListener("mouseleave", function(){
        cursor.style.width = "10px"; cursor.style.height = "10px";
      });
    });
  }

  /* ---------- TRUST MARQUEE PAUSE ON HOVER ---------- */
  var track = document.querySelector(".trust-track");
  if(track){
    track.addEventListener("mouseenter", function(){ track.style.animationPlayState = "paused"; });
    track.addEventListener("mouseleave", function(){ track.style.animationPlayState = "running"; });
  }

  /* ---------- SMOOTH ANCHOR SCROLL OFFSET ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(link){
    link.addEventListener("click", function(e){
      var id = link.getAttribute("href");
      if(id.length < 2) return;
      var target = document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.pageYOffset - 84;
      window.scrollTo({ top:y, behavior:"smooth" });
    });
  });

})();

// index.js – simple, non-module, runs everywhere

(function () {
  var header = document.querySelector("header");
  var pages = document.querySelectorAll(".page");
  var navLinks = document.querySelectorAll("header nav a[href^='#']");
  var hamburger = document.querySelector(".hamburger");
  var navList = document.querySelector("nav ul");
  var scrollBtn = document.querySelector(".scroll-to-top");
  var root = document.documentElement;
  var homePage = document.getElementById("home");

  /* ---------- SPA PAGE SWITCHING ---------- */
  function setActivePageFromHash() {
    var hash = window.location.hash || "#home";
    hash = hash.split("?")[0]; // ignore ?item=...
    var id = hash.replace("#", "") || "home";

    pages.forEach(function (p) {
      p.classList.toggle("active", p.id === id);
    });
  }

  setActivePageFromHash();
  window.addEventListener("hashchange", setActivePageFromHash);

  /* ---------- NAV LINKS (close mobile menu on click) ---------- */
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href") || "";
      if (!href || href.charAt(0) !== "#") return;

      var base = href.split("?")[0];
      e.preventDefault();
      window.location.hash = base;

      if (window.innerWidth <= 767 && navList && hamburger) {
        navList.classList.remove("nav-active");
        hamburger.classList.remove("toggle-active");
        document.body.classList.remove("menu-open");
      }
    });
  });

  /* ---------- HAMBURGER MENU ---------- */
  if (hamburger && navList) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("toggle-active");
      navList.classList.toggle("nav-active");
      document.body.classList.toggle("menu-open");
    });
  }

  /* ---------- HEADER SCROLL + SCROLL TO TOP ---------- */
  function handleScroll() {
    if (header) {
      if (window.scrollY > 10) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }

    if (scrollBtn) {
      if (window.scrollY > 300) scrollBtn.classList.add("visible");
      else scrollBtn.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  if (scrollBtn) {
    scrollBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- HERO SPOTLIGHT EFFECT ---------- */
  if (homePage) {
    homePage.addEventListener("pointermove", function (e) {
      var rect = homePage.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      root.style.setProperty("--mouse-x", x + "%");
      root.style.setProperty("--mouse-y", y + "%");
    });
  }

  /* =======================================================
     HOME CLIENT LOGO MARQUEE – works on phone / tablet / laptop
     ======================================================= */
  var strip = document.querySelector(".home-clients-strip");
  var track = strip ? strip.querySelector(".home-clients-track") : null;

  if (strip && track) {
    var rows = Array.prototype.slice.call(
      track.querySelectorAll(".home-clients-row")
    );

    if (!rows.length) return;

    // Force one long horizontal track
    track.style.display = "flex";
    track.style.flexWrap = "nowrap";
    track.style.willChange = "transform";
    track.style.transform = "translateX(0px)";

    rows.forEach(function (row) {
      row.style.display = "flex";
      row.style.flexShrink = "0";
    });

    var x = 0;
    var lastTime = null;
    var SPEED = 40; // px per second

    function step(timestamp) {
      if (lastTime == null) lastTime = timestamp;
      var dt = (timestamp - lastTime) / 1000; // seconds
      lastTime = timestamp;

      var firstRowRect = rows[0].getBoundingClientRect();
      var rowWidth = firstRowRect.width;

      if (rowWidth > 0) {
        x -= SPEED * dt;

        // when first row has fully left, jump by its width
        if (-x >= rowWidth) {
          x += rowWidth;
        }

        track.style.transform = "translateX(" + x + "px)";
      }

      window.requestAnimationFrame(step);
    }

    // Start once images are ready (with a safety timeout for iOS)
    var imgs = track.querySelectorAll("img");
    if (!imgs.length) {
      window.requestAnimationFrame(step);
    } else {
      var loaded = 0;
      function maybeStart() {
        loaded++;
        if (loaded >= imgs.length) {
          window.requestAnimationFrame(step);
        }
      }

      imgs.forEach(function (img) {
        if (img.complete) {
          maybeStart();
        } else {
          img.addEventListener("load", maybeStart);
          img.addEventListener("error", maybeStart);
        }
      });

      // fallback in case some load events never fire on mobile
      setTimeout(function () {
        window.requestAnimationFrame(step);
      }, 1500);
    }
  }
})();

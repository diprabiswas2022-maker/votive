// index.js (Complete File)

(function () {
  var header = document.querySelector("header");
  var pages = document.querySelectorAll(".page");
  var navLinks = document.querySelectorAll("header nav a[href^='#']");
  var hamburger = document.querySelector(".hamburger");
  var navList = document.querySelector("nav ul");
  var scrollBtn = document.querySelector(".scroll-to-top");
  var root = document.documentElement;
  var homePage = document.getElementById("home");

  /* ---------------------- 1. SPA PAGE SWITCHING ---------------------- */

  function setActivePageFromHash() {
    var hash = window.location.hash || "#home";
    hash = hash.split("?")[0]; // ignore ?item=...
    var id = hash.replace("#", "") || "home";

    pages.forEach(function (p) {
      p.classList.toggle("active", p.id === id);
    });

    // Ensure body overflow is reset unless menu is open
    if (document.body.classList.contains("menu-open")) {
      // Keep menu-open state
    } else if (id === "home" && window.innerWidth <= 767) {
      // The CSS fix for mobile home page handles the overflow
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = '';
    }
  }

  setActivePageFromHash();
  window.addEventListener("hashchange", setActivePageFromHash);

  /* ---------------------- 2. NAV LINKS & MOBILE MENU ---------------------- */

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href") || "";
      if (!href || href.charAt(0) !== "#") return;

      var base = href.split("?")[0];
      e.preventDefault();
      window.location.hash = base;

      // Close mobile menu
      if (window.innerWidth <= 767 && navList && hamburger) {
        navList.classList.remove("nav-active");
        hamburger.classList.remove("toggle-active");
        document.body.classList.remove("menu-open");
      }
    });
  });

  if (hamburger && navList) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("toggle-active");
      navList.classList.toggle("nav-active");
      document.body.classList.toggle("menu-open");
    });
  }

  /* ---------------------- 3. HEADER SCROLL & SCROLL TO TOP ---------------------- */

  function handleScroll() {
    if (header) {
      if (window.scrollY > 10) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }

    // Scroll to top button logic (disabled by CSS override, but keep handler)
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

  /* ---------------------- 4. HERO SPOTLIGHT EFFECT ---------------------- */

  if (homePage) {
    homePage.addEventListener("pointermove", function (e) {
      var rect = homePage.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      root.style.setProperty("--mouse-x", x + "%");
      root.style.setProperty("--mouse-y", y + "%");
    });
  }

  /* ---------------------- 5. UNIVERSAL CLIENT LOGO MARQUEE ---------------------- */

  var strip = document.querySelector(".home-clients-strip");
  var track = strip ? strip.querySelector(".home-clients-track") : null;

  if (strip && track) {
    var rows = Array.prototype.slice.call(
      track.querySelectorAll(".home-clients-row")
    );

    if (!rows.length) return;

    // Initial setup for JS movement
    track.style.display = "flex";
    track.style.flexWrap = "nowrap"; // Crucial for movement
    track.style.willChange = "transform";
    track.style.transform = "translateX(0px)";
    track.style.animation = "none"; // Disable potential CSS animation

    rows.forEach(function (row) {
      row.style.display = "flex";
      row.style.flexShrink = "0";
    });

    var x = 0;
    var lastTime = null;
    var SPEED = 40; // px per second (Adjust this value to change scroll speed)

    function step(timestamp) {
      // Stop animation if user prefers reduced motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          window.requestAnimationFrame(step);
          return;
      }

      if (lastTime == null) lastTime = timestamp;
      var dt = (timestamp - lastTime) / 1000; // time elapsed in seconds
      lastTime = timestamp;

      var firstRowRect = rows[0].getBoundingClientRect();
      var rowWidth = firstRowRect.width;

      if (rowWidth > 0) {
        x -= SPEED * dt;

        // Loop the marquee when the first row is off-screen
        if (-x >= rowWidth) {
          x += rowWidth;
        }

        track.style.transform = "translateX(" + x + "px)";
      }

      window.requestAnimationFrame(step);
    }

    // Start the loop after checking image load status
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

      // Fallback timeout to ensure animation starts even with loading issues
      setTimeout(function () {
        if (loaded < imgs.length) {
             window.requestAnimationFrame(step);
        }
      }, 1500);
    }
  }
})();
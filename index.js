// index.js
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const pages = document.querySelectorAll(".page");
  const navLinks = document.querySelectorAll("header nav a[href^='#']");
  const hamburger = document.querySelector(".hamburger");
  const navList = document.querySelector("nav ul");
  const scrollBtn = document.querySelector(".scroll-to-top");
  const root = document.documentElement;
  const homePage = document.getElementById("home");

  /* ---------- SPA PAGE SWITCHING ---------- */
  function setActivePageFromHash() {
    let hash = window.location.hash || "#home";
    hash = hash.split("?")[0]; // ignore ?item=...
    const id = hash.replace("#", "") || "home";

    pages.forEach((p) => {
      p.classList.toggle("active", p.id === id);
    });
  }

  setActivePageFromHash();
  window.addEventListener("hashchange", setActivePageFromHash);

  /* ---------- NAV LINKS (close mobile menu on click) ---------- */
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return;

      const base = href.split("?")[0];
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
    hamburger.addEventListener("click", () => {
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
    scrollBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- HERO SPOTLIGHT EFFECT ---------- */
  if (homePage) {
    homePage.addEventListener("pointermove", (e) => {
      const rect = homePage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      root.style.setProperty("--mouse-x", `${x}%`);
      root.style.setProperty("--mouse-y", `${y}%`);
    });
  }

  /* =======================================================
     HOME CLIENT LOGO MARQUEE – works on laptop, tablet, phone
     ======================================================= */
  const strip = document.querySelector(".home-clients-strip");
  const track = strip ? strip.querySelector(".home-clients-track") : null;

  if (strip && track) {
    const rows = Array.from(track.querySelectorAll(".home-clients-row"));
    if (!rows.length) return;

    // make sure everything is laid out in one long row
    track.style.display = "flex";
    track.style.flexWrap = "nowrap";
    track.style.willChange = "transform";
    track.style.transform = "translateX(0px)";

    rows.forEach((row) => {
      row.style.flexShrink = "0";
      row.style.display = "flex";
    });

    let x = 0;
    let lastTime = null;
    const SPEED = 40; // px per second

    function step(timestamp) {
      if (lastTime == null) lastTime = timestamp;
      const dt = (timestamp - lastTime) / 1000; // seconds
      lastTime = timestamp;

      const rowWidth = rows[0].getBoundingClientRect().width;

      if (rowWidth > 0) {
        x -= SPEED * dt;

        // once the first row has fully left the screen, jump it to the end
        if (-x >= rowWidth) {
          x += rowWidth;
        }

        track.style.transform = `translateX(${x}px)`;
      }

      requestAnimationFrame(step);
    }

    // Start marquee after images are loaded OR after a small timeout
    const imgs = track.querySelectorAll("img");
    if (!imgs.length) {
      requestAnimationFrame(step);
    } else {
      let loaded = 0;
      const maybeStart = () => {
        loaded++;
        if (loaded >= imgs.length) {
          requestAnimationFrame(step);
        }
      };

      imgs.forEach((img) => {
        if (img.complete) {
          maybeStart();
        } else {
          img.addEventListener("load", maybeStart);
          img.addEventListener("error", maybeStart);
        }
      });

      // safety start in case some load events never fire (iOS quirk)
      setTimeout(() => requestAnimationFrame(step), 1500);
    }
  }
});

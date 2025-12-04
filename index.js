// app_votive.js

document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const header = document.querySelector("header");
  const pages = document.querySelectorAll(".page");
  const homeSection = document.getElementById("home");
  const navList = document.querySelector("nav ul");
  const navLinks = document.querySelectorAll("nav a[href^='#'], nav a[data-page]");
  const hamburger = document.querySelector(".hamburger");
  const scrollToTopBtn = document.querySelector(".scroll-to-top");

  /* ---------------------------
   * 1. SPA PAGE SWITCHING
   * --------------------------- */

  function setActivePage(pageId) {
    if (!pageId) return;

    pages.forEach((page) => {
      if (page.id === pageId) {
        page.classList.add("active");
      } else {
        page.classList.remove("active");
      }
    });

    // Close mobile menu whenever page changes
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: "instant" || "auto" });
  }

  // Default: find the page already marked as .active, or fall back to #home
  (function ensureInitialActivePage() {
    const active = document.querySelector(".page.active");
    if (!active && homeSection) {
      homeSection.classList.add("active");
    }
  })();

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      const dataPage = this.dataset.page;
      let targetId = null;

      if (dataPage) {
        targetId = dataPage;
      } else if (href && href.startsWith("#")) {
        targetId = href.replace("#", "");
      }

      // If the nav link is meant to switch SPA pages
      if (targetId && document.getElementById(targetId)) {
        e.preventDefault();
        setActivePage(targetId);
      }
    });
  });

  /* ---------------------------
   * 2. MOBILE HAMBURGER MENU
   * --------------------------- */

  function openMobileMenu() {
    if (!navList) return;
    navList.classList.add("nav-active");
    if (hamburger) hamburger.classList.add("toggle-active");
    body.classList.add("menu-open");
  }

  function closeMobileMenu() {
    if (!navList) return;
    navList.classList.remove("nav-active");
    if (hamburger) hamburger.classList.remove("toggle-active");
    body.classList.remove("menu-open");
  }

  if (hamburger && navList) {
    hamburger.addEventListener("click", function () {
      const isOpen = navList.classList.contains("nav-active");
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on any nav link click (mobile)
    navList.addEventListener("click", function (e) {
      if (e.target.matches("a")) {
        closeMobileMenu();
      }
    });
  }

  /* ---------------------------
   * 3. HEADER SCROLL STATE
   * --------------------------- */

  function handleScroll() {
    const scrolledClass = "scrolled";
    const threshold = 10;

    if (window.scrollY > threshold) {
      header && header.classList.add(scrolledClass);
    } else {
      header && header.classList.remove(scrolledClass);
    }

    if (scrollToTopBtn) {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("visible");
      } else {
        scrollToTopBtn.classList.remove("visible");
      }
    }
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------
   * 4. HERO SPOTLIGHT EFFECT
   * --------------------------- */

  if (homeSection) {
    homeSection.addEventListener("pointermove", function (e) {
      const rect = homeSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      homeSection.style.setProperty("--mouse-x", `${x}px`);
      homeSection.style.setProperty("--mouse-y", `${y}px`);
    });

    homeSection.addEventListener("pointerleave", function () {
      homeSection.style.removeProperty("--mouse-x");
      homeSection.style.removeProperty("--mouse-y");
    });
  }

  /* ---------------------------
   * 5. CONTACT BUTTONS → CONTACT PAGE
   * --------------------------- */

  function goToContactPage() {
    if (document.getElementById("contact")) {
      setActivePage("contact");
    }
  }

  const contactButtons = document.querySelectorAll(
    ".contact-button, .mobile-contact-button, .contact-banner-btn"
  );

  contactButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      // If it's a nav link with href="#contact" the SPA logic will handle it,
      // but we still ensure we don't navigate away
      if (this.tagName.toLowerCase() === "a") {
        const href = this.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
        }
      }
      goToContactPage();
    });
  });

  /* ---------------------------
   * 6. SERVICE DETAIL VIEW (optional safe default)
   * --------------------------- */

  const serviceCards = document.querySelectorAll("[data-service-detail-id]");
  const serviceDetailContainers = document.querySelectorAll(".service-detail-container");
  const backButtons = document.querySelectorAll(".back-button");

  function showServiceDetail(id) {
    serviceDetailContainers.forEach((box) => {
      if (box.id === id) {
        box.hidden = false;
      } else {
        box.hidden = true;
      }
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  serviceCards.forEach((card) => {
    card.addEventListener("click", function () {
      const detailId = this.dataset.serviceDetailId;
      if (detailId && document.getElementById(detailId)) {
        showServiceDetail(detailId);
      }
    });
  });

  backButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      serviceDetailContainers.forEach((box) => {
        box.hidden = true;
      });
      // Scroll back to main services top
      const servicesPage = document.getElementById("services");
      if (servicesPage) {
        setActivePage("services");
        servicesPage.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ---------------------------
   * 7. HOME CLIENT LOGO STRIP – JS MARQUEE (ALL DEVICES)
   * --------------------------- */

  (function initHomeLogoMarquee() {
    const strip = document.querySelector(".home-clients-strip");
    const track = document.querySelector(".home-clients-track");
    if (!strip || !track) return;

    // CLONE children once to create "double" content for seamless loop
    const originals = Array.from(track.children);
    originals.forEach((node) => {
      track.appendChild(node.cloneNode(true));
    });

    // Start + reset values
    let x = 0;
    let resetAt = 0;

    function computeReset() {
      // Reset distance = half total width (because we doubled the content)
      resetAt = track.scrollWidth / 2;
    }

    computeReset();
    window.addEventListener("resize", computeReset);

    // Speed based on viewport width (tweak as you like)
    function getSpeed() {
      const w = window.innerWidth;
      if (w < 768) return 0.3;  // mobile
      if (w < 1024) return 0.4; // tablet
      return 0.6;               // desktop
    }

    let speed = getSpeed();
    window.addEventListener("resize", () => {
      speed = getSpeed();
    });

    function step() {
      x -= speed;
      if (-x >= resetAt) {
        x = 0; // snap back with no visual gap
      }
      track.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);

    // Optional: pause on hover for pointer devices
    let paused = false;
    strip.addEventListener("mouseenter", () => {
      if (window.matchMedia("(hover: hover)").matches) {
        paused = true;
      }
    });
    strip.addEventListener("mouseleave", () => {
      paused = false;
    });

    // Slight adjustment: if you want true pause-on-hover, wrap step:
    (function animate() {
      if (!paused) {
        x -= speed;
        if (-x >= resetAt) x = 0;
        track.style.transform = `translateX(${x}px)`;
      }
      requestAnimationFrame(animate);
    })();
  })();
});

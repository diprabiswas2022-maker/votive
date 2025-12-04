// index.js

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector("header");
  const pages = document.querySelectorAll("main.page");
  const homeSection = document.getElementById("home");
  const navList = document.querySelector("header nav ul");
  const hamburger = document.querySelector(".hamburger");
  const scrollToTopLink = document.querySelector("a.scroll-to-top");

  /* ================================
   * 1. SPA PAGE HANDLING (HASH-BASED)
   * ================================ */

  function getPageIdFromHash(hash) {
    if (!hash) return "home";
    const clean = hash.startsWith("#") ? hash.slice(1) : hash;
    const [pageId] = clean.split("?");
    return pageId || "home";
  }

  function showPage(pageId) {
    pages.forEach((page) => {
      page.classList.toggle("active", page.id === pageId);
    });

    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function initFromLocation() {
    const pageId = getPageIdFromHash(window.location.hash);
    if (document.getElementById(pageId)) {
      showPage(pageId);
    } else {
      showPage("home");
    }
  }

  // Initial page
  initFromLocation();

  // React to hash changes (e.g. back button, footer links)
  window.addEventListener("hashchange", () => {
    const pageId = getPageIdFromHash(window.location.hash);
    if (document.getElementById(pageId)) {
      showPage(pageId);
    }
  });

  /* ===================================
   * 2. INTERNAL LINK HANDLING (NAV, ETC)
   * =================================== */

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href") || "";

    // Scroll-to-top link
    if (link.classList.contains("scroll-to-top")) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Only intercept #hash style links (not mailto:, tel:, http, etc.)
    if (!href.startsWith("#") || href === "#") return;

    const pageId = getPageIdFromHash(href);
    const pageEl = document.getElementById(pageId);

    if (pageEl && pageEl.classList.contains("page")) {
      e.preventDefault();

      // Update URL hash (keeps ?item=... part)
      window.location.hash = href.slice(1);

      showPage(pageId);
      closeMobileMenu(); // also close mobile nav on click
    }
  });

  /* ============================
   * 3. HAMBURGER / MOBILE NAV
   * ============================ */

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
    hamburger.addEventListener("click", () => {
      const isOpen = navList.classList.contains("nav-active");
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when any link inside mobile nav is clicked (backup)
    navList.addEventListener("click", (e) => {
      if (e.target.matches("a")) {
        closeMobileMenu();
      }
    });
  }

  /* ============================
   * 4. HEADER SCROLL EFFECT
   * ============================ */

  function handleScroll() {
    if (!header) return;
    const scrolledClass = "scrolled";
    const threshold = 10;

    if (window.scrollY > threshold) {
      header.classList.add(scrolledClass);
    } else {
      header.classList.remove(scrolledClass);
    }
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  /* ============================
   * 5. HERO SPOTLIGHT EFFECT
   * ============================ */

  if (homeSection) {
    homeSection.addEventListener("pointermove", (e) => {
      const rect = homeSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      homeSection.style.setProperty("--mouse-x", `${x}px`);
      homeSection.style.setProperty("--mouse-y", `${y}px`);
    });

    homeSection.addEventListener("pointerleave", () => {
      homeSection.style.removeProperty("--mouse-x");
      homeSection.style.removeProperty("--mouse-y");
    });
  }

  /* ======================================
   * 6. CONTACT BUTTONS → CONTACT PAGE
   * (Header button, mobile banner, etc.)
   * ====================================== */

  function goToContactPage() {
    const contactPage = document.getElementById("contact");
    if (!contactPage) return;

    window.location.hash = "contact";
    showPage("contact");
  }

  const contactButtons = document.querySelectorAll(
    ".contact-button, .mobile-contact-button, .contact-banner-btn"
  );

  contactButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const href = btn.getAttribute("href") || "";
      if (href.startsWith("#")) {
        e.preventDefault();
      }
      goToContactPage();
    });
  });

  /* ==================================
   * 7. SERVICE DETAIL (SAFE NO-OP)
   * (You can extend this later if needed)
   * ================================== */

  // Placeholder: if you later add .back-button or data-service-detail-id
  // this block won't break anything now.

  /* ============================================
   * 8. HOME CLIENT LOGO STRIP – UNIVERSAL MARQUEE
   * ============================================ */

  let marqueeStarted = false;

  function initHomeLogoMarquee() {
    if (marqueeStarted) return;

    const strip = document.querySelector(".home-clients-strip");
    const track = document.querySelector(".home-clients-track");
    if (!strip || !track) return;

    // Ensure layout: single horizontal track
    track.style.display = "flex";
    track.style.flexWrap = "nowrap";
    track.style.willChange = "transform";

    const rows = Array.from(track.querySelectorAll(".home-clients-row"));
    if (rows.length === 0) return;

    let firstRowWidth = 0;
    let offset = 0;

    function computeSpeed() {
      const w = window.innerWidth;
      if (w < 768) return 0.8;      // mobile
      if (w < 1024) return 0.7;     // tablet
      return 0.6;                   // desktop
    }

    let speed = computeSpeed();

    function measureWidth() {
      firstRowWidth = rows[0].getBoundingClientRect().width;
    }

    function ensureMeasurementsThenStart() {
      measureWidth();

      if (firstRowWidth === 0) {
        // Images may not be loaded yet; retry
        setTimeout(ensureMeasurementsThenStart, 200);
        return;
      }

      requestAnimationFrame(loop);
    }

    function loop() {
      const homeActive =
        homeSection && homeSection.classList.contains("active");

      // Only move when Home is the active page (for SPA)
      if (homeActive && firstRowWidth > 0) {
        offset -= speed;
        if (-offset >= firstRowWidth) {
          offset += firstRowWidth; // reset after one full row width
        }
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
      }

      requestAnimationFrame(loop);
    }

    // Re-measure and adjust speed on resize
    window.addEventListener("resize", () => {
      speed = computeSpeed();
      measureWidth();
    });

    // Try after all logo images are loaded
    const imgs = track.querySelectorAll("img");
    let loadedCount = 0;

    if (imgs.length === 0) {
      ensureMeasurementsThenStart();
    } else {
      imgs.forEach((img) => {
        if (img.complete) {
          loadedCount++;
        } else {
          img.addEventListener("load", () => {
            loadedCount++;
            if (loadedCount === imgs.length) {
              measureWidth();
            }
          });
        }
      });

      // Start regardless after a small delay to be safe
      setTimeout(ensureMeasurementsThenStart, 300);
    }

    marqueeStarted = true;
  }

  // Start marquee when DOM is ready
  initHomeLogoMarquee();

  // Also re-start logic if user navigates back to home from another page
  window.addEventListener("hashchange", () => {
    const pageId = getPageIdFromHash(window.location.hash);
    if (pageId === "home") {
      initHomeLogoMarquee();
    }
  });
});

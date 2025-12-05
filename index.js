// index.js (Complete File with "full-page" detail views)

(function () {
  var header = document.querySelector("header");
  var pages = document.querySelectorAll(".page");
  var navLinks = document.querySelectorAll("header nav a[href^='#']");
  var hamburger = document.querySelector(".hamburger");
  var navList = document.querySelector("nav ul");
  var scrollBtn = document.querySelector(".scroll-to-top");
  var root = document.documentElement;
  var homePage = document.getElementById("home");

  /* ---------------------- 0. DETAIL DATA (Services & Consulting) ---------------------- */

  var SERVICE_DETAILS = {
    "contract-staffing": {
      title: "Contract Staffing",
      intro:
        "Scale your teams quickly with pre-vetted professionals for short- to mid-term engagements without adding permanent headcount.",
      bullets: [
        "Flexible ramp-up and ramp-down based on project timelines.",
        "Access to niche skills without long onboarding cycles.",
        "Full compliance and payroll handled by Votive.",
        "Ideal for pilot projects, seasonal peaks and backfills."
      ]
    },
    "permanent-staffing": {
      title: "Permanent Staffing",
      intro:
        "A consultative, high-touch search process to build long-term core teams that are aligned to your culture and growth plans.",
      bullets: [
        "Role discovery workshops to refine the ideal candidate profile.",
        "Multi-stage screening for skills, values and culture fit.",
        "Salary benchmarking and offer management support.",
        "Post-joining follow-ups to support retention in the first 90 days."
      ]
    },
    rpo: {
      title: "Recruitment Process Outsourcing (RPO)",
      intro:
        "We embed our team as an extension of your HR function, owning the end-to-end recruitment engine so you can focus on business.",
      bullets: [
        "Dedicated recruiters, coordinators and sourcing pods.",
        "Standardised interview, evaluation and feedback loops.",
        "Real-time hiring dashboards and funnel analytics.",
        "Lower cost-per-hire and reduced time-to-fill across roles."
      ]
    },
    "diversity-hiring": {
      title: "Diversity & Inclusion Hiring",
      intro:
        "Deliberate, structured hiring programs to create balanced and inclusive teams that reflect your customers and communities.",
      bullets: [
        "Inclusive job descriptions and sourcing strategies.",
        "Curated pipelines across multiple diversity segments.",
        "Bias-aware screening and interview frameworks.",
        "Metrics and reporting to track D&I hiring outcomes."
      ]
    },
    "leadership-hiring": {
      title: "Leadership & Executive Search",
      intro:
        "Discreet, insight-driven search for senior leaders who can drive transformation, culture and long-term value creation.",
      bullets: [
        "Market mapping and competitor talent intelligence.",
        "Deep evaluation of leadership capability and style.",
        "Support with compensation structuring and negotiations.",
        "Succession and bench-strength planning inputs."
      ]
    }
  };

  var CONSULTING_DETAILS = {
    compliance: {
      title: "Compliance & Legal Consulting",
      intro:
        "Navigate complex labour, regulatory and contract frameworks with confidence while protecting your brand and workforce.",
      bullets: [
        "Review of employment contracts, policies and HR documentation.",
        "Advisory on labour law, statutory compliances and audits.",
        "Risk assessment across hiring, contracts and exit processes.",
        "Ongoing compliance health-checks as your organisation scales."
      ]
    },
    operations: {
      title: "Business Operations Consulting",
      intro:
        "Optimise how work flows across your organisation – from talent ops to day-to-day delivery – to unlock productivity and predictability.",
      bullets: [
        "Process discovery and mapping across hiring and HR ops.",
        "Design of lean, tech-enabled operating models.",
        "KPI frameworks and dashboards for leadership visibility.",
        "Change-management support for new ways of working."
      ]
    },
    financial: {
      title: "Financial Services Consulting",
      intro:
        "Strengthen financial foundations around people costs, contracts and growth so you can scale sustainably and strategically.",
      bullets: [
        "Workforce cost modelling and headcount planning.",
        "Compensation and benefits benchmarking by market and role.",
        "Vendor and contract optimisation for recruitment spends.",
        "Board-ready views on hiring ROI and talent investments."
      ]
    }
  };

  /* ---------- Helpers to toggle “full-page” detail mode ---------- */

  function setPageDetailMode(pageId, isDetail) {
    var main = document.getElementById(pageId);
    if (!main) return;

    var detailContainer = main.querySelector(".service-detail-container");
    var children = Array.prototype.slice.call(main.children);

    children.forEach(function (child) {
      if (detailContainer && child === detailContainer) {
        // Show/hide detail container
        child.hidden = !isDetail;
      } else {
        // Hide everything else when in detail mode
        child.style.display = isDetail ? "none" : "";
      }
    });

    // If turning detail OFF, also clear container content
    if (!isDetail && detailContainer) {
      detailContainer.innerHTML = "";
    }
  }

  function clearDetailContainers() {
    setPageDetailMode("services", false);
    setPageDetailMode("consulting", false);
  }

  function renderServiceDetail(itemKey) {
    var data = SERVICE_DETAILS[itemKey];
    var main = document.getElementById("services");
    if (!data || !main) return;

    var container = main.querySelector(".service-detail-container");
    if (!container) return;

    setPageDetailMode("services", true);

    var html =
      '<div class="service-detail-content">' +
      '<a href="#services" class="back-button">&larr; Back to all services</a>' +
      "<h1>" +
      data.title +
      "</h1>" +
      "<p>" +
      data.intro +
      "</p>";

    if (data.bullets && data.bullets.length) {
      html += "<ul>";
      data.bullets.forEach(function (b) {
        html += "<li>" + b + "</li>";
      });
      html += "</ul>";
    }

    html += "</div>";
    container.innerHTML = html;
    container.hidden = false;
  }

  function renderConsultingDetail(itemKey) {
    var data = CONSULTING_DETAILS[itemKey];
    var main = document.getElementById("consulting");
    if (!data || !main) return;

    var container = main.querySelector(".service-detail-container");
    if (!container) return;

    setPageDetailMode("consulting", true);

    var html =
      '<div class="service-detail-content">' +
      '<a href="#consulting" class="back-button">&larr; Back to consulting overview</a>' +
      "<h1>" +
      data.title +
      "</h1>" +
      "<p>" +
      data.intro +
      "</p>";

    if (data.bullets && data.bullets.length) {
      html += "<ul>";
      data.bullets.forEach(function (b) {
        html += "<li>" + b + "</li>";
      });
      html += "</ul>";
    }

    html += "</div>";
    container.innerHTML = html;
    container.hidden = false;
  }

  function handleDetailFromHash() {
    clearDetailContainers();

    var rawHash = window.location.hash || "";
    if (!rawHash) return;

    var parts = rawHash.split("?");
    var base = parts[0]; // e.g. "#services"
    var query = parts[1] || "";

    if (!query) return;

    var itemKey = null;
    query.split("&").forEach(function (pair) {
      var kv = pair.split("=");
      if (kv[0] === "item") {
        itemKey = decodeURIComponent(kv[1] || "");
      }
    });

    if (!itemKey) return;

    if (base === "#services") {
      renderServiceDetail(itemKey);
    } else if (base === "#consulting") {
      renderConsultingDetail(itemKey);
    }
  }

  /* ---------------------- 1. SPA PAGE SWITCHING ---------------------- */

  function setActivePageFromHash() {
  var hash = window.location.hash || "#home";

  var pageOnly = hash.split("?")[0]; // ignore ? for which page
  var id = pageOnly.replace("#", "") || "home";

  // 1) Activate the right page
  pages.forEach(function (p) {
    p.classList.toggle("active", p.id === id);
  });

  // 2) FORCE scroll to top on EVERY hash change (desktop + mobile)
  function forceTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  // call immediately
  forceTop();
  // then again in the next frame (for mobile browsers that restore position)
  setTimeout(forceTop, 0);
  // and once more after content/layout settles
  setTimeout(forceTop, 80);

  // 3) Body overflow rules
  if (document.body.classList.contains("menu-open")) {
    // keep as is when mobile menu is open
  } else if (id === "home" && window.innerWidth <= 767) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  // 4) Detail views logic
  if (id === "services" || id === "consulting") {
    handleDetailFromHash();
  } else {
    clearDetailContainers();
  }
}

  setActivePageFromHash();
  window.addEventListener("hashchange", setActivePageFromHash);

  /* ---------------------- 2. NAV LINKS & MOBILE MENU ---------------------- */

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href") || "";
      if (!href || href.charAt(0) !== "#") return;

      // header nav only switches page, not detail
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

/* ---------------------- 5. UNIVERSAL CLIENT LOGO MARQUEE ---------------------- */
/* ---------------------- 5. UNIVERSAL CLIENT LOGO MARQUEE ---------------------- */

var strip = document.querySelector(".home-clients-strip");
var track = strip ? strip.querySelector(".home-clients-track") : null;

if (strip && track) {
  var rows = Array.prototype.slice.call(
    track.querySelectorAll(".home-clients-row")
  );

  if (!rows.length) return;

  track.style.display = "flex";
  track.style.flexWrap = "nowrap"; // Crucial for movement
  track.style.willChange = "transform";
  track.style.animation = "none"; // Disable potential CSS animation

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

      // Loop the marquee when the first row is off-screen
      if (-x >= rowWidth) {
        x += rowWidth;
      }

      // JS controls CSS variable; CSS applies transform
      track.style.setProperty("--homeLogoOffset", x + "px");
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

    // Fallback: don't wait too long
    setTimeout(function () {
      if (loaded < imgs.length) {
        window.requestAnimationFrame(step);
      }
    }, 1500);
  }
}
})();

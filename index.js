/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- App Setup ---
const app = document.getElementById('app');

if (app) {
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    requestAnimationFrame(() => {
      app.style.setProperty('--mouse-x', `${clientX}px`);
      app.style.setProperty('--mouse-y', `${clientY}px`);
    });
  };
  window.addEventListener('mousemove', handleMouseMove, { passive: true });
}

// --- Service Detail Content ---
const serviceDetails = {
  'contract-staffing': {
    title: 'Contract Staffing Solutions',
    parentPage: 'services',
    content: `<p>Our Contract Staffing service provides the agility...</p>
               <h4>Key Features:</h4>
               <ul>
                 <li><strong>Speed to Hire:</strong> Access our extensive network...</li>
               </ul>`
  },
  'permanent-staffing': {
    title: 'Permanent Staffing Services',
    parentPage: 'services',
    content: `<p>Finding the right permanent addition...</p>`
  },
  'rpo': {
    title: 'Recruitment Process Outsourcing (RPO)',
    parentPage: 'services',
    content: `<p>Recruitment Process Outsourcing (RPO) is a strategic partnership...</p>`
  },
  'diversity-hiring': {
    title: 'Diversity & Inclusion Hiring',
    parentPage: 'services',
    content: `<p>A diverse workforce is a key driver...</p>`
  },
  'leadership-hiring': {
    title: 'Leadership & Executive Search',
    parentPage: 'services',
    content: `<p>The right leadership can define a company's trajectory...</p>`
  },
  'compliance': {
    title: 'Compliance, Legal & Accounting Consulting',
    parentPage: 'consulting',
    content: `<p>In an ever-changing business environment...</p>`
  },
  'operations': {
    title: 'Business Operations Consulting',
    parentPage: 'consulting',
    content: `<p>Efficiency is the engine of growth...</p>`
  },
  'financial': {
    title: 'Financial Services Consulting',
    parentPage: 'consulting',
    content: `<p>Our Financial Services consulting provides strategic insight...</p>`
  }
};

// --- Restore headings ---
function restoreParentHeadings() {
  ['services', 'consulting'].forEach((id) => {
    const page = document.getElementById(id);
    if (!page) return;
    const h = page.querySelector('h1');
    const p = page.querySelector('.page-intro');
    if (h) h.style.display = '';
    if (p) p.style.display = '';
  });
}

// --- Show all lists ---
function showAllServiceLists() {
  document.querySelectorAll('.service-detail-container').forEach(el => {
    el.hidden = true;
    el.innerHTML = '';
  });
  document.querySelectorAll('.feature-sections-container').forEach(el => {
    el.hidden = false;
  });

  restoreParentHeadings();
}

// --- Show specific service detail ---
function showServiceDetail(serviceId) {
  const detailData = serviceDetails[serviceId];
  if (!detailData) return;

  const parentPage = document.getElementById(detailData.parentPage);
  const listContainer = parentPage.querySelector('.feature-sections-container');
  const detailContainer = parentPage.querySelector('.service-detail-container');

  const heading = parentPage.querySelector('h1');
  const intro = parentPage.querySelector('.page-intro');
  if (heading) heading.style.display = 'none';
  if (intro) intro.style.display = 'none';

  listContainer.hidden = true;

  const backButtonText =
    detailData.parentPage === 'services'
      ? 'Back to all services'
      : 'Back to all consulting';

  detailContainer.innerHTML = `
    <div class="service-detail-content">
      <a href="#${detailData.parentPage}" class="back-button">&larr; ${backButtonText}</a>
      <h1>${detailData.title}</h1>
      <div>${detailData.content}</div>
    </div>
  `;
  detailContainer.hidden = false;

  parentPage.scrollIntoView({ behavior: 'smooth' });
}

// --- SPA Page switching ---
function showPage(pageId) {
  const targetId = pageId && document.getElementById(pageId) ? pageId : 'home';
  document.querySelectorAll('.page').forEach((page) => {
    page.classList.toggle('active', page.id === targetId);
  });

  window.scrollTo(0, 0);
}

// --- Navigation handler (FIXED: Ignores form clicks) ---
function handleNavClick(event) {
  // ❌ VERY IMPORTANT FIX — do NOT intercept form submissions
  if (event.target.closest('form')) return;

  const link = event.target.closest('a');
  const clickedHamburger = event.target.closest('.hamburger');
  const header = document.querySelector('header');
  if (link && link.getAttribute('href') === '#contact') {
    event.preventDefault();
    window.location.hash = '#contact';
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    return;
  }


  // Navigation link
  if (link && link.getAttribute('href')?.startsWith('#')) {
    event.preventDefault();
    const href = link.getAttribute('href');

    if (window.location.hash !== href) {
      window.location.hash = href;
    } else {
      handleHashChange();
    }

    const navMenu = document.querySelector('nav ul');
    const hamburgerIcon = document.querySelector('.hamburger');
    if (navMenu && hamburgerIcon && navMenu.classList.contains('nav-active')) {
      navMenu.classList.remove('nav-active');
      hamburgerIcon.classList.remove('toggle-active');
      document.body.classList.remove('menu-open');
      header?.classList.remove('menu-is-open');
    }

    return;
  }

  // Hamburger toggling
  if (clickedHamburger) {
    const navMenu = document.querySelector('nav ul');
    const hamburgerIcon = document.querySelector('.hamburger');
    navMenu.classList.toggle('nav-active');
    hamburgerIcon.classList.toggle('toggle-active');
    document.body.classList.toggle('menu-open');
    header?.classList.toggle('menu-is-open');
  }
}

// --- Hash change handler ---
function handleHashChange() {
  const hash = window.location.hash || '#home';
  const [pagePart, queryString] = hash.split('?');
  const pageId = pagePart.replace('#', '') || 'home';

  showPage(pageId);
  handleHeaderScroll();

  if (queryString) {
    const params = new URLSearchParams(queryString);
    const id = params.get('item');
    if (id && serviceDetails[id]) {
      showServiceDetail(id);
      return;
    }
  }

  showAllServiceLists();
}

// --- Header scroll effect ---
function handleHeaderScroll() {
  const header = document.querySelector('header');
  const homePage = document.getElementById('home');
  const isHomePageActive = homePage.classList.contains('active');
  const isScrolled = window.scrollY > 10;

  if (!isHomePageActive || isScrolled) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
}

// --- Initialize ---
window.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', handleNavClick);
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHashChange();
});

window.addEventListener('hashchange', handleHashChange);

// --- Scroll-to-top ---
const scrollTopButton = document.querySelector('.scroll-to-top');

if (scrollTopButton) {
  window.addEventListener('scroll', () => {
    scrollTopButton.classList.toggle('visible', window.scrollY > 300);
  });

  scrollTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- Success Alert for Contact Form ---
if (window.location.hash.includes("success=true")) {
  alert("Your message has been sent successfully! We will get back to you shortly.");
}

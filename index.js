/**
 * index.js — Full app script
 * - SPA navigation via hash (supports #page?item=service-id)
 * - Shows/hides service & consulting detail views
 * - Keeps parent page heading/intro hidden while a specific detail is shown
 * - Mobile nav toggle + hamburger
 * - Floating mobile contact button jump
 * - Scroll-to-top control
 *
 * NOTE: This version integrates the pixel-perfect JavaScript Infinite Scroll solution
 * and enables it on ALL screen sizes (desktop, tablet, and mobile).
 */

/* --- App Setup (mouse reactive variables) --- */
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

/* --- Service Detail Content (Your Original Data) --- */
const serviceDetails = {
  'contract-staffing': {
    title: 'Contract Staffing Solutions',
    parentPage: 'services',
    content: `<p>Our Contract Staffing service provides the agility your business needs to adapt to market demands. We offer highly skilled, pre-vetted professionals for project-based work, seasonal peaks, or specialized short-term needs. This allows you to scale your team without the long-term commitment and overhead of permanent hires.</p>
               <h4>Key Features:</h4>
               <ul>
                 <li><strong>Speed to Hire:</strong> Access our extensive network of available professionals to fill roles quickly, often within days.</li>
                 <li><strong>Flexibility:</strong> Scale your workforce up or down based on project requirements, ensuring optimal resource allocation.</li>
                 <li><strong>Access to Expertise:</strong> Bring in specialized skills for specific projects without the need for extensive training.</li>
                 <li><strong>Reduced Risk:</strong> Mitigate the risks associated with permanent hiring by evaluating a candidate's fit on a temporary basis.</li>
               </ul>`
  },
  'permanent-staffing': {
    title: 'Permanent Staffing Services',
    parentPage: 'services',
    content: `<p>Finding the right permanent addition to your team is crucial for long-term success. Our Permanent Staffing service is a comprehensive, consultative process designed to find candidates who not only possess the right skills and experience but also align perfectly with your company's culture and vision.</p>
               <h4>Our Process:</h4>
               <ul>
                 <li><strong>Deep Dive Discovery:</strong> We begin by understanding your company, culture, and the specific requirements of the role.</li>
                 <li><strong>Targeted Sourcing:</strong> We utilize a multi-channel approach, including our exclusive network and advanced sourcing tools, to find both active and passive candidates.</li>
                 <li><strong>Rigorous Vetting:</strong> Our screening process includes technical assessments, behavioral interviews, and thorough reference checks.</li>
                 <li><strong>Seamless Integration:</strong> We assist with offer negotiation and onboarding to ensure a smooth transition for your new hire.</li>
               </ul>`
  },
  'rpo': {
    title: 'Recruitment Process Outsourcing (RPO)',
    parentPage: 'services',
    content: `<p>Recruitment Process Outsourcing (RPO) is a strategic partnership where we become an extension of your company's HR department, managing the entire recruitment lifecycle. This solution is designed to improve quality of hire, reduce costs, and provide scalable, data-driven recruiting capabilities.</p>
               <h4>Benefits of RPO:</h4>
               <ul>
                 <li><strong>Scalability:</strong> Effortlessly scale your recruitment capacity up or down to match hiring demands.</li>
                 <li><strong>Cost Efficiency:</strong> Reduce average cost-per-hire by optimizing the recruitment process and leveraging economies of scale.</li>
                 <li><strong>Improved Quality:</strong> Benefit from our specialized recruiters, advanced technologies, and proven methodologies to attract top talent.</li>
                 <li><strong>Strategic Insights:</strong> Gain valuable market intelligence and data analytics to inform your talent strategy.</li>
               </ul>`
  },
  'diversity-hiring': {
    title: 'Diversity & Inclusion Hiring',
    parentPage: 'services',
    content: `<p>A diverse workforce is a key driver of innovation, creativity, and business success. Our Diversity Hiring services are dedicated to helping you build inclusive teams that reflect the world we live in. We go beyond compliance to implement strategies that attract, hire, and retain talent from all backgrounds.</p>
               <h4>Our Approach:</h4>
               <ul>
                 <li><strong>Inclusive Sourcing:</strong> We tap into diverse talent pools and communities to ensure a wide range of candidates.</li>
                 <li><strong>Bias Mitigation:</strong> We work with your team to implement structured, unbiased interview and evaluation processes.</li>
                 <li><strong>Employer Branding:</strong> We help you craft and communicate an authentic employer brand that appeals to a diverse audience.</li>
                 <li><strong>Partnership and Training:</strong> We provide resources and training to foster an inclusive culture throughout your organization.</li>
               </ul>`
  },
  'leadership-hiring': {
    title: 'Leadership & Executive Search',
    parentPage: 'services',
    content: `<p>The right leadership can define a company's trajectory. Our Leadership Hiring service is a discreet, thorough, and highly-targeted search process for executive and senior-level positions. We understand the nuances of leadership and work diligently to find visionary leaders who will drive your company forward.</p>
               <h4>Our Methodology:</h4>
               <ul>
                 <li><strong>Strategic Alignment:</strong> We partner with your key stakeholders to define the ideal leadership profile and success metrics.</li>
                 <li><strong>Market Mapping:</strong> We conduct comprehensive research to identify top-tier executives, often targeting passive candidates.</li>
                 <li><strong>Confidential Outreach:</strong> Our process is handled with the utmost discretion to protect all parties involved.</li>
                 <li><strong>In-Depth Assessment:</strong> We evaluate candidates based on leadership competencies, track record, and cultural fit.</li>
               </ul>`
  },
  'compliance': {
    title: 'Compliance, Legal & Accounting Consulting',
    parentPage: 'consulting',
    content: `<p>In an ever-changing business environment, maintaining compliance is paramount. Our consulting services provide expert guidance to help you navigate complex regulatory, legal, and financial landscapes, ensuring your business operates with integrity and is protected from risk.</p>
               <h4>Areas of Expertise:</h4>
               <ul>
                 <li><strong>Regulatory Frameworks:</strong> We help you understand and adhere to industry-specific regulations and data privacy laws (e.g., GDPR, CCPA).</li>
                 <li><strong>Corporate Governance:</strong> We advise on best practices for board structure, internal controls, and corporate ethics.</li>
                 <li><strong>Risk Assessment:</strong> Our team identifies potential compliance gaps and develops strategies to mitigate them.</li>
                 <li><strong>Financial Integrity:</strong> We offer guidance on financial reporting standards and internal accounting controls to ensure accuracy and transparency.</li>
               </ul>`
  },
  'operations': {
    title: 'Business Operations Consulting',
    parentPage: 'consulting',
    content: `<p>Efficiency is the engine of growth. Our Business Operations consulting helps organizations streamline processes, leverage technology, and optimize workflows to increase productivity and reduce costs. We take a holistic view of your operations to identify opportunities for impactful improvement.</p>
               <h4>What We Do:</h4>
               <ul>
                 <li><strong>Process Optimization:</strong> We map your current workflows, identify bottlenecks, and design more efficient processes using methodologies like Lean and Six Sigma.</li>
                 <li><strong>Technology Strategy:</strong> We assess your current tech stack and provide recommendations for new tools and integrations to automate tasks and improve data flow.</li>
                 <li><strong>Change Management:</strong> We provide a structured approach to manage the human side of operational changes, ensuring smooth adoption and lasting success.</li>
                 <li><strong>Performance Metrics:</strong> We help you define and track Key Performance Indicators (KPIs) to measure operational success.</li>
               </ul>`
  },
  'financial': {
    title: 'Financial Services Consulting',
    parentPage: 'consulting',
    content: `<p>Our Financial Services consulting provides the strategic insight your business needs to achieve financial health and sustainable growth. We partner with you to tackle key financial challenges, from capital management to strategic transactions.</p>
               <h4>Our Services Include:</h4>
               <ul>
                 <li><strong>Strategic Financial Planning:</strong> We help you develop comprehensive financial models, forecasts, and budgets that align with your business objectives.</li>
                 <li><strong>Capital Advisory:</strong> We provide guidance on capital structure, fundraising strategies, and investor relations.</li>
                 <li><strong>M&A Advisory:</strong> We support you through the a transaction lifecycle, from due diligence and valuation to post-merger integration.</li>
                 <li><strong>Performance Improvement:</strong> We analyze your financial performance to identify opportunities for margin improvement and cost reduction.</li>
               </ul>`
  }
};

/* --- Helper: Restore parent headings and intros --- */
function restoreParentHeadings() {
  const servicesHeader = document.querySelector('#services > h1');
  const servicesIntro = document.querySelector('#services > .page-intro');
  const consultingHeader = document.querySelector('#consulting > h1');
  const consultingIntro = document.querySelector('#consulting > .page-intro');

  if (servicesHeader) servicesHeader.style.display = '';
  if (servicesIntro) servicesIntro.style.display = '';
  if (consultingHeader) consultingHeader.style.display = '';
  if (consultingIntro) consultingIntro.style.display = '';
}

/* --- Show all service lists (hide details) --- */
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

/* --- Show detail for a given serviceId (defensive) --- */
function showServiceDetail(serviceId) {
  const detailData = serviceDetails[serviceId];
  if (!detailData) {
    console.warn(`[showServiceDetail] unknown serviceId: "${serviceId}"`);
    showAllServiceLists();
    return;
  }

  const parentPage = document.getElementById(detailData.parentPage);
  if (!parentPage) {
    console.error(`[showServiceDetail] parent page not found: "${detailData.parentPage}" for service "${serviceId}"`);
    showAllServiceLists();
    return;
  }

  const listContainer = parentPage.querySelector('.feature-sections-container');
  const detailContainer = parentPage.querySelector('.service-detail-container');

  if (!listContainer) {
    console.error(`[showServiceDetail] list container (.feature-sections-container) not found inside #${detailData.parentPage}`);
    showAllServiceLists();
    return;
  }
  if (!detailContainer) {
    console.error(`[showServiceDetail] detail container (.service-detail-container) not found inside #${detailData.parentPage}`);
    showAllServiceLists();
    return;
  }

  // Hide parent's main heading + intro (but not the specific detail title)
  const parentHeading = parentPage.querySelector('h1');
  const parentIntro = parentPage.querySelector('.page-intro');
  if (parentHeading) parentHeading.style.display = 'none';
  if (parentIntro) parentIntro.style.display = 'none';

  const backButtonText = detailData.parentPage === 'services' ? 'Back to all services' : 'Back to all consulting';

  detailContainer.innerHTML = `
    <div class="service-detail-content" tabindex="-1">
      <a href="#${detailData.parentPage}" class="back-button">&larr; ${backButtonText}</a>
      <h1>${detailData.title}</h1>
      <div class="service-detail-body">${detailData.content}</div>
    </div>
  `;
  detailContainer.hidden = false;
  listContainer.hidden = true;

  // Smooth scroll to top of the parent page to show detail
  try {
    parentPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // set focus to the content for keyboard users
    const focusEl = detailContainer.querySelector('.service-detail-content');
    if (focusEl) focusEl.focus({ preventScroll: true });
  } catch (err) {
    // not critical; log for debugging
    console.warn('[showServiceDetail] scroll/focus failed', err);
  }
}

/* --- Page show/hide logic --- */
function showPage(pageId) {
  const targetId = pageId && document.getElementById(pageId) ? pageId : 'home';

  document.querySelectorAll('.page').forEach(page => {
    page.classList.toggle('active', page.id === targetId);
  });

  // ensure user is at top of the page
  window.scrollTo(0, 0);
}

/* --- Header scroll background toggle --- */
function handleHeaderScroll() {
  const header = document.querySelector('header');
  const homePage = document.getElementById('home');

  if (!header || !homePage) return;

  const isHomePageActive = homePage.classList.contains('active');
  const isScrolled = window.scrollY > 10;

  if (!isHomePageActive || isScrolled) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
}

/* --- Navigation click handler --- */
function handleNavClick(event) {
  // Don't intercept if user clicked inside a form or on a form control (submit etc.)
  if (event.target.closest('form') || event.target.closest('input') || event.target.closest('button') || event.target.closest('textarea')) {
    return;
  }

  const link = event.target.closest('a');
  const clickedHamburger = event.target.closest('.hamburger');
  const header = document.querySelector('header');

  // Hamburger toggle
  if (clickedHamburger) {
    const navMenu = document.querySelector('nav ul');
    const hamburgerIcon = document.querySelector('.hamburger');
    if (navMenu && hamburgerIcon) {
      navMenu.classList.toggle('nav-active');
      hamburgerIcon.classList.toggle('toggle-active');
      document.body.classList.toggle('menu-open');
      header?.classList.toggle('menu-is-open');
    }
    return;
  }

  // Navigation link handling (hash-based)
  if (link && link.getAttribute('href')?.startsWith('#')) {
    event.preventDefault();
    const href = link.getAttribute('href');

    // If the link points to #contact, ensure scroll behavior works even when hash unchanged
    if (href === window.location.hash) {
      // force-handle the hash change logic
      handleHashChange();
    } else {
      // update hash — this triggers 'hashchange' event
      window.location.hash = href;
    }

    // Close mobile nav if open
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
}

/* --- Hash change handling --- */
function handleHashChange() {
  const rawHash = window.location.hash || '#home';
  const [pagePart, queryString] = rawHash.split('?');
  const pageId = (pagePart || '#home').replace('#', '') || 'home';

  showPage(pageId);
  handleHeaderScroll();

  if (queryString) {
    params = new URLSearchParams(queryString);
    serviceId = params.get('item');
    if (serviceId) {
      if (serviceDetails[serviceId]) {
        showServiceDetail(serviceId);
        return;
      } else {
        console.warn(`[handleHashChange] item param present but not found in serviceDetails: "${serviceId}"`);
      }
    }
  }

  // No (valid) item param -> restore lists & headings
  showAllServiceLists();
}

/* --- Initialization --- */
window.addEventListener('DOMContentLoaded', () => {
  // nav clicks
  document.addEventListener('click', handleNavClick);

  // header scroll visual
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // show correct page/detail based on current hash
  handleHashChange();

  // mobile-contact floating link behavior
  const mobileContact = document.querySelector('.mobile-contact-button');
  if (mobileContact) {
    mobileContact.addEventListener('click', (e) => {
      // go to contact page and focus the form
      e.preventDefault();
      window.location.hash = '#contact';
      // small delay so the page becomes visible
      setTimeout(() => {
        const form = document.querySelector('#contact .contact-form');
        if (form) {
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const firstInput = form.querySelector('input, textarea, select, button');
          if (firstInput) firstInput.focus({ preventScroll: true });
        }
      }, 200);
    });
  }

  // when clicking a link that includes ?item=... from footer or lists, if the hash is the same, handle explicitly
  // (this prevents a situation where clicking the same hash+query doesn't trigger hashchange)
  document.querySelectorAll('a[href*="?item="]').forEach(a => {
    a.addEventListener('click', (ev) => {
      // let handleNavClick handle setting hash; if hash doesn't change, force handle
      setTimeout(() => {
        handleHashChange();
      }, 50);
    });
  });
});

window.addEventListener('hashchange', handleHashchange);

/* --- Scroll to top button --- */
const scrollTopButton = document.querySelector('.scroll-to-top');

if (scrollTopButton) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopButton.classList.add('visible');
    } else {
      scrollTopButton.classList.remove('visible');
    }
  });

  scrollTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- Contact form: show success message when redirected by formsubmit (or similar) --- */
(function showContactSuccessAlert() {
  try {
    const hash = window.location.hash || '';
    if (hash.includes('success=true')) {
      // small non-blocking toast-style alert (using alert for simplicity)
      setTimeout(() => {
        alert('Your message has been sent successfully! We will get back to you shortly.');
        // Remove the query fragment from the URL to avoid repeated alerts on reload
        history.replaceState(null, '', window.location.pathname + window.location.hash.split('?')[0]);
      }, 300);
    }
  } catch (err) {
    console.warn('[showContactSuccessAlert] failed', err);
  }
})();

/* --- Defensive dev helper (optional) ---
   If you want quick checks in console:
   - Object.keys(serviceDetails) -> list of available ids
   - showServiceDetail('leadership-hiring') -> force show a detail
*/

/* --- JS Infinite Scroll Solution --- */
const marqueeSpeed = 0.5; // Controls the speed (0.5px per frame)
let scrollPosition = 0;
let rowWidth = 0;
let animationFrameId = null;

const homeClientsTrack = document.querySelector('.home-clients-track');
const homeClientsRow = document.querySelector('.home-clients-row'); // Use the first row for width

const isDesktop = () => window.innerWidth >= 1024;

/* --- Function: Calculate Marquee Widths --- */
function calculateMarqueeWidths() {
    if (!homeClientsTrack || !homeClientsRow) return 0;

    const baseFontSize = parseFloat(getComputedStyle(document.body).fontSize);
    let gapRem = isDesktop() ? 1.8 : 1.4;
    let gapSize = gapRem * baseFontSize;

    // Get the total width of the content of the first row (logos + internal gaps)
    let rowOneContentWidth = homeClientsRow.scrollWidth;

    // The actual scroll distance: Row Content Width + Inter-Row Gap
    rowWidth = rowOneContentWidth + gapSize;
    
    return rowWidth > 0 ? rowWidth : 0; 
}

/* --- Function: Calculate Initial Offset for Populated Start --- */
function calculateInitialOffset() {
    // We want the scroll to start with the track fully populated, so scrollPosition starts at 0.
    return 0; 
}

function marqueeLoop() {
    if (!homeClientsTrack) {
        stopMarquee();
        return;
    }
    
    // Recalculate if width is zero (e.g., first run or resize)
    if (rowWidth === 0) {
        rowWidth = calculateMarqueeWidths();
    }
    if (rowWidth === 0) {
        stopMarquee();
        return;
    }

    // 1. Update position
    scrollPosition -= marqueeSpeed;

    // 2. Check for reset point (when we have scrolled exactly one calculated row's width)
    if (scrollPosition <= -rowWidth) {
        // Key Fix: INSTANTLY jump back by one full row width (seamless pixel reset)
        scrollPosition += rowWidth;
    }

    // 3. Apply transformation
    homeClientsTrack.style.transform = `translateX(${scrollPosition}px)`;

    // 4. Continue loop
    animationFrameId = requestAnimationFrame(marqueeLoop);
}

function startMarquee() {
    // Run scroll on ALL sizes
    stopMarquee(); // Stop any previous loop
    
    if (homeClientsTrack) {
        homeClientsTrack.style.animation = 'none'; // Clear CSS animation
        
        // 🎯 KEY FIX: Start scroll position at 0 so Row 1 is immediately visible
        scrollPosition = calculateInitialOffset(); // Should be 0
        homeClientsTrack.style.transform = `translateX(${scrollPosition}px)`;
        
        // Ensure width is max-content
        homeClientsTrack.style.width = 'max-content'; 
    }
    
    rowWidth = 0; // Force recalculation
    calculateMarqueeWidths();
    
    // Start the JS loop
    if (rowWidth > 0 && animationFrameId === null) {
        marqueeLoop();
    }
}

function stopMarquee() {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

// Attach event listeners for dynamic start/stop
window.addEventListener('load', startMarquee);
window.addEventListener('resize', () => {
    // Use a small debounce for performance on resize
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        stopMarquee();
        startMarquee();
    }, 100);
});

// Initial start logic
startMarquee();
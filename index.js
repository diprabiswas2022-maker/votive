/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Full app JS — updated so:
 * - Clicking a Services / Consulting option opens the correct page
 *   and shows the specific service's detailed content.
 * - The parent page heading/introduction ("Our Services" / "Consulting Services")
 *   is hidden while a specific detail is visible.
 * - When returning to the list (no ?item param) the parent heading/introduction
 *   and the lists are restored.
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
  },
};

// --- Helper functions ---

/**
 * Restores page headings and intros for services & consulting.
 */
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

/**
 * Hides all service detail views and shows all service list views.
 * Also restores parent headings/intros so the main page looks normal.
 */
function showAllServiceLists() {
  document.querySelectorAll('.service-detail-container').forEach(el => {
    el.hidden = true;
    el.innerHTML = '';
  });
  document.querySelectorAll('.feature-sections-container').forEach(el => {
    el.hidden = false;
  });

  // Ensure the page headings / intros are visible again
  restoreParentHeadings();
}

/**
 * Shows the detail view for a specific service and hides the list view.
 * Hides the parent page's main heading & intro but leaves the specific service title visible.
 * @param {string} serviceId The ID of the service to show.
 */
function showServiceDetail(serviceId) {
  const detailData = serviceDetails[serviceId];
  if (!detailData) {
    showAllServiceLists();
    return;
  }

  const parentPage = document.getElementById(detailData.parentPage);
  if (!parentPage) return;

  const listContainer = parentPage.querySelector('.feature-sections-container');
  const detailContainer = parentPage.querySelector('.service-detail-container');
  if (!listContainer || !detailContainer) return;

  // Hide only the parent page's main heading/introduction (NOT the specific detail title)
  const parentHeading = parentPage.querySelector('h1');
  const parentIntro = parentPage.querySelector('.page-intro');
  if (parentHeading) parentHeading.style.display = 'none';
  if (parentIntro) parentIntro.style.display = 'none';

  const backButtonText = detailData.parentPage === 'services' ? 'Back to all services' : 'Back to all consulting';

  // Populate and show the detail container (contains the specific service title + content)
  detailContainer.innerHTML = `
    <div class="service-detail-content">
      <a href="#${detailData.parentPage}" class="back-button">&larr; ${backButtonText}</a>
      <h1>${detailData.title}</h1>
      <div>${detailData.content}</div>
    </div>
  `;
  detailContainer.hidden = false;
  listContainer.hidden = true;

  // scroll to the top of the parent page so user sees the detail
  parentPage.scrollIntoView({ behavior: 'smooth' });
}

// --- SPA Navigation ---

/**
 * Shows the correct page based on its ID and hides all others.
 * @param {string} pageId The id of the page element to show.
 */
function showPage(pageId) {
  const targetId = pageId && document.getElementById(pageId) ? pageId : 'home';

  document.querySelectorAll('.page').forEach(page => {
    page.classList.toggle('active', page.id === targetId);
  });

  window.scrollTo(0, 0);
}

/**
 * Intercepts clicks for SPA navigation and mobile menu toggling.
 * This single handler manages clicks on navigation links and the hamburger icon.
 * @param {MouseEvent} event The mouse click event.
 */
function handleNavClick(event) {
  const link = event.target.closest('a');
  const clickedHamburger = event.target.closest('.hamburger');
  const header = document.querySelector('header');

  // Case 1: A navigation link was clicked
  if (link && link.getAttribute('href')?.startsWith('#')) {
    event.preventDefault();
    const href = link.getAttribute('href');
    const pageOnly = href.split('?')[0]; // e.g., "#services"
    const pageId = pageOnly.substring(1) || 'home';

    // If the hash is different, setting it will run handleHashChange
    if (window.location.hash !== href) {
      window.location.hash = href;
    } else {
      // If same hash (e.g., clicking back-button or same link), force handling
      handleHashChange();
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

  // Case 2: The hamburger menu icon was clicked
  if (clickedHamburger) {
    const navMenu = document.querySelector('nav ul');
    const hamburgerIcon = document.querySelector('.hamburger');
    if (navMenu && hamburgerIcon) {
      navMenu.classList.toggle('nav-active');
      hamburgerIcon.classList.toggle('toggle-active');
      document.body.classList.toggle('menu-open');
      header?.classList.toggle('menu-is-open');
    }
  }
}

/**
 * Updates the page content when the URL hash changes.
 * Supports optional ?item=serviceId parameter. If present, show that service's detail (while hiding parent heading).
 * If no item param, restore the lists & parent headings.
 */
function handleHashChange() {
  const hash = window.location.hash || '#home';
  const [pagePart, queryString] = hash.split('?');
  const pageId = (pagePart || '#home').replace('#', '') || 'home';

  // Show the page itself
  showPage(pageId);
  handleHeaderScroll();

  // Parse query string for item param (e.g., #services?item=contract-staffing)
  if (queryString) {
    const params = new URLSearchParams(queryString);
    const serviceId = params.get('item');
    if (serviceId && serviceDetails[serviceId]) {
      // Show the detail for this service and hide only the parent heading/intro
      showServiceDetail(serviceId);
      return;
    }
  }

  // No valid item param -> show the service/consulting lists and ensure headings are visible
  showAllServiceLists();
}

/**
 * Adds a background to the header when scrolling on content pages.
 */
function handleHeaderScroll() {
  const header = document.querySelector('header');
  const homePage = document.getElementById('home');

  if (header && homePage) {
    const isHomePageActive = homePage.classList.contains('active');
    const isScrolled = window.scrollY > 10;

    // Show header background if we are on a content page OR if we are scrolled on the home page.
    if (!isHomePageActive || isScrolled) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
}

/**
 * Initializes the application and sets up event listeners.
 */
window.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', handleNavClick);
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHashChange();
});

window.addEventListener('hashchange', handleHashChange);

// --- Scroll to top button ---
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

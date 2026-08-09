(function() {
  // ---- header scroll ----
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('site-header--scrolled', window.scrollY > 24);
  });

  // ---- mobile menu ----
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('site-nav--open');
    menuToggle.classList.toggle('menu-toggle--open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  });

  // ---- nav links (close menu + active) ----
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = ['home', 'about', 'experience', 'skills', 'projects', 'contact'];
  const sectionIds = sections.map(id => document.getElementById(id)).filter(Boolean);

  // ---- active section via IntersectionObserver ----
  const navMap = {};
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const id = href.slice(1);
      navMap[id] = link;
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const id = href.slice(1);
        const targetSection = document.getElementById(id);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }

        Object.values(navMap).forEach(l => l.classList.remove('is-active'));
        if (navMap[id]) navMap[id].classList.add('is-active');
      }

      siteNav.classList.remove('site-nav--open');
      menuToggle.classList.remove('menu-toggle--open');
      document.body.classList.remove('menu-open');
    });
  });

  function setActiveNav(id) {
    Object.values(navMap).forEach(l => l.classList.remove('is-active'));
    if (navMap[id]) navMap[id].classList.add('is-active');
  }

  function updateActiveNav() {
    const scrollPos = window.scrollY + 140;
    let activeId = sectionIds[0] ? sectionIds[0].id : null;
    sectionIds.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        activeId = section.id;
      }
    });
    if (activeId) setActiveNav(activeId);
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // ---- reveal animations ----
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -60px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Render Experience ----
  function renderExperience() {
    const container = document.getElementById('experienceContainer');
    if (!container) return;
    
    container.innerHTML = experiencesData.map((item, index) => `
      <article class="timeline-item surface-card" data-reveal="${index % 2 === 0 ? 'left' : 'right'}" style="--reveal-delay:${index * 80}ms">
        <div class="timeline-item__dot"></div>
        <div class="timeline-item__header">
          <span class="timeline-item__period">${item.period}</span>
          <h3>${item.role}</h3>
          <p class="timeline-item__company">${item.company}</p>
        </div>
        <ul>
          ${item.details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
      </article>
    `).join('');

    // Re-observe new elements
    document.querySelectorAll('#experienceContainer [data-reveal]').forEach(el => {
      revealObserver.observe(el);
    });
  }

  // ---- Render Skills ----
  function renderSkills() {
    const container = document.getElementById('skillsContainer');
    if (!container) return;

    container.innerHTML = skillsData.map((group, index) => `
      <article class="skill-card surface-card" data-reveal="zoom" style="--reveal-delay:${index * 70}ms">
        <div class="skill-card__header">
          <span>${group.title}</span>
          <strong>${group.items.length} skills</strong>
        </div>
        <div class="skill-card__chips">
          ${group.items.map(item => `<span class="skill-pill">${item}</span>`).join('')}
        </div>
      </article>
    `).join('');

    document.querySelectorAll('#skillsContainer [data-reveal]').forEach(el => {
      revealObserver.observe(el);
    });
  }

  // ---- Render Projects ----
  function renderProjects() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    container.innerHTML = projectsData.map((project, index) => `
      <article class="project-card surface-card" data-reveal="zoom" style="--reveal-delay:${index * 90}ms">
        <div class="project-card__top">
          <span class="project-card__index">0${index + 1}</span>
          <span class="project-card__type">${project.type}</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-card__stack">
          ${project.stack.map(item => `<span>${item}</span>`).join('')}
        </div>

        <!--
        <a class="link-button project-card__link" href="${project.link}" target="_blank" rel="noreferrer">
          View Project
        </a>
        --->

      </article>
    `).join('');

    document.querySelectorAll('#projectsContainer [data-reveal]').forEach(el => {
      revealObserver.observe(el);
    });
  }

  // ---- Render all dynamic content ----
  renderExperience();
  renderSkills();
  renderProjects();

  // // ---- contact form ----
  // document.getElementById('contactForm').addEventListener('submit', function(e) {
  //   e.preventDefault();
  //   alert('Message sent successfully. Thank you for reaching out!');
  //   this.reset();
  // });

  
})();
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const revealItems = document.querySelectorAll(".reveal");
const projectCards = Array.from(document.querySelectorAll(".project-large-card"));
const footerYear = document.getElementById("year");
const scrollProgress = document.getElementById("scrollProgress");
const starField = document.getElementById("starField");

if (footerYear) {
  footerYear.textContent = String(new Date().getFullYear());
}

const buildStarField = () => {
  if (!starField) {
    return;
  }

  starField.replaceChildren();
  const starCount = window.innerWidth < 760 ? 110 : 190;

  for (let index = 0; index < starCount; index += 1) {
    const star = document.createElement("span");
    star.className = "star";

    if (index % 10 === 0) {
      star.classList.add("near");
    } else if (index % 3 === 0) {
      star.classList.add("mid");
    }

    const size = (Math.random() * 2.2 + 0.7).toFixed(2);
    const xPos = (Math.random() * 100).toFixed(2);
    const yPos = (Math.random() * 100).toFixed(2);
    const alpha = (Math.random() * 0.52 + 0.32).toFixed(2);
    const duration = (Math.random() * 5 + 4).toFixed(2);
    const delay = (Math.random() * 7).toFixed(2);

    star.style.setProperty("--size", `${size}px`);
    star.style.setProperty("--x", `${xPos}%`);
    star.style.setProperty("--y", `${yPos}%`);
    star.style.setProperty("--alpha", alpha);
    star.style.setProperty("--duration", `${duration}s`);
    star.style.setProperty("--delay", `${delay}s`);
    starField.appendChild(star);
  }
};

buildStarField();

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("open");
    siteNav.classList.toggle("open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("open");
      siteNav.classList.remove("open");
    });
  });

  document.addEventListener("click", (event) => {
    if (!siteNav.classList.contains("open")) {
      return;
    }

    const clickedInsideNav = siteNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);
    if (!clickedInsideNav && !clickedToggle) {
      menuToggle.classList.remove("open");
      siteNav.classList.remove("open");
    }
  });
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.14,
  }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 100}ms`;
  revealObserver.observe(item);
});

const projectCardObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  }
);

projectCards.forEach((card, index) => {
  card.classList.add("project-reveal");
  card.style.setProperty("--project-delay", `${Math.min(index * 120, 300)}ms`);
  projectCardObserver.observe(card);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        const isMatch = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", isMatch);
      });
    });
  },
  {
    rootMargin: "-38% 0px -50% 0px",
    threshold: 0.01,
  }
);

document.querySelectorAll("section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

const updateScrollProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

  if (scrollProgress) {
    scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }
};

updateScrollProgress();
window.addEventListener("scroll", updateScrollProgress, { passive: true });

let resizeTimeoutId;
window.addEventListener("resize", () => {
  updateScrollProgress();

  clearTimeout(resizeTimeoutId);
  resizeTimeoutId = window.setTimeout(() => {
    buildStarField();
  }, 180);
});

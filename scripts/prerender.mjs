import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  buildAbsoluteUrl,
  buildProjectPath,
  profile,
  projects
} from "../src/data.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const distDir = path.join(rootDir, "dist");
const distIndexPath = path.join(distDir, "index.html");
const distSitemapPath = path.join(distDir, "sitemap.xml");
const serverEntryPath = path.join(rootDir, ".ssr", "entry-server.js");
const rootMarker = '<div id="root"></div>';
const themeInitScript = `(() => {
  const defaultTheme = "light";
  try {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : prefersDark
          ? "dark"
          : defaultTheme;
    document.documentElement.setAttribute("data-theme", theme);
  } catch {
    document.documentElement.setAttribute("data-theme", defaultTheme);
  }
})();`;
const caseStudyNavItems = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "architecture", label: "Architecture" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" }
];
const caseStudyHeaderScript = `(() => {
  const doc = document.documentElement;
  const nav = document.querySelector("[data-case-study-nav]");
  const navLinks = nav ? nav.querySelectorAll("a") : [];
  const themeButton = document.querySelector("[data-case-study-theme-toggle]");
  const themeIcon = document.querySelector("[data-theme-icon]");
  const menuButton = document.querySelector("[data-case-study-menu-toggle]");
  const applyTheme = (theme) => {
    doc.setAttribute("data-theme", theme);
    if (themeIcon) themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  };

  applyTheme(doc.getAttribute("data-theme") === "dark" ? "dark" : "light");

  themeButton?.addEventListener("click", () => {
    const nextTheme = doc.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {}
  });

  menuButton?.addEventListener("click", () => {
    if (!nav) return;
    const nextOpen = !nav.classList.contains("open");
    nav.classList.toggle("open", nextOpen);
    menuButton.setAttribute("aria-expanded", String(nextOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });
})();`;

const caseStudyMotionStyles = `
      .case-study-loader {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 1.25rem;
        color: #fff;
        background: #050505;
        transform: translateY(0);
        opacity: 1;
        transition: transform 0.8s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.45s ease;
      }

      .case-study-loader.is-complete {
        transform: translateY(-100%);
        opacity: 0;
        pointer-events: none;
      }

      .case-study-loader-title {
        font-size: clamp(2.35rem, 9vw, 4rem);
        font-weight: 700;
        line-height: 1;
        letter-spacing: 0;
      }

      .case-study-loader-track {
        width: min(220px, 46vw);
        height: 2px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.2);
      }

      .case-study-loader-fill {
        width: 100%;
        height: 100%;
        background: #fff;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.08s linear;
      }

      body,
      a,
      button,
      input,
      textarea,
      select {
        cursor: auto !important;
      }

      body.case-study-motion-ready,
      body.case-study-motion-ready a,
      body.case-study-motion-ready button,
      body.case-study-motion-ready input,
      body.case-study-motion-ready textarea,
      body.case-study-motion-ready select {
        cursor: none !important;
      }

      .case-study-cursor {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        pointer-events: none;
        opacity: 0;
        mix-blend-mode: difference;
        background: var(--case-cursor-bg, rgba(40, 217, 173, 0.8));
        transform: translate3d(var(--case-cursor-x, -50px), var(--case-cursor-y, -50px), 0) translate(-50%, -50%) scale(var(--case-cursor-scale, 1));
        transition: opacity 0.2s ease, background-color 0.2s ease;
      }

      body.case-study-motion-ready .case-study-cursor {
        opacity: 1;
      }

      .case-study-animate {
        opacity: 0;
        transform: translateY(58px);
        transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.76, 0, 0.24, 1);
        transition-delay: var(--case-motion-delay, 0s);
        will-change: opacity, transform;
      }

      .case-study-animate.is-visible {
        opacity: 1;
        transform: translateY(0);
      }

      .case-study-title {
        display: flex;
        flex-wrap: wrap;
      }

      .case-study-title-word {
        display: inline-block;
        overflow: hidden;
        padding-bottom: 0.1em;
      }

      .case-study-title-word span {
        display: inline-block;
        transform: translateY(108%);
        transition: transform 0.8s cubic-bezier(0.76, 0, 0.24, 1);
        transition-delay: var(--case-word-delay, 0s);
      }

      .is-visible .case-study-title-word span {
        transform: translateY(0);
      }

      [data-case-study-stagger] > .case-study-stagger-item {
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.76, 0, 0.24, 1);
        transition-delay: var(--case-stagger-delay, 0s);
      }

      [data-case-study-stagger].is-visible > .case-study-stagger-item {
        opacity: 1;
        transform: translateY(0);
      }

      @media (pointer: coarse) {
        .case-study-cursor {
          display: none;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .case-study-loader,
        .case-study-cursor {
          display: none;
        }

        .case-study-animate,
        [data-case-study-stagger] > .case-study-stagger-item,
        .case-study-title-word span {
          opacity: 1;
          transform: none;
          transition: none;
        }
      }
`;

const caseStudyMotionScript = `(() => {
  const body = document.body;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const loader = document.querySelector("[data-case-study-loader]");
  const loaderValue = document.querySelector("[data-case-study-loader-value]");
  const loaderFill = document.querySelector("[data-case-study-loader-fill]");

  const showAllMotionTargets = () => {
    document
      .querySelectorAll("[data-case-study-animate], [data-case-study-stagger]")
      .forEach((element) => element.classList.add("is-visible"));
  };

  document.querySelectorAll("[data-case-study-animate]").forEach((element) => {
    const delay = Number(element.getAttribute("data-case-study-delay") || 0);
    element.classList.add("case-study-animate");
    element.style.setProperty("--case-motion-delay", delay.toFixed(2) + "s");
  });

  document.querySelectorAll(".case-study-title-word span").forEach((element, index) => {
    element.style.setProperty("--case-word-delay", (0.1 + index * 0.04).toFixed(2) + "s");
  });

  document.querySelectorAll("[data-case-study-stagger]").forEach((container) => {
    Array.from(container.children).forEach((item, index) => {
      item.classList.add("case-study-stagger-item");
      item.style.setProperty("--case-stagger-delay", (0.1 + index * 0.055).toFixed(3) + "s");
    });
  });

  if (prefersReducedMotion) {
    showAllMotionTargets();
    loader?.remove();
    return;
  }

  let progress = 0;
  let pageLoaded = document.readyState === "complete";

  const setLoaderProgress = (nextProgress) => {
    progress = Math.max(progress, Math.min(100, nextProgress));
    if (loaderValue) loaderValue.textContent = String(Math.round(progress));
    if (loaderFill) loaderFill.style.transform = "scaleX(" + progress / 100 + ")";
  };

  const completeLoader = () => {
    if (!loader || loader.classList.contains("is-complete")) return;
    setLoaderProgress(100);
    loader.classList.add("is-complete");
    window.setTimeout(() => loader.remove(), 900);
  };

  if (loader) {
    const loaderTimer = window.setInterval(() => {
      const ceiling = pageLoaded ? 100 : 88;
      setLoaderProgress(Math.min(ceiling, progress + Math.random() * 9 + 3));
      if (progress >= 100) {
        window.clearInterval(loaderTimer);
        window.setTimeout(completeLoader, 220);
      }
    }, 48);

    const markLoaded = () => {
      pageLoaded = true;
      window.setTimeout(() => {
        window.clearInterval(loaderTimer);
        completeLoader();
      }, 360);
    };

    if (pageLoaded) {
      markLoaded();
    } else {
      window.addEventListener("load", markLoaded, { once: true });
    }
  }

  const staggerContainers = Array.from(document.querySelectorAll("[data-case-study-stagger]"));
  const revealTargets = Array.from(
    new Set([
      ...document.querySelectorAll("[data-case-study-animate]"),
      ...staggerContainers
    ])
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealTargets.forEach((target) => observer.observe(target));
  } else {
    showAllMotionTargets();
  }

  const cursor = document.querySelector("[data-case-study-cursor]");

  if (cursor && finePointer) {
    body.classList.add("case-study-motion-ready");

    const pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      scale: 1
    };
    const rendered = {
      x: pointer.x,
      y: pointer.y,
      scale: pointer.scale
    };

    const setHoverState = (isHovered) => {
      pointer.scale = isHovered ? 2.5 : 1;
      cursor.style.setProperty(
        "--case-cursor-bg",
        isHovered ? "rgba(255, 255, 255, 1)" : "rgba(40, 217, 173, 0.8)"
      );
    };

    const animateCursor = () => {
      rendered.x += (pointer.x - rendered.x) * 0.24;
      rendered.y += (pointer.y - rendered.y) * 0.24;
      rendered.scale += (pointer.scale - rendered.scale) * 0.2;
      cursor.style.setProperty("--case-cursor-x", rendered.x.toFixed(2) + "px");
      cursor.style.setProperty("--case-cursor-y", rendered.y.toFixed(2) + "px");
      cursor.style.setProperty("--case-cursor-scale", rendered.scale.toFixed(3));
      window.requestAnimationFrame(animateCursor);
    };

    window.addEventListener("mousemove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    });

    window.addEventListener("mouseover", (event) => {
      setHoverState(Boolean(event.target.closest("a, button, .chip, .case-study-panel")));
    });

    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = "";
    });

    animateCursor();
  }

  const shouldSmoothScroll = finePointer && !prefersReducedMotion;

  if (shouldSmoothScroll) {
    let currentScroll = window.scrollY;
    let targetScroll = currentScroll;
    let isAnimatingScroll = false;

    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const clampScroll = (value) => Math.min(Math.max(value, 0), maxScroll());

    const animateScroll = () => {
      isAnimatingScroll = true;
      currentScroll += (targetScroll - currentScroll) * 0.12;

      if (Math.abs(targetScroll - currentScroll) < 0.5) {
        currentScroll = targetScroll;
        window.scrollTo(0, currentScroll);
        isAnimatingScroll = false;
        return;
      }

      window.scrollTo(0, currentScroll);
      window.requestAnimationFrame(animateScroll);
    };

    const startSmoothScroll = () => {
      if (!isAnimatingScroll) {
        window.requestAnimationFrame(animateScroll);
      }
    };

    window.addEventListener(
      "wheel",
      (event) => {
        if (event.ctrlKey || event.metaKey) return;
        event.preventDefault();
        targetScroll = clampScroll(targetScroll + event.deltaY);
        startSmoothScroll();
      },
      { passive: false }
    );

    window.addEventListener(
      "keydown",
      (event) => {
        const activeTag = document.activeElement?.tagName;
        if (/INPUT|TEXTAREA|SELECT/.test(activeTag || "")) return;

        const viewportStep = window.innerHeight * 0.86;
        const keySteps = {
          ArrowDown: 92,
          ArrowUp: -92,
          PageDown: viewportStep,
          PageUp: -viewportStep,
          Home: -Infinity,
          End: Infinity,
          " ": event.shiftKey ? -viewportStep : viewportStep
        };

        if (!(event.key in keySteps)) return;
        event.preventDefault();

        const step = keySteps[event.key];
        if (step === Infinity) {
          targetScroll = maxScroll();
        } else if (step === -Infinity) {
          targetScroll = 0;
        } else {
          targetScroll = clampScroll((isAnimatingScroll ? targetScroll : window.scrollY) + step);
        }

        currentScroll = window.scrollY;
        startSmoothScroll();
      },
      { passive: false }
    );

    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href^='#']");
      if (!link) return;

      const id = link.getAttribute("href").slice(1);
      const target = id ? document.getElementById(id) : document.body;
      if (!target) return;

      event.preventDefault();
      currentScroll = window.scrollY;
      targetScroll = clampScroll(target.getBoundingClientRect().top + window.scrollY - 88);
      startSmoothScroll();
    });

    window.addEventListener(
      "scroll",
      () => {
        if (!isAnimatingScroll) {
          currentScroll = window.scrollY;
          targetScroll = currentScroll;
        }
      },
      { passive: true }
    );

    window.addEventListener("resize", () => {
      targetScroll = clampScroll(targetScroll);
    });
  }
})();`;

const [{ render }, template] = await Promise.all([
  import(pathToFileURL(serverEntryPath).href),
  readFile(distIndexPath, "utf8")
]);

if (typeof render !== "function") {
  throw new Error(`Expected a render() export from ${serverEntryPath}`);
}

const prerenderedHomeHtml = template.includes(rootMarker)
  ? template.replace(rootMarker, `<div id="root">${render()}</div>`)
  : template;

const stylesheetHref = prerenderedHomeHtml.match(
  /<link rel="stylesheet" crossorigin href="([^"]+)">/
)?.[1];

if (!stylesheetHref) {
  throw new Error("Expected a built stylesheet link in dist/index.html");
}

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const serializeJsonLd = (value) =>
  JSON.stringify(value, null, 2).replace(/</g, "\\u003c");

const truncate = (value = "", maxLength = 160) =>
  value.length <= maxLength ? value : `${value.slice(0, maxLength - 1).trim()}…`;

const toOutputSubdir = (routePath = "/") => routePath.replace(/^\/+|\/+$/g, "");

const inferFocusAreas = (project) => {
  const stack = project.stack.map((item) => item.toLowerCase());
  const focusAreas = [];

  if (stack.some((item) => /jenkins|github|ci\/cd/.test(item))) {
    focusAreas.push(
      "Release engineering coverage across source control, pipeline orchestration, quality gates, and rollback readiness."
    );
  }

  if (stack.some((item) => /kubernetes|eks|aks|iks|helm|hpa/.test(item))) {
    focusAreas.push(
      "Container platform operations with orchestration, scaling controls, and resilient runtime design."
    );
  }

  if (stack.some((item) => /terraform|ansible|iac|auto scaling|elastic load balancing/.test(item))) {
    focusAreas.push(
      "Infrastructure automation using repeatable provisioning, configuration management, and production-safe rollout patterns."
    );
  }

  if (stack.some((item) => /cloudwatch|monitoring|grafana|prometheus|sla|mttr|recovery/.test(item))) {
    focusAreas.push(
      "Observability and incident-response improvements focused on visibility, alerting, and service reliability."
    );
  }

  if (!focusAreas.length) {
    focusAreas.push(
      `Hands-on delivery using ${project.stack.slice(0, 4).join(", ")} across design, implementation, and operational ownership.`
    );
  }

  return focusAreas.slice(0, 3);
};

const getProjectHighlights = (project) => {
  if (project.highlights?.length) return project.highlights;

  return [
    `Delivered as a ${project.category.toLowerCase()} portfolio case study with hands-on ownership of implementation details.`,
    `Primary stack coverage included ${project.stack.join(", ")}.`,
    "Built to demonstrate practical engineering depth across delivery, reliability, and execution."
  ];
};

const renderChips = (items) =>
  items
    .map((item) => `<span class="chip ghost">${escapeHtml(item)}</span>`)
    .join("");

const renderListItems = (items) =>
  items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

const renderStaggeredWords = (value = "") =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (word) =>
        `<span class="case-study-title-word"><span>${escapeHtml(word)}&nbsp;</span></span>`
    )
    .join("");

const renderCaseStudyHeader = () => `
    <header class="site-header">
      <nav class="nav" data-case-study-nav>
        <a class="nav-link nav-btn" href="/">Top</a>
        ${caseStudyNavItems
          .map(
            (item) =>
              `<a class="nav-link" href="/#${escapeHtml(item.id)}">${escapeHtml(item.label)}</a>`
          )
          .join("")}
      </nav>

      <div class="header-controls">
        <button
          class="theme-toggle"
          type="button"
          data-case-study-theme-toggle
          aria-label="Toggle dark and light mode"
          title="Toggle theme"
        >
          <span aria-hidden="true" data-theme-icon>☾</span>
        </button>
      </div>

      <button
        class="menu-toggle"
        type="button"
        data-case-study-menu-toggle
        aria-label="Toggle navigation"
        aria-expanded="false"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
`;

const renderProjectPage = (project) => {
  const projectPath = buildProjectPath(project);
  const canonicalUrl = buildAbsoluteUrl(projectPath);
  const pageTitle = `${project.name} | Darshan Bhamare`;
  const metaDescription = truncate(
    `${project.name} case study by Darshan Bhamare. ${project.summary}`,
    165
  );
  const keywords = [
    profile.name,
    project.category,
    ...project.stack,
    "case study",
    "portfolio"
  ].join(", ");
  const focusAreas = inferFocusAreas(project);
  const projectHighlights = getProjectHighlights(project);
  const websiteUrl = buildAbsoluteUrl("/");
  const socialImageUrl = buildAbsoluteUrl("/social-preview-v2.jpg");
  const platformAction = project.link
    ? `<a href="${escapeHtml(project.link)}" target="_blank" rel="noreferrer">${escapeHtml(
        project.linkLabel || "Visit Platform"
      )}</a>`
    : "";

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${canonicalUrl}#case-study`,
    headline: project.name,
    name: project.name,
    description: metaDescription,
    url: canonicalUrl,
    keywords: project.stack.join(", "),
    creator: {
      "@type": "Person",
      name: profile.name,
      url: websiteUrl
    },
    author: {
      "@type": "Person",
      name: profile.name,
      url: websiteUrl
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${websiteUrl}#website`,
      url: websiteUrl,
      name: `${profile.name} Portfolio`
    },
    about: [
      {
        "@type": "Thing",
        name: project.category
      },
      ...project.stack.slice(0, 6).map((item) => ({
        "@type": "Thing",
        name: item
      }))
    ]
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Portfolio",
        item: websiteUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: buildAbsoluteUrl("/#projects")
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.name,
        item: canonicalUrl
      }
    ]
  };

  return `<!doctype html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script>${themeInitScript}</script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
    />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.svg" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta name="robots" content="index, follow" />
    <meta name="description" content="${escapeHtml(metaDescription)}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="author" content="${escapeHtml(profile.name)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Darshan Bhamare Portfolio" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(metaDescription)}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:image" content="${escapeHtml(socialImageUrl)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(project.name)} case study preview" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(metaDescription)}" />
    <meta name="twitter:image" content="${escapeHtml(socialImageUrl)}" />
    <title>${escapeHtml(pageTitle)}</title>
    <script type="application/ld+json">
${serializeJsonLd(creativeWorkJsonLd)}
    </script>
    <script type="application/ld+json">
${serializeJsonLd(breadcrumbJsonLd)}
    </script>
    <link rel="stylesheet" crossorigin href="${escapeHtml(stylesheetHref)}" />
    <style>
${caseStudyMotionStyles}
    </style>
  </head>
  <body>
    <div class="case-study-loader" data-case-study-loader aria-hidden="true">
      <div class="case-study-loader-title">Loading <span data-case-study-loader-value>0</span>%</div>
      <div class="case-study-loader-track">
        <div class="case-study-loader-fill" data-case-study-loader-fill></div>
      </div>
    </div>
    <div class="case-study-cursor" data-case-study-cursor aria-hidden="true"></div>
    ${renderCaseStudyHeader()}
    <main class="page case-study-page">
      <div class="case-study-shell">
        <a class="back-link" href="/#projects" data-case-study-animate data-case-study-delay="0.02">← Back to portfolio</a>

        <section class="block case-study-hero" data-case-study-animate data-case-study-delay="0.08">
          <p class="role-line">Case Study • ${escapeHtml(project.category)}</p>
          <h1 class="case-study-title">${renderStaggeredWords(project.name)}</h1>
          <p class="hero-copy">${escapeHtml(project.summary)}</p>

          <div class="chip-wrap" data-case-study-stagger>
            ${renderChips(project.stack)}
          </div>

          <div class="hero-actions" data-case-study-stagger>
            ${platformAction}
            <a href="/#contact">Contact Darshan</a>
            <a href="${escapeHtml(profile.linkedin)}" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="${escapeHtml(profile.resumeLabel)}" target="_blank" rel="noreferrer">Resume</a>
          </div>
        </section>

        <section class="case-study-grid" data-case-study-stagger>
          <article class="block case-study-panel">
            <h2>Project Overview</h2>
            <p>
              ${escapeHtml(project.summary)}
            </p>
            <p>
              This project showcases delivery across ${escapeHtml(project.category.toLowerCase())}
              workflows with practical emphasis on architecture, execution quality, and operational ownership.
            </p>
          </article>

          <article class="block case-study-panel">
            <h2>Delivery Focus</h2>
            <ul class="project-highlights case-study-list">
              ${renderListItems(focusAreas)}
            </ul>
          </article>
        </section>

        <section class="block" data-case-study-animate>
          <h2>Execution Highlights</h2>
          <ul class="project-highlights case-study-list" data-case-study-stagger>
            ${renderListItems(projectHighlights)}
          </ul>
        </section>

        <section class="block contact case-study-cta" data-case-study-animate>
          <h2>Discuss This Project</h2>
          <p>
            Available for cloud engineering, DevOps, platform, and SRE roles with hands-on ownership across delivery and operations.
          </p>
          <div class="hero-actions" data-case-study-stagger>
            <a href="/#contact">Open Contact Form</a>
            <a href="${escapeHtml(profile.linkedin)}" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="${escapeHtml(profile.resumeLabel)}" target="_blank" rel="noreferrer">Resume</a>
          </div>
        </section>
      </div>
    </main>
    <script>${caseStudyHeaderScript}</script>
    <script>${caseStudyMotionScript}</script>
  </body>
</html>
`;
};

const renderSitemap = () => {
  const entries = [
    {
      loc: buildAbsoluteUrl("/"),
      changefreq: "weekly",
      priority: "1.0"
    },
    ...projects.map((project) => ({
      loc: buildAbsoluteUrl(buildProjectPath(project)),
      changefreq: "monthly",
      priority: "0.9"
    }))
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
};

await writeFile(distIndexPath, prerenderedHomeHtml);

await Promise.all(
  projects.map(async (project) => {
    const projectDir = path.join(distDir, toOutputSubdir(buildProjectPath(project)));
    await mkdir(projectDir, { recursive: true });
    await writeFile(path.join(projectDir, "index.html"), renderProjectPage(project));
  })
);

await writeFile(distSitemapPath, renderSitemap());

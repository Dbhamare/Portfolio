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

const [{ render }, template] = await Promise.all([
  import(pathToFileURL(serverEntryPath).href),
  readFile(distIndexPath, "utf8")
]);

if (typeof render !== "function") {
  throw new Error(`Expected a render() export from ${serverEntryPath}`);
}

if (!template.includes(rootMarker)) {
  throw new Error(`Expected ${rootMarker} in ${distIndexPath}`);
}

const appHtml = render();
const prerenderedHomeHtml = template.replace(
  rootMarker,
  `<div id="root">${appHtml}</div>`
);

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
  </head>
  <body>
    ${renderCaseStudyHeader()}
    <main class="page case-study-page">
      <div class="case-study-shell">
        <a class="back-link" href="/#projects">← Back to portfolio</a>

        <section class="block case-study-hero">
          <p class="role-line">Case Study • ${escapeHtml(project.category)}</p>
          <h1>${escapeHtml(project.name)}</h1>
          <p class="hero-copy">${escapeHtml(project.summary)}</p>

          <div class="chip-wrap">
            ${renderChips(project.stack)}
          </div>

          <div class="hero-actions">
            <a href="/#contact">Contact Darshan</a>
            <a href="${escapeHtml(profile.linkedin)}" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="${escapeHtml(profile.resumeLabel)}" target="_blank" rel="noreferrer">Resume</a>
          </div>
        </section>

        <section class="case-study-grid">
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

        <section class="block">
          <h2>Execution Highlights</h2>
          <ul class="project-highlights case-study-list">
            ${renderListItems(projectHighlights)}
          </ul>
        </section>

        <section class="block contact case-study-cta">
          <h2>Discuss This Project</h2>
          <p>
            Available for cloud engineering, DevOps, platform, and SRE roles with hands-on ownership across delivery and operations.
          </p>
          <div class="hero-actions">
            <a href="/#contact">Open Contact Form</a>
            <a href="${escapeHtml(profile.linkedin)}" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="${escapeHtml(profile.resumeLabel)}" target="_blank" rel="noreferrer">Resume</a>
          </div>
        </section>
      </div>
    </main>
    <script>${caseStudyHeaderScript}</script>
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

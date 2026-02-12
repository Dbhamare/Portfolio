import { useEffect, useMemo, useState } from "react";
import {
  achievements,
  certifications,
  education,
  experience,
  highlights,
  profile,
  projects,
  skills
} from "./data";

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" }
];

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState("All");
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const categories = useMemo(
    () => ["All", ...new Set(projects.map((item) => item.category))],
    []
  );
  const filteredProjects = useMemo(() => {
    if (projectFilter === "All") return projects;
    return projects.filter((item) => item.category === projectFilter);
  }, [projectFilter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.1 }
    );

    const hidden = document.querySelectorAll(".reveal");
    hidden.forEach((el) => observer.observe(el));
    return () => hidden.forEach((el) => observer.unobserve(el));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="page">
      <header className="site-header">
        <a className="brand" href="#">
          {profile.name}
        </a>
        <button
          className="theme-toggle"
          type="button"
          onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
          aria-label="Toggle dark and light mode"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
        <button
          className="menu-toggle"
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`nav ${mobileOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={closeMobile}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero reveal">
          <p className="eyebrow">{profile.role}</p>
          <h1>{profile.name}</h1>
          <p className="hero-copy">{profile.headline}</p>
          <p className="meta">{profile.location}</p>
          <div className="hero-actions">
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={profile.resumeLabel}>Resume</a>
          </div>
          <div className="stats">
            {highlights.map((item) => (
              <article className="stat-card" key={item.label}>
                <p>{item.value}</p>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="block reveal">
          <h2>About</h2>
          <p>
            I am targeting mid and senior opportunities in Cloud Operations,
            DevOps, Site Reliability Engineering, Platform Engineering, and SME
            Linux/Windows System Administration. I am currently based for UK
            opportunities and available for relocation and remote roles.
          </p>
          <div className="chip-wrap">
            {skills.map((skill) => (
              <span className="chip" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section id="experience" className="block reveal">
          <h2>Experience</h2>
          <div className="timeline">
            {experience.map((item) => (
              <article className="timeline-card" key={item.company + item.title}>
                <h3>{item.title}</h3>
                <p className="meta">
                  {item.company} | {item.duration}
                </p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="education" className="block reveal">
          <h2>Education</h2>
          <div className="timeline">
            {education.map((item) => (
              <article className="timeline-card" key={item.degree}>
                <h3>{item.degree}</h3>
                <p className="meta">
                  {item.school} | {item.duration}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="block reveal">
          <div className="section-head">
            <h2>Projects</h2>
            <div className="filters">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setProjectFilter(category)}
                  className={projectFilter === category ? "active" : ""}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="project-grid">
            {filteredProjects.map((item) => (
              <article className="project-card" key={item.name}>
                <h3>{item.name}</h3>
                <p>{item.summary}</p>
                <div className="chip-wrap">
                  {item.stack.map((tool) => (
                    <span className="chip ghost" key={tool}>
                      {tool}
                    </span>
                  ))}
                </div>
                <a href={item.link} target="_blank" rel="noreferrer">
                  View Project
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="block reveal">
          <h2>Certifications</h2>
          <ul className="plain-list">
            {certifications.map((cert) => (
              <li key={cert}>{cert}</li>
            ))}
          </ul>
        </section>

        <section className="block reveal">
          <h2>Achievements</h2>
          <ul className="plain-list">
            {achievements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="contact" className="block reveal contact">
          <h2>Contact</h2>
          <p>
            Open to full-time opportunities, contract projects, and technical
            collaborations.
          </p>
          <div className="hero-actions">
            <a href={`mailto:${profile.email}`}>Email</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

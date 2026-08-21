import { useState, useEffect } from "react";

/* ─── CONSTANTS ─────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  ["about",        "#about"],
  ["projects",     "#projects"],
  ["experience",   "#experience"],
  ["certificates", "#certificates"],
  ["webinars",     "#webinars"],
  ["resume",       "#resume"],
];

/* ─── NOTION FETCHER ────────────────────────────────────────────────────── */
// All data now comes from Notion via a Netlify serverless function.
// To add a certificate, project, or webinar: just edit your Notion database.
// No code changes needed.

async function fetchNotion(type) {
  const res = await fetch(`/.netlify/functions/notion?type=${type}`);
  if (!res.ok) throw new Error(`Failed to fetch ${type}`);
  return res.json();
}

/* ─── ICONS ─────────────────────────────────────────────────────────────── */

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 17L17 7M17 7H7M17 7v10"/>
  </svg>
);

const BackIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 7L7 17M7 17h10M7 17V7"/>
  </svg>
);

const HamburgerIcon = ({ open }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    {open
      ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
      : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>
    }
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s", flexShrink: 0 }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

/* ─── LOADING SKELETON ──────────────────────────────────────────────────── */

function LoadingScreen() {
  return (
    <div style={{
      minHeight: "100vh", background: "#17140F",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: "1rem",
    }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#4a654a", letterSpacing: "0.25em" }}>
        loading portfolio...
      </div>
      <div style={{ width: "120px", height: "1px", background: "rgba(145,168,130,0.15)", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent, #91A882, transparent)",
          animation: "shimmer 1.4s ease-in-out infinite",
        }} />
      </div>
    </div>
  );
}

/* ─── SHARED COMPONENTS ─────────────────────────────────────────────────── */

function SectionHeader({ num, label }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", marginBottom: "2rem" }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--tx3)", letterSpacing: "0.1em" }}>{num} —</span>
      <span style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--acc)", letterSpacing: "0.22em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

function ShowAllBtn({ label, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}
      style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", letterSpacing: "0.1em", padding: "0.65rem 1.4rem", background: "transparent", color: hov ? "var(--tx)" : "var(--acc)", border: "1px solid var(--div)", cursor: "pointer", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "1.25rem" }}>
      {label} <ArrowIcon />
    </button>
  );
}

function CertRow({ c }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: "0.7rem 1rem", display: "flex", gap: "0.75rem", alignItems: "center", background: hov ? "rgba(145,168,130,0.04)" : "transparent", transition: "background 0.2s" }}>
      <img src={c.badgeImg} alt={c.title} style={{ width: "36px", height: "36px", objectFit: "contain", flexShrink: 0, borderRadius: "3px" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--display)", fontSize: "0.88rem", fontWeight: 400, color: "var(--tx)", lineHeight: 1.3, marginBottom: "0.15rem" }}>{c.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--tx3)", letterSpacing: "0.05em" }}>{c.issuer} · {c.date}</span>
          <a href={c.verifyHref} target="_blank" rel="noreferrer"
            style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: hov ? "var(--acc)" : "var(--tx3)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
            verify <ArrowIcon />
          </a>
        </div>
      </div>
    </div>
  );
}

function WebinarGroup({ theme, items }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--div)" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "0.75rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--acc)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {theme} <span style={{ color: "var(--tx3)" }}>({items.length})</span>
        </span>
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div style={{ paddingBottom: "0.5rem" }}>
          {items.map((w, i) => <WebinarRow key={i} w={w} isLast={i === items.length - 1} />)}
        </div>
      )}
    </div>
  );
}

function WebinarRow({ w, isLast }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", padding: "0.45rem 0", borderBottom: isLast ? "none" : "1px solid rgba(145,168,130,0.05)" }}>
      <span style={{ fontFamily: "var(--display)", fontSize: "0.85rem", fontWeight: 400, color: hov ? "var(--tx)" : "var(--tx2)", transition: "color 0.2s", lineHeight: 1.4, flex: 1 }}>{w.title}</span>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.15rem", flexShrink: 0 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--tx3)", whiteSpace: "nowrap" }}>{w.date}</span>
        <a href={w.file} target="_blank" rel="noreferrer"
          style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: hov ? "var(--acc)" : "var(--tx3)", textDecoration: "none" }}>view</a>
      </div>
    </div>
  );
}

/* ─── ALL CERTIFICATES PAGE ─────────────────────────────────────────────── */

function AllCertificatesPage({ onBack, certifications }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="wrapper" style={{ paddingTop: "6rem", paddingBottom: "4rem" }}>
      <button onClick={onBack}
        style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", background: "none", border: "none", color: "var(--tx3)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "2rem", letterSpacing: "0.08em" }}>
        <BackIcon /> back to portfolio
      </button>
      <SectionHeader num="04" label={`all certificates · ${certifications.length} total`} />
      <div className="certs-grid">
        {certifications.map((c, i) => <CertRow key={c.id ?? i} c={c} />)}
      </div>
    </div>
  );
}

/* ─── ALL WEBINARS PAGE ─────────────────────────────────────────────────── */

function AllWebinarsPage({ onBack, webinars }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const webinarTotal = Object.values(webinars).flat().length;
  return (
    <div className="wrapper" style={{ paddingTop: "6rem", paddingBottom: "4rem" }}>
      <button onClick={onBack}
        style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", background: "none", border: "none", color: "var(--tx3)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "2rem", letterSpacing: "0.08em" }}>
        <BackIcon /> back to portfolio
      </button>
      <SectionHeader num="05" label={`all webinars & training · ${webinarTotal} sessions`} />
      <div className="webinars-wrap">
        <div className="webinar-summary" style={{ borderBottom: "1px solid var(--div)" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--tx3)", letterSpacing: "0.08em" }}>
            {Object.keys(webinars).length} themes · click to expand
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--tx3)" }}>
            {Object.values(webinars).map(i => i.length).join(" + ")}
          </span>
        </div>
        <div style={{ padding: "0 1rem" }}>
          {Object.entries(webinars).map(([theme, items]) => (
            <WebinarGroup key={theme} theme={theme} items={items} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PORTFOLIO ────────────────────────────────────────────────────── */

function MainPortfolio({ setPage, certifications, projects, experience, webinars }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const webinarTotal = Object.values(webinars).flat().length;
  const previewCerts = certifications.slice(0, 6);
  const previewWebinarEntries = Object.entries(webinars).slice(0, 5);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const fn = () => setMenuOpen(false);
      window.addEventListener("scroll", fn, { once: true });
      return () => window.removeEventListener("scroll", fn);
    }
  }, [menuOpen]);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <>
      {/* MOBILE MENU */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map(([l, h]) => (
          <a key={l} onClick={() => handleNavClick(h)}>{l}</a>
        ))}
      </div>

      {/* NAV */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <a className="nav-name" href="#home">John Achilles Colon</a>
        <ul className="nav-links">
          {NAV_LINKS.map(([l, h]) => (
            <li key={l}><a href={h}>{l}</a></li>
          ))}
        </ul>
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
          <HamburgerIcon open={menuOpen} />
        </button>
      </nav>

      <div className="wrapper">

        {/* HERO */}
        <div className="hero">
          <div className="hero-inner">
            <div>
              <div className="hero-eyebrow">BSIT Graduate · Iloilo, Philippines</div>
              <h1 className="hero-name">John Achilles<br />Colon</h1>
              <p className="hero-location">Open to IT & Data Analytics roles</p>
              <p className="hero-bio">
                Information Technology graduate building a foundation in data analytics —
                turning raw datasets into clear, business-relevant insights using SQL, Power BI, and BigQuery.
              </p>
              <div className="hero-stats">
                <div className="stat-chip"><span>{certifications.length}</span> certificates</div>
                <div className="stat-chip"><span>{webinarTotal}</span> webinars</div>
                <div className="stat-chip"><span>NBI</span> internship</div>
                <div className="stat-chip"><span>BaHanap</span> researcher</div>
              </div>
              <div className="hero-divider" />
              <div className="socials">
                {[
                  { label: "github",   href: "https://github.com/acheachi/",       Icon: GithubIcon },
                  { label: "linkedin", href: "https://linkedin.com/in/john-achilles-colon-52491922b/", Icon: LinkedinIcon },
                  { label: "email",    href: "mailto:colon.johnachillesv11d@gmail.com", Icon: EmailIcon },
                ].map(({ label, href, Icon }) => (
                  <a key={label} href={href} className="social-link" target="_blank" rel="noreferrer">
                    <Icon /><span>{label}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="hero-photo">
              <img src="/photo.jpg" alt="John Achilles Colon" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>

        {/* 01 — ABOUT */}
        <div id="about" className="section">
          <SectionHeader num="01" label="about" />
          <div className="about-grid">
            <div className="about-text">
              <p><strong>Bachelor of Science in Information Technology</strong> graduate with experience in <strong>cybersecurity</strong>, <strong>system development</strong>, and <strong>project management</strong>.</p>
              <p>Completed an internship at the <strong>National Bureau of Investigation Region VI</strong>, contributing to the development of a Case File Management System and supporting IT operations.</p>
              <p>Contributed as a researcher on the <strong>BaHanap</strong> project — an offline flood rescue communication system using LoRaWAN and IoT developed for thesis and startup competitions.</p>
              <p>Currently building a foundation in <strong>data analytics</strong> — turning raw datasets into clear, business-relevant insights using SQL and dashboards. Open to entry-level <strong>Information Technology-related</strong> roles.</p>
            </div>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--acc)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "0.85rem" }}>skills</div>
              <div className="skills-list">
                {["SQL","Data Visualization","Power BI","Power Query","Google Workspace","Microsoft 365","Cybersecurity","Cloud Security","Programming (Java, C++, C#, HTML/CSS, JS, React)","Project Management","Problem-Solving","Communication Skills","Python","Teamwork & Collaboration"].map(s => (
                  <div key={s} className="skill-item">{s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 02 — PROJECTS */}
        <div id="projects" className="section">
          <SectionHeader num="02" label="projects" />
          <div className="projects-grid">
            {projects.map((p, i) => {
              const [hov, setHov] = useState(false);
              return (
                <div key={p.id ?? i} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                  style={{
                    padding: "1.5rem", border: "1px solid var(--div)",
                    background: hov ? "rgba(145,168,130,0.04)" : "transparent",
                    transition: "background 0.3s, border-color 0.3s", cursor: "default",
                    display: "flex", flexDirection: "column",
                    borderColor: hov ? "rgba(145,168,130,0.3)" : "var(--div)",
                  }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--acc)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.6rem" }}>{p.tag}</div>
                  <h3 style={{ fontFamily: "var(--display)", fontSize: "1.25rem", fontWeight: 400, color: "var(--tx)", marginBottom: "0.6rem", lineHeight: 1.2, letterSpacing: "-0.01em" }}>{p.title}</h3>
                  <p style={{ fontFamily: "var(--body)", fontSize: "0.82rem", color: "var(--tx2)", lineHeight: 1.8, marginBottom: "1rem", flex: 1 }}>{p.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "1rem" }}>
                    {(Array.isArray(p.tech) ? p.tech : (p.tech ?? "").split(",").map(t => t.trim())).map(t => (
                      <span key={t} style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--tx3)", padding: "0.15rem 0.5rem", border: "1px solid rgba(145,168,130,0.15)" }}>{t}</span>
                    ))}
                  </div>
                  <a href={p.href} target="_blank" rel="noreferrer"
                    style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: hov ? "var(--acc)" : "var(--tx3)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem", transition: "color 0.2s", letterSpacing: "0.08em" }}>
                    view source <ArrowIcon />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* 03 — EXPERIENCE */}
        <div id="experience" className="section">
          <SectionHeader num="03" label="experience" />
          <div className="exp-wrap">
            {experience.map((e, i) => (
              <div key={e.id ?? i} style={{
                display: "grid", gridTemplateColumns: "90px 1fr", gap: "2rem",
                paddingBottom: i === experience.length - 1 ? 0 : "2rem",
                marginBottom: i === experience.length - 1 ? 0 : "2rem",
                borderBottom: i === experience.length - 1 ? "none" : "1px solid var(--div)",
                alignItems: "start",
              }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem", paddingTop: "0.2rem" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--tx3)", letterSpacing: "0.08em" }}>{e.year}</span>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--acc)", opacity: 0.6 }} />
                </div>
                <div style={{ borderLeft: "1px solid var(--div)", paddingLeft: "1.5rem" }}>
                  <div style={{ fontFamily: "var(--display)", fontSize: "1.15rem", fontWeight: 400, color: "var(--tx)", marginBottom: "0.2rem", lineHeight: 1.2 }}>{e.role}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.63rem", color: "var(--acc)", letterSpacing: "0.06em", marginBottom: "0.65rem" }}>{e.org}</div>
                  <p style={{ fontFamily: "var(--body)", fontSize: "0.84rem", color: "var(--tx2)", lineHeight: 1.8 }}>{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 04 — CERTIFICATES */}
        <div id="certificates" className="section section-centered">
          <SectionHeader num="04" label={`certificates · showing 6 of ${certifications.length}`} />
          <div className="certs-grid">
            {previewCerts.map((c, i) => <CertRow key={c.id ?? i} c={c} />)}
          </div>
          <ShowAllBtn
            label={`show all ${certifications.length} certificates`}
            onClick={() => { setPage("certs"); window.scrollTo(0, 0); }}
          />
        </div>

        {/* 05 — WEBINARS */}
        <div id="webinars" className="section section-centered">
          <SectionHeader num="05" label={`webinars & training · showing 5 of ${Object.keys(webinars).length} themes`} />
          <div className="webinars-wrap">
            <div className="webinar-summary" style={{ borderBottom: "1px solid var(--div)" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--tx3)", letterSpacing: "0.08em" }}>click theme to expand</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--tx3)" }}>{webinarTotal} total sessions</span>
            </div>
            <div style={{ padding: "0 1rem" }}>
              {previewWebinarEntries.map(([theme, items]) => (
                <WebinarGroup key={theme} theme={theme} items={items} />
              ))}
            </div>
          </div>
          <ShowAllBtn
            label={`show all ${webinarTotal} webinars`}
            onClick={() => { setPage("webinars"); window.scrollTo(0, 0); }}
          />
        </div>

        {/* 06 — RESUME */}
        <div id="resume" className="section">
          <SectionHeader num="06" label="resume" />
          <div className="resume-row">
            <div>
              <div className="resume-label">John Achilles Colon</div>
              <div className="resume-sub">
                // last updated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} · PDF
              </div>
            </div>
            <a href="/resume.pdf" download className="btn-dl">download resume <ArrowIcon /></a>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer>
        <div className="wrapper">
          <div className="footer-inner">
            <div className="footer-copy">© {new Date().getFullYear()} John Achilles Colon · React + Vite</div>
            <div className="footer-links">
              <a href="https://github.com/acheachi/" target="_blank" rel="noreferrer">github</a>
              <a href="https://linkedin.com/in/john-achilles-colon-52491922b/" target="_blank" rel="noreferrer">linkedin</a>
              <a href="mailto:colon.johnachillesv11d@gmail.com">email</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ─── ROOT ──────────────────────────────────────────────────────────────── */

export default function App() {
  const [page, setPage] = useState("home");

  // ── Dynamic data from Notion ──────────────────────────────────────────
  const [certifications, setCertifications] = useState([]);
  const [projects,       setProjects]       = useState([]);
  const [experience,     setExperience]     = useState([]);
  const [webinars,       setWebinars]       = useState({});
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const [certs, proj, exp, web] = await Promise.all([
          fetchNotion("certifications"),
          fetchNotion("projects"),
          fetchNotion("experience"),
          fetchNotion("webinars"),
        ]);

        setCertifications(certs);
        setProjects(proj);
        setExperience(exp);

        // Group webinars by theme property
        const grouped = web.reduce((acc, w) => {
          const theme = w.theme || "Other";
          if (!acc[theme]) acc[theme] = [];
          acc[theme].push(w);
          return acc;
        }, {});
        setWebinars(grouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#17140F}
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
      `}</style>
      <LoadingScreen />
    </>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", background: "#17140F", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#6A6058", letterSpacing: "0.15em" }}>
        failed to load — check Notion connection
      </span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#4a654a" }}>{error}</span>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#17140F;--sf:#1E1B16;--tx:#E8DFD0;--tx2:#9A8F82;--tx3:#6A6058;
          --acc:#91A882;--div:rgba(145,168,130,0.13);
          --display:'Cormorant Garamond',serif;--body:'Plus Jakarta Sans',sans-serif;--mono:'JetBrains Mono',monospace;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--tx);font-family:var(--body);line-height:1.6;overflow-x:hidden}
        body::before{content:'';position:fixed;inset:0;opacity:0.04;pointer-events:none;z-index:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.4rem 3rem;display:flex;justify-content:space-between;align-items:center;transition:all 0.35s ease}
        .nav.scrolled{background:rgba(23,20,15,0.92);backdrop-filter:blur(20px);border-bottom:1px solid var(--div);padding:1rem 3rem}
        .nav-name{font-family:var(--display);font-size:1.1rem;font-weight:400;color:var(--tx);text-decoration:none;letter-spacing:0.02em}
        .nav-links{display:flex;gap:2rem;list-style:none}
        .nav-links a{font-family:var(--mono);font-size:0.65rem;color:var(--tx3);text-decoration:none;letter-spacing:0.12em;transition:color 0.2s;cursor:pointer}
        .nav-links a:hover{color:var(--acc)}
        .hamburger{display:none;background:none;border:none;cursor:pointer;color:var(--tx3);padding:0.25rem;transition:color 0.2s;z-index:110}
        .hamburger:hover{color:var(--acc)}
        .mobile-menu{display:none;position:fixed;inset:0;background:rgba(23,20,15,0.97);backdrop-filter:blur(24px);z-index:90;flex-direction:column;align-items:center;justify-content:center;gap:2.5rem}
        .mobile-menu.open{display:flex}
        .mobile-menu a{font-family:var(--mono);font-size:1rem;color:var(--tx3);text-decoration:none;letter-spacing:0.25em;text-transform:uppercase;transition:color 0.2s;cursor:pointer}
        .mobile-menu a:hover{color:var(--acc)}
        .wrapper{max-width:1060px;margin:0 auto;padding:0 3rem;position:relative;z-index:1}
        .section{padding:4.5rem 0;border-top:1px solid var(--div)}
        .section-centered{display:flex;flex-direction:column;align-items:center}
        .hero{min-height:100vh;display:flex;align-items:center;padding:7rem 0 4rem}
        .hero-inner{display:grid;grid-template-columns:1fr 200px;gap:4rem;align-items:center;width:100%}
        .hero-eyebrow{font-family:var(--mono);font-size:0.7rem;color:var(--acc);letter-spacing:0.3em;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.75rem;animation:fadeUp 0.7s ease 0.1s both}
        .hero-eyebrow::before{content:'';display:block;width:28px;height:1px;background:var(--acc);opacity:0.5}
        .hero-name{font-family:var(--display);font-size:clamp(3rem,10vw,6.5rem);font-weight:300;color:var(--tx);letter-spacing:-0.03em;line-height:0.92;margin-bottom:1rem;animation:fadeUp 0.7s ease 0.2s both}
        .hero-bio{font-family:var(--body);font-size:0.9rem;color:var(--tx2);line-height:1.75;margin-bottom:1.25rem;max-width:480px;animation:fadeUp 0.7s ease 0.3s both}
        .hero-stats{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem;animation:fadeUp 0.7s ease 0.35s both}
        .stat-chip{font-family:var(--mono);font-size:0.62rem;color:var(--tx2);padding:0.3rem 0.7rem;border:1px solid var(--div);letter-spacing:0.06em;white-space:nowrap}
        .stat-chip span{color:var(--tx);font-weight:600}
        .hero-divider{width:40px;height:1px;background:var(--div);margin:0 0 1.25rem;animation:fadeUp 0.7s ease 0.38s both}
        .hero-location{font-family:var(--mono);font-size:0.65rem;color:var(--tx3);letter-spacing:0.1em;margin-bottom:0.5rem;animation:fadeUp 0.7s ease 0.28s both}
        .socials{display:flex;flex-wrap:wrap;gap:1.25rem;align-items:center;animation:fadeUp 0.7s ease 0.4s both}
        .social-link{color:var(--tx3);text-decoration:none;transition:color 0.2s;display:flex;align-items:center;gap:0.4rem;font-family:var(--mono);font-size:0.68rem;letter-spacing:0.08em}
        .social-link:hover{color:var(--acc)}
        .hero-photo{width:180px;height:220px;border:1px solid var(--div);animation:fadeUp 0.7s ease 0.3s both;position:relative;overflow:hidden}
        .about-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:5rem;align-items:start}
        .about-text p{font-size:0.9rem;color:var(--tx2);line-height:1.95;margin-bottom:1rem}
        .about-text p strong{color:var(--tx);font-weight:600}
        .skills-list{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--div)}
        .skill-item{font-family:var(--mono);font-size:0.68rem;color:var(--tx2);padding:0.6rem 0.8rem;border-right:1px solid var(--div);border-bottom:1px solid var(--div);transition:all 0.2s;letter-spacing:0.03em}
        .skill-item:hover{color:var(--tx);background:var(--sf)}
        .skill-item:nth-child(2n){border-right:none}
        .skill-item:nth-last-child(-n+2){border-bottom:none}
        .projects-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;max-width:900px}
        .exp-wrap{max-width:780px;width:100%}
        .certs-grid{display:grid;grid-template-columns:1fr 1fr;width:100%;max-width:900px;border:1px solid var(--div)}
        .certs-grid > *{border-right:1px solid var(--div);border-bottom:1px solid var(--div)}
        .certs-grid > *:nth-child(2n){border-right:none}
        .certs-grid > *:nth-last-child(-n+2){border-bottom:none}
        .certs-grid > *:last-child{border-bottom:none}
        .webinars-wrap{max-width:680px;width:100%;border:1px solid var(--div)}
        .webinar-summary{padding:0.6rem 1rem;display:flex;justify-content:space-between;align-items:center}
        .resume-row{display:flex;justify-content:space-between;align-items:center;gap:2rem;flex-wrap:wrap;padding:2rem 0}
        .resume-label{font-family:var(--display);font-size:1.9rem;font-weight:300;color:var(--tx);letter-spacing:-0.01em}
        .resume-sub{font-family:var(--mono);font-size:0.65rem;color:var(--tx3);letter-spacing:0.1em;margin-top:0.4rem}
        .btn-dl{font-family:var(--mono);font-size:0.7rem;letter-spacing:0.12em;padding:0.78rem 1.65rem;background:transparent;color:var(--acc);border:1px solid rgba(145,168,130,0.35);cursor:pointer;transition:all 0.25s;text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem}
        .btn-dl:hover{background:rgba(145,168,130,0.07);border-color:var(--acc);color:var(--tx)}
        footer{border-top:1px solid var(--div);padding:2rem 0;position:relative;z-index:1}
        .footer-inner{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
        .footer-copy{font-family:var(--mono);font-size:0.62rem;color:var(--tx3);letter-spacing:0.08em}
        .footer-links{display:flex;gap:1.5rem}
        .footer-links a{font-family:var(--mono);font-size:0.62rem;color:var(--tx3);text-decoration:none;transition:color 0.2s;letter-spacing:0.08em}
        .footer-links a:hover{color:var(--acc)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        @media(max-width:768px){
          .nav{padding:1rem 1.5rem}
          .nav.scrolled{padding:0.85rem 1.5rem}
          .nav-links{display:none}
          .hamburger{display:block}
          .wrapper{padding:0 1.25rem}
          .hero{padding:4.5rem 0 1.5rem;min-height:unset;align-items:flex-start}
          .hero-inner{grid-template-columns:1fr;gap:0.75rem}
          .hero-photo{display:none}
          .hero-eyebrow{margin-bottom:0.6rem}
          .hero-name{margin-bottom:0.6rem}
          .hero-divider{margin:0.75rem 0}
          .hero-bio{max-width:100%}
          .socials{gap:1rem}
          .section{padding:2.5rem 0}
          .about-grid{grid-template-columns:1fr;gap:2rem}
          .about-text p{font-size:0.86rem}
          .skills-list{grid-template-columns:1fr}
          .skill-item:nth-child(2n){border-right:1px solid var(--div)}
          .skill-item:nth-last-child(-n+2){border-bottom:1px solid var(--div)}
          .skill-item:last-child{border-bottom:none}
          .projects-grid{grid-template-columns:1fr;max-width:100%}
          .exp-wrap{max-width:100%}
          .certs-grid{grid-template-columns:1fr;max-width:100%}
          .certs-grid > *{border-right:none}
          .certs-grid > *:nth-last-child(-n+2){border-bottom:1px solid var(--div)}
          .certs-grid > *:last-child{border-bottom:none}
          .webinars-wrap{max-width:100%}
          .resume-label{font-size:1.4rem}
          .resume-row{flex-direction:column;align-items:flex-start;gap:1.25rem}
          footer{padding:1.5rem 0}
          .footer-inner{flex-direction:column;align-items:flex-start;gap:0.75rem}
        }
        @media(max-width:400px){
          .hero-name{font-size:2.6rem}
          .social-link span{display:none}
        }
      `}</style>

      {page === "home"     && <MainPortfolio setPage={setPage} certifications={certifications} projects={projects} experience={experience} webinars={webinars} />}
      {page === "certs"    && <AllCertificatesPage onBack={() => setPage("home")} certifications={certifications} />}
      {page === "webinars" && <AllWebinarsPage onBack={() => setPage("home")} webinars={webinars} />}
    </>
  );
}

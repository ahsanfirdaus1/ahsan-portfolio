# Ahsan Firdaus — Portfolio

Personal portfolio website for **Ahsan Firdaus**, Technical Team Leader in AI Operations & Autonomous Vehicle Data Systems.

Built as a static site (HTML, CSS, vanilla JavaScript) with zero runtime dependencies — no build step, GitHub Pages ready.

🔗 **Live site**: [ahsanfirdaus1.github.io/ahsan-portfolio](https://ahsanfirdaus1.github.io/ahsan-portfolio/)

---

## About This Site

Designed for **recruiters, hiring managers, and technical leadership stakeholders** looking to evaluate:

- Leadership track record (50+ team, Xiaomi AV project)
- AI/ML operations and data annotation expertise
- Machine learning project portfolio (fraud detection, computer vision, NLP, client-side tools)
- Enterprise systems background (Dynamics 365, VMware, Active Directory)

---

## Tech Stack

- HTML5 (semantic, accessible, SEO-optimized)
- CSS3 (custom properties, Grid, Flexbox, `color-mix()`, `backdrop-filter`, native `<details>` accordion)
- Vanilla JavaScript (IntersectionObserver, progressive enhancement)
- System font stack (SF Pro on Apple devices) — no external fonts, no Three.js

No frameworks, no bundler, no runtime dependencies.

---

## Project Structure

```
.
├── index.html          # All page sections and content
├── style.css           # Design tokens, components, responsive breakpoints
├── script.js           # Theme, nav, reveal, counters, workflow tabs, simulator
├── assets/
│   ├── profile.png     # Profile photo (1254×1254 source)
│   └── cv.pdf          # Resume/CV served by the Download CV buttons
├── docs/
│   └── Ahsan_Firdaus_Portfolio_PRD.pdf
├── server.js           # Zero-dependency local static server
├── capture_qa.js       # Headless Chrome QA screenshot pass
├── package.json        # Dev scripts only (no dependencies)
└── README.md
```

---

## Features

- **Apple-inspired design** — tight display typography, generous whitespace, rounded hardware cards, frosted-glass translucent chrome, single Apple blue accent
- **Light & dark mode with manual toggle** — defaults to system preference via `prefers-color-scheme` with an interactive toggle and persistent storage
- **Hero with live metrics** — 50+ team, 7,870 datasets/month, 100% accuracy, animated counters, live status pill
- **Interactive widgets** — agent workflow tabs and a terminal-style agent simulator
- **Operational playbooks** — interactive production SOPs and engineering takeaways from real-world perception pipelines
- **Project filter** — segmented control (All / AI & ML / Systems) with spring-driven sliding thumb
- **Mobile conversion bar** — sticky bottom action pill for 1-tap email and CV download
- **Accessible & compliant** — skip link, ARIA tabs, keyboard-friendly accordion, visible focus rings
- **Reduced-motion aware** — animations swap to gentle cross-fades when requested
- **Responsive** — desktop, tablet (≤860px), mobile (≤640px)
- **SEO meta tags** — title, description, keywords, Open Graph, Twitter Cards
- **No build step** — pure static HTML/CSS/JS, GitHub Pages ready

---

## Run Locally

Requires Node.js 20+ (dev server and QA script only).

```bash
npm start
```

Then open [http://127.0.0.1:3000](http://127.0.0.1:3000). Override the port with `PORT=4000 npm start`.

Alternatives:

- **VS Code Live Server** — right-click `index.html` → *Open with Live Server*
- **Python** — `python -m http.server 5500`
- Opening `index.html` directly (`file://`) also works, though a local server is recommended

---

## QA Pass

```bash
npm run qa
```

Launches local headless Chrome against the site, checks page metadata and horizontal overflow, and saves desktop (dark/light) plus mobile screenshots to the OS temp directory. Set `CHROME_PATH` if Chrome is not in a standard location.

---

## Deploy to GitHub Pages

```bash
git add .
git commit -m "chore: update portfolio"
git push
```

Then in the GitHub repo:

- **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: `main` · Folder: `/ (root)`
- Click **Save**

Live at `https://ahsanfirdaus1.github.io/ahsan-portfolio/`. Changes go live within ~1 minute after each push.

---

## Updating Content

| What to update | Where |
|---|---|
| Name, headline, about text | `index.html` — `#home`, `#about` sections |
| Experience entries | `index.html` — `.timeline` inside `#experience` |
| Projects | `index.html` — `.project-grid` inside `#featured` |
| Accent color | `style.css` — `--blue` in `:root` |
| Profile photo | Replace `assets/profile.png` (square crop recommended) |
| Resume/CV | Replace `assets/cv.pdf` |
| Social links | `index.html` — Contact section + footer |

---

## License

Personal portfolio project. You may adapt the structure and visual style for your own use — just swap out the content.

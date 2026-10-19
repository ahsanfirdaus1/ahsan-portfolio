# Ahsan Firdaus — Portfolio

Personal portfolio website for **Ahsan Firdaus**, Technical Team Leader in AI Operations & Autonomous Vehicle Data Systems.

Built with a static frontend stack (HTML, CSS, Vanilla JavaScript) — no build step, no dependencies, GitHub Pages ready.

🔗 **Live site**: [ahsanfirdaus1.github.io/ahsan-portfolio](https://ahsanfirdaus1.github.io/ahsan-portfolio/)

---

## About This Site

Designed for **recruiters, hiring managers, and technical leadership stakeholders** looking to evaluate:

- Leadership track record (50+ team, Xiaomi AV project)
- AI/ML operations and data annotation expertise
- Machine learning project portfolio (fraud detection, computer vision, NLP)
- Enterprise systems background (Dynamics 365, VMware, Active Directory)

---

## Tech Stack

- HTML5 (semantic, accessible, SEO-optimized)
- CSS3 (custom properties, Grid, Flexbox, `color-mix()`, `backdrop-filter`, native `<details>` accordion)
- Vanilla JavaScript (IntersectionObserver, progressive enhancement)
- System font stack (SF Pro on Apple devices) — no external fonts, no Three.js

No frameworks. No build tools. No npm. Just push and it works.

---

## Project Structure

```
ahsan-portfolio/
├── index.html          # Main HTML (all sections)
├── style.css           # All styles, CSS variables, responsive breakpoints
├── script.js           # Nav, scroll reveal, counters, workflow tabs, simulator
├── assets/
│   ├── profile.jpg     # Profile photo (square recommended, min 400×400px)
│   └── cv.pdf          # Resume/CV download
└── README.md
```

---

## Features

- **Apple-inspired design** — tight display typography, generous whitespace, rounded hardware cards, frosted-glass translucent chrome, single Apple blue accent
- **Light & dark mode with manual toggle** — defaults to system preference via `prefers-color-scheme` with an interactive toggle (System / Dark / Light) and persistent storage
- **Hero with live metrics** — 50+ team, 7,870 datasets/month, 100% accuracy, animated counters, live status pill
- **Interactive widgets** — agent workflow tabs and a terminal-style agent simulator
- **Operational playbooks** — interactive production SOPs and engineering takeaways from real-world perception pipelines
- **Project filter** — segmented control (All / AI & ML / Systems) with smooth spring-driven sliding thumb
- **Mobile conversion bar** — sticky bottom action pill for 1-tap email and CV download
- **Accessible & compliant** — skip link, ARIA tabs, keyboard-friendly accordion, visible focus rings
- **Reduced-motion aware** — animations swap to gentle linear cross-fades when requested
- **Responsive** — desktop, tablet (≤860px), mobile (≤640px)
- **SEO meta tags** — title, description, keywords, Open Graph, Twitter Cards
- **No build step** — pure static HTML/CSS/JS, GitHub Pages ready

---

## Run Locally

This is a fully static site. Two options:

**Option 1 — VS Code Live Server** (recommended)
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html` → **Open with Live Server**

**Option 2 — Python**
```bash
python -m http.server 5500
```
Then open [http://localhost:5500](http://localhost:5500)

> Opening `index.html` directly (`file://`) also works, but Google Fonts may not load without a local server.

---

## Deploy to GitHub Pages

If deploying to an existing repo for the first time:

```bash
git add .
git commit -m "chore: redesign portfolio"
git push
```

Then in your GitHub repo:
- **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: `master` (or `main`) · Folder: `/ (root)`
- Click **Save**

Live at: `https://ahsanfirdaus1.github.io/ahsan-portfolio/`

Changes go live within ~1 minute after every push.

---

## Updating Content

| What to update | Where |
|---|---|
| Name, headline, about text | `index.html` — `#home`, `#about` sections |
| Experience entries | `index.html` — `.timeline` inside `#experience` |
| Projects | `index.html` — `.project-grid` inside `#featured` |
| Accent color | `style.css` — `--blue` in `:root` |
| Profile photo | Replace `assets/profile.jpg` (square crop recommended) |
| Resume/CV | Replace `assets/cv.pdf` |
| Social links | `index.html` — Contact section + footer |

---

## License

Personal portfolio project. You may adapt the structure and visual style for your own use — just swap out the content.

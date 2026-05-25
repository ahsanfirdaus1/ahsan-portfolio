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

- HTML5 (semantic, SEO-optimized)
- CSS3 (custom properties, Grid, Flexbox, keyframe animations)
- Vanilla JavaScript (Intersection Observer, scroll animations, counter animation)
- Google Fonts: [Syne](https://fonts.google.com/specimen/Syne) + [DM Sans](https://fonts.google.com/specimen/DM+Sans)

No frameworks. No build tools. No npm. Just push and it works.

---

## Project Structure

```
ahsan-portfolio/
├── index.html          # Main HTML (all sections)
├── style.css           # All styles, CSS variables, responsive breakpoints
├── script.js           # Scroll reveal, skill bar animations, counter, nav behavior
├── assets/
│   ├── profile.jpg     # Profile photo (square recommended, min 400×400px)
│   └── cv.pdf          # Resume/CV download
└── README.md
```

---

## Features

- **Dark minimalist design** — Syne display font, emerald `#6ee7b7` accent, subtle grid + ambient orbs
- **Hero with live metrics** — 50+ team, 7,870 datasets/month, 100% accuracy — animated counters on scroll
- **Timeline experience section** — highlight chips for key metrics per role
- **Projects grid** — featured + 5 supporting cards with tech stack tags and measurable outcomes
- **Animated skill bars** — triggered by Intersection Observer when section enters viewport
- **Scroll reveal** — staggered fade-in animations on all major elements
- **Sticky nav** — blur backdrop, active section highlight, mobile hamburger menu
- **Availability badge** — pulsing dot in Contact section signals open-to-work status
- **Responsive** — desktop, tablet (≤1024px), mobile (≤768px), small mobile (≤480px)
- **SEO meta tags** — title, description, keywords, Open Graph
- **No build step** — GitHub Pages compatible out of the box

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
| Projects | `index.html` — `.projects-grid` inside `#projects` |
| Skill bars & levels | `index.html` — `--w` CSS variable on each `.skill-fill` |
| Accent color | `style.css` — `--accent` in `:root` |
| Profile photo | Replace `assets/profile.jpg` (square crop recommended) |
| Resume/CV | Replace `assets/cv.pdf` |
| Social links | `index.html` — Contact section + footer |

---

## License

Personal portfolio project. You may adapt the structure and visual style for your own use — just swap out the content.
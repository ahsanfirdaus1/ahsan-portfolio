# Ahsan Firdaus Portfolio

Personal portfolio website for **Ahsan Firdaus** built with static frontend stack (HTML, CSS, JavaScript) and ready for GitHub Pages deployment.

## Live Purpose
This website is designed for:
- Hiring Managers
- Recruiters
- Technical Leadership stakeholders

It highlights leadership impact, AI/ML operations experience, enterprise systems background, and measurable outcomes.

## Tech Stack
- HTML5
- CSS3
- Vanilla JavaScript

## Project Structure
```text
.
|-- index.html
|-- style.css
|-- script.js
|-- assets/
|   |-- profile.jpg
|   `-- cv.pdf
```

## Features
- Responsive layout (desktop, tablet, mobile)
- Sticky navigation with mobile menu
- Hero section with CTA (Download CV, Contact)
- About, Experience, Projects, Education, Skills, and Contact sections
- Subtle reveal animation on scroll
- SEO meta title and description
- GitHub Pages compatible (no build step)

## Run Locally
Because this is a static site, you can open `index.html` directly in your browser.

For a local server (recommended):

### Option 1: VS Code Live Server
1. Install **Live Server** extension
2. Right-click `index.html`
3. Select **Open with Live Server**

### Option 2: Python HTTP Server
```bash
python -m http.server 5500
```
Open: [http://localhost:5500](http://localhost:5500)

## Deploy to GitHub Pages
1. Create a GitHub repository
2. Add remote and push:

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin master
```

3. In GitHub repository:
- Go to **Settings** > **Pages**
- Source: **Deploy from a branch**
- Branch: `master` and folder `/ (root)`
- Click **Save**

Your site will be available at:
`https://<your-username>.github.io/<repo-name>/`

## Customize Content
- Update text content in `index.html`
- Replace profile photo at `assets/profile.jpg`
- Replace resume file at `assets/cv.pdf`
- Update social links in Contact section (LinkedIn/GitHub)

## Roadmap (Optional Future Improvements)
- Dark mode toggle
- Multi-language support (EN/ID/ZH)
- Blog section
- Analytics integration
- Project detail pages

## License
Personal portfolio project. You may adapt the structure/style for your own portfolio.

# BugAura Labs — Website

Landing page for [BugAura Labs](https://bugauralabs.studio), a remote QA studio offering manual testing, API testing, security testing, automation, and performance testing for SaaS, ecommerce, and agency teams.

## Structure

```
├── index.html          # Main landing page
├── blogs.html          # Blog listing page
├── privacy.html        # Privacy policy
├── support.js          # dc-runtime (React-based template engine, CDN-loaded)
├── assets/             # Logos and favicons
├── output/             # Publicly served files (sample QA report PDF)
├── CNAME               # Custom domain: bugauralabs.studio
├── _headers            # Security headers (Netlify)
├── robots.txt
├── sitemap.xml
└── site.webmanifest
```

## Tech Stack

- **Framework**: [dc-runtime](https://github.com/design-components) — a lightweight React-based template engine. No build step, no bundler.
- **React 18** loaded from CDN (unpkg)
- **Fonts**: Sora, Hanken Grotesk, JetBrains Mono via Google Fonts
- **Form**: [FormSubmit.co](https://formsubmit.co) for the contact form (no backend needed)
- **Hosting**: GitHub Pages / Netlify

## Running locally

Open `index.html` in a browser. No build step or server required — the page is fully static.

For form submissions to work, the page must be served over HTTP (not `file://`). Use any local server:

```bash
npx serve .
# or
python -m http.server 8080
```

## Deploying

Push to the `main` branch. GitHub Pages serves the site automatically. The `CNAME` file points the custom domain `bugauralabs.studio` to the GitHub Pages host.

## Assets

| File | Purpose |
|------|---------|
| `assets/logo-wordmark-t.png` | Dark wordmark (transparent bg) — used in nav |
| `assets/logo-wordmark-white.png` | White wordmark — used in footer |
| `assets/logo-wordmark.png` | Default wordmark |
| `assets/logo-full.png` | Full logo with icon |
| `assets/favicon*.png` | Favicons at various sizes |
| `output/C2C_Agri_Sanitized_QA_Document.pdf` | Sample QA report linked from the site |

## Contact

**Jaswanth M K** — jaswanth@bugauralabs.studio  
[LinkedIn](https://www.linkedin.com/company/bugauralabs) · [bugauralabs.studio](https://bugauralabs.studio)

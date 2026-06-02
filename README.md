# DesignDock — Landing Page

Marketing landing page for **DesignDock**, a German design subscription agency (*Design-Flatrate*). The page is a single, self-contained static site with a dark theme, lime (`#c6f24e`) accent colour, and German copy.

> Generated from a Claude Design handoff and implemented with Claude Code.

---

## Tech stack

| Layer | Library / Tool |
|-------|---------------|
| 3D graphics | Three.js r128 |
| Scroll animation | GSAP 3.12.5 + ScrollTrigger |
| Smooth scroll | Lenis 1.0.42 |
| Typography | Space Grotesk, DM Sans (Google Fonts) |
| Hosting | GitHub Pages / Netlify / any static host |

All libraries are loaded from public CDNs — there is no build step and no local dependencies required to run the site.

---

## Features

- **Animated aurora background** — full-viewport colour-shift gradient
- **Film-grain overlay** — CSS noise texture for depth
- **Scroll progress bar** — thin lime indicator fixed at the top of the viewport
- **Fixed section navigator** — left-rail dot navigation that highlights the active section
- **GSAP ScrollTrigger reveals** — staggered fade/slide-in on every section
- **Three.js hero icosahedron** — cursor- and scroll-reactive 3D mesh in the hero
- **Cursor- and scroll-reactive dot grid** — interactive background grid via `dd-graphics.js`
- **3D tilt cards** — CSS perspective tilt on hover
- **Magnetic buttons** — cursor-attraction effect on CTA elements
- **Marquee ticker** — continuously scrolling text band
- **Lenis smooth scroll** — inertia-based native-feeling scroll
- **`prefers-reduced-motion` support** — all motion is disabled when the OS setting is active
- **Graceful library fallback** — the page is fully readable if any CDN asset fails to load

---

## Project structure

```
designdock-landingpage/
├── index.html          # Main page (single file, all styles inline)
├── dd-graphics.js      # Three.js icosahedron + dot-grid logic
├── favicon.svg         # Vector favicon
├── assets/
│   └── og.png          # Open Graph / social preview image
├── 404.html            # On-brand 404 page
├── robots.txt
├── sitemap.xml
├── netlify.toml        # Netlify deployment config
├── package.json        # Convenience dev scripts
└── .gitignore
```

---

## Local development

No install step is required. Serve the folder root with any static file server:

```bash
# Option 1 — serve (Node.js)
npx serve .
# → http://localhost:3000

# Option 2 — Python built-in server
python3 -m http.server 8000
# → http://localhost:8000
```

Opening `index.html` directly via `file://` also works for basic inspection, but the Three.js module may be blocked by browser CORS rules in that mode — use a local server for full fidelity.

---

## Deployment

### GitHub Pages

The live production URL is served from the `main` branch root:

**https://aiaccountsc.github.io/designdock-landingpage/**

Enable GitHub Pages in the repository settings: **Settings → Pages → Source: Deploy from branch → main / (root)**.

### Netlify

A `netlify.toml` is included. Drop the repository into Netlify (import from Git or drag-and-drop the folder) — no build command is needed.

### Vercel / any static host

Point the host at the repository root. No framework preset is required. Works on Vercel, Cloudflare Pages, Surge, or any CDN that can serve static files.

---

## Accessibility & performance

- All animations respect **`prefers-reduced-motion: reduce`** — motion is fully disabled for users who have requested it in their OS settings.
- Every external library (GSAP, Lenis, Three.js, Google Fonts) is loaded from a CDN. If a CDN request fails, the page degrades gracefully: layout, copy, and colours remain intact; only the motion layer is absent.
- Typography falls back to `system-ui, sans-serif` if Google Fonts cannot be reached.
- The Open Graph image (`assets/og.png`) ensures rich link previews on social platforms and messaging apps.

---

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Three.js r128 requires WebGL; the page is still fully usable in browsers where WebGL is unavailable — the canvas is simply hidden.

---

## License & usage

**Brand name, copy and visual identity © DesignDock. All rights reserved.**

The underlying template and code structure are free to reuse for other projects. The DesignDock name, logo, and marketing copy may not be reused without permission.

---

## Credits

- **Three.js** — [threejs.org](https://threejs.org)
- **GSAP** — [gsap.com](https://gsap.com)
- **Lenis** — [lenis.studiofreight.com](https://lenis.studiofreight.com)
- **Space Grotesk & DM Sans** — Google Fonts
- Built with [Claude Code](https://claude.ai/claude-code) by Anthropic

# For Honey ✨ — Vaishali's Diwali 2026

A cinematic, responsive Diwali greeting built with React, Vite, Tailwind CSS and Framer Motion.

## Run locally
1. Install Node.js 18+.
2. In this folder, run `npm install`.
3. Run `npm run dev`.
4. Open the local URL printed by Vite.

## Production build
Run `npm run build`, then `npm run preview` to preview the production build.

## Personalize it
- Edit the love letter and signature in `src/App.jsx`.
- Change the name/nickname in the hero and footer in `src/App.jsx`.
- The four wish-card illustrations are PNG files in `public/images/` (`peace.png`, `happiness.png`, `dreams.png`, and `trust.png`). To use your own photos, replace those files with PNG images using the same filenames.
- The promise card watermark is `public/images/promise-watermark.png`. Replace it with your own PNG using the same filename to customize the watermark.
- The music is an original, synthesized ambient melody created in-browser with the Web Audio API. Browsers require a user click before sound can start. Use the music button to start or pause it.
- Fireworks are drawn locally on a canvas; no external image or audio assets are required.

## Deploy
You can deploy the `dist` folder to Netlify, Vercel, GitHub Pages, or any static hosting provider. For GitHub Pages, configure Vite's `base` if deploying under a repository subpath.

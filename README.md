# Brand Orbita Global

A responsive agency showcase built with Next.js App Router, TypeScript, Tailwind CSS and Framer Motion.

## Run locally

```sh
npm install
npm run dev
```

## Validate

```sh
npm run lint
npm run build
```

## Deploy on Vercel

Import this directory as a Git repository in Vercel and select the Next.js preset. The build command is `npm run build`. No environment variables or external services are required. Static export is enabled, producing `out/` for other static hosts as well.

## Content

- The supplied original logo is retained at `brandorbita.png` and copied unchanged into `public/`.
- Project examples are explicitly labelled self-initiated concepts, not client case studies.
- Numbers describe the agency's service/process structure, not unverified performance claims.
- Contact CTAs use the supplied Instagram profile. Replace with a confirmed business email or booking link when available.
- Social tiles are studio brand explorations linking to Instagram, not an embedded live feed.
- No tracking scripts, contact-data collection or cookies are added.
- Reduced-motion settings disable looping motion and scroll effects.

Main content and reusable interaction components: `components/agency.tsx`. Design tokens and responsive styling: `app/globals.css`. SEO: `app/layout.tsx`.

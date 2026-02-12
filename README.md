# Darshan Portfolio (React + Vite)

Professional portfolio website built with React and styled for a static Vercel deployment.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Push this project to GitHub.
2. Import the repo in Vercel.
3. Keep defaults:
   - Framework: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`

`vercel.json` is included for explicit static build settings.

### Vercel CLI (optional)

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

## Content updates

Update these files:

- `src/data.js`: personal details, project links, experience bullets, certifications.
- `public/Darshan CV Latest Updated.pdf`: replace with your latest resume file.

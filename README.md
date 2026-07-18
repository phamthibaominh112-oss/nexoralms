# Nexora — Road to IELTS 8.0

A deploy-ready Next.js landing page and interactive product prototype using the Nexora brand identity.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

### Option 1 — Vercel website
1. Upload this folder to a GitHub repository.
2. Open Vercel and choose **Add New → Project**.
3. Import the GitHub repository.
4. Keep the default Next.js settings.
5. Click **Deploy**.

### Option 2 — Vercel CLI
```bash
npm install -g vercel
vercel
```

## Included

- Responsive Nexora landing page
- 100-level IELTS roadmap
- Feature and pricing sections
- Interactive demo dashboard
- LocalStorage progress state
- Mobile navigation
- Nexora identity asset
- Environment file template for future Supabase, YouTube and OpenAI integrations

## Recommended next phase

Connect Supabase Authentication and PostgreSQL for:
- users
- lesson progress
- level unlocking
- vocabulary review
- test attempts
- writing and speaking submissions

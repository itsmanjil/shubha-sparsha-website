# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (usually binds to :5173 or :5174 if port taken)
npm run build      # Production build to dist/
npm run lint       # ESLint
npm run preview    # Preview production build locally
vercel --prod      # Deploy to production
```

After any change, commit + push + run `vercel --prod` to deploy. Vercel is not connected to GitHub auto-deploy.

## Architecture

Single-page React app (Vite + React 19 + Tailwind CSS v4). All sections live on one page (`/`) with smooth-scroll navigation. No routing except the removed `/admin` path.

**Data flow:**
- `src/lib/supabase.js` — single Supabase client instance, imported wherever DB access is needed
- Contact form (`Contact.jsx`) does two things on submit: inserts to Supabase `contacts` table, then POSTs to Web3Forms API to email `shubhasparshanp@gmail.com`
- Gallery (`Gallery.jsx`) reads from Supabase `gallery` table with a realtime subscription for live updates

**Supabase schema:**
- `contacts` — `id, name, email, phone, event_type, message, created_at` — RLS: anon insert only
- `gallery` — `id, title, image_url, category, created_at` — RLS: anon select only

**Design system** (defined in `src/index.css` `@theme` block):
- Maroon scale: `#2a0000` (900) → `#800000` (500) — used for dark backgrounds and accents
- Gold scale: `#d4af37` (400) — primary accent throughout
- Cream: `#fffdf5` / `#f7ecd0` — light section backgrounds
- Fonts: `Playfair Display` serif (headings), `Lato` sans (body) — loaded via Google Fonts in `index.html`
- Components use inline `style` props for colors rather than Tailwind utility classes (Tailwind is used for layout/spacing only)

## Environment Variables

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_WEB3FORMS_KEY      # 2da6cce3-... — sends email to shubhasparshanp@gmail.com
```

All three must also be set in Vercel project settings (`vercel env add`).

## Deployment

- **Vercel project:** `shubhasparsha-nepal-website` (itsmanjils-projects)
- **Live URL:** https://shubha-sparshan-website.vercel.app
- **GitHub:** https://github.com/itsmanjil/shubha-sparsha-website
- Vercel is NOT linked to GitHub — run `vercel --prod` manually after every push

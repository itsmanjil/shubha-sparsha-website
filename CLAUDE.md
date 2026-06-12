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
- Contact form (`Contact.jsx`) on submit: (1) inserts to Supabase `contacts` table — if this fails the form errors; (2) fires two emails in parallel as fire-and-forget via `Promise.allSettled`: Web3Forms notifies the admin (`shubhasparshanp@gmail.com`), EmailJS sends a confirmation to the visitor. Email failures are logged silently and never block the user.
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
VITE_WEB3FORMS_KEY          # sends admin notification to shubhasparshanp@gmail.com
VITE_EMAILJS_SERVICE_ID     # EmailJS Gmail service ID
VITE_EMAILJS_TEMPLATE_ID    # EmailJS template ID for visitor confirmation
VITE_EMAILJS_PUBLIC_KEY     # EmailJS public key
```

All six must also be set in Vercel project settings (`vercel env add`).

## Deployment

- **Vercel project:** `shubhasparsha-nepal-website` (itsmanjils-projects)
- **Live URL:** https://shubha-sparshan-website.vercel.app
- **GitHub:** https://github.com/itsmanjil/shubha-sparsha-website
- Vercel is NOT linked to GitHub — run `vercel --prod` manually after every push

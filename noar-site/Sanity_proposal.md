# Sanity-Powered Portfolio Gallery

## Context
The Portfolio section currently shows 3 hardcoded property cards with CSS gradient backgrounds. The goal is to integrate the existing Sanity CMS and build a gallery-style browsing experience typical of land development company websites — filterable grid with a detail modal and image gallery.

**Approach**: Custom `useEffect` hook (no react-query). Existing Sanity project (provide credentials).

---

## 1. Install Dependencies

```
npm install @sanity/client @sanity/image-url
```

## 2. Environment & Sanity Client

- Create `.env` with `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `VITE_SANITY_API_VERSION`
- Create `src/lib/sanity/client.ts` — Sanity client with CDN enabled
- Create `src/lib/sanity/image.ts` — `urlFor()` helper using `@sanity/image-url`
- Create `src/lib/sanity/queries.ts` — GROQ query for portfolio projects
- Create `src/lib/sanity/index.ts` — barrel export

## 3. Sanity Schema (for Sanity Studio)

Create a `portfolioProject` document type with fields:
- `title` (string, required)
- `slug` (slug from title)
- `category` (string: residential / commercial / mixed-use / land-development / institutional)
- `status` (string: completed / in-progress / upcoming)
- `location` (string), `city` (string)
- `featuredImage` (image with hotspot + alt text)
- `gallery` (array of images with alt + caption)
- `description` (text, max 300 chars)
- `stats` (object: size, units, value, yearCompleted)
- `featured` (boolean), `order` (number)

Output as a standalone schema file to drop into the Sanity studio's `schemaTypes/`.

## 4. TypeScript Types

Create `src/types/portfolio.ts` with interfaces: `PortfolioProject`, `GalleryImage`, `ProjectStats`, `ProjectCategory`, `ProjectStatus`.

## 5. New Component Structure

Replace `src/components/Properties/` with `src/components/Portfolio/`:

| File | Purpose |
|---|---|
| `Portfolio.tsx` | Section container, state for selected project |
| `Portfolio.module.css` | Section padding, title (reuses existing Properties styles) |
| `PortfolioGrid.tsx` | Filter bar + animated grid using Framer Motion `AnimatePresence` |
| `PortfolioGrid.module.css` | Filter buttons, grid layout (3→2→1 columns) |
| `PortfolioCard.tsx` | Image card with hover overlay, status badge, category tag |
| `PortfolioCard.module.css` | Preserves existing hover lift, amber diamond accent, gradient fallback |
| `PortfolioModal.tsx` | Detail modal with image gallery, thumbnails, stats, description |
| `PortfolioModal.module.css` | Forest-green overlay, white modal, responsive full-screen on mobile |
| `PortfolioSkeleton.tsx` | Shimmer loading cards |
| `PortfolioSkeleton.module.css` | Animated skeleton with cream-warm/cream gradient |
| `usePortfolioProjects.ts` | Custom `useEffect` hook with AbortController, loading/error state |
| `fallbackData.ts` | 3 hardcoded projects (from current data) as offline fallback |

### Key UX Features
- **Filter bar**: All / Residential / Commercial / Mixed-Use / Land Development — pill buttons with amber underline on active
- **Grid**: 3 columns desktop, 2 tablet, 1 mobile. Framer Motion layout animations on filter change
- **Card hover**: Image zoom (scale 1.04), "View Project" overlay label, amber diamond accent
- **Status badge**: Terra-colored pill on in-progress/upcoming projects
- **Modal**: Opens on card click. Large image viewer + thumbnail strip. Stats grid. Close on Escape/overlay click. Body scroll lock.
- **Fallback**: If Sanity is unreachable, show the 3 original hardcoded cards with CSS gradient backgrounds

### Image Optimization (Sanity CDN)
- Grid thumbnails: `width(600).height(400).auto('format').quality(80)` + `loading="lazy"`
- Modal main: `width(1200).height(800).auto('format').quality(85)`
- Modal thumbs: `width(120).height(80).auto('format').quality(70)`

## 6. Integration

- **`App.tsx`**: Replace `Properties` import with `Portfolio`
- **Navbar**: Already updated — `#portfolio` link and section ID are in place
- **Footer**: Already has "Portfolio" quick link pointing to `#portfolio`

## 7. Files to Create/Modify

| File | Change |
|---|---|
| `package.json` | Add @sanity/client, @sanity/image-url |
| `.env` | New file — Sanity credentials |
| `src/lib/sanity/*` | New — client, image helper, queries |
| `src/types/portfolio.ts` | New — TypeScript interfaces |
| `src/components/Portfolio/*` | New — all gallery components |
| `src/App.tsx` | Swap Properties → Portfolio import |
| `schemaTypes/portfolioProject.ts` | New — Sanity schema (standalone file for studio) |

## 8. Verification Checklist

1. Start dev server, check no build/console errors
2. Verify Portfolio section renders with fallback data (before Sanity credentials)
3. Add `.env` credentials → verify Sanity fetch works and real projects appear
4. Test filter buttons — animation on category switch
5. Test card click → modal opens with gallery, stats, close behavior
6. Test Escape key and overlay click to close modal
7. Test responsive: desktop (3-col), tablet (2-col), mobile (1-col + full-screen modal)
8. Test loading skeleton appears briefly on initial fetch
9. Disconnect Sanity (bad project ID) → verify fallback data shows gracefully

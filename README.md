# AI Exhibit

A modern, dark-themed digital gallery and competition platform for AI-generated creative content. Built with Next.js 14, featuring glassmorphism design, animated backgrounds, and a polished user experience.

## Overview

AI Exhibit is a community-driven platform where creators can submit, showcase, and vote on AI-generated art, music, video, text, code, and 3D content. The platform features a curated gallery, leaderboard rankings, hall of fame, and an admin dashboard.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 14.1.3 | App Router, SSR/SSG, API routes |
| **React** | 18.2.0 | UI components |
| **TypeScript** | 5.4.2 | Type safety |
| **Tailwind CSS** | 3.4.1 | Utility-first styling |
| **Framer Motion** | 11.0.8 | Animations & transitions |
| **Radix UI** | Latest | Accessible UI primitives (dialog, dropdown, tabs, toast, tooltip, select) |
| **Supabase** | SSR + JS | Authentication, database, storage |
| **React Hook Form** | Latest | Form handling |
| **Zod** | Latest | Schema validation |
| **CVA** | 0.7.1 | Variant-based component styling |
| **react-masonry-css** | 1.0.16 | Responsive masonry grid layout |
| **lucide-react** | 0.344.0 | Icon library |

## Features

- **Gallery** — Browse AI-generated entries with masonry grid layout, category filtering, and search
- **Entry Submission** — Multi-step form for submitting AI creations with file upload, AI tool selection, and prompt sharing
- **Voting System** — Like/vote on entries with animated feedback and real-time vote counts
- **Leaderboard** — Rankings of top entries and creators
- **Hall of Fame** — Curated showcase of winning entries
- **User Authentication** — Supabase-powered auth with sign-in modal
- **User Settings** — Profile management with avatar, display name, and notification preferences
- **Admin Dashboard** — Entry management and platform statistics
- **Live Background** — Animated particle system with floating orbs, aurora effects, and star field
- **Glassmorphism UI** — Premium glass effects with backdrop blur throughout the interface
- **3D Interactions** — Card tilt effects, button depth, and parallax scrolling
- **Responsive Design** — Full mobile support with slide-out navigation panel
- **Dark Theme** — Deep obsidian dark mode with violet/cyan accent palette

## Design System

### Color Palette

| Token | HSL Value | Usage |
|---|---|---|
| `--background` | `260 30% 3%` | Page background (deep obsidian) |
| `--card` | `260 25% 7%` | Card/surface backgrounds |
| `--primary` | `270 80% 65%` | Violet — primary actions, buttons, gradients |
| `--accent` | `180 85% 55%` | Cyan — secondary accents, highlights |
| `--border` | `260 15% 16%` | Subtle borders |
| `--muted` | `260 18% 12%` | Muted backgrounds/sections |
| `--foreground` | `220 20% 96%` | Primary text (near-white) |
| `--muted-foreground` | `260 10% 55%` | Secondary/muted text |

### Typography

- **Headings**: Bold with violet-to-cyan gradient text (`text-gradient`)
- **Body**: `text-foreground` (near-white) on dark backgrounds
- **Muted**: `text-violet-300/50` to `text-violet-300/70` for secondary content

### Effects

- **Glass**: `glass` / `glass-premium` / `glass-tinted` — varying levels of glassmorphism
- **Glow**: `glow-card` / `glow-pulse` / `shadow-glow` — violet glow effects
- **3D**: `card-3d` / `button-3d` — depth and perspective transforms
- **Animated Border**: `animated-border` — rotating gradient border
- **Shimmer**: `shimmer-effect` — sliding light reflection
- **Float**: `float-animation` — gentle floating motion

## Project Structure

```
src/
├── app/
│   ├── globals.css              # Design system, utilities, keyframes
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (server component)
│   ├── HomeClient.tsx           # Home page client interactions
│   ├── gallery/page.tsx         # Gallery with search & filters
│   ├── submit/page.tsx          # Entry submission wrapper
│   ├── settings/page.tsx        # User settings
│   ├── entry/[id]/              # Individual entry detail
│   ├── hall-of-fame/            # Hall of fame page
│   ├── leaderboard/             # Leaderboard page
│   ├── admin/                   # Admin dashboard
│   ├── guidelines/              # Community guidelines
│   ├── privacy/                 # Privacy policy
│   ├── terms/                   # Terms of service
│   ├── auth/                    # Auth callback & error pages
│   └── api/                     # API routes (entries, vote, categories, etc.)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx           # Responsive navbar with mobile panel
│   │   └── Footer.tsx           # Site footer
│   ├── ui/
│   │   ├── button.tsx           # 12 button variants (CVA)
│   │   ├── input.tsx            # Styled input
│   │   ├── textarea.tsx         # Styled textarea
│   │   ├── select.tsx           # Radix select components
│   │   ├── badge.tsx            # Badge variants
│   │   ├── label.tsx            # Form label
│   │   ├── dialog.tsx           # Radix dialog
│   │   └── toast.tsx            # Radix toast (Sonner-style)
│   ├── auth/
│   │   ├── AuthModal.tsx        # Sign-in modal
│   │   └── UserMenu.tsx         # Authenticated user dropdown
│   ├── EntryCard.tsx            # Gallery entry card with 3D tilt
│   ├── LightboxModal.tsx        # Full-screen entry viewer
│   ├── VoteButton.tsx           # Vote/like button with animation
│   ├── CategoryTabs.tsx         # Category filter tabs
│   ├── SubmitForm.tsx           # Multi-step submission form
│   ├── MasonryGrid.tsx          # Responsive masonry layout
│   ├── LiveBackground.tsx       # Animated particle background
│   ├── BackToTop.tsx            # Scroll-to-top button
│   ├── Toast.tsx                # Toast notification system
│   └── ParticleField.tsx        # Particle effect component
├── contexts/
│   └── AuthContext.tsx           # Supabase auth provider
├── hooks/                       # Custom React hooks
├── lib/
│   └── utils.ts                 # Utility functions (cn, formatters, etc.)
└── types/
    └── index.ts                 # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project (for auth & database)

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `next dev` | Start development server |
| `build` | `next build` | Create optimized production build |
| `start` | `next start` | Start production server |
| `lint` | `next lint` | Run ESLint |

## Build Output

The project builds successfully with 22 routes:

- **Static pages** (○): gallery, submit, settings, guidelines, privacy, terms, admin, auth/error, hall-of-fame, leaderboard
- **Dynamic pages** (λ): home, entry/[id], all API routes, auth/callback
- **First Load JS shared**: ~84 kB

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

## License

All rights reserved. © 2026 AI Exhibit.

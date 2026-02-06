# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Production build
pnpm start        # Run production server
pnpm lint         # Run ESLint
```

## Tech Stack

- **Framework:** Next.js 14.1.0 with App Router
- **Language:** TypeScript (strict mode disabled)
- **Styling:** Tailwind CSS 3.3.0 with custom "jack" theme
- **Icons:** Lucide React
- **Package Manager:** pnpm

## Architecture Overview

This is a legal practice management system for Guatemalan attorneys with AI-powered analysis tools. All UI is in Spanish.

### Core Modules (in `/app`)

| Route | Purpose |
|-------|---------|
| `/` | Dashboard with KPIs, recent cases, quick tools |
| `/login` | Simple localStorage-based auth (mock) |
| `/expedientes` | Case/file management with filtering |
| `/clientes` | CRM with client cards and status tracking |
| `/laboral` | **Flagship:** Labor law AI analyzer with keyword detection, legal citations, PDF export |
| `/codex` | Searchable library of 5 Guatemalan legal codes |
| `/investigacion` | Case law/jurisprudence database |
| `/protocolo` | Notarial document editor (WYSIWYG, print-optimized) |

### Layout System

- `layout.tsx`: Root layout with sidebar (desktop) + bottom nav (mobile)
- Login page uses minimal layout (conditional rendering via pathname check)
- User session stored in localStorage (`user_name`)

### Data Architecture

- **All data is currently hardcoded** - no backend/database integration yet
- Mock data defined as local arrays in each page component
- Knowledge bases (e.g., `knowledgeBase` in `/laboral`) contain Guatemalan legal references

### Design System

Custom "jack" color palette in `tailwind.config.js`:
- `jack-base`: #0B0A12 (deep purple-black background)
- `jack-panel`: #151922 (dark panels)
- `jack-crimson`: #7A1F2E (accent red)
- `jack-gold`: #Cfb568 (highlights)
- `jack-silver`: #A8B4C2 (text)
- `jack-white`: #E8E6E1 (light text)

### Key Patterns

1. All pages use `"use client"` directive (client-side rendering)
2. React `useState` for local state (no state management library)
3. Print-friendly design with `no-print` classes and `@media print` rules in `globals.css`
4. Responsive: mobile-first with `md:` and `lg:` breakpoints

## Notable Considerations

- The `/glaive` subdirectory contains a separate Next.js 16 project (migration/refactor target) - the main app is in `/app`
- No test framework configured
- No API routes - all mock data
- `.env.local` exists but is empty (no environment variables used yet)

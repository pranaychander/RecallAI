RecallAI — recallai-dashboard (Next.js 15 + TypeScript)

Project overview

This repository contains a production-oriented scaffold of the RecallAI dashboard built with Next.js 15 (App Router), TypeScript, and Tailwind CSS. The app currently uses a services layer that returns mocked data; swap the services implementations to connect a real backend later.

Quick start

1. npm install
2. npm run dev
3. Open http://localhost:3000

Available scripts

- npm run dev — start dev server
- npm run build — build for production
- npm run start — start production server (after build)
- npm run lint — run ESLint
- npm run lint:fix — fix lintable issues
- npm run type-check — run TypeScript in strict mode
- npm run format — run Prettier

Folder structure (top-level)

- app/ — App Router pages & layouts
  - app/page.tsx — Dashboard (server page)
  - app/layout.tsx — Root layout, header, FAB
  - app/loading.tsx, app/error.tsx, app/not-found.tsx
  - app/challenges, app/create, app/upload, app/import, app/analytics, app/graph, app/cards, app/profile, app/flashcards, app/settings — mock feature routes
- components/ — Header, Sidebar, StatsCard, RecentLearningCard, Heatmap, QuickActions
- services/ — auth.service.ts, challenge.service.ts, quiz.service.ts, flashcard.service.ts, profile.service.ts, knowledge.service.ts, leaderboard.service.ts (all mocked)
- mock/ — mock/data.ts (single source of mock data used by services)
- types/ — shared TypeScript interfaces
- styles/ — globals.css (Tailwind) and related styles
- public/ — static assets (favicon.svg, robots.txt, sitemap.xml)
- .eslintrc.json, .prettierrc, .editorconfig — tooling configs
- vercel.json — Vercel compatibility
- .github/workflows/ci.yml — CI for type-check, lint, build

Why you saw "Parent directory does not exist"

During earlier automated file creation some operations attempted to write nested files before their parent folders existed; those attempts were retried and the directories were created. The repository now has a proper folder layout (see structure above). No manual action required — if any file is missing, tell me which path and I will recreate it.

Notes on replacing mocks with real APIs

- Implement API logic inside services/*.service.ts and keep exported function signatures unchanged.
- Client components and routes will continue to work and will not require edits when services are connected to a backend.

If anything is still missing or a particular file path looks wrong, paste the path here and I’ll recreate or fix it.

Rename repository folder

To rename the working folder on your machine to the canonical project name (recallai-dashboard), run the script included in the repository from inside the project:

bash ./scripts/rename-repo.sh

To move the project to your Desktop and ensure the folder is named recallai-dashboard, run:

bash ./scripts/move-to-desktop.sh

Both scripts are safety-checked: they will abort if the target path already exists. If you'd prefer to rename/move manually, just rename the folder in Finder/Explorer or use mv.

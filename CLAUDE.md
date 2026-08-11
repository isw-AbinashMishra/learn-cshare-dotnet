# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout

Single app lives under `portal/`. Repo root has no build tooling of its own — always `cd portal` before running any command.

## Commands (run from `portal/`)

```bash
npm install       # install deps
npm run dev       # vite dev server, http://localhost:5173
npm run build     # production build → portal/dist/
npm run preview   # preview production build
npm run lint      # oxlint (config: portal/.oxlintrc.json)
```

No test suite exists in this repo.

## What this is

A **C# / .NET Interview Prep Portal** — client-only React SPA (no backend). Three modes, toggled in the UI (`ModeToggle`) and driven by `App.jsx` state:

- **prep** — Q&A flashcards (`data/questions.js`, rendered by `QuestionCard`)
- **challenges** — coding challenges (`data/challenges.js`, rendered by `ChallengeCard`)
- **playground** — read-only code snippets (`data/playground.js`, rendered by `PlaygroundCard`)

## Architecture

- `App.jsx` is the single stateful container: holds `mode`, `activeCategory`, `search`, `difficulty`, `hideReviewed` and derives the visible list per mode via `useMemo` filters. There is no router and no global state library — all filtering logic lives inline in `App.jsx`.
- Each mode has its own parallel data module (`data/questions.js`, `data/challenges.js`, `data/playground.js`) exporting a flat array of items plus a `categories` array for that mode. Sidebar/category options switch based on `mode`.
- `useProgress(storageKey)` (`hooks/useProgress.js`) is a small localStorage-backed `Set` hook, reused with different keys: `csharp_portal_progress` (default, prep mode "reviewed") and `solved_challenges` (challenges mode "solved"). Playground has no progress tracking.
- Content data files (`questions.js`, `challenges.js`) hold markdown-formatted `answer`/`description` strings (backtick template literals with embedded fenced code blocks) rendered via `react-markdown` + `react-syntax-highlighter` (Prism, One Dark theme) inside the card components.
- Styling is Tailwind CSS v4 (via `@tailwindcss/vite`) using CSS custom properties for theme tokens (`hsl(var(--background))`, `--foreground`, `--border`, etc. — see `index.css`), plus a small set of shadcn-style primitives built on Radix (`@radix-ui/react-progress`, `-scroll-area`, `-slot`, `-tabs`) and `class-variance-authority`/`tailwind-merge` for variant styling (`lib/utils.js` exports the `cn` helper).
- Adding new Q&A/challenges/snippets means appending objects to the relevant array in `data/*.js` — no schema files, the object shape is defined by usage in `App.jsx` and the card components (e.g. questions need `id`, `category`, `difficulty`, `question`, `answer`, `tags`).

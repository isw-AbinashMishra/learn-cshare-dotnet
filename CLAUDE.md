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
npm run server    # local code-run sidecar (Express, port 5100) — see Playground below
```

No test suite exists in this repo.

## What this is

A **C# / .NET Interview Prep Portal** — client React SPA plus an optional local-only run sidecar. Three modes, toggled in the UI (`ModeToggle`) and driven by `App.jsx` state:

- **prep** — Q&A flashcards (`data/questions.js`, rendered by `QuestionCard`)
- **challenges** — coding challenges (`data/challenges.js`, rendered by `ChallengeCard`) with an in-card editor, a per-challenge timer, and Run via the local sidecar
- **playground** — editable code snippets (`data/playground.js`, rendered by `PlaygroundCard`) that can be executed for real via the local sidecar

## Architecture

- `App.jsx` is the single stateful container: holds `mode`, `activeCategory`, `search`, `difficulty`, `hideReviewed` and derives the visible list per mode via `useMemo` filters. There is no router and no global state library — all filtering logic lives inline in `App.jsx`.
- Each mode has its own parallel data module (`data/questions.js`, `data/challenges.js`, `data/playground.js`) exporting a flat array of items plus a `categories` array for that mode. Sidebar/category options switch based on `mode`.
- `useProgress(storageKey)` (`hooks/useProgress.js`) is a small localStorage-backed `Set` hook, reused with different keys: `csharp_portal_progress` (default, prep mode "reviewed") and `solved_challenges` (challenges mode "solved"). Playground has no progress tracking.
- Content data files (`questions.js`, `challenges.js`) hold markdown-formatted `answer`/`description` strings (backtick template literals with embedded fenced code blocks) rendered via `react-markdown` + `react-syntax-highlighter` (Prism, One Dark theme) inside the card components.
- Styling is Tailwind CSS v4 (via `@tailwindcss/vite`) using CSS custom properties for theme tokens (`hsl(var(--background))`, `--foreground`, `--border`, etc. — see `index.css`), plus a small set of shadcn-style primitives built on Radix (`@radix-ui/react-progress`, `-scroll-area`, `-slot`, `-tabs`) and `class-variance-authority`/`tailwind-merge` for variant styling (`lib/utils.js` exports the `cn` helper).
- Adding new Q&A/challenges/snippets means appending objects to the relevant array in `data/*.js` — no schema files, the object shape is defined by usage in `App.jsx` and the card components (e.g. questions need `id`, `category`, `difficulty`, `question`, `answer`, `tags`).

## Playground "Run" (local-only)

`portal/server/index.js` is a small Express sidecar, separate from Vite, bound to `127.0.0.1:5100`. It writes submitted code to a temp `.csx` file and executes it with the `dotnet-script` global tool (`dotnet tool install -g dotnet-script`), enforcing a 10s timeout and a request body size cap, then returns `{ stdout, stderr, exitCode }`.

- Vite proxies `/api/*` → `http://127.0.0.1:5100/*` (see `vite.config.js`), so `PlaygroundCard.jsx` and `ChallengeCard.jsx` just `fetch("/api/run", ...)`.
- This is intentionally **not** wired into the production build/deploy story — it shells out to a local dev tool and executes arbitrary user-submitted code, so it must never be exposed beyond localhost. Both `npm run dev` and `npm run server` need to be running side by side for Run to work; the UI shows a fallback error if the sidecar isn't reachable.
- Snippet objects can still carry a static `output` field (pre-computed expected output) shown when no live run result is present yet.
- `ChallengeCard` seeds its editor from an optional `starterCode` field on the challenge object (falls back to a generic `using System;` stub) and tracks per-challenge elapsed time in localStorage under `challenge_timer_<id>` via `useChallengeTimer` (defined in the same file, not `hooks/useProgress.js`) — separate mechanism from the solved/reviewed progress sets.

# learn-csharp-dotnet

A **C# / .NET Interview Prep Portal** — an interactive single-page application for senior developers to revise and test their knowledge of C# and .NET concepts.

## Features

- **32 curated Q&A cards** across 10 topic categories:
  - C# Fundamentals, OOP & Design, SOLID Principles
  - Collections & Generics, Async & Threading
  - .NET Runtime & CLR, Entity Framework, ASP.NET Core
  - Design Patterns, Testing
- **Syntax-highlighted code examples** in every answer
- **Progress tracking** via `localStorage` — mark questions as reviewed; progress persists across sessions
- **Search** — full-text search across questions, answers, and tags
- **Filter** by category (sidebar) and difficulty (Easy / Medium / Hard)
- **Hide reviewed** toggle to focus on unseen questions
- **Progress bar** showing percentage of questions reviewed per category
- Responsive design — works on mobile and desktop

## Getting Started

```bash
cd portal
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

### Playground "Run" (local only)

The Code Playground section can execute snippets for real using your locally installed .NET SDK, via a small local sidecar server. This only works when running locally — it is not available in the production build.

```bash
dotnet tool install -g dotnet-script   # once
cd portal
npm run server                         # in a separate terminal, alongside `npm run dev`
```

### Build for production

```bash
npm run build
# output in portal/dist/
```

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 (Vite) |
| Markdown rendering | react-markdown |
| Syntax highlighting | react-syntax-highlighter (Prism / One Dark) |
| Persistence | Browser `localStorage` |
| Styling | Plain CSS (dark theme) |

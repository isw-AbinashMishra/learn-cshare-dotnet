import { useState, useMemo } from "react";
import { questions, categories } from "./data/questions";
import { challenges, challengeCategories } from "./data/challenges";
import { snippets, playgroundCategories } from "./data/playground";
import { systemDesignChapters, systemDesignCategories } from "./data/systemDesign";
import { useProgress } from "./hooks/useProgress";
import Sidebar from "./components/Sidebar";
import Toolbar from "./components/Toolbar";
import QuestionCard from "./components/QuestionCard";
import ChallengeCard from "./components/ChallengeCard";
import PlaygroundCard from "./components/PlaygroundCard";
import SystemDesignCard from "./components/SystemDesignCard";
import ModeToggle from "./components/ModeToggle";
import "./App.css";

export default function App() {
  const [mode, setMode] = useState("prep");
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [hideReviewed, setHideReviewed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { reviewed, toggle, reset } = useProgress();
  const { reviewed: solved, toggle: toggleSolved } = useProgress("solved_challenges");
  const { reviewed: readChapters, toggle: toggleRead } = useProgress("system_design_read");

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setActiveCategory(null);
    setSearch("");
    setDifficulty("");
    setHideReviewed(false);
  };

  const visibleQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (activeCategory && q.category !== activeCategory) return false;
      if (difficulty && q.difficulty !== difficulty) return false;
      if (hideReviewed && reviewed.has(q.id)) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          q.question.toLowerCase().includes(s) ||
          q.answer.toLowerCase().includes(s) ||
          q.tags.some((t) => t.includes(s)) ||
          q.category.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [activeCategory, search, difficulty, hideReviewed, reviewed]);

  const visibleChallenges = useMemo(() => {
    return challenges.filter((c) => {
      if (activeCategory && c.category !== activeCategory) return false;
      if (difficulty && c.difficulty !== difficulty) return false;
      if (hideReviewed && solved.has(c.id)) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          c.title.toLowerCase().includes(s) ||
          c.description.toLowerCase().includes(s) ||
          c.tags.some((t) => t.includes(s)) ||
          c.category.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [activeCategory, search, difficulty, hideReviewed, solved]);

  const visibleSnippets = useMemo(() => {
    return snippets.filter((s) => {
      if (activeCategory && s.category !== activeCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeCategory, search]);

  const visibleChapters = useMemo(() => {
    return systemDesignChapters.filter((c) => {
      if (activeCategory && c.category !== activeCategory) return false;
      if (search) {
        const s = search.toLowerCase();
        return c.title.toLowerCase().includes(s) || c.category.toLowerCase().includes(s);
      }
      return true;
    });
  }, [activeCategory, search]);

  const handleReset = () => {
    if (window.confirm("Reset all progress? This cannot be undone.")) reset();
  };

  const currentCategories =
    mode === "prep" ? categories
    : mode === "challenges" ? challengeCategories
    : mode === "system-design" ? systemDesignCategories
    : playgroundCategories;

  const currentTotal =
    mode === "prep" ? questions.length
    : mode === "challenges" ? challenges.length
    : mode === "system-design" ? systemDesignChapters.length
    : snippets.length;

  const currentVisible =
    mode === "prep" ? visibleQuestions.length
    : mode === "challenges" ? visibleChallenges.length
    : mode === "system-design" ? visibleChapters.length
    : visibleSnippets.length;

  const headerTitle =
    mode === "playground" ? (activeCategory ?? "All Snippets")
    : mode === "challenges" ? (activeCategory ?? "All Challenges")
    : mode === "system-design" ? (activeCategory ?? "All Chapters")
    : (activeCategory ?? "All Topics");

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[99] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        mode={mode}
        activeCategory={activeCategory}
        onSelect={(cat) => { setActiveCategory(cat); setSidebarOpen(false); }}
        reviewed={mode === "challenges" ? solved : mode === "system-design" ? readChapters : reviewed}
        categories={currentCategories}
        totalItems={currentTotal}
        isOpen={sidebarOpen}
      />

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[hsl(var(--background))]/95 backdrop-blur border-b border-[hsl(var(--border))] px-4 md:px-6 py-3 flex items-center gap-3">
          <button
            className="md:hidden p-1.5 rounded-md text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-[hsl(var(--foreground))] truncate">{headerTitle}</h1>
        </header>

        <ModeToggle mode={mode} onChange={handleModeChange} />

        {(mode === "prep" || mode === "challenges") && (
          <Toolbar
            search={search}
            onSearch={setSearch}
            difficulty={difficulty}
            onDifficulty={setDifficulty}
            hideReviewed={hideReviewed}
            onToggleHide={setHideReviewed}
            onReset={mode === "prep" ? handleReset : undefined}
            total={currentTotal}
            visible={currentVisible}
            hideLabel={mode === "challenges" ? "Hide Solved" : undefined}
          />
        )}

        {(mode === "playground" || mode === "system-design") && (
          <div className="flex flex-wrap gap-3 items-center px-4 md:px-6 py-3 border-b border-[hsl(var(--border))]">
            <input
              className="flex-1 min-w-[200px] bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-0 placeholder:text-[hsl(var(--muted-foreground))] transition"
              placeholder={mode === "system-design" ? "Search chapters…" : "Search snippets…"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              {currentVisible} / {currentTotal} {mode === "system-design" ? "chapters" : "snippets"}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-3 p-4 md:p-6 max-w-[900px] w-full mx-auto">
          {mode === "prep" && (
            visibleQuestions.length === 0
              ? <EmptyState onClear={() => { setSearch(""); setDifficulty(""); setHideReviewed(false); }} />
              : visibleQuestions.map((q) => (
                  <QuestionCard key={q.id} question={q} isReviewed={reviewed.has(q.id)} onToggle={toggle} />
                ))
          )}

          {mode === "challenges" && (
            visibleChallenges.length === 0
              ? <EmptyState onClear={() => { setSearch(""); setDifficulty(""); setHideReviewed(false); }} />
              : visibleChallenges.map((c) => (
                  <ChallengeCard key={c.id} challenge={c} isSolved={solved.has(c.id)} onToggle={toggleSolved} />
                ))
          )}

          {mode === "playground" && (
            <>
              {visibleSnippets.length === 0
                ? <EmptyState onClear={() => setSearch("")} />
                : visibleSnippets.map((s) => <PlaygroundCard key={s.id} snippet={s} />)}
              <PlaygroundFooter />
            </>
          )}

          {mode === "system-design" && (
            visibleChapters.length === 0
              ? <EmptyState onClear={() => setSearch("")} />
              : visibleChapters.map((c) => (
                  <SystemDesignCard key={c.id} chapter={c} isRead={readChapters.has(c.id)} onToggle={toggleRead} />
                ))
          )}
        </div>
      </main>
    </div>
  );
}

function PlaygroundFooter() {
  return (
    <div className="mt-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 px-4 py-3 text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
      <p className="font-semibold text-[hsl(var(--foreground))] mb-1">Running code locally</p>
      <p>
        "Run" executes the snippet on your machine via a local server that shells out to{" "}
        <code className="text-[hsl(var(--primary))]">dotnet-script</code>. This only works when running the
        portal locally, not on a public deployment:
      </p>
      <ol className="list-decimal list-inside mt-1.5 space-y-0.5">
        <li>Install once: <code className="text-[hsl(var(--primary))]">dotnet tool install -g dotnet-script</code></li>
        <li>In <code className="text-[hsl(var(--primary))]">portal/</code>, run <code className="text-[hsl(var(--primary))]">npm run server</code> (starts on port 5100)</li>
        <li>Keep <code className="text-[hsl(var(--primary))]">npm run dev</code> running in another terminal, then hit Run</li>
      </ol>
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center py-16 gap-3 text-[hsl(var(--muted-foreground))]">
      <span className="text-4xl">🔍</span>
      <p className="text-sm">Nothing matches your filters.</p>
      <button
        className="text-[hsl(var(--primary))] text-sm underline underline-offset-4 hover:opacity-80 transition-opacity"
        onClick={onClear}
      >
        Clear filters
      </button>
    </div>
  );
}

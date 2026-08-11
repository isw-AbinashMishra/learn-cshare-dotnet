import { useState, useMemo } from "react";
import { questions, categories } from "./data/questions";
import { challenges, challengeCategories } from "./data/challenges";
import { snippets, playgroundCategories } from "./data/playground";
import { useProgress } from "./hooks/useProgress";
import Sidebar from "./components/Sidebar";
import Toolbar from "./components/Toolbar";
import QuestionCard from "./components/QuestionCard";
import ChallengeCard from "./components/ChallengeCard";
import PlaygroundCard from "./components/PlaygroundCard";
import ModeToggle from "./components/ModeToggle";
import "./App.css";

export default function App() {
  const [mode, setMode] = useState("prep"); // "prep" | "challenges" | "playground"
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [hideReviewed, setHideReviewed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { reviewed, toggle, reset } = useProgress();
  const {
    reviewed: solved,
    toggle: toggleSolved,
  } = useProgress("solved_challenges");

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setActiveCategory(null);
    setSearch("");
    setDifficulty("");
    setHideReviewed(false);
  };

  // --- Interview Prep filter ---
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

  // --- Challenges filter ---
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

  // --- Playground filter ---
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

  const handleReset = () => {
    if (window.confirm("Reset all progress? This cannot be undone.")) reset();
  };

  const currentCategories =
    mode === "prep"
      ? categories
      : mode === "challenges"
      ? challengeCategories
      : playgroundCategories;

  const currentTotal =
    mode === "prep"
      ? questions.length
      : mode === "challenges"
      ? challenges.length
      : snippets.length;

  const currentVisible =
    mode === "prep"
      ? visibleQuestions.length
      : mode === "challenges"
      ? visibleChallenges.length
      : visibleSnippets.length;

  const headerTitle =
    mode === "playground"
      ? (activeCategory ?? "All Snippets")
      : mode === "challenges"
      ? (activeCategory ?? "All Challenges")
      : (activeCategory ?? "All Topics");

  return (
    <div className="layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        mode={mode}
        activeCategory={activeCategory}
        onSelect={(cat) => {
          setActiveCategory(cat);
          setSidebarOpen(false);
        }}
        reviewed={mode === "challenges" ? solved : reviewed}
        categories={currentCategories}
        totalItems={currentTotal}
        className={sidebarOpen ? "sidebar--open" : ""}
      />

      <main className="main">
        <header className="main__header">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <h1 className="main__title">{headerTitle}</h1>
        </header>

        <ModeToggle mode={mode} onChange={handleModeChange} />

        {mode !== "playground" && (
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

        {mode === "playground" && (
          <div className="toolbar">
            <input
              className="toolbar__search"
              placeholder="Search snippets…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="toolbar__count">
              {currentVisible} / {currentTotal} snippets
            </span>
          </div>
        )}

        <div className="question-list">
          {/* ── Interview Prep ── */}
          {mode === "prep" && (
            visibleQuestions.length === 0 ? (
              <EmptyState onClear={() => { setSearch(""); setDifficulty(""); setHideReviewed(false); }} />
            ) : (
              visibleQuestions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  isReviewed={reviewed.has(q.id)}
                  onToggle={toggle}
                />
              ))
            )
          )}

          {/* ── Challenges ── */}
          {mode === "challenges" && (
            visibleChallenges.length === 0 ? (
              <EmptyState onClear={() => { setSearch(""); setDifficulty(""); setHideReviewed(false); }} />
            ) : (
              visibleChallenges.map((c) => (
                <ChallengeCard
                  key={c.id}
                  challenge={c}
                  isSolved={solved.has(c.id)}
                  onToggle={toggleSolved}
                />
              ))
            )
          )}

          {/* ── Playground ── */}
          {mode === "playground" && (
            visibleSnippets.length === 0 ? (
              <EmptyState onClear={() => setSearch("")} />
            ) : (
              visibleSnippets.map((s) => (
                <PlaygroundCard key={s.id} snippet={s} />
              ))
            )
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">🔍</span>
      <p>Nothing matches your filters.</p>
      <button className="btn-link" onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}

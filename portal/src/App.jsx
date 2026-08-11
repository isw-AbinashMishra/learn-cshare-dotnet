import { useState, useMemo } from "react";
import { questions, categories } from "./data/questions";
import { useProgress } from "./hooks/useProgress";
import Sidebar from "./components/Sidebar";
import Toolbar from "./components/Toolbar";
import QuestionCard from "./components/QuestionCard";
import "./App.css";

export default function App() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [hideReviewed, setHideReviewed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { reviewed, toggle, reset } = useProgress();

  const visible = useMemo(() => {
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

  const handleReset = () => {
    if (window.confirm("Reset all progress? This cannot be undone.")) reset();
  };

  return (
    <div className="layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        activeCategory={activeCategory}
        onSelect={(cat) => {
          setActiveCategory(cat);
          setSidebarOpen(false);
        }}
        reviewed={reviewed}
        categories={categories}
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
          <h1 className="main__title">
            {activeCategory ?? "All Topics"}
          </h1>
        </header>

        <Toolbar
          search={search}
          onSearch={setSearch}
          difficulty={difficulty}
          onDifficulty={setDifficulty}
          hideReviewed={hideReviewed}
          onToggleHide={setHideReviewed}
          onReset={handleReset}
          total={questions.length}
          visible={visible.length}
        />

        <div className="question-list">
          {visible.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state__icon">🔍</span>
              <p>No questions match your filters.</p>
              <button
                className="btn-link"
                onClick={() => {
                  setSearch("");
                  setDifficulty("");
                  setHideReviewed(false);
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            visible.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                isReviewed={reviewed.has(q.id)}
                onToggle={toggle}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

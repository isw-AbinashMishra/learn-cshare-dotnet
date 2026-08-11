import { questions } from "../data/questions";
import { challenges } from "../data/challenges";
import { snippets } from "../data/playground";

const DATA_BY_MODE = {
  prep:       questions,
  challenges: challenges,
  playground: snippets,
};

const ITEM_KEY = {
  prep:       "category",
  challenges: "category",
  playground: "category",
};

export default function Sidebar({ mode = "prep", activeCategory, onSelect, reviewed, categories, totalItems, className = "" }) {
  const allItems  = DATA_BY_MODE[mode] ?? questions;
  const total     = totalItems ?? allItems.length;
  const doneCount = reviewed ? reviewed.size : 0;
  const pct       = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const showProgress = mode !== "playground";

  return (
    <aside className={`sidebar ${className}`}>
      <div className="sidebar__brand">
        <span className="sidebar__logo">C# .NET</span>
        <span className="sidebar__subtitle">Learning Portal</span>
      </div>

      {showProgress && (
        <div className="sidebar__progress">
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="progress-label">
            {doneCount} / {total} {mode === "challenges" ? "solved" : "reviewed"} ({pct}%)
          </p>
        </div>
      )}

      <nav className="sidebar__nav">
        <button
          className={`nav-item ${activeCategory === null ? "nav-item--active" : ""}`}
          onClick={() => onSelect(null)}
        >
          {mode === "playground" ? "All Snippets" : mode === "challenges" ? "All Challenges" : "All Topics"}
        </button>
        {categories.map((cat) => {
          const catItems = allItems.filter((item) => item[ITEM_KEY[mode]] === cat);
          const count = catItems.length;
          const doneInCat = reviewed
            ? catItems.filter((item) => reviewed.has(item.id)).length
            : 0;
          return (
            <button
              key={cat}
              className={`nav-item ${activeCategory === cat ? "nav-item--active" : ""}`}
              onClick={() => onSelect(cat)}
            >
              <span className="nav-item__label">{cat}</span>
              {showProgress ? (
                <span className="nav-item__count">
                  {doneInCat}/{count}
                </span>
              ) : (
                <span className="nav-item__count">{count}</span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

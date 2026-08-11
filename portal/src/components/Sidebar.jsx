import { questions } from "../data/questions";

export default function Sidebar({ activeCategory, onSelect, reviewed, categories }) {
  const total = questions.length;
  const doneCount = reviewed.size;
  const pct = Math.round((doneCount / total) * 100);

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">C# .NET</span>
        <span className="sidebar__subtitle">Interview Prep</span>
      </div>

      <div className="sidebar__progress">
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="progress-label">
          {doneCount} / {total} reviewed ({pct}%)
        </p>
      </div>

      <nav className="sidebar__nav">
        <button
          className={`nav-item ${activeCategory === null ? "nav-item--active" : ""}`}
          onClick={() => onSelect(null)}
        >
          All Topics
        </button>
        {categories.map((cat) => {
          const count = questions.filter((q) => q.category === cat).length;
          const doneInCat = questions.filter(
            (q) => q.category === cat && reviewed.has(q.id)
          ).length;
          return (
            <button
              key={cat}
              className={`nav-item ${activeCategory === cat ? "nav-item--active" : ""}`}
              onClick={() => onSelect(cat)}
            >
              <span className="nav-item__label">{cat}</span>
              <span className="nav-item__count">
                {doneInCat}/{count}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

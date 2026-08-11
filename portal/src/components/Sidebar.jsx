import { questions } from "../data/questions";
import { challenges } from "../data/challenges";
import { snippets } from "../data/playground";

const DATA_BY_MODE = { prep: questions, challenges, playground: snippets };

export default function Sidebar({ mode = "prep", activeCategory, onSelect, reviewed, categories, totalItems, isOpen }) {
  const allItems  = DATA_BY_MODE[mode] ?? questions;
  const total     = totalItems ?? allItems.length;
  const doneCount = reviewed ? reviewed.size : 0;
  const pct       = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const showProgress = mode !== "playground";

  return (
    <aside
      className={[
        "fixed md:sticky top-0 left-0 h-screen z-[100] md:z-auto",
        "w-[268px] bg-[hsl(var(--card))] border-r border-[hsl(var(--border))]",
        "flex flex-col py-5 px-3 overflow-y-auto flex-shrink-0",
        "transition-transform duration-250 ease-in-out",
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
    >
      {/* Brand */}
      <div className="px-3 mb-5">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xl">⚡</span>
          <span className="text-base font-bold text-[hsl(var(--primary))] tracking-tight">C# .NET</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Learning Portal</span>
      </div>

      {/* Progress */}
      {showProgress && (
        <div className="px-3 mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
              {mode === "challenges" ? "Solved" : "Reviewed"}
            </span>
            <span className="text-[11px] font-semibold text-[hsl(var(--primary))]">{pct}%</span>
          </div>
          <div className="h-1.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-[hsl(var(--primary))] rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">
            {doneCount} / {total}
          </p>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-[hsl(var(--border))] mx-3 mb-3" />

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        <NavItem
          label={mode === "playground" ? "All Snippets" : mode === "challenges" ? "All Challenges" : "All Topics"}
          count={total}
          done={showProgress ? doneCount : null}
          active={activeCategory === null}
          onClick={() => onSelect(null)}
        />
        {categories.map((cat) => {
          const catItems = allItems.filter((item) => item.category === cat);
          const count = catItems.length;
          const doneInCat = reviewed ? catItems.filter((item) => reviewed.has(item.id)).length : 0;
          return (
            <NavItem
              key={cat}
              label={cat}
              count={count}
              done={showProgress ? doneInCat : null}
              active={activeCategory === cat}
              onClick={() => onSelect(cat)}
            />
          );
        })}
      </nav>
    </aside>
  );
}

function NavItem({ label, count, done, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex justify-between items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors",
        active
          ? "bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary))] font-semibold"
          : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]",
      ].join(" ")}
    >
      <span className="truncate leading-snug">{label}</span>
      <span className={[
        "shrink-0 text-[10px] px-1.5 py-0.5 rounded-full border",
        active
          ? "bg-[hsl(var(--primary))]/20 border-[hsl(var(--primary))]/40 text-[hsl(var(--primary))]"
          : "bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]",
      ].join(" ")}>
        {done !== null ? `${done}/${count}` : count}
      </span>
    </button>
  );
}

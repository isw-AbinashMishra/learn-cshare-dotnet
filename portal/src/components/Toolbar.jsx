import { Search, Filter, RotateCcw, EyeOff } from "lucide-react";

export default function Toolbar({
  search, onSearch, difficulty, onDifficulty,
  hideReviewed, onToggleHide, onReset,
  total, visible, hideLabel = "Hide reviewed",
}) {
  return (
    <div className="flex flex-wrap gap-2 items-center px-4 md:px-6 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
        <input
          type="search"
          placeholder="Search questions or tags…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-lg pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 placeholder:text-[hsl(var(--muted-foreground))] transition"
        />
      </div>

      {/* Difficulty filter */}
      <div className="relative">
        <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[hsl(var(--muted-foreground))]" />
        <select
          value={difficulty}
          onChange={(e) => onDifficulty(e.target.value)}
          className="bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-lg pl-7 pr-3 py-2 text-sm cursor-pointer outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 transition appearance-none"
        >
          <option value="">All levels</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Hide toggle */}
      <label className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] cursor-pointer select-none group">
        <div
          onClick={() => onToggleHide(!hideReviewed)}
          className={[
            "w-8 h-4.5 rounded-full relative transition-colors cursor-pointer flex items-center",
            hideReviewed ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--muted))]",
          ].join(" ")}
          style={{ height: "18px" }}
        >
          <div
            className={[
              "absolute w-3.5 h-3.5 bg-white rounded-full shadow transition-transform",
              hideReviewed ? "translate-x-[18px]" : "translate-x-[2px]",
            ].join(" ")}
          />
        </div>
        <EyeOff className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{hideLabel}</span>
      </label>

      {/* Count badge */}
      <span className="ml-auto text-xs font-mono text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2.5 py-1 rounded-full border border-[hsl(var(--border))]">
        {visible} / {total}
      </span>

      {/* Reset */}
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))] px-2.5 py-1.5 rounded-lg hover:border-red-500/60 hover:text-red-400 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      )}
    </div>
  );
}

const TABS = [
  { id: "prep",       emoji: "📋", label: "Interview Prep" },
  { id: "challenges", emoji: "🧩", label: "Challenges" },
  { id: "playground", emoji: "🛝", label: "Playground" },
  { id: "system-design", emoji: "🏗️", label: "System Design" },
];

export default function ModeToggle({ mode, onChange }) {
  return (
    <div className="px-4 md:px-6 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]/50">
      <div className="inline-flex p-1 bg-[hsl(var(--muted))] rounded-xl gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
              mode === tab.id
                ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]",
            ].join(" ")}
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

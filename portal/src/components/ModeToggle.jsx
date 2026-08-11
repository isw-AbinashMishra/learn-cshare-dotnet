export default function ModeToggle({ mode, onChange }) {
  const tabs = [
    { id: "prep",       label: "📋 Interview Prep" },
    { id: "challenges", label: "🧩 Challenges" },
    { id: "playground", label: "🛝 Playground" },
  ];

  return (
    <div className="mode-toggle">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`mode-toggle__btn ${mode === tab.id ? "mode-toggle__btn--active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

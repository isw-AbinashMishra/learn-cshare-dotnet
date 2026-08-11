export default function Toolbar({
  search,
  onSearch,
  difficulty,
  onDifficulty,
  hideReviewed,
  onToggleHide,
  onReset,
  total,
  visible,
}) {
  return (
    <div className="toolbar">
      <input
        className="toolbar__search"
        type="search"
        placeholder="Search questions or tags…"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <select
        className="toolbar__select"
        value={difficulty}
        onChange={(e) => onDifficulty(e.target.value)}
      >
        <option value="">All difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <label className="toolbar__toggle">
        <input
          type="checkbox"
          checked={hideReviewed}
          onChange={(e) => onToggleHide(e.target.checked)}
        />
        Hide reviewed
      </label>

      <span className="toolbar__count">
        {visible} / {total}
      </span>

      <button className="toolbar__reset" onClick={onReset} title="Reset all progress">
        Reset progress
      </button>
    </div>
  );
}

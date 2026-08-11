import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const DIFFICULTY_COLOR = {
  Easy: "badge-easy",
  Medium: "badge-medium",
  Hard: "badge-hard",
};

export default function ChallengeCard({ challenge, isSolved, onToggle }) {
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const nextHint = () => {
    if (hintIndex < challenge.hints.length - 1) {
      setHintIndex((i) => i + 1);
    }
  };

  return (
    <div className={`card challenge-card ${isSolved ? "card--reviewed" : ""}`}>
      <div className="card__header challenge-card__header">
        <div className="card__meta">
          <span className={`badge ${DIFFICULTY_COLOR[challenge.difficulty]}`}>
            {challenge.difficulty}
          </span>
          <span className="card__category">{challenge.category}</span>
        </div>
        <h3 className="card__title challenge-card__title">
          {challenge.title}
        </h3>
        <div className="card__tags">
          {challenge.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="card__body challenge-card__body">
        {/* Description */}
        <div className="challenge-section">
          <p className="challenge-description">{challenge.description}</p>
        </div>

        {/* Examples */}
        {challenge.examples.length > 0 && (
          <div className="challenge-section">
            <h4 className="challenge-section__title">Examples</h4>
            <div className="examples-grid">
              {challenge.examples.map((ex, i) => (
                <div key={i} className="example-row">
                  <div className="example-cell">
                    <span className="example-label">Input</span>
                    <code className="example-code">{ex.input}</code>
                  </div>
                  <span className="example-arrow">→</span>
                  <div className="example-cell">
                    <span className="example-label">Output</span>
                    <code className="example-code">{ex.output}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hints */}
        <div className="challenge-section challenge-actions">
          <button
            className="btn-hint"
            onClick={() => setShowHint((h) => !h)}
          >
            💡 {showHint ? "Hide Hints" : "Show Hint"}
          </button>

          <button
            className={`btn-solution ${showSolution ? "btn-solution--active" : ""}`}
            onClick={() => setShowSolution((s) => !s)}
          >
            {showSolution ? "🙈 Hide Solution" : "👁 View Solution"}
          </button>

          <button
            className={`btn-review ${isSolved ? "btn-review--done" : ""}`}
            onClick={() => onToggle(challenge.id)}
          >
            {isSolved ? "✓ Solved" : "Mark as Solved"}
          </button>
        </div>

        {showHint && (
          <div className="hints-box">
            {challenge.hints.slice(0, hintIndex + 1).map((hint, i) => (
              <div key={i} className="hint-item">
                <span className="hint-num">Hint {i + 1}</span>
                <p>{hint}</p>
              </div>
            ))}
            {hintIndex < challenge.hints.length - 1 && (
              <button className="btn-next-hint" onClick={nextHint}>
                Next hint ({hintIndex + 1}/{challenge.hints.length - 1} more)
              </button>
            )}
          </div>
        )}

        {showSolution && (
          <div className="solution-box">
            <h4 className="challenge-section__title">Solution</h4>
            <SyntaxHighlighter
              style={oneDark}
              language="csharp"
              PreTag="div"
              customStyle={{ borderRadius: "var(--radius)", fontSize: "0.82rem", margin: 0 }}
            >
              {challenge.solution}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
}

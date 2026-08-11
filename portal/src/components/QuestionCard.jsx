import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const DIFFICULTY_COLOR = {
  Easy: "badge-easy",
  Medium: "badge-medium",
  Hard: "badge-hard",
};

export default function QuestionCard({ question, isReviewed, onToggle }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`card ${isReviewed ? "card--reviewed" : ""}`}>
      <div className="card__header" onClick={() => setOpen((o) => !o)}>
        <div className="card__meta">
          <span className={`badge ${DIFFICULTY_COLOR[question.difficulty]}`}>
            {question.difficulty}
          </span>
          <span className="card__category">{question.category}</span>
        </div>
        <div className="card__title-row">
          <h3 className="card__title">{question.question}</h3>
          <span className="card__chevron">{open ? "▲" : "▼"}</span>
        </div>
        <div className="card__tags">
          {question.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>

      {open && (
        <div className="card__body">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="inline-code" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {question.answer}
          </ReactMarkdown>

          <button
            className={`btn-review ${isReviewed ? "btn-review--done" : ""}`}
            onClick={() => onToggle(question.id)}
          >
            {isReviewed ? "✓ Reviewed" : "Mark as Reviewed"}
          </button>
        </div>
      )}
    </div>
  );
}

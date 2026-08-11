import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function PlaygroundCard({ snippet }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard not available in some environments — silently ignore
    }
  };

  return (
    <div className="card playground-card">
      <div className="playground-card__header">
        <div className="card__meta">
          <span className="badge badge-playground">{snippet.category}</span>
        </div>
        <h3 className="card__title playground-card__title">{snippet.title}</h3>
        <p className="playground-card__summary">{snippet.summary}</p>
      </div>

      <div className="card__body playground-card__body">
        {/* Code block with copy button */}
        <div className="playground-code-wrapper">
          <div className="playground-code-toolbar">
            <span className="playground-lang-label">C#</span>
            <button className="btn-copy" onClick={handleCopy}>
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language="csharp"
            PreTag="div"
            customStyle={{
              borderRadius: "0 0 var(--radius) var(--radius)",
              fontSize: "0.82rem",
              margin: 0,
            }}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>

        {/* Expected output */}
        {snippet.output && (
          <div className="playground-output">
            <span className="playground-output__label">▶ Output</span>
            <pre className="playground-output__pre">{snippet.output}</pre>
          </div>
        )}

        {/* Notes */}
        {snippet.notes && snippet.notes.length > 0 && (
          <div className="playground-notes">
            <h4 className="challenge-section__title">📌 Key Notes</h4>
            <ul className="playground-notes__list">
              {snippet.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

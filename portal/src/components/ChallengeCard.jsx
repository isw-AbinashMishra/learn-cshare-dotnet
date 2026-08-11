import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Lightbulb, Eye, EyeOff, CheckCircle2, Circle, ChevronRight } from "lucide-react";

const DIFFICULTY_STYLES = {
  Easy:   "bg-green-500/15 text-green-400 border-green-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Hard:   "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function ChallengeCard({ challenge, isSolved, onToggle }) {
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className={[
      "rounded-xl border bg-[hsl(var(--card))] overflow-hidden transition-all",
      isSolved
        ? "border-green-500/40"
        : "border-[hsl(var(--border))] hover:border-[hsl(var(--border))]/80",
    ].join(" ")}>
      {/* Header */}
      <div className="px-4 py-3.5 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${DIFFICULTY_STYLES[challenge.difficulty]}`}>
            {challenge.difficulty}
          </span>
          <span className="text-[11px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2 py-0.5 rounded-full">
            {challenge.category}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{challenge.title}</h3>
        <div className="flex flex-wrap gap-1.5">
          {challenge.tags.map((t) => (
            <span key={t} className="text-[10px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-1.5 py-0.5 rounded-md font-mono">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="border-t border-[hsl(var(--border))] px-4 py-4 flex flex-col gap-4">
        <p className="text-sm text-[hsl(var(--foreground))]/90 leading-relaxed whitespace-pre-wrap">{challenge.description}</p>

        {/* Examples */}
        {challenge.examples.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Examples</p>
            {challenge.examples.map((ex, i) => (
              <div key={i} className="flex items-center gap-3 flex-wrap bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase text-[hsl(var(--muted-foreground))]">Input</span>
                  <code className="font-mono text-xs text-blue-300 bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded">{ex.input}</code>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase text-[hsl(var(--muted-foreground))]">Output</span>
                  <code className="font-mono text-xs text-blue-300 bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded">{ex.output}</code>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowHint((h) => !h)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[hsl(var(--primary))]/30 text-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 hover:bg-[hsl(var(--primary))]/15 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {showHint ? "Hide Hints" : "Show Hint"}
          </button>

          <button
            onClick={() => setShowSolution((s) => !s)}
            className={[
              "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors",
              showSolution
                ? "border-green-500/40 text-green-400 bg-green-500/15"
                : "border-green-500/25 text-green-400 bg-green-500/8 hover:bg-green-500/15",
            ].join(" ")}
          >
            {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showSolution ? "Hide Solution" : "View Solution"}
          </button>

          <button
            onClick={() => onToggle(challenge.id)}
            className={[
              "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ml-auto",
              isSolved
                ? "border-green-500/40 text-green-400 bg-green-500/8"
                : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-green-500/40 hover:text-green-400",
            ].join(" ")}
          >
            {isSolved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
            {isSolved ? "Solved" : "Mark Solved"}
          </button>
        </div>

        {/* Hints */}
        {showHint && (
          <div className="flex flex-col gap-3 bg-[hsl(var(--muted))]/60 border border-[hsl(var(--primary))]/15 rounded-lg p-3">
            {challenge.hints.slice(0, hintIndex + 1).map((hint, i) => (
              <div key={i}>
                <span className="block text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--primary))] mb-1">Hint {i + 1}</span>
                <p className="text-sm text-[hsl(var(--foreground))]/80">{hint}</p>
              </div>
            ))}
            {hintIndex < challenge.hints.length - 1 && (
              <button
                onClick={() => setHintIndex((i) => i + 1)}
                className="self-start text-xs border border-dashed border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] px-2.5 py-1 rounded-md hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition-colors"
              >
                Next hint ({hintIndex + 1}/{challenge.hints.length - 1} remaining)
              </button>
            )}
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-2">Solution</p>
            <SyntaxHighlighter
              style={oneDark}
              language="csharp"
              PreTag="div"
              customStyle={{ borderRadius: "0.5rem", fontSize: "0.82rem", margin: 0 }}
            >
              {challenge.solution}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
}

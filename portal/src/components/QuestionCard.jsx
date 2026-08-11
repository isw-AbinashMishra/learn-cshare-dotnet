import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChevronDown, ChevronUp, CheckCircle2, Circle } from "lucide-react";

const DIFFICULTY_STYLES = {
  Easy:   "bg-green-500/15 text-green-400 border-green-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Hard:   "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function QuestionCard({ question, isReviewed, onToggle }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={[
      "rounded-xl border bg-[hsl(var(--card))] overflow-hidden transition-all duration-150",
      isReviewed
        ? "border-green-500/40 shadow-[0_0_0_1px_rgba(74,222,128,0.1)]"
        : "border-[hsl(var(--border))] hover:border-[hsl(var(--border))]/80",
      open ? "shadow-lg shadow-black/20" : "",
    ].join(" ")}>
      {/* Header */}
      <div
        className="px-4 py-3.5 cursor-pointer flex flex-col gap-2.5 select-none"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${DIFFICULTY_STYLES[question.difficulty]}`}>
            {question.difficulty}
          </span>
          <span className="text-[11px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2 py-0.5 rounded-full">
            {question.category}
          </span>
          <span className="ml-auto text-[hsl(var(--muted-foreground))]">
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </div>

        {/* Question */}
        <h3 className="text-sm font-medium text-[hsl(var(--foreground))] leading-relaxed">
          {question.question}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {question.tags.map((t) => (
            <span key={t} className="text-[10px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-1.5 py-0.5 rounded-md font-mono">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Answer body */}
      {open && (
        <div className="border-t border-[hsl(var(--border))] px-4 py-4 text-sm leading-relaxed">
          <div className="prose-answer">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="inline-code" {...props}>{children}</code>
                  );
                },
              }}
            >
              {question.answer}
            </ReactMarkdown>
          </div>

          {/* Mark reviewed button */}
          <button
            onClick={() => onToggle(question.id)}
            className={[
              "mt-4 flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-all",
              isReviewed
                ? "border-green-500/40 text-green-400 bg-green-500/8 hover:bg-green-500/12"
                : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-green-500/40 hover:text-green-400",
            ].join(" ")}
          >
            {isReviewed
              ? <><CheckCircle2 className="w-4 h-4" /> Reviewed</>
              : <><Circle className="w-4 h-4" /> Mark as Reviewed</>}
          </button>
        </div>
      )}
    </div>
  );
}

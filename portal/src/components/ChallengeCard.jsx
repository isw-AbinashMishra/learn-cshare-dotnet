import { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Lightbulb, Eye, EyeOff, CheckCircle2, Circle, ChevronRight,
  Play, Loader2, Terminal, Timer as TimerIcon, RotateCcw, Pause,
} from "lucide-react";

const DIFFICULTY_STYLES = {
  Easy:   "bg-green-500/15 text-green-400 border-green-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Hard:   "bg-red-500/15 text-red-400 border-red-500/30",
};

const DEFAULT_STARTER = "using System;\n\n// Write your solution below, then call it to test.\n";

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function useChallengeTimer(challengeId) {
  const storageKey = `challenge_timer_${challengeId}`;
  const [seconds, setSeconds] = useState(() => {
    try {
      return Number(localStorage.getItem(storageKey)) || 0;
    } catch {
      return 0;
    }
  });
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  useEffect(() => {
    localStorage.setItem(storageKey, String(seconds));
  }, [storageKey, seconds]);

  const reset = () => {
    setRunning(false);
    setSeconds(0);
  };

  return { seconds, running, setRunning, reset };
}

export default function ChallengeCard({ challenge, isSolved, onToggle }) {
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [code, setCode] = useState(challenge.starterCode || DEFAULT_STARTER);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const timer = useChallengeTimer(challenge.id);

  const handleRun = async () => {
    setRunning(true);
    setRunResult(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setRunResult(res.ok ? data : { stdout: "", stderr: data.error ?? "Run failed.", exitCode: null });
    } catch {
      setRunResult({
        stdout: "",
        stderr: "Could not reach the local run server. Start it with `npm run server` in portal/.",
        exitCode: null,
      });
    } finally {
      setRunning(false);
    }
  };

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

        {/* Timer */}
        <div className="flex items-center gap-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg px-3 py-1.5 w-fit">
          <TimerIcon className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
          <span className="font-mono text-sm text-[hsl(var(--foreground))]">{formatTime(timer.seconds)}</span>
          <button
            onClick={() => timer.setRunning((r) => !r)}
            className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
            aria-label={timer.running ? "Pause timer" : "Start timer"}
          >
            {timer.running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={timer.reset}
            className="text-[hsl(var(--muted-foreground))] hover:text-red-400 transition-colors"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Editor */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Your Solution</p>
          <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
            <div className="flex justify-between items-center bg-[#1e252e] px-3 py-2 border-b border-[hsl(var(--border))]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">C#</span>
              <button
                onClick={handleRun}
                disabled={running}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-all border-green-500/40 text-green-400 bg-green-500/10 hover:bg-green-500/20 disabled:opacity-50"
              >
                {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                {running ? "Running…" : "Run"}
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full min-h-[160px] font-mono text-[0.82rem] leading-relaxed bg-[#282c34] text-[#abb2bf] p-3 outline-none resize-y"
            />
          </div>
          {runResult && (
            <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/6 border-b border-[hsl(var(--border))]">
                <Terminal className="w-3 h-3 text-green-400" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-green-400">Run Output</span>
                {runResult.exitCode !== null && (
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))] ml-auto">exit {runResult.exitCode}</span>
                )}
              </div>
              <pre className="px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words bg-[hsl(var(--background))]">
                {runResult.stdout && <span className="text-[#b5ceaa]">{runResult.stdout}</span>}
                {runResult.stderr && <span className="text-red-400">{runResult.stderr}</span>}
                {!runResult.stdout && !runResult.stderr && (
                  <span className="text-[hsl(var(--muted-foreground))]">(no output)</span>
                )}
              </pre>
            </div>
          )}
        </div>

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
            onClick={() => { if (!isSolved) timer.setRunning(false); onToggle(challenge.id); }}
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

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Terminal, BookOpen, Play, Loader2 } from "lucide-react";

export default function PlaygroundCard({ snippet }) {
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(snippet.code);
  const [editing, setEditing] = useState(false);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  };

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
      if (!res.ok) {
        setRunResult({ stdout: "", stderr: data.error ?? "Run failed.", exitCode: null });
      } else {
        setRunResult(data);
      }
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
    <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden hover:border-[hsl(var(--border))]/80 transition-all">
      {/* Header */}
      <div className="px-4 py-3.5 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-[hsl(var(--primary))]/12 text-[hsl(var(--primary))] border-[hsl(var(--primary))]/25">
            {snippet.category}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{snippet.title}</h3>
        <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{snippet.summary}</p>
      </div>

      {/* Body */}
      <div className="border-t border-[hsl(var(--border))] px-4 py-4 flex flex-col gap-3">
        {/* Code block */}
        <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
          <div className="flex justify-between items-center bg-[#1e252e] px-3 py-2 border-b border-[hsl(var(--border))]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">C#</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing((e) => !e)}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-all border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))]/50 hover:text-[hsl(var(--primary))]"
              >
                {editing ? "View" : "Edit"}
              </button>
              <button
                onClick={handleCopy}
                className={[
                  "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-all",
                  copied
                    ? "border-green-500/40 text-green-400 bg-green-500/10"
                    : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))]/50 hover:text-[hsl(var(--primary))]",
                ].join(" ")}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleRun}
                disabled={running}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-all border-green-500/40 text-green-400 bg-green-500/10 hover:bg-green-500/20 disabled:opacity-50"
              >
                {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                {running ? "Running…" : "Run"}
              </button>
            </div>
          </div>
          {editing ? (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full min-h-[160px] font-mono text-[0.82rem] leading-relaxed bg-[#282c34] text-[#abb2bf] p-3 outline-none resize-y"
            />
          ) : (
            <SyntaxHighlighter
              style={oneDark}
              language="csharp"
              PreTag="div"
              customStyle={{ borderRadius: 0, fontSize: "0.82rem", margin: 0 }}
            >
              {code}
            </SyntaxHighlighter>
          )}
        </div>

        {/* Run result (live, via local dotnet-script server) */}
        {runResult && (
          <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/6 border-b border-[hsl(var(--border))]">
              <Terminal className="w-3 h-3 text-green-400" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-green-400">Run Output</span>
              {runResult.exitCode !== null && (
                <span className="text-[10px] text-[hsl(var(--muted-foreground))] ml-auto">
                  exit {runResult.exitCode}
                </span>
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

        {/* Expected output (static, from the snippet data) */}
        {snippet.output && !runResult && (
          <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/6 border-b border-[hsl(var(--border))]">
              <Terminal className="w-3 h-3 text-green-400" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-green-400">Expected Output</span>
            </div>
            <pre className="px-3 py-2.5 font-mono text-xs leading-relaxed text-[#b5ceaa] whitespace-pre-wrap break-words bg-[hsl(var(--background))]">
              {snippet.output}
            </pre>
          </div>
        )}

        {/* Notes */}
        {snippet.notes && snippet.notes.length > 0 && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-3">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Key Notes</span>
            </div>
            <ul className="flex flex-col gap-1.5 list-none">
              {snippet.notes.map((note, i) => (
                <li key={i} className="text-xs text-[hsl(var(--foreground))]/80 pl-4 relative before:content-['→'] before:absolute before:left-0 before:text-amber-400/80 before:text-[10px]">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

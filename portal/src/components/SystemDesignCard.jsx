import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChevronDown, ChevronUp, CheckCircle2, Circle, AlertTriangle } from "lucide-react";
import { chapterMdUrls, chapterImageBaseUrl } from "../data/systemDesign";

function resolveImageSrc(src, baseUrl) {
  if (!src || /^https?:\/\//.test(src)) return src;
  const clean = src.replace(/^\.\//, "");
  return baseUrl + clean.split("/").map(encodeURIComponent).join("/");
}

export default function SystemDesignCard({ chapter, isRead, onToggle }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState("idle"); // idle | loading | ready | missing | error
  const [content, setContent] = useState("");

  const load = async () => {
    if (state === "ready" || state === "loading") return;
    setState("loading");
    try {
      for (const url of chapterMdUrls(chapter)) {
        const res = await fetch(url);
        const text = await res.text();
        const isHtmlFallback = text.trimStart().startsWith("<!doctype") || text.trimStart().startsWith("<html");
        if (res.ok && !isHtmlFallback) {
          setContent(text);
          setState("ready");
          return;
        }
      }
      setState("missing");
    } catch {
      setState("error");
    }
  };

  const handleToggleOpen = () => {
    setOpen((o) => !o);
    if (!open) load();
  };

  const imageBase = chapterImageBaseUrl(chapter);

  return (
    <div className={[
      "rounded-xl border bg-[hsl(var(--card))] overflow-hidden transition-all duration-150",
      isRead
        ? "border-green-500/40 shadow-[0_0_0_1px_rgba(74,222,128,0.1)]"
        : "border-[hsl(var(--border))] hover:border-[hsl(var(--border))]/80",
    ].join(" ")}>
      <div
        className="px-4 py-3.5 cursor-pointer flex items-center gap-2.5 select-none"
        onClick={handleToggleOpen}
      >
        <span className="text-[11px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2 py-0.5 rounded-full shrink-0">
          Ch. {chapter.id}
        </span>
        <h3 className="text-sm font-medium text-[hsl(var(--foreground))] leading-relaxed flex-1">
          {chapter.title}
        </h3>
        <span className="text-[hsl(var(--muted-foreground))]">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </div>

      {open && (
        <div className="border-t border-[hsl(var(--border))] px-4 py-4 text-sm leading-relaxed">
          {state === "loading" && (
            <p className="text-[hsl(var(--muted-foreground))]">Loading…</p>
          )}

          {state === "missing" && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-3 text-xs text-[hsl(var(--foreground))]/80">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-400 mb-1">Notes not found locally</p>
                <p>This section reads from a local-only clone of the reference notes. See the README's "System Design Notes (local only)" section for the one-time setup command.</p>
              </div>
            </div>
          )}

          {state === "error" && (
            <p className="text-red-400 text-xs">Could not load this chapter.</p>
          )}

          {state === "ready" && (
            <div className="prose-answer">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
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
                  img({ src, alt, ...props }) {
                    return <img src={resolveImageSrc(src, imageBase)} alt={alt} className="max-w-full rounded-lg" {...props} />;
                  },
                  a({ href, children, ...props }) {
                    return <a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>;
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}

          {state === "ready" && (
            <button
              onClick={() => onToggle(chapter.id)}
              className={[
                "mt-4 flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-all",
                isRead
                  ? "border-green-500/40 text-green-400 bg-green-500/8 hover:bg-green-500/12"
                  : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-green-500/40 hover:text-green-400",
              ].join(" ")}
            >
              {isRead
                ? <><CheckCircle2 className="w-4 h-4" /> Read</>
                : <><Circle className="w-4 h-4" /> Mark as Read</>}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

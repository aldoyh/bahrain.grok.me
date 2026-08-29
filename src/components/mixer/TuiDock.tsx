import { useEffect, useMemo, useRef, useState } from "react";
import { COMMANDS, runCommand, suggestCommands } from "@/lib/mixer/commands";
import { useMixer } from "@/lib/mixer/store";
import { cn } from "@/lib/utils";

export function TuiDock({
  expanded = false,
  className,
}: {
  expanded?: boolean;
  className?: string;
}) {
  const logs = useMixer((s) => s.logs);
  const [value, setValue] = useState("");
  const [sel, setSel] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => suggestCommands(value), [value]);
  const showSuggest = value.trim().length > 0 && suggestions.length > 0;

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs.length]);

  function submit(raw?: string) {
    const line = (raw ?? value).trim();
    if (!line) return;
    const extra = runCommand(line);
    if (extra) {
      extra.split("\n").forEach((msg) => useMixer.getState().log("info", msg));
    }
    setHistory((h) => [...h.slice(-40), line]);
    setHistIdx(-1);
    setValue("");
    setSel(0);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (showSuggest && suggestions[sel] && !value.includes(" ")) {
        submit(suggestions[sel]!.name);
        return;
      }
      submit();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const first = suggestions[sel] ?? suggestions[0];
      if (first && !value.includes(" ")) setValue(first.name + " ");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (showSuggest) setSel((n) => Math.min(suggestions.length - 1, n + 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (showSuggest) {
        setSel((n) => Math.max(0, n - 1));
        return;
      }
      if (history.length) {
        const next = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(next);
        setValue(history[next] ?? "");
      }
      return;
    }
    if (e.key === "Escape") {
      setValue("");
      inputRef.current?.blur();
    }
  }

  const levelColor: Record<string, string> = {
    info: "text-info",
    ok: "text-ok",
    warn: "text-warn",
    error: "text-program",
  };
  const levelTag: Record<string, string> = {
    info: "INFO",
    ok: "DONE",
    warn: "WARN",
    error: "FAIL",
  };

  return (
    <section
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-md bg-bg font-mono text-[12px] shadow-[var(--shadow-border)]",
        expanded ? "h-full" : "h-[13.5rem] max-lg:h-full lg:h-52",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-[10px] text-muted">
        <span>ffmix-cli  ·  Laravel Prompts</span>
        <span className="hidden sm:inline">Tab complete  ·  / to focus  ·  Enter cut  ·  Space auto</span>
      </div>
      <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_16rem]">
        <div ref={logRef} className="tui-scroll min-h-0 overflow-auto px-3 py-2">
          {logs.slice(expanded ? -80 : -24).map((line) => (
            <p key={line.id} className="leading-5 text-fg">
              <span className={cn("mr-2 inline-block w-10", levelColor[line.level])}>
                {levelTag[line.level]}
              </span>
              <span className="text-fg/90">{line.msg}</span>
            </p>
          ))}
        </div>
        <div className="hidden border-l border-border p-2 lg:block">
          <p className="mb-1 text-[10px] tracking-[0.14em] text-muted">COMMANDS</p>
          <ul className="space-y-0.5 text-[11px] text-muted">
            {COMMANDS.slice(0, 10).map((c) => (
              <li key={c.name}>
                <button
                  type="button"
                  className="w-full truncate text-left hover:text-tui"
                  onClick={() => {
                    setValue(c.name + " ");
                    inputRef.current?.focus();
                  }}
                >
                  {c.usage}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-border">
        {showSuggest ? (
          <div className="absolute inset-x-2 bottom-full z-10 mb-1 overflow-hidden rounded-sm border border-border bg-surface">
            <p className="border-b border-border px-3 py-1 text-[10px] text-muted">Select command</p>
            {suggestions.slice(0, 6).map((c, i) => (
              <button
                key={c.name}
                type="button"
                onMouseEnter={() => setSel(i)}
                onClick={() => submit(c.name)}
                className={cn(
                  "flex min-h-11 w-full items-center gap-2 px-3 py-1.5 text-left text-[12px]",
                  i === sel ? "bg-tui/15 text-tui" : "text-muted",
                )}
              >
                <span className="w-3">{i === sel ? "›" : " "}</span>
                <span className="w-24">{c.name}</span>
                <span className="truncate text-muted">{c.hint}</span>
              </button>
            ))}
          </div>
        ) : null}
        <label className="flex items-center gap-2 px-3 py-2 max-lg:min-h-12">
          <span className="text-tui">❯</span>
          <input
            id="ffmix-prompt"
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setSel(0);
            }}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            placeholder="take  ·  source 3 youtube  ·  fade 800  ·  overlay 1"
            className="h-8 min-w-0 flex-1 bg-transparent text-[13px] text-fg outline-none placeholder:text-subtle"
            suppressHydrationWarning
          />
        </label>
      </div>
    </section>
  );
}

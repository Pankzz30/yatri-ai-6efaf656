import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, RotateCcw, MapPin, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/hooks/use-toast";

/* ── Types ──────────────────────────────────────────── */
type Role = "user" | "assistant";
interface Message {
  id: string;
  role: Role;
  content: string;
  streaming?: boolean;
}

/* ── Prompt suggestions ─────────────────────────────── */
const SUGGESTIONS = [
  "Plan a 5-day trip to Rajasthan with a ₹20,000 budget",
  "Weekend getaway to Rishikesh for adventure lovers",
  "Family trip to Goa for 7 days, balanced budget",
  "Offbeat 4-day trip to Hampi and Badami",
  "Honeymoon itinerary to Udaipur and Jodhpur",
  "Solo backpacking route through Northeast India",
];

/* ── Streaming helper ───────────────────────────────── */
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/travel-chat`;

async function streamChat(
  messages: { role: Role; content: string }[],
  onDelta: (chunk: string) => void,
  onDone: () => void,
  onError: (msg: string) => void,
  signal: AbortSignal
) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages }),
      signal,
    });

    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}));
      if (resp.status === 429) { onError("Rate limit reached. Please wait a moment and try again."); return; }
      if (resp.status === 402) { onError("AI usage limit reached. Please add credits to your workspace."); return; }
      onError(data.error || "Something went wrong. Please try again.");
      return;
    }

    if (!resp.body) { onError("No response stream received."); return; }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let done = false;

    while (!done) {
      const { done: streamDone, value } = await reader.read();
      if (streamDone) break;
      buf += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = buf.indexOf("\n")) !== -1) {
        let line = buf.slice(0, nl);
        buf = buf.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ") || line.trim() === "data: ") continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") { done = true; break; }
        try {
          const parsed = JSON.parse(json);
          const text = parsed.choices?.[0]?.delta?.content;
          if (text) onDelta(text);
        } catch {
          buf = line + "\n" + buf;
          break;
        }
      }
    }

    // flush
    if (buf.trim()) {
      for (let raw of buf.split("\n")) {
        if (!raw.startsWith("data: ")) continue;
        const json = raw.slice(6).trim();
        if (json === "[DONE]" || !json) continue;
        try {
          const parsed = JSON.parse(json);
          const text = parsed.choices?.[0]?.delta?.content;
          if (text) onDelta(text);
        } catch { /* ignore */ }
      }
    }

    onDone();
  } catch (e: unknown) {
    if (e instanceof Error && e.name === "AbortError") return;
    onError("Connection interrupted. Please try again.");
  }
}

/* ── Copy button ─────────────────────────────────────── */
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {copied ? <><Check size={11} className="text-primary" /> Copied</> : <><Copy size={11} /> Copy</>}
    </button>
  );
};

/* ── Typing cursor ───────────────────────────────────── */
const Cursor = () => (
  <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 rounded-sm bg-primary" style={{ animation: "blink 1s step-end infinite" }} />
);

/* ═══════════════════════════════════════════════════
   PLAN PAGE
═══════════════════════════════════════════════════ */
const Plan = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const autoSentRef = useRef(false);

  /* auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* auto-send prompt coming from hero form */
  useEffect(() => {
    const navPrompt = (location.state as { prompt?: string } | null)?.prompt;
    if (navPrompt && !autoSentRef.current) {
      autoSentRef.current = true;
      // small delay so the page renders first
      const t = setTimeout(() => send(navPrompt), 300);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: trimmed };
    const assistantId = crypto.randomUUID();

    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: "assistant", content: "", streaming: true }]);
    setInput("");
    setLoading(true);

    const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));

    abortRef.current = new AbortController();

    await streamChat(
      history,
      (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        );
      },
      () => {
        setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, streaming: false } : m));
        setLoading(false);
      },
      (errMsg) => {
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        toast({ title: "Yatri AI", description: errMsg, variant: "destructive" });
        setLoading(false);
      },
      abortRef.current.signal
    );
  }, [loading, messages, toast]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setLoading(false);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex min-h-screen flex-col bg-background pt-16">
      {/* ── Header ── */}
      <div className="border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[hsl(355,90%,60%)] shadow-sm shadow-primary/20">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">Yatri AI Planner</h1>
              <p className="text-[11px] text-muted-foreground">Powered by Gemini · Real-time streaming</p>
            </div>
          </div>
          {!isEmpty && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={reset}
              className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw size={12} />
              New trip
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto pb-40">
        <div className="container mx-auto max-w-3xl px-4">
          {/* Empty state */}
          <AnimatePresence>
            {isEmpty && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[hsl(355,90%,60%)] shadow-lg shadow-primary/25">
                  <MapPin size={28} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Plan your dream trip</h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">
                  Describe where you want to go, your budget, and travel style — Yatri AI will craft a complete day-by-day itinerary instantly.
                </p>

                {/* Suggestion chips */}
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => send(s)}
                      className="rounded-2xl border border-border bg-white px-4 py-2 text-xs font-medium text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-accent hover:shadow-md"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message list */}
          <div className="space-y-6 py-6">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                {msg.role === "user" ? (
                  /* User bubble */
                  <div className="flex justify-end">
                    <div className="max-w-[82%] rounded-3xl rounded-tr-md bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  /* Assistant bubble */
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(355,90%,60%)]">
                      <Sparkles size={13} className="text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="rounded-3xl rounded-tl-md border border-border bg-white px-5 py-4 shadow-sm">
                        {msg.content ? (
                          <div className="prose prose-sm max-w-none
                            prose-headings:font-bold prose-headings:text-foreground
                            prose-h2:text-base prose-h2:mt-5 prose-h2:mb-2 prose-h2:border-b prose-h2:border-border prose-h2:pb-1.5
                            prose-h3:text-sm prose-h3:mt-3 prose-h3:mb-1
                            prose-p:text-foreground prose-p:leading-relaxed prose-p:my-1.5
                            prose-li:text-foreground prose-li:my-0.5
                            prose-strong:text-foreground prose-strong:font-semibold
                            prose-table:text-xs prose-th:py-1.5 prose-td:py-1.5
                            prose-code:text-primary prose-code:bg-accent prose-code:px-1 prose-code:rounded prose-code:text-xs
                          ">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          /* Skeleton loader while first token arrives */
                          <div className="space-y-2.5 py-1">
                            {[100, 80, 60].map((w) => (
                              <div key={w} className="h-3 rounded-full bg-muted" style={{ width: `${w}%`, animation: "shimmer 1.5s infinite linear", background: "linear-gradient(90deg, hsl(350,30%,95%) 25%, hsl(350,40%,92%) 50%, hsl(350,30%,95%) 75%)", backgroundSize: "200% 100%" }} />
                            ))}
                          </div>
                        )}
                        {msg.streaming && <Cursor />}
                      </div>

                      {/* Actions row — only on complete messages */}
                      {!msg.streaming && msg.content && (
                        <div className="mt-1.5 flex items-center gap-1 px-1">
                          <CopyButton text={msg.content} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input bar (fixed) ── */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 border-t border-border bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:pb-0">
        <div className="container mx-auto max-w-3xl px-4 py-3">
          <div className={`flex items-end gap-3 rounded-2xl border-2 bg-white px-4 py-3 transition-all duration-200 ${
            loading ? "border-primary/30 shadow-[0_0_0_3px_hsla(347,77%,50%,0.07)]" : "border-border focus-within:border-primary/40 focus-within:shadow-[0_0_0_3px_hsla(347,77%,50%,0.07)]"
          }`}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
              onKeyDown={handleKey}
              placeholder="Describe your dream trip… e.g. '5 days in Kerala, nature lover, ₹25k budget'"
              disabled={loading}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
              style={{ minHeight: "24px", maxHeight: "120px" }}
            />
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:shadow-[0_4px_12px_hsla(347,77%,50%,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Send size={15} />
              )}
            </motion.button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
            Yatri AI · Powered by Gemini · Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
};

export default Plan;

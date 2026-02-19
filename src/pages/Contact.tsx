import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Best places to visit in Japan 🇯🇵",
  "Budget Europe trip tips 🏰",
  "Visa-free countries for Indians ✈️",
  "7-day Bali itinerary 🌴",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/travel-chat`;

async function streamChat(
  messages: Message[],
  onDelta: (text: string) => void,
  onDone: () => void,
  signal: AbortSignal
) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!resp.ok || !resp.body) {
    const data = await resp.json().catch(() => ({}));
    throw new Error(data.error || "Failed to connect to AI");
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let done = false;

  while (!done) {
    const { done: streamDone, value } = await reader.read();
    if (streamDone) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIdx: number;
    while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIdx);
      buffer = buffer.slice(newlineIdx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ") || line.trim() === "") continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { done = true; break; }
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }

  onDone();
}

export default function Contact() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    let assistantText = "";

    try {
      await streamChat(
        next,
        (chunk) => {
          assistantText += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: assistantText } : m
              );
            }
            return [...prev, { role: "assistant", content: assistantText }];
          });
        },
        () => setLoading(false),
        controller.signal
      );
    } catch (e: unknown) {
      if ((e as Error)?.name === "AbortError") return;
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast.error(msg);
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto max-w-2xl px-4 py-4 pt-20 md:pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <Bot size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground leading-tight">Yatri AI</h1>
              <p className="text-[11px] text-muted-foreground">Your travel planning assistant</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[hsl(142,76%,36%)] animate-pulse" />
              <span className="text-[11px] text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pt-36 md:pt-28 pb-36 md:pb-24">
        <div className="container mx-auto max-w-2xl px-4">
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center pt-8"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Sparkles size={28} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Plan your next adventure</h2>
              <p className="mt-1.5 text-sm text-muted-foreground max-w-xs">
                Ask me anything about travel — destinations, visas, itineraries, budgets and more.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2 w-full max-w-sm">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border border-border bg-card px-3 py-3 text-left text-xs font-medium text-foreground hover:border-primary/40 hover:bg-accent/50 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4 py-2">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
                        <Bot size={13} className="text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-card border border-border text-foreground rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                      {msg.role === "assistant" && loading && i === messages.length - 1 && (
                        <span className="ml-1 inline-block h-4 w-0.5 bg-primary animate-pulse rounded-full" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && messages[messages.length - 1]?.role === "user" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Bot size={13} className="text-primary-foreground" />
                  </div>
                  <div className="rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto max-w-2xl px-4 py-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about any destination..."
              disabled={loading}
              className="flex-1 rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all disabled:opacity-60"
            />
            <motion.button
              whileTap={{ scale: 0.93 }}
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
            >
              <Send size={16} />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}

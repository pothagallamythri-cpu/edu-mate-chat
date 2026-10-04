import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Plus, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { z } from "zod";
import { askClassroomAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/chat")({
  validateSearch: (s) => z.object({ ask: z.string().optional() }).parse(s),
  head: () => ({ meta: [{ title: "Classroom AI — Classroom Resource Hub" }, { name: "description", content: "Ask the Classroom AI about your lessons." }, { property: "og:title", content: "Classroom AI" }, { property: "og:description", content: "Ask the Classroom AI about your lessons." }] }),
  component: Chat,
});

type Msg = { role: "user" | "assistant"; content: string };
const SUGGEST = ["Explain a topic: photosynthesis", "Create a quiz on DBMS", "Important questions on Algebra", "Explain photosynthesis in Telugu"];

function Chat() {
  const { ask } = Route.useSearch();
  const askFn = useServerFn(askClassroomAI);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState(ask ?? "");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, busy]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    const next = [...msgs, { role: "user" as const, content: text.trim() }];
    setMsgs(next); setInput(""); setBusy(true);
    try {
      const r = await askFn({ data: { messages: next } });
      setMsgs([...next, { role: "assistant", content: r.reply ?? `⚠️ ${r.error}` }]);
    } catch { setMsgs([...next, { role: "assistant", content: "⚠️ Something went wrong. Try again." }]); }
    setBusy(false);
  }

  return (
    <div className="flex h-screen flex-col bg-chat-bg">
      <header className="flex h-14 items-center gap-2 bg-gradient-primary px-3 text-primary-foreground">
        <Link to="/home" aria-label="Back" className="p-2"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="flex-1 font-bold">🤖 Classroom AI</h1>
        <button aria-label="New chat" onClick={() => setMsgs([])} className="p-2"><Plus className="h-5 w-5" /></button>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        <Bubble m={{ role: "assistant", content: "Hi 👋 I'm your Classroom AI. Ask me anything about your lessons!" }} />
        {msgs.length === 0 && <div className="flex flex-wrap gap-2">{SUGGEST.map((s) => <button key={s} onClick={() => send(s)} className="rounded-full border border-primary bg-card px-3 py-1.5 text-xs font-bold text-primary">{s}</button>)}</div>}
        {msgs.map((m, i) => <Bubble key={i} m={m} />)}
        {busy && <div className="flex w-16 gap-1 rounded-2xl bg-bubble-ai p-3">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-muted-foreground typing-dot" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); void send(input); }} className="flex gap-2 p-3">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question..." className="h-12 flex-1 rounded-full bg-card px-4 text-sm outline-none shadow-card" />
        <button aria-label="Send" disabled={busy} className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"><Send className="h-5 w-5" /></button>
      </form>
    </div>
  );
}

function Bubble({ m }: { m: Msg }) {
  const me = m.role === "user";
  return <div className={`flex ${me ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-card ${me ? "bg-bubble-user text-bubble-user-foreground" : "bg-bubble-ai"} [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5`}><ReactMarkdown>{m.content}</ReactMarkdown></div></div>;
}

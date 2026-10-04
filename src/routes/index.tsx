import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Classroom Resource Hub — Notes, resources & AI help" },
      { name: "description", content: "Browse class notes, assignments and question papers, and ask the Classroom AI anything." },
      { property: "og:title", content: "Classroom Resource Hub" },
      { property: "og:description", content: "Browse class notes, assignments and question papers, and ask the Classroom AI anything." },
    ],
  }),
  component: Splash,
});

function Splash() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => navigate({ to: session ? "/home" : "/auth", replace: true }), 600);
    return () => clearTimeout(t);
  }, [loading, session, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-primary text-primary-foreground">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-foreground/15 text-4xl animate-rise">📚</div>
      <h1 className="mt-5 text-2xl font-extrabold animate-rise">Classroom Hub</h1>
      <p className="mt-1 text-sm opacity-80">Learn. Share. Grow.</p>
      <div className="mt-8 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-primary-foreground typing-dot" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

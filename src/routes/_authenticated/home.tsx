import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronRight, LayoutDashboard, Search } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ResourceCard } from "@/components/app/ResourceCard";
import { useAuth } from "@/lib/auth";
import { CLASSES, SUBJECTS, greeting } from "@/lib/constants";
import { useResources } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({
    meta: [
      { title: "Home — Classroom Resource Hub" },
      { name: "description", content: "Your classroom home: subjects, recent and popular resources." },
      { property: "og:title", content: "Home — Classroom Resource Hub" },
      { property: "og:description", content: "Your classroom home: subjects, recent and popular resources." },
    ],
  }),
  component: Home,
});

function Home() {
  const { profile, role } = useAuth();
  const { data, isLoading } = useResources();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const recent = data?.slice(0, 6) ?? [];
  const popular = [...(data ?? [])].sort((a, b) => b.downloads - a.downloads).slice(0, 4);
  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <div>
      <section className="rounded-b-[2rem] bg-gradient-primary px-5 pb-7 pt-6 text-primary-foreground">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold opacity-90">{greeting()}{firstName ? `, ${firstName}` : ""} 👋</p>
            <h1 className="mt-1 text-2xl font-extrabold">Welcome to Classroom Hub</h1>
          </div>
          <Link to="/notifications" aria-label="Notifications" className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-foreground/15 active:scale-95">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-primary" />
          </Link>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/resources", search: { q: q || undefined } });
          }}
          className="mt-5 flex items-center gap-2 rounded-2xl bg-card px-4 text-foreground shadow-card"
        >
          <Search className="h-5 w-5 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notes, subjects, resources..." className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </form>
      </section>

      <div className="space-y-7 px-5 pt-5">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
          {CLASSES.map((c) => (
            <Link key={c} to="/resources" search={{ class: c }} className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-secondary-foreground shadow-card active:scale-95">
              {c}
            </Link>
          ))}
        </div>

        {role === "teacher" && (
          <Link to="/teacher" className="flex items-center gap-3 rounded-2xl bg-accent p-4 text-accent-foreground shadow-card active:scale-[0.99]">
            <LayoutDashboard className="h-6 w-6" />
            <div className="flex-1">
              <p className="font-display font-bold">Teacher Dashboard</p>
              <p className="text-xs opacity-80">Manage your uploads and see downloads</p>
            </div>
            <ChevronRight className="h-5 w-5" />
          </Link>
        )}

        <section>
          <h2 className="mb-3 text-lg font-bold">Subjects</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SUBJECTS.map((s, i) => (
              <Link key={s.name} to="/resources" search={{ subject: s.name }} className={`rounded-2xl p-4 shadow-card transition-transform active:scale-[0.97] ${s.tone} ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}>
                <span className="text-3xl">{s.emoji}</span>
                <p className="mt-2 font-display font-bold">{s.name}</p>
                <p className="text-xs opacity-75">{data?.filter((r) => r.subject === s.name).length ?? 0} resources</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHead title="Recently Added" />
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
            {isLoading
              ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-36 w-60 shrink-0 rounded-2xl" />)
              : recent.map((r) => <ResourceCard key={r.id} r={r} compact />)}
          </div>
        </section>

        <section className="pb-4">
          <SectionHead title="Popular Resources" />
          <div className="space-y-3">
            {isLoading
              ? [0, 1].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
              : popular.map((r) => <ResourceCard key={r.id} r={r} />)}
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-bold">{title}</h2>
      <Link to="/resources" className="text-sm font-bold text-primary">See all</Link>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/app/AppShell";
import { ResourceCard } from "@/components/app/ResourceCard";
import { useAuth } from "@/lib/auth";
import { useResources } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/teacher")({
  head: () => ({ meta: [{ title: "Teacher Dashboard — Classroom Resource Hub" }, { name: "description", content: "Manage your uploaded resources." }, { property: "og:title", content: "Teacher Dashboard" }, { property: "og:description", content: "Manage your uploaded resources." }] }),
  component: Teacher,
});

function Teacher() {
  const { user } = useAuth();
  const mine = (useResources().data ?? []).filter((r) => r.teacher_id === user?.id);
  const week = mine.filter((r) => Date.now() - new Date(r.created_at).getTime() < 7 * 864e5).length;
  return (
    <div>
      <TopBar title="Teacher Dashboard" />
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          {[["Total", mine.length], ["This week", week], ["Downloads", mine.reduce((a, r) => a + r.downloads, 0)]].map(([l, v]) => (
            <div key={l} className="rounded-2xl bg-card p-3 shadow-card"><p className="text-2xl font-extrabold text-primary">{v}</p><p className="text-xs text-muted-foreground">{l}</p></div>
          ))}
        </div>
        <Link to="/upload" className="flex h-14 items-center justify-center rounded-2xl bg-gradient-primary font-bold text-primary-foreground shadow-float">➕ Upload Resource</Link>
        {mine.map((r) => <ResourceCard key={r.id} r={r} />)}
        {mine.length === 0 && <p className="text-center text-sm text-muted-foreground">No uploads yet.</p>}
      </div>
    </div>
  );
}

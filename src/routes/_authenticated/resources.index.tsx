import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { z } from "zod";
import { EmptyState } from "@/components/app/AppShell";
import { ResourceCard, ResourceSkeleton } from "@/components/app/ResourceCard";
import { CLASSES, RESOURCE_TYPES, SUBJECTS } from "@/lib/constants";
import { useResources } from "@/lib/resources";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  q: z.string().optional(),
  class: z.string().optional(),
  subject: z.string().optional(),
  type: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/resources/")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Resources — Classroom Resource Hub" },
      { name: "description", content: "Browse notes, presentations, assignments and question papers by class and subject." },
      { property: "og:title", content: "Resources — Classroom Resource Hub" },
      { property: "og:description", content: "Browse classroom resources by class and subject." },
    ],
  }),
  component: Resources,
});

function Resources() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/resources/" });
  const { data, isLoading } = useResources();
  const set = (patch: Partial<z.infer<typeof searchSchema>>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  const q = (search.q ?? "").toLowerCase();
  const list = (data ?? []).filter(
    (r) =>
      (!search.class || r.class_level === search.class) &&
      (!search.subject || r.subject === search.subject) &&
      (!search.type || r.resource_type === search.type) &&
      (!q || `${r.title} ${r.subject} ${r.description} ${r.teacher_name}`.toLowerCase().includes(q)),
  );
  const anyFilter = search.class || search.subject || search.type || search.q;

  return (
    <div>
      <header className="sticky top-0 z-30 space-y-3 border-b border-border bg-background/95 px-4 pb-3 pt-4 backdrop-blur">
        <h1 className="text-xl font-extrabold">📚 Resources</h1>
        <div className="flex items-center gap-2 rounded-2xl bg-muted px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search.q ?? ""}
            onChange={(e) => set({ q: e.target.value || undefined })}
            placeholder="Search notes, subjects, resources..."
            className="h-11 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <ChipRow options={CLASSES} value={search.class} onChange={(v) => set({ class: v })} />
        <ChipRow options={SUBJECTS.map((s) => s.name)} value={search.subject} onChange={(v) => set({ subject: v })} />
        <ChipRow options={RESOURCE_TYPES} value={search.type} onChange={(v) => set({ type: v })} />
      </header>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{isLoading ? "Loading…" : `${list.length} resources`}</span>
          {anyFilter && (
            <button onClick={() => navigate({ search: {}, replace: true })} className="flex items-center gap-1 font-bold text-primary">
              <X className="h-4 w-4" /> Clear
            </button>
          )}
        </div>
        {isLoading && [0, 1, 2].map((i) => <ResourceSkeleton key={i} />)}
        {!isLoading && list.length === 0 && (
          <EmptyState emoji="🔍" title="No resources found" text="Try a different class, subject or search word." />
        )}
        {list.map((r) => <ResourceCard key={r.id} r={r} />)}
      </div>
    </div>
  );
}

function ChipRow({ options, value, onChange }: { options: readonly string[]; value?: string; onChange: (v?: string) => void }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(value === o ? undefined : o)}
          className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors",
            value === o ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

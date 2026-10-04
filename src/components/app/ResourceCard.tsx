import { Link } from "@tanstack/react-router";
import { Bookmark, Download, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TYPE_EMOJI, formatDate, subjectMeta } from "@/lib/constants";
import { downloadResource, useBookmarks, useToggleBookmark, type Resource } from "@/lib/resources";
import { cn } from "@/lib/utils";

export function ResourceCard({ r, compact }: { r: Resource; compact?: boolean }) {
  const { data: saved } = useBookmarks();
  const toggle = useToggleBookmark();
  const isSaved = saved?.has(r.id) ?? false;
  const meta = subjectMeta(r.subject);

  if (compact) {
    return (
      <Link
        to="/resources/$id"
        params={{ id: r.id }}
        className="block w-60 shrink-0 rounded-2xl bg-card p-4 shadow-card transition-transform active:scale-[0.98]"
      >
        <div className={cn("mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-xl", meta.tone)}>
          {TYPE_EMOJI[r.resource_type] ?? "📄"}
        </div>
        <p className="line-clamp-2 font-display text-sm font-bold leading-snug">{r.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {r.class_level} • {r.subject}
        </p>
      </Link>
    );
  }

  return (
    <article className="rounded-2xl bg-card p-4 shadow-card animate-rise">
      <div className="flex gap-3">
        <Link
          to="/resources/$id"
          params={{ id: r.id }}
          className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl", meta.tone)}
        >
          {TYPE_EMOJI[r.resource_type] ?? "📄"}
        </Link>
        <div className="min-w-0 flex-1">
          <Link to="/resources/$id" params={{ id: r.id }}>
            <h3 className="font-display font-bold leading-snug">{r.title}</h3>
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {r.class_level} • {r.subject}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold text-secondary-foreground">
              {r.resource_type}
            </span>
            <span className="text-muted-foreground">
              {r.teacher_name} · {formatDate(r.created_at)}
            </span>
          </div>
        </div>
        <button
          aria-label={isSaved ? "Remove bookmark" : "Bookmark"}
          onClick={() => toggle.mutate({ id: r.id, saved: isSaved })}
          disabled={toggle.isPending}
          className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors active:bg-muted"
        >
          <Bookmark className={cn("h-5 w-5", isSaved ? "fill-primary text-primary" : "text-muted-foreground")} />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link
          to="/resources/$id"
          params={{ id: r.id }}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-secondary py-2 text-sm font-semibold text-secondary-foreground active:scale-[0.98]"
        >
          <Eye className="h-4 w-4" /> View
        </Link>
        <button
          onClick={() => downloadResource(r)}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground active:scale-[0.98]"
        >
          <Download className="h-4 w-4" /> Download
        </button>
      </div>
    </article>
  );
}

export function ResourceSkeleton() {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-card">
      <div className="flex gap-3">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Skeleton className="h-9 rounded-xl" />
        <Skeleton className="h-9 rounded-xl" />
      </div>
    </div>
  );
}

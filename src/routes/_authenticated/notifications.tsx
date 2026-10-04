import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, TopBar } from "@/components/app/AppShell";
import { subjectMeta, timeAgo } from "@/lib/constants";
import { useResources } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Classroom Resource Hub" },
      { name: "description", content: "Latest uploads from your teachers." },
      { property: "og:title", content: "Notifications — Classroom Resource Hub" },
      { property: "og:description", content: "Latest uploads from your teachers." },
    ],
  }),
  component: Notifications,
});

function message(type: string, subject: string) {
  if (type === "Assignment") return `New ${subject} assignment available.`;
  if (type === "Question Paper") return `New ${subject} question paper uploaded.`;
  if (type === "PDF Notes" || type === "Study Material") return `New ${subject} notes uploaded.`;
  return "Your teacher uploaded a new resource.";
}

function Notifications() {
  const router = useRouter();
  const { data, isLoading } = useResources();
  return (
    <div>
      <TopBar
        title="🔔 Notifications"
        left={<button aria-label="Back" onClick={() => router.history.back()} className="-ml-2 p-2"><ArrowLeft className="h-5 w-5" /></button>}
      />
      <div className="space-y-2 p-4">
        {isLoading && [0, 1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        {data?.length === 0 && <EmptyState emoji="🔕" title="No notifications yet" />}
        {data?.slice(0, 15).map((r) => (
          <Link key={r.id} to="/resources/$id" params={{ id: r.id }} className="flex gap-3 rounded-2xl bg-card p-4 shadow-card animate-rise active:scale-[0.99]">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${subjectMeta(r.subject).tone}`}>{subjectMeta(r.subject).emoji}</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{message(r.resource_type, r.subject)}</p>
              <p className="truncate text-xs text-muted-foreground">{r.title} · {r.teacher_name}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{timeAgo(r.created_at)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

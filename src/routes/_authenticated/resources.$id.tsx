import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Bookmark, Download, Eye, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, TopBar } from "@/components/app/AppShell";
import { useAuth } from "@/lib/auth";
import { TYPE_EMOJI, formatDate, subjectMeta } from "@/lib/constants";
import { downloadResource, getFileUrl, useBookmarks, useResource, useToggleBookmark } from "@/lib/resources";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/resources/$id")({
  head: () => ({
    meta: [
      { title: "Resource — Classroom Resource Hub" },
      { name: "description", content: "View and download this classroom resource." },
      { property: "og:title", content: "Resource — Classroom Resource Hub" },
      { property: "og:description", content: "View and download this classroom resource." },
    ],
  }),
  component: Viewer,
});

function Viewer() {
  const { id } = Route.useParams();
  const router = useRouter();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();
  const { data: r, isLoading } = useResource(id);
  const { data: saved } = useBookmarks();
  const toggle = useToggleBookmark();
  const [url, setUrl] = useState<string | null>(null);
  const isSaved = saved?.has(id) ?? false;

  useEffect(() => {
    supabase.rpc("record_view", { _resource_id: id });
  }, [id]);
  useEffect(() => {
    if (r?.file_path) void getFileUrl(r.file_path).then(setUrl).catch(() => setUrl(null));
    return undefined;
  }, [r?.file_path]);

  async function remove() {
    if (!r) return;
    if (r.file_path) await supabase.storage.from("resources").remove([r.file_path]);
    const { error } = await supabase.from("resources").delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["resources"] });
    toast.success("Resource deleted");
    navigate({ to: "/teacher" });
  }

  const back = <button aria-label="Back" onClick={() => router.history.back()} className="-ml-2 p-2"><ArrowLeft className="h-5 w-5" /></button>;

  if (isLoading) return <div><TopBar title="Loading…" left={back} /><div className="space-y-3 p-4"><Skeleton className="h-56 rounded-3xl" /><Skeleton className="h-6 w-2/3" /><Skeleton className="h-20" /></div></div>;
  if (!r) return <div><TopBar title="Not found" left={back} /><EmptyState emoji="🤷" title="Resource not found" action={<Link to="/resources" className="font-bold text-primary">Browse resources</Link>} /></div>;

  const meta = subjectMeta(r.subject);
  const isOwner = user?.id === r.teacher_id;
  const isImage = r.mime_type?.startsWith("image/");
  const isPdf = r.mime_type === "application/pdf";

  return (
    <div>
      <TopBar
        title={r.title}
        left={back}
        right={
          <button aria-label="Bookmark" onClick={() => toggle.mutate({ id: r.id, saved: isSaved })} className="p-2">
            <Bookmark className={cn("h-5 w-5", isSaved ? "fill-primary text-primary" : "text-muted-foreground")} />
          </button>
        }
      />
      <div className="space-y-4 p-4 animate-rise">
        <div className="overflow-hidden rounded-3xl bg-card shadow-card">
          {url && isImage ? (
            <img src={url} alt={r.title} className="max-h-[60vh] w-full object-contain bg-muted" />
          ) : url && isPdf ? (
            <iframe src={url} title={r.title} className="h-[60vh] w-full" />
          ) : (
            <div className={cn("flex flex-col items-center justify-center gap-2 px-6 py-12 text-center", meta.tone)}>
              <span className="text-6xl">{TYPE_EMOJI[r.resource_type] ?? "📄"}</span>
              <p className="font-display font-bold">{r.file_name ?? r.resource_type}</p>
              <p className="text-xs opacity-75">{r.file_path ? "Download to open this file" : "Preview notes below"}</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-extrabold">{r.title}</h2>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-bold">
            <span className={cn("rounded-full px-2.5 py-1", meta.tone)}>{meta.emoji} {r.subject}</span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">{r.class_level}</span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">{r.resource_type}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Teacher" value={r.teacher_name} />
          <Stat label="Uploaded" value={formatDate(r.created_at)} />
          <Stat label="Downloads" value={String(r.downloads)} />
        </div>

        {r.description && (
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">About</p>
            <p className="whitespace-pre-line text-sm leading-relaxed">{r.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {url && (
            <a href={url} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-secondary font-bold text-secondary-foreground">
              <Eye className="h-4 w-4" /> Open
            </a>
          )}
          <button onClick={() => downloadResource(r)} className={cn("flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-primary font-bold text-primary-foreground shadow-float", !url && "col-span-2")}>
            <Download className="h-4 w-4" /> Download
          </button>
        </div>

        <Link to="/chat" search={{ ask: `Explain "${r.title}" (${r.class_level} ${r.subject}) in simple words.` }} className="flex items-center gap-3 rounded-2xl bg-primary-soft p-4 font-bold text-secondary-foreground">
          🤖 Ask Classroom AI about this topic
        </Link>

        {isOwner && (
          <div className="grid grid-cols-2 gap-2">
            <Link to="/upload" search={{ edit: r.id }} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border font-bold">
              <Pencil className="h-4 w-4" /> Edit
            </Link>
            <DeleteButton onConfirm={remove} />
          </div>
        )}
      </div>
    </div>
  );
}

export function DeleteButton({ onConfirm, compact }: { onConfirm: () => void; compact?: boolean }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button aria-label="Delete" className={cn("flex items-center justify-center gap-2 rounded-xl font-bold text-destructive", compact ? "h-9 w-9 bg-muted" : "h-11 border border-destructive/30")}>
          <Trash2 className="h-4 w-4" /> {!compact && "Delete"}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this resource?</AlertDialogTitle>
          <AlertDialogDescription>Students will no longer see it. This can't be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-card">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="truncate text-sm font-bold">{value}</p>
    </div>
  );
}

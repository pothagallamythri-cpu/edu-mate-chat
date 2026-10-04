import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { TopBar } from "@/components/app/AppShell";
import { useAuth } from "@/lib/auth";
import { ACCEPTED_FILES, CLASSES, RESOURCE_TYPES, SUBJECTS } from "@/lib/constants";

export const Route = createFileRoute("/_authenticated/upload")({
  validateSearch: (s) => z.object({ edit: z.string().optional() }).parse(s),
  head: () => ({ meta: [{ title: "Upload Resource — Classroom Resource Hub" }, { name: "description", content: "Publish a new classroom resource." }, { property: "og:title", content: "Upload Resource" }, { property: "og:description", content: "Publish a new classroom resource." }] }),
  component: Upload,
});

const sel = "h-11 w-full rounded-xl border border-input bg-card px-3 text-sm";

function Upload() {
  const { edit } = Route.useSearch();
  const { user, profile, role } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [f, setF] = useState({ title: "", description: "", class_level: "Class 7", subject: "Science", resource_type: "PDF Notes" });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (edit) void supabase.from("resources").select("*").eq("id", edit).maybeSingle().then(({ data }) => data && setF({ title: data.title, description: data.description, class_level: data.class_level, subject: data.subject, resource_type: data.resource_type }));
  }, [edit]);

  if (role && role !== "teacher") return <div><TopBar title="Upload" /><p className="p-6 text-center text-muted-foreground">Only teachers can upload resources.</p></div>;

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !f.title.trim()) return toast.error("Please add a title");
    setBusy(true);
    try {
      let fileFields = {};
      if (file) {
        const path = `${user.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
        const { error } = await supabase.storage.from("resources").upload(path, file);
        if (error) throw error;
        fileFields = { file_path: path, file_name: file.name, mime_type: file.type };
      }
      const row = { ...f, ...fileFields };
      const { error } = edit
        ? await supabase.from("resources").update(row).eq("id", edit)
        : await supabase.from("resources").insert({ ...row, teacher_id: user.id, teacher_name: profile?.full_name || "Teacher" });
      if (error) throw error;
      await qc.invalidateQueries();
      toast.success(edit ? "Resource updated" : "Resource published 🎉");
      navigate({ to: "/teacher" });
    } catch (err) { toast.error(err instanceof Error ? err.message : "Upload failed"); }
    setBusy(false);
  }

  return (
    <div>
      <TopBar title={edit ? "Edit Resource" : "Upload Resource"} />
      <form onSubmit={publish} className="space-y-3 p-4">
        <input className={sel} placeholder="Resource title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <textarea className="min-h-24 w-full rounded-xl border border-input bg-card p-3 text-sm" placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        <select className={sel} value={f.class_level} onChange={(e) => setF({ ...f, class_level: e.target.value })}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select>
        <select className={sel} value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })}>{SUBJECTS.map((s) => <option key={s.name}>{s.name}</option>)}</select>
        <select className={sel} value={f.resource_type} onChange={(e) => setF({ ...f, resource_type: e.target.value })}>{RESOURCE_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        <label className="block rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft p-5 text-center text-sm font-bold text-secondary-foreground">
          {file ? file.name : "Tap to choose a file (PDF, PPT, DOC, image)"}
          <input type="file" accept={ACCEPTED_FILES} className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <button disabled={busy} className="h-12 w-full rounded-xl bg-gradient-primary font-bold text-primary-foreground shadow-float disabled:opacity-60">{busy ? "Publishing…" : edit ? "Save changes" : "Publish Resource"}</button>
      </form>
    </div>
  );
}

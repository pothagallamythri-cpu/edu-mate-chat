import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "./auth";

export type Resource = Tables<"resources">;

export function useResources() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: ["resource", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("resources").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useBookmarks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["bookmarks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("bookmarks").select("resource_id");
      if (error) throw error;
      return new Set(data.map((b) => b.resource_id));
    },
  });
}

export function useDownloadedIds() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["downloads", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("downloads")
        .select("resource_id")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((d) => d.resource_id);
    },
  });
}

export function useToggleBookmark() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ id, saved }: { id: string; saved: boolean }) => {
      if (!user) throw new Error("Please sign in");
      if (saved) {
        const { error } = await supabase.from("bookmarks").delete().eq("resource_id", id).eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("bookmarks").insert({ resource_id: id, user_id: user.id });
        if (error) throw error;
      }
      return !saved;
    },
    onSuccess: (nowSaved) => {
      qc.invalidateQueries({ queryKey: ["bookmarks"] });
      toast.success(nowSaved ? "Saved to your resources" : "Removed from saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export async function getFileUrl(path: string, download?: string) {
  const { data, error } = await supabase.storage
    .from("resources")
    .createSignedUrl(path, 60 * 10, download ? { download } : undefined);
  if (error) throw error;
  return data.signedUrl;
}

export async function downloadResource(r: Resource) {
  try {
    if (r.file_path) {
      const url = await getFileUrl(r.file_path, r.file_name ?? r.title);
      const a = document.createElement("a");
      a.href = url;
      a.click();
    } else {
      const text = `${r.title}\n${r.class_level} • ${r.subject} • ${r.resource_type}\nBy ${r.teacher_name}\n\n${r.description}\n`;
      const blob = new Blob([text], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${r.title}.txt`;
      a.click();
      URL.revokeObjectURL(a.href);
    }
    await supabase.rpc("record_download", { _resource_id: r.id });
    toast.success("Download started");
  } catch (e) {
    toast.error(e instanceof Error ? e.message : "Download failed");
  }
}

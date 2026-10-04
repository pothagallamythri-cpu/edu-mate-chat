import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TopBar } from "@/components/app/AppShell";
import { ResourceCard } from "@/components/app/ResourceCard";
import { useAuth } from "@/lib/auth";
import { useBookmarks, useResources } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — Classroom Resource Hub" }, { name: "description", content: "Your profile and saved resources." }, { property: "og:title", content: "Profile" }, { property: "og:description", content: "Your profile and saved resources." }] }),
  component: Profile,
});

function Profile() {
  const { profile, role } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const saved = useBookmarks().data;
  const list = (useResources().data ?? []).filter((r) => saved?.has(r.id));
  async function logout() { await qc.cancelQueries(); qc.clear(); await supabase.auth.signOut(); navigate({ to: "/auth", replace: true }); }
  return (
    <div>
      <TopBar title="Profile" />
      <div className="space-y-4 p-4">
        <div className="flex flex-col items-center rounded-3xl bg-card p-6 shadow-card">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary text-3xl font-extrabold text-primary-foreground">{profile?.full_name?.[0]?.toUpperCase() ?? "?"}</div>
          <p className="mt-3 text-lg font-bold">{profile?.full_name}</p>
          <p className="text-sm text-muted-foreground">{role === "teacher" ? "Teacher" : profile?.class_level} {profile?.school ? `• ${profile.school}` : ""}</p>
        </div>
        <h2 className="font-bold">Saved Resources</h2>
        {list.map((r) => <ResourceCard key={r.id} r={r} />)}
        {list.length === 0 && <p className="text-sm text-muted-foreground">Tap the bookmark icon on any resource to save it.</p>}
        <button onClick={logout} className="h-12 w-full rounded-xl border border-destructive/30 font-bold text-destructive">Logout</button>
      </div>
    </div>
  );
}

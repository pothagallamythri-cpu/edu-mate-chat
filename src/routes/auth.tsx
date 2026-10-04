import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GraduationCap, Loader2, Presentation } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth, type Role } from "@/lib/auth";
import { CLASSES } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Classroom Resource Hub" },
      { name: "description", content: "Sign in or create a student or teacher account on Classroom Resource Hub." },
      { property: "og:title", content: "Sign in — Classroom Resource Hub" },
      { property: "og:description", content: "Sign in or create a student or teacher account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<Role>("student");
  const [name, setName] = useState("");
  const [classLevel, setClassLevel] = useState("Class 7");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/home", replace: true });
  }, [session, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back! 👋");
      } else {
        if (!name.trim()) throw new Error("Please enter your name");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name.trim(), role, class_level: role === "student" ? classLevel : null, school },
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Check your email to confirm your account 📧");
          setMode("login");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error("Google sign-in failed");
  }

  return (
    <div className="min-h-screen bg-muted/60">
      <div className="mx-auto min-h-screen max-w-md bg-background">
        <div className="rounded-b-[2rem] bg-gradient-primary px-6 pb-10 pt-14 text-primary-foreground">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/15 text-3xl">📚</div>
          <h1 className="text-2xl font-extrabold">Classroom Hub</h1>
          <p className="mt-1 text-sm opacity-85">Your notes, resources and AI study buddy.</p>
        </div>

        <div className="-mt-6 px-5 pb-10">
          <div className="rounded-3xl bg-card p-5 shadow-card">
            <div className="mb-5 grid grid-cols-2 rounded-xl bg-muted p-1 text-sm font-bold">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn("rounded-lg py-2 transition-all", mode === m ? "bg-card text-primary shadow-card" : "text-muted-foreground")}
                >
                  {m === "login" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === "signup" && (
                <>
                  <div>
                    <Label className="mb-2 block">I am a</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { r: "student", label: "Student", Icon: GraduationCap },
                        { r: "teacher", label: "Teacher", Icon: Presentation },
                      ] as const).map(({ r, label, Icon }) => (
                        <button
                          type="button"
                          key={r}
                          onClick={() => setRole(r)}
                          className={cn(
                            "flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-sm font-bold transition-all",
                            role === r ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground",
                          )}
                        >
                          <Icon className="h-6 w-6" /> {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Field label="Full name">
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Anjali Reddy" className="h-11 rounded-xl" />
                  </Field>
                  {role === "student" && (
                    <Field label="Class">
                      <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
                        {CLASSES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                  )}
                  <Field label="School / College">
                    <Input value={school} onChange={(e) => setSchool(e.target.value)} placeholder="Your school name" className="h-11 rounded-xl" />
                  </Field>
                </>
              )}
              <Field label="Email">
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-11 rounded-xl" />
              </Field>
              <Field label="Password">
                <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="h-11 rounded-xl" />
              </Field>
              <button disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary font-bold text-primary-foreground shadow-float active:scale-[0.98] disabled:opacity-70">
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "login" ? "Log in" : "Create account"}
              </button>
            </form>

            <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
            </div>
            <button onClick={google} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card font-bold active:scale-[0.98]">
              <span className="text-lg font-extrabold text-primary">G</span> Continue with Google
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Google accounts join as students.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Home, MessageCircle, Plus, User } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/chat", label: "AI Chat", icon: MessageCircle },
  { to: "/resources", label: "Resources", icon: BookOpen },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { role } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const hideNav = path.startsWith("/chat");

  const navItems =
    role === "teacher"
      ? [items[0], items[1], { to: "/upload", label: "Add", icon: Plus } as const, items[2], items[3]]
      : items;

  return (
    <div className="min-h-screen bg-muted/60">
      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col bg-background md:my-0 md:border-x md:border-border">
        <main className={cn("flex-1", !hideNav && "pb-24")}>{children}</main>
        {!hideNav && (
          <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-2xl border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
            <ul className="flex items-stretch justify-around px-2">
              {navItems.map((it) => {
                const active = path === it.to || (it.to !== "/home" && path.startsWith(it.to));
                const Icon = it.icon;
                if (it.to === "/upload") {
                  return (
                    <li key={it.to} className="flex flex-1 justify-center">
                      <Link
                        to="/upload"
                        aria-label="Add resource"
                        className="-mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-float transition-transform active:scale-95"
                      >
                        <Plus className="h-7 w-7" />
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={it.to} className="flex-1">
                    <Link
                      to={it.to}
                      className={cn(
                        "flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-14 items-center justify-center rounded-full transition-all",
                          active && "bg-primary-soft",
                        )}
                      >
                        <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                      </span>
                      {it.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

export function TopBar({ title, left, right }: { title: ReactNode; left?: ReactNode; right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur">
      {left}
      <h1 className="flex-1 truncate text-lg font-bold">{title}</h1>
      {right}
    </header>
  );
}

export function EmptyState({ emoji, title, text, action }: { emoji: string; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center animate-rise">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-soft text-3xl">{emoji}</div>
      <p className="font-display font-bold">{title}</p>
      {text && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

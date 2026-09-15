import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, BriefcaseBusiness, LayoutDashboard, LogOut, Users } from "lucide-react";

import { auth, signOut } from "@/auth";

export const metadata: Metadata = {
  title: "Dashboard | CRM Dashboard",
  description: "Overview of your CRM workspace and latest activity.",
};

async function signOutAction() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/deals", label: "Deals", icon: BriefcaseBusiness },
];

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="w-full border-b bg-card md:w-72 md:border-b-0 md:border-r">
          <div className="flex h-full flex-col p-5">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                P
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Pipely
                </p>
                <h1 className="text-lg font-semibold">CRM</h1>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto rounded-lg border bg-muted/40 p-3">
              <p className="text-sm font-medium">{session.user.name ?? "CRM User"}</p>
              <p className="text-xs text-muted-foreground">{session.user.email ?? "demo@example.com"}</p>
              <form action={signOutAction} className="mt-3">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

import { Clock3, Building2, ContactRound, BriefcaseBusiness } from "lucide-react";

import type { DashboardActivityItem } from "@/lib/dashboard";

function formatRelativeTime(value: string | Date | null) {
  if (!value) return "just now";

  const timestamp = new Date(value).getTime();
  const diffInMinutes = Math.round((Date.now() - timestamp) / 60000);

  if (diffInMinutes < 1) return "just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.round(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.round(diffInHours / 24);
  return `${diffInDays}d ago`;
}

const iconMap = {
  Contact: ContactRound,
  Company: Building2,
  Deal: BriefcaseBusiness,
};

export function RecentActivity({ items }: { items: DashboardActivityItem[] }) {
  if (!items.length) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Recent activity</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          No recent updates yet. Add a contact, company, or deal to start tracking activity.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Recent activity</h2>
        <Clock3 className="h-4 w-4 text-muted-foreground" />
      </div>

      <ul className="mt-5 space-y-4">
        {items.map((item) => {
          const Icon = iconMap[item.type] ?? ContactRound;

          return (
            <li key={item.id} className="flex items-start gap-3 border-b pb-3 last:border-b-0 last:pb-0">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.type} · {formatRelativeTime(item.updatedAt)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

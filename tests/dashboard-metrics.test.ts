import { describe, expect, it } from "vitest";
import {
  buildRecentActivity,
  getOpenDealCount,
  type DashboardActivityItem,
} from "@/lib/dashboard";

describe("dashboard metric calculations", () => {
  it("counts only open deals by excluding closed stages", () => {
    const deals = [
      { id: "1", stage: "PROSPECT" },
      { id: "2", stage: "NEGOTIATION" },
      { id: "3", stage: "CLOSED_WON" },
      { id: "4", stage: "CLOSED_LOST" },
      { id: "5", stage: "PROPOSAL" },
    ];

    expect(getOpenDealCount(deals)).toBe(3);
  });

  it("sorts recent activity newest first and keeps the latest five items", () => {
    const activity: DashboardActivityItem[] = [
      { id: "older", type: "Contact", title: "Old contact", updatedAt: "2026-09-01T12:00:00.000Z" },
      { id: "newest", type: "Deal", title: "Newest deal", updatedAt: "2026-09-15T08:00:00.000Z" },
      { id: "middle", type: "Company", title: "Middle company", updatedAt: "2026-09-10T09:00:00.000Z" },
      { id: "newer", type: "Contact", title: "Newer contact", updatedAt: "2026-09-14T12:00:00.000Z" },
      { id: "oldest", type: "Deal", title: "Oldest deal", updatedAt: "2026-08-31T12:00:00.000Z" },
      { id: "extra", type: "Company", title: "Extra company", updatedAt: "2026-09-12T12:00:00.000Z" },
    ];

    expect(buildRecentActivity(activity)).toHaveLength(5);
    expect(buildRecentActivity(activity)[0]).toMatchObject({ id: "newest" });
    expect(buildRecentActivity(activity).map((entry) => entry.id)).toEqual([
      "newest",
      "newer",
      "extra",
      "middle",
      "older",
    ]);
  });
});

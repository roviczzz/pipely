export type DashboardActivityItem = {
  id: string;
  type: "Contact" | "Company" | "Deal";
  title: string;
  updatedAt: string | Date | null;
};

const CLOSED_DEAL_STAGES = new Set(["CLOSED_WON", "CLOSED_LOST"]);

export function getOpenDealCount(
  deals: Array<{ stage?: string | null }>,
): number {
  return deals.filter((deal) => !deal.stage || !CLOSED_DEAL_STAGES.has(deal.stage)).length;
}

export function buildRecentActivity<T extends DashboardActivityItem>(
  items: T[],
): T[] {
  return [...items]
    .filter((item) => item.updatedAt)
    .sort((a, b) => {
      const aTime = new Date(a.updatedAt ?? 0).getTime();
      const bTime = new Date(b.updatedAt ?? 0).getTime();
      return bTime - aTime;
    })
    .slice(0, 5);
}

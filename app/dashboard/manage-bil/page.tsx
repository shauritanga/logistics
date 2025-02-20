import { MetricsCard } from "@/components/metrics-card";
import BillOfLadingTable from "@/components/bill-of-landing-table";
import { getAllBilOfLanding } from "@/actions/bil";
import { parseISO, isToday, isThisWeek, isThisMonth } from "date-fns";

export const dynamic = "force-dynamic";

export default async function Page() {
  const bilOfLandings = await getAllBilOfLanding();

  const todayCount = bilOfLandings.filter((bill) =>
    isToday(bill.createdAt)
  ).length;

  const thisWeekCount = bilOfLandings.filter((bill) =>
    isThisWeek(bill.createdAt)
  ).length;

  const thisMonthCount = bilOfLandings.filter((bill) =>
    isThisMonth(bill.createdAt)
  ).length;

  return (
    <div className="flex h-screen bg-white/20 dark:bg-black text-white overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-black dark:text-white">
                Bill of landings
              </h1>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricsCard
              title="Today"
              value={todayCount.toString()}
              change={{
                value: "",
                percentage: "",
                isPositive: false,
              }}
            />
            <MetricsCard
              title="This week"
              value={thisWeekCount.toString()}
              change={{
                value: "",
                percentage: "",
                isPositive: true,
              }}
            />
            <MetricsCard
              title="This Month"
              value={thisMonthCount.toString()}
              change={{
                value: "",
                percentage: "",
                isPositive: true,
              }}
            />
          </div>

          <div className="mt-12">
            <BillOfLadingTable initialData={bilOfLandings!} />
          </div>
        </main>
      </div>
    </div>
  );
}

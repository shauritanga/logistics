import { MetricsCard } from "@/components/metrics-card";
import getAllBilOfLanding from "@/actions/get-all-bil-of-landing";
import BillOfLadingTable from "@/components/bill-of-landing-table";

export const dynamic = "force-dynamic";

export default async function Page() {
  const bilOfLandings = await getAllBilOfLanding();

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
              value="7"
              change={{
                value: "$1,340",
                percentage: "-2.1%",
                isPositive: false,
              }}
            />
            <MetricsCard
              title="This week"
              value="54"
              change={{
                value: "$1,340",
                percentage: "+13.2%",
                isPositive: true,
              }}
            />
            <MetricsCard
              title="This Month"
              value="206"
              change={{
                value: "$1,340",
                percentage: "+1.2%",
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

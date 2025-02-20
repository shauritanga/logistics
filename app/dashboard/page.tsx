import { auth } from "@/auth";
import DashboardStats from "@/components/DashboardStats";
import RecentBillOfLanding from "@/components/RecentBillOfLanding";
import RecentInvoices from "@/components/RecentInvoice";
import { WorkProgress } from "@/components/WorkProgress";

export default async function Dashboard() {
  const session = await auth();
  console.log({ session });

  return (
    <div className="w-full mx-auto py-6 sm:px-6 lg:px-8 text-black dark:text-white">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStats />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WorkProgress />
        <RecentInvoices />
      </div>
      <div className="mt-8">
        <RecentBillOfLanding />
      </div>
    </div>
  );
}

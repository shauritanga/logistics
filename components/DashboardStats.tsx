import {
  getPaidInvoices,
  getTotalBillOfLanding,
  getTotalExpenses,
  getUnpaidInvoice,
} from "@/actions/queries";
import { formatNumber } from "@/lib/formatNumber";
import { Activity, Flame, Clock, TrendingUp } from "lucide-react";

export default async function DashboardStats() {
  const [totalBillOfLanding, unpaidInvoices, paidInvoices, totalExpenses] =
    await Promise.all([
      getTotalBillOfLanding(),
      getUnpaidInvoice(),
      getPaidInvoices(),
      getTotalExpenses(),
    ]);
  const stats = [
    {
      name: "Files Open",
      value: totalBillOfLanding,
      icon: Activity,
      color: "bg-blue-500/10 dark:bg-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      name: "Unpaid invoice(s)",
      value: unpaidInvoices,
      icon: Flame,
      color: "bg-red-500/10 dark:bg-red-500/20",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      name: "Paid invoice(s)",
      value: paidInvoices,
      icon: Clock,
      color: "bg-green-500/10 dark:bg-green-500/20",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      name: "Expenses",
      value: totalExpenses,
      icon: TrendingUp,
      color: "bg-purple-500/10 dark:bg-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];
  return (
    <>
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md"
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-xl p-4 ${stat.color}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {stat.name}
                  </dt>
                  <dd>
                    <div className="text-xl font-semibold text-gray-900 dark:text-white">
                      {formatNumber(stat.value)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

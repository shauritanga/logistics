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
      color: "bg-blue-500",
    },
    {
      name: "Unpaid invoice(s)",
      value: unpaidInvoices,
      icon: Flame,
      color: "bg-red-500",
    },
    {
      name: "Paid invoice(s)",
      value: paidInvoices,
      icon: Clock,
      color: "bg-green-500",
    },
    {
      name: "Expenses",
      value: totalExpenses,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];
  return (
    <>
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
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

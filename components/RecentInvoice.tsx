import { getAllInvoices } from "@/actions/invoice";
import { Calendar } from "lucide-react";
import { Invoice } from "@/types";

const workouts = [
  { id: 1, name: "Full Body Workout", date: "2023-06-01", duration: "45 min" },
  {
    id: 2,
    name: "Upper Body Strength",
    date: "2023-05-30",
    duration: "60 min",
  },
  { id: 3, name: "HIIT Cardio", date: "2023-05-28", duration: "30 min" },
  { id: 4, name: "Leg Day", date: "2023-05-26", duration: "50 min" },
];

export default async function RecentInvoices() {
  const invoices = await getAllInvoices();
  console.log({ invoices });
  return (
    <div className="bg-white text-black dark:text-white dark:bg-black p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
      <div className="flow-root">
        <ul className="-my-5 divide-y divide-gray-200">
          {invoices.map((invoice: Invoice) => (
            <li key={invoice._id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {invoice.client.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(invoice.dueDate))}
                  </p>
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {invoice.totalAmount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

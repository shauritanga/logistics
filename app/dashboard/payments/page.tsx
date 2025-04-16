import { readTransactionsByCategory } from "@/actions/transactions";
import { readClients } from "@/actions/Client";
import { PaymentDataTable } from "./components/PaymentTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function Payments() {
  const payments = await readTransactionsByCategory("payments");

  if (!payments || payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 p-8 text-center">
        <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            No Payments Yet
          </h2>
          <p className="text-muted-foreground max-w-md">
            Start tracking your payments by adding your first payment record.
            This will help you keep track of all your financial transactions.
          </p>
        </div>
        <Link href="/dashboard/payments/new">
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Payment
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <Link href="/dashboard/payments/new">
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Payment
          </Button>
        </Link>
      </div>
      <PaymentDataTable transactions={payments} />
    </div>
  );
}

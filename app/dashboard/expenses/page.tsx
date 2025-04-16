import { readTransactionsByCategory } from "@/actions/transactions";
import { PaymentDataTable } from "./components/ExpenseTable";
import { readClients } from "@/actions/Client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page() {
  const expenses = await readTransactionsByCategory("expenses");
  const clients = await readClients();

  if (!expenses || expenses.length === 0) {
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
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            No Expenses Yet
          </h2>
          <p className="text-muted-foreground max-w-md">
            Start tracking your expenses by adding your first expense record.
            This will help you monitor your business costs and maintain accurate
            financial records.
          </p>
        </div>
        <Link href="/dashboard/expenses/new">
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Expense
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
        <Link href="/dashboard/expenses/new">
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Expense
          </Button>
        </Link>
      </div>
      <PaymentDataTable transactions={expenses} />
    </div>
  );
}

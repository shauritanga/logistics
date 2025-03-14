import { readTransactionsByCategory } from "@/actions/transactions";
import { PaymentDataTable } from "./components/ExpenseTable";
import { readClients } from "@/actions/Client";

export default async function Page() {
  const expenses = await readTransactionsByCategory("expenses");

  const clients = await readClients();
  return (
    <div className="dark:text-white">
      Expenses
      <div>
        <PaymentDataTable transactions={expenses} clients={clients} />
      </div>
    </div>
  );
}

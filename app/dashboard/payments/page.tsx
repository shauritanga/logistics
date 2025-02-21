import { readTransactionsByCategory } from "@/actions/transactions";
import { readClients } from "@/actions/Client";
import { PaymentDataTable } from "./components/PaymentTable";

export default async function Payments() {
  const expenses = await readTransactionsByCategory("payments");

  console.log({ expenses });
  const clients = await readClients();
  return (
    <div className="dark:text-white">
      Payments
      <div>
        <PaymentDataTable transactions={expenses} clients={clients} />
      </div>
    </div>
  );
}

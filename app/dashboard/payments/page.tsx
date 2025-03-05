import { readTransactionsByCategory } from "@/actions/transactions";
import { readClients } from "@/actions/Client";
import { PaymentDataTable } from "./components/PaymentTable";

export default async function Payments() {
  const payments = await readTransactionsByCategory("payments");

  const clients = await readClients();

  console.log({ payments });
  return (
    <div className="dark:text-white">
      Payments
      <div>
        <PaymentDataTable transactions={payments} clients={clients} />
      </div>
    </div>
  );
}

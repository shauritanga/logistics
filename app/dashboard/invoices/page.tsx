import { readClients } from "@/actions/Client";
import { InvoiceForm } from "./components/Form";
import InvoiceTable from "./components/InvoiceTable";
import { getAllInvoices } from "@/actions/invoice";

export const dynamic = "force-dynamic";
export default async function Invoices() {
  const clients = await readClients();
  const invoices = (await getAllInvoices()) || [];
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1></h1>
        <InvoiceForm clients={clients} />
      </div>
      <InvoiceTable invoices={invoices} />
    </div>
  );
}

import { readClients } from "@/actions/Client";
import { InvoiceForm } from "./components/Form";
import InvoiceTable from "./components/InvoiceTable";
import { getAllInvoices } from "@/actions/invoice";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";
export default async function Invoices() {
  const clients = await readClients();
  const invoices = (await getAllInvoices()) || [];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          {invoices.length === 0 ? "" : "Invoices"}
        </h1>
        {invoices.length === 0 ? (
          <div></div>
        ) : (
          <InvoiceForm clients={clients} />
        )}
      </div>

      {invoices.length === 0 ? (
        <div className="flex flex-col items-center space-y-2 justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            No invoices yet
          </h2>
          <p className="text-gray-500 text-center max-w-md">
            Get started by creating your first invoice. Click the "New Invoice"
            button to begin.
          </p>
          <InvoiceForm clients={clients} />
        </div>
      ) : (
        <InvoiceTable invoices={invoices} />
      )}
    </div>
  );
}

import { readClients } from "@/actions/Client";
import ProformaInvoiceForm from "./components/ProformaInvoiceForm";

export default async function ProformaInvoice() {
  const clients = await readClients();
  {
    return (
      <div>
        Proforma Invoices
        <ProformaInvoiceForm clients={clients} />
      </div>
    );
  }
}

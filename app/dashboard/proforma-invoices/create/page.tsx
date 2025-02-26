import { readClients } from "@/actions/Client";
import ProformaInvoiceForm from "../components/ProformaInvoiceForm";
import { getAllBilOfLanding } from "@/actions/bil";

export default async function CreateProforma() {
  const clients = await readClients();
  const bols = await getAllBilOfLanding();
  return <ProformaInvoiceForm clients={clients} bols={bols} />;
}

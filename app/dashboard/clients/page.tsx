import { readClients } from "@/actions/Client";
import ClientsTable from "./components/ClientTable";
import AddClientForm from "./components/AddClientForm";

export default async function ClientsPage() {
  const clients = await readClients();
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">Clients</h1>
      <div className="flex justify-end">
        <AddClientForm />
      </div>
      <ClientsTable clients={clients} />
    </div>
  );
}

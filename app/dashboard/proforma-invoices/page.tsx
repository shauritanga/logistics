import Link from "next/link";
import { getProformaInvoices } from "@/actions/proforma";
import ProformaTable from "./components/ProformaTable";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ProformaInvoice() {
  const proformaInvoices = await getProformaInvoices();
  {
    return (
      <div className="flex flex-col">
        <Link
          href="/dashboard/proforma-invoices/create"
          className="self-end p-2"
        >
          <Button className="bg-[#f38633] hover:bg-[#b86526] text-white rounded">
            Create Proforma
          </Button>
        </Link>
        <ProformaTable proformaInvoices={proformaInvoices || []} />
      </div>
    );
  }
}

import { getQuotations } from "@/actions/quotation";
import QuotationForm from "./components/QuotationForm";
import QuotationsTable from "./components/QuotationTable";

export const dynamic = "force-dynamic";

export default async function Home() {
  const quotations = await getQuotations();
  console.log({ quotations });
  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-end mb-6">
        <QuotationForm />
      </div>
      <QuotationsTable quotations={quotations} />
    </div>
  );
}

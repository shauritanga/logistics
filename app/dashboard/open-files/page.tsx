import { readClients } from "@/actions/Client";
import BillOfLandingForm from "@/components/bill-of-landing-form";

import { z } from "zod";

const formSchema = z.object({
  shipperName: z.string().min(2, "Shipper name is required"),
  consigneeName: z.string().min(2, "Consignee name is required"),
  shipperAddress: z.string(),
  shipperContact: z.string(),
  consigneeAddress: z.string(),
  consigneeContact: z.string(),
  carrierName: z.string(),
  vesselName: z.string(),
  voyageNumber: z.string(),
  portOfLoading: z.string(),
  portOfDischarge: z.string(),
  placeOfDelivery: z.string(),
  quantity: z.number(),
  grossWeight: z.number(),
  natureOfGoods: z.string(),
  prepaidOrCollect: z.enum(["prepaid", "collect"]),
  freightAmount: z.number(),
  billOfLadingNumber: z.string(),
  dateOfIssue: z.date(),
  hazardousGoods: z.boolean(),
});

export default async function Page() {
  const clients = await readClients();
  return <BillOfLandingForm clients={clients} />;
}

import dbConnect from "@/lib/mongodb";
import BillOfLading from "@/models/File";
import { ResponseBill } from "@/types";

export default async function getAllBilOfLanding(): Promise<ResponseBill[]> {
  try {
    await dbConnect();
    const BilOfLandings = await BillOfLading.find();

    console.log({ BilOfLandings });
    return JSON.parse(JSON.stringify(BilOfLandings, null, 2));
  } catch (error) {}
  return [];
}

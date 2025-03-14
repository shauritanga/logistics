import { getRecentBillOfLanding } from "@/actions/queries";
import RecentBillOfLadingTable from "./RecentBillTable";

export default async function RecentBillOfLanding() {
  const billOfLanding = await getRecentBillOfLanding();
  return (
    <div className=" p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Recent Bill of landing</h2>

      <RecentBillOfLadingTable initialData={billOfLanding} />
    </div>
  );
}

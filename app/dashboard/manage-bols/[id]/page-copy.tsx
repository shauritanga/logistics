import { getBillOfLandingById } from "@/actions/bil";
import { notFound } from "next/navigation";
import { BillOfLandingResponse } from "@/types";

export default async function BillOfLadingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const billOfLading = (await getBillOfLandingById(
    id
  )) as BillOfLandingResponse;

  if (!billOfLading) {
    notFound();
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Bill of Lading Details
      </h1>

      {/* Basic Information */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="bg-gray-100 dark:bg-gray-700 p-3 -mx-6 -mt-6 mb-4 font-semibold text-gray-800 dark:text-gray-200 rounded-t-lg">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              BOL Number:
            </span>{" "}
            {billOfLading.bolNumber}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Country of Last Consignment:
            </span>{" "}
            {billOfLading.countryLastConsignment}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Country of Export:
            </span>{" "}
            {billOfLading.countryOfExeport}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Entry Office:
            </span>{" "}
            {billOfLading.entryOffice}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Created At:
            </span>{" "}
            {new Date(billOfLading.createdAt).toLocaleString()}
          </div>
        </div>
      </section>

      {/* Containers */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="bg-gray-100 dark:bg-gray-700 p-3 -mx-6 -mt-6 mb-4 font-semibold text-gray-800 dark:text-gray-200 rounded-t-lg">
          Containers
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="border border-gray-200 dark:border-gray-600 p-2 text-left text-gray-800 dark:text-gray-200">
                  Container Number
                </th>
                <th className="border border-gray-200 dark:border-gray-600 p-2 text-left text-gray-800 dark:text-gray-200">
                  Tare Weight
                </th>
                <th className="border border-gray-200 dark:border-gray-600 p-2 text-left text-gray-800 dark:text-gray-200">
                  Gross Weight
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {billOfLading.containers.map((container, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="border border-gray-200 dark:border-gray-600 p-2">
                    {container.containerNumber}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-600 p-2">
                    {container.tareWeight}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-600 p-2">
                    {container.grossWeight}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Goods */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="bg-gray-100 dark:bg-gray-700 p-3 -mx-6 -mt-6 mb-4 font-semibold text-gray-800 dark:text-gray-200 rounded-t-lg">
          Goods
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="border border-gray-200 dark:border-gray-600 p-2 text-left text-gray-800 dark:text-gray-200">
                  Description
                </th>
                <th className="border border-gray-200 dark:border-gray-600 p-2 text-left text-gray-800 dark:text-gray-200">
                  Quantity
                </th>
                <th className="border border-gray-200 dark:border-gray-600 p-2 text-left text-gray-800 dark:text-gray-200">
                  Weight
                </th>
                <th className="border border-gray-200 dark:border-gray-600 p-2 text-left text-gray-800 dark:text-gray-200">
                  Value
                </th>
                <th className="border border-gray-200 dark:border-gray-600 p-2 text-left text-gray-800 dark:text-gray-200">
                  Container Ref
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {billOfLading.goods.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="border border-gray-200 dark:border-gray-600 p-2">
                    {item.description}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-600 p-2">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-600 p-2">
                    {item.weight}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-600 p-2">
                    {item.value ?? "N/A"}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-600 p-2">
                    {item.containerReference ?? "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Shipping Details */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="bg-gray-100 dark:bg-gray-700 p-3 -mx-6 -mt-6 mb-4 font-semibold text-gray-800 dark:text-gray-200 rounded-t-lg">
          Shipping Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Port of Loading:
            </span>{" "}
            {billOfLading.portOfLoading}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Port of Discharge:
            </span>{" "}
            {billOfLading.portOfDischarge}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Delivery Place:
            </span>{" "}
            {billOfLading.deliveryPlace ?? "N/A"}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Vessel Name:
            </span>{" "}
            {billOfLading.vessleName ?? "N/A"}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Arrival Date:
            </span>
            {/* {billOfLading.arrivalDate?.toLocaleDateString() ?? "N/A"} */}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Released Date:
            </span>{" "}
            {billOfLading.releasedDate ?? "N/A"}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Term:
            </span>
            {billOfLading.term.code && billOfLading.term.place
              ? `${billOfLading.term.code} - ${billOfLading.term.place}`
              : "N/A"}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Tansad:
            </span>
            {billOfLading.tansad.number && billOfLading.tansad.date
              ? `${billOfLading.tansad.number} (${new Date(
                  billOfLading.tansad.date
                ).toLocaleDateString()})`
              : "N/A"}
          </div>
        </div>
      </section>

      {/* Charges */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="bg-gray-100 dark:bg-gray-700 p-3 -mx-6 -mt-6 mb-4 font-semibold text-gray-800 dark:text-gray-200 rounded-t-lg">
          Charges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Freight Charges:
            </span>
            {billOfLading.freightCharges.amount}{" "}
            {billOfLading.freightCharges.currency}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Insurance:
            </span>
            {billOfLading.insurance.amount} {billOfLading.insurance.currency}
          </div>
        </div>
      </section>

      {/* Parties */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="bg-gray-100 dark:bg-gray-700 p-3 -mx-6 -mt-6 mb-4 font-semibold text-gray-800 dark:text-gray-200 rounded-t-lg">
          Parties Involved
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Shipper:
            </span>{" "}
            {billOfLading.shipper?.name}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Notify Party:
            </span>{" "}
            {billOfLading.notifyParty?.name}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Consignee:
            </span>{" "}
            {billOfLading.consignee?.name}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Shipping Line:
            </span>{" "}
            {billOfLading.shippingLine ?? "N/A"}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Shipping Order:
            </span>{" "}
            {billOfLading.shippingOrder ?? "N/A"}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Trading Country:
            </span>{" "}
            {billOfLading.tradingCountry ?? "N/A"}
          </div>
        </div>
      </section>

      {/* Packing List */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="bg-gray-100 dark:bg-gray-700 p-3 -mx-6 -mt-6 mb-4 font-semibold text-gray-800 dark:text-gray-200 rounded-t-lg">
          Packing List
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Total Packages:
            </span>{" "}
            {billOfLading.packingList.totalPackages ?? "N/A"}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Total Net Weight:
            </span>{" "}
            {billOfLading.packingList.totalNetWeight ?? "N/A"}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Total Gross Weight:
            </span>{" "}
            {billOfLading.packingList.totalGrossWeight ?? "N/A"}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Total Volume:
            </span>{" "}
            {billOfLading.packingList.totalVolume ?? "N/A"}
          </div>
        </div>
      </section>

      {/* Port Invoice */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="bg-gray-100 dark:bg-gray-700 p-3 -mx-6 -mt-6 mb-4 font-semibold text-gray-800 dark:text-gray-200 rounded-t-lg">
          Port Invoice
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Invoice Number:
            </span>{" "}
            {billOfLading.portInvoice.invoiceNumber ?? "N/A"}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Amount:
            </span>
            {billOfLading.portInvoice.amount &&
            billOfLading.portInvoice.currency
              ? `${billOfLading.portInvoice.amount} ${billOfLading.portInvoice.currency}`
              : "N/A"}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Date:
            </span>
            {/* {billOfLading.portInvoice.date?.toLocaleDateString() ?? "N/A"} */}
          </div>
        </div>
      </section>
    </div>
  );
}

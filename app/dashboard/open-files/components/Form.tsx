"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { ChangeEvent, useTransition } from "react";
import { Client } from "../../clients/components/ClientTable";
import { enqueueSnackbar } from "notistack";
import { createBillOfLading } from "@/actions/bil";
import { useRouter } from "next/navigation";

interface Good {
  description: string;
  quantity: string;
  weight: string;
  value: string;
  containerReference: string;
}

interface Container {
  containerNumber: string;
  tareWeight: string;
  grossWeight: string;
  sealNumber: string;
}

interface FreightCharges {
  amount: string;
  currency: string;
}

interface Insurance {
  amount: string;
  currency: string;
}

interface Tansad {
  number: string;
  date: string;
}
interface Term {
  code: string;
  place: string;
}

interface PackingList {
  totalPackages: string;
  totalNetWeight: string;
  totalGrossWeight: string;
  totalVolume: string;
  file?: File | null;
}

interface PortInvoice {
  invoiceNumber: string;
  amount: string;
  currency: string;
  date: string;
  file?: File | null;
}

interface BillOfLadingFormData {
  bolNumber: string;
  shipper: string;
  consignee: string;
  notifyParty: string;
  client: string;
  goods: Good[];
  containers: Container[];
  portOfLoading: string;
  portOfDischarge: string;
  departureDate: string;
  arrivalDate: string;
  freightCharges: FreightCharges;
  packingList: PackingList;
  portInvoice: PortInvoice;
  insurance: Insurance;
  releasedDate: string;
  vessleName: string;
  countryLastConsignment: string;
  tradingCountry: string;
  countryOfExeport: string;
  shippingLine: string;
  entryOffice: string;
  shippingOrder: string;
  deliveryPlace: string;
  tansad: Tansad;
  term: Term;
}

export default function BillOfLadingForm({ clients }: { clients: Client[] }) {
  const router = useRouter();
  // Initial state and hooks unchanged
  const initialState: BillOfLadingFormData = {
    bolNumber: "",
    shipper: "",
    consignee: "",
    notifyParty: "",
    client: "",
    countryLastConsignment: "",
    tradingCountry: "",
    entryOffice: "",
    countryOfExeport: "",
    shippingLine: "",
    goods: [
      {
        description: "",
        quantity: "",
        weight: "",
        value: "",
        containerReference: "",
      },
    ],
    containers: [
      {
        containerNumber: "",
        tareWeight: "",
        grossWeight: "",
        sealNumber: "",
      },
    ],
    shippingOrder: "",
    deliveryPlace: "",
    portOfLoading: "",
    portOfDischarge: "",
    departureDate: "",
    arrivalDate: "",
    vessleName: "",
    releasedDate: "",
    freightCharges: { amount: "", currency: "USD" },
    tansad: { number: "", date: "" },
    insurance: { amount: "", currency: "USD" },
    term: { code: "", place: "" },
    packingList: {
      totalPackages: "",
      totalNetWeight: "",
      totalGrossWeight: "",
      totalVolume: "",
      file: null,
    },
    portInvoice: {
      invoiceNumber: "",
      amount: "",
      currency: "USD",
      date: "",
      file: null,
    },
  };
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = React.useState(initialState);

  // Handler functions unchanged
  // ... (keeping all handleInputChange, handleNestedChange, etc. as they were)

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section?: keyof BillOfLadingFormData
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section || name]:
        section && typeof prev[section] === "object"
          ? { ...prev[section], [name]: value }
          : value,
    }));
  };

  // Handle nested object changes (e.g., freightCharges, insurance, etc.)
  const handleNestedChange = (
    e: ChangeEvent<HTMLInputElement>,
    section: keyof BillOfLadingFormData,
    field: string
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  // Handle array item changes (goods, containers)
  const handleArrayChange = (
    e: ChangeEvent<HTMLInputElement>,
    section: "goods" | "containers",
    index: number,
    field: string
  ) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray[index] = { ...updatedArray[index], [field]: value };
      return { ...prev, [section]: updatedArray };
    });
  };

  // Handle file input changes
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    section: keyof BillOfLadingFormData
  ) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section] as any),
          file,
        },
      }));
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Add new item to arrays
  const addItem = (section: keyof BillOfLadingFormData) => {
    setFormData((prev) => ({
      ...prev,
      [section]:
        section === "goods"
          ? [
              ...prev.goods,
              {
                description: "",
                quantity: "",
                weight: "",
                value: "",
                containerReference: "",
              },
            ]
          : [
              ...prev.containers,
              {
                containerNumber: "",
                type: "",
                tareWeight: "",
                grossWeight: "",
                sealNumber: "",
              },
            ],
    }));
  };

  const submitAction = () => {
    startTransition(async () => {
      const result = await createBillOfLading(
        { success: false, error: "" },
        formData as any
      );
      if (result.success) {
        //setFormData(initialState);
        enqueueSnackbar("BOL has been submitted successfully", {
          variant: "success",
        });
        router.push("/dashboard/manage-bols");
      } else {
        enqueueSnackbar("BOL submission failed", {
          variant: "error",
        });
      }
    });
  };

  return (
    <form
      action={submitAction}
      className="max-w-7xl mx-auto p-6 space-y-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-gray-800/30 transition-colors duration-200"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Bill of Lading
      </h2>

      {/* Basic Information */}
      <section className="space-y-4 rounded-lg border border-gray-100 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f38633]"></span>
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">
              BOL Number
            </Label>
            <Input
              name="bolNumber"
              value={formData.bolNumber}
              onChange={handleInputChange}
              placeholder="Enter BOL number"
              required
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-[#f38633] focus:border-[#f38633] transition-colors duration-200"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Shipper</Label>
            <select
              name="shipper"
              value={formData.shipper}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-[#f38633] focus:border-[#f38633] transition-colors duration-200"
            >
              <option value="">Select shipper</option>
              {clients?.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Consignee</Label>
            <select
              name="consignee"
              value={formData.consignee}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select consignee</option>
              {clients?.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Notify Party</Label>
            <select
              name="notifyParty"
              value={formData.notifyParty}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select notify party</option>
              {clients?.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Shipping Details */}
      <section className="space-y-4 rounded-lg border border-gray-100 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f38633]"></span>
          Shipping Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label>Vessel Name</Label>
            <Input
              name="vessleName"
              value={formData.vessleName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label>Port of Loading</Label>
            <Input
              name="portOfLoading"
              value={formData.portOfLoading}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label>Port of Discharge</Label>
            <Input
              name="portOfDischarge"
              value={formData.portOfDischarge}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label>Shipping Line</Label>
            <Input
              name="shippingLine"
              value={formData.shippingLine}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label>Arrival Date</Label>
            <Input
              type="date"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label>Released Date</Label>
            <Input
              type="date"
              name="releasedDate"
              value={formData.releasedDate}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label>Delivery Place</Label>
            <Input
              name="deliveryPlace"
              value={formData.deliveryPlace}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label>Country of Last Consignment</Label>
            <Input
              name="countryLastConsignment"
              value={formData.countryLastConsignment}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label>Trading Country</Label>
            <Input
              name="tradingCountry"
              value={formData.tradingCountry}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label>Country of Export</Label>
            <Input
              name="countryOfExeport"
              value={formData.countryOfExeport}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label>Entry/Exit Office</Label>
            <Input
              name="entryOffice"
              value={formData.entryOffice}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label>Shipping Order</Label>
            <Input
              name="shippingOrder"
              value={formData.shippingOrder}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </section>

      {/* Terms and TANSAD */}
      <section className="space-y-4 rounded-lg border border-gray-100 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f38633]"></span>
          Terms & Documentation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Delivery Term</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Code"
                value={formData.term.code}
                onChange={(e) => handleNestedChange(e, "term", "code")}
                required
              />
              <Input
                placeholder="Place"
                value={formData.term.place}
                onChange={(e) => handleNestedChange(e, "term", "place")}
              />
            </div>
          </div>
          <div>
            <Label>TANSAD</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Number"
                value={formData.tansad.number}
                onChange={(e) => handleNestedChange(e, "tansad", "number")}
                required
              />
              <Input
                type="date"
                value={formData.tansad.date}
                onChange={(e) => handleNestedChange(e, "tansad", "date")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Goods */}
      <section className="space-y-4 rounded-lg border border-gray-100 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f38633]"></span>
          Goods
        </h3>
        {formData.goods.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200"
          >
            <Input
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleArrayChange(e, "goods", index, "description")
              }
              required
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-[#f38633] focus:border-[#f38633] transition-colors duration-200"
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleArrayChange(e, "goods", index, "quantity")}
              required
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-[#f38633] focus:border-[#f38633] transition-colors duration-200"
            />
            <Input
              type="number"
              placeholder="Weight (kg)"
              value={item.weight}
              onChange={(e) => handleArrayChange(e, "goods", index, "weight")}
              required
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-[#f38633] focus:border-[#f38633] transition-colors duration-200"
            />
            <Input
              type="number"
              placeholder="Value"
              value={item.value}
              onChange={(e) => handleArrayChange(e, "goods", index, "value")}
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-[#f38633] focus:border-[#f38633] transition-colors duration-200"
            />
            <Input
              placeholder="Container Ref"
              value={item.containerReference}
              onChange={(e) =>
                handleArrayChange(e, "goods", index, "containerReference")
              }
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-[#f38633] focus:border-[#f38633] transition-colors duration-200"
            />
          </div>
        ))}
        <Button
          type="button"
          onClick={() => addItem("goods")}
          variant="outline"
          className="border-[#f38633] text-[#f38633] hover:bg-[#f38633] hover:text-white transition-colors duration-200"
        >
          Add Good
        </Button>
      </section>

      {/* Containers */}
      <section className="space-y-4 rounded-lg border border-gray-100 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f38633]"></span>
          Containers
        </h3>
        {formData.containers.map((container, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200"
          >
            <Input
              placeholder="Container Number"
              value={container.containerNumber}
              onChange={(e) =>
                handleArrayChange(e, "containers", index, "containerNumber")
              }
              required
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-[#f38633] focus:border-[#f38633] transition-colors duration-200"
            />
            <Input
              type="number"
              placeholder="Tare Weight (kg)"
              value={container.tareWeight}
              onChange={(e) =>
                handleArrayChange(e, "containers", index, "tareWeight")
              }
              required
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-[#f38633] focus:border-[#f38633] transition-colors duration-200"
            />
            <Input
              type="number"
              placeholder="Gross Weight (kg)"
              value={container.grossWeight}
              onChange={(e) =>
                handleArrayChange(e, "containers", index, "grossWeight")
              }
              required
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-[#f38633] focus:border-[#f38633] transition-colors duration-200"
            />
            <Input
              placeholder="Seal Number"
              value={container.sealNumber}
              onChange={(e) =>
                handleArrayChange(e, "containers", index, "sealNumber")
              }
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-[#f38633] focus:border-[#f38633] transition-colors duration-200"
            />
          </div>
        ))}
        <Button
          type="button"
          onClick={() => addItem("containers")}
          variant="outline"
          className="border-[#f38633] text-[#f38633] hover:bg-[#f38633] hover:text-white transition-colors duration-200"
        >
          Add Container
        </Button>
      </section>

      {/* Financial Details */}
      <section className="space-y-4 rounded-lg border border-gray-100 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f38633]"></span>
          Financial Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label>Freight Charges</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Amount"
                value={formData.freightCharges.amount}
                onChange={(e) =>
                  handleNestedChange(e, "freightCharges", "amount")
                }
                required
              />
              <Input
                placeholder="Currency"
                value={formData.freightCharges.currency}
                onChange={(e) =>
                  handleNestedChange(e, "freightCharges", "currency")
                }
              />
            </div>
          </div>
          <div>
            <Label>Insurance</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Amount"
                value={formData.insurance.amount}
                onChange={(e) => handleNestedChange(e, "insurance", "amount")}
                required
              />
              <Input
                placeholder="Currency"
                value={formData.insurance.currency}
                onChange={(e) => handleNestedChange(e, "insurance", "currency")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-[#f38633] hover:bg-[#ab6832] text-white rounded-lg px-6 py-2.5 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </div>
          ) : (
            "Submit Bill of Lading"
          )}
        </Button>
      </div>
    </form>
  );
}

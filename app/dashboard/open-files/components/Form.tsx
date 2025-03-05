"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { ChangeEvent, useTransition } from "react";
import { Client } from "../../clients/components/ClientTable";
import { enqueueSnackbar } from "notistack";
import { createBillOfLading } from "@/actions/bil";
import { useRouter } from "next/navigation";

// TypeScript interfaces remain unchanged
// ... (keeping all interfaces as they were)
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
      className="max-w-7xl mx-auto p-6 space-y-8 bg-white rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold text-gray-800">Bill of Lading</h2>

      {/* Basic Information */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label>BOL Number</Label>
            <Input
              name="bolNumber"
              value={formData.bolNumber}
              onChange={handleInputChange}
              placeholder="Enter BOL number"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <Label>Shipper</Label>
            <select
              name="shipper"
              value={formData.shipper}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
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
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
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
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
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
      <section className="space-y-4 bg-gray-50 p-4 rounded">
        <h3 className="text-lg font-semibold text-gray-700">Goods</h3>
        {formData.goods.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            <Input
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleArrayChange(e, "goods", index, "description")
              }
              required
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleArrayChange(e, "goods", index, "quantity")}
              required
            />
            <Input
              type="number"
              placeholder="Weight (kg)"
              value={item.weight}
              onChange={(e) => handleArrayChange(e, "goods", index, "weight")}
              required
            />
            <Input
              type="number"
              placeholder="Value"
              value={item.value}
              onChange={(e) => handleArrayChange(e, "goods", index, "value")}
            />
            <Input
              placeholder="Container Ref"
              value={item.containerReference}
              onChange={(e) =>
                handleArrayChange(e, "goods", index, "containerReference")
              }
            />
          </div>
        ))}
        <Button
          type="button"
          onClick={() => addItem("goods")}
          variant="outline"
        >
          Add Good
        </Button>
      </section>

      {/* Containers */}
      <section className="space-y-4 bg-gray-50 p-4 rounded">
        <h3 className="text-lg font-semibold text-gray-700">Containers</h3>
        {formData.containers.map((container, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Input
              placeholder="Container Number"
              value={container.containerNumber}
              onChange={(e) =>
                handleArrayChange(e, "containers", index, "containerNumber")
              }
              required
            />
            <Input
              type="number"
              placeholder="Tare Weight (kg)"
              value={container.tareWeight}
              onChange={(e) =>
                handleArrayChange(e, "containers", index, "tareWeight")
              }
              required
            />
            <Input
              type="number"
              placeholder="Gross Weight (kg)"
              value={container.grossWeight}
              onChange={(e) =>
                handleArrayChange(e, "containers", index, "grossWeight")
              }
              required
            />
            <Input
              placeholder="Seal Number"
              value={container.sealNumber}
              onChange={(e) =>
                handleArrayChange(e, "containers", index, "sealNumber")
              }
            />
          </div>
        ))}
        <Button
          type="button"
          onClick={() => addItem("containers")}
          variant="outline"
        >
          Add Container
        </Button>
      </section>

      {/* Financial Details */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
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

      {/* Documents
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Documents</h3>
        <div className="space-y-6">
          <div>
            <Label>Packing List</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                type="number"
                placeholder="Total Packages"
                value={formData.packingList.totalPackages}
                onChange={(e) =>
                  handleNestedChange(e, "packingList", "totalPackages")
                }
                required
              />
              <Input
                type="number"
                placeholder="Net Weight"
                value={formData.packingList.totalNetWeight}
                onChange={(e) =>
                  handleNestedChange(e, "packingList", "totalNetWeight")
                }
                required
              />
              <Input
                type="number"
                placeholder="Gross Weight"
                value={formData.packingList.totalGrossWeight}
                onChange={(e) =>
                  handleNestedChange(e, "packingList", "totalGrossWeight")
                }
                required
              />
              <Input
                type="number"
                placeholder="Volume"
                value={formData.packingList.totalVolume}
                onChange={(e) =>
                  handleNestedChange(e, "packingList", "totalVolume")
                }
              />
              <div>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, "packingList")}
                />
                {formData.packingList.file && (
                  <p className="text-sm text-gray-600 mt-1">
                    Uploaded: {formData.packingList.file.name}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div>
            <Label>Port Invoice</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                placeholder="Invoice Number"
                value={formData.portInvoice.invoiceNumber}
                onChange={(e) =>
                  handleNestedChange(e, "portInvoice", "invoiceNumber")
                }
                required
              />
              <Input
                type="number"
                placeholder="Amount"
                value={formData.portInvoice.amount}
                onChange={(e) => handleNestedChange(e, "portInvoice", "amount")}
                required
              />
              <Input
                placeholder="Currency"
                value={formData.portInvoice.currency}
                onChange={(e) =>
                  handleNestedChange(e, "portInvoice", "currency")
                }
              />
              <Input
                type="date"
                value={formData.portInvoice.date}
                onChange={(e) => handleNestedChange(e, "portInvoice", "date")}
                required
              />
              <div>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, "portInvoice")}
                />
                {formData.portInvoice.file && (
                  <p className="text-sm text-gray-600 mt-1">
                    Uploaded: {formData.portInvoice.file.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-[#f38633] hover:bg-[#ab6832] text-white rounded"
        >
          {isPending ? "Submitting..." : "Submit Bill of Lading"}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { ChangeEvent, useTransition } from "react";

import { Client } from "../../clients/components/ClientTable";
import { enqueueSnackbar } from "notistack";
import { createBillOfLading } from "@/actions/bil";

// Define TypeScript interfaces (unchanged from your original code)
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
  // Initial form state
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

  // Local state for form data (controlled inputs)
  const [formData, setFormData] =
    React.useState<BillOfLadingFormData>(initialState);

  // Handle input changes for top-level fields
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
      } else {
        enqueueSnackbar("BOL submission failed", {
          variant: "error",
        });
      }
    });
  };

  return (
    <form action={submitAction} className="w-[80vw] mx-auto space-y-6">
      <h2>Bill of Lading and Related Documents Form</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <Label>BOL Number:</Label>
          <Input
            type="text"
            name="bolNumber"
            value={formData.bolNumber}
            onChange={handleInputChange}
            required
            className="p-2 rounded border border-gray-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <Label>Shipper</Label>
          <select
            name="shipper"
            value={formData.shipper}
            onChange={handleInputChange}
            required
            className="w-full block p-2 rounded border border-gray-300"
          >
            <option value="" disabled>
              Select shipper
            </option>
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
            className="block w-full p-2 rounded border border-gray-300"
          >
            <option value="" disabled>
              Select consignee
            </option>
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
            className="block w-full p-2 rounded border border-gray-300"
          >
            <option value="" disabled>
              Select notifier
            </option>
            {clients?.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Client Name</Label>
          <select
            name="client"
            value={formData.client}
            onChange={handleInputChange}
            required
            className="block w-full p-2 rounded border border-gray-300"
          >
            <option value="" disabled>
              Select client
            </option>
            {clients?.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <Label>Vessel Name</Label>
          <Input
            name="vessleName"
            value={formData.vessleName}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-300"
          />
        </div>
        <div>
          <Label>Country Last Consignment</Label>
          <Input
            name="countryLastConsigment"
            value={formData.countryLastConsignment}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-300"
          />
        </div>
        <div>
          <Label>Trading Country</Label>
          <Input
            name="tradingCountry"
            value={formData.tradingCountry}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-300"
          />
        </div>
        <div>
          <Label>Country of Export</Label>
          <Input
            name="countryOfExeport"
            value={formData.countryOfExeport}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-300"
          />
        </div>
        <div>
          <Label>Entry/Exit Office</Label>
          <Input
            name="entryOffice"
            value={formData.entryOffice}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-300"
          />
        </div>
        <div>
          <Label>Shipping Line</Label>
          <Input
            name="shippingLine"
            value={formData.shippingLine}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-300"
          />
        </div>
        <div>
          <Label>Shipping Order</Label>
          <Input
            name="shippingOrder"
            value={formData.shippingOrder}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-300"
          />
        </div>
        <div>
          <Label>Place of Deleivery</Label>
          <Input
            type="text"
            name="deliveryPlace"
            value={formData.deliveryPlace}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-300"
          />
        </div>
      </div>

      {/* Delivery term code */}
      <div className="col-span-4">
        <Label>Delivery Term Code and place</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
          <div>
            <Label>Code</Label>
            <Input
              type="text"
              name="code"
              placeholder="Enter code"
              value={formData.term.code}
              onChange={(e) => handleNestedChange(e, "term", "code")}
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>
          <div>
            <Label>Place</Label>
            <Input
              type="text"
              name="place"
              placeholder="Enter place"
              value={formData.term.place}
              onChange={(e) => handleNestedChange(e, "term", "place")}
              className="p-2 rounded border border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Tansad */}
      <div className="col-span-4">
        <Label>TANSAD</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
          <div>
            <Label>Number</Label>
            <Input
              type="number"
              name="number"
              placeholder="Enter TANSAD number"
              value={formData.tansad.number}
              onChange={(e) => handleNestedChange(e, "tansad", "number")}
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              name="date"
              value={formData.tansad.date}
              onChange={(e) => handleNestedChange(e, "tansad", "date")}
              className="p-2 rounded border border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Goods */}
      <div className="col-span-4 p-2 shadow-md space-y-4">
        <Label>Goods</Label>
        {formData.goods.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
          >
            <Input
              type="text"
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleArrayChange(e, "goods", index, "description")
              }
              required
              className="p-2 rounded border border-gray-300"
            />
            <Input
              type="number"
              placeholder="Packages"
              value={item.quantity}
              onChange={(e) => handleArrayChange(e, "goods", index, "quantity")}
              required
              className="p-2 rounded border border-gray-300"
            />
            <Input
              type="number"
              placeholder="Weight (kg)"
              value={item.weight}
              onChange={(e) => handleArrayChange(e, "goods", index, "weight")}
              required
              className="p-2 rounded border border-gray-300"
            />
            <Input
              type="number"
              placeholder="Value"
              value={item.value}
              onChange={(e) => handleArrayChange(e, "goods", index, "value")}
              className="p-2 rounded border border-gray-300"
            />
            <Input
              type="text"
              placeholder="Container Ref"
              value={item.containerReference}
              onChange={(e) =>
                handleArrayChange(e, "goods", index, "containerReference")
              }
              className="p-2 rounded border border-gray-300"
            />
          </div>
        ))}
        <Button
          type="button"
          onClick={() => addItem("goods")}
          className="border border-gray-300 text-[#f38633] rounded mt-5"
        >
          Add Item
        </Button>
      </div>

      {/* Containers */}
      <div className="col-span-4 shadow-md p-2">
        <h4>Containers</h4>
        {formData.containers.map((container, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            <Input
              type="text"
              placeholder="Container Number"
              value={container.containerNumber}
              onChange={(e) =>
                handleArrayChange(e, "containers", index, "containerNumber")
              }
              required
              className="p-2 rounded border border-gray-300"
            />
            <Input
              type="number"
              placeholder="Tare Weight (kg)"
              value={container.tareWeight}
              onChange={(e) =>
                handleArrayChange(e, "containers", index, "tareWeight")
              }
              required
              className="p-2 rounded border border-gray-300"
            />
            <Input
              type="number"
              placeholder="Gross Weight (kg)"
              value={container.grossWeight}
              onChange={(e) =>
                handleArrayChange(e, "containers", index, "grossWeight")
              }
              required
              className="p-2 rounded border border-gray-300"
            />
            <Input
              type="text"
              placeholder="Seal Number"
              value={container.sealNumber}
              onChange={(e) =>
                handleArrayChange(e, "containers", index, "sealNumber")
              }
              className="p-2 rounded border border-gray-300"
            />
          </div>
        ))}
        <Button
          type="button"
          onClick={() => addItem("containers")}
          className="text-[#f38633] rounded border border-gray-300 p-2 mt-5"
        >
          Add Container
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <Label>Port of Loading</Label>
          <Input
            name="portOfLoading"
            value={formData.portOfLoading}
            onChange={handleInputChange}
            required
            className="p-2 rounded border border-gray-300"
          />
        </div>
        <div>
          <Label>Port of Discharge</Label>
          <Input
            name="portOfDischarge"
            value={formData.portOfDischarge}
            onChange={handleInputChange}
            required
            className="p-2 rounded border border-gray-300"
          />
        </div>

        <div>
          <Label>Date of Arrival</Label>
          <Input
            type="date"
            name="arrivalDate"
            value={formData.arrivalDate}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-300"
          />
        </div>
        <div>
          <Label>Released Date</Label>
          <Input
            type="date"
            name="releasedDate"
            value={formData.releasedDate}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-300"
          />
        </div>
      </div>

      {/* Insurance */}
      <div className="col-span-4">
        <Label>Insurance</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
          <Input
            type="number"
            name="amount"
            min={0}
            value={formData.insurance.amount}
            onChange={(e) => handleNestedChange(e, "insurance", "amount")}
            required
            className="p-2 rounded border border-gray-300"
          />
          <Input
            type="text"
            name="currency"
            value={formData.insurance.currency}
            onChange={(e) => handleNestedChange(e, "insurance", "currency")}
            className="p-2 rounded border border-gray-300"
          />
        </div>
      </div>

      {/* Freight Charges */}
      <div className="col-span-4">
        <Label>Freight Charges</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
          <Input
            type="number"
            name="amount"
            min={0}
            value={formData.freightCharges.amount}
            onChange={(e) => handleNestedChange(e, "freightCharges", "amount")}
            required
            className="p-2 rounded border border-gray-300"
          />
          <Input
            type="text"
            name="currency"
            value={formData.freightCharges.currency}
            onChange={(e) =>
              handleNestedChange(e, "freightCharges", "currency")
            }
            className="p-2 rounded border border-gray-300"
          />
        </div>
      </div>

      {/* Packing List */}
      <div className="col-span-4">
        <Label>Packing List</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <Label>Total Packages</Label>
            <Input
              type="number"
              name="totalPackages"
              value={formData.packingList.totalPackages}
              onChange={(e) =>
                handleNestedChange(e, "packingList", "totalPackages")
              }
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>
          <div>
            <Label>Total Net Weight</Label>
            <Input
              type="number"
              name="totalNetWeight"
              value={formData.packingList.totalNetWeight}
              onChange={(e) =>
                handleNestedChange(e, "packingList", "totalNetWeight")
              }
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>
          <div>
            <Label>Total Gross Weight</Label>
            <Input
              type="number"
              name="totalGrossWeight"
              value={formData.packingList.totalGrossWeight}
              onChange={(e) =>
                handleNestedChange(e, "packingList", "totalGrossWeight")
              }
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>
          <div>
            <Label>Total Volume</Label>
            <Input
              type="number"
              name="totalVolume"
              value={formData.packingList.totalVolume}
              onChange={(e) =>
                handleNestedChange(e, "packingList", "totalVolume")
              }
              className="p-2 rounded border border-gray-300"
            />
          </div>
          <div>
            <Label>Supporting Document</Label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, "packingList")}
              className="p-2 rounded border border-gray-300"
            />
            {formData.packingList.file && (
              <p>Uploaded: {formData.packingList.file.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Port Invoice */}
      <div className="col-span-4">
        <Label>Port Invoice</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <Label>Invoice Number</Label>
            <Input
              type="text"
              name="invoiceNumber"
              value={formData.portInvoice.invoiceNumber}
              onChange={(e) =>
                handleNestedChange(e, "portInvoice", "invoiceNumber")
              }
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>
          <div>
            <Label>Invoice Amount</Label>
            <Input
              type="number"
              name="amount"
              value={formData.portInvoice.amount}
              onChange={(e) => handleNestedChange(e, "portInvoice", "amount")}
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>
          <div>
            <Label>Currency</Label>
            <Input
              type="text"
              name="currency"
              value={formData.portInvoice.currency}
              onChange={(e) => handleNestedChange(e, "portInvoice", "currency")}
              className="p-2 rounded border border-gray-300"
            />
          </div>
          <div>
            <Label>Invoice Due Date</Label>
            <Input
              type="date"
              name="date"
              value={formData.portInvoice.date}
              onChange={(e) => handleNestedChange(e, "portInvoice", "date")}
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>
          <div>
            <Label>Supporting Document</Label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, "portInvoice")}
              className="p-2 rounded border border-gray-300"
            />
          </div>
          {formData.portInvoice.file && (
            <p>Uploaded: {formData.portInvoice.file.name}</p>
          )}
        </div>
      </div>

      <div>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-[#f38633] hover:bg-[#f39222] text-white rounded"
        >
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}

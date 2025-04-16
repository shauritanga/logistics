"use client";
import React, { useState, FormEvent, useTransition, useEffect } from "react";
import { Input } from "@/components/ui/input"; // Shadcn UI Input
import { Button } from "@/components/ui/button"; // Shadcn UI Button
import { Label } from "@/components/ui/label"; // Shadcn UI Label
import { Textarea } from "@/components/ui/textarea"; // Shadcn UI Textarea
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Client } from "../../clients/components/ClientTable";
import { IBillOfLanding } from "@/models/index";
import { createProformaInvoice } from "@/actions/proforma";
import { enqueueSnackbar } from "notistack";
import { BillOfLading } from "@/types";

// Define TypeScript interfaces based on the ProformaInvoice schema

interface Item {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
interface ProformaInvoiceData {
  client: string;
  bol: string;
  items: Item[];
  tax: number;
  discount: number;
  issueDate: string;
  expiryDate: string;
  shippingTerms: string;
  validityPeriod: string;
  notes: string;
}

export default function ProformaInvoiceForm({
  bols,
  clients,
}: {
  bols: BillOfLading[];
  clients: Client[];
}) {
  const [formData, setFormData] = useState<ProformaInvoiceData>({
    client: "",
    bol: "",
    items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
    tax: 0,
    discount: 0,
    issueDate: "",
    expiryDate: "",
    shippingTerms: "",
    validityPeriod: "",
    notes: "",
  });
  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    setFormData((prev) => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string | number
  ) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: field === "description" ? value : Number(value),
      };
      // Auto-calculate total
      newItems[index].total =
        newItems[index].quantity * newItems[index].unitPrice;
      return { ...prev, items: newItems };
    });
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, unitPrice: 0, total: 0 },
      ],
    }));
  };

  const handleSelectChange =
    (field: keyof typeof formData) => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const submitAction = () => {
    startTransition(async () => {
      try {
        await createProformaInvoice(formData);
        enqueueSnackbar("Proforma successfully submited", {
          variant: "success",
        });
      } catch (error) {
        console.log({ error });
        enqueueSnackbar("Proforma submission failed", {
          variant: "error",
        });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create Proforma Invoice</h1>
      <form action={submitAction} className="space-y-6">
        {/* Proforma Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bol">Bill of landing</Label>
            <Select
              onValueChange={handleSelectChange("bol")}
              value={formData.bol}
            >
              <SelectTrigger
                id="bol"
                className="rounded border border-gray-300"
              >
                <SelectValue placeholder="Select a bil of landing" />
              </SelectTrigger>
              <SelectContent>
                {bols.map((bol: BillOfLading) => (
                  <SelectItem key={bol._id} value={bol._id}>
                    {bol.bolNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select
              onValueChange={handleSelectChange("client")}
              value={formData.client}
            >
              <SelectTrigger
                id="client"
                className="rounded border border-gray-300"
              >
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client: Client) => (
                  <SelectItem key={client._id} value={client._id}>
                    {client.name} ({client.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <fieldset className="space-y-4 border p-4 rounded-md">
          <legend className="text-sm font-semibold text-gray-900">Items</legend>
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="space-y-2">
                  <Label htmlFor={`itemDescription${index}`}>Description</Label>
                  <Input
                    id={`itemDescription${index}`}
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    required
                    placeholder="e.g., Custom Software"
                    className="rounded border border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`itemQuantity${index}`}>Quantity</Label>
                  <Input
                    id={`itemQuantity${index}`}
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    required
                    min="1"
                    placeholder="1"
                    className="rounded border border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`itemUnitPrice${index}`}>Unit Price</Label>
                  <Input
                    id={`itemUnitPrice${index}`}
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, "unitPrice", e.target.value)
                    }
                    required
                    min="0"
                    step="0.01"
                    placeholder="1500.00"
                    className="rounded border border-gray-300"
                  />
                </div>
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={addItem}
            className="mt-2 text-[#f38633] rounded p-2 border border-gray-300"
          >
            Add Another Item
          </Button>
        </fieldset>
        {/* Financials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="discount">Discount rate (%)</Label>
            <Input
              id="discount"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="1500.00"
              className="rounded border border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax.rate">Tax Rate (%)</Label>
            <Input
              id="tax"
              name="tax"
              type="number"
              value={formData.tax}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="13"
              className="rounded border border-gray-300"
            />
          </div>
        </div>
        {/* Dates and Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input
              id="issueDate"
              name="issueDate"
              type="date"
              value={formData.issueDate}
              onChange={handleChange}
              className="rounded border border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              className="rounded border border-gray-300"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="shippingTerms">Shipping Terms</Label>
          <Input
            id="shippingTerms"
            name="shippingTerms"
            value={formData.shippingTerms}
            onChange={handleChange}
            placeholder="e.g., CIF"
            className="rounded border border-gray-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="validityPeriod">Validity Period</Label>
          <Input
            id="validityPeriod"
            name="validityPeriod"
            value={formData.validityPeriod}
            onChange={handleChange}
            placeholder="e.g., Valid for 30 days"
            className="rounded border border-gray-300"
          />
        </div>
        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Additional information..."
            className="rounded border border-gray-300"
          />
        </div>
        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#f38633] hover:bg-[#f38633] text-white rounded"
          >
            {isPending ? "Submiting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}

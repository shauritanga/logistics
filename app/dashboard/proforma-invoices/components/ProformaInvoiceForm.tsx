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
import { IBillOfLading } from "@/models/BillOfLanding";
import { createProformaInvoice } from "@/actions/proforma";
import { enqueueSnackbar } from "notistack";

// Define TypeScript interfaces based on the ProformaInvoice schema

interface Item {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Tax {
  rate: number;
  amount: number;
}

interface ProformaInvoiceData {
  proformaNumber: string;
  client: string;
  bol: string;
  items: Item[];
  estimatedSubtotal: number;
  tax: Tax;
  estimatedTotal: number;
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
  bols: IBillOfLading[];
  clients: Client[];
}) {
  const [formData, setFormData] = useState<ProformaInvoiceData>({
    proformaNumber: "",
    client: "",
    bol: "",
    items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
    estimatedSubtotal: 0,
    tax: { rate: 0, amount: 0 },
    estimatedTotal: 0,
    issueDate: "",
    expiryDate: "",
    shippingTerms: "",
    validityPeriod: "",
    notes: "",
  });
  const [isPending, startTransition] = useTransition();

  const calculateTotals = (items: Item[], taxRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  useEffect(() => {
    const { subtotal, taxAmount, total } = calculateTotals(
      formData.items,
      formData.tax.rate
    );
    setFormData((prev) => ({
      ...prev,
      estimatedSubtotal: subtotal,
      tax: { ...prev.tax, amount: taxAmount },
      estimatedTotal: total,
    }));
  }, [formData.items, formData.tax.rate]);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="proformaNumber">Proforma Invoice Number</Label>
            <Input
              id="proformaNumber"
              name="proformaNumber"
              value={formData.proformaNumber}
              onChange={handleChange}
              required
              placeholder="e.g., PF-001"
              className="rounded border border-gray-300"
            />
          </div>
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
                {bols.map((bol: IBillOfLading) => (
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
        {/* Customer Details
        <fieldset className="space-y-4 border p-4 rounded-md">
          <legend className="text-lg font-semibold text-gray-900">
            Customer Details
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer.name">Name</Label>
              <Input
                id="customer.name"
                name="customer.name"
                value={formData.customer.name}
                onChange={handleChange}
                required
                placeholder="e.g., Jane Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer.email">Email</Label>
              <Input
                id="customer.email"
                name="customer.email"
                type="email"
                value={formData.customer.email}
                onChange={handleChange}
                required
                placeholder="e.g., jane@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer.address.street">Street Address</Label>
            <Input
              id="customer.address.street"
              name="customer.address.street"
              value={formData.customer.address.street}
              onChange={handleChange}
              placeholder="e.g., 456 Trade Ave"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer.address.city">City</Label>
              <Input
                id="customer.address.city"
                name="customer.address.city"
                value={formData.customer.address.city}
                onChange={handleChange}
                placeholder="e.g., Export City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer.address.state">State</Label>
              <Input
                id="customer.address.state"
                name="customer.address.state"
                value={formData.customer.address.state}
                onChange={handleChange}
                placeholder="e.g., ON"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer.address.postalCode">Postal Code</Label>
              <Input
                id="customer.address.postalCode"
                name="customer.address.postalCode"
                value={formData.customer.address.postalCode}
                onChange={handleChange}
                placeholder="e.g., A1B 2C3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer.address.country">Country</Label>
              <Input
                id="customer.address.country"
                name="customer.address.country"
                value={formData.customer.address.country}
                onChange={handleChange}
                placeholder="e.g., Canada"
              />
            </div>
          </div>
        </fieldset> */}
        {/* Items */}
        <fieldset className="space-y-4 border p-4 rounded-md">
          <legend className="text-sm font-semibold text-gray-900">Items</legend>
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
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
                <div className="space-y-2">
                  <Label htmlFor={`itemTotal${index}`}>Total</Label>
                  <Input
                    id={`itemTotal${index}`}
                    type="number"
                    value={item.total}
                    readOnly
                    onChange={(e) =>
                      handleItemChange(index, "total", e.target.value)
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estimatedSubtotal">Estimated Subtotal</Label>
            <Input
              id="estimatedSubtotal"
              name="estimatedSubtotal"
              type="number"
              value={formData.estimatedSubtotal}
              onChange={handleChange}
              required
              readOnly
              min="0"
              step="0.01"
              placeholder="1500.00"
              className="rounded border border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax.rate">Tax Rate (%)</Label>
            <Input
              id="tax.rate"
              name="tax.rate"
              type="number"
              value={formData.tax.rate}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="13"
              className="rounded border border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax.amount">Tax Amount</Label>
            <Input
              id="tax.amount"
              name="tax.amount"
              type="number"
              value={formData.tax.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              readOnly
              placeholder="195.00"
              className="rounded border border-gray-300"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="estimatedTotal">Estimated Total</Label>
          <Input
            id="estimatedTotal"
            name="estimatedTotal"
            type="number"
            value={formData.estimatedTotal}
            onChange={handleChange}
            required
            readOnly
            min="0"
            step="0.01"
            placeholder="1695.00"
            className="rounded border border-gray-300"
          />
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

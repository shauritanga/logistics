"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Client } from "../../clients/components/ClientTable";
import { ActionResponse } from "@/types";
import { createInvoice } from "@/actions/invoice";

interface Item {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceFormData {
  client: string;
  items: Item[];
  tax: number;
  discount: number;
  dueDate: string;
  paymentTerms: string;
  notes: string;
}

interface InvoiceCreateDialogProps {
  clients: Client[];
}

export function InvoiceForm({ clients }: InvoiceCreateDialogProps) {
  const [formData, setFormData] = React.useState<InvoiceFormData>({
    client: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
    tax: 0,
    discount: 0,
    dueDate: "",
    paymentTerms: "Due upon receipt",
    notes: "",
  });

  const initialState: ActionResponse = { success: false, message: "" };
  const [state, action, isPending] = React.useActionState(
    createInvoice,
    initialState
  );

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, unitPrice: 0 }],
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#f38633] text-white hover:bg-[#b56425] rounded">
          Create New Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] w-[800px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new invoice. Required fields are
            marked with *.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4">
          {/* Two-column section */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select
                name="client"
                required
                value={formData.client}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, client: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax">Tax Rate (%)</Label>
              <Input
                id="tax"
                name="tax"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.tax}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tax: Number(e.target.value),
                  }))
                }
                placeholder="0.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount Rate (%)</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    discount: Number(e.target.value),
                  }))
                }
                placeholder="0.0"
              />
            </div>
          </div>

          {/* Full-width Items */}
          <div className="space-y-2">
            <Label>Items *</Label>
            <div className="border p-3 rounded-md">
              <div id="items-container" className="space-y-3">
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid gap-3 md:grid-cols-[2fr_1fr_1fr] mt-3 first:mt-0"
                  >
                    <div className="space-y-1">
                      <Label
                        htmlFor={`item-description-${index}`}
                        className="text-sm"
                      >
                        Description *
                      </Label>
                      <Input
                        id={`item-description-${index}`}
                        name={`items[${index}][description]`}
                        required
                        value={item.description}
                        onChange={(e) =>
                          setFormData((prev) => {
                            const newItems = [...prev.items];
                            newItems[index].description = e.target.value;
                            return { ...prev, items: newItems };
                          })
                        }
                        placeholder="Item description"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label
                        htmlFor={`item-quantity-${index}`}
                        className="text-sm"
                      >
                        Qty *
                      </Label>
                      <Input
                        id={`item-quantity-${index}`}
                        name={`items[${index}][quantity]`}
                        type="number"
                        min="1"
                        required
                        value={item.quantity}
                        onChange={(e) =>
                          setFormData((prev) => {
                            const newItems = [...prev.items];
                            newItems[index].quantity = Number(e.target.value);
                            return { ...prev, items: newItems };
                          })
                        }
                        placeholder="1"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label
                        htmlFor={`item-unitPrice-${index}`}
                        className="text-sm"
                      >
                        Unit Price *
                      </Label>
                      <Input
                        id={`item-unitPrice-${index}`}
                        name={`items[${index}][unitPrice]`}
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={item.unitPrice}
                        onChange={(e) =>
                          setFormData((prev) => {
                            const newItems = [...prev.items];
                            newItems[index].unitPrice = Number(e.target.value);
                            return { ...prev, items: newItems };
                          })
                        }
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={handleAddItem}
              >
                Add Another Item
              </Button>
            </div>
          </div>

          {/* Full-width Payment Terms */}
          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Select
              name="paymentTerms"
              value={formData.paymentTerms}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, paymentTerms: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Due upon receipt">
                  Due upon receipt
                </SelectItem>
                <SelectItem value="Net 15">Net 15</SelectItem>
                <SelectItem value="Net 30">Net 30</SelectItem>
                <SelectItem value="Net 60">Net 60</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Full-width Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Additional notes..."
              className="min-h-[100px]"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </div>

          <DialogFooter className="sm:justify-end">
            <Button type="submit">
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

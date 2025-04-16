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
import { ActionResponse, Invoice } from "@/types";
import { updateInvoice, DataSource } from "@/actions/invoice"; // Changed to updateInvoice
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";

interface Item {
  description: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

interface InvoiceFormData {
  client: string;
  items: Item[];
  tax: number;
  discount: number;
  dueDate: Date;
  paymentTerms: string;
  notes: string;
}

export interface InvoiceEditFormProps {
  open: boolean;
  clients: Client[];
  invoice: Invoice;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

export function InvoiceEditForm({
  clients,
  invoice,
  open,
  setOpen,
  onClose,
}: InvoiceEditFormProps) {
  const [formData, setFormData] = React.useState<InvoiceFormData>({
    client: invoice.client._id,
    items:
      invoice.items.length > 0
        ? invoice.items.map((item) => ({
            ...item,
            currency: item.currency || "USD", // Default to USD if not specified
          }))
        : [{ description: "", quantity: 1, unitPrice: 0, currency: "USD" }],
    tax: invoice.tax.rate,
    discount: invoice.discount.rate,
    dueDate: new Date(invoice.dueDate), // Ensure dueDate is a proper Date object
    paymentTerms: invoice.paymentTerms,
    notes: invoice.notes,
  });
  const router = useRouter();

  const initialState: ActionResponse = { success: false, message: "" };
  const [state, action, isPending] = React.useActionState(
    (state: ActionResponse, payload: DataSource) =>
      updateInvoice(state, payload, invoice._id, false), // Pass invoice ID
    initialState
  );

  React.useEffect(() => {
    if (state.success) {
      enqueueSnackbar(`${state.message}`, {
        variant: "info",
      });
      setOpen(false);
    }
  }, [state]);

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, unitPrice: 0, currency: "USD" },
      ],
    }));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          onClose(false); // Pass 'false' to indicate the dialog is closed
        }
      }}
    >
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="max-w-[90vw] w-[800px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
          <DialogDescription>
            Update the details of the invoice. Required fields are marked with
            *.
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
                value={formData.dueDate.toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dueDate: new Date(e.target.value),
                  }))
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
                      <div className="flex gap-2">
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
                              newItems[index].unitPrice = Number(
                                e.target.value
                              );
                              return { ...prev, items: newItems };
                            })
                          }
                          placeholder="0.00"
                        />
                        <Select
                          value={item.currency}
                          onValueChange={(value) =>
                            setFormData((prev) => {
                              const newItems = [...prev.items];
                              newItems[index].currency = value;
                              return { ...prev, items: newItems };
                            })
                          }
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="TZS">TZS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

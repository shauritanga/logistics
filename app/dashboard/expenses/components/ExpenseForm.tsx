import React, { useActionState, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTransaction } from "@/actions/transactions";
import { ActionResponse } from "@/types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: any[];
}

const initialState: ActionResponse = {
  success: false,
  message: "",
};

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  clients,
}) => {
  const [formData, setFormData] = useState({
    client: "",
    transactionDate: "",
    amount: "",
    category: "expenses",
    description: "",
  });
  const [state, action, isPending] = useActionState(
    createTransaction,
    initialState
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-4 bg-white dark:bg-black rounded">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <form action={action}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="client"
                className="block text-sm font-medium text-gray-700"
              >
                Client
              </label>
              <select
                name="client"
                id="client"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.client}
                onChange={handleChange}
                required
              >
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="transactionDate"
                className="block text-sm font-medium text-gray-700"
              >
                Transaction Date
              </label>
              <Input
                type="date"
                name="transactionDate"
                id="transactionDate"
                value={formData.transactionDate}
                onChange={handleChange}
                required
                className="p-2 rounded border border-gray-300"
              />
            </div>
            <div>
              <div>
                <Label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </Label>
                <Input
                  type="number"
                  name="amount"
                  id="amount"
                  min={0}
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="p-2 rounded border border-gray-300"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                name="category"
                id="category"
                value={formData.category}
                defaultValue={formData.category}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                required
                disabled
              >
                <option value="payments">Payments</option>
                <option value="expenses">Expenses</option>
              </select>
            </div>
            <div>
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description
              </Label>
              <Textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="p-2 rounded border border-gray-300 mb-5"
              ></Textarea>
            </div>
          </div>
          {state?.success ? (
            <div className="flex flex-col mt-6 bg-green-100 p-2 text-green-500 rounded">
              <p className="text-muted italic">{state.message}</p>
            </div>
          ) : (
            state.message && (
              <div className="flex flex-col mt-6 bg-red-100 p-2 text-red-500 rounded">
                <p className="text-muted italic">{state.message}</p>
              </div>
            )
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#f38633] hover:bg-[#d4915e] text-white"
            >
              Add Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;

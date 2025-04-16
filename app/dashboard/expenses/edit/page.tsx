"use client";

import { useState, useEffect, useTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { enqueueSnackbar } from "notistack";
import { readClients } from "@/actions/Client";
import { getTransactionById, updateTransaction } from "@/actions/transactions";
import { useSearchParams } from "next/navigation";

interface Client {
  _id: string;
  name: string;
}

interface FormData {
  client: string;
  transactionDate: string;
  amount: number;
  currency: "USD" | "TZS";
  category: "payments" | "expenses";
  description: string;
}

interface FormErrors {
  client?: string;
  transactionDate?: string;
  amount?: string;
  currency?: string;
  description?: string;
}

export default function EditExpensePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState<FormData>({
    client: "",
    transactionDate: new Date().toISOString().split("T")[0],
    amount: 0,
    currency: "USD",
    category: "expenses",
    description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [state, dispatch, isActionPending] = useActionState(
    (state: any, payload: FormData) => updateTransaction(id as string, payload),
    {
      success: false,
      message: "",
    }
  );

  const id = searchParams.get("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (!id) {
          throw new Error("Transaction ID is required");
        }

        const [clients, transaction] = await Promise.all([
          readClients(),
          getTransactionById(id),
        ]);

        if (!transaction) {
          throw new Error("Transaction not found");
        }

        setClients(clients);
        const updatedFormData = {
          client: transaction.client,
          transactionDate: new Date(transaction.transactionDate)
            .toISOString()
            .split("T")[0],
          amount: transaction.amount,
          currency: transaction.currency,
          category: transaction.category,
          description: transaction.description,
        };
        setFormData(updatedFormData);
      } catch (error) {
        console.error("Error fetching data:", error);
        enqueueSnackbar(
          error instanceof Error ? error.message : "Failed to load transaction",
          {
            variant: "error",
          }
        );
        router.push("/dashboard/expenses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.client) {
      newErrors.client = "Client is required";
    }
    if (!formData.transactionDate) {
      newErrors.transactionDate = "Transaction date is required";
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    }
    if (!formData.description) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value.toString());
    });
    startTransition(() => {
      dispatch({
        client: formData.client,
        transactionDate: formData.transactionDate,
        amount: formData.amount,
        currency: formData.currency,
        description: formData.description,
        category: formData.category,
      });
    });
  };

  useEffect(() => {
    if (state.success) {
      enqueueSnackbar(state.message, { variant: "success" });
      router.push("/dashboard/expenses");
    } else if (state.message && !state.success) {
      enqueueSnackbar(state.message, { variant: "error" });
    }
  }, [state, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Expense</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="client"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Client
            </label>
            <select
              name="client"
              id="client"
              className={`w-full p-2 border rounded-md ${
                errors.client ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.client}
              onChange={handleChange}
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.client && (
              <p className="mt-1 text-sm text-red-500">{errors.client}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="transactionDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Transaction Date
            </label>
            <Input
              type="date"
              name="transactionDate"
              id="transactionDate"
              value={formData.transactionDate}
              onChange={handleChange}
              className={`w-full p-2 rounded-md ${
                errors.transactionDate ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.transactionDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.transactionDate}
              </p>
            )}
          </div>
          <div>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                  className={`w-full p-2 rounded-md ${
                    errors.amount ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
                )}
              </div>
              <div className="w-32">
                <Label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Currency
                </Label>
                <select
                  name="currency"
                  id="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="TZS">TZS</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled
            >
              <option value="payments">Payments</option>
              <option value="expenses">Expenses</option>
            </select>
          </div>
          <div>
            <Label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </Label>
            <Textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full p-2 rounded-md border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              rows={4}
            ></Textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending || isActionPending}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || isActionPending}
              className="px-6"
            >
              {isPending || isActionPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

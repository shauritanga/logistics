"use client";

import { useState, useEffect } from "react";
import { ExpenseForm } from "@/components/forms/ExpenseForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Client {
  _id: string;
  name: string;
}

export default function NewExpensePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients");
        if (!response.ok) throw new Error("Failed to fetch clients");
        const data = await response.json();
        setClients(data);
      } catch (error) {
        toast.error("Failed to load clients");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          category: "expenses",
          status: "pending",
        }),
      });

      if (!response.ok) throw new Error("Failed to create expense");

      router.push("/expenses");
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Expense</h1>
        <ExpenseForm onSubmit={handleSubmit} clients={clients} />
      </div>
    </div>
  );
}

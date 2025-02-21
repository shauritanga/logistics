"use client";
import { updateTransaction } from "@/actions/transactions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { FaCheck, FaTimes } from "react-icons/fa";

interface Transaction {
  _id: string;
  client: { name: string };
  transactionDate: Date;
  amount: number;
  category: "payments" | "expenses";
  status: "pending" | "approved" | "rejected";
}

export default function TransactionTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const handleApprove = async (id: string) => {
    await updateTransaction(id, { status: "approved" });
  };

  const handleReject = async (id: string) => {
    await updateTransaction(id, { status: "rejected" });
  };

  return (
    <Table className="min-w-full bg-white dark:bg-gray-800">
      <TableHeader>
        <TableRow>
          <TableHead className="py-2 px-4 border-b">ID</TableHead>
          <TableHead className="py-2 px-4 border-b">Client Name</TableHead>
          <TableHead className="py-2 px-4 border-b">Date</TableHead>
          <TableHead className="py-2 px-4 border-b">Amount</TableHead>
          <TableHead className="py-2 px-4 border-b">Category</TableHead>
          <TableHead className="py-2 px-4 border-b">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction._id}>
            <TableCell className="py-2 px-4 border-b">
              {transaction._id}
            </TableCell>
            <TableCell className="py-2 px-4 border-b">
              {transaction.client.name}
            </TableCell>
            <TableCell className="py-2 px-4 border-b">
              {new Date(transaction.transactionDate).toLocaleDateString()}
            </TableCell>
            <TableCell className="py-2 px-4 border-b">
              {transaction.amount}
            </TableCell>
            <TableCell className="py-2 px-4 border-b">
              {transaction.category}
            </TableCell>
            <TableCell className="py-2 px-4 border-b">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() => handleApprove(transaction._id)}
                    className="cursor-pointer"
                  >
                    <FaCheck className="mr-2 h-4 w-4 text-green-500" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => handleReject(transaction._id)}
                    className="cursor-pointer"
                  >
                    <FaTimes className="mr-2 h-4 w-4 text-red-500" />
                    Reject
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

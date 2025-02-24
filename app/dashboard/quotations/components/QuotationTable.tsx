"use client";

import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download, Edit, Trash } from "lucide-react";
import { getQuotations, deleteQuotation } from "@/actions/quotation";
import { ActionResponse, Quotation } from "@/types";

export default function QuotationsTable({
  quotations,
}: {
  quotations: Quotation[];
}) {
  const { enqueueSnackbar } = useSnackbar();

  // Handle delete action
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this quotation?")) {
      const result: ActionResponse = await deleteQuotation(id);
      if (result.success) {
        enqueueSnackbar(result.message, { variant: "success" });
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    }
  };

  // Placeholder for download (e.g., PDF generation)
  const handleDownload = (quotation: Quotation) => {
    enqueueSnackbar(`Downloading quotation ${quotation.quotationNumber}`, {
      variant: "info",
    });
    // Example with jsPDF: const doc = new jsPDF(); doc.text(quotation.quotationNumber); doc.save();
  };

  // Placeholder for edit
  const handleEdit = (quotation: Quotation) => {
    enqueueSnackbar(`Editing quotation ${quotation.quotationNumber}`, {
      variant: "info",
    });
    // Could set state to open an edit dialog
  };

  return (
    <div className="w-full  p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Quotations List
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Quotation Number</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Total Cost ($)</TableHead>
            <TableHead>Valid Until</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No quotations found
              </TableCell>
            </TableRow>
          ) : (
            quotations.map((quotation) => (
              <TableRow
                key={quotation._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <TableCell className="font-medium">
                  {quotation.quotationNumber}
                </TableCell>
                <TableCell>{quotation.client}</TableCell>
                <TableCell>{quotation.origin}</TableCell>
                <TableCell>{quotation.destination}</TableCell>
                <TableCell>{quotation.totalCost.toFixed(2)}</TableCell>
                <TableCell>{quotation.validUntil}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white dark:bg-gray-800"
                    >
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleDownload(quotation)}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEdit(quotation)}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(quotation._id)}
                        className="cursor-pointer text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

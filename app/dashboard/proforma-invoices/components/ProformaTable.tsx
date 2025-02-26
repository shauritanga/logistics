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
import { deleteQuotation } from "@/actions/quotation";
import { ActionResponse, Quotation } from "@/types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "./Invoice";

export default function ProformaTable({
  proformaInvoices,
}: {
  proformaInvoices: any[];
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
        Proforma
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Issued Date</TableHead>
            <TableHead>Expired Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proformaInvoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No quotations found
              </TableCell>
            </TableRow>
          ) : (
            proformaInvoices.map((proforma) => (
              <TableRow
                key={proforma._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <TableCell className="font-medium">
                  {proforma.proformaNumber}
                </TableCell>
                <TableCell>{proforma.client.name}</TableCell>
                <TableCell>{proforma.issueDate}</TableCell>
                <TableCell>{proforma.expiryDate}</TableCell>
                <TableCell>{proforma.estimatedTotal.toFixed(2)}</TableCell>

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
                        onClick={() => handleDownload(proforma)}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        <PDFDownloadLink
                          document={<InvoicePDF invoice={proforma} />}
                          fileName={`invoice-${proforma.proformaNumber}.pdf`}
                        >
                          {({ loading }: { loading: boolean }) =>
                            loading ? "Generating..." : "Download"
                          }
                        </PDFDownloadLink>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEdit(proforma)}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(proforma._id)}
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

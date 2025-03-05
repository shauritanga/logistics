"use client";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download, Edit, Trash } from "lucide-react";
import { deleteQuotation } from "@/actions/quotation";
import { ActionResponse, Invoice, Quotation } from "@/types";
import { IProformaInvoice } from "@/models/ProformaInvoice";
import { format } from "date-fns";

export default function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
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
  const handleDownload = (invoice: Invoice) => {
    enqueueSnackbar(`Downloading quotation ${invoice.invoiceNumber}`, {
      variant: "info",
    });
    // Example with jsPDF: const doc = new jsPDF(); doc.text(quotation.quotationNumber); doc.save();
  };

  // Placeholder for edit
  const handleEdit = (invoice: Invoice) => {
    enqueueSnackbar(`Editing quotation ${invoice.invoiceNumber}`, {
      variant: "info",
    });
    // Could set state to open an edit dialog
  };

  // Handle export to invoice
  const handleExportToInvoice = (proforma: IProformaInvoice) => {
    enqueueSnackbar(
      `Exporting proforma ${proforma.proformaNumber} to invoice`,
      {
        variant: "info",
      }
    );
    // Implement the logic to export proforma to invoice
    // Example: call an API to create an invoice from the proforma
  };

  return (
    <div className="w-full  p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Invoices
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Issued Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No quotations found
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow
                key={invoice._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <TableCell className="font-medium">
                  {invoice.invoiceNumber}
                </TableCell>
                <TableCell>{invoice.client.name}</TableCell>
                <TableCell>
                  {format(new Date(invoice.issueDate), "PPP")}
                </TableCell>
                <TableCell>
                  {format(new Date(invoice.dueDate), "PPP")}
                </TableCell>
                <TableCell>
                  {Intl.NumberFormat().format(invoice.totalAmount)}
                </TableCell>
                <TableCell>{invoice.status}</TableCell>
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
                      <DropdownMenuItem
                        onClick={() => handleDownload(invoice)}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {/* <PDFDownloadLink
                          document={<InvoicePDF invoice={invoice} />}
                          fileName={`invoice-${proforma.proformaNumber}.pdf`}
                        >
                          {({ loading }: { loading: boolean }) =>
                            loading ? "Generating..." : "Download"
                          }
                        </PDFDownloadLink> */}
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleEdit(invoice)}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(invoice._id)}
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

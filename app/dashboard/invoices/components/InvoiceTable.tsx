"use client";
import { useEffect, useState } from "react";
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
import {
  MoreHorizontal,
  Edit,
  Trash,
  AlertCircle,
  XCircle,
  Check,
  Download,
} from "lucide-react";
import { ActionResponse, Invoice } from "@/types";
import { format } from "date-fns";
import {
  deleteInvoice,
  markInvoiceAsPaid,
  markInvoiceAsOverdue,
  markInvoiceAsCanceled,
} from "@/actions/invoice";
import { readClients } from "@/actions/Client";
import { InvoiceEditForm } from "./EditForm";
import { Badge } from "@/components/ui/badge";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "./invoicePDF";

export default function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  const [invoice, setInvoice] = useState<Invoice | undefined>();
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getClients = async () => {
      setIsLoadingClients(true);
      try {
        const clients = await readClients();
        setClients(clients || []);
      } catch (error) {
        enqueueSnackbar("Failed to load clients", { variant: "error" });
        setClients([]);
      } finally {
        setIsLoadingClients(false);
      }
    };
    getClients();
  }, [enqueueSnackbar]);

  if (isLoadingClients) {
    return <div>Loading clients...</div>;
  }

  // Handle delete action
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      const result: ActionResponse = await deleteInvoice(id);
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

  // Handle edit action
  const handleEdit = (invoice: Invoice) => {
    setInvoice(invoice);
    setOpen(true);
  };

  // Handle modal close
  const handleClose = () => {
    setOpen(false);
    setInvoice(undefined);
  };

  // Handle mark as paid action
  const handleMarkAsPaid = async (id: string) => {
    if (confirm("Are you sure you want to mark this invoice as paid?")) {
      const result: ActionResponse = await markInvoiceAsPaid(id);
      if (result.success) {
        enqueueSnackbar(result.message, { variant: "success" });
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    }
  };

  // Handle mark as overdue action
  const handleMarkAsOverdue = async (id: string) => {
    if (confirm("Are you sure you want to mark this invoice as overdue?")) {
      const result: ActionResponse = await markInvoiceAsOverdue(id);
      if (result.success) {
        enqueueSnackbar(result.message, { variant: "success" });
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    }
  };

  // Handle mark as canceled action
  const handleMarkAsCanceled = async (id: string) => {
    if (confirm("Are you sure you want to mark this invoice as canceled?")) {
      const result: ActionResponse = await markInvoiceAsCanceled(id);
      if (result.success) {
        enqueueSnackbar(result.message, { variant: "success" });
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      {/* <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Invoices
      </h2> */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className="font-semibold">Invoice Number</TableHead>
            <TableHead className="font-semibold">Client</TableHead>
            <TableHead className="font-semibold">Issued Date</TableHead>
            <TableHead className="font-semibold">Due Date</TableHead>
            <TableHead className="font-semibold">Total Amount</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="w-[100px] font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No invoices found
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow
                key={invoice._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
              >
                <TableCell className="font-medium">
                  {invoice.invoiceNumber}
                </TableCell>
                <TableCell>{invoice.client?.name}</TableCell>
                <TableCell>
                  {format(new Date(invoice.issueDate), "PPP")}
                </TableCell>
                <TableCell>
                  {format(new Date(invoice.dueDate), "PPP")}
                </TableCell>
                <TableCell className="font-medium">
                  {Intl.NumberFormat().format(invoice.totalAmount)}
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </Badge>
                </TableCell>
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
                        <PDFDownloadLink
                          document={<InvoicePDF invoice={invoice} />}
                          fileName={`invoice-${invoice.invoiceNumber}.pdf`}
                        >
                          {({ loading }: { loading: boolean }) =>
                            loading ? "Generating..." : "Download"
                          }
                        </PDFDownloadLink>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEdit(invoice)}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleMarkAsPaid(invoice._id)}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Paid
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleMarkAsOverdue(invoice._id)}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Mark as Overdue
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleMarkAsCanceled(invoice._id)}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Mark as Canceled
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
      {invoice && (
        <InvoiceEditForm
          open={open}
          setOpen={setOpen}
          clients={clients}
          invoice={invoice}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

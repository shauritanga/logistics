"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function ProformaInvoiceTable({
  proformaInvoices,
}: {
  proformaInvoices: any[];
}) {
  const handleEdit = (id: string) => {
    // Implement edit functionality
    console.log(`Edit proforma invoice with id: ${id}`);
  };

  const handleDelete = (id: string) => {
    // Implement delete functionality
    console.log(`Delete proforma invoice with id: ${id}`);
  };

  const handleDownload = (id: string) => {
    // Implement download functionality
    console.log(`Download proforma invoice with id: ${id}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice Number</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {proformaInvoices.map((invoice) => (
          <TableRow key={invoice._id}>
            <TableCell>{invoice.proformaNumber}</TableCell>
            <TableCell>{invoice.client.name}</TableCell>
            <TableCell>
              {new Date(invoice.issueDate).toLocaleDateString()}
            </TableCell>
            <TableCell>{invoice.estimatedTotal}</TableCell>
            <TableCell>
              <Button onClick={() => handleEdit(invoice._id)}>Edit</Button>
              <Button onClick={() => handleDelete(invoice._id)}>Delete</Button>
              <Button onClick={() => handleDownload(invoice._id)}>
                Download
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

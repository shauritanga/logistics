"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditClientModal from "./EditClientModal";
import { deleteClient } from "@/actions/Client";
import { enqueueSnackbar } from "notistack";

export interface Client {
  _id: string;
  name: string;
  district: string;
  region: string;
  street: string;
  country: string;
  email: string;
  phone: string;
}

const ClientsTable = ({ clients }: { clients: Client[] }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (clientId: string) => {
    await deleteClient(clientId);
    enqueueSnackbar("Client delected successfully", { variant: "success" });
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full bg-white dark:bg-gray-800">
        <TableHeader>
          <TableRow>
            <TableHead className="py-2 px-4 border-b">Name</TableHead>
            <TableHead className="py-2 px-4 border-b">District</TableHead>
            <TableHead className="py-2 px-4 border-b">Region</TableHead>
            <TableHead className="py-2 px-4 border-b">Street</TableHead>
            <TableHead className="py-2 px-4 border-b">Country</TableHead>
            <TableHead className="py-2 px-4 border-b">Email</TableHead>
            <TableHead className="py-2 px-4 border-b">Phone</TableHead>
            <TableHead className="py-2 px-4 border-b">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client._id}>
              <TableCell className="py-2 px-4 border-b">
                {client.name}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {client.district}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {client.region}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {client.street}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {client.country}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {client.email}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {client.phone}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <FaEdit className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => handleEdit(client)}>
                      <FaEdit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleDelete(client._id)}
                      className="text-red-500"
                    >
                      <FaTrash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedClient && (
        <EditClientModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          client={selectedClient}
        />
      )}
    </div>
  );
};

export default ClientsTable;

"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsTable;

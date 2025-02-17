"use client";

import { useState } from "react";
import { MoreHorizontal, ArrowUpDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import BillOfLadingModalForm from "./bill-of-landing-modal-form";

interface BillOfLading {
  id: string;
  billOfLadingNumber: string;
  shipperName: string;
  consigneeName: string;
  dateOfIssue: Date;
  portOfLoading: string;
  portOfDischarge: string;
}

const data: BillOfLading[] = [
  {
    id: "1",
    billOfLadingNumber: "BOL001",
    shipperName: "ABC Company",
    consigneeName: "XYZ Corporation",
    dateOfIssue: new Date("2023-01-15"),
    portOfLoading: "Shanghai",
    portOfDischarge: "Los Angeles",
  },
  {
    id: "2",
    billOfLadingNumber: "BOL002",
    shipperName: "Global Exports Ltd",
    consigneeName: "Import Masters Inc",
    dateOfIssue: new Date("2023-02-20"),
    portOfLoading: "Hamburg",
    portOfDischarge: "New York",
  },
  {
    id: "3",
    billOfLadingNumber: "BOL003",
    shipperName: "Eastern Traders",
    consigneeName: "Western Distributors",
    dateOfIssue: new Date("2023-03-10"),
    portOfLoading: "Singapore",
    portOfDischarge: "Rotterdam",
  },
];

export const columns: ColumnDef<BillOfLading>[] = [
  {
    accessorKey: "billOfLadingNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bill of Lading Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "shipperName",
    header: "Shipper",
  },
  {
    accessorKey: "consigneeName",
    header: "Consignee",
  },
  {
    accessorKey: "dateOfIssue",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date of Issue
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("dateOfIssue") as Date;
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "portOfLoading",
    header: "Port of Loading",
  },
  {
    accessorKey: "portOfDischarge",
    header: "Port of Discharge",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const billOfLading = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => console.log("View", billOfLading.id)}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Edit", billOfLading.id)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => console.log("Delete", billOfLading.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function BillOfLadingTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bill number..."
            value={
              (table
                .getColumn("billOfLadingNumber")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("billOfLadingNumber")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        {/* <BillOfLadingModalForm /> */}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  ArrowUpDown,
  Search,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

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
import { format, parseISO } from "date-fns";
import { IBillOfLanding } from "@/models/index";
import { deleteBillOfLading } from "@/actions/bil";
import { useTransition } from "react";
import { enqueueSnackbar } from "notistack";

const columns: ColumnDef<IBillOfLanding>[] = [
  {
    accessorKey: "bolNumber",
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
    cell: ({ row }) => {
      const billOfLadingNumber = row.getValue("bolNumber");
      return billOfLadingNumber;
    },
  },
  {
    accessorKey: "shipper.name",
    header: "Shipper",
  },
  {
    accessorKey: "vessleName",
    header: "Vessle Name",
  },
  {
    accessorKey: "consignee.name",
    header: "Consignee",
  },
  {
    accessorKey: "arrivalDate",
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
      const date = row.getValue("arrivalDate");
      const parsedDate = parseISO(date as string);
      const formatedDate = format(parsedDate, "dd-MM-yyyy");
      return formatedDate;
    },
  },
  {
    accessorKey: "releasedDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date of Release
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("releasedDate");
      const parsedDate = date as Date;
      const formatedDate = format(parsedDate, "dd-MM-yyyy");
      return formatedDate;
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
    accessorKey: "deliveryPlace",
    header: "Delivery Place",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const billOfLading = row.original;
      const router = useRouter();
      const [isPending, startTransition] = useTransition();

      const handleDelete = async (id: string) => {
        startTransition(async () => {
          const result = await deleteBillOfLading(id);
          if (result.success) {
            enqueueSnackbar("Bill of Lading deleted successfully", {
              variant: "success",
            });
            router.refresh();
          } else {
            enqueueSnackbar(result.error || "Failed to delete Bill of Lading", {
              variant: "error",
            });
          }
        });
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="dark:bg-black dark:text-white"
          >
            <DropdownMenuItem
              onClick={() =>
                router.push(`/dashboard/manage-bols/${billOfLading._id}`)
              }
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Edit", billOfLading._id)}
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(billOfLading._id)}
              className="flex items-center gap-2 text-red-600 focus:text-red-600"
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
              {isPending ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface BillOfLadingTableProps {
  initialData: IBillOfLanding[];
}

export default function BillOfLadingTable({
  initialData,
}: BillOfLadingTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const router = useRouter();

  const table = useReactTable({
    data: initialData,
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
      <div className="flex justify-between text-black dark:text-white">
        <div className="flex items-center space-x-1 border rounded px-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bill number..."
            value={
              (table.getColumn("bolNumber")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("bolNumber")?.setFilterValue(event.target.value)
            }
            className="max-w-sm border-none"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table className="text-black dark:text-white">
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

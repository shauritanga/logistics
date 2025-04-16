"use client";
import * as React from "react";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import dayjs from "dayjs";

import { Client } from "../../clients/components/ClientTable";
import { deleteTransaction } from "@/actions/transactions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

interface Transaction {
  _id: string;
  client: Client;
  transactionDate: Date;
  status: "pending" | "approved" | "rejected";
  amount: number;
  category: "payments" | "expenses";
}

export function PaymentDataTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const router = useRouter();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [itemToDelete, setItemToDelete] = React.useState<Transaction | null>(
    null
  );
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const data = transactions;

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const result = await deleteTransaction(itemToDelete._id);
      if (result.success) {
        enqueueSnackbar(result.message, { variant: "success" });
        router.refresh();
      }
    } catch (error) {
      enqueueSnackbar("Update failed", { variant: "error" });
    } finally {
      setIsAlertOpen(false);
      setItemToDelete(null);
    }
  };

  const columns = [
    {
      accessorKey: "transactionDate",
      header: "Date",
      cell: ({ row }: { row: any }) => {
        const date = row.original.date;
        const formatted = dayjs(date).format("DD-MM-YYYY");
        return <div>{formatted}</div>;
      },
    },
    {
      accessorFn: (row: Transaction) => row.client.name, // Function to access nested property
      id: "client.name",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Client Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: any }) => {
        const name = row.original.client.name;

        return <div>{name}</div>;
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }: { row: any }) => {
        const category = row.original.category;
        return <div className="capitalize">{category}</div>;
      },
    },
    {
      accessorKey: "description",
    },

    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: { row: any }) => {
        const amount = row.original.amount;
        const formmater = Intl.NumberFormat("sw-TZ", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        });
        return <div className="capitalize">{formmater.format(amount)}</div>;
      },
    },
    {
      accessorKey: "currency",
      header: "Currency",
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.original.status;
        return (
          <div
            className={`capitalize ${
              status === "approved"
                ? "text-green-500"
                : status === "rejected"
                ? "text-red-500"
                : "text-orange-400"
            }`}
          >
            {row.getValue("status")}
          </div>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: any }) => {
        const transaction = row.original;
        const isPending = transaction.status === "pending";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isPending && (
                <>
                  <DropdownMenuItem
                    onSelect={() => {
                      router.push(
                        `/dashboard/expenses/edit?id=${transaction._id}`
                      );
                    }}
                    className="cursor-pointer"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setItemToDelete(transaction);
                      setIsAlertOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
              {!isPending && (
                <DropdownMenuItem disabled>
                  <span className="text-muted-foreground">
                    No actions available
                  </span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full p-4 bg-white rounded shadow-sm">
      <div className="flex items-center justify-between py-4 gap-4">
        <Input
          placeholder="Search Client..."
          value={String(table.getColumn("client.name")?.getFilterValue() ?? "")}
          onChange={(event) => {
            table.getColumn("client.name")?.setFilterValue(event.target.value);
          }}
          className="w-[300px] rounded border border-gray-300"
        />
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this transaction?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

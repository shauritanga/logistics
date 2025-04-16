"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { Calendar, Search, X, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { BillOfLading } from "@/types";
import { getAllBilOfLanding } from "@/actions/bil";
import { useRouter } from "next/navigation";
type DateFilter = "all" | "7days" | "30days" | "60days" | "90days";

export default function BillsOfLading() {
  const [searchParams, setSearchParams] = useState({
    bolNumber: "",
    shipper: "",
    consignee: "",
  });
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [bols, setBols] = useState<BillOfLading[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getBols = async () => {
      const bols = await getAllBilOfLanding();
      setBols(bols);
    };
    getBols();
  }, []);

  if (bols.length === 0) {
    return <div className="flex items-center justify-center">Loading...</div>;
  }

  const handleView = (id: string) => {
    router.push(`/dashboard/manage-bols/${id}`);
  };

  const handleEdit = (id: string) => {
    // Implement edit logic
  };

  const handleDelete = (id: string) => {
    // Implement delete logic
  };

  const getDateFilterLabel = (filter: DateFilter) => {
    switch (filter) {
      case "7days":
        return "Last 7 Days";
      case "30days":
        return "Last 30 Days";
      case "60days":
        return "Last 60 Days";
      case "90days":
        return "Last 90 Days";
      default:
        return "All Time";
    }
  };

  const filteredData = bols.filter((bill) => {
    const matchesBOL = bill.bolNumber
      .toLowerCase()
      .includes(searchParams.bolNumber.toLowerCase());
    const matchesShipper = bill.shipper.name
      .toLowerCase()
      .includes(searchParams.shipper.toLowerCase());
    const matchesConsignee = bill.consignee.name
      .toLowerCase()
      .includes(searchParams.consignee.toLowerCase());
    let matchesDate = true;
    if (dateFilter !== "all") {
      const days = parseInt(dateFilter);
      const filterDate = subDays(new Date(), days);
      matchesDate = bill.arrivalDate >= filterDate;
    }

    return matchesBOL && matchesShipper && matchesConsignee && matchesDate;
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Bills of Lading</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Input
            placeholder="Search by BOL Number"
            value={searchParams.bolNumber}
            onChange={(e) =>
              setSearchParams({ ...searchParams, bolNumber: e.target.value })
            }
            className="pl-8"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          {searchParams.bolNumber && (
            <Button
              variant="ghost"
              className="absolute right-1 top-1.5 h-7 w-7 p-0"
              onClick={() =>
                setSearchParams({ ...searchParams, bolNumber: "" })
              }
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="relative">
          <Input
            placeholder="Search by Shipper"
            value={searchParams.shipper}
            onChange={(e) =>
              setSearchParams({ ...searchParams, shipper: e.target.value })
            }
            className="pl-8"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          {searchParams.shipper && (
            <Button
              variant="ghost"
              className="absolute right-1 top-1.5 h-7 w-7 p-0"
              onClick={() => setSearchParams({ ...searchParams, shipper: "" })}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="relative">
          <Input
            placeholder="Search by Consignee"
            value={searchParams.consignee}
            onChange={(e) =>
              setSearchParams({ ...searchParams, consignee: e.target.value })
            }
            className="pl-8"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          {searchParams.consignee && (
            <Button
              variant="ghost"
              className="absolute right-1 top-1.5 h-7 w-7 p-0"
              onClick={() =>
                setSearchParams({ ...searchParams, consignee: "" })
              }
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {getDateFilterLabel(dateFilter)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => setDateFilter("all")}>
              All Time
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDateFilter("7days")}>
              Last 7 Days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDateFilter("30days")}>
              Last 30 Days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDateFilter("60days")}>
              Last 60 Days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDateFilter("90days")}>
              Last 90 Days
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>BOL Number</TableHead>
              <TableHead>Shipper</TableHead>
              <TableHead>Consignee</TableHead>
              <TableHead>Port of Loading</TableHead>
              <TableHead>Port of Discharge</TableHead>
              <TableHead>Arrival Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((bill) => (
              <TableRow key={bill._id}>
                <TableCell className="font-medium">{bill.bolNumber}</TableCell>
                <TableCell>{bill.shipper.name}</TableCell>
                <TableCell>{bill.consignee.name}</TableCell>
                <TableCell>{bill.portOfLoading}</TableCell>
                <TableCell>{bill.portOfDischarge}</TableCell>
                <TableCell>
                  {format(new Date(bill.arrivalDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        bill.releasedDate
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {bill.releasedDate ? "Released" : "Pending"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleView(bill._id)}
                        className="cursor-pointer"
                      >
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEdit(bill._id)}
                        className="cursor-pointer"
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDelete(bill._id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

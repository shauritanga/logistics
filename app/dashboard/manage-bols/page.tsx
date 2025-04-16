"use client";

import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
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

export default function BillsOfLading() {
  const [searchParams, setSearchParams] = useState({
    bolNumber: "",
    shipper: "",
    consignee: "",
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
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
    console.log("View bill:", id);
  };

  const handleEdit = (id: string) => {
    // Implement edit logic
    console.log("Edit bill:", id);
  };

  const handleDelete = (id: string) => {
    // Implement delete logic
    console.log("Delete bill:", id);
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
    const matchesDate =
      !dateRange?.from ||
      !dateRange?.to ||
      (bill.arrivalDate >= dateRange.from && bill.arrivalDate <= dateRange.to);

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

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                !dateRange && "text-muted-foreground"
              }`}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
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

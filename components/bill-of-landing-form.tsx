"use client";
import React, { useActionState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import submitBill from "@/actions/create-bill";
import { ActionResponse } from "@/types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toZonedTime } from "date-fns-tz";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export default function BillOfLandingForm() {
  const [date, setDate] = React.useState<Date>();
  const [consignee, setConsignee] = React.useState("");
  const [shipping, setShipping] = React.useState("");
  const [state, action, isPending] = useActionState(submitBill, initialState);

  const formData = new FormData();
  const now = new Date();
  date
    ? date.setHours(
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
      )
    : "";

  // Specify your timezone (EAT)
  const timeZone = "Africa/Nairobi"; // East Africa Time Zone

  // Convert the date to the local time zone (EAT)
  const localDate = date ? toZonedTime(date, timeZone) : "";

  // Format the date in the local timezone
  const formattedDate = localDate
    ? format(localDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", {})
    : "";
  formData.set("dateIssued", formattedDate);

  return (
    <Card className="w-full mt-12">
      <CardHeader>
        <CardTitle>Bill of Landing</CardTitle>
        <CardDescription>
          Please enter bill of landing information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action}>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Bill of landing number</Label>
              <Input
                name="billOfLandingNumber"
                placeholder="GOSUQIN6498966"
                defaultValue={state?.inputs?.billOfLandingNumber}
                className={
                  state?.errors?.billOfLandingNumber ? "border-red-500" : ""
                }
              />
              {state.errors?.billOfLandingNumber && (
                <p
                  id="billOfLandingNumber-error"
                  className="text-sm text-red-500"
                >
                  {state.errors?.billOfLandingNumber[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Date Issued</Label>
              <input
                type="hidden"
                name="dateIssued"
                value={date ? format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX") : ""}
              />
              {/* Shadcn DatePicker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between",
                      state?.errors?.dateIssued ? "border-red-500" : ""
                    )}
                  >
                    {date ? format(date, "PPP") : "Pick a date"}
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="bg-gray-400 w-full">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
              {state.errors?.dateIssued && (
                <p id="dateIssued-error" className="text-sm text-red-500">
                  {state.errors?.dateIssued[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Shipping line</Label>
              <input type="hidden" name="shipping" value={shipping} />
              <Select
                name="shipping"
                defaultValue={state?.inputs?.shipping}
                onValueChange={(value) => setShipping(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent className="bg-gray-400">
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vessel name</Label>
              <Input />
            </div>
            <div className="space-y-2">
              <Label>Vessel ETA</Label>
              <Input />
            </div>
            <div className="space-y-2">
              <Label>Port of Loading</Label>
              <Input
                name="portOfLoading"
                className={state?.errors?.portOfLoading ? "border-red-500" : ""}
              />
              {state.errors?.portOfLoading && (
                <p id="portOfLoading-error" className="text-sm text-red-500">
                  {state.errors.portOfLoading[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Port of Discharge</Label>
              <Input
                name="portOfDischarge"
                className={state?.errors?.portOfLoading ? "border-red-500" : ""}
              />
              {state.errors?.portOfDischarge && (
                <p id="portOfDischarge-error" className="text-sm text-red-500">
                  {state.errors.portOfDischarge[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Place of Delivery</Label>
              <Input />
            </div>
            <div className="space-y-2">
              <div className="space-y-2">
                <Label>Date Issued</Label>
                <input
                  type="hidden"
                  name="dateIssued"
                  value={
                    date ? format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX") : ""
                  }
                />
                {/* Shadcn DatePicker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-between",
                        state?.errors?.dateIssued ? "border-red-500" : ""
                      )}
                    >
                      {date ? format(date, "PPP") : "Pick a date"}
                      <CalendarIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="bg-gray-400 w-full">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                    />
                  </PopoverContent>
                </Popover>
                {state.errors?.dateIssued && (
                  <p id="dateIssued-error" className="text-sm text-red-500">
                    {state.errors?.dateIssued[0]}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Client Name</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent className="bg-gray-400">
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Consignee</Label>
              <Select
                name="consignee"
                defaultValue={state?.inputs?.consignee}
                onValueChange={(value) => setConsignee(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent className="bg-gray-400">
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {state?.success ? (
            <div className="flex flex-col">
              <span>Success</span>
              <p>{state.message}</p>
            </div>
          ) : (
            ""
          )}
          <Button className="bg-[#f38633] rounded mt-12">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
}

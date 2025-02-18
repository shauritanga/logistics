"use client";
import React, { useActionState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { CalendarIcon, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export default function BillOfLandingForm() {
  const [date, setDate] = React.useState<Date>();
  const [releaseDate, setReleaseDate] = React.useState<Date>();
  const [consignee, setConsignee] = React.useState("");
  const [shipping, setShipping] = React.useState("");
  const [client, setClient] = React.useState("");
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
  const localReleasedDate = releaseDate
    ? toZonedTime(releaseDate, timeZone)
    : "";

  // Format the date in the local timezone
  const formattedDate = localDate
    ? format(localDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", {})
    : "";
  const formattedReleasedDate = localReleasedDate
    ? format(localReleasedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", {})
    : "";
  formData.set("dateIssued", formattedDate);
  formData.set("releasedDate", formattedReleasedDate);

  return (
    <Card className="w-full mt-12 text-black dark:text-white ">
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
                <SelectTrigger
                  className={cn(
                    "w-full",
                    state?.errors?.shipping ? "border-red-500" : ""
                  )}
                >
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
              {state.errors?.shipping && (
                <p id="shipping-error" className="text-sm text-red-500">
                  {state.errors?.shipping[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Vessel name</Label>
              <Input
                name="vessleName"
                className={state?.errors?.portOfLoading ? "border-red-500" : ""}
              />
              {state.errors?.vessleName && (
                <p id="vessleName-error" className="text-sm text-red-500">
                  {state.errors.vessleName[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Port of Loading</Label>
              <Input
                name="portOfLoading"
                defaultValue={state?.inputs?.portOfLoading}
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
                defaultValue={state?.inputs?.portOfDischarge}
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
              <Input
                name="placeOfDelivery"
                defaultValue={state?.inputs?.pplaceOfDelivery}
                className={state?.errors?.portOfLoading ? "border-red-500" : ""}
              />
              {state.errors?.placeOfDelivery && (
                <p id="placeOfDelivery-error" className="text-sm text-red-500">
                  {state.errors.placeOfDelivery[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="space-y-2">
                <Label>Release Date</Label>
                <input
                  type="hidden"
                  name="releasedDate"
                  value={
                    releaseDate
                      ? format(releaseDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
                      : ""
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
                      {releaseDate ? format(releaseDate, "PPP") : "Pick a date"}
                      <CalendarIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="bg-gray-400 w-full">
                    <Calendar
                      mode="single"
                      selected={releaseDate}
                      onSelect={setReleaseDate}
                    />
                  </PopoverContent>
                </Popover>
                {state.errors?.releasedDate && (
                  <p id="releasedDate-error" className="text-sm text-red-500">
                    {state.errors?.releasedDate[0]}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Client Name</Label>
              <input type="hidden" name="client" value={client} />
              <Select
                name="client"
                defaultValue={state?.inputs?.client}
                onValueChange={(value) => setClient(value)}
              >
                <SelectTrigger
                  className={cn(
                    "w-full",
                    state?.errors?.client ? "border-red-500" : ""
                  )}
                >
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
              {state.errors?.client && (
                <p id="client-error" className="text-sm text-red-500">
                  {state.errors?.client[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Consignee</Label>
              <input type="hidden" name="shipping" value={consignee} />
              <Select
                name="consignee"
                defaultValue={state?.inputs?.consignee}
                onValueChange={(value) => setConsignee(value)}
              >
                <SelectTrigger
                  className={cn(
                    "w-full",
                    state?.errors?.consignee ? "border-red-500" : ""
                  )}
                >
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
              {state.errors?.consignee && (
                <p id="consignee-error" className="text-sm text-red-500">
                  {state.errors?.consignee[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Insurance</Label>
              <Input
                name="insurance"
                defaultValue={state?.inputs?.insurance}
                className={state?.errors?.portOfLoading ? "border-red-500" : ""}
              />
              {state.errors?.insurance && (
                <p id="insurance-error" className="text-sm text-red-500">
                  {state.errors.insurance[0]}
                </p>
              )}
            </div>
          </div>
          {state?.success ? (
            <div className="flex flex-col mt-6">
              <span className="flex gap-2">
                <CircleCheck className="text-green-500" />
                Success
              </span>
              <p className="text-muted italic">{state.message}</p>
            </div>
          ) : (
            ""
          )}
          <Button className="bg-[#f38633] rounded mt-12">
            {isPending ? "Submiting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

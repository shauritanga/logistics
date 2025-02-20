"use client";
import React, { useActionState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { submitBill } from "@/actions/bil";
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
import { CalendarIcon, CircleCheck, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Client {
  _id: string;
  name: string;
  district: string;
  region: string;
  street: string;
  country: string;
  email: string;
  phone: string;
}

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export default function BillOfLandingForm({ clients }: { clients: Client[] }) {
  const [date, setDate] = React.useState<Date>();
  const [releaseDate, setReleaseDate] = React.useState<Date>();
  const [consignee, setConsignee] = React.useState("");
  const [shipper, setShipper] = React.useState("");
  const [client, setClient] = React.useState("");
  const [notifyParty, setNotifyParty] = React.useState("");
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
  formData.set("dateArrived", formattedDate);
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
              <Label>Arrival Date</Label>
              <input
                type="hidden"
                name="dateArrived"
                value={date ? format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX") : ""}
              />
              {/* Shadcn DatePicker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between",
                      state?.errors?.dateArrived ? "border-red-500" : ""
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
              {state.errors?.dateArrived && (
                <p id="dateArrived-error" className="text-sm text-red-500">
                  {state.errors.dateArrived[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Shipper</Label>
              <input type="hidden" name="shipper" value={shipper} />
              <Select
                name="shipper"
                defaultValue={state?.inputs?.shipper}
                onValueChange={(value) => setShipper(value)}
              >
                <SelectTrigger
                  className={cn(
                    "w-full",
                    state?.errors?.shipper ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="Select shipper" />
                </SelectTrigger>
                <SelectContent className="bg-gray-400">
                  {clients.map((client) => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.shipper && (
                <p id="shipper-error" className="text-sm text-red-500">
                  {state.errors?.shipper[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Shipping line</Label>
              <Input
                name="shippingLine"
                defaultValue={state?.inputs?.shippingLine}
                className={state?.errors?.shippingLine ? "border-red-500" : ""}
              />
              {state.errors?.shippingLine && (
                <p id="shippingLine-error" className="text-sm text-red-500">
                  {state.errors.shippingLine[0]}
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
                        state?.errors?.releasedDate ? "border-red-500" : ""
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
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent className="bg-gray-400">
                  {clients.map((client) => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.name}
                    </SelectItem>
                  ))}
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
                  <SelectValue placeholder="Select consignee" />
                </SelectTrigger>
                <SelectContent className="bg-gray-400">
                  {clients.map((client) => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.name}
                    </SelectItem>
                  ))}
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
            <div className="space-y-2">
              <Label>Notify</Label>
              <input type="hidden" name="notifyParty" value={notifyParty} />
              <Select
                name="notifyParty"
                defaultValue={state?.inputs?.notifyParty}
                onValueChange={(value) => setNotifyParty(value)}
              >
                <SelectTrigger
                  className={cn(
                    "w-full",
                    state?.errors?.consignee ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="Select notifier" />
                </SelectTrigger>
                <SelectContent className="bg-gray-400">
                  {clients.map((client) => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.notifyParty && (
                <p id="notifyParty-error" className="text-sm text-red-500">
                  {state.errors?.notifyParty[0]}
                </p>
              )}
            </div>
          </div>
          {state?.success ? (
            <div className="flex flex-col mt-6 bg-green-100 p-2 text-green-500 rounded">
              <p className="text-muted italic">{state.message}</p>
            </div>
          ) : (
            state.message && (
              <div className="flex flex-col mt-6 bg-red-100 p-2 text-red-500 rounded">
                <p className="text-muted italic">{state.message}</p>
              </div>
            )
          )}
          <Button className="bg-[#f38633] rounded mt-12">
            {isPending ? "Submiting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

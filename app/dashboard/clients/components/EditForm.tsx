"use client";

import { useState } from "react";
import { useActionState } from "react";
import { updateClient } from "@/actions/Client"; // Assuming this action exists
import { ActionResponse } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Client } from "./ClientTable";

interface EditClientFormProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditClientForm({
  isOpen,
  onClose,
  client,
}: EditClientFormProps) {
  const [formData, setFormData] = useState({
    name: client.name || "",
    email: client.email || "",
    phone: client.phone || "",
    streetAddress: client.streetAddress || "",
    district: client.district || "",
    region: client.region || "",
    country: client.country || "",
    tin: client.tin || "",
    vat: client.vat || "",
  });

  const initialState: ActionResponse = { success: false, message: "" };
  const updateClientWrapper = async (
    state: ActionResponse,
    formData: FormData
  ): Promise<ActionResponse> => {
    return updateClient(client._id, formData);
  };

  const [state, action, isPending] = useActionState(
    updateClientWrapper,
    initialState
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClassName =
    "mt-1 p-2 w-full border border-gray-300 rounded shadow-sm";
  const labelClassName = "block text-sm font-medium text-gray-700";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-4 sm:p-6 bg-white dark:bg-black rounded-lg max-w-[90vw] sm:max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Edit Client</DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-2 sm:pr-4">
          <form action={action} className="space-y-4 sm:space-y-6">
            {/* Hidden ID field for update */}
            <input type="hidden" name="id" value={client._id} />

            {/* Basic Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-md font-medium text-gray-900">Basic Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="name" className={labelClassName}>
                    Name
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClassName}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className={labelClassName}>
                    Email
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClassName}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className={labelClassName}>
                    Phone
                  </Label>
                  <Input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-md font-medium text-gray-900">Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="streetAddress" className={labelClassName}>
                    Street
                  </Label>
                  <Input
                    type="text"
                    name="streetAddress"
                    id="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    placeholder="101 Elm Street"
                    className={`${inputClassName} placeholder:text-gray-400`}
                  />
                </div>
                <div>
                  <Label htmlFor="district" className={labelClassName}>
                    District
                  </Label>
                  <Input
                    type="text"
                    name="district"
                    id="district"
                    value={formData.district}
                    onChange={handleChange}
                    className={inputClassName}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="region" className={labelClassName}>
                    Region
                  </Label>
                  <Input
                    type="text"
                    name="region"
                    id="region"
                    value={formData.region}
                    onChange={handleChange}
                    className={inputClassName}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="country" className={labelClassName}>
                    Country
                  </Label>
                  <Input
                    type="text"
                    name="country"
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-md font-medium text-gray-900">Tax Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="tin" className={labelClassName}>
                    TIN
                  </Label>
                  <Input
                    type="text"
                    name="tin"
                    id="tin"
                    value={formData.tin}
                    onChange={handleChange}
                    placeholder="Optional"
                    className={`${inputClassName} placeholder:text-gray-400`}
                  />
                </div>
                <div>
                  <Label htmlFor="vat" className={labelClassName}>
                    VAT
                  </Label>
                  <Input
                    type="text"
                    name="vat"
                    id="vat"
                    value={formData.vat}
                    onChange={handleChange}
                    placeholder="Optional"
                    className={`${inputClassName} placeholder:text-gray-400`}
                  />
                </div>
              </div>
            </div>

            {/* Status and Submit */}
            {state?.message && (
              <div
                className={`mt-3 sm:mt-4 p-2 rounded ${
                  state.success
                    ? "bg-green-100 text-green-500"
                    : "bg-red-100 text-red-500"
                }`}
              >
                <p className="text-sm italic">{state.message}</p>
              </div>
            )}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full mt-3 sm:mt-4 inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-[#f38633] hover:bg-[#d4915e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f38633]"
            >
              {isPending ? "Updating..." : "Update Client"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

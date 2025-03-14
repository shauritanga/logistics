"use client";

import { useState, useEffect, useActionState } from "react";
import { createClient } from "@/actions/Client";
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
import { enqueueSnackbar } from "notistack";

export default function AddClientForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    streetAddress: "",
    district: "",
    region: "",
    country: "",
    tin: "",
    vat: "",
  });

  const initialState: ActionResponse = { success: false, message: "" };
  const [state, action, isPending] = useActionState(createClient, initialState);

  useEffect(() => {
    if (state.success) {
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        streetAddress: "",
        district: "",
        region: "",
        country: "",
        tin: "",
        vat: "",
      });
      enqueueSnackbar(state.message, { variant: "success" });
    }
    if (state.errors) {
      enqueueSnackbar(state.message, { variant: "error" });
    }
  }, [state.success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClassName =
    "mt-1 p-2 w-full border rounded shadow-sm bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-[#f38633] focus:border-[#f38633] dark:focus:border-[#f38633] placeholder:text-gray-400 dark:placeholder:text-gray-500";
  const labelClassName =
    "block text-sm font-medium text-gray-700 dark:text-gray-200";

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-[#f38633] hover:bg-[#d4915e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f38633] dark:focus:ring-offset-gray-900">
          Add Client
        </Button>
      </DialogTrigger>

      <DialogContent className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg max-w-[90vw] sm:max-w-3xl w-full border border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">
            Add New Client
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-2 sm:pr-4">
          <form action={action} className="space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">
                Basic Info
              </h3>
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
              <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">
                Address
              </h3>
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
              <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">
                Tax Info
              </h3>
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

            <Button
              type="submit"
              disabled={isPending}
              className="w-full mt-3 sm:mt-4 inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-[#f38633] hover:bg-[#d4915e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f38633] dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Adding..." : "Add Client"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

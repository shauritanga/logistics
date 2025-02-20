"use client";
import { createClient } from "@/actions/Client";
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
import { useActionState, useState } from "react";

export default function AddClientForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    district: "",
    region: "",
    street: "",
    country: "",
    email: "",
    phone: "",
  });

  const initialState = {
    success: false,
    message: "",
  };

  const [state, action, isPending] = useActionState(createClient, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-[#f38633] hover:bg-[#d4915e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f38633]">
            Add Client
          </Button>
        </DialogTrigger>

        <DialogContent className="p-4 bg-white dark:bg-black rounded-lg">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <form action={action} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <Input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700"
              >
                District
              </label>
              <Input
                type="text"
                name="district"
                id="district"
                value={formData.district}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="region"
                className="block text-sm font-medium text-gray-700"
              >
                Region
              </Label>
              <Input
                type="text"
                name="region"
                id="region"
                value={formData.region}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700"
              >
                Street
              </Label>
              <Input
                type="text"
                name="street"
                id="street"
                value={formData.street}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm"
              />
            </div>
            <div>
              <Label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </Label>
              <Input
                type="text"
                name="country"
                id="country"
                value={formData.country}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm"
              />
            </div>
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone
              </Label>
              <Input
                type="text"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1  p-2 w-full border border-gray-300 rounded shadow-sm"
              />
            </div>
            {state?.success ? (
              <div className="flex flex-col mt-6 bg-green-100 p-2 text-green-500 rounded">
                <p className="text-muted italic">{state.message}</p>
              </div>
            ) : (
              state?.message && (
                <div className="flex flex-col mt-6 bg-red-100 p-2 text-red-500 rounded">
                  <p className="text-muted italic">{state.message}</p>
                </div>
              )
            )}
            <Button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-[#f38633] hover:bg-[#d4915e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f38633]"
            >
              {isPending ? "Adding..." : "Add Client"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React, { useState, useEffect, useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Client } from "./ClientTable";
import { ActionResponse } from "@/types";
import { updateClient } from "@/actions/Client";

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

const EditClientModal: React.FC<EditClientModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  const [formData, setFormData] = useState<Client>(client);
  const [state, setState] = useState({ success: false, message: "" });

  useEffect(() => {
    setFormData(client);
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSubmit.append(key, formData[key as keyof Client] as string);
    });
    try {
      const result = await updateClient(client._id, formDataToSubmit);
      console.log("Updated client:", formData);
      setState(result);
    } catch (error: any) {
      setState({ success: false, message: error.message });
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-5">
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
                required
              />
            </div>
            <div>
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-700"
              >
                Region
              </label>
              <Input
                type="text"
                name="region"
                id="region"
                value={formData.region}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700"
              >
                Street
              </label>
              <Input
                type="text"
                name="street"
                id="street"
                value={formData.street}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <Input
                type="text"
                name="country"
                id="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <Input
                type="text"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#f38633] hover:bg-[#d4915e] text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;

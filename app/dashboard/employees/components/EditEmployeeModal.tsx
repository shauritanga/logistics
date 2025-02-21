"use client";
import React, { useActionState, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { updateEmployee } from "@/actions/user";
import { ActionResponse } from "@/types";
import { Input } from "@/components/ui/input";
import getRoles from "@/actions/getRoles";
import { Button } from "@/components/ui/button";
import { Employee } from "./EmployeeTable";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
}

export default function EditEmployeeModal({
  isOpen,
  onClose,
  employee,
}: EditEmployeeModalProps) {
  const [formData, setFormData] = useState<Employee>(employee);
  const [roles, setRoles] = useState<{ _id: string; name: string }[]>([]);
  const [state, setState] = useState({ success: false, message: "" });

  useEffect(() => {
    const fetchRoles = async () => {
      const fetchedRoles = await getRoles();
      setRoles(fetchedRoles || []);
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    setFormData(employee);
  }, [employee]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSubmit.append(key, formData[key as keyof Employee] as string);
    });
    try {
      const result = await updateEmployee(employee._id, formDataToSubmit);
      setState(result);
    } catch (error: any) {
      setState({ success: false, message: error.message });
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-4 bg-white dark:bg-black rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-black bg-white p-4 rounded-lg"
        >
          <div className="mb-4">
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Position"
              required
              className="p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role._id} value={role.name}>
                  {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                </option>
              ))}
            </select>
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
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

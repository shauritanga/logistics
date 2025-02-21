"use client";
import { useActionState, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { createEmployee } from "@/actions/user";
import { ActionResponse } from "@/types";
import { Input } from "@/components/ui/input";
import getRoles from "@/actions/getRoles";
import { Button } from "@/components/ui/button";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export default function EmployeeModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
    role: "",
  });
  const [roles, setRoles] = useState<{ _id: string; name: string }[]>([]);
  const [state, action, isPending] = useActionState(
    createEmployee,
    initialState
  );
  useEffect(() => {
    const fetchRoles = async () => {
      const fetchedRoles = await getRoles();
      setRoles(fetchedRoles || []);
    };
    fetchRoles();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#f38633] hover:bg-[#d4915e] text-white rounded">
            Create New Employee
          </Button>
        </DialogTrigger>

        <DialogContent className="p-4 bg-white dark:bg-black rounded-lg">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <form
            action={action}
            className="space-y-4 text-black bg-white p-4 rounded-lg"
          >
            <h1 className="text-2xl font-bold mb-4 text-center">
              Employee Information
            </h1>
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
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
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
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

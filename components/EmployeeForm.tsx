import React, { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createEmployee } from "@/actions/user";
import { ActionResponse } from "@/types";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

const EmployeeForm = ({ onClose }: { onClose: any }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
    role: "", // admin, accounting, marketing, sales, research
  });

  const roles = ["admin", "accounting", "marketing", "sales", "research"];
  const [state, action, isPending] = useActionState(
    createEmployee,
    initialState
  );

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
          {roles.map((role, index) => (
            <option key={index} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
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
  );
};

export default EmployeeForm;

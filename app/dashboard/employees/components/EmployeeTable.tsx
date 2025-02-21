"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaEdit, FaTrash } from "react-icons/fa"; // Assuming you have an EditEmployeeModal component
import EditEmployeeModal from "./EditEmployeeModal";
import { deleteEmployee } from "@/actions/user";

export interface Employee {
  _id: string;
  name: string;
  role: string;
  email: string;
  position: string;
}

export default function EmployeeTable({
  employees,
}: {
  employees: Employee[];
}) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (employeeId: string) => {
    await deleteEmployee(employeeId);
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full text-black dark:text-white bg-white dark:bg-gray-800">
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-3 border-b border-gray-200 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Name
            </TableHead>
            <TableHead className="px-6 py-3 border-b border-gray-200 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Email
            </TableHead>
            <TableHead className="px-6 py-3 border-b border-gray-200 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Position
            </TableHead>
            <TableHead className="px-6 py-3 border-b border-gray-200 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Role
            </TableHead>
            <TableHead className="px-6 py-3 border-b border-gray-200 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee._id}>
              <TableCell className="px-6 py-4 whitespace-nowrap border-b border-gray-200 dark:border-gray-700">
                {employee.name}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap border-b border-gray-200 dark:border-gray-700">
                {employee.email}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap border-b border-gray-200 dark:border-gray-700">
                {employee.position}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap border-b border-gray-200 dark:border-gray-700">
                {employee.role}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap border-b border-gray-200 dark:border-gray-700 text-sm font-medium">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <FaEdit className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => handleEdit(employee)}>
                      <FaEdit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleDelete(employee._id)}
                      className="text-red-500"
                    >
                      <FaTrash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedEmployee && (
        <EditEmployeeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          employee={selectedEmployee}
        />
      )}
    </div>
  );
}

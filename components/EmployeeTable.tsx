"use client";
import Link from "next/link";

export default function EmployeeTable({ employees }: { employees: any[] }) {
  return (
    <table className="min-w-full text-black dark:text-white bg-white border border-gray-300">
      <thead>
        <tr>
          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Email
          </th>
          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Position
          </th>
          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Role
          </th>
          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee._id}>
            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              {employee.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              {employee.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              {employee.position}
            </td>
            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              {employee.role}
            </td>
            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm font-medium">
              <Link
                href={`/edit-employee/${employee.id}`}
                className="text-indigo-600 hover:text-indigo-900 mr-2"
              >
                Edit
              </Link>
              <button
                onClick={() => console.log(`Delete ${employee.id}`)}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

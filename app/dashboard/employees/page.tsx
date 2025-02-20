import { readEmployees } from "@/actions/user";
import EmployeeModal from "@/components/employee-modal-form";
import EmployeeTable from "@/components/EmployeeTable";

const employees = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    position: "Software Engineer",
    role: "admin",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    position: "Marketing Manager",
    role: "marketing",
  },
  // Add more dummy data as needed
];

export default async function EmployeesPage() {
  const employees = await readEmployees();
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-end">
        <EmployeeModal />
      </div>

      <div className="overflow-x-auto">
        <EmployeeTable employees={employees} />
      </div>
    </div>
  );
}

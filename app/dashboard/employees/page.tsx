import { readEmployees } from "@/actions/user";
import EmployeeModal from "./components/EmloyeeModalForm";
import EmployeeTable from "./components/EmployeeTable";

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

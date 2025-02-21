import { readEmployees } from "@/actions/user";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeModal from "./components/EmployeeModalForm";

export default async function EmployeesPage() {
  const employees = await readEmployees();

  return (
    <div className="">
      <div className="mb-4 flex justify-end">
        <EmployeeModal />
      </div>

      <div className="overflow-x-auto">
        <EmployeeTable employees={employees} />
      </div>
    </div>
  );
}

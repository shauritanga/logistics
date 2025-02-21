import getRoles from "@/actions/getRoles";
import RoleForm from "@/components/RoleForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaCheck, FaTimes } from "react-icons/fa";

export const dynamic = "force-dynamic";

export default async function Role() {
  const roles = await getRoles();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end mb-12">
        <RoleForm />
      </div>
      <div className="overflow-x-auto text-black dark:text-white">
        <Table className="min-w-full bg-white dark:bg-gray-800 shadow-md">
          <TableHeader>
            <TableRow>
              <TableHead className="py-2 px-4 border-b">Role</TableHead>
              <TableHead className="py-2 px-4 border-b">Resource</TableHead>
              <TableHead className="py-2 px-4 border-b">Create</TableHead>
              <TableHead className="py-2 px-4 border-b">Read</TableHead>
              <TableHead className="py-2 px-4 border-b">Update</TableHead>
              <TableHead className="py-2 px-4 border-b">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role: any) => {
              const resources: string[] = Object.keys(role.permissions);
              console.log({ resources });
              return resources.map((resource: string, index: number) => (
                <TableRow key={`${role.name}-${resource}`}>
                  {index === 0 && (
                    <TableCell
                      className="py-2 px-4 border-b"
                      rowSpan={resources.length}
                    >
                      {role.name}
                    </TableCell>
                  )}
                  <TableCell className="py-2 px-4 border-b">
                    {resource}
                  </TableCell>
                  <TableCell className="py-2 px-4 border-b">
                    {role.permissions[resource]?.create ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell className="py-2 px-4 border-b">
                    {role.permissions[resource]?.read ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell className="py-2 px-4 border-b">
                    {role.permissions[resource]?.update ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell className="py-2 px-4 border-b">
                    {role.permissions[resource]?.delete ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </TableCell>
                </TableRow>
              ));
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import EmployeeForm from "./EmployeeForm";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function EmployeeModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#f38633]">Create New Employee</Button>
        </DialogTrigger>

        <DialogContent className="p-4 bg-white dark:bg-black rounded-lg">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <EmployeeForm onClose={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

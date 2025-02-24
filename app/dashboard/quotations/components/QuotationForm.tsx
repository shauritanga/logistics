"use client";

import { useActionState, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createQuotation } from "@/actions/quotation";

// Define validation schema with Zod
const formSchema = z.object({
  quotationNumber: z.string().min(1, "Quotation number is required"),
  client: z.string().min(1, "Client name is required"),
  validUntil: z.string().min(1, "Valid until date is required"),
  cargoDescription: z.string().min(1, "Cargo description is required"),
  cargoWeight: z.number().min(0, "Weight must be a positive number"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  freightCharges: z
    .number()
    .min(0, "Freight charges must be non-negative")
    .optional(),
  customsFees: z
    .number()
    .min(0, "Customs fees must be non-negative")
    .optional(),
  totalCost: z.number().min(0, "Total cost is required"),
  transportMode: z.enum(["air", "sea", "road", "rail"]).optional(),
});

const initialState = { success: false, message: "" };

export default function QuotationForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [state, formAction, isPending] = useActionState(
    async (state: typeof initialState, formData: any) => {
      const response = await createQuotation(formData);
      return response;
    },
    initialState
  );
  const [open, setOpen] = useState(false);

  // Initialize form with React Hook Form and Zod
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quotationNumber: "",
      client: "",
      validUntil: "",
      cargoDescription: "",
      cargoWeight: 0,
      origin: "",
      destination: "",
      freightCharges: 0,
      customsFees: 0,
      totalCost: 0,
      transportMode: "sea",
    },
  });

  // Handle form submission feedback
  useEffect(() => {
    if (state.success) {
      enqueueSnackbar(state.message || "Quotation created successfully", {
        variant: "success",
      });
      form.reset(); // Reset form on success
      setOpen(false); // Close dialog
    } else if (state.message) {
      enqueueSnackbar(state.message, { variant: "error" });
    }
  }, [state, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#f38633] hover:bg-[#d4915e] rounded text-white font-semibold">
          Create Quotation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold   dark:text-white">
            New Quotation
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction} className="space-y-6 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quotationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quotation Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="QTN-2025-001"
                        {...field}
                        className="border-gray-300 dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ABC Corp"
                        {...field}
                        className="border-gray-300 dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="validUntil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid Until</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="border-gray-300 dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cargoDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Electronics"
                        {...field}
                        className="border-gray-300 dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="cargoWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Shanghai, China"
                        {...field}
                        className="border-gray-300 dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Los Angeles, USA"
                        {...field}
                        className="border-gray-300 dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="transportMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transport Mode</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300 dark:border-gray-700">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="air">Air</SelectItem>
                      <SelectItem value="sea">Sea</SelectItem>
                      <SelectItem value="road">Road</SelectItem>
                      <SelectItem value="rail">Rail</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="freightCharges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Freight Charges ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2000"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        className="border-gray-300 dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customsFees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customs Fees ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="500"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        className="border-gray-300 dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="totalCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Cost ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2500"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold"
            >
              {isPending ? "Submitting..." : "Submit Quotation"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

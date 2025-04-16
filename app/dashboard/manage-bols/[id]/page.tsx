"use client";

import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Package, Truck, Ship, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BillOfLading } from "@/types";
import { useEffect, useState } from "react";
import { getBillOfLandingById } from "@/actions/bil";

// Mock data - replace with actual API call

export default function BillDetails() {
  const [bill, setBill] = useState<BillOfLading>();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const getBill = async () => {
      const bill = await getBillOfLandingById(params.id as string);
      setBill(bill as BillOfLading);
    };

    getBill();
  }, []);

  if (!bill) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Bill of Lading not found</h1>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bills
          </Button>
          <h1 className="text-3xl font-bold mt-4">Bill of Lading Details</h1>
          <p className="text-muted-foreground">BOL Number: {bill.bolNumber}</p>
        </div>
        <div>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              bill.releasedDate
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {bill.releasedDate ? "Released" : "Pending"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
            <CardDescription>Details about the shipment route</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Ship className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium">Vessel</p>
                  <p className="text-sm text-muted-foreground">
                    {bill.vessleName} ({bill.shippingLine})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Order: {bill.shippingOrder}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start space-x-4">
                <Truck className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium">Route</p>
                  <p className="text-sm text-muted-foreground">
                    From: {bill.portOfLoading}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    To: {bill.portOfDischarge}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Delivery: {bill.deliveryPlace}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parties</CardTitle>
            <CardDescription>
              Information about involved parties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Shipper</p>
                <p className="text-sm text-muted-foreground">
                  {bill.shipper.name}
                </p>
              </div>
              <Separator />
              <div>
                <p className="font-medium">Consignee</p>
                <p className="text-sm text-muted-foreground">
                  {bill.consignee.name}
                </p>
              </div>
              <Separator />
              <div>
                <p className="font-medium">Notify Party</p>
                <p className="text-sm text-muted-foreground">
                  {bill.notifyParty.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Containers & Goods</CardTitle>
            <CardDescription>Cargo details and specifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {bill.containers.map((container) => (
                <div key={container.containerNumber} className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Package className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">
                        Container: {container.containerNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tare Weight: {container.tareWeight} kg
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Gross Weight: {container.grossWeight} kg
                      </p>
                    </div>
                  </div>
                  <div className="pl-9">
                    <p className="font-medium mb-2">Goods</p>
                    {bill.goods
                      .filter(
                        (good) =>
                          good.containerReference === container.containerNumber
                      )
                      .map((good, index) => (
                        <div
                          key={index}
                          className="text-sm text-muted-foreground mb-2"
                        >
                          <p>{good.description}</p>
                          <p>
                            Quantity: {good.quantity} | Weight: {good.weight} kg
                          </p>
                          {good.value && (
                            <p>Value: {good.value.toLocaleString()} USD</p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
            <CardDescription>Charges and payment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium">Freight Charges</p>
                  <p className="text-sm text-muted-foreground">
                    {bill.freightCharges.amount.toLocaleString()}{" "}
                    {bill.freightCharges.currency}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start space-x-4">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium">Insurance</p>
                  <p className="text-sm text-muted-foreground">
                    {bill.insurance.amount.toLocaleString()}{" "}
                    {bill.insurance.currency}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="font-medium">Terms</p>
                <p className="text-sm text-muted-foreground">
                  {bill.term.code} {bill.term.place}
                </p>
              </div>
              <Separator />
              <div>
                {/* <p className="font-medium">Port Invoice</p> */}
                {/* <p className="text-sm text-muted-foreground">
                  Invoice Number: {bill.portInvoice.invoiceNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  Amount: {bill.portInvoice.amount.toLocaleString()}{" "}
                  {bill.portInvoice.currency}
                </p>
                <p className="text-sm text-muted-foreground">
                  Date:{" "}
                  {format(new Date(bill.portInvoice.date), "MMM dd, yyyy")}
                </p> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

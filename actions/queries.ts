"use server";

import dbConnect from "@/lib/mongodb";
import BillOfLanding from "@/models/BillOfLanding";
import Invoice from "@/models/Invoice";
import Transaction from "@/models/Transaction";

export async function getTotalBillOfLanding() {
  try {
    await dbConnect();
    const totalBilOfLanding = await BillOfLanding.countDocuments().exec();
    return totalBilOfLanding;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

export async function getUnpaidInvoice() {
  try {
    await dbConnect();
    const unpaidInvoices = await Invoice.find({
      status: { $nin: ["draft", "paid", "canceled"] },
    }).exec();
    return unpaidInvoices.length;
  } catch (error) {
    return 0;
  }
}

export async function getTotalExpenses() {
  try {
    await dbConnect();
    const expenses = await Transaction.aggregate([
      { $match: { category: "expenses" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).exec();
    return expenses.length > 0 ? expenses[0].total : 0;
  } catch (error) {
    console.error("Error fetching total expenses:", error);
    return 0;
  }
}

export async function getPaidInvoices() {
  try {
    await dbConnect();
    const expenses = await Invoice.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]).exec();
    return expenses.length > 0 ? expenses[0].total : 0;
  } catch (error) {
    console.error("Error fetching total expenses:", error);
    return 0;
  }
}

export async function getMonthlyBillOfLanding() {
  try {
    await dbConnect();
    const billOfLandingData = await BillOfLanding.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]).exec();

    const monthlyData = Array.from({ length: 12 }, (_, index) => ({
      month: new Date(0, index).toLocaleString("en-US", { month: "long" }),
      containers: 0,
    }));

    billOfLandingData.forEach((item) => {
      monthlyData[item._id - 1].containers = item.count;
    });

    return monthlyData;
  } catch (error) {
    console.error("Error fetching monthly Bill of Landing data:", error);
    return [];
  }
}

export async function getRecentBillOfLanding() {
  try {
    await dbConnect();
    const recentBillOfLanding = await BillOfLanding.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate(["shipper", "consignee", "notifyParty"])
      .exec();
    return JSON.parse(JSON.stringify(recentBillOfLanding));
  } catch (error) {
    console.error("Error fetching recent Bill of Landing data:", error);
    return [];
  }
}

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Transaction } from "@/models";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client, amount, currency, description, category, status } = body;

    // Validate required fields
    if (
      !client ||
      !amount ||
      !currency ||
      !description ||
      !category ||
      !status
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Create new expense
    const expense = await Transaction.create({
      client,
      amount,
      currency,
      description,
      category,
      status,
      transactionDate: new Date(),
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../lib/config/db";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await ConnectDB(); // Ensure DB connection

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    // Build query dynamically
    let matchStage = {};

    if (!search) {
      return NextResponse.json({ error: "Building or Classroom is required" }, { status: 400 });
    }
    else if (search.includes("-")){
      matchStage["location"] = search;
    }
    else {
      matchStage["building"] = search;
    }

    const db = mongoose.connection.db;
    const collection = db.collection("coursesSpring2025");

    // MongoDB Query
    const pipeline = [{ "$match": matchStage }];

    const results = await collection.aggregate(pipeline).toArray();

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../lib/config/db";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await ConnectDB(); // Ensure DB connection

    const { searchParams } = new URL(request.url);
    const building = searchParams.get("building");
    const location = searchParams.get("location"); // Classroom (e.g., "COB-140")
    const day = searchParams.get("day");
    const time = searchParams.get("time"); // Format: "HH:MM"

    console.log("🔹 Query Params:", { building, location, day, time });

    if (!building && !location) {
      return NextResponse.json({ error: "Building or Classroom is required" }, { status: 400 });
    }

    const db = mongoose.connection.db;
    const collection = db.collection("coursesSpring2025");

    // Build query dynamically
    let matchStage = {};

    if (building) matchStage["building"] = building;
    if (location) matchStage["location"] = location;
    if (day) matchStage["days"] = day;
    if (day && time) {
      matchStage["startTime"] = { "$lte": time };
      matchStage["endTime"] = { "$gt": time };
    }

    // MongoDB Query
    const pipeline = [{ "$match": matchStage }];

    const results = await collection.aggregate(pipeline).toArray();

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

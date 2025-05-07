import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../lib/config/db";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await ConnectDB(); // Ensure DB connection

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const time = searchParams.get("time"); // Get the time parameter
    const date = searchParams.get("date"); // Get the date parameter

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

    // Add time filtering if the 'time' parameter is provided
    if (time) {
      // Validate time format (basic HH:MM check)
      if (!/^\d{2}:\d{2}$/.test(time)) {
        return NextResponse.json({ error: "Invalid time format. Use HH:MM." }, { status: 400 });
      }
      // Add time condition to the match stage
      // Assumes time is stored in an array field named 'time' like ["startTime", "endTime"]
      // and filters courses where the provided time falls within the start and end time.
      // Also excludes courses with "NA" times.
      matchStage["$expr"] = {
        $and: [
          { $ne: ["$startTime", "NA"] }, // Ensure startTime is not "NA"
          { $ne: ["$endTime", "NA"] },   // Ensure endTime is not "NA"
          { $lte: ["$startTime", time] }, // startTime <= providedTime
          { $gt: ["$endTime", time] }     // endTime > providedTime
        ]
      };
    }

    // Add date filtering if the 'date' parameter is provided
    if (date) {
      // Validate date format (basic YYYY-MM-DD check)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
      }

      try {
        // Get the day of the week (0=Sun, 1=Mon, ..., 6=Sat)
        // Important: Date constructor parses YYYY-MM-DD as UTC. Use UTC methods to avoid timezone issues.
        const dateObj = new Date(`${date}T00:00:00Z`); // Treat date as UTC midnight
        const dayOfWeek = dateObj.getUTCDay();

        // Map day number to character (Using 'Th' for Thursday)
        const dayMap = { 1: 'M', 2: 'T', 3: 'W', 4: 'Th', 5: 'F' }; // 0=Sun, 6=Sat ignored
        const dayChar = dayMap[dayOfWeek];

        if (dayChar) {
          // Add regex condition to check if the 'days' field contains the day character
          // Case-insensitive match just in case
          matchStage["days"] = { $regex: new RegExp(dayChar, 'i') };
        } else {
          // Handle weekend or invalid day if necessary, or just don't filter
          // console.log(`Date ${date} is a weekend or unmapped day.`);
        }
      } catch (e) {
        console.error("Error processing date:", e);
        return NextResponse.json({ error: "Invalid date value." }, { status: 400 });
      }
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

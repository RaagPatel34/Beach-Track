import favoriteModel from "../../../../lib/models/favoriteModel";
import { ConnectDB } from "../../../../lib/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { userId } = getAuth(req);

    if (!userId) return NextResponse.json({ error: "Unauthorized"}, {status: 401});

    const { classroomLocation } = await req.json();
    
    await ConnectDB();
    
    // Check if already favorited
    const exists = await favoriteModel.findOne({ classroomLocation, userID: userId});
    if (exists) {
        return NextResponse.json({ message: "Already favorited!"}, { status: 200});
    }

    const newFavorite = new favoriteModel({ classroomLocation, userID: userId }); 
    await newFavorite.save();
    return NextResponse.json({ message: "Course favorited!"}, {status: 201});
}

export async function DELETE(req) {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    const { classroomLocation } = await req.json();
    await ConnectDB();
  
    await favoriteModel.deleteOne({ classroomLocation, userID: userId });
  
    return NextResponse.json({ message: "Course unfavorited" }, { status: 200 });
  }
  
  export async function GET(req) {
    const { userId } = getAuth(req);
    console.log("Fetched userId:", userId);
  
    if (!userId) {
      console.log("No user ID found, unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    await ConnectDB();
    console.log("Connected to DB");
  
    // Find all the favorite classroom locations for the user
    const favorites = await favoriteModel.find({ userID: userId });
    console.log("Favorites found:", favorites);
  
    if (favorites.length === 0) {
      console.log("No favorites found for user.");
      return NextResponse.json([], { status: 200 }); // Return empty array
    }
  
    // Extract classroom locations from the favorites
    const classroomLocations = favorites.map(fav => fav.classroomLocation);
    console.log("Favorite classroom locations:", classroomLocations);
  
    // Return just the list of locations
    return NextResponse.json(classroomLocations, { status: 200 });
  }
  

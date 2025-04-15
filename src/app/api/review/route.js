import { ConnectDB } from "../../../../lib/config/db";
import reviewModel from "../../../../lib/models/reviewModel";
import classroomModel from "../../../../lib/models/classroomModel"; // Import classroom model
const { NextResponse } = require("next/server"); const LoadDB = async () => {
    await ConnectDB();
}

LoadDB();

// API portion for GETting review posts
export async function GET(request) {
    const reviewId = request.nextUrl.searchParams.get("id");
    const buildingName = request.nextUrl.searchParams.get("building"); // Get building name

    if (reviewId) {
        // Fetch single review by ID
        const review = await reviewModel.findById(reviewId);
        return NextResponse.json(review);
    } else if (buildingName) {
        try {
            // Fetch reviews directly using the building abbreviation stored in the reviewModel
            console.log(`[API /api/review GET] Fetching reviews for building: ${buildingName}`); // Add server-side log
            const reviews = await reviewModel.find({ building: buildingName });
            console.log(`[API /api/review GET] Found ${reviews.length} reviews for ${buildingName}`); // Log count
            return NextResponse.json(reviews);
        } catch (error) {
            console.error(`[API /api/review GET] Error fetching reviews for building ${buildingName}:`, error); // Log the specific error
            // Return a proper JSON error response with a 500 status code
            return NextResponse.json({ success: false, message: "Internal server error fetching reviews." }, { status: 500 });
        }
    } else {
        // Fetch all reviews if no ID or building name is provided
        const reviews = await reviewModel.find({});
        return NextResponse.json(reviews);
    }
}

// API portion for POSTing review posts
export async function POST(request){
    const formData = await request.formData();
    const classroom = formData.get('classroom');
    const author = formData.get('author');
    const rating = formData.get('rating'); 
    const comment = formData.get('comment');

    // Extract building abbreviation from classroom string (e.g., "ECS-302" -> "ECS")
    let buildingAbbreviation = null;
    if (classroom && classroom.includes('-')) {
        buildingAbbreviation = classroom.split('-')[0].toUpperCase(); // Take first part, ensure uppercase
    } 

    // Validate required fields
    if (!classroom || rating === null) {
        return NextResponse.json({ success: false, msg: "Classroom and rating are required." }, { status: 400 });
    }

    const reviewData = {
        classroom: classroom,
        author: author,
        rating: rating,
        comment: comment,
        building: buildingAbbreviation // Add the extracted building abbreviation
    };

        await reviewModel.create(reviewData);
        console.log("Review saved!")
    
    return NextResponse.json({success: true, msg: "Review added!"})
}

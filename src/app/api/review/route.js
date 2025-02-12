import { ConnectDB } from "../../../../lib/config/db";
import reviewModel from "../../../../lib/models/reviewModel";

const { NextResponse } = require("next/server");
const LoadDB = async () => {
    await ConnectDB();
}

LoadDB();

// API portion for GETting review posts
export async function GET(request) {
    const reviewId = request.nextUrl.searchParams.get("id");
    if (reviewId) {
        const review = await reviewModel.findById(reviewId);
        return NextResponse.json(review);
    }
    else {
        const reviews = await reviewModel.find({});
        return NextResponse.json(reviews) 
    }
}

// API portion for POSTing review posts
export async function POST(request){
    const formData = await request.formData();
        const reviewData = {
            classroom: `${formData.get('classroom')}`,
            rating: `${formData.get('rating')}`,
            comment: `${formData.get('comment')}`
        }

        await reviewModel.create(reviewData);
        console.log("Review saved!")
    
    return NextResponse.json({success: true, msg: "Review added!"})
}


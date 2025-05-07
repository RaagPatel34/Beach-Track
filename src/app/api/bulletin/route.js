import { ConnectDB } from "../../../../lib/config/db";
import bulletinModel from "../../../../lib/models/bulletinModel";

const { NextResponse } = require("next/server");
const LoadDB = async () => {
    await ConnectDB();
}

LoadDB();

// API portion for GETting bulletin posts
export async function GET(){
    const bulletins = await bulletinModel.find({});
    return NextResponse.json({bulletins})
}

// API portion for POSTing bulletin posts
export async function POST(request){
    const formData = await request.formData();
        const bulletinData = {
            title: `${formData.get('title')}`,
            type: `${formData.get('type')}`,
            author: `${formData.get('author')}`,
            date: `${formData.get('date')}`,
            startTime: `${formData.get('startTime')}`,
            endTime: `${formData.get('endTime')}`,
            location: `${formData.get('location')}`,
            description: `${formData.get('description')}`    
        }

        await bulletinModel.create(bulletinData);
        console.log("Bulletin post saved!");

    return NextResponse.json({success: true, msg: "Bulletin post added!"})

}

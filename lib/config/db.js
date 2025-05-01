import mongoose from "mongoose";

export const ConnectDB = async () => {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@beachtrack.z3sm6.mongodb.net/main?retryWrites=true&w=majority&appName=BeachTrack`)
    console.log("DB Connected");
}

import mongoose from "mongoose";

export const ConnectDB = async () => {
    await mongoose.connect('mongodb+srv://<username>:<password>@beachtrack.z3sm6.mongodb.net/reviews_bulletin?retryWrites=true&w=majority&appName=BeachTrack')
    console.log("DB Connected");
}

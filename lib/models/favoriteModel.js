import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    classroomLocation: {
        type: String,
        required: true
    },

    userID: {
        type: String,
        required: true 
    }
});

const favoriteModel = mongoose.models.Favorite || mongoose.model('Favorite', Schema);

export default favoriteModel;
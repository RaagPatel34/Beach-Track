import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    classroom: {
        type: String,
        required: false
    },
    // Add building field
    building: {
        type: String,
        required: false, // Set to false initially to handle existing data
    },
    rating: {
        type: Number,
        required: true,
        enum: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
    },

    date: {
        type: Date,
        default: Date.now()
    },

    comment: {
        type: String,
        required: false
    }
});

const reviewModel = mongoose.models.Review || mongoose.model('Review', Schema);

export default reviewModel;
import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    
    type: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    startTime: {
        type: String,
        required: true
    },
    
    endTime: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    }
});

const bulletinModel = mongoose.models.Bulletin || mongoose.model('Bulletin', Schema);

export default bulletinModel;

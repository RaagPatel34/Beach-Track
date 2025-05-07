import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
    courseName: String,
    sectionNumber: String,
    courseID: String,
    courseType: String,
    days: String,
    startTime: String,
    endTime: String,
    location: String,
    building: String,
    room: String,
    instructor: String
});

const classroomModel = mongoose.models.Class || mongoose.model('Class', classroomSchema);

export default classroomModel;

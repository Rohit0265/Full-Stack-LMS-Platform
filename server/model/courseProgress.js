import mongoose from "mongoose";

const CourseProgressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    completed: { type: Boolean, required: false },
    lectureCompleted: []
}, { minimize: false });

export const CourseProgress = mongoose.model('CourseProgress', CourseProgressSchema)
import { messageInRaw } from "svix";
import Course from "../model/modelSchema.js";
import User from "../model/user.js";
import { Purchase } from "../model/purchase.js";

//get all courses


export const getAllcourse = async(req, res) => {

    try {
        const courses = await Course.find({ isPublished: true }).select(['-courseContent', '-enrolledStudents']).populate({ path: 'educator' })

        res.json({ success: true, courses })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}

//get course by id

export const getCourseId = async(req, res) => {
    const { id } = req.params

    try {
        const courseData = await Course.findById(id).populate({ path: 'educator' });

        //remove lectureurl if ispreview free is false
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreview) {
                    lecture.lectureUrl = "";
                }
            })
        })
        res.json({ success: true, courseData })
    } catch (error) {
        res.json({ success: false, error: message })
    }
}
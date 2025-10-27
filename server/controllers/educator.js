// import { clerkClient } from "@clerk/express";
// import Course from "../model/modelSchema.js";
// import { v2 as cloudinary } from 'cloudinary'



// export const updateEducator = async(req, res) => {
//     try {
//         const userId = req.auth.UserId
//         await clerkClient.users.updateUserMetadata(userId, {
//             publicMetadata: {
//                 role: 'educator',
//             }
//         })
//         res.json({ success: true, message: 'You Can Publish Course' })

//     } catch (error) {
//         res.json({
//             success: false,
//             message: error.message
//         })

//     }
// }

// //adding course

// export const addCourse = async(req, res) => {
//     try {
//         const { courseData } = req.body
//         const imageFile = req.file
//         const educatorId = req.auth.UserId
//         if (!imageFile) {
//             return res.json({
//                 success: false,
//                 message: 'Thumbnail Not Attached'
//             })
//         }
//         const parsedCourseData = await JSON.parse(courseData)
//         parsedCourseData.educator = educatorId
//         const newCourse = await Course.create(parsedCourseData)
//         const imageUpload = await cloudinary.uploader.upload(imageFile.path)
//         newCourse.courseThumbnail = imageUpload.secure_url
//         await newCourse.save();

//         res.json({ success: true, message: "Course Added" })
//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }
// }

import { clerkClient } from "@clerk/express";
import Course from "../model/modelSchema.js";
import { v2 as cloudinary } from 'cloudinary'
import { Purchase } from "../model/purchase.js";
import User from "../model/user.js";

// --- updateEducator (No changes needed here) ---

export const updateEducator = async(req, res) => {
    try {
        const userId = req.auth.userId // Correct: lowercase 'u'
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        })
        res.json({ success: true, message: 'You Can Publish Course' })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })

    }
}

// --- addCourse (Correction made here) ---

export const addCourse = async(req, res) => {
    try {
        const { courseData } = req.body
        const imageFile = req.file
            // *** CORRECTION: Changed req.auth.UserId to req.auth.userId ***
        const educatorId = req.auth.userId

        if (!imageFile) {
            return res.json({
                success: false,
                message: 'Thumbnail Not Attached'
            })
        }

        // This check is good, but you might want to confirm educatorId is NOT undefined
        if (!educatorId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed. Educator ID is missing.'
            });
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save();

        res.json({ success: true, message: "Course Added" })
    } catch (error) {
        // This will now successfully catch your validation error if it happens for other reasons
        res.json({ success: false, message: error.message })
    }
}



//find educator course


export const eucatorCourse = async(req, res) => {
    try {

        const educator = req.auth.userId;
        const courses = await Course.find({ educator })
        res.json({ success: true, courses })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// educator dash board for price wagera wagera

export const eductorDashboard = async() => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const totalCourses = courses.length;
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            couseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)

        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: {
                    $in: course.enrolledStudents
                }

            }, 'name imageUrl');
            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            });
        }
        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//enrolled student data from here


export const getEnrolledStudentsdata = async(req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: {
                $in: courseIds
            },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')


        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }))

        res.json({ success: true, message: enrolledStudents })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
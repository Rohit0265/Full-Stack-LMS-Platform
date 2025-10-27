import express from 'express';
import { addCourse, eductorDashboard, eucatorCourse, getEnrolledStudentsdata, updateEducator } from '../controllers/educator.js'
import upload from '../config/Multer.js'
import { protextEducator } from '../middlewares/authMiddleware.js';

const educator = express.Router()
educator.get('/update-role', updateEducator)
educator.post('/add-course', upload.single('image'), addCourse)
educator.get('/courses', protextEducator, eucatorCourse)
educator.get('/dashboard', protextEducator, eductorDashboard)
educator.get('/student-enrolled', protextEducator, getEnrolledStudentsdata)
export default educator;
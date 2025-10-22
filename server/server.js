// Server.js - CORRECTED FOR VERCEL
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoosedb from './config/Mongo.js';
import { clerkwebhooks } from './controllers/Webhooks.js';

// --- (1) Initialize Express App Immediately ---
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- (2) Add a Database Connection Check Middleware ---
// This ensures we attempt to connect (or re-use a connection) 
// BEFORE handling any routes that need the DB.
app.use(async(req, res, next) => {
    try {
        await mongoosedb(); // Call the async connection function here
        next(); // Proceed to the routes
    } catch (error) {
        console.error("Database connection failed:", error);
        // Respond with an error if DB connection is critical and fails
        res.status(503).send("Service Unavailable: Database connection failed.");
    }
});

// Routes
app.get('/', (req, res) => {
    res.send('Working hai bhai 😎');
});

app.post('/clerk', clerkwebhooks);


// --- (3) Export the Express 'app' instance directly ---
// In Vercel serverless functions, you export the app, you don't call app.listen()
// This file becomes your handler.
export default app;

// --- (4) DELETE the old app.listen() code block ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server is running on port ${PORT}`);
// });
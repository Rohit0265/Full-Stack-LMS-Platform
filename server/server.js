import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoosedb from './config/mongo.js';
import { clerkwebhooks } from './controllers/Webhooks.js'; // fixed spelling: controllers ✅

// Initialize express app
const app = express();

// Connect to MongoDB
await mongoosedb(); // make sure you're using Node 18+ or have "type": "module" in package.json

// Middleware
app.use(cors());
app.use(express.json()); // moved express.json() here globally ✅

// Routes
app.get('/', (req, res) => {
    res.send('Working hai bhai 😎');
});

app.post('/clerk', clerkwebhooks);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
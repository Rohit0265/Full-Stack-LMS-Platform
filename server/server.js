import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoosedb from './config/mongo.js';
import { clerkwebhooks } from './controllers/webhooks.js';

const app = express();

// Connect to MongoDB
await mongoosedb();

// Middleware
app.use(cors());

// Routes
app.get('/', (req, res) => res.send('Working hai bhai 😎'));

// 🛑 CRITICAL FIX: Insert express.raw() middleware ONLY for the webhook route.
// This ensures that req.body is a raw Buffer/string (unparsed), which is required
// by the svix library for signature verification.
app.post('/clerk', express.raw({ type: "application/json" }), clerkwebhooks);



// ✅ Use JSON parser for normal routes (optional)
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;
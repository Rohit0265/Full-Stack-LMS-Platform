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
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Working hai bhai 😎'));
app.post('/clerk', bodyParser.raw({ type: "application/json" }), clerkwebhooks);

// ❌ Remove app.listen() for Vercel
export default app;
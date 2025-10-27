// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import mongoosedb from './config/mongo.js';
// import { clerkMiddleware } from '@clerk/express'
// import { clerkwebhooks } from './controllers/webhooks.js';
// import educator from './routes/educatorRout.js';
// import connectClodinary from './config/Cloudnary.js';
// import { protextEducator } from './middlewares/authMiddleware.js';

// const app = express();

// // Connect to MongoDB
// await mongoosedb();
// await connectClodinary();

// // Middleware
// app.use(cors());
// app.use(clerkMiddleware())
//     // Routes
// app.get('/', (req, res) => res.send('Working hai bhai 😎'));
// app.post('/clerk', express.raw({ type: "application/json" }), clerkwebhooks);
// app.use('/api/educator', express.json(), protextEducator, educator);


// // ✅ Use JSON parser for normal routes (optional)
// app.use(express.json());

// app.listen(process.env.PORT, () => {
//     console.log(`Server is running on port ${process.env.PORT}`);
// });

// export default app;
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoosedb from './config/mongo.js';
import { clerkMiddleware } from '@clerk/express'
import { clerkwebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educator from './routes/educatorRout.js';
import connectClodinary from './config/Cloudnary.js';
import { protextEducator } from './middlewares/authMiddleware.js';
import courseRouter from './routes/coursseRoute.js';
import userRouter from './routes/userRoutes.js';

const app = express();

// Connect to MongoDB
await mongoosedb();
await connectClodinary();

// Middleware
app.use(cors());

// ✅ FIX: Place the global JSON parser here so all routes can use it!
app.use(express.json());

app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => res.send('Working hai bhai 😎'));

// Note: Webhooks must use express.raw to read the raw body for signature verification
app.post('/clerk', express.raw({ type: "application/json" }), clerkwebhooks);

// Removed the redundant express.json() here
app.use('/api/educator', protextEducator, educator);
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)
    // The previously misplaced express.json() is now removed from here.
    // app.use(express.json()); 

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;
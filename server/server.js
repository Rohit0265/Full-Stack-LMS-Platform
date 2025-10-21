import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoosedb from '../../config/mongo.js';
import { Webhook } from '../../controllers/webhooks.js';
import serverless from 'serverless-http'; // important!

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Working hai bhai 😎');
});
app.post('/clerk', Webhook);

// MongoDB connection
await mongoosedb();

// export handler (no app.listen)
export const handler = serverless(app);
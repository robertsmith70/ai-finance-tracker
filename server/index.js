//set up express server
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import expensesRoute from './routes/expense.routes.js';
import authRoute from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import insightsRoute from './routes/insights.routes.js';

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ai-finance-tracker-fawn.vercel.app"
    ],
    credentials: true,
  })
);app.use(express.json());
app.use(cookieParser());


const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected')
})

app.get('/', (req, res) => {
    res.send('<h1> Hello, Express.js Server!</h1>');
});

app.use('/expenses', expensesRoute);
app.use('/auth', authRoute);
app.use('/insights', insightsRoute);


const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//set up express server

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected')
})

const app = express();
app.use(express.json());


//define routes
app.get('/', (req, res) => {
    res.send('<h1> Hello, Express.js Server!</h1>');
});

//Include route files
const expensesRoute = require('./routes/expenses');

//use routes
app.use('/expenses', expensesRoute);

const port = process.env.PORT || 3000; // Using an environment variable or defaulting to 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
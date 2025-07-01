//set up express server
const express = require('express');
const app = express();

//define routes
app.get('/', (req, res) => {
    res.send('<h1> Hello, Express.js Server!</h1>');
});

const port = process.env.PORT || 3000; // Using an environment variable or defaulting to 3000
app.listen(port, () => {
    console.log('Server is running on port ${port}');
});
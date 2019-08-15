const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Connect to MongoDB via mongoose.
mongoose.connect('mongodb://localhost:27017/jobboard', { useNewUrlParser: true })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', function() {
    console.log('Successfully connected to MongoDB on localhost.')
})

// Json middleware
app.use(express.json());

// Routes
const testRoutes = require('./routes/test.route');
app.use('/api/test', testRoutes)

const port = process.env.PORT || 3001;

app.listen(port, ()=> {
    console.log(`Listening on port ${port}`)
})


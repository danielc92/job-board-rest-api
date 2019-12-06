const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/jobboard';

// Connect to the database
mongoose.connect(uri, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'))

db.once('open', function() {
    console.log(`Successfully connected to MongoDB on ${uri}.`);
})

// Import models
const Skill = require('../models/skill.model');
const User = require('../models/user.model');
const Benefit = require('../models/benefit.model');
const Category = require('../models/category.model');



//


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


// Import Dummy data
const skillsData = require('../data/skills.json');
const categoriesData = require('../data/categories.json');
const benefitsData = require('../data/benefits.json');


// Inject Dummy data
skillsData.map(name => {
    Skill.create({
        name
    }).then(result => {
        console.log('Successfully inserted: ', result);
    }).catch(error => {
        console.log(error)
    })
})

categoriesData.map(name => {
    Category.create({
        name
    }).then(result => {
        console.log('Successfully inserted: ', result);
    }).catch(error => {
        console.log(error)
    })
})

benefitsData.map(name => {
    Benefit.create({
        name
    }).then(result => {
        console.log('Successfully inserted: ', result);
    }).catch(error => {
        console.log(error)
    })
})

const bcrypt = require('bcrypt');
const settings = require('../settings');

const password = '123456789'
const hashedPassword = bcrypt.hashSync(password, settings.bcrypt_iterations);
console.log('this is hashed password', hashedPassword)
User.create({
    email: "test@test.com",
    password: hashedPassword,
    first_name: "john",
    last_name: "doe",
})
.then(result => console.log(result))
.catch(error => console.log(error))
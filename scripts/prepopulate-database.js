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


// Create a test user
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

// Insert Location data
const Location = require('../models/location.model');

const new_south_wales = require('../locality/NSW.json');
const northern_territory = require('../locality/NT.json');
const queensland = require('../locality/QLD.json');
const south_australia = require('../locality/SA.json');
const tasmania = require('../locality/TAS.json'); 
const victoria = require('../locality/VIC.json');
const western_australia = require('../locality/WA.json');


function returnFullState(CODE) {
    let fullState;
    switch (CODE) {
        case 'NSW':
            fullState = 'New South Wales (NSW)';
            break;
        case 'NT':
            fullState = 'Northern Territory (NT)';
            break;
        case 'QLD':
            fullState = 'Queensland (QLD)';
            break;
        case 'SA':
            fullState = 'South Australia (SA)';
            break;
        case 'TAS':
            fullState = 'Tasmania (TAS)';
            break;
        case 'VIC':
            fullState = 'Victoria (VIC)';
            break;
        case 'WA':
            fullState = 'Western Australia (WA)';
            break;
        default:
            fullState = null
    }

    return fullState;
}

function bulkInsertState(locations) {
    const locations_new = locations.map(item => {
        
        const {POSTCODE, STATE_CODE, LOCALITY_NAME, LONGITUDE, LATITUDE} = item;
        const STATE_STRING = returnFullState(STATE_CODE)

        const new_item = {
            location: {
                coordinates: [LONGITUDE, LATITUDE]
            },
            state: STATE_CODE,
            location_string: `${LOCALITY_NAME}, ${POSTCODE}, ${STATE_STRING}`,
            postcode: POSTCODE,
            locality: LOCALITY_NAME,
            
        }
        return new_item
    })

    Location.insertMany(locations_new)
    .then(result => console.log(result))
    .catch(error => console.log(error))
}


bulkInsertState(new_south_wales);
bulkInsertState(northern_territory);
bulkInsertState(queensland);
bulkInsertState(south_australia);
bulkInsertState(tasmania);
bulkInsertState(victoria);
bulkInsertState(western_australia);


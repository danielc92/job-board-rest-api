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
const skillsList = require('../data/skills.json');
const categoriesList = require('../data/categories.json');
const benefitsList = require('../data/benefits.json');
const titlesList = require('../data/titles.json');



// Benefits
benefitsData = benefitsList.map(name => ({ name }))

Benefit.insertMany(benefitsData)
.then(r => console.log('Successfully insert benefits.'))
.catch(e => console.log(e))

// Skills
skillsData = skillsList.map(name => ({ name }))

Skill.insertMany(skillsData)
.then(r => console.log('Successfully insert skills.'))
.catch(e => console.log(e))

// Categories
categoriesData = categoriesList.map(name => ({ name }))

Category.insertMany(categoriesData)
.then(r => console.log('Successfully insert categories.'))
.catch(e => console.log(e))


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
    .then(result => console.log('Successully inserted bulk locations'))
    .catch(error => console.log(error))
}


bulkInsertState(new_south_wales);
bulkInsertState(northern_territory);
bulkInsertState(queensland);
bulkInsertState(south_australia);
bulkInsertState(tasmania);
bulkInsertState(victoria);
bulkInsertState(western_australia);


//  Bulk insert Jobs

const Job = require('../models/job.model');

function choice(array) {
    let length = array.length > 7 ? 7 : array.length;
    let itemsToTake = Math.floor(Math.random() * length) + 1
    return array.slice(0, itemsToTake);
}

// Create a test user
const bcrypt = require('bcrypt');
const settings = require('../settings');
const password = '123456789'
const hashedPassword = bcrypt.hashSync(password, settings.bcrypt_iterations);
let user = {
    email: "test@test.com",
    password: hashedPassword,
    first_name: "john",
    last_name: "doe",
}

const locationList = require('../data/locations.json');

User.create(user)
.then(result => {
    console.log('Successfully created a user')
    let jobData = new Array(150).fill(null).map(item => {
        
        const randomLocation = choice(locationList)
        const jobItem = {
            creator_id: result._id,
            category: "general",
            title: titlesList[Math.floor(Math.random() * titlesList.length)],
            skills: choice(skillsList),
            benefits: choice(benefitsList),
            company_summary: "This is a great company based in X, we specialize in Y and we are currently hiring for a new employee in a particular department.",
            job_summary: "This is a summary about the job, find below more details.",
            contact_summary: "04 0000 0000 or contact me on test@test.com via outlook.",
            requirements: [],
            salary_range_low: Math.floor(Math.random() * 20000),
            salary_range_high: Math.floor(Math.random() * 200000),
            location_string: randomLocation.location_string,
            location: randomLocation.location,
    
        }
        return jobItem
    })

    Job
    .insertMany(jobData)
    .then(result => console.log('Insert many jobs'))
    .catch(error => console.log('Failed to insert jobs'))
})
.catch(error => console.log(error))







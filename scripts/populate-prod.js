/*
Inserts data intended for prod (to be shared with dev as well)
1. Benefits
2. Categories
3. Skills
4. Locations
*/
console.log('[INFO] Populating mongodb for production environment.')
const mongoose = require('mongoose')
const Utils = require('./utils')
const Skill = require('../models/skill.model')
const Benefit = require('../models/benefit.model')
const Category = require('../models/category.model')
const Location = require('../models/location.model')
const uri = 'mongodb://localhost:27017/jobboard'
const new_south_wales = require('../locality/NSW.json')
const northern_territory = require('../locality/NT.json')
const queensland = require('../locality/QLD.json')
const south_australia = require('../locality/SA.json')
const tasmania = require('../locality/TAS.json') 
const victoria = require('../locality/VIC.json')
const western_australia = require('../locality/WA.json')
const skillsList = require('../data/skills.json')
const benefitsList = require('../data/benefits.json')
const categoriesList = require('../data/categories.json')

mongoose.connect(uri, { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', function() {
    console.log(`Successfully connected to MongoDB on ${uri}.`)
})

const benefitsData = benefitsList.map(name => ({ name }))
Benefit.insertMany(benefitsData)
    .then(result => console.log('[SUCCESS] Inserted benefits'))
    .catch(error => console.log('[ERROR] Failed to insert benefits', error))

// Skills
const skillsData = skillsList.map(name => ({ name }))

Skill.insertMany(skillsData)
    .then(result => console.log('[SUCCESS] Inserted skills'))
    .catch(error => console.log('[ERROR] Failed to insert skills', error))

// Categories
const categoriesData = categoriesList.map(name => ({ name }))

const all_locations = [...new_south_wales, 
    ...northern_territory,
    ...queensland,
    ...south_australia,
    ...tasmania,
    ...victoria,
    ...western_australia]
    
Category.insertMany(categoriesData)
    .then(result => console.log('[SUCCESS] Inserted categories'))
    .catch(error => console.log('[ERROR] Failed to insert categories', error))

const locations_new = all_locations.map(item => {
    
    const {POSTCODE, STATE_CODE, LOCALITY_NAME, LONGITUDE, LATITUDE} = item
    const STATE_STRING = Utils.returnFullState(STATE_CODE)
    const LOCALITY_NAME_PROPERCASE = Utils.properCaseTransform(LOCALITY_NAME)
    
    const new_item = {
        location: {
            coordinates: [LONGITUDE, LATITUDE]
        },
        state: STATE_CODE,
        location_string: `${LOCALITY_NAME_PROPERCASE}, ${POSTCODE}, ${STATE_STRING}`,
        postcode: POSTCODE,
        locality: LOCALITY_NAME,
            
    }
    return new_item
})
    
Location.insertMany(locations_new)
    .then(result => console.log('[SUCCESS] Inserted locations'))
    .catch(error => console.log('[ERROR] Failed to insert locations', error))
    
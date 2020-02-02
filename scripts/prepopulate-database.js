const mongoose = require('mongoose')
const uri = 'mongodb://localhost:27017/jobboard'
const Utils = require('./utils')
const faker = require('faker')
const Skill = require('../models/skill.model')
const CareerStats = require('../models/career_stats.model')
const News = require('../models/news.model')
const User = require('../models/user.model')
const Benefit = require('../models/benefit.model')
const Category = require('../models/category.model')
const Job = require('../models/job.model')
const skillsList = require('../data/skills.json')
const categoriesList = require('../data/categories.json')
const benefitsList = require('../data/benefits.json')
const titlesList = require('../data/titles.json')

// Connect to the database
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

Category.insertMany(categoriesData)
    .then(result => console.log('[SUCCESS] Inserted categories'))
    .catch(error => console.log('[ERROR] Failed to insert categories', error))


// Insert Location data
const Location = require('../models/location.model')

const new_south_wales = require('../locality/NSW.json')
const northern_territory = require('../locality/NT.json')
const queensland = require('../locality/QLD.json')
const south_australia = require('../locality/SA.json')
const tasmania = require('../locality/TAS.json') 
const victoria = require('../locality/VIC.json')
const western_australia = require('../locality/WA.json')
const all_locations = [...new_south_wales, 
    ...northern_territory,
    ...queensland,
    ...south_australia,
    ...tasmania,
    ...victoria,
    ...western_australia]

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


let user = {
    email: 'test@test.com',
    password: Utils.getPassword(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    is_employer: true,
}

const locationList = require('../data/locations.json')

User.create(user)
    .then(result => {
        let jobData = new Array(12567).fill(null).map(item => {
        
            const randomLocation = Utils.randomItemFromArray(locationList)
            const jobItem = {
                creator_id: result._id,
                category: Utils.randomItemFromArray(categoriesList).trim().toLowerCase(),
                title: Utils.randomItemFromArray(titlesList),
                skills: Utils.randomItemsFromArray(skillsList),
                benefits: Utils.randomItemsFromArray(benefitsList),
                company_summary: faker.lorem.paragraph(),
                job_summary: faker.lorem.paragraph(),
                contact_summary: faker.lorem.paragraph(),
                requirements: [],
                salary_range_low: Utils.randomLowSalary(),
                salary_range_high: Utils.randomHighSalary(),
                location_string: randomLocation.location_string,
                location: randomLocation.location,
    
            }
            return jobItem
        })

        Job
            .insertMany(jobData)
            .then(result => console.log('[SUCCESS] Inserted jobs'))
            .catch(error => console.log('[ERROR] Failed to insert jobs', error))
    })
    .catch(error => console.log(error))


// Create some job seekers

const jobSeekers = new Array(25).fill(true).map((item, index) => (
    {
        email: `test${index}@test.com`,
        password: Utils.getPassword(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
    }
))

User.insertMany(jobSeekers)
    .then(results => {
        console.log('[SUCCESS] Inserted job seekers')
        const careerStats = results.map(r => ({ user_id: r._id}))
        CareerStats.insertMany(careerStats)
            .then(results => console.log('[SUCCESS] Inserted profiles'))
            .catch(error => console.log('[ERROR] Failed to insert profiles'))
    })
    .catch(error => console.log('[ERROR] Failed to insert job seekers', error))



const newsItems = new Array(200).fill(true).map(item => ({
    title: faker.lorem.text().substring(0, 20),
    content: new Array(6).fill(null).map(i => faker.lorem.paragraph()),
    category: 'update',
    summary: faker.lorem.paragraph()
}))

News.insertMany(newsItems)
    .then(result => console.log('[SUCCESS] Inserted news'))
    .catch(error => console.log('[ERROR] Failed to insert news', error))

    
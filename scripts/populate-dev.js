/*
Inserts dummy data for dev environment
1. Job seekers
2. Employer
3. News articles
4. Jobs
*/
console.log('[INFO] Populating mongodb for development environment.')
const mongoose = require('mongoose')
const uri = 'mongodb://localhost:27017/jobboard'
const Utils = require('./utils')
const faker = require('faker')
const CareerStats = require('../models/career_stats.model')
const News = require('../models/news.model')
const User = require('../models/user.model')
const Job = require('../models/job.model')
const skillsList = require('../data/skills.json')
const categoriesList = require('../data/categories.json')
const benefitsList = require('../data/benefits.json')
const titlesList = require('../data/titles.json')
const locationList = require('../data/locations.json')

mongoose.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', function() {
    console.log(`Successfully connected to MongoDB on ${uri}.`)
})

const insertEmployer = () => {
    let user = {
        email: 'test@test.com',
        password: Utils.getPassword(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        is_employer: true,
    }
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
    return
}


const insertJobSeekers = () => {
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
    return
}

const insertNews = () => {
    const newsItems = new Array(200).fill(true).map(item => ({
        title: faker.lorem.text().substring(0, 20),
        content: new Array(6).fill(null).map(item => faker.lorem.paragraph()),
        category: 'update',
        summary: faker.lorem.paragraph()
    }))
    
    News.insertMany(newsItems)
        .then(result => console.log('[SUCCESS] Inserted news'))
        .catch(error => console.log('[ERROR] Failed to insert news', error))
    
    
    return
}

insertEmployer()
insertJobSeekers()
insertNews()
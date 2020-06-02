/*
Inserts dummy data for dev environment
1. Job seekers
2. Employer
3. News articles
4. Jobs
*/
console.log("[INFO] Populating mongodb for development environment.")
const Helpers = require("./utils")
const mongoose = require("mongoose")
const uri = "mongodb://localhost:27017/jobboard"
const Utils = require("./utils")
const faker = require("faker")
const CareerStats = require("../models/career_stats.model")
const News = require("../models/news.model")
const User = require("../models/user.model")
const JobApplication = require("../models/application.model")
const Job = require("../models/job.model")
const skillsList = require("../data/skills.json")
const categoriesList = require("../data/categories.json")
const benefitsList = require("../data/benefits.json")
const titlesList = require("../data/titles.json")
const locationList = require("../data/locations.json")
const employment_types = [
  "full-time",
  "part-time",
  "casual",
  "fixed-term",
  "shift worker",
  "daily/weekly hire",
  "probation",
  "outworkers",
  "other",
]

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on("error", console.error.bind(console, "Connection error:"))
db.once("open", function () {
  console.log(`Successfully connected to MongoDB on ${uri}.`)
})

const insertEmployers = async () => {
  try {
    let employers = new Array(10).fill(0).map((e, index) => ({
      email: `test-employer-${index}@applymer-test.com`,
      password: Utils.getPassword(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      is_employer: true,
      activated: true,
    }))

    const userResults = await User.insertMany(employers)

    let employerProfiles = userResults.map((u) => ({ user_id: u._id }))
    await CareerStats.insertMany(employerProfiles)

    let jobs = new Array(100).fill(null).map((item) => {
      const randomLocation = Utils.randomItemFromArray(locationList)
      const randomTitle = Utils.randomItemFromArray(titlesList)
      const jobItem = {
        creator_id: faker.random.arrayElement(userResults)._id,
        category: Utils.randomItemFromArray(categoriesList)
          .trim()
          .toLowerCase(),
        benefits: Utils.randomItemsFromArray(benefitsList),
        company_name: faker.name.firstName() + " ltd corp",
        company_summary: faker.lorem.paragraph(),
        contact_summary: faker.lorem.paragraph(),
        employment_type: Utils.randomItemFromArray(employment_types),
        job_summary: faker.lorem.paragraph(),
        location_string: randomLocation.location_string,
        state: randomLocation.state,
        location: randomLocation.location,
        requirements: [],
        salary_range_high: Utils.randomHighSalary(),
        salary_range_low: Utils.randomLowSalary(),
        skills: Utils.randomItemsFromArray(skillsList),
        slug: Helpers.slugify(randomTitle),
        title: randomTitle,
      }
      return jobItem
    })

    await Job.insertMany(jobs)
    console.log("[SUCCESS] Employers and jobs.")
  } catch (error) {
    console.log("[ERROR] ", error)
  }
}

const insertJobSeekers = async () => {
  try {
    const jobSeekers = new Array(50).fill(true).map((item, index) => ({
      email: `test-seeker-${index}@applymer-test.com`,
      password: Utils.getPassword(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      activated: true,
    }))

    const userResults = await User.insertMany(jobSeekers)

    let seekerProfiles = userResults.map((u) => ({ user_id: u._id }))
    await CareerStats.insertMany(seekerProfiles)
    console.log("[SUCCESS] Inserted job seekers with profiles.")
  } catch (error) {
    console.log("[ERROR] ", error)
  }
}

const insertApplications = async () => {
  try {
    const seeker1 = await User.findOne({
      email: "test-seeker-1@applymer-test.com",
    })

    const seeker2 = await User.findOne({
      email: "test-seeker-2@applymer-test.com",
    })

    const seeker3 = await User.findOne({
      email: "test-seeker-3@applymer-test.com",
    })

    const jobs = await Job.find().limit(90)

    const applications = jobs.map((j) => ({
      job_id: j._id,
      applicant_id: seeker1._id,
      user_message: faker.random.words(30),
    }))

    const applications2 = jobs.map((j) => ({
      job_id: j._id,
      applicant_id: seeker2._id,
      user_message: faker.random.words(30),
    }))

    const applications3 = jobs.map((j) => ({
      job_id: j._id,
      applicant_id: seeker3._id,
      user_message: faker.random.words(30),
    }))

    await JobApplication.insertMany([
      ...applications,
      ...applications2,
      ...applications3,
    ])

    console.log("[SUCCESS] Inserted applications.")
  } catch (error) {
    console.log("[ERROR] ", error)
  }
}

const insertNews = async () => {
  const newsItems = new Array(30).fill(0).map((item) => {
    const title = faker.lorem.text().substring(0, 20)
    const slug = Helpers.slugify(title)
    const content = [
      {
        node: "heading-3",
        value: faker.lorem.words(4),
      },
      {
        node: "image",
        value: "https://i.picsum.photos/id/1060/900/600.jpg",
      },
      {
        node: "paragraph",
        value: faker.lorem.words(50),
      },
      {
        node: "unordered-list",
        value: [
          faker.lorem.words(4),
          faker.lorem.words(4),
          faker.lorem.words(4),
          faker.lorem.words(4),
        ],
      },
      {
        node: "paragraph",
        value: faker.lorem.words(28),
      },
      {
        node: "heading-3",
        value: faker.lorem.words(4),
      },
    ]
    return {
      title,
      slug,
      content,
      category: "update",
      summary: faker.lorem.paragraph(),
    }
  })

  await News.insertMany(newsItems)

  console.log("[SUCCESS] Inserted News.")
}

;(async function () {
  await insertEmployers()
  await insertJobSeekers()
  await insertApplications()
  await insertNews()
})()

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

const insertEmployer = () => {
  let user = {
    email: "test@test.com",
    password: Utils.getPassword(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    is_employer: true,
    activated: true,
  }
  User.create(user)
    .then((result) => {
      let jobData = new Array(12567).fill(null).map((item) => {
        const randomLocation = Utils.randomItemFromArray(locationList)
        const randomTitle = Utils.randomItemFromArray(titlesList)
        const jobItem = {
          creator_id: result._id,
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

      Job.insertMany(jobData)
        .then((result) => console.log("[SUCCESS] Inserted jobs"))
        .catch((error) => console.log("[ERROR] Failed to insert jobs", error))
    })
    .catch((error) => console.log(error))
  return
}

const insertJobSeekers = () => {
  const jobSeekers = new Array(25).fill(true).map((item, index) => ({
    email: `test${index}@test.com`,
    password: Utils.getPassword(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    activated: true,
  }))

  User.insertMany(jobSeekers)
    .then((results) => {
      console.log("[SUCCESS] Inserted job seekers")
      const careerStats = results.map((r) => ({ user_id: r._id }))
      CareerStats.insertMany(careerStats)
        .then((results) => console.log("[SUCCESS] Inserted profiles"))
        .catch((error) => console.log("[ERROR] Failed to insert profiles"))
    })
    .catch((error) =>
      console.log("[ERROR] Failed to insert job seekers", error)
    )
  return
}

const insertNews = () => {
  const newsItems = new Array(30).fill(true).map((item) => {
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

  News.insertMany(newsItems)
    .then((result) => console.log("[SUCCESS] Inserted news"))
    .catch((error) => console.log("[ERROR] Failed to insert news", error))

  return
}

insertEmployer()
insertJobSeekers()
insertNews()

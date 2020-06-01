const Job = require("../models/job.model")
const User = require("../models/user.model")
const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/auth.middleware")
const select = require("../constants/select")
const limit = require("../constants/limit")
const Helpers = require("../scripts/utils")
const Filter = require("bad-words")
const filter = new Filter()

/*
Get job detail (Seeker)
*/
router.get("/", (request, response) => {
  const { slug } = request.query

  if (!slug)
    return response.status(400).json({ error: "Slug field is required." })

  // Minus unwanted fields
  Job.findOne({ slug })
    .select(select.GET_JOB)
    .then((results) => {
      console.log(results, typeof results)
      if (!results)
        return response
          .status(400)
          .json({ error: "Sorry we couldn't find your job." })
      return response.status(200).json({ results })
    })
    .catch((error) =>
      response.status(400).json({ error: "Failed to find a job." })
    )
})

/*
Get saved job list
*/

router.get("/list/saved", authMiddleware, (request, response) => {
  const { _id } = request.user

  User.findById(_id)
    .then((results) => {
      Job.find({ _id: { $in: results.saved_jobs } })
        .select(select.GET_JOB_LIST_SEEKER)
        .lean()
        .then((results) => response.status(200).json({ results }))
        .catch((error) =>
          response
            .status(400)
            .json({ error: "Failed to fetch your saved jobs." })
        )
    })
    .catch((error) =>
      response.status(400).json({ error: "Failed to fetch your saved jobs." })
    )
})

/*
Get job list (Seeker)
*/
router.get("/list", (request, response) => {
  console.log(request.query, "REQ QUERY")
  const { title, location_string, category, page } = request.query
  let query = {}

  // Build the query from query string parameters.
  if (category) {
    query = { ...query, category }
  }

  if (title) {
    query = {
      ...query,
      $text: {
        $search: title,
      },
    }
  }

  if (location_string) {
    query = {
      ...query,
      location_string,
    }
  }

  // Build options
  let options = {
    select: select.GET_JOB_LIST_SEEKER,
    sort: { createdAt: "desc" },
    limit: limit.JOB_LIST_MAIN,
  }

  // Append page number
  if (page) {
    options = { ...options, page }
  }

  Job.paginate(query, options)
    .then((results) => response.status(200).json({ results }))
    .catch((error) => {
      console.log(error)
      response.status(400).json({ error })
    })
})

// router.get("/list/testing", (request, response) => {
//   let q = {
//     location: {
//       $nearSphere: {
//         $maxDistance: 5,
//         $geometry: {
//           type: "Point",
//           coordinates: [144.8475565865, -37.6789636846],
//         },
//       },
//     },
//   }

//   Job.find(q)
//     .limit(10)
//     .then((r) => response.status(200).json({ r }))
//     .catch((e) => response.status(400).json({ e }))
// })

// Retrieve list of jobs with few fields to reduce network bandwidth
router.get("/list/employer", authMiddleware, (request, response) => {
  const { page } = request.query
  const { _id } = request.user
  // const { _id } = request.user;

  let query = {
    creator_id: _id,
  }

  // Build options
  let options = {
    select: select.GET_JOB_LIST_EMPLOYER,
    sort: { createdAt: "desc" },
    limit: limit.JOB_LIST_DASHBOARD,
  }

  // Append page number
  if (page) {
    options = { ...options, page }
  }

  Job.paginate(query, options)
    .then((results) => response.status(200).json({ results }))
    .catch((error) => response.status(400).json({ error }))
})

router.post("/", authMiddleware, (request, response) => {
  let newJob = new Job(request.body)
  // Clean
  newJob.title = filter.clean(newJob.title)
  newJob.company_summary = filter.clean(newJob.company_summary)
  newJob.contact_summary = filter.clean(newJob.contact_summary)
  newJob.job_summary = filter.clean(newJob.job_summary)

  // Create slug
  newJob.slug = Helpers.slugify(newJob.title)

  newJob
    .save()
    .then((result) => response.status(200).json({ result }))
    .catch((error) => response.status(400).json({ error }))
})

// Update job status
router.patch("/", authMiddleware, (request, response) => {
  // Store query
  const { job_id } = request.body

  // Check if params exist
  if (!job_id)
    return response.status(400).json({ error: "Missing job_id field." })

  const { _id } = request.user

  const query = { _id: job_id, creator_id: _id }

  const update = { open: false }

  const options = { runValidators: true }
  Job.findOneAndUpdate(query, update, options)
    .then((result) =>
      response
        .status(200)
        .json({ message: "Successfully updated job status to closed." })
    )
    .catch((error) => response.status(400).json({ error }))
})

module.exports = router

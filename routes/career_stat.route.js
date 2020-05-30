const express = require("express")
const CareerStat = require("../models/career_stats.model")
const router = express.Router()
const authMiddleware = require("../middleware/auth.middleware")
const select = require("../constants/select")

/*
Get profile detail
*/

router.get("/", authMiddleware, (request, response) => {
  const { _id } = request.user
  const { user_id } = request.query

  CareerStat.findOne({ user_id: user_id ? user_id : _id })
    .select(select.GET_PROFILE)
    .populate("user_id", select.GET_PROFILE_USER_POPULATE)
    .then((results) => response.status(200).json({ results }))
    .catch((error) =>
      response
        .status(400)
        .json({ error: "An error occured. No profile found." })
    )
})

/*
Update profile (Seeker)
*/
const updateOptions = { runValidators: true, upsert: true }
router.patch("/", authMiddleware, (request, response) => {
  const { _id } = request.user

  const {
    summary,
    skills,
    experience,
    education,
    achievements,
    available,
    phone,
  } = request.body

  let patch = {}
  if (summary) {
    patch = { ...patch, summary }
  }
  if (skills) {
    patch = { ...patch, skills }
  }
  if (experience) {
    patch = { ...patch, experience }
  }
  if (education) {
    patch = { ...patch, education }
  }
  if (achievements) {
    patch = { ...patch, achievements }
  }
  if (available) {
    patch = { ...patch, available }
  }
  if (phone) {
    patch = { ...patch, phone }
  }

  const query = { user_id: _id }

  CareerStat.findOneAndUpdate(query, patch, updateOptions)
    .then((results) => {
      console.log(results)
      return response.status(200).json({ results })
    })
    .catch((error) =>
      response.status(400).json({ error: "Failed to update career stats." })
    )
})

module.exports = router

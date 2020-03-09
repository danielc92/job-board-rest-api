// Route will return documentation (privacy, terms of use, faq etc)

const express = require("express")
const router = express.Router()
const Documentation = require("../models/documentation.model")
const client = require("../redis-client")
const { THREE_HOURS } = require("../constants/ttl")
const key = "docs:list"

router.get("/list", (request, response) => {
  client.get(key, function(err, reply) {
    if (reply) return response.status(200).json({ results: JSON.parse(reply) })

    Documentation.find()
      .lean()
      .then(results => {
        client.setex(key, THREE_HOURS, JSON.stringify(results))
        response.status(200).json({ results })
      })
      .catch(error =>
        response
          .status(400)
          .json({
            error: "Could not find documentation results, please try again."
          })
      )
  })
})

module.exports = router

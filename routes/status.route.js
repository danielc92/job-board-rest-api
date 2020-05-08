const express = require("express")
const router = express.Router()

router.get("/", (request, response) => {
  response.status(200).json({
    status: "OK",
  })
})

module.exports = router

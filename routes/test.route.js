// [NOTE] This route is to test certain mongoose functions only

const Test = require('../models/test.model');
const Job = require('../models/job.model');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// Make a post request to test route
router.post('/', authMiddleware, (request, response) => {

    if (request.user._id === request.body._id) {
        return response.status(200).json({
            msg: "Ids match",
            idSent: request.body._id,
            idAuth: request.user._id,
            stuff: request.body.stuff
        })
    } else {
        return response.status(400).json({error: "Nothing here"})
    }
})

// Make a get request to test route
router.get('/', authMiddleware, (request, response) => {
    return response.json({success: request.user})
})

module.exports = router;
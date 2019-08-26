// [NOTE] This route is to test certain mongoose functions only

const Test = require('../models/test.model');
const Job = require('../models/job.model');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// Make a post request to test route
router.post('/', (request, response) => {

    let new_object = new Test(request.body)

    new_object.save()
        .then(r => response.status(200).json(r))
        .catch(e => response.status(400).json(e))
})

// Make a get request to test route
router.get('/', authMiddleware, (request, response) => {
    return response.json({success: request.user})
})

module.exports = router;
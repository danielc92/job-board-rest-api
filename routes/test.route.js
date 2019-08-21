// [NOTE] This route is to test certain mongoose functions only

const Test = require('../models/test.model');
const Job = require('../models/job.model');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// Make a post request to test route
router.post('/', (request, response) => {

    const new_item = new Test(request.body)

    new_item.save()
        .then(result => response.status(200).json({ result }))
        .catch(error => response.status(400).json({ error }))
})

// Make a get request to test route
router.get('/test-job-route', (request, response) => {
    Job.find()
        .populate('category creator_id skills')
        .limit(10)
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error }))
})

module.exports = router;
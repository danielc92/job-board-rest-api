const Job = require('../models/job.model');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// Retrieve list of jobs with few fields to reduce network bandwidth
router.get('/list', (request, response) => {

    Job.find()
        .select('title')
        .sort({ createdAt: -1})
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error }))
})

// Make a post request to test route
router.post('/', authMiddleware, (request, response) => {

    const new_item = new Job(request.body)

    new_item.save()
        .then(result => response.status(200).json({ result }))
        .catch(error => response.status(400).json({ error }))
})



module.exports = router;
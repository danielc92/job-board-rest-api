const Job = require('../models/job.model');
const mongoosePaginate = require('mongoose-paginate-v2');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// Retrieve list of jobs with few fields to reduce network bandwidth
router.get('/list', (request, response) => {
    const { title, location, page } = request.query;
    let query = {};

    // Build the query from query string parameters.
    if (title) {
        query = { ...query, title }
    }

    if(location) {
        query = { ...query, location_string: location }
    }

    // Build options
    let options = {
        select: 'title job_summary salary_range_low salary_range_high',
        sort: { createdAt: 'desc' },
        limit: 5,
    };

    // Append page number
    if (page) {
        options = { ...options, page }
    }

    Job.paginate(query, options)
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
const Job = require('../models/job.model');
const mongoosePaginate = require('mongoose-paginate-v2');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const select = require('../constants/select');

/*
Get job detail (Seeker)
*/
router.get('/', (request, response) => {
    const { id } = request.query;

    if (!id) return response.status(400).json({error: "Job id field is required."})

    // Minus unwanted fields
    Job.findById(id)
    .select(select.GET_JOB) 
    .then(results => response.status(200).json({ results }))
    .catch(error => response.status(400).json({ error }))
})

/*
Get job list (Seeker)
*/
router.get('/list', (request, response) => {
    console.log(request.query, 'REQ QUERY')
    const { title, location_string, category, page } = request.query;
    let query = {};

    // Build the query from query string parameters.
    if (category) {
        query = { ...query, category }
    }

    if (title) {
        query = { 
            ...query, 
            "$text": { 
                "$search" : title 
            } 
        }
    }

    if(location_string) {
        query = { 
            ...query, 
            location_string }
    }

    // Build options
    let options = {
        select: select.GET_JOB_LIST_SEEKER,
        sort: { createdAt: 'desc' },
        limit: 5,
    };

    // Append page number
    if (page) {
        options = { ...options, page }
    }
    console.log("FETCHING JOBS LIST with", query, options)
    Job.paginate(query, options)
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error }))
})

// Retrieve list of jobs with few fields to reduce network bandwidth
router.get('/list/employer', authMiddleware, (request, response) => {
    const { page } = request.query;
    const { _id } = request.user;
    // const { _id } = request.user;

    let query = {
        creator_id: _id
    };

    // Build options
    let options = {
        select: select.GET_JOB_LIST_EMPLOYER,
        sort: { createdAt: 'desc' },
        limit: 10,
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

// Update job status
router.patch('/', authMiddleware, (request, response) => {
    // Store query
    const { job_id } = request.query;
    
    // Check if params exist
    if (!job_id) return response.status(400).json({ error: "Missing job_id field."})
    
    const { _id } = request.user;

    query = { _id: job_id, creator_id: _id }

    update = { open: false }

    const options = { runValidators: true }
    Job.findOneAndUpdate(query, update, options)
    .then(result => response.status(200).json({ message: 'Successfully updated job status to closed.' }))
    .catch(error => response.status(400).json({ error }))
})



module.exports = router;
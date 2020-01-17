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
    const { title, location_string, page } = request.query;
    let query = {};

    // Build the query from query string parameters.
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

    Job.paginate(query, options)
        .then(results => response.status(200).json({ results }))
        .catch(error => response.status(400).json({ error }))
})

// Retrieve list of jobs with few fields to reduce network bandwidth
router.get('/list/employer', authMiddleware, (request, response) => {
    const { page, creator_id } = request.query;
    // const { _id } = request.user;

    if (!creator_id) return response.status(400).json({ error: 'creator_id field must be supplied.'})
    let query = {
        creator_id
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
    const { creator_id, job_id } = request.query;
    
    // Check if params exist
    if (!job_id) return response.status(400).json({ error: "Missing job_id field."})
    if (!creator_id) return response.status(400).json({ error: "Missing creator_id field."})
    
    // Check if out of scope
    const scopeMatch = (request.user._id === creator_id);
    if (!scopeMatch) return response.status(400).json({ error: "This job does not belong to you."})

    query = { _id: job_id, creator_id }
    update = { open: false }
    const options = { runValidators: true }
    Job.findOneAndUpdate(query, update, options)
    .then(result => response.status(200).json({ message: 'Successfully updated job status to closed.' }))
    .catch(error => response.status(400).json({ error }))
})



module.exports = router;